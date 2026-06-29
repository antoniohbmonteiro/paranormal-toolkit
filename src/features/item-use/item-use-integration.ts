import type { AutomationDefinition } from "../../core/automation/automation-definition";
import { executeAutomationResourceOperation } from "../../core/automation/automation-resource-executor";
import type { AutomationRunFailure } from "../../core/automation/automation-runner";
import { ModuleLogger } from "../../core/module-logger";
import type { RitualCostProvider } from "../../core/rituals/ritual-cost-provider";
import type { ResourceEngine, ResourceOperationResult } from "../../core/resources/resource-engine";
import { createWorkflowDebugSnapshot } from "../../core/workflow/workflow-debug-snapshot";
import type { WorkflowContext } from "../../core/workflow/workflow-context";
import type { WorkflowEngine } from "../../core/workflow/workflow-engine";
import type { DebugOutputService } from "../../debug/output/debug-output-service";
import { readAutomationDefinition } from "../automation/automation-flag-reader";
import { neutralizeAutomatedItemInlineRolls } from "../chat/inline-roll-sanitizer";
import { type AssistedResourceAction, RitualAssistedWorkflow } from "../rituals/ritual-assisted-workflow";
import {
  findPersistedPromptByPendingId,
  markPersistedChoiceGroupAlternativesAsResolved,
  markPersistedPromptAsExecutedById,
  registerItemUseAutomationPromptRenderer,
  registerPendingItemUseAutomationPrompt,
  unregisterPendingItemUseAutomationPrompt,
  type PersistedResourceActionPayload
} from "./item-use-automation-prompt";
import type { AutomationExecutionMode } from "./item-use-execution-mode";
import { getItemUseSettings, type ItemUseSettingsSnapshot } from "./item-use-settings";
import type {
  ItemUseContext,
  ItemUseIntegrationAttempt,
  ItemUseSourceStrategy,
  ItemUseSourceStrategyStatus
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

type PendingResourceActionExecution = {
  kind: "resource-action";
  id: string;
  action: AssistedResourceAction;
  context: ItemUseContext;
  workflowContext: WorkflowContext;
  createdAt: number;
};

type PendingAutomationExecution = PendingWorkflowExecution | PendingResourceActionExecution;

export class ItemUseIntegration {
  private readonly strategies: ItemUseSourceStrategy[] = [];
  private readonly recentExecutionKeys = new Map<string, number>();
  private readonly pendingExecutions = new Map<string, PendingAutomationExecution>();
  private readonly ritualAssistant: RitualAssistedWorkflow;
  private lastAttempt: ItemUseIntegrationAttempt | null = null;
  private promptRendererRegistered = false;

  constructor(
    private readonly workflow: WorkflowEngine,
    private readonly resources: ResourceEngine,
    ritualCosts: RitualCostProvider,
    private readonly debugOutput: DebugOutputService
  ) {
    this.ritualAssistant = new RitualAssistedWorkflow(workflow, resources, ritualCosts);
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
      pendingPromptCount: this.pendingExecutions.size
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
      const status = definition.error.reason === "missing-automation" ? "ignored" : "failed";
      this.setAttempt(context, status, definition.error.reason);

      if (definition.error.reason === "invalid-automation") {
        this.debugOutput.warn({
          title: "Automação de item inválida",
          message: definition.error.message,
          data: definition.error
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
        data: createAttemptSnapshot(context, "failed", "missing-actor")
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
      await this.executeAutomation(pending.context, pending.definition, pending.mode);
      return true;
    }

    const result = await this.ritualAssistant.applyAction(pending.action);

    if (!result.ok) {
      this.handleResourceActionFailure(result);
      return false;
    }

    pending.workflowContext.resourceTransactions.push(result.value);
    this.pendingExecutions.delete(pendingId);
    await unregisterPendingItemUseAutomationPrompt(pendingId);
    await this.resolveAlternativeResourceActions(pending);
    this.setAttempt(pending.context, "completed");

    return true;
  }

  private async executePersistedPendingAutomation(pendingId: string): Promise<boolean> {
    const lookup = findPersistedPromptByPendingId(pendingId);

    if (!lookup?.prompt.actionPayload) {
      ui.notifications?.warn("Paranormal Toolkit: automação pendente não encontrada ou já executada.");
      return false;
    }

    const action = lookup.prompt.actionPayload;
    const actor = resolvePersistedActionActor(action);

    if (!actor) {
      ui.notifications?.warn(`Paranormal Toolkit: não consegui encontrar ${action.actorName} para aplicar a ação persistida.`);
      return false;
    }

    const result = await executeAutomationResourceOperation(this.resources, actor, action.resource, action.operation, action.amount);

    if (!result.ok) {
      this.handleResourceActionFailure(result);
      return false;
    }

    await markPersistedPromptAsExecutedById(pendingId);
    await markPersistedChoiceGroupAlternativesAsResolved(
      pendingId,
      lookup.prompt.choiceGroupId,
      lookup.prompt.skippedLabel ?? "✓ Outra opção escolhida"
    );

    return true;
  }

  private registerPromptRenderer(): void {
    if (this.promptRendererRegistered) return;

    registerItemUseAutomationPromptRenderer((pendingId) => this.executePendingAutomation(pendingId));
    this.promptRendererRegistered = true;
  }

  private async handleAskMode(context: ItemUseContext, definition: AutomationDefinition): Promise<void> {
    if (this.ritualAssistant.canHandle(context, definition)) {
      await this.handleAssistedRitual(context, definition);
      return;
    }

    await this.createPendingWorkflowPrompt(context, definition);
  }

  private async handleAssistedRitual(context: ItemUseContext, definition: AutomationDefinition): Promise<void> {
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
          data: result.cause ?? result
        });
        ui.notifications?.warn(`Paranormal Toolkit: ${result.message}`);
        return;
      case "completed-without-actions":
        this.setAttempt(context, "completed", "ritual-assisted-no-actions");
        ModuleLogger.info("Ritual assistido concluído sem ações pendentes.", createWorkflowDebugSnapshot(result.workflowContext));
        return;
      case "ready":
        await this.registerAssistedResourceActions(context, result.workflowContext, result.actions, result.summaryLines);
        return;
    }
  }

  private async resolveAlternativeResourceActions(selected: PendingResourceActionExecution): Promise<void> {
    const choiceGroupId = selected.action.choiceGroupId;

    if (!choiceGroupId) return;

    const alternativeEntries = Array.from(this.pendingExecutions.entries()).filter(([, pending]) => {
      return pending.kind === "resource-action" && pending.action.choiceGroupId === choiceGroupId;
    });

    for (const [alternativeId, alternative] of alternativeEntries) {
      if (alternative.kind !== "resource-action") continue;

      this.pendingExecutions.delete(alternativeId);
      await unregisterPendingItemUseAutomationPrompt(
        alternativeId,
        alternative.action.choiceGroupResolvedLabel ?? "✓ Outra opção escolhida"
      );
    }
  }

  private async registerAssistedResourceActions(
    context: ItemUseContext,
    workflowContext: WorkflowContext,
    actions: AssistedResourceAction[],
    summaryLines: string[]
  ): Promise<void> {
    let firstPendingId: string | undefined;

    for (const action of actions) {
      const pendingId = createPendingExecutionId();
      firstPendingId ??= pendingId;

      this.pendingExecutions.set(pendingId, {
        kind: "resource-action",
        id: pendingId,
        action,
        context,
        workflowContext,
        createdAt: Date.now()
      });

      await registerPendingItemUseAutomationPrompt({
        pendingId,
        context,
        mode: "ask",
        title: "Paranormal Toolkit · Ritual",
        buttonLabel: action.label,
        executedLabel: action.executedLabel,
        choiceGroupId: action.choiceGroupId ?? null,
        skippedLabel: action.choiceGroupResolvedLabel ?? null,
        actionSectionId: action.actionSectionId,
        actionSectionTitle: action.actionSectionTitle,
        summaryLines,
        resistanceTargetActor: action.actor,
        resistanceTargetActorId: action.actor.id ?? null,
        resistanceTargetName: action.actorName,
        actionPayload: createPersistedResourceActionPayload(action)
      });
    }

    this.setAttempt(context, "pending", "ritual-assisted-actions", firstPendingId);
    ModuleLogger.info("Ritual assistido preparado com ações pendentes.", createWorkflowDebugSnapshot(workflowContext));
  }

  private async createPendingWorkflowPrompt(context: ItemUseContext, definition: AutomationDefinition): Promise<void> {
    const pendingId = createPendingExecutionId();

    this.pendingExecutions.set(pendingId, {
      kind: "workflow",
      id: pendingId,
      definition,
      context,
      mode: "ask",
      createdAt: Date.now()
    });

    await registerPendingItemUseAutomationPrompt({
      pendingId,
      context,
      mode: "ask",
      buttonLabel: "Aplicar automação",
      executedLabel: "✓ Automação aplicada"
    });

    this.setAttempt(context, "pending", "execution-mode-ask", pendingId);
  }

  private async executeAutomation(
    context: ItemUseContext,
    definition: AutomationDefinition,
    executionMode: AutomationExecutionMode
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
          executionMode
        }
      }
    });

    if (!result.ok) {
      this.setAttempt(context, "failed", result.error.reason);
      this.handleAutomationFailure(result.error);
      return;
    }

    this.setAttempt(context, "completed");
    ModuleLogger.info("Automação executada por uso normal de item.", createWorkflowDebugSnapshot(result.value.context));
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

  private handleResourceActionFailure(result: Extract<ResourceOperationResult, { ok: false }>): void {
    ModuleLogger.warn(`Ação assistida falhou: ${result.error.message}`, result.error);
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
    return lastTimestamp !== undefined && now - lastTimestamp <= DUPLICATE_WINDOW_MS;
  }

  private markExecution(context: ItemUseContext): void {
    this.recentExecutionKeys.set(createExecutionKey(context), Date.now());
  }

  private setAttempt(context: ItemUseContext, status: ItemUseIntegrationAttempt["status"], reason?: string, pendingId?: string): void {
    this.lastAttempt = createAttemptSnapshot(context, status, reason, pendingId);
  }
}

