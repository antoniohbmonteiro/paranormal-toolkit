import type { ToolkitConditionDefinition } from "./condition-definition";
import { ConditionEngine, type ApplyConditionResult, type RemoveConditionResult } from "./condition-engine";
import type { ToolkitConditionDurationInput } from "./condition-duration";

export type ToolkitConditionApiApplyOptions = {
  duration?: ToolkitConditionDurationInput | null;
  originUuid?: string | null;
  source?: string | null;
  refreshExisting?: boolean;
};

export type ToolkitConditionApi = {
  list: () => ToolkitConditionDefinition[];
  get: (conditionId: string) => ToolkitConditionDefinition | null;
  applyToActor: (
    actor: Actor,
    conditionId: string,
    options?: ToolkitConditionApiApplyOptions
  ) => Promise<ApplyConditionResult>;
  removeFromActor: (actor: Actor, conditionId: string) => Promise<RemoveConditionResult>;
  applyToSelectedTokens: (
    conditionId: string,
    options?: ToolkitConditionApiApplyOptions
  ) => Promise<ApplyConditionResult[]>;
  removeFromSelectedTokens: (conditionId: string) => Promise<RemoveConditionResult[]>;
};

type TokenLike = {
  actor?: Actor | null;
  document?: {
    actor?: Actor | null;
  } | null;
};

export function createConditionApi(conditionEngine: ConditionEngine): ToolkitConditionApi {
  return {
    list: () => conditionEngine.listConditions(),
    get: (conditionId) => {
      const result = conditionEngine.getCondition(conditionId);
      return result.ok ? result.value : null;
    },
    applyToActor: (actor, conditionId, options = {}) =>
      conditionEngine.applyCondition({
        actor,
        conditionId,
        duration: options.duration,
        originUuid: options.originUuid,
        source: options.source ?? "api.applyToActor",
        refreshExisting: options.refreshExisting
      }),
    removeFromActor: (actor, conditionId) =>
      conditionEngine.removeCondition({
        actor,
        conditionId
      }),
    applyToSelectedTokens: async (conditionId, options = {}) => {
      const actors = getSelectedTokenActors();

      if (actors.length === 0) {
        ui.notifications?.warn("Paranormal Toolkit: selecione ao menos um token para aplicar a condição.");
        return [];
      }

      const results = await Promise.all(
        actors.map((actor) =>
          conditionEngine.applyCondition({
            actor,
            conditionId,
            duration: options.duration,
            originUuid: options.originUuid,
            source: options.source ?? "api.applyToSelectedTokens",
            refreshExisting: options.refreshExisting
          })
        )
      );

      notifyConditionApplicationResults(results);
      return results;
    },
    removeFromSelectedTokens: async (conditionId) => {
      const actors = getSelectedTokenActors();

      if (actors.length === 0) {
        ui.notifications?.warn("Paranormal Toolkit: selecione ao menos um token para remover a condição.");
        return [];
      }

      const results = await Promise.all(
        actors.map((actor) =>
          conditionEngine.removeCondition({
            actor,
            conditionId
          })
        )
      );

      notifyConditionRemovalResults(results);
      return results;
    }
  };
}

function getSelectedTokenActors(): Actor[] {
  const controlled = ((canvas as { tokens?: { controlled?: TokenLike[] } }).tokens?.controlled ?? []) as TokenLike[];
  const actors = new Map<string, Actor>();

  for (const token of controlled) {
    const actor = token.actor ?? token.document?.actor ?? null;
    if (!actor) continue;

    const actorUuid = (actor as { uuid?: string | null }).uuid ?? null;
    const key = actorUuid ?? actor.id ?? actor.name ?? `selected-${actors.size}`;
    actors.set(key, actor);
  }

  return Array.from(actors.values());
}

function notifyConditionApplicationResults(results: ApplyConditionResult[]): void {
  let applied = 0;

  for (const result of results) {
    if (result.ok) {
      applied += 1;

      if (result.value.warning) {
        ui.notifications?.warn(`Paranormal Toolkit: ${result.value.warning}`);
      }

      continue;
    }

    ui.notifications?.warn(`Paranormal Toolkit: ${result.error.message}`);
  }

  if (applied > 0) {
    ui.notifications?.info(`Paranormal Toolkit: condição aplicada em ${applied} ator(es).`);
  }
}

function notifyConditionRemovalResults(results: RemoveConditionResult[]): void {
  let removed = 0;

  for (const result of results) {
    if (result.ok) {
      removed += result.value.removed;
      continue;
    }

    ui.notifications?.warn(`Paranormal Toolkit: ${result.error.message}`);
  }

  ui.notifications?.info(`Paranormal Toolkit: ${removed} efeito(s) removido(s).`);
}
