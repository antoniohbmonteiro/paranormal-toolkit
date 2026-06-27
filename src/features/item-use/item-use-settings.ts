import { MODULE_ID } from "../../constants";
import {
  AUTOMATION_EXECUTION_MODES,
  DEFAULT_AUTOMATION_EXECUTION_MODE,
  coerceAutomationExecutionMode,
  type AutomationExecutionMode
} from "./item-use-execution-mode";

export const ITEM_USE_SETTING_KEYS = {
  executionMode: "itemUse.executionMode",
  autoRun: "itemUse.autoRun.enabled"
} as const;

export type ItemUseSettingsSnapshot = {
  executionMode: AutomationExecutionMode;
  /**
   * Compatibilidade temporária com a API/debug antiga.
   * Use executionMode daqui pra frente.
   */
  autoRun: boolean;
};

export function registerItemUseSettings(): void {
  game.settings.register(MODULE_ID, ITEM_USE_SETTING_KEYS.executionMode, {
    name: "Modo de execução de automações ao usar item",
    hint: "Controla o que o Paranormal Toolkit faz quando um item com automação é usado pela ficha.",
    scope: "world",
    config: true,
    type: String,
    choices: {
      disabled: "Desativado",
      buttons: "Botões no chat",
      confirm: "Confirmar antes de executar",
      automatic: "Automático"
    } satisfies Record<AutomationExecutionMode, string>,
    default: DEFAULT_AUTOMATION_EXECUTION_MODE
  });

  // Setting legado da 0.8.0. Mantido escondido para não quebrar mundos/APIs antigas.
  game.settings.register(MODULE_ID, ITEM_USE_SETTING_KEYS.autoRun, {
    name: "Executar automações ao usar item",
    hint: "Setting legado. Use o modo de execução de automações.",
    scope: "world",
    config: false,
    type: Boolean,
    default: false
  });
}

export function getItemUseSettings(): ItemUseSettingsSnapshot {
  const executionMode = coerceAutomationExecutionMode(game.settings.get(MODULE_ID, ITEM_USE_SETTING_KEYS.executionMode));

  return {
    executionMode,
    autoRun: executionMode === "automatic"
  };
}

export async function setItemUseExecutionMode(mode: AutomationExecutionMode): Promise<void> {
  await game.settings.set(MODULE_ID, ITEM_USE_SETTING_KEYS.executionMode, mode);
}

export async function setItemUseAutoRunEnabled(enabled: boolean): Promise<void> {
  await setItemUseExecutionMode(enabled ? "automatic" : "disabled");
}

export { AUTOMATION_EXECUTION_MODES };
export type { AutomationExecutionMode };
