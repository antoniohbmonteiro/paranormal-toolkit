import { MODULE_ID } from "../../../constants";
import type {
  AutomationConditionApplicationDefinition,
  AutomationDefinition,
} from "../../../core/automation/automation-definition";
import { TOOLKIT_CONDITION_DEFINITIONS } from "../../conditions/conditions";
import {
  createResistanceFromRitualItem,
  createRitualRollAutomationDefinition,
} from "./ritual-roll-config";

export const RITUAL_RESISTANCE_OUTCOME_CONFIG_FLAG_KEY =
  "ritualResistanceOutcomes";

export type RitualResistanceOutcomeId = "success" | "failure";

export type RitualResistanceConditionConfig = {
  conditionId: string;
  rounds: number | null;
};

export type RitualResistanceOutcomeConfig = {
  conditions: RitualResistanceConditionConfig[];
};

export type RitualResistanceOutcomesConfig = {
  schemaVersion: 1;
  outcomes: Record<RitualResistanceOutcomeId, RitualResistanceOutcomeConfig>;
};

export type RitualResistanceOutcomesConfigInput = Partial<{
  schemaVersion: unknown;
  outcomes: unknown;
}>;

export type RitualResistanceConditionOption = {
  value: string;
  label: string;
};

const OUTCOME_LABELS: Record<RitualResistanceOutcomeId, string> = {
  success: "Sucesso",
  failure: "Falha",
};

export function createDefaultRitualResistanceOutcomesConfig(): RitualResistanceOutcomesConfig {
  return {
    schemaVersion: 1,
    outcomes: {
      success: { conditions: [] },
      failure: { conditions: [] },
    },
  };
}

export function readRitualResistanceOutcomesConfig(
  item: Item,
): RitualResistanceOutcomesConfig | null {
  const value = item.getFlag(
    MODULE_ID,
    RITUAL_RESISTANCE_OUTCOME_CONFIG_FLAG_KEY,
  );
  return normalizeRitualResistanceOutcomesConfig(value);
}

export function getRitualResistanceOutcomesConfigForEditing(
  item: Item,
): RitualResistanceOutcomesConfig {
  return (
    readRitualResistanceOutcomesConfig(item) ??
    createDefaultRitualResistanceOutcomesConfig()
  );
}

export async function writeRitualResistanceOutcomesConfig(
  item: Item,
  input: RitualResistanceOutcomesConfigInput,
): Promise<RitualResistanceOutcomesConfig> {
  const config = normalizeRitualResistanceOutcomesConfig({
    ...createDefaultRitualResistanceOutcomesConfig(),
    ...input,
  });

  if (!config) {
    throw new Error("Configuração de efeitos da resistência inválida.");
  }

  await item.setFlag(
    MODULE_ID,
    RITUAL_RESISTANCE_OUTCOME_CONFIG_FLAG_KEY,
    config,
  );
  return config;
}

export async function clearRitualResistanceOutcomesConfig(
  item: Item,
): Promise<void> {
  const unsetFlag = (
    item as {
      unsetFlag?: (
        scope: string,
        key: string,
      ) => Promise<unknown> | unknown;
    }
  ).unsetFlag;

  if (typeof unsetFlag === "function") {
    await Promise.resolve(
      unsetFlag.call(
        item,
        MODULE_ID,
        RITUAL_RESISTANCE_OUTCOME_CONFIG_FLAG_KEY,
      ),
    );
    return;
  }

  await item.setFlag(
    MODULE_ID,
    RITUAL_RESISTANCE_OUTCOME_CONFIG_FLAG_KEY,
    null,
  );
}

export function normalizeRitualResistanceOutcomesConfig(
  value: unknown,
): RitualResistanceOutcomesConfig | null {
  if (!isRecord(value)) return null;

  const outcomes = isRecord(value.outcomes) ? value.outcomes : {};

  return {
    schemaVersion: 1,
    outcomes: {
      success: normalizeOutcome(outcomes.success),
      failure: normalizeOutcome(outcomes.failure),
    },
  };
}

export function listRitualResistanceConditionOptions(): RitualResistanceConditionOption[] {
  return TOOLKIT_CONDITION_DEFINITIONS.map((definition) => ({
    value: definition.id,
    label: definition.label,
  })).sort((left, right) => left.label.localeCompare(right.label, "pt-BR"));
}

export function hasConfiguredRitualResistanceOutcomes(
  config: RitualResistanceOutcomesConfig,
): boolean {
  return Object.values(config.outcomes).some(
    (outcome) => outcome.conditions.length > 0,
  );
}

export function createRitualRollAutomationDefinitionWithOutcomes(
  item: Item,
): AutomationDefinition | null {
  const definition = createRitualRollAutomationDefinition(item);
  if (!definition) return null;

  return withRitualResistanceOutcomeConditions(item, definition);
}

