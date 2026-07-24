import type { AbilityRollIntent, ResolvedAbilityRoll } from "./config/ability-roll-config";

export const ABILITY_ROLL_ACTION_ATTRIBUTE =
  "data-paranormal-toolkit-ability-roll-id";

export type AbilityRollMessageAction = ResolvedAbilityRoll;

export type AbilityUseMessageFlag = {
  version: 2;
  actorUuid: string;
  itemUuid: string;
  abilityName: string;
  rolls: AbilityRollMessageAction[];
  resource: "PE" | "PD";
  cost: number;
  spentResource: boolean;
  resourceBefore: number;
  resourceAfter: number;
};

export function normalizeAbilityUseMessageFlag(
  value: unknown,
): AbilityUseMessageFlag | null {
  if (!isRecord(value) || value.version !== 2 || !Array.isArray(value.rolls)) {
    return null;
  }

  const actorUuid = normalizeString(value.actorUuid);
  const itemUuid = normalizeString(value.itemUuid);
  const abilityName = normalizeString(value.abilityName);
  if (!actorUuid) return null;

  const rolls = value.rolls
    .map(normalizeRollAction)
    .filter((roll): roll is AbilityRollMessageAction => roll !== null);

  return {
    version: 2,
    actorUuid,
    itemUuid,
    abilityName: abilityName || "Habilidade",
    rolls,
    resource: value.resource === "PD" ? "PD" : "PE",
    cost: normalizeNumber(value.cost),
    spentResource: value.spentResource === true,
    resourceBefore: normalizeNumber(value.resourceBefore),
    resourceAfter: normalizeNumber(value.resourceAfter),
  };
}

function normalizeRollAction(value: unknown): AbilityRollMessageAction | null {
  if (!isRecord(value)) return null;

  const id = normalizeString(value.id);
  const sourceRollId = normalizeString(value.sourceRollId);
  const label = normalizeString(value.label);
  const formula = normalizeString(value.formula);
  const intent = normalizeIntent(value.intent);
  if (!id || !sourceRollId || !label || !formula || !intent) return null;

  const nexThreshold =
    typeof value.nexThreshold === "number" && Number.isFinite(value.nexThreshold)
      ? Math.max(0, Math.min(99, Math.trunc(value.nexThreshold)))
      : null;

  return {
    id,
    sourceRollId,
    label,
    formula,
    intent,
    damageType:
      intent === "damage" ? normalizeOptionalString(value.damageType) : null,
    nexThreshold,
  };
}

function normalizeIntent(value: unknown): AbilityRollIntent | null {
  return value === "generic" || value === "damage" || value === "healing"
    ? value
    : null;
}

function normalizeString(value: unknown): string {
  return typeof value === "string" ? value.trim() : "";
}

function normalizeOptionalString(value: unknown): string | null {
  const normalized = normalizeString(value);
  return normalized.length > 0 ? normalized : null;
}

function normalizeNumber(value: unknown): number {
  const numberValue = typeof value === "number" ? value : Number(value);
  return Number.isFinite(numberValue) ? numberValue : 0;
}

function isRecord(value: unknown): value is Record<string, unknown> {
  return value !== null && typeof value === "object" && !Array.isArray(value);
}
