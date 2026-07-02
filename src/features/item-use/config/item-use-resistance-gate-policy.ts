export const ITEM_USE_RESISTANCE_GATE_MODES = ["strict", "open"] as const;

export type ItemUseResistanceGateMode = (typeof ITEM_USE_RESISTANCE_GATE_MODES)[number];

export const DEFAULT_ITEM_USE_RESISTANCE_GATE_MODE: ItemUseResistanceGateMode = "strict";

export type ResistanceResolutionState =
  | {
      kind: "none";
    }
  | {
      kind: "pending";
      difficulty: number;
    }
  | {
      kind: "failed";
      difficulty: number;
      total: number;
    }
  | {
      kind: "succeeded";
      difficulty: number;
      total: number;
    };

export type ResistanceResolutionInput = {
  hasResistance: boolean;
  difficulty: number | null;
  resistanceTotal: number | null;
};

export function coerceItemUseResistanceGateMode(value: unknown): ItemUseResistanceGateMode {
  return ITEM_USE_RESISTANCE_GATE_MODES.includes(value as ItemUseResistanceGateMode)
    ? (value as ItemUseResistanceGateMode)
    : DEFAULT_ITEM_USE_RESISTANCE_GATE_MODE;
}

export function resolveResistanceResolutionState(input: ResistanceResolutionInput): ResistanceResolutionState {
  if (!input.hasResistance || input.difficulty === null) {
    return { kind: "none" };
  }

  if (input.resistanceTotal === null) {
    return {
      kind: "pending",
      difficulty: input.difficulty,
    };
  }

  if (input.resistanceTotal >= input.difficulty) {
    return {
      kind: "succeeded",
      difficulty: input.difficulty,
      total: input.resistanceTotal,
    };
  }

  return {
    kind: "failed",
    difficulty: input.difficulty,
    total: input.resistanceTotal,
  };
}

export function shouldBlockPendingResistanceAction(
  mode: ItemUseResistanceGateMode,
  state: ResistanceResolutionState,
): boolean {
  return mode === "strict" && state.kind === "pending";
}

export function canApplyDamageWithResistanceGate(
  mode: ItemUseResistanceGateMode,
  state: ResistanceResolutionState,
): boolean {
  return !shouldBlockPendingResistanceAction(mode, state);
}

export function canApplyEffectWithResistanceGate(
  mode: ItemUseResistanceGateMode,
  state: ResistanceResolutionState,
): boolean {
  if (state.kind === "succeeded") return false;
  return !shouldBlockPendingResistanceAction(mode, state);
}
