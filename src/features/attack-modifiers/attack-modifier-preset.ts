export type CriticalProfile = { margin: number; multiplier: number };
export type AttackModifierFacts = {
  weaponType: string;
  ranged: boolean;
};
export type AttackModifierContribution = {
  threatBonus?: number;
  multiplierBonus?: number;
  resistancePenetration?: { amount: number; group: string; stacking: "add" | "highest" };
  effortCost?: number;
};
export type AttackModifierOption = {
  id: string;
  label: string;
  description: string;
  requires?: string[];
  conflicts?: string[];
  exclusiveGroup?: string;
  contribution: AttackModifierContribution;
};
export type AttackModifierPreset = {
  id: string;
  version: string;
  label: string;
  recognitionNames?: string[];
  requirements: { ranged?: boolean; weaponType?: string };
  options: AttackModifierOption[];
};
export type AvailableAttackModifier = { preset: AttackModifierPreset; abilityUuid: string; abilityName: string };
export type AttackModifierSelection = Record<string, string[]>;
export type ComposedAttackModifiers = {
  critical: CriticalProfile;
  effortCost: number;
  resistancePenetration: number;
  selected: Array<{ presetId: string; presetVersion: string; label: string; abilityUuid: string; optionIds: string[] }>;
};
