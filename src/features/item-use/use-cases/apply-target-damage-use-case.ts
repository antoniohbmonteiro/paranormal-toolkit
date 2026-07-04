import type { DamageEngine } from "../../../core/damage/damage-engine";
import type {
  DamageApplicationFailure,
  DamageApplicationResult,
} from "../../../core/damage/damage-application";
import type { DamageTypeInput } from "../../../core/damage/damage-types";
import type { Result } from "../../../core/result";
import {
  shouldBlockPendingResistanceAction,
  type ItemUseResistanceGateMode,
  type ResistanceResolutionState,
} from "../config/item-use-resistance-gate-policy";
import { canCurrentUserApplyAssistedActions } from "../assisted-actions/assisted-action-policy";

export type ApplyTargetDamageUseCaseInput = {
  actor: Actor;
  amount: number;
  damageType?: DamageTypeInput;
  label?: string;
  sourceRollId?: string | null;
  source?: string | null;
  originUuid?: string | null;
  resistanceGateMode: ItemUseResistanceGateMode;
  resistanceState: ResistanceResolutionState;
  isGM?: boolean;
};

export type ApplyTargetDamageBlockedFailure = {
  actor: Actor;
  actorId: string | null;
  actorName: string;
  reason: "resistance-pending" | "permission-denied";
  message: string;
};

export type ApplyTargetDamageUseCaseFailure =
  | DamageApplicationFailure
  | ApplyTargetDamageBlockedFailure;

export type ApplyTargetDamageUseCaseResult = Result<
  DamageApplicationResult,
  ApplyTargetDamageUseCaseFailure
>;

export class ApplyTargetDamageUseCase {
  constructor(private readonly damage: DamageEngine) {}

  async execute(input: ApplyTargetDamageUseCaseInput): Promise<ApplyTargetDamageUseCaseResult> {
    if ((input.isGM ?? canCurrentUserApplyAssistedActions()) !== true) {
      return {
        ok: false,
        error: {
          actor: input.actor,
          actorId: input.actor.id ?? null,
          actorName: input.actor.name ?? "Ator sem nome",
          reason: "permission-denied",
          message: "Apenas o Mestre pode aplicar dano assistido.",
        },
      };
    }

    if (shouldBlockPendingResistanceAction(input.resistanceGateMode, input.resistanceState)) {
      return {
        ok: false,
        error: {
          actor: input.actor,
          actorId: input.actor.id ?? null,
          actorName: input.actor.name ?? "Ator sem nome",
          reason: "resistance-pending",
          message: "Role a resistência do alvo antes de aplicar dano.",
        },
      };
    }

    return this.damage.applyDamage({
      actor: input.actor,
      instances: [
        {
          amount: input.amount,
          damageType: input.damageType,
          label: input.label,
          sourceRollId: input.sourceRollId ?? null,
          ignoreResistance: false,
        },
      ],
      source: input.source ?? null,
      originUuid: input.originUuid ?? null,
    });
  }
}
