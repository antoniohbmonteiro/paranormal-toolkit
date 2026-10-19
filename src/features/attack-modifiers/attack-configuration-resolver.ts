import { composeAttackModifiers } from "./attack-modifier-composer";
import { validateAttackGeneralActions, type AttackBonusDamageDie, type AttackConfigurationSelection } from "./attack-general-actions";
import type { AttackModifierFacts, AttackProgression, AvailableAttackModifier, ComposedAttackModifiers, CriticalProfile } from "./attack-modifier-preset";
import { isAttackModifierEligible } from "./attack-modifier-registry";
import { resolveSpecialAttack, SPECIAL_ATTACK_PRESET } from "./presets/special-attack";
import { LETHAL_SHOT_PRESET } from "./presets/lethal-shot";

export type AttackConfigurationInput = {
  baseCritical: CriticalProfile; available: AvailableAttackModifier[]; facts: AttackModifierFacts;
  burstDamage: AttackBonusDamageDie | null; progression?: AttackProgression | null;
};

export function resolveAttackConfiguration(input: AttackConfigurationInput, selection: AttackConfigurationSelection): ComposedAttackModifiers {
  const contribution = validateAttackGeneralActions(input.facts, selection, input.burstDamage);
  if ((selection.presets[LETHAL_SHOT_PRESET.id]?.length ?? 0) > 0 && !selection.generalActions.aim) {
    throw new Error("Declare Mirar para usar Disparo Letal.");
  }
  const available = input.available.filter(entry => isAttackModifierEligible(entry.preset, input.facts));
  const specialSelected = selection.presets[SPECIAL_ATTACK_PRESET.id]?.includes("use");
  if (!specialSelected && selection.specialAttack !== undefined) throw new Error("Configuração de Ataque Especial sem a habilidade selecionada.");
  const resolved = specialSelected ? resolveSpecialAttack(selection.specialAttack, input.progression) : null;
  const materialized = available.map(entry => entry.preset.id !== SPECIAL_ATTACK_PRESET.id || !resolved ? entry : {
    ...entry, preset: { ...entry.preset, options: entry.preset.options.map(option => option.id === "use"
      ? { ...option, contribution: { ...option.contribution, ...resolved } } : option) },
  });
  const result = composeAttackModifiers(input.baseCritical, materialized, selection.presets, contribution);
  const special = result.selected.find(entry => entry.presetId === SPECIAL_ATTACK_PRESET.id);
  if (special) special.parameters = { attackBlocks: selection.specialAttack!.attackBlocks, damageBlocks: selection.specialAttack!.damageBlocks };
  if (result.bonusWeaponDamageDice > 0 && !input.burstDamage) throw new Error("Dano adicional exige dano-base da arma no formato NdM.");
  return result;
}

export function previewAttackConfiguration(input: AttackConfigurationInput, selection: AttackConfigurationSelection): {
  modifiers: ComposedAttackModifiers | null; error: string | null;
} {
  try { return { modifiers: resolveAttackConfiguration(input, selection), error: null }; }
  catch (cause) {
    const error = cause instanceof Error ? cause.message : "Seleção inválida.";
    if (selection.presets[SPECIAL_ATTACK_PRESET.id]?.includes("use")
      && selection.specialAttack?.attackBlocks === 0 && selection.specialAttack.damageBlocks === 0) {
      const remaining = structuredClone(selection);
      delete remaining.presets[SPECIAL_ATTACK_PRESET.id]; delete remaining.specialAttack;
      try { return { modifiers: resolveAttackConfiguration(input, remaining), error }; }
      catch { /* An unrelated invalid selection has no safe preview. */ }
    }
    return { modifiers: null, error };
  }
}
