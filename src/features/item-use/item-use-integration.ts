import type { AutomationDefinition } from "../../core/automation/automation-definition";
import type { DamageApplicationAdapter } from "../../core/damage/damage-adapter";
import type {
  DamageApplicationFailure,
  DamageApplicationResult,
} from "../../core/damage/damage-application";
import { executeAutomationResourceOperation } from "../../core/automation/automation-resource-executor";
import type { AutomationRunFailure } from "../../core/automation/automation-runner";
import { ModuleLogger } from "../../core/module-logger";
import type { RitualCostProvider } from "../../core/rituals/ritual-cost-provider";
import type {
  ResourceEngine,
  ResourceOperationResult,
} from "../../core/resources/resource-engine";
import { createWorkflowDebugSnapshot } from "../../core/workflow/workflow-debug-snapshot";
import type { WorkflowContext } from "../../core/workflow/workflow-context";
import type { WorkflowEngine } from "../../core/workflow/workflow-engine";
import type { DebugOutputService } from "../../debug/output/debug-output-service";
import { readAutomationDefinition } from "../automation/automation-flag-reader";
import { neutralizeAutomatedItemInlineRolls } from "../chat/inline-roll-sanitizer";
import type {
  ConditionEngine,
  ApplyConditionResult,
} from "../conditions/condition-engine";
import {
  type AssistedConditionAction,
  type AssistedRitualAction,
  RitualAssistedWorkflow,
} from "../rituals/ritual-assisted-workflow";
import {
  findPersistedPromptByPendingId,
  markPersistedChoiceGroupAlternativesAsResolved,
  markPersistedPromptAsExecutedById,
  registerCompletedItemUseAutomationCard,
  registerItemUseAutomationPromptRenderer,
  registerPendingItemUseAutomationPrompt,
  unregisterPendingItemUseAutomationPrompt,
  type PersistedResourceActionPayload,
} from "./item-use-automation-prompt";
import type { AutomationExecutionMode } from "./item-use-execution-mode";
import {
  getItemUseSettings,
  type ItemUseSettingsSnapshot,
} from "./item-use-settings";
import type {
  ItemUseContext,
  ItemUseIntegrationAttempt,
  ItemUseSourceStrategy,
  ItemUseSourceStrategyStatus,
} from "./item-use-context";

const DUPLICATE_WINDOW_MS = 1_000;

export type ItemUseIntegrationStatus = {
  settings: ItemUseSettingsSnapshot;
  strategies: ItemUseSourceStrategyStatus[];
  lastAttempt: ItemUseIntegrationAttempt | null;
  pendingPromptCount: number;
};

type PendingWorkflowExecution = {
  kind: "workflow";
  id: string;
  definition: AutomationDefinition;
  context: ItemUseContext;
  mode: Extract<AutomationExecutionMode, "ask">;
  createdAt: number;
};

type PendingAssistedActionExecution = {
  kind: "assisted-action";
  id: string;
  action: AssistedRitualAction;
  context: ItemUseContext;
  workflowContext: WorkflowContext;
  createdAt: number;
};

type PendingAutomationExecution =
  PendingWorkflowExecution | PendingAssistedActionExecution;

type AssistedActionExecutionResult =
  | { ok: true; executedLabel?: string }
  | { ok: false };

export class ItemUseIntegration {
  private readonly strategies: ItemUseSourceStrategy[] = [];
  private readonly recentExecutionKeys = new Map<string, number>();
  private readonly pendingExecutions = new Map<
    string,
    PendingAutomationExecution
  >();
  private readonly ritualAssistant: RitualAssistedWorkflow;
  private lastAttempt: ItemUseIntegrationAttempt | null = null;
  private promptRendererRegistered = false;

  constructor(
    private readonly workflow: WorkflowEngine,
    private readonly resources: ResourceEngine,
    ritualCosts: RitualCostProvider,
    private readonly damage: DamageApplicationAdapter,
    private readonly conditions: ConditionEngine,
    private readonly debugOutput: DebugOutputService,
  ) {
    this.ritualAssistant = new RitualAssistedWorkflow(
      workflow,
      resources,
      ritualCosts,
    );
  }

  addStrategy(strategy: ItemUseSourceStrategy): void {
    this.strategies.push(strategy);
  }

