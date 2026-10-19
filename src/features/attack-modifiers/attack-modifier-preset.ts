export type CriticalProfile = { margin: number; multiplier: number };
export type AttackModifierFacts = {
  weaponType: string;
  ranged: boolean;
  firearm: boolean;
  automatic: boolean;
  rangedSubtype?: string | null;
};
export type AttackProgression = { mode: "nex" | "level"; value: number };
export type SpecialAttackConfiguration = { attackBlocks: number; damageBlocks: number };
export type AttackModifierContribution = {
  attackBonus?: number;
  damageBonus?: number;
  threatBonus?: number;
  multiplierBonus?: number;
  resistancePenetration?: { amount: number; group: string; stacking: "add" | "highest" };
  effortCost?: number;
  attackDiceModifier?: number;
  bonusWeaponDamageDice?: number;
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
  requirements: { ranged?: boolean; weaponType?: string; rangedSubtypes?: string[] };
  options: AttackModifierOption[];
};
export type AvailableAttackModifier = { preset: AttackModifierPreset; abilityUuid: string; abilityName: string };
export type AttackModifierSelection = Record<string, string[]>;
export type ComposedAttackModifiers = {
  attackBonus: number;
  damageBonus: number;
  critical: CriticalProfile;
  effortCost: number;
  resistancePenetration: number;
  attackDiceModifier: number;
  attackDiceContributions: number[];
  bonusWeaponDamageDice: number;
  bonusWeaponDamageContributions: number[];
  selected: Array<{ presetId: string; presetVersion: string; label: string; abilityUuid: string; optionIds: string[];
    parameters?: SpecialAttackConfiguration }>;
};
