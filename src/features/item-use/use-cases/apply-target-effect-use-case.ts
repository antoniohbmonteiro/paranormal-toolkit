import type {
  ApplyConditionFailure,
  ConditionApplication,
  ConditionEngine,
} from "../../conditions/condition-engine";
import type { ToolkitConditionDurationInput } from "../../conditions/condition-duration";
import type { Result } from "../../../core/result";
import {
  shouldBlockPendingResistanceAction,
  type ItemUseResistanceGateMode,
  type ResistanceResolutionState,
} from "../config/item-use-resistance-gate-policy";
import { canCurrentUserApplyAssistedActions } from "../assisted-actions/assisted-action-policy";

export type ApplyTargetEffectUseCaseInput = {
  actor: Actor;
  conditionId: string;
  duration?: ToolkitConditionDurationInput | null;
  originUuid?: string | null;
  source?: string | null;
  resistanceGateMode: ItemUseResistanceGateMode;
  resistanceState: ResistanceResolutionState;
  isGM?: boolean;
  allowSuccessfulResistance?: boolean;
  requiredResistanceOutcome?: "failed" | "succeeded" | null;
};

export type ApplyTargetEffectBlockedFailure = {
  actor: Actor;
  actorId: string | null;
  actorName: string;
  conditionId: string;
  reason: "resistance-pending" | "resistance-succeeded" | "resistance-outcome-mismatch" | "permission-denied";
  message: string;
};

export type ApplyTargetEffectUseCaseFailure =
  | ApplyConditionFailure
  | ApplyTargetEffectBlockedFailure;

export type ApplyTargetEffectUseCaseResult = Result<
  ConditionApplication,
  ApplyTargetEffectUseCaseFailure
>;

export class ApplyTargetEffectUseCase {
  constructor(private readonly conditions: ConditionEngine) {}

  async execute(input: ApplyTargetEffectUseCaseInput): Promise<ApplyTargetEffectUseCaseResult> {
    if ((input.isGM ?? canCurrentUserApplyAssistedActions()) !== true) {
      return this.block(input, "permission-denied", "Apenas o Mestre pode aplicar efeito assistido.");
    }

    if (shouldBlockPendingResistanceAction(input.resistanceGateMode, input.resistanceState)) {
      return this.block(input, "resistance-pending", "Role a resistência do alvo antes de aplicar efeito.");
    }

    if (input.requiredResistanceOutcome && input.resistanceState.kind !== input.requiredResistanceOutcome) {
      return this.block(
        input,
        input.resistanceState.kind === "pending" || input.resistanceState.kind === "none"
          ? "resistance-pending"
          : "resistance-outcome-mismatch",
        input.resistanceState.kind === "pending" || input.resistanceState.kind === "none"
          ? "Role a resistência do alvo antes de aplicar efeito."
          : "O resultado da resistência não permite aplicar este efeito.",
      );
    }

    if (input.resistanceState.kind === "succeeded" && !input.allowSuccessfulResistance) {
      return this.block(input, "resistance-succeeded", "Este alvo resistiu ao efeito.");
    }

    return this.conditions.applyCondition({
      actor: input.actor,
      conditionId: input.conditionId,
      duration: input.duration ?? null,
      originUuid: input.originUuid ?? null,
      source: input.source ?? null,
    });
  }

  private block(
    input: ApplyTargetEffectUseCaseInput,
    reason: ApplyTargetEffectBlockedFailure["reason"],
    message: string,
  ): ApplyTargetEffectUseCaseResult {
    return {
      ok: false,
      error: {
        actor: input.actor,
        actorId: input.actor.id ?? null,
        actorName: input.actor.name ?? "Ator sem nome",
        conditionId: input.conditionId,
        reason,
        message,
      },
    };
  }
}
