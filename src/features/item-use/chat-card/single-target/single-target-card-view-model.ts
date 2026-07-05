import type { ItemUseActionState } from "../item-use-card-action-state";
import { isActionResisted, isActionWaitingForResistance } from "../item-use-card-action-state";
import { createSingleTargetResistanceUiState } from "../item-use-card-resistance-state";
import type {
  ItemUseResistanceGateMode,
  ResistanceResolutionState,
} from "../../config/item-use-resistance-gate-policy";
import { getItemUseDamageResolutionMode, getItemUseResistanceGateMode } from "../../item-use-settings";
import { createAssistedTargetActionViewModel } from "../../assisted-actions/assisted-action-view-model";

export type SingleTargetEffectActionKind = "hidden" | "waiting-resistance" | "resisted" | "applied" | "applicable";

export type SingleTargetEffectViewModelInput = {
  rollCard: HTMLElement;
  effectLabel: string;
  applied?: boolean;
};

export type SingleTargetEffectViewModel = {
  kind: SingleTargetEffectActionKind;
  visible: boolean;
  enabled: boolean;
  applied: boolean;
  waitingForResistance: boolean;
  resisted: boolean;
  applicable: boolean;
  effectLabel: string;
  displayLabel: string;
  actionLabel: string;
  compactLabel: string;
  reason: string | null;
  resistanceState: ResistanceResolutionState;
  actionState: ItemUseActionState;
};

export function createSingleTargetEffectViewModel(input: SingleTargetEffectViewModelInput): SingleTargetEffectViewModel {
  const resistanceGateMode = getResistanceGateModeSafe();
  const resistanceState = createSingleTargetResistanceUiState(input.rollCard).state;
  const assistedTarget = createAssistedTargetActionViewModel({
    targetId: "single-target",
    targetName: "Alvo",
    resistanceGateMode,
    resistanceState,
    damage: null,
    effect: { conditionLabel: input.effectLabel },
  });
  const actionState = assistedTarget.policy.effectActionState;
  const waitingForResistance = isActionWaitingForResistance(actionState);
  const resisted = isActionResisted(actionState);

  if (input.applied) {
    return createEffectViewModel({
      kind: "applied",
      visible: true,
      enabled: false,
      applied: true,
      waitingForResistance,
      resisted,
      applicable: false,
      effectLabel: input.effectLabel,
      actionState,
      resistanceState,
    });
  }

  if (!assistedTarget.policy.canShowApplyEffect) {
    return createEffectViewModel({
      kind: "hidden",
      visible: false,
      enabled: false,
      applied: false,
      waitingForResistance,
      resisted,
      applicable: false,
      effectLabel: input.effectLabel,
      actionState,
      resistanceState,
    });
  }

  if (waitingForResistance) {
    return createEffectViewModel({
      kind: "waiting-resistance",
      visible: true,
      enabled: false,
      applied: false,
      waitingForResistance: true,
      resisted: false,
      applicable: false,
      effectLabel: input.effectLabel,
      actionState,
      resistanceState,
    });
  }

  if (resisted) {
    return createEffectViewModel({
      kind: "resisted",
      visible: true,
      enabled: false,
      applied: false,
      waitingForResistance: false,
      resisted: true,
      applicable: false,
      effectLabel: input.effectLabel,
      actionState,
      resistanceState,
    });
  }

  return createEffectViewModel({
    kind: "applicable",
    visible: true,
    enabled: true,
    applied: false,
    waitingForResistance: false,
    resisted: false,
    applicable: true,
    effectLabel: input.effectLabel,
    actionState,
    resistanceState,
  });
}

type CreateEffectViewModelInput = {
  kind: SingleTargetEffectActionKind;
  visible: boolean;
  enabled: boolean;
  applied: boolean;
  waitingForResistance: boolean;
  resisted: boolean;
  applicable: boolean;
  effectLabel: string;
  actionState: ItemUseActionState;
  resistanceState: ResistanceResolutionState;
};

