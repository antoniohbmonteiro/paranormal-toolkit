import type { AutomationRunFailure } from "../../core/automation/automation-runner";
import { ModuleLogger } from "../../core/module-logger";
import { createWorkflowDebugSnapshot } from "../../core/workflow/workflow-debug-snapshot";
import type { WorkflowEngine } from "../../core/workflow/workflow-engine";
import type { DebugOutputService } from "../../debug/output/debug-output-service";
import { readAutomationDefinition } from "../automation/automation-flag-reader";
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
};

export class ItemUseIntegration {
  private readonly strategies: ItemUseSourceStrategy[] = [];
  private readonly recentExecutionKeys = new Map<string, number>();
  private lastAttempt: ItemUseIntegrationAttempt | null = null;

  constructor(
    private readonly workflow: WorkflowEngine,
    private readonly debugOutput: DebugOutputService
  ) {}

  addStrategy(strategy: ItemUseSourceStrategy): void {
    this.strategies.push(strategy);
  }

  registerStrategies(): void {
    for (const strategy of this.strategies) {
      strategy.register();
    }
  }

  status(): ItemUseIntegrationStatus {
    return {
      settings: getItemUseSettings(),
      strategies: this.strategies.map((strategy) => strategy.status()),
      lastAttempt: this.lastAttempt ? { ...this.lastAttempt } : null
    };
  }

  async handleItemUsed(context: ItemUseContext): Promise<void> {
    const settings = getItemUseSettings();

    if (!settings.autoRun) {
      this.setAttempt(context, "skipped", "auto-run-disabled");
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
    this.setAttempt(context, "running");

    const result = await this.workflow.runAutomation(definition.value, {
      sourceActor: context.actor,
      sourceToken: context.token,
      item: context.item,
      targets: context.targets,
      flags: {
        itemUse: {
          source: context.source
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

  private setAttempt(context: ItemUseContext, status: ItemUseIntegrationAttempt["status"], reason?: string): void {
    this.lastAttempt = createAttemptSnapshot(context, status, reason);
  }
}

function createAttemptSnapshot(
  context: ItemUseContext,
  status: ItemUseIntegrationAttempt["status"],
  reason?: string
): ItemUseIntegrationAttempt {
  return {
    source: context.source,
    status,
    reason,
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
