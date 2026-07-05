import type { ItemUseResistanceGateMode, ResistanceResolutionState } from "../config/item-use-resistance-gate-policy";
import { canCurrentUserApplyAssistedActions, resolveAssistedTargetActionPolicy, type AssistedTargetActionPolicy } from "./assisted-action-policy";

export type AssistedDamageActionViewModel = {
  normalAmount: number | null;
  halfAmount: number | null;
};

export type AssistedEffectActionViewModel = {
  conditionId?: string | null;
  conditionLabel?: string | null;
};

export type AssistedTargetActionViewModelInput = {
  targetId: string;
  targetName: string;
  resistanceGateMode: ItemUseResistanceGateMode;
  resistanceState: ResistanceResolutionState;
  damage: AssistedDamageActionViewModel | null;
  effect: AssistedEffectActionViewModel | null;
  damageAlreadyApplied?: boolean;
  effectAlreadyApplied?: boolean;
  effectCanApplyOnSuccessfulResistance?: boolean;
  effectRequiresResolvedResistance?: boolean;
  isGM?: boolean;
};

export type AssistedTargetActionViewModel = {
  targetId: string;
  targetName: string;
  resistanceState: ResistanceResolutionState;
  damage: AssistedDamageActionViewModel | null;
  effect: AssistedEffectActionViewModel | null;
  policy: AssistedTargetActionPolicy;
};

export function createAssistedTargetActionViewModel(input: AssistedTargetActionViewModelInput): AssistedTargetActionViewModel {
  const isGM = input.isGM ?? canCurrentUserApplyAssistedActions();
  return {
    targetId: input.targetId,
    targetName: input.targetName,
    resistanceState: input.resistanceState,
    damage: input.damage,
    effect: input.effect,
    policy: resolveAssistedTargetActionPolicy({
      isGM,
      resistanceGateMode: input.resistanceGateMode,
      resistanceState: input.resistanceState,
      hasDamage: input.damage !== null,
      hasEffect: input.effect !== null,
      damageAlreadyApplied: input.damageAlreadyApplied,
      effectAlreadyApplied: input.effectAlreadyApplied,
      effectCanApplyOnSuccessfulResistance: input.effectCanApplyOnSuccessfulResistance,
      effectRequiresResolvedResistance: input.effectRequiresResolvedResistance,
    }),
  };
}
