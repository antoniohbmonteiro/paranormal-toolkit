export type ToolkitConditionDurationInput = {
  rounds?: number | null;
};

export type ToolkitConditionDurationResolution = {
  duration: Record<string, unknown>;
  requestedRounds: number | null;
  combatDurationApplied: boolean;
  warning: string | null;
};

type CombatLike = {
  id?: string | null;
  round?: number | null;
  turn?: number | null;
};

export function resolveConditionDuration(
  input: ToolkitConditionDurationInput | null | undefined
): ToolkitConditionDurationResolution {
  const rounds = normalizeRounds(input?.rounds);

  if (!rounds) {
    return {
      duration: {},
      requestedRounds: null,
      combatDurationApplied: false,
      warning: null
    };
  }

  const combat = getActiveCombat();

  if (!combat?.id || !isPositiveInteger(combat.round)) {
    return {
      duration: {},
      requestedRounds: rounds,
      combatDurationApplied: false,
      warning: `Duração de ${rounds} rodada(s) ignorada porque não há combate ativo.`
    };
  }

  return {
    duration: {
      rounds,
      startRound: combat.round,
      startTurn: isNonNegativeInteger(combat.turn) ? combat.turn : 0,
      combat: combat.id
    },
    requestedRounds: rounds,
    combatDurationApplied: true,
    warning: null
  };
}

function normalizeRounds(value: number | null | undefined): number | null {
  if (!isPositiveInteger(value)) return null;
  return Math.trunc(value);
}

function getActiveCombat(): CombatLike | null {
  return ((game as { combat?: CombatLike | null }).combat ?? null) as CombatLike | null;
}

function isPositiveInteger(value: unknown): value is number {
  return typeof value === "number" && Number.isInteger(value) && value > 0;
}

function isNonNegativeInteger(value: unknown): value is number {
  return typeof value === "number" && Number.isInteger(value) && value >= 0;
}
