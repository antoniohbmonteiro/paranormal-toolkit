import { MODULE_ID } from "../../constants";

export const DEBUG_OUTPUT_SETTING_KEYS = {
  enabled: "debug.output.enabled",
  console: "debug.output.console",
  ui: "debug.output.ui",
  chat: "debug.output.chat"
} as const;

export type DebugOutputSettingKey = keyof typeof DEBUG_OUTPUT_SETTING_KEYS;

export type DebugOutputSettingsSnapshot = {
  enabled: boolean;
  console: boolean;
  ui: boolean;
  chat: boolean;
};

export function registerDebugOutputSettings(): void {
  registerBooleanSetting(DEBUG_OUTPUT_SETTING_KEYS.enabled, {
    name: "Ativar debug do Paranormal Toolkit",
    hint: "Liga ou desliga as saídas de debug do módulo. Não afeta logs técnicos críticos.",
    default: false
  });

  registerBooleanSetting(DEBUG_OUTPUT_SETTING_KEYS.console, {
    name: "Debug no console",
    hint: "Quando o debug estiver ativo, envia mensagens de diagnóstico para o console do navegador.",
    default: true
  });

  registerBooleanSetting(DEBUG_OUTPUT_SETTING_KEYS.ui, {
    name: "Debug como notificação",
    hint: "Quando o debug estiver ativo, mostra mensagens de diagnóstico como notificações no Foundry.",
    default: true
  });

  registerBooleanSetting(DEBUG_OUTPUT_SETTING_KEYS.chat, {
    name: "Debug no chat",
    hint: "Quando o debug estiver ativo, cria cards de diagnóstico no chat. Os cards são enviados como whisper para GMs.",
    default: false
  });
}

export function getDebugOutputSettings(): DebugOutputSettingsSnapshot {
  return {
    enabled: getBooleanSetting(DEBUG_OUTPUT_SETTING_KEYS.enabled),
    console: getBooleanSetting(DEBUG_OUTPUT_SETTING_KEYS.console),
    ui: getBooleanSetting(DEBUG_OUTPUT_SETTING_KEYS.ui),
    chat: getBooleanSetting(DEBUG_OUTPUT_SETTING_KEYS.chat)
  };
}

export async function setDebugOutputSetting(key: DebugOutputSettingKey, value: boolean): Promise<void> {
  await game.settings.set(MODULE_ID, DEBUG_OUTPUT_SETTING_KEYS[key], value);
}

function registerBooleanSetting(
  key: string,
  data: {
    name: string;
    hint: string;
    default: boolean;
  }
): void {
  game.settings.register(MODULE_ID, key, {
    name: data.name,
    hint: data.hint,
    scope: "world",
    config: true,
    type: Boolean,
    default: data.default
  });
}

function getBooleanSetting(key: string): boolean {
  return game.settings.get(MODULE_ID, key) === true;
}
