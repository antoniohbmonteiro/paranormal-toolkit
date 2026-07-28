import { MODULE_ID } from "../../../constants";

export const ABILITY_ROLL_CONFIG_FLAG_KEY = "abilityRollConfig";

export type AbilityRollIntent = "generic" | "damage" | "healing";
export type AbilityRollNexResolution = "highest-unlocked" | "choose-unlocked";

export type AbilityDamageTypeOption = {
  value: string;
  label: string;
};

export const ABILITY_DAMAGE_TYPE_OPTIONS: readonly AbilityDamageTypeOption[] = [
  { value: "cutting", label: "Corte" },
  { value: "impact", label: "Impacto" },
  { value: "piercing", label: "Perfurante" },
  { value: "ballistic", label: "Balístico" },
  { value: "blood", label: "Sangue" },
  { value: "death", label: "Morte" },
  { value: "knowledge", label: "Conhecimento" },
  { value: "energy", label: "Energia" },
  { value: "fear", label: "Medo" },
  { value: "fire", label: "Fogo" },
  { value: "cold", label: "Frio" },
  { value: "electric", label: "Eletricidade" },
  { value: "chemical", label: "Químico" },
  { value: "mental", label: "Mental" },
];

export type AbilityRollNexStep = {
  minNex: number;
  formula: string;
};

export type AbilityRollFormulaConfig =
  | {
      mode: "fixed";
      formula: string;
    }
  | {
      mode: "nex";
      resolution: AbilityRollNexResolution;
      steps: AbilityRollNexStep[];
    };

export type AbilityRollEntry = {
  id: string;
  label: string;
  intent: AbilityRollIntent;
  damageType: string | null;
  formula: AbilityRollFormulaConfig;
};

export type AbilityRollConfig = {
  schemaVersion: 1;
  rolls: AbilityRollEntry[];
};

export type ResolvedAbilityRoll = {
  id: string;
  sourceRollId: string;
  label: string;
  intent: AbilityRollIntent;
  damageType: string | null;
  formula: string;
  nexThreshold: number | null;
};

export type AbilityRollChoiceOption = {
  nexThreshold: number;
  formula: string;
};
export type AbilityRollChoiceGroup = {
  sourceRollId: string;
  label: string;
  options: AbilityRollChoiceOption[];
  selectedNexThreshold: number;
};
export type PreparedAbilityRolls = {
  rolls: ResolvedAbilityRoll[];
  choices: AbilityRollChoiceGroup[];
};

export const MAX_ABILITY_ROLLS = 20;
export const MAX_ABILITY_NEX_STEPS = 20;
const DEFAULT_NEX_THRESHOLDS = [10, 40, 65, 99] as const;

export function createDefaultAbilityRollConfig(): AbilityRollConfig {
  return {
    schemaVersion: 1,
    rolls: [createDefaultAbilityRollEntry(1)],
  };
}

export function createDefaultAbilityRollEntry(index: number): AbilityRollEntry {
  return {
    id: createAbilityRollId(),
    label: index === 1 ? "Rolagem" : `Rolagem ${index}`,
    intent: "generic",
    damageType: null,
    formula: {
      mode: "fixed",
      formula: "",
    },
  };
}

export function createDefaultAbilityRollNexSteps(): AbilityRollNexStep[] {
  return DEFAULT_NEX_THRESHOLDS.map((minNex) => ({ minNex, formula: "" }));
}

export function createAbilityRollId(): string {
  const cryptoObject = (globalThis as { crypto?: { randomUUID?: () => string } }).crypto;
  const randomUuid = cryptoObject?.randomUUID?.();
  if (randomUuid) return `roll-${randomUuid}`;

  return `roll-${Date.now().toString(36)}-${Math.random().toString(36).slice(2, 10)}`;
}

export function readAbilityRollConfig(item: Item): AbilityRollConfig | null {
  return normalizeAbilityRollConfig(
    item.getFlag(MODULE_ID, ABILITY_ROLL_CONFIG_FLAG_KEY),
  );
}

export function getAbilityRollConfigForEditing(item: Item): AbilityRollConfig {
  return readAbilityRollConfig(item) ?? createDefaultAbilityRollConfig();
}

export async function writeAbilityRollConfig(
  item: Item,
  input: unknown,
): Promise<AbilityRollConfig> {
  const config = normalizeAbilityRollConfig(input);
  if (!config) {
    throw new Error("Configuração de rolagens da habilidade inválida.");
  }

  await item.setFlag(MODULE_ID, ABILITY_ROLL_CONFIG_FLAG_KEY, config);
  return config;
}

