import { MODULE_ID } from "../../../constants";
import type { ToolkitDamageType } from "../../../core/damage/damage-types";

export const RITUAL_ROLL_CONFIG_FLAG_KEY = "ritualRollConfig";

export type RitualRollIntent = "damage" | "healing" | "utility";
export type RitualRollFormId = "base" | "discente" | "verdadeiro";

export type RitualRollFormConfig = {
  formula: string;
};

export type RitualRollConfig = {
  schemaVersion: 1;
  intent: RitualRollIntent;
  damageType: ToolkitDamageType | string | null;
  utilityLabel: string | null;
  note: string;
  forms: Record<RitualRollFormId, RitualRollFormConfig>;
};

export type RitualRollConfigInput = Partial<{
  intent: unknown;
  damageType: unknown;
  utilityLabel: unknown;
  note: unknown;
  forms: unknown;
}>;

export function createDefaultRitualRollConfig(): RitualRollConfig {
  return {
    schemaVersion: 1,
    intent: "damage",
    damageType: null,
    utilityLabel: "Resultado",
    note: "",
    forms: {
      base: { formula: "" },
      discente: { formula: "" },
      verdadeiro: { formula: "" },
    },
  };
}

export function readRitualRollConfig(item: Item): RitualRollConfig | null {
  const value = item.getFlag(MODULE_ID, RITUAL_ROLL_CONFIG_FLAG_KEY);
  return normalizeRitualRollConfig(value);
}

export function getRitualRollConfigForEditing(item: Item): RitualRollConfig {
  return readRitualRollConfig(item) ?? createDefaultRitualRollConfig();
}

export async function writeRitualRollConfig(item: Item, input: RitualRollConfigInput): Promise<RitualRollConfig> {
  const config = normalizeRitualRollConfig(input) ?? normalizeRitualRollConfig({
    ...createDefaultRitualRollConfig(),
    ...input,
  });

  if (!config) {
    throw new Error("Configuração de rolagem do ritual inválida.");
  }

  await item.setFlag(MODULE_ID, RITUAL_ROLL_CONFIG_FLAG_KEY, config);
  return config;
}

export async function clearRitualRollConfig(item: Item): Promise<void> {
  const unsetFlag = (item as { unsetFlag?: (scope: string, key: string) => Promise<unknown> | unknown }).unsetFlag;

  if (typeof unsetFlag === "function") {
    await Promise.resolve(unsetFlag.call(item, MODULE_ID, RITUAL_ROLL_CONFIG_FLAG_KEY));
    return;
  }

  await item.setFlag(MODULE_ID, RITUAL_ROLL_CONFIG_FLAG_KEY, null);
}

export function normalizeRitualRollConfig(value: unknown): RitualRollConfig | null {
  if (!isRecord(value)) return null;

  const intent = normalizeIntent(value.intent);
  if (!intent) return null;

  const defaultConfig = createDefaultRitualRollConfig();

  return {
    schemaVersion: 1,
    intent,
    damageType: normalizeOptionalString(value.damageType),
    utilityLabel: normalizeOptionalString(value.utilityLabel) ?? defaultConfig.utilityLabel,
    note: normalizeString(value.note),
    forms: normalizeFormConfigs(value.forms),
  };
}

export function getRitualRollIntentLabel(intent: RitualRollIntent): string {
  switch (intent) {
    case "damage":
      return "Dano";
    case "healing":
      return "Cura";
    case "utility":
      return "Utilidade";
  }
}

function normalizeIntent(value: unknown): RitualRollIntent | null {
  return value === "damage" || value === "healing" || value === "utility" ? value : null;
}

function normalizeFormConfigs(value: unknown): Record<RitualRollFormId, RitualRollFormConfig> {
  const defaultConfig = createDefaultRitualRollConfig();
  if (!isRecord(value)) return defaultConfig.forms;

  return {
    base: normalizeFormConfig(value.base),
    discente: normalizeFormConfig(value.discente),
    verdadeiro: normalizeFormConfig(value.verdadeiro),
  };
}

function normalizeFormConfig(value: unknown): RitualRollFormConfig {
  if (!isRecord(value)) return { formula: "" };
  return { formula: normalizeString(value.formula) };
}

function normalizeString(value: unknown): string {
  return typeof value === "string" ? value.trim() : "";
}

function normalizeOptionalString(value: unknown): string | null {
  const normalized = normalizeString(value);
  return normalized.length > 0 ? normalized : null;
}

function isRecord(value: unknown): value is Record<string, unknown> {
  return value !== null && typeof value === "object" && !Array.isArray(value);
}
