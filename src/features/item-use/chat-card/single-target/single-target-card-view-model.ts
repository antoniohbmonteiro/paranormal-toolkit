import type { ItemUseActionState } from "../item-use-card-action-state";
import { isActionWaitingForResistance } from "../item-use-card-action-state";
import { createSingleTargetResistanceUiState } from "../item-use-card-resistance-state";
import type {
  ItemUseResistanceGateMode,
  ResistanceResolutionState,
} from "../../config/item-use-resistance-gate-policy";
import { getItemUseDamageResolutionMode, getItemUseResistanceGateMode } from "../../item-use-settings";
import { createAssistedTargetActionViewModel } from "../../assisted-actions/assisted-action-view-model";

export type SingleTargetDamageResolutionState = "manual" | "pending" | "resisted" | "failed";
export type SingleTargetDamageResolutionMode = "manual" | "assisted";
export type SingleTargetDamageButtonKind = "normal" | "half";

export type SingleTargetDamageButtonViewModel = {
  kind: SingleTargetDamageButtonKind;
  visible: boolean;
  enabled: boolean;
  applied: boolean;
  waitingLabel?: string;
};

type SingleTargetDamageViewModelInput = {
  rollCard: HTMLElement;
  normalButtonApplied?: boolean;
  halfButtonApplied?: boolean;
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

  if (!assistedTarget.policy.canShowApplyDamage) {
    return {
      mode,
      canShowApplyDamage: false,
      waitingForResistance,
      resistanceState,
      actionState,
      normalButton: createDamageButtonViewModel("normal", false, false, Boolean(input.normalButtonApplied), actionState.label),
      halfButton: createDamageButtonViewModel("half", false, false, Boolean(input.halfButtonApplied), actionState.label),
      summary: {
        state: waitingForResistance ? "pending" : "manual",
        message: waitingForResistance ? actionState.reason : null,
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
      normalButton: createDamageButtonViewModel("normal", true, !waitingForResistance, Boolean(input.normalButtonApplied), actionState.label),
      halfButton: createDamageButtonViewModel("half", true, !waitingForResistance, Boolean(input.halfButtonApplied), actionState.label),
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
      normalButton: createDamageButtonViewModel("normal", true, true, Boolean(input.normalButtonApplied)),
      halfButton: createDamageButtonViewModel("half", true, true, Boolean(input.halfButtonApplied)),
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
      normalButton: createDamageButtonViewModel("normal", true, !waitingForResistance, Boolean(input.normalButtonApplied), actionState.label),
      halfButton: createDamageButtonViewModel("half", false, false, Boolean(input.halfButtonApplied)),
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
    normalButton: createDamageButtonViewModel("normal", !resisted, !resisted, Boolean(input.normalButtonApplied)),
    halfButton: createDamageButtonViewModel("half", resisted, resisted, Boolean(input.halfButtonApplied)),
    summary: {
      state: resisted ? "resisted" : "failed",
      message: resisted
        ? `Resistiu: ${resistanceState.total} vs DT ${resistanceState.difficulty}.`
        : `Falhou: ${resistanceState.total} vs DT ${resistanceState.difficulty}.`,
    },
  };
}

function createDamageButtonViewModel(
  kind: SingleTargetDamageButtonKind,
  visible: boolean,
  enabled: boolean,
  applied: boolean,
  waitingLabel?: string
): SingleTargetDamageButtonViewModel {
  return {
    kind,
    visible,
    enabled,
    applied,
    waitingLabel,
  };
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