  registerStrategies(): void {
    for (const strategy of this.strategies) {
      strategy.register();
    }

    this.registerPromptRenderer();
  }

  status(): ItemUseIntegrationStatus {
    return {
      settings: getItemUseSettings(),
      strategies: this.strategies.map((strategy) => strategy.status()),
      lastAttempt: this.lastAttempt ? { ...this.lastAttempt } : null,
      pendingPromptCount: this.pendingExecutions.size,
    };
  }

  async handleItemUsed(context: ItemUseContext): Promise<void> {
    const settings = getItemUseSettings();

    if (settings.executionMode === "disabled") {
      this.setAttempt(context, "skipped", "execution-mode-disabled");
      return;
    }

    const definition = readAutomationDefinition(context.item);

    if (!definition.ok) {
      if (
        definition.error.reason === "missing-automation" &&
        isRitualItem(context.item) &&
        settings.executionMode === "ask"
      ) {
        await this.handleGenericRitual(context);
        return;
      }

      const status =
        definition.error.reason === "missing-automation" ? "ignored" : "failed";
      this.setAttempt(context, status, definition.error.reason);

      if (definition.error.reason === "invalid-automation") {
        this.debugOutput.warn({
          title: "Automação de item inválida",
          message: definition.error.message,
          data: definition.error,
        });
      }

      return;
    }

    await neutralizeAutomatedItemInlineRolls(context);

    if (!context.actor) {
      this.setAttempt(context, "failed", "missing-actor");
      this.debugOutput.warn({
        title: "Uso de item sem ator",
        message: `Não foi possível resolver o ator para ${context.item.name}.`,
        data: createAttemptSnapshot(context, "failed", "missing-actor"),
      });
      return;
    }

    if (this.isDuplicate(context)) {
      this.setAttempt(context, "skipped", "duplicate-window");
      return;
    }

    this.markExecution(context);

    switch (settings.executionMode) {
      case "ask":
        await this.handleAskMode(context, definition.value);
        return;
      case "automatic":
        await this.executeAutomation(context, definition.value, "automatic");
        return;
    }
  }

  async executePendingAutomation(pendingId: string): Promise<boolean> {
    const pending = this.pendingExecutions.get(pendingId);

    if (!pending) {
      return this.executePersistedPendingAutomation(pendingId);
    }

    if (pending.kind === "workflow") {
      this.pendingExecutions.delete(pendingId);
      await unregisterPendingItemUseAutomationPrompt(pendingId);
      await this.executeAutomation(
        pending.context,
        pending.definition,
        pending.mode,
      );
      return true;
    }

    const executed = await this.executeAssistedAction(
      pending.action,
      pending.workflowContext,
    );

    if (!executed.ok) return false;

    this.pendingExecutions.delete(pendingId);
    await unregisterPendingItemUseAutomationPrompt(
      pendingId,
      executed.executedLabel,
    );
    await this.resolveAlternativeActions(pending);
    this.setAttempt(pending.context, "completed");

    return true;
  }

  private async executePersistedPendingAutomation(
    pendingId: string,
  ): Promise<boolean> {
    const lookup = findPersistedPromptByPendingId(pendingId);

    if (!lookup?.prompt.actionPayload) {
      ui.notifications?.warn(
        "Paranormal Toolkit: automação pendente não encontrada ou já executada.",
      );
      return false;
    }

    const action = lookup.prompt.actionPayload;
    const actor = resolvePersistedActionActor(action);

    if (!actor) {
      ui.notifications?.warn(
        `Paranormal Toolkit: não consegui encontrar ${action.actorName} para aplicar a ação persistida.`,
      );
      return false;
    }

    const result = await executeAutomationResourceOperation(
      this.resources,
      actor,
      action.resource,
      action.operation,
      action.amount,
    );

    if (!result.ok) {
      this.handleResourceActionFailure(result);
      return false;
    }

    await markPersistedPromptAsExecutedById(pendingId);
    await markPersistedChoiceGroupAlternativesAsResolved(
      pendingId,
      lookup.prompt.choiceGroupId,
      lookup.prompt.skippedLabel ?? "✓ Outra opção escolhida",
    );

    return true;
  }

