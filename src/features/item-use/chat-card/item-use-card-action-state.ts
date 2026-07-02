import {
  shouldBlockPendingResistanceAction,
  type ItemUseResistanceGateMode,
  type ResistanceResolutionState,
} from "../config/item-use-resistance-gate-policy";

export type ItemUseActionStateKind =
  | "available"
  | "waiting-resistance"
  | "resisted"
  | "applied"
  | "unavailable";

export type ItemUseActionState = {
  kind: ItemUseActionStateKind;
  enabled: boolean;
  label: string;
  compactLabel: string;
  reason: string | null;
};

type ResolveActionStateInput = {
  resistanceGateMode: ItemUseResistanceGateMode;
  resistanceState: ResistanceResolutionState;
  alreadyApplied?: boolean;
  unavailable?: boolean;
  labels?: Partial<ItemUseActionStateLabels>;
};

type ItemUseActionStateLabels = {
  available: string;
  availableCompact: string;
  waitingResistance: string;
  waitingResistanceCompact: string;
  resisted: string;
  resistedCompact: string;
  applied: string;
  appliedCompact: string;
  unavailable: string;
  unavailableCompact: string;
};

const DAMAGE_LABELS: ItemUseActionStateLabels = {
  available: "Aplicar dano",
  availableCompact: "Dano",
  waitingResistance: "Role resistência",
  waitingResistanceCompact: "Role res.",
  resisted: "Aplicar metade",
  resistedCompact: "½ dano",
  applied: "Dano aplicado",
  appliedCompact: "Aplicado",
  unavailable: "Dano indisponível",
  unavailableCompact: "Sem dano",
};

const EFFECT_LABELS: ItemUseActionStateLabels = {
  available: "Aplicar efeito",
  availableCompact: "Efeito",
  waitingResistance: "Role resistência",
  waitingResistanceCompact: "Role res.",
  resisted: "Resistiu ao efeito",
  resistedCompact: "Resistiu",
  applied: "Efeito aplicado",
  appliedCompact: "Aplicado",
  unavailable: "Efeito indisponível",
  unavailableCompact: "Sem efeito",
};

export function resolveDamageActionState(input: ResolveActionStateInput): ItemUseActionState {
  return resolveActionState(input, DAMAGE_LABELS, false);
}

export function resolveEffectActionState(input: ResolveActionStateInput): ItemUseActionState {
  return resolveActionState(input, EFFECT_LABELS, true);
}

export function isActionWaitingForResistance(state: ItemUseActionState): boolean {
  return state.kind === "waiting-resistance";
}

export function isActionResisted(state: ItemUseActionState): boolean {
  return state.kind === "resisted";
}

function resolveActionState(
  input: ResolveActionStateInput,
  defaultLabels: ItemUseActionStateLabels,
  blocksOnSuccessfulResistance: boolean,
): ItemUseActionState {
  const labels = { ...defaultLabels, ...input.labels };

  if (input.alreadyApplied) {
    return createActionState("applied", false, labels.applied, labels.appliedCompact, null);
  }

  if (input.unavailable) {
    return createActionState("unavailable", false, labels.unavailable, labels.unavailableCompact, labels.unavailable);
  }

  if (shouldBlockPendingResistanceAction(input.resistanceGateMode, input.resistanceState)) {
    return createActionState(
      "waiting-resistance",
      false,
      labels.waitingResistance,
      labels.waitingResistanceCompact,
      "Role a resistência antes de aplicar esta ação.",
    );
  }

  if (blocksOnSuccessfulResistance && input.resistanceState.kind === "succeeded") {
    return createActionState("resisted", false, labels.resisted, labels.resistedCompact, labels.resisted);
  }

  return createActionState("available", true, labels.available, labels.availableCompact, null);
}

function createActionState(
  kind: ItemUseActionStateKind,
  enabled: boolean,
  label: string,
  compactLabel: string,
  reason: string | null,
): ItemUseActionState {
  return {
    kind,
    enabled,
    label,
    compactLabel,
    reason,
  };
}
