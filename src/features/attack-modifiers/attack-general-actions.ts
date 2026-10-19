import type { AttackModifierContribution, AttackModifierFacts, AttackModifierSelection } from "./attack-modifier-preset";
import { INTUITIVE_SHOT_PRESET } from "./presets/intuitive-shot";

export type AttackGeneralActions = { aim: boolean; burst: boolean };
export type AttackConfigurationSelection = { generalActions: AttackGeneralActions; presets: AttackModifierSelection };
export type AttackBonusDamageDie = { faces: number; type: string | null };

export function emptyAttackConfiguration(): AttackConfigurationSelection {
  return { generalActions: { aim: false, burst: false }, presets: {} };
}
export function availableAttackGeneralActions(facts: AttackModifierFacts): AttackGeneralActions {
  const ranged = facts.weaponType === "armament" && facts.ranged === true;
  return { aim: ranged, burst: ranged && facts.firearm === true && facts.automatic === true };
}
export function validateAttackGeneralActions(facts: AttackModifierFacts, selection: AttackConfigurationSelection,
  burstDamage: AttackBonusDamageDie | null): AttackModifierContribution {
  const { aim, burst } = selection.generalActions, available = availableAttackGeneralActions(facts);
  if (typeof aim !== "boolean" || typeof burst !== "boolean" || aim && !available.aim || burst && !available.burst) {
    throw new Error("Ação geral indisponível para esta arma.");
  }
  if (aim && (selection.presets[INTUITIVE_SHOT_PRESET.id]?.length ?? 0) > 0) {
    throw new Error("Mirar e Tiro Intuitivo não podem ser combinados.");
  }
  if (burst && !burstDamage) throw new Error("Rajada exige dano-base no formato NdM, como 2d6. Confira a fórmula da arma.");
  return burst ? { attackDiceModifier: -1, bonusWeaponDamageDice: 1 } : {};
}