export async function clearAbilityRollConfig(item: Item): Promise<void> {
  const unsetFlag = (
    item as {
      unsetFlag?: (scope: string, key: string) => Promise<unknown> | unknown;
    }
  ).unsetFlag;

  if (typeof unsetFlag === "function") {
    await Promise.resolve(
      unsetFlag.call(item, MODULE_ID, ABILITY_ROLL_CONFIG_FLAG_KEY),
    );
    return;
  }

  await item.setFlag(MODULE_ID, ABILITY_ROLL_CONFIG_FLAG_KEY, null);
}

export function normalizeAbilityRollConfig(
  value: unknown,
): AbilityRollConfig | null {
  if (!isRecord(value) || !Array.isArray(value.rolls)) return null;

  const usedIds = new Set<string>();
  const rolls = value.rolls
    .slice(0, MAX_ABILITY_ROLLS)
    .map((entry, index) => normalizeRollEntry(entry, index, usedIds))
    .filter((entry): entry is AbilityRollEntry => entry !== null);

  return {
    schemaVersion: 1,
    rolls,
  };
}

export function resolveAbilityRolls(
  actor: Actor,
  item: Item,
): ResolvedAbilityRoll[] {
  const config = readAbilityRollConfig(item);
  if (!config) return [];

  return resolveAbilityRollActions(config, resolveActorNex(actor));
}

export function prepareAbilityRolls(
  actor: Actor,
  item: Item,
): PreparedAbilityRolls {
  const config = readAbilityRollConfig(item);
  if (!config) return { rolls: [], choices: [] };
  const actorNex = resolveActorNex(actor);
  const rolls = resolveAbilityRollActions(config, actorNex);
  const choices: AbilityRollChoiceGroup[] = [];
  for (const entry of config.rolls) {
    if (
      entry.formula.mode !== "nex" ||
      entry.formula.resolution !== "choose-unlocked"
    ) {
      continue;
    }
    const options = entry.formula.steps
      .filter((step) => step.minNex <= actorNex && step.formula.trim())
      .map((step) => ({
        nexThreshold: step.minNex,
        formula: step.formula.trim(),
      }));
    const selected = options.at(-1);
    if (selected) {
      choices.push({
        sourceRollId: entry.id,
        label: entry.label,
        options,
        selectedNexThreshold: selected.nexThreshold,
      });
    }
  }
  return { rolls, choices };
}

export function finalizeAbilityRolls(
  prepared: PreparedAbilityRolls,
  selections: Record<string, number>,
): ResolvedAbilityRoll[] | null {
  const choiceIds = new Set(
    prepared.choices.map((choice) => choice.sourceRollId),
  );
  for (const choice of prepared.choices) {
    const threshold = selections[choice.sourceRollId];
    if (!choice.options.some((option) => option.nexThreshold === threshold)) {
      return null;
    }
  }
  return prepared.rolls.filter(
    (roll) =>
      !choiceIds.has(roll.sourceRollId) ||
      roll.nexThreshold === selections[roll.sourceRollId],
  );
}

export function resolveAbilityRollActions(
  config: AbilityRollConfig,
  actorNex: number,
): ResolvedAbilityRoll[] {
  const actions: ResolvedAbilityRoll[] = [];

  for (const roll of config.rolls) {
    if (roll.formula.mode === "fixed") {
      const formula = roll.formula.formula.trim();
      if (!formula) continue;

      actions.push({
        id: roll.id,
        sourceRollId: roll.id,
        label: roll.label,
        intent: roll.intent,
        damageType: roll.intent === "damage" ? roll.damageType : null,
        formula,
        nexThreshold: null,
      });
      continue;
    }

    const unlocked = roll.formula.steps.filter(
      (step) => step.formula.trim().length > 0 && step.minNex <= actorNex,
    );
    if (unlocked.length === 0) continue;

    const highestUnlocked = unlocked.at(-1);
    if (!highestUnlocked) continue;

    const selected: AbilityRollNexStep[] =
      roll.formula.resolution === "choose-unlocked"
        ? unlocked
        : [highestUnlocked];

    for (const step of selected) {
      actions.push({
        id:
          roll.formula.resolution === "choose-unlocked"
            ? `${roll.id}--nex-${step.minNex}`
            : roll.id,
        sourceRollId: roll.id,
        label: roll.label,
        intent: roll.intent,
        damageType: roll.intent === "damage" ? roll.damageType : null,
        formula: step.formula.trim(),
        nexThreshold: step.minNex,
      });
    }
  }

  return actions;
}

