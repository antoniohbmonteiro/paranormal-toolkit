import {
  shouldBlockPendingResistanceAction,
  type ItemUseResistanceGateMode,
  type ResistanceResolutionState,
} from "../config/item-use-resistance-gate-policy";
import {
  resolveDamageActionState,
  resolveEffectActionState,
  type ItemUseActionState,
} from "../chat-card/item-use-card-action-state";
import type { AssistedDamageMode } from "./assisted-action-labels";

export type AssistedEffectMode = "applicable" | "resisted" | "unavailable";

export type AssistedTargetActionPolicyInput = {
  isGM: boolean;
  resistanceGateMode: ItemUseResistanceGateMode;
  resistanceState: ResistanceResolutionState;
  hasDamage: boolean;
  hasEffect: boolean;
  damageAlreadyApplied?: boolean;
  effectAlreadyApplied?: boolean;
  effectCanApplyOnSuccessfulResistance?: boolean;
  effectRequiresResolvedResistance?: boolean;
};

export type AssistedTargetActionPolicy = {
  canShowApplyDamage: boolean;
  canShowApplyEffect: boolean;
  damageActionState: ItemUseActionState;
  effectActionState: ItemUseActionState;
  damageMode: AssistedDamageMode | null;
  effectMode: AssistedEffectMode;
  blocksPendingResistance: boolean;
};

export function canCurrentUserControlAssistedActions(): boolean {
  return game.user?.isGM === true;
}

export function canCurrentUserApplyAssistedActions(): boolean {
  return canCurrentUserControlAssistedActions();
}

export function resolveAssistedTargetActionPolicy(input: AssistedTargetActionPolicyInput): AssistedTargetActionPolicy {
  const blocksPendingResistance = shouldBlockPendingResistanceAction(input.resistanceGateMode, input.resistanceState);
  const damageMode = resolveAssistedDamageMode(input.resistanceState, input.hasDamage);
  const effectMode = resolveAssistedEffectMode(input.resistanceState, input.hasEffect, Boolean(input.effectCanApplyOnSuccessfulResistance));

  const damageActionState = resolveDamageActionState({
    resistanceGateMode: input.resistanceGateMode,
    resistanceState: input.resistanceState,
    alreadyApplied: input.damageAlreadyApplied,
    unavailable: !input.hasDamage,
  });
  const effectActionState = resolveEffectActionState({
    resistanceGateMode: input.resistanceGateMode,
    resistanceState: input.resistanceState,
    alreadyApplied: input.effectAlreadyApplied,
    unavailable: !input.hasEffect,
    allowsSuccessfulResistance: Boolean(input.effectCanApplyOnSuccessfulResistance),
    requiresResolvedResistance: Boolean(input.effectRequiresResolvedResistance),
  });

  return {
    canShowApplyDamage: input.isGM && input.hasDamage,
    canShowApplyEffect: input.isGM && input.hasEffect,
    damageActionState,
    effectActionState,
    damageMode,
    effectMode,
    blocksPendingResistance,
  };
}

export function resolveAssistedDamageMode(
  resistanceState: ResistanceResolutionState,
  hasDamage: boolean,
): AssistedDamageMode | null {
  if (!hasDamage) return null;
  return resistanceState.kind === "succeeded" ? "half" : "normal";
}

export function resolveAssistedEffectMode(
  resistanceState: ResistanceResolutionState,
  hasEffect: boolean,
  canApplyOnSuccessfulResistance = false,
): AssistedEffectMode {
  if (!hasEffect) return "unavailable";
  if (resistanceState.kind === "succeeded" && !canApplyOnSuccessfulResistance) return "resisted";
  return "applicable";
}
