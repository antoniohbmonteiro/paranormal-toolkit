import { OrdemItemUsedHookStrategy } from "../../adapters/ordem/item-use/ordem-item-used-hook-strategy";
import { ModuleLogger } from "../../core/module-logger";
import type { ResourceAdapter } from "../../core/resources/actor-resource";
import type { ResourceEngine } from "../../core/resources/resource-engine";
import { readAutomationFlagValue } from "../automation/automation-flag-reader";
import type { ItemUseContext } from "../item-use/item-use-context";
import { getItemUseSettings } from "../item-use/item-use-settings";
import { AbilityUseWorkflow } from "./ability-use-workflow";

const DUPLICATE_WINDOW_MS = 1_000;

export class AbilityUseIntegration {
  private readonly workflow: AbilityUseWorkflow;
  private readonly strategy: OrdemItemUsedHookStrategy;
  private readonly inFlight = new Set<string>();
  private readonly recentExecutions = new Map<string, number>();

  constructor(resources: ResourceEngine, resourceAdapter: ResourceAdapter) {
    this.workflow = new AbilityUseWorkflow(resources, resourceAdapter);
    this.strategy = new OrdemItemUsedHookStrategy((context) =>
      this.handleItemUsed(context),
    );
  }

  register(): void {
    this.strategy.register();
    ModuleLogger.info("Workflow genérico de habilidades registrado.");
  }

  private async handleItemUsed(context: ItemUseContext): Promise<void> {
    if (getItemUseSettings().executionMode === "disabled") return;
    if (!isGenericAbility(context.item)) return;

    const executionKey = createExecutionKey(context);
    if (this.isDuplicate(executionKey)) return;

    this.inFlight.add(executionKey);

    try {
      const result = await this.workflow.run(context);
      if (result.status === "completed") {
        this.recentExecutions.set(executionKey, Date.now());
      }
      if (result.status === "failed") {
        ModuleLogger.warn(
          `Uso genérico de habilidade falhou: ${result.reason}.`,
          result,
        );
      }
    } finally {
      this.inFlight.delete(executionKey);
      this.pruneRecentExecutions();
    }
  }

  private isDuplicate(executionKey: string): boolean {
    if (this.inFlight.has(executionKey)) return true;

    const executedAt = this.recentExecutions.get(executionKey);
    return (
      executedAt !== undefined &&
      Date.now() - executedAt < DUPLICATE_WINDOW_MS
    );
  }

  private pruneRecentExecutions(): void {
    const oldestAllowed = Date.now() - DUPLICATE_WINDOW_MS;
    for (const [key, executedAt] of this.recentExecutions) {
      if (executedAt < oldestAllowed) this.recentExecutions.delete(key);
    }
  }
}

export function registerAbilityUseIntegration(
  resources: ResourceEngine,
  resourceAdapter: ResourceAdapter,
): AbilityUseIntegration {
  const integration = new AbilityUseIntegration(resources, resourceAdapter);
  integration.register();
  return integration;
}

function isGenericAbility(item: Item): boolean {
  if (item.type !== "ability") return false;

  const automationFlag = readAutomationFlagValue(item);
  return (
    !automationFlag.ok &&
    automationFlag.error.reason === "missing-automation"
  );
}

function createExecutionKey(context: ItemUseContext): string {
  const actorKey = context.actor?.uuid ?? context.actor?.id ?? "missing-actor";
  const itemKey =
    context.item.uuid ??
    context.item.id ??
    context.item.name ??
    "missing-item";
  return `${actorKey}|${itemKey}`;
}