export function withRitualResistanceOutcomeConditions(
  item: Item,
  definition: AutomationDefinition,
): AutomationDefinition {
  const resistance =
    definition.resistance ?? createResistanceFromRitualItem(item);
  if (!resistance) return definition;

  const config = readRitualResistanceOutcomesConfig(item);
  if (!config || !hasConfiguredRitualResistanceOutcomes(config)) {
    return definition;
  }

  const existingApplications = definition.conditionApplications ?? [];
  const existingIds = new Set(existingApplications.map((entry) => entry.id));
  const configuredApplications = createConditionApplications(item, config).filter(
    (entry) => !existingIds.has(entry.id),
  );
  if (configuredApplications.length === 0) return definition;

  return {
    ...definition,
    resistance,
    conditionApplications: [
      ...existingApplications,
      ...configuredApplications,
    ],
  };
}

function createConditionApplications(
  item: Item,
  config: RitualResistanceOutcomesConfig,
): AutomationConditionApplicationDefinition[] {
  return (["success", "failure"] as const).flatMap((outcome) =>
    config.outcomes[outcome].conditions.map((condition, index) =>
      createConditionApplication(item, outcome, condition, index),
    ),
  );
}

function createConditionApplication(
  item: Item,
  outcome: RitualResistanceOutcomeId,
  condition: RitualResistanceConditionConfig,
  index: number,
): AutomationConditionApplicationDefinition {
  const definition = resolveConditionDefinition(condition.conditionId);
  const conditionId = definition?.id ?? condition.conditionId;
  const conditionLabel = definition?.label ?? formatConditionId(conditionId);

  return {
    id: `generic-ritual-resistance-${outcome}-${index + 1}-${conditionId}`,
    actor: "target",
    conditionId,
    label: `${OUTCOME_LABELS[outcome]} · ${conditionLabel}`,
    duration:
      condition.rounds === null ? null : { rounds: condition.rounds },
    source: `ritual.generic-resistance.${item.id ?? "item"}`,
    actionSectionId: "apply-effects",
    actionSectionTitle: "Aplicar efeito",
    executedLabel: `✓ ${conditionLabel} aplicado`,
    applyOnResistance: outcome,
  };
}

function normalizeOutcome(value: unknown): RitualResistanceOutcomeConfig {
  if (!isRecord(value) || !Array.isArray(value.conditions)) {
    return { conditions: [] };
  }

  const conditions: RitualResistanceConditionConfig[] = [];
  const seen = new Set<string>();

  for (const entry of value.conditions) {
    const condition = normalizeCondition(entry);
    if (!condition || seen.has(condition.conditionId)) continue;

    seen.add(condition.conditionId);
    conditions.push(condition);
  }

  return { conditions };
}

function normalizeCondition(
  value: unknown,
): RitualResistanceConditionConfig | null {
  if (!isRecord(value)) return null;

  const definition = resolveConditionDefinition(normalizeString(value.conditionId));
  if (!definition) return null;

  return {
    conditionId: definition.id,
    rounds: normalizeRounds(value.rounds),
  };
}

function resolveConditionDefinition(conditionId: string) {
  const lookup = normalizeLookupKey(conditionId);
  if (!lookup) return null;

  return (
    TOOLKIT_CONDITION_DEFINITIONS.find((definition) => {
      const aliases = [
        definition.id,
        definition.label,
        ...(definition.aliases ?? []),
      ];
      return aliases.some((alias) => normalizeLookupKey(alias) === lookup);
    }) ?? null
  );
}

function normalizeRounds(value: unknown): number | null {
  if (value === null || value === undefined || value === "") return null;

  const parsed =
    typeof value === "number"
      ? value
      : typeof value === "string"
        ? Number(value.trim())
        : Number.NaN;

  if (!Number.isFinite(parsed)) return null;

  const rounds = Math.trunc(parsed);
  return rounds > 0 ? rounds : null;
}

function formatConditionId(conditionId: string): string {
  return conditionId
    .trim()
    .split(/[._-]+/u)
    .filter((part) => part.length > 0)
    .map(
      (part) =>
        `${part.charAt(0).toLocaleUpperCase()}${part.slice(1)}`,
    )
    .join(" ");
}

function normalizeLookupKey(value: string): string {
  return value
    .trim()
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/gu, "")
    .toLocaleLowerCase();
}

function normalizeString(value: unknown): string {
  return typeof value === "string" ? value.trim() : "";
}

function isRecord(value: unknown): value is Record<string, unknown> {
  return value !== null && typeof value === "object" && !Array.isArray(value);
}
