import type { AttackModifierContribution, AttackModifierSelection, AvailableAttackModifier, ComposedAttackModifiers, CriticalProfile } from "./attack-modifier-preset";

export function parseAttackCritical(value: string): CriticalProfile | null {
  const text = value.trim().toLowerCase();
  if (!text) return { margin: 20, multiplier: 2 };
  const match = /^(?:(\d+)(?:\/x(\d+))?|x(\d+)|x(\d+)\/(\d+))$/.exec(text);
  if (!match) return null;
  const margin = Number(match[1] ?? match[5] ?? 20);
  const multiplier = Number(match[2] ?? match[3] ?? match[4] ?? 2);
  return Number.isSafeInteger(margin) && margin > 0 && margin <= 20 && Number.isSafeInteger(multiplier) && multiplier >= 2
    ? { margin, multiplier } : null;
}
export function formatAttackCritical(critical: CriticalProfile): string { return critical.margin + "/x" + critical.multiplier; }
export function formatAttackDiceSummary(modifiers: ComposedAttackModifiers): string {
  return formatDiceSum(modifiers.attackDiceContributions, modifiers.attackDiceModifier, 20);
}
export function formatBonusWeaponDamage(modifiers: ComposedAttackModifiers, faces: number): string {
  return formatDiceSum(modifiers.bonusWeaponDamageContributions, modifiers.bonusWeaponDamageDice, faces);
}
function formatDiceSum(contributions: readonly number[], total: number, faces: number): string {
  const term = (value: number) => (value < 0 ? "−" : value > 0 ? "+" : "") + Math.abs(value) + "d" + faces;
  if (contributions.length < 2) return term(total);
  return [...contributions].sort((a, b) => a - b).map((value, index) => index === 0 ? term(value)
    : (value < 0 ? " − " : " + ") + Math.abs(value) + "d" + faces).join("") + " = " + term(total);
}

export function composeAttackModifiers(base: CriticalProfile, available: AvailableAttackModifier[], selection: AttackModifierSelection,
  generalContribution: AttackModifierContribution = {}): ComposedAttackModifiers {
  const result: ComposedAttackModifiers = { critical: { ...base }, effortCost: 0, resistancePenetration: 0, attackBonus: 0, damageBonus: 0,
    attackDiceModifier: 0, attackDiceContributions: [], bonusWeaponDamageDice: 0, bonusWeaponDamageContributions: [], selected: [] };
  const penetration = new Map<string, { mode: "add" | "highest"; value: number }>();
  const contribute = (contribution: AttackModifierContribution) => {
    for (const field of ["attackBonus", "damageBonus"] as const) {
      const value = contribution[field] ?? 0;
      if (!Number.isSafeInteger(value) || value < 0 || !Number.isSafeInteger(result[field] + value)) {
        throw new Error("Os bônus excedem os limites numéricos do ataque.");
      }
      result[field] += value;
    }
    result.critical.margin -= contribution.threatBonus ?? 0;
    result.critical.multiplier += contribution.multiplierBonus ?? 0;
    result.effortCost += contribution.effortCost ?? 0;
    const dice = contribution.attackDiceModifier ?? 0;
    if (!Number.isSafeInteger(dice) || !Number.isSafeInteger(result.attackDiceModifier + dice)) {
      throw new Error("Os modificadores excedem os limites numéricos do ataque.");
    }
    result.attackDiceModifier += dice;
    if (dice !== 0) result.attackDiceContributions.push(dice);
    result.bonusWeaponDamageDice += contribution.bonusWeaponDamageDice ?? 0;
    if (contribution.bonusWeaponDamageDice) result.bonusWeaponDamageContributions.push(contribution.bonusWeaponDamageDice);
    const rd = contribution.resistancePenetration;
    if (rd) {
      const current = penetration.get(rd.group);
      if (current && current.mode !== rd.stacking) throw new Error("Regras de acumulação de RD incompatíveis.");
      penetration.set(rd.group, { mode: rd.stacking, value: rd.stacking === "add" ? (current?.value ?? 0) + rd.amount : Math.max(current?.value ?? 0, rd.amount) });
    }
  };
  contribute(generalContribution);
  const groups = new Set<string>();
  const seen = new Set<string>();
  for (const id of Object.keys(selection)) if (!available.some(entry => entry.preset.id === id)) throw new Error("Preset indisponível para este ataque.");
  for (const entry of [...available].sort((a, b) => a.preset.id.localeCompare(b.preset.id))) {
    const ids = selection[entry.preset.id] ?? [];
    if (seen.has(entry.preset.id)) continue;
    seen.add(entry.preset.id);
    if (new Set(ids).size !== ids.length || ids.some(id => !entry.preset.options.some(option => option.id === id))) throw new Error("Opção de ataque inválida.");
    for (const option of entry.preset.options.filter(option => ids.includes(option.id))) {
      if (option.requires?.some(id => !ids.includes(id)) || option.conflicts?.some(id => ids.includes(id))) throw new Error("Selecione uma combinação compatível de modificadores.");
      if (option.exclusiveGroup && groups.has(option.exclusiveGroup)) throw new Error("Estes modificadores não podem ser combinados.");
      if (option.exclusiveGroup) groups.add(option.exclusiveGroup);
      contribute(option.contribution);
    }
    if (ids.length) result.selected.push({ presetId: entry.preset.id, presetVersion: entry.preset.version, label: entry.preset.label,
      abilityUuid: entry.abilityUuid, optionIds: [...ids].sort() });
  }
  result.critical.margin = Math.max(1, result.critical.margin);
  result.resistancePenetration = [...penetration.values()].reduce((sum, group) => sum + group.value, 0);
  if (![result.critical.multiplier, result.effortCost, result.resistancePenetration,
    result.bonusWeaponDamageDice].every(value => Number.isSafeInteger(value) && value >= 0)) {
    throw new Error("Os modificadores excedem os limites numéricos do ataque.");
  }
  return result;
}
