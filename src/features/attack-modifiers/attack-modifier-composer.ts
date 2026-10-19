import type { AttackModifierSelection, AvailableAttackModifier, ComposedAttackModifiers, CriticalProfile } from "./attack-modifier-preset";

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

export function composeAttackModifiers(base: CriticalProfile, available: AvailableAttackModifier[], selection: AttackModifierSelection): ComposedAttackModifiers {
  const result: ComposedAttackModifiers = { critical: { ...base }, effortCost: 0, resistancePenetration: 0, selected: [] };
  const penetration = new Map<string, { mode: "add" | "highest"; value: number }>();
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
      const contribution = option.contribution;
      result.critical.margin -= contribution.threatBonus ?? 0;
      result.critical.multiplier += contribution.multiplierBonus ?? 0;
      result.effortCost += contribution.effortCost ?? 0;
      const rd = contribution.resistancePenetration;
      if (rd) {
        const current = penetration.get(rd.group);
        if (current && current.mode !== rd.stacking) throw new Error("Regras de acumulação de RD incompatíveis.");
        penetration.set(rd.group, { mode: rd.stacking, value: rd.stacking === "add" ? (current?.value ?? 0) + rd.amount : Math.max(current?.value ?? 0, rd.amount) });
      }
    }
    if (ids.length) result.selected.push({ presetId: entry.preset.id, presetVersion: entry.preset.version, label: entry.preset.label,
      abilityUuid: entry.abilityUuid, optionIds: [...ids].sort() });
  }
  result.critical.margin = Math.max(1, result.critical.margin);
  result.resistancePenetration = [...penetration.values()].reduce((sum, group) => sum + group.value, 0);
  if (![result.critical.multiplier, result.effortCost, result.resistancePenetration].every(Number.isSafeInteger)) {
    throw new Error("Os modificadores excedem os limites numéricos do ataque.");
  }
  return result;
}
