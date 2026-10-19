import { composeAttackModifiers, formatAttackCritical, formatAttackDiceSummary, formatBonusWeaponDamage } from "./attack-modifier-composer";
import type { AttackModifierFacts, AttackModifierSelection, AvailableAttackModifier, CriticalProfile } from "./attack-modifier-preset";
import { availableAttackGeneralActions, validateAttackGeneralActions,
  type AttackBonusDamageDie, type AttackConfigurationSelection, type AttackGeneralActions } from "./attack-general-actions";
import { INTUITIVE_SHOT_PRESET } from "./presets/intuitive-shot";

export type AttackModifierDialogInput = {
  weaponName: string; weaponImage: string; actorName: string; targetName: string | null;
  baseCritical: CriticalProfile; available: AvailableAttackModifier[]; resource: "PE" | "PD"; currentResource: number | null;
  facts: AttackModifierFacts; burstDamage: AttackBonusDamageDie | null;
};
export type AttackModifierDialogModel = {
  header: { title: string; image: string; subtitle: string };
  generalActions: Array<{ id: keyof AttackGeneralActions; label: string; description: string; checked: boolean; disabled: boolean }>;
  groups: Array<{ id: string; label: string; primaryId: string; selected: boolean; description: string; options: Array<{
    id: string; label: string; description: string; checked: boolean; disabled: boolean;
  }> }>;
  critical: string; cost: { additional: string; balance: string } | null; penetration: string | null;
  attackDice: string | null; bonusDamage: string | null;
  error: string | null; canConfirm: boolean;
};
export function createAttackModifierDialogModel(input: AttackModifierDialogInput, selection: AttackConfigurationSelection): AttackModifierDialogModel {
  let error: string | null = null;
  let critical = formatAttackCritical(input.baseCritical), cost = 0, penetration = 0;
  let attackDice: string | null = null, bonusDamage: string | null = null;
  try {
    const contribution = validateAttackGeneralActions(input.facts, selection, input.burstDamage);
    const composed = composeAttackModifiers(input.baseCritical, input.available, selection.presets, contribution);
    critical = formatAttackCritical(composed.critical); cost = composed.effortCost; penetration = composed.resistancePenetration;
    attackDice = composed.attackDiceContributions.length > 0 ? formatAttackDiceSummary(composed) : null;
    if (composed.bonusWeaponDamageDice > 0 && !input.burstDamage) throw new Error("Dano adicional exige dano-base da arma no formato NdM.");
    bonusDamage = composed.bonusWeaponDamageDice > 0 && input.burstDamage ? formatBonusWeaponDamage(composed, input.burstDamage.faces) : null;
    if (cost > 0 && (input.currentResource === null || input.currentResource < cost)) error = "Você não possui " + input.resource + " suficiente para pagar este custo.";
  } catch (cause) { error = cause instanceof Error ? cause.message : "Seleção inválida."; }
  const actions = availableAttackGeneralActions(input.facts), presets = selection.presets;
  const base = formatAttackCritical(input.baseCritical);
  return {
    header: { title: input.weaponName, image: input.weaponImage,
      subtitle: input.actorName + " · " + (input.targetName ?? "Sem alvo selecionado") },
    generalActions: [
      ...(actions.aim ? [{ id: "aim" as const, label: "Mirar", checked: selection.generalActions.aim, disabled: false,
        description: "Declaro que já realizei a ação Mirar." }] : []),
      ...(actions.burst ? [{ id: "burst" as const, label: "Rajada", checked: selection.generalActions.burst, disabled: !input.burstDamage,
        description: input.burstDamage ? "−1d20 no ataque e +1d" + input.burstDamage.faces + " no dano, fora do crítico."
          : "Rajada exige dano-base no formato NdM, como 2d6. Confira a fórmula da arma." }] : []),
    ],
    groups: input.available.map(entry => {
      const primary = entry.preset.options.find(option => option.id === "use") ?? entry.preset.options[0];
      return { id: entry.preset.id, label: entry.preset.label, primaryId: primary.id,
        selected: (presets[entry.preset.id] ?? []).includes(primary.id), description: primary.description,
        options: entry.preset.options.filter(option => option.id !== primary.id).map(option => ({
          id: option.id, label: option.label.replace("pontos de esforço", input.resource), description: option.description,
          checked: (presets[entry.preset.id] ?? []).includes(option.id),
          disabled: option.requires?.some(id => !(presets[entry.preset.id] ?? []).includes(id)) ?? false,
        })) };
    }),
    critical: critical === base ? critical : base + " → " + critical,
    cost: cost > 0 ? { additional: cost + " " + input.resource, balance: input.currentResource === null ? "Indisponível"
      : input.currentResource + " → " + Math.max(0, input.currentResource - cost) + " " + input.resource } : null,
    penetration: penetration > 0 ? "Até " + penetration + " RD ao acertar" : null,
    attackDice, bonusDamage,
    error, canConfirm: error === null,
  };
}
export function toggleAttackConfigurationOption(available: AvailableAttackModifier[], selection: AttackConfigurationSelection,
  presetId: string, optionId: string, checked: boolean): AttackConfigurationSelection {
  const next = structuredClone(selection);
  next.presets = toggleAttackModifierOption(available, next.presets, presetId, optionId, checked);
  const preset = available.find(entry => entry.preset.id === presetId)?.preset;
  const primary = preset?.options.find(option => option.id === "use") ?? preset?.options[0];
  if (!checked && primary?.id === optionId) delete next.presets[presetId];
  if (presetId === INTUITIVE_SHOT_PRESET.id && optionId === "use" && checked
    && next.presets[presetId]?.includes(optionId)) next.generalActions.aim = false;
  return next;
}
export function toggleAttackGeneralAction(input: AttackModifierDialogInput, selection: AttackConfigurationSelection,
  action: keyof AttackGeneralActions, checked: boolean): AttackConfigurationSelection {
  const next = structuredClone(selection), available = availableAttackGeneralActions(input.facts);
  if (!available[action] || action === "burst" && !input.burstDamage) return next;
  next.generalActions[action] = checked;
  if (action === "aim" && checked) delete next.presets[INTUITIVE_SHOT_PRESET.id];
  return next;
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
