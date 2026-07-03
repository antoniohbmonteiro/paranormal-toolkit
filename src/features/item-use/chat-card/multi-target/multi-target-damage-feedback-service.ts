import type { DamageApplicationResult } from "../../../../core/damage/damage-application";
import { whisperDamageApplicationResultToGms } from "../../assisted-actions/assisted-damage-feedback-service";

/**
 * Compatibility wrapper kept for existing multi-target imports.
 * New code should call the shared assisted damage feedback service directly.
 */
export async function createMultiTargetDamageFeedbackMessage(input: DamageApplicationResult): Promise<void> {
  await whisperDamageApplicationResultToGms(input);
}