function createEffectViewModel(input: CreateEffectViewModelInput): SingleTargetEffectViewModel {
  return {
    ...input,
    displayLabel: input.effectLabel,
    actionLabel: input.actionState.label,
    compactLabel: input.actionState.compactLabel,
    reason: input.actionState.reason,
  };
}

export type SingleTargetDamageResolutionState = "manual" | "pending" | "resisted" | "failed";
export type SingleTargetDamageResolutionMode = "manual" | "assisted";
export type SingleTargetDamageButtonKind = "normal" | "half";

export type SingleTargetDamageButtonViewModel = {
  kind: SingleTargetDamageButtonKind;
  visible: boolean;
  enabled: boolean;
  applied: boolean;
  skipped: boolean;
  waitingLabel?: string;
};

type SingleTargetDamageViewModelInput = {
  rollCard: HTMLElement;
  normalButtonApplied?: boolean;
  halfButtonApplied?: boolean;
  normalButtonSkipped?: boolean;
  halfButtonSkipped?: boolean;
};

export type SingleTargetDamageViewModel = {
  mode: SingleTargetDamageResolutionMode;
  canShowApplyDamage: boolean;
  waitingForResistance: boolean;
  resistanceState: ResistanceResolutionState;
  actionState: ItemUseActionState;
  normalButton: SingleTargetDamageButtonViewModel;
  halfButton: SingleTargetDamageButtonViewModel;
  summary: {
    state: SingleTargetDamageResolutionState;
    message: string | null;
  };
};

export function createSingleTargetDamageViewModel(input: SingleTargetDamageViewModelInput): SingleTargetDamageViewModel {
  const { rollCard } = input;
  const mode = getDamageResolutionModeSafe();
  const resistanceGateMode = getResistanceGateModeSafe();
  const resistanceState = createSingleTargetResistanceUiState(rollCard).state;
  const assistedTarget = createAssistedTargetActionViewModel({
    targetId: "single-target",
    targetName: "Alvo",
    resistanceGateMode,
    resistanceState,
    damage: { normalAmount: null, halfAmount: null },
    effect: null,
  });
  const actionState = assistedTarget.policy.damageActionState;
  const waitingForResistance = isActionWaitingForResistance(actionState);
  const appliedKind = resolveAppliedDamageKind(input);

  if (appliedKind) {
    return {
      mode,
      canShowApplyDamage: true,
      waitingForResistance,
      resistanceState,
      actionState,
      normalButton: createDamageButtonViewModel(
        "normal",
        appliedKind === "normal",
        false,
        appliedKind === "normal",
        Boolean(input.normalButtonSkipped)
      ),
      halfButton: createDamageButtonViewModel(
        "half",
        appliedKind === "half",
        false,
        appliedKind === "half",
        Boolean(input.halfButtonSkipped)
      ),
      summary: createResolvedDamageSummary(resistanceState),
    };
  }

  if (!assistedTarget.policy.canShowApplyDamage) {
    return {
      mode,
      canShowApplyDamage: false,
      waitingForResistance,
      resistanceState,
      actionState,
      normalButton: createDamageButtonViewModel("normal", false, false, false, Boolean(input.normalButtonSkipped), actionState.label),
      halfButton: createDamageButtonViewModel("half", false, false, false, Boolean(input.halfButtonSkipped), actionState.label),
      summary: {
        state: waitingForResistance ? "pending" : "manual",
        message: waitingForResistance ? actionState.reason : null,
      },
    };
  }

  if (waitingForResistance) {
    return {
      mode,
      canShowApplyDamage: true,
      waitingForResistance,
      resistanceState,
      actionState,
      normalButton: createDamageButtonViewModel("normal", true, false, false, Boolean(input.normalButtonSkipped), actionState.label),
      halfButton: createDamageButtonViewModel("half", false, false, false, Boolean(input.halfButtonSkipped)),
      summary: {
        state: "pending",
        message: actionState.reason ?? "Role resistência para aplicar dano.",
      },
    };
  }

  if (mode !== "assisted") {
    return {
      mode,
      canShowApplyDamage: true,
      waitingForResistance,
      resistanceState,
      actionState,
      normalButton: createDamageButtonViewModel("normal", true, true, false, Boolean(input.normalButtonSkipped), actionState.label),
      halfButton: createDamageButtonViewModel("half", true, true, false, Boolean(input.halfButtonSkipped), actionState.label),
      summary: {
        state: waitingForResistance ? "pending" : "manual",
        message: waitingForResistance ? actionState.reason ?? "Role resistência para aplicar dano." : null,
      },
    };
  }

  if (resistanceState.kind === "none") {
    return {
      mode,
      canShowApplyDamage: true,
      waitingForResistance,
      resistanceState,
      actionState,
      normalButton: createDamageButtonViewModel("normal", true, true, false, Boolean(input.normalButtonSkipped)),
      halfButton: createDamageButtonViewModel("half", true, true, false, Boolean(input.halfButtonSkipped)),
      summary: {
        state: "manual",
        message: "Sem DT confiável: escolha manualmente.",
      },
    };
  }

  if (resistanceState.kind === "pending") {
    return {
      mode,
      canShowApplyDamage: true,
      waitingForResistance,
      resistanceState,
      actionState,
      normalButton: createDamageButtonViewModel("normal", true, true, false, Boolean(input.normalButtonSkipped), actionState.label),
      halfButton: createDamageButtonViewModel("half", false, false, false, Boolean(input.halfButtonSkipped)),
      summary: {
        state: "pending",
        message: waitingForResistance ? actionState.reason ?? "Role resistência para aplicar dano." : null,
      },
    };
  }

  const resisted = resistanceState.kind === "succeeded";

  return {
    mode,
    canShowApplyDamage: true,
    waitingForResistance,
    resistanceState,
    actionState,
    normalButton: createDamageButtonViewModel("normal", !resisted, !resisted, false, Boolean(input.normalButtonSkipped)),
    halfButton: createDamageButtonViewModel("half", resisted, resisted, false, Boolean(input.halfButtonSkipped)),
    summary: {
      state: resisted ? "resisted" : "failed",
      message: resisted
        ? `Resistiu: ${resistanceState.total} vs DT ${resistanceState.difficulty}.`
        : `Falhou: ${resistanceState.total} vs DT ${resistanceState.difficulty}.`,
    },
  };
}

