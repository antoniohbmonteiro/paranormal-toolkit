import { ModuleLogger } from "../../../core/module-logger";
import type { ItemUseContext, ItemUseSourceStrategy, ItemUseSourceStrategyStatus } from "../../../features/item-use/item-use-context";
import { createContextFromItemUsedHook, type OrdemItemUsedHookPayload } from "./ordem-item-use-context-resolver";

export class OrdemItemUsedHookStrategy implements ItemUseSourceStrategy {
  readonly id = "ordem-item-used-hook" as const;

  private registered = false;

  constructor(private readonly onItemUsed: (context: ItemUseContext) => Promise<void>) {}

  register(): void {
    if (this.registered) return;

    Hooks.on("ordemparanormal.itemUsed", (payload: unknown) => {
      void this.handleHook(payload);
    });

    this.registered = true;
    ModuleLogger.info("Strategy de hook ordemparanormal.itemUsed registrada.");
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
      ModuleLogger.warn("Hook ordemparanormal.itemUsed disparou sem payload de item válido.", payload);
      return;
    }

    await this.onItemUsed(context);
  }
}

function asHookPayload(value: unknown): OrdemItemUsedHookPayload {
  return value && typeof value === "object" ? (value as OrdemItemUsedHookPayload) : {};
}