export function resolveActorNex(actor: Actor): number {
  const system = isRecord(actor.system) ? actor.system : {};
  const nexContainer = system.NEX ?? system.nex;
  const rawValue = isRecord(nexContainer)
    ? nexContainer.value
    : nexContainer;
  const numericValue = typeof rawValue === "number" ? rawValue : Number(rawValue);

  if (!Number.isFinite(numericValue)) return 0;
  return clampNex(numericValue);
}

export function getAbilityDamageTypeLabel(value: string): string {
  return (
    ABILITY_DAMAGE_TYPE_OPTIONS.find((option) => option.value === value)?.label ??
    value
  );
}

export function getAbilityRollIntentLabel(intent: AbilityRollIntent): string {
  switch (intent) {
    case "generic":
      return "Rolagem genérica";
    case "damage":
      return "Dano";
    case "healing":
      return "Cura";
  }
}

export function hasConfiguredAbilityRolls(config: AbilityRollConfig): boolean {
  return config.rolls.some((roll) => {
    if (roll.formula.mode === "fixed") {
      return roll.formula.formula.trim().length > 0;
    }

    return roll.formula.steps.some((step) => step.formula.trim().length > 0);
  });
}

function normalizeRollEntry(
  value: unknown,
  index: number,
  usedIds: Set<string>,
): AbilityRollEntry | null {
  if (!isRecord(value)) return null;

  const fallbackId = `roll-${index + 1}`;
  const id = ensureUniqueId(normalizeId(value.id, fallbackId), usedIds);
  const intent = normalizeIntent(value.intent);
  const formula = normalizeFormulaConfig(value.formula);
  if (!intent || !formula) return null;

  return {
    id,
    label: normalizeString(value.label) || `Rolagem ${index + 1}`,
    intent,
    damageType:
      intent === "damage" ? normalizeOptionalString(value.damageType) : null,
    formula,
  };
}

function normalizeFormulaConfig(value: unknown): AbilityRollFormulaConfig | null {
  if (!isRecord(value)) return null;

  if (value.mode === "fixed") {
    return {
      mode: "fixed",
      formula: normalizeString(value.formula),
    };
  }

  if (value.mode !== "nex") return null;

  const steps = Array.isArray(value.steps)
    ? value.steps
        .slice(0, MAX_ABILITY_NEX_STEPS)
        .map(normalizeNexStep)
        .filter((step): step is AbilityRollNexStep => step !== null)
    : [];

  steps.sort((left, right) => left.minNex - right.minNex);

  const deduplicated = new Map<number, AbilityRollNexStep>();
  for (const step of steps) deduplicated.set(step.minNex, step);

  return {
    mode: "nex",
    resolution: normalizeNexResolution(value.resolution),
    steps: [...deduplicated.values()],
  };
}

function normalizeNexStep(value: unknown): AbilityRollNexStep | null {
  if (!isRecord(value)) return null;

  const rawNex =
    typeof value.minNex === "number" ? value.minNex : Number(value.minNex);
  if (!Number.isFinite(rawNex)) return null;

  return {
    minNex: clampNex(rawNex),
    formula: normalizeString(value.formula),
  };
}

function normalizeIntent(value: unknown): AbilityRollIntent | null {
  return value === "generic" || value === "damage" || value === "healing"
    ? value
    : null;
}

function normalizeNexResolution(value: unknown): AbilityRollNexResolution {
  return value === "choose-unlocked"
    ? "choose-unlocked"
    : "highest-unlocked";
}

function normalizeId(value: unknown, fallback: string): string {
  if (typeof value !== "string") return fallback;

  const normalized = value
    .trim()
    .replace(/[^a-z0-9_-]+/giu, "-")
    .replace(/^-+|-+$/gu, "")
    .slice(0, 80);
  return normalized || fallback;
}

function ensureUniqueId(id: string, usedIds: Set<string>): string {
  let candidate = id;
  let suffix = 2;

  while (usedIds.has(candidate)) {
    candidate = `${id}-${suffix}`;
    suffix += 1;
  }

  usedIds.add(candidate);
  return candidate;
}

function clampNex(value: number): number {
  return Math.min(99, Math.max(0, Math.trunc(value)));
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