function createResolvedDamageSummary(resistanceState: ResistanceResolutionState): SingleTargetDamageViewModel["summary"] {
  if (resistanceState.kind === "succeeded") {
    return {
      state: "resisted",
      message: `Resistiu: ${resistanceState.total} vs DT ${resistanceState.difficulty}.`,
    };
  }

  if (resistanceState.kind === "failed") {
    return {
      state: "failed",
      message: `Falhou: ${resistanceState.total} vs DT ${resistanceState.difficulty}.`,
    };
  }

  return {
    state: "manual",
    message: null,
  };
}

function createDamageButtonViewModel(
  kind: SingleTargetDamageButtonKind,
  visible: boolean,
  enabled: boolean,
  applied: boolean,
  skipped: boolean,
  waitingLabel?: string
): SingleTargetDamageButtonViewModel {
  return {
    kind,
    visible,
    enabled,
    applied,
    skipped,
    waitingLabel,
  };
}

function resolveAppliedDamageKind(input: SingleTargetDamageViewModelInput): SingleTargetDamageButtonKind | null {
  if (input.normalButtonApplied) return "normal";
  if (input.halfButtonApplied) return "half";
  return null;
}

function getDamageResolutionModeSafe(): SingleTargetDamageResolutionMode {
  try {
    return getItemUseDamageResolutionMode();
  } catch {
    return "assisted";
  }
}

function getResistanceGateModeSafe(): ItemUseResistanceGateMode {
  try {
    return getItemUseResistanceGateMode();
  } catch {
    return "strict";
  }
}