  private registerPromptRenderer(): void {
    if (this.promptRendererRegistered) return;

    registerItemUseAutomationPromptRenderer((pendingId) =>
      this.executePendingAutomation(pendingId),
    );
    this.promptRendererRegistered = true;
  }

  private async handleAskMode(
    context: ItemUseContext,
    definition: AutomationDefinition,
  ): Promise<void> {
    if (this.ritualAssistant.canHandle(context, definition)) {
      await this.handleAssistedRitual(context, definition);
      return;
    }

    await this.createPendingWorkflowPrompt(context, definition);
  }

  private async handleGenericRitual(context: ItemUseContext): Promise<void> {
    await neutralizeAutomatedItemInlineRolls(context);

    if (!context.actor) {
      this.setAttempt(context, "failed", "missing-actor");
      this.debugOutput.warn({
        title: "Conjuração de ritual sem ator",
        message: `Não foi possível resolver o ator para ${context.item.name}.`,
        data: createAttemptSnapshot(context, "failed", "missing-actor"),
      });
      return;
    }

    if (this.isDuplicate(context)) {
      this.setAttempt(context, "skipped", "duplicate-window");
      return;
    }

    this.markExecution(context);
    await this.handleAssistedRitual(
      context,
      createGenericRitualDefinition(context.item),
    );
  }

  private async handleAssistedRitual(
    context: ItemUseContext,
    definition: AutomationDefinition,
  ): Promise<void> {
    this.setAttempt(context, "running", "ritual-assisted-cast");

    const result = await this.ritualAssistant.run(context, definition);

    switch (result.status) {
      case "cancelled":
        this.setAttempt(context, "skipped", "ritual-cast-cancelled");
        return;
      case "failed":
        this.setAttempt(context, "failed", result.reason);
        this.debugOutput.warn({
          title: "Conjuração assistida falhou",
          message: result.message,
          data: result.cause ?? result,
        });
        ui.notifications?.warn(`Paranormal Toolkit: ${result.message}`);
        return;
      case "completed-without-actions":
        await this.registerCompletedRitualCard(context, result.summaryLines);
        this.setAttempt(context, "completed", "ritual-assisted-no-actions");
        ModuleLogger.info(
          "Ritual assistido concluído sem ações pendentes.",
          createWorkflowDebugSnapshot(result.workflowContext),
        );
        return;
      case "ready":
        await this.registerAssistedActions(
          context,
          result.workflowContext,
          result.actions,
          result.summaryLines,
        );
        return;
    }
  }

  private async executeAssistedAction(
    action: AssistedRitualAction,
    workflowContext: WorkflowContext,
  ): Promise<AssistedActionExecutionResult> {
    if (action.kind === "resource-operation") {
      const result = await this.ritualAssistant.applyAction(action);

      if (!result.ok) {
        this.handleResourceActionFailure(result);
        return { ok: false };
      }

      workflowContext.resourceTransactions.push(result.value);
      return { ok: true };
    }

    if (action.kind === "damage-application") {
      const result = await this.damage.applyDamage({
        actor: action.actor,
        instances: action.instances,
        source: action.source,
        originUuid: action.originUuid,
      });

      if (!result.ok) {
        this.handleDamageActionFailure(result.error);
        return { ok: false };
      }

      recordDamageApplication(workflowContext, result.value);
      await whisperDamageApplicationResultToGms(result.value);
      return {
        ok: true,
        executedLabel: createDamageApplicationExecutedLabel(result.value),
      };
    }

    const result = await this.conditions.applyCondition({
      actor: action.actor,
      conditionId: action.conditionId,
      duration: action.duration,
      originUuid: action.originUuid,
      source: action.source ?? "item-use.condition-action",
    });

    if (!result.ok) {
      this.handleConditionActionFailure(result);
      return { ok: false };
    }

    if (result.value.warning) {
      ui.notifications?.warn(`Paranormal Toolkit: ${result.value.warning}`);
    }

    return { ok: true };
  }

