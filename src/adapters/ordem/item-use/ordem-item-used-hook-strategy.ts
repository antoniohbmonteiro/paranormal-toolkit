import { ORDEM_HOOKS } from "../ordem-hooks";
import { ModuleLogger } from "../../../core/module-logger";
import type { ItemUseContext, ItemUseSourceStrategy, ItemUseSourceStrategyStatus } from "../../../features/item-use/item-use-context";
import { createContextFromItemUsedHook, type OrdemItemUsedHookPayload } from "./ordem-item-use-context-resolver";

export class OrdemItemUsedHookStrategy implements ItemUseSourceStrategy {
  readonly id = "ordem-item-used-hook" as const;

  private registered = false;

  constructor(private readonly onItemUsed: (context: ItemUseContext) => Promise<void>) {}

  register(): void {
    if (this.registered) return;

    Hooks.on(ORDEM_HOOKS.ITEM_USED, (payload: unknown) => {
      void this.handleHook(payload);
    });

    this.registered = true;
    ModuleLogger.info(`${ORDEM_HOOKS.ITEM_USED} registrado como fonte de uso de item.`);
  }

  status(): ItemUseSourceStrategyStatus {
    return {
      id: this.id,
      registered: this.registered
    };
  }

  private async handleHook(payload: unknown): Promise<void> {
    const context = createContextFromItemUsedHook(asHookPayload(payload));

    if (!context) {
      ModuleLogger.warn(`${ORDEM_HOOKS.ITEM_USED} disparou sem payload de item válido.`, payload);
      return;
    }

    await this.onItemUsed(context);
  }
}

function asHookPayload(value: unknown): OrdemItemUsedHookPayload {
  return value && typeof value === "object" ? (value as OrdemItemUsedHookPayload) : {};
}
