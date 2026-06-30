import { MODULE_ID } from "../../constants";
import {
  AUTOMATION_EXECUTION_MODES,
  DEFAULT_AUTOMATION_EXECUTION_MODE,
  coerceAutomationExecutionMode,
  type AutomationExecutionMode
} from "./item-use-execution-mode";

export const ITEM_USE_SYSTEM_CARD_MODES = ["keep", "replace"] as const;
export type ItemUseSystemCardMode = (typeof ITEM_USE_SYSTEM_CARD_MODES)[number];

const DEFAULT_ITEM_USE_SYSTEM_CARD_MODE: ItemUseSystemCardMode = "keep";
const DEFAULT_RITUAL_CASTING_CHECK_ENABLED = true;

export const ITEM_USE_SETTING_KEYS = {
  executionMode: "itemUse.executionMode",
  systemCardMode: "itemUse.systemCardMode",
  autoRun: "itemUse.autoRun.enabled",
  ritualCastingCheckEnabled: "ritual.castingCheck.enabled"
} as const;

export type ItemUseSettingsSnapshot = {
  executionMode: AutomationExecutionMode;
  systemCardMode: ItemUseSystemCardMode;
  ritualCastingCheckEnabled: boolean;
};

export function registerItemUseSettings(): void {
  game.settings.register(MODULE_ID, ITEM_USE_SETTING_KEYS.executionMode, {
    name: "Modo de automação ao usar item",
    hint: "Controla como o Paranormal Toolkit reage quando um item com automação é usado pela ficha.",
    scope: "world",
    config: true,
    type: String,
    choices: {
      disabled: "Desativado",
      ask: "Perguntar no chat",
      automatic: "Automático"
    } satisfies Record<AutomationExecutionMode, string>,
    default: DEFAULT_AUTOMATION_EXECUTION_MODE
  });

  game.settings.register(MODULE_ID, ITEM_USE_SETTING_KEYS.systemCardMode, {
    name: "Card original do sistema ao usar automação",
    hint: "Controla se o card original do sistema Ordem fica visível ou se o card persistente do Paranormal Toolkit substitui o conteúdo visual da mensagem.",
    scope: "world",
    config: true,
    type: String,
    choices: {
      keep: "Manter card original",
      replace: "Substituir pelo card do Toolkit"
    } satisfies Record<ItemUseSystemCardMode, string>,
    default: DEFAULT_ITEM_USE_SYSTEM_CARD_MODE
  });

  game.settings.register(MODULE_ID, ITEM_USE_SETTING_KEYS.ritualCastingCheckEnabled, {
    name: "Rolar Ocultismo ao conjurar ritual",
    hint: "Quando ativo, rituais conjurados pelo Toolkit rolam Ocultismo contra a DT de ritual do conjurador antes de resolver dano, cura ou efeitos.",
    scope: "world",
    config: true,
    type: Boolean,
    default: DEFAULT_RITUAL_CASTING_CHECK_ENABLED
  });

  // Setting legado da 0.8.x. Mantido escondido para não quebrar mundos/APIs antigas.
  game.settings.register(MODULE_ID, ITEM_USE_SETTING_KEYS.autoRun, {
    name: "Executar automações ao usar item",
    hint: "Setting legado. Use o modo de automação ao usar item.",
    scope: "world",
    config: false,
    type: Boolean,
    default: false
  });
}

export function getItemUseSettings(): ItemUseSettingsSnapshot {
  const executionMode = coerceAutomationExecutionMode(game.settings.get(MODULE_ID, ITEM_USE_SETTING_KEYS.executionMode));
  const systemCardMode = coerceItemUseSystemCardMode(game.settings.get(MODULE_ID, ITEM_USE_SETTING_KEYS.systemCardMode));

  return {
    executionMode,
    systemCardMode,
    ritualCastingCheckEnabled: getRitualCastingCheckEnabled()
  };
}

export function getItemUseSystemCardMode(): ItemUseSystemCardMode {
  return coerceItemUseSystemCardMode(game.settings.get(MODULE_ID, ITEM_USE_SETTING_KEYS.systemCardMode));
}

export function getRitualCastingCheckEnabled(): boolean {
  return game.settings.get(MODULE_ID, ITEM_USE_SETTING_KEYS.ritualCastingCheckEnabled) === true;
}

export async function setItemUseExecutionMode(mode: AutomationExecutionMode): Promise<void> {
  await game.settings.set(MODULE_ID, ITEM_USE_SETTING_KEYS.executionMode, mode);
}

export async function setItemUseSystemCardMode(mode: ItemUseSystemCardMode): Promise<void> {
  await game.settings.set(MODULE_ID, ITEM_USE_SETTING_KEYS.systemCardMode, mode);
}

/**
 * @deprecated Use setItemUseExecutionMode. Mantido apenas para scripts antigos da 0.8.x.
 */
export async function setItemUseAutoRunEnabled(enabled: boolean): Promise<void> {
  await setItemUseExecutionMode(enabled ? "automatic" : "disabled");
}

function coerceItemUseSystemCardMode(value: unknown): ItemUseSystemCardMode {
  return ITEM_USE_SYSTEM_CARD_MODES.includes(value as ItemUseSystemCardMode)
    ? (value as ItemUseSystemCardMode)
    : DEFAULT_ITEM_USE_SYSTEM_CARD_MODE;
}

export { AUTOMATION_EXECUTION_MODES };
export type { AutomationExecutionMode };