  private async resolveAlternativeActions(
    selected: PendingAssistedActionExecution,
  ): Promise<void> {
    const choiceGroupId = getActionChoiceGroupId(selected.action);

    if (!choiceGroupId) return;

    const alternativeEntries = Array.from(
      this.pendingExecutions.entries(),
    ).filter(([, pending]) => {
      return (
        pending.kind === "assisted-action" &&
        getActionChoiceGroupId(pending.action) === choiceGroupId
      );
    });

    for (const [alternativeId, alternative] of alternativeEntries) {
      if (alternative.kind !== "assisted-action") continue;
      if (alternative.id === selected.id) continue;

      this.pendingExecutions.delete(alternativeId);
      await unregisterPendingItemUseAutomationPrompt(
        alternativeId,
        getActionChoiceGroupResolvedLabel(alternative.action) ??
          "✓ Outra opção escolhida",
      );
    }
  }

  private async registerCompletedRitualCard(
    context: ItemUseContext,
    summaryLines: string[],
  ): Promise<void> {
    const pendingId = createPendingExecutionId();

    await registerCompletedItemUseAutomationCard({
      pendingId,
      context,
      mode: "ask",
      title: "Paranormal Toolkit · Ritual",
      buttonLabel: "Ritual conjurado",
      executedLabel: "✓ Ritual conjurado",
      actionSectionId: "ritual-log",
      actionSectionTitle: "Registro",
      summaryLines,
    });
  }

  private async registerAssistedActions(
    context: ItemUseContext,
    workflowContext: WorkflowContext,
    actions: AssistedRitualAction[],
    summaryLines: string[],
  ): Promise<void> {
    let firstPendingId: string | undefined;

    for (const action of actions) {
      const pendingId = createPendingExecutionId();
      firstPendingId ??= pendingId;

      this.pendingExecutions.set(pendingId, {
        kind: "assisted-action",
        id: pendingId,
        action,
        context,
        workflowContext,
        createdAt: Date.now(),
      });

      await registerPendingItemUseAutomationPrompt({
        pendingId,
        context,
        mode: "ask",
        title: "Paranormal Toolkit · Ritual",
        buttonLabel: action.label,
        executedLabel: action.executedLabel,
        choiceGroupId: getActionChoiceGroupId(action),
        skippedLabel: getActionChoiceGroupResolvedLabel(action),
        actionSectionId: action.actionSectionId,
        actionSectionTitle: action.actionSectionTitle,
        summaryLines,
        resistanceTargetActor: action.actor,
        resistanceTargetActorId: action.actor.id ?? null,
        resistanceTargetName: action.actorName,
        actionPayload: createPromptActionPayload(action),
      });
    }

    this.setAttempt(
      context,
      "pending",
      "ritual-assisted-actions",
      firstPendingId,
    );
    ModuleLogger.info(
      "Ritual assistido preparado com ações pendentes.",
      createWorkflowDebugSnapshot(workflowContext),
    );
  }

  private async createPendingWorkflowPrompt(
    context: ItemUseContext,
    definition: AutomationDefinition,
  ): Promise<void> {
    const pendingId = createPendingExecutionId();

    this.pendingExecutions.set(pendingId, {
      kind: "workflow",
      id: pendingId,
      definition,
      context,
      mode: "ask",
      createdAt: Date.now(),
    });

    await registerPendingItemUseAutomationPrompt({
      pendingId,
      context,
      mode: "ask",
      buttonLabel: "Aplicar automação",
      executedLabel: "✓ Automação aplicada",
    });

    this.setAttempt(context, "pending", "execution-mode-ask", pendingId);
  }

  private async executeAutomation(
    context: ItemUseContext,
    definition: AutomationDefinition,
    executionMode: AutomationExecutionMode,
  ): Promise<void> {
    this.setAttempt(context, "running");

    const result = await this.workflow.runAutomation(definition, {
      sourceActor: context.actor as Actor,
      sourceToken: context.token,
      item: context.item,
      targets: context.targets,
      flags: {
        itemUse: {
          source: context.source,
          executionMode,
        },
      },
    });

    if (!result.ok) {
      this.setAttempt(context, "failed", result.error.reason);
      this.handleAutomationFailure(result.error);
      return;
    }

    this.setAttempt(context, "completed");
    ModuleLogger.info(
      "Automação executada por uso normal de item.",
      createWorkflowDebugSnapshot(result.value.context),
    );
  }