function createPersistedResourceActionPayload(action: AssistedResourceAction): PersistedResourceActionPayload {
  return {
    kind: "resource-operation",
    actorId: action.actor.id ?? null,
    actorUuid: action.actor.uuid ?? null,
    actorName: action.actorName,
    resource: action.resource,
    operation: action.operation,
    amount: action.amount
  };
}

function resolvePersistedActionActor(action: PersistedResourceActionPayload): Actor | null {
  const byUuid = action.actorUuid ? fromUuidSyncSafe(action.actorUuid) : null;
  if (isActorLike(byUuid)) return byUuid;

  const byId = action.actorId ? resolveActorById(action.actorId) : null;
  if (byId) return byId;

  return resolveActorByName(action.actorName);
}

function fromUuidSyncSafe(uuid: string): unknown {
  const fromUuidSync = (globalThis as { fromUuidSync?: (uuid: string) => unknown }).fromUuidSync;
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

  const actors = game.actors as { find?: (predicate: (actor: unknown) => boolean) => unknown } | undefined;
  const actor = actors?.find?.((candidate) => isActorLike(candidate) && normalizeLookupName(candidate.name) === normalizedName);

  return isActorLike(actor) ? actor : null;
}

function getCanvasTokens(): unknown[] {
  const placeables = (canvas as { tokens?: { placeables?: unknown[] } } | undefined)?.tokens?.placeables;
  return Array.isArray(placeables) ? placeables : [];
}

