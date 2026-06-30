import { MODULE_ID } from "../../constants";
import { failure, type Result, success } from "../../core/result";
import type { ToolkitConditionDefinition } from "./condition-definition";
import {
  resolveConditionDuration,
  type ToolkitConditionDurationInput,
  type ToolkitConditionDurationMode,
  type ToolkitConditionExpiryEvent
} from "./condition-duration";
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
  combatant?: { id?: string | null } | null;
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
  start?: Record<string, unknown> | null;
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
  start: Record<string, unknown>;
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
  startCombatantId: string | null;
  startInitiative: number | null;
  startRound: number | null;
  startTurn: number | null;
  expiryEvent: ToolkitConditionExpiryEvent | null;
  durationMode: ToolkitConditionDurationMode;
  deleteOnExpire: boolean;
  expiresWithCombat: boolean;
};

type ToolkitConditionEffectMetadata = {
  conditionId: string | null;
  requestedRounds: number | null;
  combatDurationApplied: boolean;
  combatId: string | null;
  startCombatantId: string | null;
  startInitiative: number | null;
  startRound: number | null;
  startTurn: number | null;
  expiryEvent: ToolkitConditionExpiryEvent | null;
  durationMode: ToolkitConditionDurationMode;
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
    const duration = resolveConditionDuration(input.duration, actor);
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

    const canonicalConditionId = this.resolveCanonicalConditionId(input.conditionId);
    const effects = findToolkitConditionEffects(actor, canonicalConditionId);
    let removed = 0;

    try {
      for (const effect of effects) {
        const deletion = await deleteEffectIfStillPresent(actor, effect);
        if (deletion === "deleted") removed += 1;
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
      conditionId: canonicalConditionId,
      removed
    });
  }

  private resolveCanonicalConditionId(conditionId: string): string {
    const definitionResult = this.registry.get(conditionId);
    return definitionResult.ok ? definitionResult.value.id : conditionId;
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
          const deletion = await deleteEffectIfStillPresent(actor, effect);
          if (deletion === "deleted") removedEffects += 1;
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
    startCombatantId: duration.startCombatantId,
    startInitiative: duration.startInitiative,
    startRound: duration.startRound,
    startTurn: duration.startTurn,
    expiryEvent: duration.expiryEvent,
    durationMode: duration.durationMode,
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
    start: createEffectStartData(duration.start),
    flags: {
      [MODULE_ID]: flags
    }
  };
}

function createEffectDurationData(duration: Record<string, unknown>): Record<string, unknown> {
  return {
    value: null,
    units: "rounds",
    expiry: null,
    ...duration
  };
}