  private handleAutomationFailure(failure: AutomationRunFailure): void {
    const message = `Automação por uso de item falhou: ${failure.message}`;

    if (failure.reason === "resource-operation-failed") {
      ModuleLogger.warn(message, failure.cause ?? failure);
      ui.notifications?.warn(`Paranormal Toolkit: ${failure.message}`);
      return;
    }

    if (failure.reason === "chat-card-failed") {
      ModuleLogger.error(message, failure.cause ?? failure);
      ui.notifications?.error(`Paranormal Toolkit: ${failure.message}`);
      return;
    }

    ModuleLogger.warn(message, failure);
    ui.notifications?.warn(`Paranormal Toolkit: ${failure.message}`);
  }

  private handleResourceActionFailure(
    result: Extract<ResourceOperationResult, { ok: false }>,
  ): void {
    ModuleLogger.warn(
      `Ação assistida falhou: ${result.error.message}`,
      result.error,
    );
    ui.notifications?.warn(`Paranormal Toolkit: ${result.error.message}`);
  }

  private handleDamageActionFailure(error: DamageApplicationFailure): void {
    ModuleLogger.warn(`Ação assistida de dano falhou: ${error.message}`, error);
    ui.notifications?.warn(`Paranormal Toolkit: ${error.message}`);
  }

  private handleConditionActionFailure(
    result: Extract<ApplyConditionResult, { ok: false }>,
  ): void {
    ModuleLogger.warn(
      `Ação assistida de condição falhou: ${result.error.message}`,
      result.error,
    );
    ui.notifications?.warn(`Paranormal Toolkit: ${result.error.message}`);
  }

  private isDuplicate(context: ItemUseContext): boolean {
    const now = Date.now();
    const key = createExecutionKey(context);

    for (const [entryKey, timestamp] of this.recentExecutionKeys.entries()) {
      if (now - timestamp > DUPLICATE_WINDOW_MS) {
        this.recentExecutionKeys.delete(entryKey);
      }
    }

    const lastTimestamp = this.recentExecutionKeys.get(key);
    return (
      lastTimestamp !== undefined && now - lastTimestamp <= DUPLICATE_WINDOW_MS
    );
  }

  private markExecution(context: ItemUseContext): void {
    this.recentExecutionKeys.set(createExecutionKey(context), Date.now());
  }

  private setAttempt(
    context: ItemUseContext,
    status: ItemUseIntegrationAttempt["status"],
    reason?: string,
    pendingId?: string,
  ): void {
    this.lastAttempt = createAttemptSnapshot(
      context,
      status,
      reason,
      pendingId,
    );
  }
}


async function whisperDamageApplicationResultToGms(
  result: DamageApplicationResult,
): Promise<void> {
  const whisper = getGmUserIds();
  if (whisper.length === 0) return;

  try {
    await ChatMessage.create({
      speaker: ChatMessage.getSpeaker({ actor: result.actor }),
      whisper,
      content: createDamageApplicationWhisperContent(result),
    });
  } catch (cause) {
    ModuleLogger.warn("Não foi possível criar o resumo de dano para o GM.", cause);
  }
}

function createDamageApplicationExecutedLabel(
  result: DamageApplicationResult,
): string {
  const blocked = result.totalBlocked > 0 ? ` (RD ${result.totalBlocked})` : "";
  return `✓ ${result.totalFinalDamage} PV aplicado${blocked}`;
}

function createDamageApplicationWhisperContent(
  result: DamageApplicationResult,
): string {
  const rows = result.instances
    .map((instance) => {
      const blocked = instance.blocked > 0 ? ` <span class="muted">(RD ${instance.blocked})</span>` : "";
      return `<li><strong>${escapeHtml(instance.label ?? "Dano")}</strong>: ${instance.inputAmount} → ${instance.finalDamage} PV${blocked}</li>`;
    })
    .join("");

  const totalRows = result.instances.length > 1
    ? `<li><strong>Total aplicado</strong>: ${result.totalFinalDamage} PV</li>`
    : "";
  const blockedRow = result.totalBlocked > 0
    ? `<li><strong>RD bloqueou</strong>: ${result.totalBlocked}</li>`
    : "";
  const pvRow = createDamageApplicationPvRow(result);
  const conditionsRow = result.conditions.length > 0
    ? `<li><strong>Condições sugeridas</strong>: ${escapeHtml(result.conditions.join(", "))}</li>`
    : "";

  return `
    <div class="paranormal-toolkit-damage-feedback">
      <strong>Paranormal Toolkit</strong>
      <p>Dano aplicado em <strong>${escapeHtml(result.actorName)}</strong></p>
      <ul>
        ${rows}
        ${totalRows}
        ${blockedRow}
        ${pvRow}
        ${conditionsRow}
      </ul>
    </div>
  `;
}

