import { MODULE_ID } from "../../constants";
import { failure, type Result, success } from "../../core/result";
import type { ToolkitConditionDefinition } from "./condition-definition";
import { resolveConditionDuration, type ToolkitConditionDurationInput } from "./condition-duration";
import { ConditionRegistry } from "./condition-registry";

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

export type CleanupExpiredConditionsInput = {
  reason?: "ready" | "combat-updated" | "combat-deleted" | "manual" | string;
  combatId?: string | null;
  removeAllForCombat?: boolean;
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

export type ConditionCleanupFailure = {
  actorId: string | null;
  actorName: string;
  effectId: string | null;
  conditionId: string | null;
  message: string;
  cause?: unknown;
};

export type ConditionCleanupSummary = {
  reason: string;
  scannedActors: number;
  scannedEffects: number;
  removedEffects: number;
  failures: ConditionCleanupFailure[];
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

type ActorCollectionLike = {
  contents?: unknown[];
  forEach?: (callback: (actor: unknown) => void) => void;
};

type TokenLike = {
  actor?: unknown;
  document?: {
    actor?: unknown;
  } | null;
};

type CombatLike = {
  id?: string | null;
  round?: number | null;
  turn?: number | null;
};

type EffectCollectionLike = {
  contents?: ActiveEffectLike[];
  find?: (predicate: (effect: ActiveEffectLike) => boolean) => ActiveEffectLike | undefined;
  filter?: (predicate: (effect: ActiveEffectLike) => boolean) => ActiveEffectLike[];
};

type ActiveEffectLike = {
  id?: string | null;
  name?: string | null;
  duration?: Record<string, unknown> | null;
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
  combatId: string | null;
  startRound: number | null;
  startTurn: number | null;
  deleteOnExpire: boolean;
  expiresWithCombat: boolean;
};

type ToolkitConditionEffectMetadata = {
  conditionId: string | null;
  requestedRounds: number | null;
  combatDurationApplied: boolean;
  combatId: string | null;
  startRound: number | null;
  deleteOnExpire: boolean;
  expiresWithCombat: boolean;
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

  async cleanupExpiredConditions(input: CleanupExpiredConditionsInput = {}): Promise<ConditionCleanupSummary> {
    const actors = getKnownActors();
    const failures: ConditionCleanupFailure[] = [];
    let scannedEffects = 0;
    let removedEffects = 0;

    for (const actor of actors) {
      const effects = getActorEffects(actor);
      scannedEffects += effects.length;

      for (const effect of effects) {
        if (!shouldRemoveExpiredToolkitCondition(effect, input)) continue;

        const metadata = readToolkitConditionEffectMetadata(effect);

        try {
          await Promise.resolve(effect.delete?.());
          removedEffects += 1;
        } catch (cause) {
          failures.push({
            actorId: actor.id ?? null,
            actorName: actor.name ?? "Ator sem nome",
            effectId: effect.id ?? null,
            conditionId: metadata.conditionId,
            message: `Falha ao remover condição expirada ${metadata.conditionId ?? effect.name ?? "desconhecida"} de ${actor.name ?? "ator sem nome"}.`,
            cause
          });
        }
      }
    }

    return {
      reason: input.reason ?? "manual",
      scannedActors: actors.length,
      scannedEffects,
      removedEffects,
      failures
    };
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
    combatDurationApplied: duration.combatDurationApplied,
    combatId: duration.combatId,
    startRound: duration.startRound,
    startTurn: duration.startTurn,
    deleteOnExpire: duration.combatDurationApplied,
    expiresWithCombat: duration.combatDurationApplied
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

function shouldRemoveExpiredToolkitCondition(
  effect: ActiveEffectLike,
  input: CleanupExpiredConditionsInput
): boolean {
  const metadata = readToolkitConditionEffectMetadata(effect);

  if (!metadata.conditionId) return false;
  if (!isToolkitTemporaryCondition(metadata)) return false;

  if (input.removeAllForCombat === true) {
    return Boolean(input.combatId && metadata.combatId === input.combatId);
  }

  if (isEffectMarkedExpiredByFoundry(effect)) return true;

  const combat = getActiveCombat();

  if (!combat?.id) return true;
  if (metadata.combatId && metadata.combatId !== combat.id) return true;
  if (!isPositiveInteger(metadata.startRound) || !isPositiveInteger(metadata.requestedRounds)) return false;
  if (!isPositiveInteger(combat.round)) return false;

  return combat.round >= metadata.startRound + metadata.requestedRounds;
}

function isToolkitTemporaryCondition(metadata: ToolkitConditionEffectMetadata): boolean {
  if (metadata.deleteOnExpire) return true;
  if (metadata.expiresWithCombat) return true;
  return metadata.combatDurationApplied && isPositiveInteger(metadata.requestedRounds);
}

function isEffectMarkedExpiredByFoundry(effect: ActiveEffectLike): boolean {
  const duration = effect.duration;
  if (!duration || typeof duration !== "object") return false;

  if (duration.expired === true) return true;

  const remaining = duration.remaining;
  return typeof remaining === "number" && Number.isFinite(remaining) && remaining <= 0;
}

function readToolkitConditionEffectMetadata(effect: ActiveEffectLike): ToolkitConditionEffectMetadata {
  const duration = effect.duration && typeof effect.duration === "object" ? effect.duration : {};

  return {
    conditionId: readStringFlag(effect, "conditionId"),
    requestedRounds: readNumberFlag(effect, "requestedRounds") ?? readPositiveNumber(duration.rounds),
    combatDurationApplied: readBooleanFlag(effect, "combatDurationApplied"),
    combatId: readStringFlag(effect, "combatId") ?? readString(duration.combat),
    startRound: readNumberFlag(effect, "startRound") ?? readPositiveNumber(duration.startRound),
    deleteOnExpire: readBooleanFlag(effect, "deleteOnExpire"),
    expiresWithCombat: readBooleanFlag(effect, "expiresWithCombat")
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

function getKnownActors(): ActorWithEffects[] {
  const actors = new Map<string, ActorWithEffects>();

  const actorCollection = (game as { actors?: ActorCollectionLike | null }).actors;

  if (Array.isArray(actorCollection?.contents)) {
    for (const actor of actorCollection.contents) {
      addActorToMap(actors, actor);
    }
  }

  if (typeof actorCollection?.forEach === "function") {
    actorCollection.forEach((actor) => {
      addActorToMap(actors, actor);
    });
  }

  for (const token of getCanvasTokens()) {
    addActorToMap(actors, token.actor);
    addActorToMap(actors, token.document?.actor);
  }

  return Array.from(actors.values());
}

function addActorToMap(actors: Map<string, ActorWithEffects>, actor: unknown): void {
  if (!isActorWithEffects(actor)) return;

  const uuid = readString((actor as { uuid?: unknown }).uuid);
  const key = uuid ?? actor.id ?? actor.name ?? `actor-${actors.size}`;
  actors.set(key, actor);
}

function getCanvasTokens(): TokenLike[] {
  const placeables = (canvas as { tokens?: { placeables?: unknown[] } } | undefined)?.tokens?.placeables;
  return Array.isArray(placeables) ? (placeables as TokenLike[]) : [];
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
  return readStringFlag(effect, "conditionId");
}

function readStringFlag(effect: ActiveEffectLike, key: string): string | null {
  return readString(effect.getFlag?.(MODULE_ID, key));
}

function readNumberFlag(effect: ActiveEffectLike, key: string): number | null {
  return readPositiveNumber(effect.getFlag?.(MODULE_ID, key));
}

function readBooleanFlag(effect: ActiveEffectLike, key: string): boolean {
  return effect.getFlag?.(MODULE_ID, key) === true;
}

function readString(value: unknown): string | null {
  return typeof value === "string" && value.length > 0 ? value : null;
}

function readPositiveNumber(value: unknown): number | null {
  if (!isPositiveInteger(value)) return null;
  return Math.trunc(value);
}

function isActorWithEffects(value: unknown): value is ActorWithEffects {
  return Boolean(value && typeof value === "object" && "effects" in value);
}

function getActiveCombat(): CombatLike | null {
  return ((game as { combat?: CombatLike | null }).combat ?? null) as CombatLike | null;
}

function isPositiveInteger(value: unknown): value is number {
  return typeof value === "number" && Number.isInteger(value) && value > 0;
}

function getCurrentUserId(): string | null {
  return ((game as { user?: { id?: string | null } }).user?.id ?? null) as string | null;
}
