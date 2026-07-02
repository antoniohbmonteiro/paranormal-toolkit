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

export type ApplyTargetEffectUseCaseInput = {
  actor: Actor;
  conditionId: string;
  duration?: ToolkitConditionDurationInput | null;
  originUuid?: string | null;
  source?: string | null;
  resistanceGateMode: ItemUseResistanceGateMode;
  resistanceState: ResistanceResolutionState;
};

export type ApplyTargetEffectBlockedFailure = {
  actor: Actor;
  actorId: string | null;
  actorName: string;
  conditionId: string;
  reason: "resistance-pending" | "resistance-succeeded";
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
    if (shouldBlockPendingResistanceAction(input.resistanceGateMode, input.resistanceState)) {
      return this.block(input, "resistance-pending", "Role a resistência do alvo antes de aplicar efeito.");
    }

    if (input.resistanceState.kind === "succeeded") {
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
