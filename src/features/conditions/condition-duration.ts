export type ToolkitConditionExpiryEvent = "turnStart" | "turnEnd";

export type ToolkitConditionDurationMode = "none" | "combatantTurn";

export type ToolkitConditionDurationAnchor = {
  mode: "combatantTurn" | "sourceTurn";
  combatId: string;
  combatantId: string | null;
  round: number;
  turn: number | null;
  initiative: number | null;
  time: number;
};

export type ToolkitConditionDurationInput = {
  rounds?: number | null;
  expiry?: ToolkitConditionExpiryEvent | null;
  anchor?: ToolkitConditionDurationAnchor | null;
};

export type ToolkitConditionDurationResolution = {
  duration: Record<string, unknown>;
  start: Record<string, unknown>;
  requestedRounds: number | null;
  combatDurationApplied: boolean;
  combatId: string | null;
  startCombatantId: string | null;
  startInitiative: number | null;
  startRound: number | null;
  startTurn: number | null;
  expiryEvent: ToolkitConditionExpiryEvent | null;
  durationMode: ToolkitConditionDurationMode;
  warning: string | null;
};

type CombatLike = {
  id?: string | null;
  round?: number | null;
  turn?: number | null;
  combatant?: unknown;
  combatants?: unknown;
};

type CombatantLike = {
  id?: string | null;
  initiative?: number | null;
  actor?: { id?: string | null } | null;
  actorId?: string | null;
  token?: { actor?: { id?: string | null } | null; actorId?: string | null } | null;
  document?: { actor?: { id?: string | null } | null; actorId?: string | null } | null;
};

export function resolveConditionDuration(
  input: ToolkitConditionDurationInput | null | undefined,
  anchorActor?: Actor | null
): ToolkitConditionDurationResolution {
  const rounds = normalizeRounds(input?.rounds);

  if (!rounds) {
    return createEmptyDurationResolution(null);
  }

  const anchor = input?.anchor ?? createCurrentCombatDurationAnchor(anchorActor);

  if (!anchor) {
    return {
      ...createEmptyDurationResolution(rounds),
      warning: `Duração de ${rounds} rodada(s) ignorada porque não há combate ativo.`
    };
  }

  const expiryEvent = input?.expiry ?? "turnStart";

  return {
    // A regra de duração de Ordem fica 100% nas flags do Toolkit.
    // Não damos uma duração finita nem evento de expiração nativo para o Foundry,
    // porque o registry de ActiveEffect do Foundry pode marcar o efeito como expirado
    // na virada da rodada antes do turno correto do combatente afetado.
    duration: createIndefiniteFoundryDuration(),
    start: {
      combat: anchor.combatId,
      combatant: anchor.combatantId,
      initiative: anchor.initiative,
      round: anchor.round,
      turn: anchor.turn,
      time: anchor.time
    },
    requestedRounds: rounds,
    combatDurationApplied: true,
    combatId: anchor.combatId,
    startCombatantId: anchor.combatantId,
    startInitiative: anchor.initiative,
    startRound: anchor.round,
    startTurn: anchor.turn,
    expiryEvent,
    durationMode: "combatantTurn",
    warning: null
  };
}

export function createCurrentCombatDurationAnchor(anchorActor?: Actor | null): ToolkitConditionDurationAnchor | null {
  const combat = getActiveCombat();

  if (!combat?.id || !isPositiveInteger(combat.round)) return null;

  const combatants = getCombatants(combat);
  const anchorCombatant = resolveActorCombatant(anchorActor, combatants) ?? getActiveCombatant(combat);
  const combatantId = readString((anchorCombatant as CombatantLike | null)?.id);
  const initiative = readFiniteNumber((anchorCombatant as CombatantLike | null)?.initiative);
  const startTurn = resolveCombatantTurn(combat, anchorCombatant, combatants);

  return {
    mode: "combatantTurn",
    combatId: combat.id,
    combatantId,
    round: combat.round,
    turn: startTurn,
    initiative,
    time: getWorldTime()
  };
}

function createIndefiniteFoundryDuration(): Record<string, unknown> {
  return {
    value: null,
    units: "seconds",
    expiry: null
  };
}

function createEmptyDurationResolution(requestedRounds: number | null): ToolkitConditionDurationResolution {
  return {
    duration: {},
    start: {},
    requestedRounds,
    combatDurationApplied: false,
    combatId: null,
    startCombatantId: null,
    startInitiative: null,
    startRound: null,
    startTurn: null,
    expiryEvent: null,
    durationMode: "none",
    warning: null
  };
}

function resolveActorCombatant(
  actor: Actor | null | undefined,
  combatants: CombatantLike[]
): CombatantLike | null {
  if (!actor?.id) return null;
  return combatants.find((combatant) => getCombatantActorId(combatant) === actor.id) ?? null;
}

function resolveCombatantTurn(
  combat: CombatLike,
  sourceCombatant: CombatantLike | null,
  combatants: CombatantLike[]
): number | null {
  const combatantId = readString(sourceCombatant?.id);

  if (combatantId) {
    const index = combatants.findIndex((combatant) => combatant.id === combatantId);
    if (index >= 0) return index;
  }

  return isNonNegativeInteger(combat.turn) ? combat.turn : null;
}

function getActiveCombatant(combat: CombatLike): CombatantLike | null {
  return isCombatantLike(combat.combatant) ? combat.combatant : null;
}

function getCombatants(combat: CombatLike): CombatantLike[] {
  const collection = combat.combatants;

  if (Array.isArray(collection)) return collection.filter(isCombatantLike);

  if (collection && typeof collection === "object") {
    const contents = (collection as { contents?: unknown }).contents;
    if (Array.isArray(contents)) return contents.filter(isCombatantLike);

    const values = (collection as { values?: () => Iterable<unknown> }).values;
    if (typeof values === "function") {
      return Array.from(values.call(collection)).filter(isCombatantLike);
    }
  }

  return [];
}

function getCombatantActorId(combatant: CombatantLike): string | null {
  return readString(combatant.actor?.id) ??
    readString(combatant.actorId) ??
    readString(combatant.token?.actor?.id) ??
    readString(combatant.token?.actorId) ??
    readString(combatant.document?.actor?.id) ??
    readString(combatant.document?.actorId);
}

function normalizeRounds(value: number | null | undefined): number | null {
  if (!isPositiveInteger(value)) return null;
  return Math.trunc(value);
}

function getActiveCombat(): CombatLike | null {
  return ((game as { combat?: CombatLike | null }).combat ?? null) as CombatLike | null;
}

function getWorldTime(): number {
  const time = (game as { time?: { worldTime?: unknown } }).time?.worldTime;
  return typeof time === "number" && Number.isFinite(time) ? time : 0;
}

function isCombatantLike(value: unknown): value is CombatantLike {
  return Boolean(value && typeof value === "object");
}

function readString(value: unknown): string | null {
  return typeof value === "string" && value.length > 0 ? value : null;
}

function readFiniteNumber(value: unknown): number | null {
  return typeof value === "number" && Number.isFinite(value) ? value : null;
}

function isPositiveInteger(value: unknown): value is number {
  return typeof value === "number" && Number.isInteger(value) && value > 0;
}

function isNonNegativeInteger(value: unknown): value is number {
  return typeof value === "number" && Number.isInteger(value) && value >= 0;
}
