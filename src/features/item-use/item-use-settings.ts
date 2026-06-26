import { MODULE_ID } from "../../constants";

export const ITEM_USE_SETTING_KEYS = {
  autoRun: "itemUse.autoRun.enabled"
} as const;

export type ItemUseSettingsSnapshot = {
  autoRun: boolean;
};

export function registerItemUseSettings(): void {
  game.settings.register(MODULE_ID, ITEM_USE_SETTING_KEYS.autoRun, {
    name: "Executar automações ao usar item",
    hint: "Quando ativo, itens com automação do Paranormal Toolkit executam o workflow ao serem usados pela ficha. Experimental na versão 0.8.x.",
    scope: "world",
    config: true,
    type: Boolean,
    default: false
  });
}

export function getItemUseSettings(): ItemUseSettingsSnapshot {
  return {
    autoRun: game.settings.get(MODULE_ID, ITEM_USE_SETTING_KEYS.autoRun) === true
  };
}

export async function setItemUseAutoRunEnabled(enabled: boolean): Promise<void> {
  await game.settings.set(MODULE_ID, ITEM_USE_SETTING_KEYS.autoRun, enabled);
}
