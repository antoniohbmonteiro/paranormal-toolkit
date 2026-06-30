import { MODULE_ID } from "../../constants";
import { failure, type Result, success } from "../../core/result";
import type { ToolkitConditionDefinition } from "./condition-definition";
import { ConditionRegistry } from "./condition-registry";
import { resolveConditionDuration, type ToolkitConditionDurationInput } from "./condition-duration";

export type ApplyConditionInput = {
  actor: Actor;
  conditionId: string;
  duration?: ToolkitConditionDurationInput | null;
  originUuid?: string | null;
  source?: string | null;
  refreshExisting?: boolean;
};

export type RemoveConditionInput = {
  actor: Actor;
  conditionId: string;
};

export type ConditionApplication = {
  actor: Actor;
  actorId: string | null;
  actorName: string;
  conditionId: string;
  conditionLabel: string;
  effectId: string | null;
  created: boolean;
  refreshed: boolean;
  requestedRounds: number | null;
  combatDurationApplied: boolean;
  warning: string | null;
};

export type ConditionRemoval = {
  actor: Actor;
  actorId: string | null;
  actorName: string;
  conditionId: string;
  removed: number;
};

export type ApplyConditionFailure = {
  actor?: Actor;
  actorId?: string | null;
  actorName?: string;
  conditionId: string;
  reason:
    | "condition-not-found"
    | "invalid-actor"
    | "create-failed"
    | "update-failed";
  message: string;
  cause?: unknown;
};

export type RemoveConditionFailure = {
  actor?: Actor;
  actorId?: string | null;
  actorName?: string;
  conditionId: string;
  reason: "invalid-actor" | "delete-failed";
  message: string;
  cause?: unknown;
};

export type ApplyConditionResult = Result<ConditionApplication, ApplyConditionFailure>;
export type RemoveConditionResult = Result<ConditionRemoval, RemoveConditionFailure>;

type ActorWithEffects = Actor & {
  effects?: EffectCollectionLike | ActiveEffectLike[];
  createEmbeddedDocuments?: (embeddedName: "ActiveEffect", data: ActiveEffectData[]) => Promise<ActiveEffectLike[]>;
};

type EffectCollectionLike = {
  contents?: ActiveEffectLike[];
  find?: (predicate: (effect: ActiveEffectLike) => boolean) => ActiveEffectLike | undefined;
  filter?: (predicate: (effect: ActiveEffectLike) => boolean) => ActiveEffectLike[];
};

type ActiveEffectLike = {
  id?: string | null;
  name?: string | null;
  getFlag?: (scope: string, key: string) => unknown;
  update?: (data: ActiveEffectData) => Promise<unknown> | unknown;
  delete?: () => Promise<unknown> | unknown;
};

type ActiveEffectData = {
  name: string;
  icon: string;
  description: string;
  origin?: string | null;
  disabled: boolean;
  transfer: boolean;
  changes: ToolkitConditionDefinition["changes"];
  duration: Record<string, unknown>;
  flags: Record<string, unknown>;
};

type ToolkitConditionEffectFlag = {
  schemaVersion: 1;
  conditionId: string;
  conditionLabel: string;
  definitionVersion: string;
  source: string | null;
  originUuid: string | null;
  appliedAt: string;
  appliedByUserId: string | null;
  requestedRounds: number | null;
  combatDurationApplied: boolean;
};

export class ConditionEngine {
  constructor(private readonly registry: ConditionRegistry) {}

  listConditions(): ToolkitConditionDefinition[] {
    return this.registry.list();
  }

  getCondition(conditionId: string): Result<ToolkitConditionDefinition, ApplyConditionFailure> {
    const definitionResult = this.registry.get(conditionId);

    if (!definitionResult.ok) {
      return failure({
        conditionId,
        reason: "condition-not-found",
        message: definitionResult.error.message
      });
    }

    return success(definitionResult.value);
  }

  async applyCondition(input: ApplyConditionInput): Promise<ApplyConditionResult> {
    const definitionResult = this.registry.get(input.conditionId);

    if (!definitionResult.ok) {
      return failure({
        actor: input.actor,
        actorId: input.actor?.id ?? null,
        actorName: input.actor?.name ?? "Ator sem nome",
        conditionId: input.conditionId,
        reason: "condition-not-found",
        message: definitionResult.error.message
      });
    }

    const actor = input.actor as ActorWithEffects;

    if (!canCreateActiveEffect(actor)) {
      return failure({
        actor: input.actor,
        actorId: input.actor?.id ?? null,
        actorName: input.actor?.name ?? "Ator sem nome",
        conditionId: input.conditionId,
        reason: "invalid-actor",
        message: `Ator inválido para aplicar condição: ${input.actor?.name ?? "sem nome"}.`
      });
    }

    const definition = definitionResult.value;
    const duration = resolveConditionDuration(input.duration);
    const effectData = createActiveEffectData(definition, input, duration);
    const refreshExisting = input.refreshExisting ?? true;
    const existing = refreshExisting ? findToolkitConditionEffect(actor, definition.id) : null;

    if (existing) {
      try {
        await Promise.resolve(existing.update?.(effectData));
        return success(createApplicationResult(actor, definition, existing.id ?? null, false, true, duration));
      } catch (cause) {
        return failure({
          actor,
          actorId: actor.id ?? null,
          actorName: actor.name ?? "Ator sem nome",
          conditionId: definition.id,
          reason: "update-failed",
          message: `Falha ao atualizar condição ${definition.label} em ${actor.name ?? "ator sem nome"}.`,
          cause
        });
      }
    }

    try {
      const created = await actor.createEmbeddedDocuments("ActiveEffect", [effectData]);
      const effectId = created[0]?.id ?? null;
      return success(createApplicationResult(actor, definition, effectId, true, false, duration));
    } catch (cause) {
      return failure({
        actor,
        actorId: actor.id ?? null,
        actorName: actor.name ?? "Ator sem nome",
        conditionId: definition.id,
        reason: "create-failed",
        message: `Falha ao criar condição ${definition.label} em ${actor.name ?? "ator sem nome"}.`,
        cause
      });
    }
  }