function createDamageApplicationPvRow(result: DamageApplicationResult): string {
  const snapshot = readActorPvSnapshot(result.actor);
  const current = result.newPV ?? snapshot?.value ?? null;
  const max = snapshot?.max ?? null;

  if (current === null) return "";

  const value = max === null ? `${current}` : `${current}/${max}`;
  return `<li><strong>PV atual</strong>: ${escapeHtml(value)}</li>`;
}

function readActorPvSnapshot(actor: Actor): { value: number; max: number | null } | null {
  const system = actor.system as {
    PV?: { value?: unknown; max?: unknown };
    attributes?: { hp?: { value?: unknown; max?: unknown } };
  };

  const resource = actor.type === "threat" ? system.attributes?.hp : system.PV;
  const value = readFiniteNumber(resource?.value);

  if (value === null) return null;

  return {
    value,
    max: readFiniteNumber(resource?.max),
  };
}

function readFiniteNumber(value: unknown): number | null {
  return typeof value === "number" && Number.isFinite(value) ? value : null;
}

function getGmUserIds(): string[] {
  return game.users
    .filter((user) => user.isGM)
    .map((user) => user.id)
    .filter((id): id is string => typeof id === "string" && id.length > 0);
}

function escapeHtml(value: string): string {
  const htmlEscapes: Record<string, string> = {
    "&": "&amp;",
    "<": "&lt;",
    ">": "&gt;",
    '"': "&quot;",
    "'": "&#39;",
  };

  return value.replace(/[&<>"']/gu, (char) => htmlEscapes[char] ?? char);
}

function getActionChoiceGroupId(action: AssistedRitualAction): string | null {
  if (
    action.kind !== "resource-operation" &&
    action.kind !== "damage-application"
  )
    return null;
  return action.choiceGroupId ?? null;
}

function getActionChoiceGroupResolvedLabel(
  action: AssistedRitualAction,
): string | null {
  if (
    action.kind !== "resource-operation" &&
    action.kind !== "damage-application"
  )
    return null;
  return action.choiceGroupResolvedLabel ?? null;
}

function recordDamageApplication(
  context: WorkflowContext,
  result: DamageApplicationResult,
): void {
  for (const instance of result.instances) {
    context.damageInstances.push({
      id: instance.id,
      source: "ritual",
      sourceId: result.originUuid,
      sourceName: result.source ?? "Dano assistido",
      targetActorId: result.actorId,
      targetActorName: result.actorName,
      rollId: instance.sourceRollId ?? undefined,
      damageType: instance.damageType ?? instance.systemDamageType ?? undefined,
      rawAmount: instance.inputAmount,
      resistance: instance.blocked > 0 ? instance.blocked : undefined,
      finalAmount: instance.finalDamage,
      appliedAmount: instance.finalDamage,
      tags: ["ordem-apply-damage"],
    });
  }
}

function isRitualItem(item: Item): boolean {
  return item.type === "ritual";
}

function createGenericRitualDefinition(item: Item): AutomationDefinition {
  return {
    version: 1,
    label: `Conjuração de ${item.name ?? "ritual"}`,
    steps: [{ type: "spendRitualCost" }],
  };
}

function createPromptActionPayload(
  action: AssistedRitualAction,
): PersistedResourceActionPayload | null {
  // Não persistimos ação de dano como resource-operation porque isso perderia
  // damageType/RD e aplicaria PV manualmente após reload. Enquanto o payload
  // persistido não suportar DamageApplication, o clique em sessão viva usa
  // pendingExecutions e continua passando pelo DamageAdapter.
  if (action.kind === "damage-application") return null;

  if (action.kind !== "resource-operation") return null;

  return {
    kind: "resource-operation",
    actorId: action.actor.id ?? null,
    actorUuid: action.actor.uuid ?? null,
    actorName: action.actorName,
    resource: action.resource,
    operation: action.operation,
    amount: action.amount,
  };
}

function resolvePersistedActionActor(
  action: PersistedResourceActionPayload,
): Actor | null {
  const byUuid = action.actorUuid ? fromUuidSyncSafe(action.actorUuid) : null;
  if (isActorLike(byUuid)) return byUuid;

  const byId = action.actorId ? resolveActorById(action.actorId) : null;
  if (byId) return byId;

  return resolveActorByName(action.actorName);
}

function fromUuidSyncSafe(uuid: string): unknown {
  const fromUuidSync = (
    globalThis as { fromUuidSync?: (uuid: string) => unknown }
  ).fromUuidSync;
  if (typeof fromUuidSync !== "function") return null;

  try {
    return fromUuidSync(uuid);
  } catch {
    return null;
  }
}

function resolveActorById(actorId: string): Actor | null {
  const actors = game.actors as { get?: (id: string) => unknown } | undefined;
  const actor = actors?.get?.(actorId);
  if (isActorLike(actor)) return actor;

  for (const token of getCanvasTokens()) {
    const tokenActor = resolveTokenActor(token);
    if (tokenActor?.id === actorId) return tokenActor;
  }

  return null;
}

function resolveActorByName(actorName: string): Actor | null {
  const normalizedName = normalizeLookupName(actorName);
  if (!normalizedName) return null;

  for (const token of getCanvasTokens()) {
    const tokenName = getTokenName(token);
    if (normalizeLookupName(tokenName) === normalizedName) {
      const actor = resolveTokenActor(token);
      if (actor) return actor;
    }
  }

  const actors = game.actors as
    { find?: (predicate: (actor: unknown) => boolean) => unknown } | undefined;
  const actor = actors?.find?.(
    (candidate) =>
      isActorLike(candidate) &&
      normalizeLookupName(candidate.name) === normalizedName,
  );

  return isActorLike(actor) ? actor : null;
}

function getCanvasTokens(): unknown[] {
  const placeables = (
    canvas as { tokens?: { placeables?: unknown[] } } | undefined
  )?.tokens?.placeables;
  return Array.isArray(placeables) ? placeables : [];
}

function getTokenName(token: unknown): string | null {
  if (!token || typeof token !== "object") return null;

  const directName = (token as { name?: unknown }).name;
  if (typeof directName === "string") return directName;

  const documentName = (token as { document?: { name?: unknown } }).document
    ?.name;
  if (typeof documentName === "string") return documentName;

  const actor = resolveTokenActor(token);
  return actor?.name ?? null;
}

function resolveTokenActor(value: unknown): Actor | null {
  if (!value || typeof value !== "object") return null;

  const actor = (value as { actor?: unknown }).actor;
  if (isActorLike(actor)) return actor;

  const documentActor = (value as { document?: { actor?: unknown } }).document
    ?.actor;
  return isActorLike(documentActor) ? documentActor : null;
}

function normalizeLookupName(value: string | null | undefined): string | null {
  const normalized = value?.trim().toLocaleLowerCase();
  return normalized && normalized.length > 0 ? normalized : null;
}

function isActorLike(value: unknown): value is Actor {
  return Boolean(value && typeof value === "object" && "system" in value);
}

function createAttemptSnapshot(
  context: ItemUseContext,
  status: ItemUseIntegrationAttempt["status"],
  reason?: string,
  pendingId?: string,
): ItemUseIntegrationAttempt {
  return {
    source: context.source,
    status,
    reason,
    pendingId,
    itemId: context.item.id ?? null,
    itemName: context.item.name ?? "Item sem nome",
    itemType: context.item.type ?? "unknown",
    itemUuid: context.item.uuid ?? null,
    actorId: context.actor?.id ?? null,
    actorName: context.actor?.name ?? null,
    targetCount: context.targets.length,
    timestamp: Date.now(),
  };
}

function createExecutionKey(context: ItemUseContext): string {
  const actorKey = context.actor?.id ?? "no-actor";
  const itemKey =
    context.item.uuid ?? context.item.id ?? context.item.name ?? "unknown-item";
  return `${actorKey}:${itemKey}`;
}

function createPendingExecutionId(): string {
  const cryptoObject = globalThis.crypto as
    { randomUUID?: () => string } | undefined;

  if (cryptoObject?.randomUUID) {
    return cryptoObject.randomUUID();
  }

  return `pending-${Date.now()}-${Math.random().toString(36).slice(2)}`;
}
