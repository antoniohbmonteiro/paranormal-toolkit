import { RESISTANCE_SELECTOR } from "./item-use-chat-card-constants";
import { readCastingDifficulty, readResistanceTotal } from "./item-use-card-roll-context";
import {
  resolveResistanceResolutionState,
  type ResistanceResolutionInput,
  type ResistanceResolutionState,
} from "../config/item-use-resistance-gate-policy";

export type ItemUseCardResistanceUiState = {
  hasResistance: boolean;
  difficulty: number | null;
  total: number | null;
  state: ResistanceResolutionState;
};

export type TargetResistanceStatus = "pending" | "failed" | "succeeded";

export type TargetResistanceUiStateInput = {
  hasResistance: boolean;
  difficulty: number | null;
  total: number | null;
  status: TargetResistanceStatus;
};

export function createSingleTargetResistanceUiState(rollCard: HTMLElement): ItemUseCardResistanceUiState {
  return createResistanceUiState({
    hasResistance: Boolean(rollCard.querySelector(RESISTANCE_SELECTOR)),
    difficulty: readCastingDifficulty(rollCard),
    resistanceTotal: readResistanceTotal(rollCard),
  });
}

export function createTargetResistanceUiState(input: TargetResistanceUiStateInput): ItemUseCardResistanceUiState {
  if (!input.hasResistance || input.difficulty === null) {
    return createResistanceUiState({
      hasResistance: input.hasResistance,
      difficulty: input.difficulty,
      resistanceTotal: null,
    });
  }

  if (input.status === "pending") {
    return {
      hasResistance: true,
      difficulty: input.difficulty,
      total: null,
      state: {
        kind: "pending",
        difficulty: input.difficulty,
      },
    };
  }

  const total = input.total ?? 0;

  return {
    hasResistance: true,
    difficulty: input.difficulty,
    total,
    state: {
      kind: input.status === "succeeded" ? "succeeded" : "failed",
      difficulty: input.difficulty,
      total,
    },
  };
}

export function createResistanceUiState(input: ResistanceResolutionInput): ItemUseCardResistanceUiState {
  return {
    hasResistance: input.hasResistance,
    difficulty: input.difficulty,
    total: input.resistanceTotal,
    state: resolveResistanceResolutionState(input),
  };
}