function getTokenName(token: unknown): string | null {
  if (!token || typeof token !== "object") return null;

  const directName = (token as { name?: unknown }).name;
  if (typeof directName === "string") return directName;

  const documentName = (token as { document?: { name?: unknown } }).document?.name;
  if (typeof documentName === "string") return documentName;

  const actor = resolveTokenActor(token);
  return actor?.name ?? null;
}

function resolveTokenActor(value: unknown): Actor | null {
  if (!value || typeof value !== "object") return null;

  const actor = (value as { actor?: unknown }).actor;
  if (isActorLike(actor)) return actor;

  const documentActor = (value as { document?: { actor?: unknown } }).document?.actor;
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
  pendingId?: string
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
    timestamp: Date.now()
  };
}

function createExecutionKey(context: ItemUseContext): string {
  const actorKey = context.actor?.id ?? "no-actor";
  const itemKey = context.item.uuid ?? context.item.id ?? context.item.name ?? "unknown-item";
  return `${actorKey}:${itemKey}`;
}

function createPendingExecutionId(): string {
  const cryptoObject = globalThis.crypto as { randomUUID?: () => string } | undefined;

  if (cryptoObject?.randomUUID) {
    return cryptoObject.randomUUID();
  }

  return `pending-${Date.now()}-${Math.random().toString(36).slice(2)}`;
}
