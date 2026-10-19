import { formatAttackCritical, formatAttackDiceSummary, formatBonusWeaponDamage } from "./attack-modifier-composer";
import { previewAttackConfiguration } from "./attack-configuration-resolver";
import type { AttackModifierFacts, AttackModifierSelection, AttackProgression, AvailableAttackModifier, CriticalProfile } from "./attack-modifier-preset";
import { availableAttackGeneralActions,
  type AttackBonusDamageDie, type AttackConfigurationSelection, type AttackGeneralActions } from "./attack-general-actions";
import { INTUITIVE_SHOT_PRESET } from "./presets/intuitive-shot";
import { SPECIAL_ATTACK_PRESET, specialAttackMaxBlocks } from "./presets/special-attack";
import { LETHAL_SHOT_PRESET } from "./presets/lethal-shot";

export type AttackModifierDialogInput = {
  weaponName: string; weaponImage: string; actorName: string; targetName: string | null;
  baseCritical: CriticalProfile; available: AvailableAttackModifier[]; resource: "PE" | "PD"; currentResource: number | null;
  facts: AttackModifierFacts; burstDamage: AttackBonusDamageDie | null;
  progression?: AttackProgression | null;
};
export type AttackModifierDialogModel = {
  header: { title: string; image: string; subtitle: string };
  generalActions: Array<{ id: keyof AttackGeneralActions; label: string; description: string; checked: boolean; disabled: boolean }>;
  groups: Array<{ id: string; label: string; primaryId: string; selected: boolean; disabled: boolean; description: string;
    allocation: { limit: string; controls: Array<{ field: "attackBlocks" | "damageBlocks"; label: string; value: string; canDecrease: boolean; canIncrease: boolean }> } | null;
    options: Array<{
    id: string; label: string; description: string; checked: boolean; disabled: boolean;
  }> }>;
  critical: string; cost: { additional: string; balance: string } | null; penetration: string | null;
  attackDice: string | null; bonusDamage: string | null;
  attackBonus: string | null; damageBonus: string | null;
  error: string | null; canConfirm: boolean;
};
export function createAttackModifierDialogModel(input: AttackModifierDialogInput, selection: AttackConfigurationSelection): AttackModifierDialogModel {
  const preview = previewAttackConfiguration(input, selection);
  let error = preview.error;
  let critical = formatAttackCritical(input.baseCritical), cost = 0, penetration = 0;
  let attackDice: string | null = null, bonusDamage: string | null = null;
  let attackBonus: string | null = null, damageBonus: string | null = null;
  const composed = preview.modifiers;
  if (composed) {
    critical = formatAttackCritical(composed.critical); cost = composed.effortCost; penetration = composed.resistancePenetration;
    attackDice = composed.attackDiceContributions.length > 0 ? formatAttackDiceSummary(composed) : null;
    bonusDamage = composed.bonusWeaponDamageDice > 0 && input.burstDamage ? formatBonusWeaponDamage(composed, input.burstDamage.faces) : null;
    attackBonus = composed.attackBonus > 0 ? "+" + composed.attackBonus : null;
    damageBonus = composed.damageBonus > 0 ? "+" + composed.damageBonus + " (fora do crítico)" : null;
    if (!error && cost > 0 && (input.currentResource === null || input.currentResource < cost)) error = "Você não possui " + input.resource + " suficiente para pagar este custo.";
  }
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
        disabled: entry.preset.id === LETHAL_SHOT_PRESET.id && !selection.generalActions.aim,
        selected: (presets[entry.preset.id] ?? []).includes(primary.id), description: primary.description.replace(/pontos? de esforço/g, input.resource),
        allocation: entry.preset.id === SPECIAL_ATTACK_PRESET.id ? createSpecialAttackAllocation(input, selection) : null,
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
    attackDice, bonusDamage, attackBonus, damageBonus,
    error, canConfirm: error === null,
  };
}
export function toggleAttackConfigurationOption(available: AvailableAttackModifier[], selection: AttackConfigurationSelection,
  presetId: string, optionId: string, checked: boolean): AttackConfigurationSelection {
  const next = structuredClone(selection);
  if (presetId === LETHAL_SHOT_PRESET.id && checked && !next.generalActions.aim) return next;
  next.presets = toggleAttackModifierOption(available, next.presets, presetId, optionId, checked);
  const preset = available.find(entry => entry.preset.id === presetId)?.preset;
  const primary = preset?.options.find(option => option.id === "use") ?? preset?.options[0];
  if (!checked && primary?.id === optionId) delete next.presets[presetId];
  if (presetId === SPECIAL_ATTACK_PRESET.id && optionId === "use") {
    if (checked && next.presets[presetId]?.includes("use")) next.specialAttack ??= { attackBlocks: 0, damageBlocks: 0 };
    else delete next.specialAttack;
  }
  if (presetId === INTUITIVE_SHOT_PRESET.id && optionId === "use" && checked
    && next.presets[presetId]?.includes(optionId)) {
    next.generalActions.aim = false;
    delete next.presets[LETHAL_SHOT_PRESET.id];
  }
  return next;
}
function createSpecialAttackAllocation(input: AttackModifierDialogInput, selection: AttackConfigurationSelection) {
  const limit = specialAttackMaxBlocks(input.progression), configuration = selection.specialAttack ?? { attackBlocks: 0, damageBlocks: 0 };
  const count = configuration.attackBlocks + configuration.damageBlocks;
  return { limit: limit === null ? "Progressão indisponível. Confira o NEX ou nível da ficha."
    : "Limite: " + limit + " bloco(s) de +5, distribuídos entre ataque e dano.",
    controls: (["attackBlocks", "damageBlocks"] as const).map(field => ({ field,
      label: field === "attackBlocks" ? "Bônus no ataque" : "Bônus no dano", value: "+" + configuration[field] * 5,
      canDecrease: configuration[field] > 0, canIncrease: limit !== null && count < limit })) };
}
export function adjustSpecialAttack(input: AttackModifierDialogInput, selection: AttackConfigurationSelection,
  field: "attackBlocks" | "damageBlocks", delta: number): AttackConfigurationSelection {
  const next = structuredClone(selection);
  if (!input.available.some(entry => entry.preset.id === SPECIAL_ATTACK_PRESET.id)
    || !next.presets[SPECIAL_ATTACK_PRESET.id]?.includes("use") || ![1, -1].includes(delta)) return next;
  const limit = specialAttackMaxBlocks(input.progression), configuration = next.specialAttack;
  if (!configuration || limit === null || configuration[field] + delta < 0
    || configuration.attackBlocks + configuration.damageBlocks + delta > limit) return next;
  configuration[field] += delta;
  return next;
}
export function toggleAttackGeneralAction(input: AttackModifierDialogInput, selection: AttackConfigurationSelection,
  action: keyof AttackGeneralActions, checked: boolean): AttackConfigurationSelection {
  const next = structuredClone(selection), available = availableAttackGeneralActions(input.facts);
  if (!available[action] || action === "burst" && !input.burstDamage) return next;
  next.generalActions[action] = checked;
  if (action === "aim" && checked) delete next.presets[INTUITIVE_SHOT_PRESET.id];
  if (action === "aim" && !checked) delete next.presets[LETHAL_SHOT_PRESET.id];
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
