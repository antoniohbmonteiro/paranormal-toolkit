import { MODULE_ID } from "../../../constants";
import type {
  AutomationDefinition,
  AutomationResistanceDefinition,
  AutomationRitualFormDefinition,
  AutomationRitualFormId,
  ModifyResourceStep,
  RollFormulaStep,
} from "../../../core/automation/automation-definition";
import type { DamageTypeInput, ToolkitDamageType } from "../../../core/damage/damage-types";

export const RITUAL_ROLL_CONFIG_FLAG_KEY = "ritualRollConfig";
export const RITUAL_ROLL_CONFIG_ROLL_ID = "ritual-roll";

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

export function createRitualRollAutomationDefinition(item: Item): AutomationDefinition | null {
  const config = readRitualRollConfig(item);
  if (!config) return null;

  const baseFormula = config.forms.base.formula.trim();
  if (!baseFormula) return null;

  const rollStep = createConfiguredRollStep(config, baseFormula);
  const steps = [
    { type: "spendRitualCost" as const },
    rollStep,
    ...createApplicationSteps(config),
  ];

  return {
    version: 1,
    label: `Fórmula de ${item.name ?? "ritual"}`,
    steps,
    ritualForms: createConfiguredRitualForms(item, config),
    resistance: config.intent === "damage" ? createResistanceFromRitualItem(item) : undefined,
  };
}

function createConfiguredRollStep(config: RitualRollConfig, formula: string): RollFormulaStep {
  const step: RollFormulaStep = {
    type: "rollFormula",
    id: RITUAL_ROLL_CONFIG_ROLL_ID,
    formula,
    intent: toWorkflowRollIntent(config.intent),
  };

  if (config.intent === "damage" && config.damageType) {
    step.damageType = config.damageType;
  }

  return step;
}

function createApplicationSteps(config: RitualRollConfig): ModifyResourceStep[] {
  switch (config.intent) {
    case "damage":
      return [
        {
          type: "modifyResource",
          actor: "target",
          resource: "PV",
          operation: "damage",
          amountFrom: `${RITUAL_ROLL_CONFIG_ROLL_ID}.total`,
          ...createDamageTypePayload(config.damageType),
        },
      ];
    case "healing":
      return [
        {
          type: "modifyResource",
          actor: "target",
          resource: "PV",
          operation: "heal",
          amountFrom: `${RITUAL_ROLL_CONFIG_ROLL_ID}.total`,
        },
      ];
    case "utility":
      return [];
  }
}

function createDamageTypePayload(damageType: DamageTypeInput): Pick<ModifyResourceStep, "damageType"> {
  return damageType ? { damageType } : {};
}

function createConfiguredRitualForms(
  item: Item,
  config: RitualRollConfig,
): Partial<Record<AutomationRitualFormId, AutomationRitualFormDefinition>> {
  const baseFormula = config.forms.base.formula.trim();
  const forms: Partial<Record<AutomationRitualFormId, AutomationRitualFormDefinition>> = {
    base: {
      label: "Padrão",
      rollFormulaOverrides: {
        [RITUAL_ROLL_CONFIG_ROLL_ID]: baseFormula,
      },
    },
  };

  if (isRitualFormAvailableInItem(item, "discente") && config.forms.discente.formula.trim()) {
    forms.discente = {
      label: "Discente",
      extraCost: 2,
      rollFormulaOverrides: {
        [RITUAL_ROLL_CONFIG_ROLL_ID]: config.forms.discente.formula.trim(),
      },
    };
  }

  if (isRitualFormAvailableInItem(item, "verdadeiro") && config.forms.verdadeiro.formula.trim()) {
    forms.verdadeiro = {
      label: "Verdadeiro",
      extraCost: 5,
      rollFormulaOverrides: {
        [RITUAL_ROLL_CONFIG_ROLL_ID]: config.forms.verdadeiro.formula.trim(),
      },
    };
  }

  return forms;
}

export function createResistanceFromRitualItem(item: Item): AutomationResistanceDefinition | undefined {
  const system = readSystemRecord(item);
  const skill = normalizeOptionalString(system.skillResis);
  const resistance = normalizeOptionalString(system.resistance);

  if (!skill || resistance !== "reducesByHalf") return undefined;

  const label = getResistanceSkillLabel(skill);

  return {
    skill,
    label,
    effect: "reducesByHalf",
    summary: `${label} reduz à metade`,
  };
}

function toWorkflowRollIntent(intent: RitualRollIntent): RollFormulaStep["intent"] {
  switch (intent) {
    case "damage":
      return "damage";
    case "healing":
      return "healing";
    case "utility":
      return "generic";
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

function isRitualFormAvailableInItem(item: Item, variant: Exclude<RitualRollFormId, "base">): boolean {
  const system = readSystemRecord(item);
  const value = variant === "discente" ? system.studentForm : system.trueForm;
  return isTruthyFlag(value);
}

function readSystemRecord(item: Item): Record<string, unknown> {
  const system = item.system as unknown;
  return isRecord(system) ? system : {};
}

function getResistanceSkillLabel(skill: string): string {
  switch (skill) {
    case "resilience":
      return "Fortitude";
    case "reflexes":
      return "Reflexos";
    case "will":
      return "Vontade";
    default:
      return skill;
  }
}

function isTruthyFlag(value: unknown): boolean {
  return value === true || value === "true" || value === 1 || value === "1";
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
