import { sanitizePersistedHtml } from "../../ui/rendering/sanitize-persisted-html";
import type { AbilityUseCardState } from "./ability-use-card-state";
import {
  createAbilityAssistedActionId,
  type AbilityAssistedAction,
  type AbilityAssistedActionKind,
  type AbilityAssistedActionState,
} from "./ability-use-card-state";
import {
  createWorkflowTargetReferenceId,
  type WorkflowTargetReference,
} from "../../core/workflow/workflow-target-reference";
import type {
  AbilityRollIntent,
  ResolvedAbilityRoll,
} from "./config/ability-roll-config";

export const ABILITY_ROLL_ACTION_ATTRIBUTE =
  "data-paranormal-toolkit-ability-roll-id";

export type AbilityRollMessageAction = ResolvedAbilityRoll;

export type AbilityUseMessageFlagV2 = {
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

export type AbilityUseMessageFlagV3 = {
  version: 3;
  revision: number;
  state: AbilityUseCardState;
};

export type AbilityUseMessageFlag =
  | AbilityUseMessageFlagV2
  | AbilityUseMessageFlagV3;

export function normalizeAbilityUseMessageFlag(
  value: unknown,
): AbilityUseMessageFlag | null {
  if (!isRecord(value)) return null;
  if (value.version === 3) return normalizeVersion3(value);
  if (value.version === 2) return normalizeVersion2(value);
  return null;
}

function normalizeVersion3(
  value: Record<string, unknown>,
): AbilityUseMessageFlagV3 | null {
  const state = normalizeAbilityUseCardState(value.state);
  return state
    ? { version: 3, revision: normalizeNonNegativeInteger(value.revision), state }
    : null;
}

function normalizeVersion2(
  value: Record<string, unknown>,
): AbilityUseMessageFlagV2 | null {
  if (!Array.isArray(value.rolls)) return null;

  const actorUuid = normalizeString(value.actorUuid);
  if (!actorUuid) return null;

  return {
    version: 2,
    actorUuid,
    itemUuid: normalizeString(value.itemUuid),
    abilityName: normalizeString(value.abilityName) || "Habilidade",
    rolls: normalizePreparedRolls(value.rolls),
    resource: value.resource === "PD" ? "PD" : "PE",
    cost: normalizeNumber(value.cost),
    spentResource: value.spentResource === true,
    resourceBefore: normalizeNumber(value.resourceBefore),
    resourceAfter: normalizeNumber(value.resourceAfter),
  };
}

function normalizeAbilityUseCardState(
  value: unknown,
): AbilityUseCardState | null {
  if (!hasValidStateShape(value)) return null;

  const abilityName = normalizeString(value.ability.name);
  const actorName = normalizeString(value.actor.name);
  const resourceType = normalizeResource(value.resource.type);
  if (!abilityName || !actorName || !resourceType) return null;

  const rolls = normalizeExecutedRolls(value.rolls);
  if (!rolls) return null;

  const targets =
    value.schemaVersion === 2 ? normalizeTargets(value.targets) : [];
  if (!targets) return null;
  const actions =
    value.schemaVersion === 2
      ? normalizeActions(value.actions, rolls, targets)
      : [];
  if (!actions) return null;

  return {
    schemaVersion: 2,
    ability: {
      name: abilityName,
      image: normalizeNullableString(value.ability.image),
      descriptionHtml: normalizePersistedDescription(
        value.ability.descriptionHtml,
      ),
      activationLabel: normalizeString(value.ability.activationLabel) || "—",
    },
    actor: {
      id: normalizeNullableString(value.actor.id),
      uuid: normalizeNullableString(value.actor.uuid),
      name: actorName,
    },
    item: {
      id: normalizeNullableString(value.item.id),
      uuid: normalizeNullableString(value.item.uuid),
      name: normalizeString(value.item.name),
    },
    resource: {
      type: resourceType,
      cost: normalizeNonNegativeNumber(value.resource.cost),
      passive: value.resource.passive === true,
      spent: value.resource.spent === true,
      before: normalizeNumber(value.resource.before),
      after: normalizeNumber(value.resource.after),
    },
    rolls,
    targets,
    actions,
    createdAt: normalizeNumber(value.createdAt),
  };
}

function hasValidStateShape(value: unknown): value is {
  schemaVersion: 1 | 2;
  ability: Record<string, unknown>;
  actor: Record<string, unknown>;
  item: Record<string, unknown>;
  resource: Record<string, unknown>;
  rolls: unknown[];
  targets?: unknown;
  actions?: unknown;
  createdAt: unknown;
} {
  return Boolean(
    isRecord(value) &&
      (value.schemaVersion === 1 || value.schemaVersion === 2) &&
      isRecord(value.ability) &&
      isRecord(value.actor) &&
      isRecord(value.item) &&
      isRecord(value.resource) &&
      Array.isArray(value.rolls) &&
      (value.schemaVersion === 1 ||
        (Array.isArray(value.targets) && Array.isArray(value.actions))),
  );
}

function normalizeTargets(value: unknown): WorkflowTargetReference[] | null {
  if (!Array.isArray(value)) return null;
  const targets = value.map(normalizeTarget);
  if (!targets.every((target): target is WorkflowTargetReference => target !== null)) {
    return null;
  }
  if (new Set(targets.map((target) => target.id)).size !== targets.length) return null;
  return targets;
}

function normalizeTarget(
  value: unknown,
  index: number,
): WorkflowTargetReference | null {
  if (!isRecord(value)) return null;
  const target: WorkflowTargetReference = {
    id: normalizeString(value.id),
    name: normalizeString(value.name),
    sceneId: normalizeNullableString(value.sceneId),
    tokenId: normalizeNullableString(value.tokenId),
    tokenUuid: normalizeNullableString(value.tokenUuid),
    actorId: normalizeNullableString(value.actorId),
    actorUuid: normalizeNullableString(value.actorUuid),
  };
  if (!target.id || !target.name) return null;
  const expectedId = createWorkflowTargetReferenceId(target, index);
  const expectedTokenUuid =
    target.sceneId && target.tokenId
      ? `Scene.${target.sceneId}.Token.${target.tokenId}`
      : null;
  return target.id === expectedId && target.tokenUuid === expectedTokenUuid
    ? target
    : null;
}

function normalizeActions(
  value: unknown,
  rolls: AbilityUseCardState["rolls"],
  targets: WorkflowTargetReference[],
): AbilityAssistedAction[] | null {
  if (!Array.isArray(value)) return null;
  const actions = value.map((entry) => normalizeAction(entry, rolls, targets));
  if (!actions.every((action): action is AbilityAssistedAction => action !== null)) {
    return null;
  }
  if (new Set(actions.map((action) => action.id)).size !== actions.length) return null;
  return actions;
}

function normalizeAction(
  value: unknown,
  rolls: AbilityUseCardState["rolls"],
  targets: WorkflowTargetReference[],
): AbilityAssistedAction | null {
  if (!isRecord(value)) return null;
  const id = normalizeString(value.id);
  const rollId = normalizeString(value.rollId);
  const targetId = normalizeString(value.targetId);
  const kind = normalizeActionKind(value.kind);
  const state = normalizeActionState(value.state);
  if (!id || !rollId || !targetId || !kind || !state) return null;
  const roll = rolls.find((entry) => entry.id === rollId);
  if (!roll || roll.intent !== kind || !targets.some((target) => target.id === targetId)) {
    return null;
  }
  if (id !== createAbilityAssistedActionId(rollId, targetId, kind)) return null;
  return {
    id,
    kind,
    rollId,
    targetId,
    state: state === "executing" ? "uncertain" : state,
    completedAt: normalizeNullableString(value.completedAt),
    completedByUserId: normalizeNullableString(value.completedByUserId),
  };
}

function normalizeActionKind(value: unknown): AbilityAssistedActionKind | null {
  return value === "damage" || value === "healing" ? value : null;
}

function normalizeActionState(value: unknown): AbilityAssistedActionState | null {
  return ["available", "executing", "completed", "uncertain"].includes(
    String(value),
  )
    ? (value as AbilityAssistedActionState)
    : null;
}

function normalizeExecutedRolls(
  values: unknown[],
): AbilityUseCardState["rolls"] | null {
  const rolls = values.map(normalizeExecutedRoll);
  return rolls.every(
    (roll): roll is AbilityUseCardState["rolls"][number] => roll !== null,
  )
    ? rolls
    : null;
}

function normalizeExecutedRoll(
  value: unknown,
): AbilityUseCardState["rolls"][number] | null {
  const prepared = normalizeRollAction(value);
  if (!prepared || !isRecord(value)) return null;
  if (!isFiniteNumber(value.total) || !Array.isArray(value.diceResults)) {
    return null;
  }

  const diceResults = value.diceResults.filter(isFiniteNumber);
  if (diceResults.length !== value.diceResults.length) return null;

  return { ...prepared, total: value.total, diceResults };
}

function normalizePreparedRolls(values: unknown[]): AbilityRollMessageAction[] {
  return values
    .map(normalizeRollAction)
    .filter((roll): roll is AbilityRollMessageAction => roll !== null);
}

function normalizeRollAction(value: unknown): AbilityRollMessageAction | null {
  if (!isRecord(value)) return null;

  const id = normalizeString(value.id);
  const sourceRollId = normalizeString(value.sourceRollId);
  const label = normalizeString(value.label);
  const formula = normalizeString(value.formula);
  const intent = normalizeIntent(value.intent);
  if (!id || !sourceRollId || !label || !formula || !intent) return null;

  return {
    id,
    sourceRollId,
    label,
    formula,
    intent,
    damageType:
      intent === "damage" ? normalizeNullableString(value.damageType) : null,
    nexThreshold: normalizeNexThreshold(value.nexThreshold),
  };
}

function normalizePersistedDescription(value: unknown): string | null {
  const html = normalizeString(value);
  if (!html) return null;
  const sanitized = sanitizePersistedHtml(html).trim();
  return sanitized || null;
}

function normalizeNexThreshold(value: unknown): number | null {
  return isFiniteNumber(value)
    ? Math.max(0, Math.min(99, Math.trunc(value)))
    : null;
}

function normalizeIntent(value: unknown): AbilityRollIntent | null {
  return value === "generic" || value === "damage" || value === "healing"
    ? value
    : null;
}

function normalizeResource(value: unknown): "PE" | "PD" | null {
  return value === "PE" || value === "PD" ? value : null;
}

function normalizeString(value: unknown): string {
  return typeof value === "string" ? value.trim() : "";
}

function normalizeNullableString(value: unknown): string | null {
  return normalizeString(value) || null;
}

function normalizeNumber(value: unknown): number {
  const number = typeof value === "number" ? value : Number(value);
  return Number.isFinite(number) ? number : 0;
}

function normalizeNonNegativeNumber(value: unknown): number {
  return Math.max(0, normalizeNumber(value));
}

function normalizeNonNegativeInteger(value: unknown): number {
  return Math.max(0, Math.trunc(normalizeNumber(value)));
}

function isFiniteNumber(value: unknown): value is number {
  return typeof value === "number" && Number.isFinite(value);
}

function isRecord(value: unknown): value is Record<string, unknown> {
  return value !== null && typeof value === "object" && !Array.isArray(value);
}
