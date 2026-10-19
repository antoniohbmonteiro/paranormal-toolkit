import type { AttackModifierFacts, AttackModifierPreset, AvailableAttackModifier } from "./attack-modifier-preset";
import { readAttackModifierBinding } from "./attack-modifier-binding";
import { INTUITIVE_SHOT_PRESET } from "./presets/intuitive-shot";
import { SPECIAL_ATTACK_PRESET } from "./presets/special-attack";
import { DEATH_SHOT_PRESET } from "./presets/death-shot";
import { LETHAL_SHOT_PRESET } from "./presets/lethal-shot";

export class AttackModifierRegistry {
  private readonly presets = new Map<string, AttackModifierPreset>();
  constructor(presets: AttackModifierPreset[] = [INTUITIVE_SHOT_PRESET, SPECIAL_ATTACK_PRESET, DEATH_SHOT_PRESET, LETHAL_SHOT_PRESET]) {
    for (const preset of presets) this.register(preset);
  }
  register(preset: AttackModifierPreset): void {
    if (!preset.id || !preset.version || !preset.label || this.presets.has(preset.id) || !preset.options.length) {
      throw new Error("Preset de modificador de ataque inválido ou duplicado.");
    }
    const ids = new Set(preset.options.map(option => option.id));
    if (ids.size !== preset.options.length || ids.has("") || preset.options.some(option =>
      [...(option.requires ?? []), ...(option.conflicts ?? [])].some(id => !ids.has(id) || id === option.id)
      || [option.contribution.attackBonus, option.contribution.damageBonus, option.contribution.effortCost, option.contribution.threatBonus, option.contribution.multiplierBonus,
        option.contribution.bonusWeaponDamageDice,
        option.contribution.resistancePenetration?.amount].some(value => value !== undefined && (!Number.isSafeInteger(value) || value < 0))
      || option.contribution.attackDiceModifier !== undefined && !Number.isSafeInteger(option.contribution.attackDiceModifier))) {
      throw new Error("Opções do preset de ataque inválidas.");
    }
    this.presets.set(preset.id, structuredClone(preset));
  }
  list(): AttackModifierPreset[] { return [...this.presets.values()].map(preset => structuredClone(preset)); }
  get(id: string): AttackModifierPreset | null { const preset = this.presets.get(id); return preset ? structuredClone(preset) : null; }
  resolve(abilities: readonly Item[], facts: AttackModifierFacts): AvailableAttackModifier[] {
    const seen = new Set<string>();
    const result: AvailableAttackModifier[] = [];
    for (const ability of abilities) {
      const binding = readAttackModifierBinding(ability);
      const preset = binding && this.get(binding.presetId);
      if (ability.type !== "ability" || !preset || seen.has(preset.id) || !isAttackModifierEligible(preset, facts)) continue;
      seen.add(preset.id);
      result.push({ preset, abilityUuid: ability.uuid, abilityName: ability.name });
    }
    return result.sort((a, b) => a.preset.id.localeCompare(b.preset.id));
  }
}
export function isAttackModifierEligible(preset: AttackModifierPreset, facts: AttackModifierFacts): boolean {
  const requirements = preset.requirements;
  return (!requirements.weaponType || requirements.weaponType === facts.weaponType)
    && (!requirements.rangedSubtypes || requirements.rangedSubtypes.includes(facts.rangedSubtype ?? ""))
    && (requirements.ranged === undefined || requirements.ranged === facts.ranged);
}