  async removeCondition(input: RemoveConditionInput): Promise<RemoveConditionResult> {
    const actor = input.actor as ActorWithEffects;

    if (!actor || typeof actor !== "object") {
      return failure({
        actor: input.actor,
        actorId: input.actor?.id ?? null,
        actorName: input.actor?.name ?? "Ator sem nome",
        conditionId: input.conditionId,
        reason: "invalid-actor",
        message: "Ator inválido para remover condição."
      });
    }

    const effects = findToolkitConditionEffects(actor, input.conditionId);

    try {
      for (const effect of effects) {
        await Promise.resolve(effect.delete?.());
      }
    } catch (cause) {
      return failure({
        actor,
        actorId: actor.id ?? null,
        actorName: actor.name ?? "Ator sem nome",
        conditionId: input.conditionId,
        reason: "delete-failed",
        message: `Falha ao remover condição ${input.conditionId} de ${actor.name ?? "ator sem nome"}.`,
        cause
      });
    }

    return success({
      actor,
      actorId: actor.id ?? null,
      actorName: actor.name ?? "Ator sem nome",
      conditionId: input.conditionId,
      removed: effects.length
    });
  }
}

function createActiveEffectData(
  definition: ToolkitConditionDefinition,
  input: ApplyConditionInput,
  duration: ReturnType<typeof resolveConditionDuration>
): ActiveEffectData {
  const flags: ToolkitConditionEffectFlag = {
    schemaVersion: 1,
    conditionId: definition.id,
    conditionLabel: definition.label,
    definitionVersion: definition.definitionVersion,
    source: input.source ?? null,
    originUuid: input.originUuid ?? null,
    appliedAt: new Date().toISOString(),
    appliedByUserId: getCurrentUserId(),
    requestedRounds: duration.requestedRounds,
    combatDurationApplied: duration.combatDurationApplied
  };

  return {
    name: definition.label,
    icon: definition.icon,
    description: definition.description,
    origin: input.originUuid ?? undefined,
    disabled: false,
    transfer: false,
    changes: definition.changes.map((change) => ({ ...change })),
    duration: createEffectDurationData(duration.duration),
    flags: {
      [MODULE_ID]: flags
    }
  };
}


function createEffectDurationData(duration: Record<string, unknown>): Record<string, unknown> {
  return {
    seconds: null,
    rounds: null,
    turns: null,
    startTime: null,
    startRound: null,
    startTurn: null,
    combat: null,
    ...duration
  };
}

function createApplicationResult(
  actor: Actor,
  definition: ToolkitConditionDefinition,
  effectId: string | null,
  created: boolean,
  refreshed: boolean,
  duration: ReturnType<typeof resolveConditionDuration>
): ConditionApplication {
  return {
    actor,
    actorId: actor.id ?? null,
    actorName: actor.name ?? "Ator sem nome",
    conditionId: definition.id,
    conditionLabel: definition.label,
    effectId,
    created,
    refreshed,
    requestedRounds: duration.requestedRounds,
    combatDurationApplied: duration.combatDurationApplied,
    warning: duration.warning
  };
}

function canCreateActiveEffect(actor: ActorWithEffects | null | undefined): actor is ActorWithEffects {
  return Boolean(actor && typeof actor.createEmbeddedDocuments === "function");
}

function findToolkitConditionEffect(actor: ActorWithEffects, conditionId: string): ActiveEffectLike | null {
  return findToolkitConditionEffects(actor, conditionId)[0] ?? null;
}

function findToolkitConditionEffects(actor: ActorWithEffects, conditionId: string): ActiveEffectLike[] {
  return getActorEffects(actor).filter((effect) => readToolkitConditionId(effect) === conditionId);
}

function getActorEffects(actor: ActorWithEffects): ActiveEffectLike[] {
  const effects = actor.effects;

  if (!effects) return [];
  if (Array.isArray(effects)) return effects;
  if (Array.isArray(effects.contents)) return effects.contents;
  if (typeof effects.filter === "function") return effects.filter(() => true);

  return [];
}

function readToolkitConditionId(effect: ActiveEffectLike): string | null {
  const flag = effect.getFlag?.(MODULE_ID, "conditionId");
  return typeof flag === "string" ? flag : null;
}

function getCurrentUserId(): string | null {
  return ((game as { user?: { id?: string | null } }).user?.id ?? null) as string | null;
}
