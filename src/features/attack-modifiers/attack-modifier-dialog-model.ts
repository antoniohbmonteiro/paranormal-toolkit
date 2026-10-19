import { composeAttackModifiers, formatAttackCritical } from "./attack-modifier-composer";
import type { AttackModifierSelection, AvailableAttackModifier, CriticalProfile } from "./attack-modifier-preset";

export type AttackModifierDialogInput = {
  weaponName: string; weaponImage: string; actorName: string; targetName: string | null;
  baseCritical: CriticalProfile; available: AvailableAttackModifier[]; resource: "PE" | "PD"; currentResource: number | null;
};
export type AttackModifierDialogModel = {
  header: { title: string; image: string; subtitle: string };
  groups: Array<{ id: string; label: string; abilityName: string; options: Array<{
    id: string; label: string; description: string; checked: boolean; disabled: boolean;
  }> }>;
  critical: string; baseCritical: string; cost: string; current: string; after: string; penetration: string;
  error: string | null; canConfirm: boolean;
};
export function createAttackModifierDialogModel(input: AttackModifierDialogInput, selection: AttackModifierSelection): AttackModifierDialogModel {
  let error: string | null = null;
  let critical = formatAttackCritical(input.baseCritical), cost = 0, penetration = 0;
  try {
    const composed = composeAttackModifiers(input.baseCritical, input.available, selection);
    critical = formatAttackCritical(composed.critical); cost = composed.effortCost; penetration = composed.resistancePenetration;
    if (cost > 0 && (input.currentResource === null || input.currentResource < cost)) error = "Você não possui " + input.resource + " suficiente para pagar este custo.";
  } catch (cause) { error = cause instanceof Error ? cause.message : "Seleção inválida."; }
  return {
    header: { title: input.weaponName, image: input.weaponImage,
      subtitle: input.actorName + " · " + (input.targetName ?? "Sem alvo selecionado") },
    groups: input.available.map(entry => ({ id: entry.preset.id, label: entry.preset.label, abilityName: entry.abilityName,
      options: entry.preset.options.map(option => ({
        id: option.id, label: option.label.replace("pontos de esforço", input.resource), description: option.description,
        checked: (selection[entry.preset.id] ?? []).includes(option.id),
        disabled: option.requires?.some(id => !(selection[entry.preset.id] ?? []).includes(id)) ?? false,
      })) })),
    baseCritical: formatAttackCritical(input.baseCritical), critical, cost: cost + " " + input.resource,
    current: input.currentResource === null ? "Indisponível" : input.currentResource + " " + input.resource,
    after: input.currentResource === null ? "—" : Math.max(0, input.currentResource - cost) + " " + input.resource,
    penetration: penetration > 0 ? "Até " + penetration + " RD ao acertar" : "Nenhuma",
    error, canConfirm: error === null,
  };
}
export function toggleAttackModifierOption(available: AvailableAttackModifier[], selection: AttackModifierSelection,
  presetId: string, optionId: string, checked: boolean): AttackModifierSelection {
  const next = structuredClone(selection), preset = available.find(entry => entry.preset.id === presetId)?.preset;
  if (!preset?.options.some(option => option.id === optionId)) return next;
  const ids = new Set(next[presetId] ?? []);
  if (checked) ids.add(optionId); else ids.delete(optionId);
  for (let pass = 0; pass < preset.options.length; pass++) {
    for (const option of preset.options) if (option.requires?.some(id => !ids.has(id))) ids.delete(option.id);
  }
  next[presetId] = [...ids];
  return next;
}
