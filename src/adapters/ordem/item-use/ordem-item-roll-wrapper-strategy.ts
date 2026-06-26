import { ModuleLogger } from "../../../core/module-logger";
import type { ItemUseContext, ItemUseSourceStrategy, ItemUseSourceStrategyStatus } from "../../../features/item-use/item-use-context";
import { createContextFromRolledItem } from "./ordem-item-use-context-resolver";

type RollFunction = (this: Item, ...args: unknown[]) => unknown;

type RollPrototypePatch = {
  roll?: RollFunction;
  __paranormalToolkitOriginalRoll?: RollFunction;
  __paranormalToolkitRollWrapped?: boolean;
};

type ItemDocumentClass = {
  prototype?: RollPrototypePatch;
};

type FoundryConfigWithItemClass = {
  Item?: {
    documentClass?: ItemDocumentClass;
  };
};

export class OrdemItemRollWrapperStrategy implements ItemUseSourceStrategy {
  readonly id = "ordem-item-roll-wrapper" as const;

  private registered = false;

  constructor(private readonly onItemUsed: (context: ItemUseContext) => Promise<void>) {}

  register(): void {
    const prototype = getItemPrototype();

    if (!prototype?.roll) {
      ModuleLogger.warn("Não foi possível registrar fallback de uso de item: CONFIG.Item.documentClass.prototype.roll não encontrado.");
      return;
    }

    if (prototype.__paranormalToolkitRollWrapped) {
      this.registered = true;
      return;
    }

    const originalRoll = prototype.roll;
    const strategy = this;

    prototype.__paranormalToolkitOriginalRoll = originalRoll;
    prototype.roll = async function wrappedOrdemItemRoll(this: Item, ...args: unknown[]): Promise<unknown> {
      const result = await originalRoll.apply(this, args);
      const context = createContextFromRolledItem(this, result);

      if (context) {
        await strategy.onItemUsed(context);
      }

      return result;
    };
    prototype.__paranormalToolkitRollWrapped = true;
    this.registered = true;

    ModuleLogger.info("Fallback de uso de item registrado em OrdemItem.roll().");
  }

  status(): ItemUseSourceStrategyStatus {
    return {
      id: this.id,
      registered: this.registered
    };
  }
}

function getItemPrototype(): RollPrototypePatch | null {
  const config = CONFIG as FoundryConfigWithItemClass | undefined;
  return config?.Item?.documentClass?.prototype ?? null;
}