function createEffectStartData(start: Record<string, unknown>): Record<string, unknown> {
  return {
    combat: null,
    combatant: null,
    initiative: null,
    round: null,
    turn: null,
    time: getWorldTime(),
    ...start
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

  const combat = getActiveCombat();

  if (metadata.durationMode === "combatantTurn") {
    return isCombatantTurnDurationExpired(metadata, combat);
  }

  if (isEffectMarkedExpiredByFoundry(effect)) return true;

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

function isCombatantTurnDurationExpired(metadata: ToolkitConditionEffectMetadata, combat: CombatLike | null): boolean {
  if (!combat?.id) return true;
  if (metadata.combatId && metadata.combatId !== combat.id) return true;
  if (!isPositiveInteger(metadata.startRound) || !isPositiveInteger(metadata.requestedRounds)) return false;
  if (!isPositiveInteger(combat.round)) return false;

  const targetRound = metadata.startRound + metadata.requestedRounds;

  if (combat.round < targetRound) return false;
  if (combat.round > targetRound) return true;

  const currentCombatantId = getCurrentCombatantId(combat);
  if (metadata.startCombatantId && currentCombatantId === metadata.startCombatantId) return true;

  if (isNonNegativeInteger(metadata.startTurn) && isNonNegativeInteger(combat.turn)) {
    return combat.turn >= metadata.startTurn;
  }

  return false;
}

function getCurrentCombatantId(combat: CombatLike): string | null {
  return readString(combat.combatant?.id);
}

function readToolkitConditionEffectMetadata(effect: ActiveEffectLike): ToolkitConditionEffectMetadata {
  const duration = effect.duration && typeof effect.duration === "object" ? effect.duration : {};
  const start = effect.start && typeof effect.start === "object" ? effect.start : {};

  return {
    conditionId: readStringFlag(effect, "conditionId"),
    requestedRounds: readNumberFlag(effect, "requestedRounds") ?? readPositiveNumber(duration.value) ?? readPositiveNumber(duration.rounds),
    combatDurationApplied: readBooleanFlag(effect, "combatDurationApplied"),
    combatId: readStringFlag(effect, "combatId") ?? readString(start.combat) ?? readString(duration.combat),
    startCombatantId: readStringFlag(effect, "startCombatantId") ?? readString(start.combatant),
    startInitiative: readFiniteNumberFlag(effect, "startInitiative") ?? readFiniteNumber(start.initiative),
    startRound: readNumberFlag(effect, "startRound") ?? readPositiveNumber(start.round) ?? readPositiveNumber(duration.startRound),
    startTurn: readNonNegativeNumberFlag(effect, "startTurn") ?? readNonNegativeNumber(start.turn) ?? readNonNegativeNumber(duration.startTurn),
    expiryEvent: readExpiryEventFlag(effect, "expiryEvent") ?? readExpiryEvent(duration.expiry),
    durationMode: readDurationModeFlag(effect, "durationMode"),
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

type EffectDeletionResult = "deleted" | "missing";

async function deleteEffectIfStillPresent(
  actor: ActorWithEffects,
  effect: ActiveEffectLike
): Promise<EffectDeletionResult> {
  const effectId = effect.id ?? null;
  const currentEffect = effectId ? findActorEffectById(actor, effectId) : effect;

  if (!currentEffect) return "missing";

  try {
    await Promise.resolve(currentEffect.delete?.());
    return "deleted";
  } catch (cause) {
    if (isMissingEmbeddedEffectError(cause)) return "missing";
    throw cause;
  }
}

function findActorEffectById(actor: ActorWithEffects, effectId: string): ActiveEffectLike | null {
  return getActorEffects(actor).find((effect) => effect.id === effectId) ?? null;
}

function isMissingEmbeddedEffectError(cause: unknown): boolean {
  const message = cause instanceof Error ? cause.message : String(cause);
  return message.includes("does not exist in the EmbeddedCollectionDelta collection") ||
    message.includes("does not exist in the EmbeddedCollection collection");
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

function readNonNegativeNumberFlag(effect: ActiveEffectLike, key: string): number | null {
  return readNonNegativeNumber(effect.getFlag?.(MODULE_ID, key));
}

function readFiniteNumberFlag(effect: ActiveEffectLike, key: string): number | null {
  return readFiniteNumber(effect.getFlag?.(MODULE_ID, key));
}

function readExpiryEventFlag(effect: ActiveEffectLike, key: string): ToolkitConditionExpiryEvent | null {
  return readExpiryEvent(effect.getFlag?.(MODULE_ID, key));
}

function readDurationModeFlag(effect: ActiveEffectLike, key: string): ToolkitConditionEffectMetadata["durationMode"] {
  const value = effect.getFlag?.(MODULE_ID, key);
  if (value === "combatantTurn" || value === "sourceTurn") return "combatantTurn";
  return "none";
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

function readNonNegativeNumber(value: unknown): number | null {
  if (!isNonNegativeInteger(value)) return null;
  return Math.trunc(value);
}

function readFiniteNumber(value: unknown): number | null {
  return typeof value === "number" && Number.isFinite(value) ? value : null;
}

function readExpiryEvent(value: unknown): ToolkitConditionExpiryEvent | null {
  return value === "turnStart" || value === "turnEnd" ? value : null;
}

function isActorWithEffects(value: unknown): value is ActorWithEffects {
  return Boolean(value && typeof value === "object" && "effects" in value);
}

function getActiveCombat(): CombatLike | null {
  return ((game as { combat?: CombatLike | null }).combat ?? null) as CombatLike | null;
}

function getWorldTime(): number {
  const worldTime = (game as { time?: { worldTime?: unknown } }).time?.worldTime;
  return typeof worldTime === "number" && Number.isFinite(worldTime) ? worldTime : 0;
}

function isPositiveInteger(value: unknown): value is number {
  return typeof value === "number" && Number.isInteger(value) && value > 0;
}

function isNonNegativeInteger(value: unknown): value is number {
  return typeof value === "number" && Number.isInteger(value) && value >= 0;
}

function getCurrentUserId(): string | null {
  return ((game as { user?: { id?: string | null } }).user?.id ?? null) as string | null;
}
