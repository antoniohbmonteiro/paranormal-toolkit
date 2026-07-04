import type { DamageApplicationResult } from "../../../../core/damage/damage-application";
import { whisperDamageApplicationResultToGms } from "../../assisted-actions/assisted-damage-feedback-service";

type LegacyMultiTargetDamageFeedbackInput = {
  actor: Actor;
  targetName: string;
  finalDamage: number;
  blocked: number;
};

/**
 * Compatibility wrapper kept for existing multi-target imports.
 * New code should call the shared assisted damage feedback service directly.
 */
export async function createMultiTargetDamageFeedbackMessage(
  input: DamageApplicationResult | LegacyMultiTargetDamageFeedbackInput,
): Promise<void> {
  await whisperDamageApplicationResultToGms(toDamageApplicationResult(input));
}

function toDamageApplicationResult(
  input: DamageApplicationResult | LegacyMultiTargetDamageFeedbackInput,
): DamageApplicationResult {
  if (isDamageApplicationResult(input)) return input;

  const inputAmount = input.finalDamage + input.blocked;

  return {
    actor: input.actor,
    actorId: input.actor.id ?? null,
    actorName: input.targetName,
    totalRawDamage: inputAmount,
    totalFinalDamage: input.finalDamage,
    totalBlocked: input.blocked,
    newPV: null,
    conditions: [],
    instances: [
      {
        id: "multi-target-damage",
        label: "Dano",
        sourceRollId: null,
        inputAmount,
        finalDamage: input.finalDamage,
        blocked: input.blocked,
        damageType: null,
        systemDamageType: null,
        ignoreResistance: false,
        nonLethal: false,
      },
    ],
    source: "item-use.multi-target-damage",
    originUuid: null,
  };
}

function isDamageApplicationResult(
  input: DamageApplicationResult | LegacyMultiTargetDamageFeedbackInput,
): input is DamageApplicationResult {
  return "instances" in input
    && Array.isArray(input.instances)
    && "totalFinalDamage" in input
    && "totalBlocked" in input;
}