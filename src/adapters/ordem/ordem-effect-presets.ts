import type { EffectChange } from "../../core/allies/ally-passive-effect";
import { failure, success, type Result } from "../../core/result";
import { isOrdemAgentSkillId, ORDEM_AGENT_SKILLS, ordemAgentSkillLabel } from "./ordem-agent-skills";
import { ORDEM_AGENT_BONUS_PATHS } from "./ordem-paths";
import { getOrdemDamageTypeLabel, isOrdemDamageType, ORDEM_DAMAGE_TYPE_IDS } from "./ordem-damage-types";

export type OrdemEffectPresetId = "defense" | "skill" | "movement" | "maxPV" | "maxPE" | "maxPD" | "maxSAN" | "capacity" | "attribute" | "ritualDT" | "perRound" | "damageResistance" | "diceBonus";
export type OrdemEffectPresetField = "skill" | "value" | "attribute" | "resource" | "damageType";
export type OrdemEffectPresetDefinition = {
  id: OrdemEffectPresetId;
  label: string;
  fields: readonly OrdemEffectPresetField[];
  unavailableMessage?: string;
};
export type OrdemEffectPresetInput = { presetId: string; value?: string; skillId?: string; attributeId?: string; resourceId?: string; damageTypeId?: string };
export type OrdemEffectPreset = { presetId: OrdemEffectPresetId; name: string; changes: EffectChange[] };
export type RecognizedOrdemEffectPreset = { presetId: OrdemEffectPresetId; summary: string };
export const ORDEM_EFFECT_ATTRIBUTES = [
  { id: "str", label: "FOR" }, { id: "dex", label: "AGI" }, { id: "int", label: "INT" }, { id: "vit", label: "VIG" },
] as const;
export type EditableOrdemEffectPreset = RecognizedOrdemEffectPreset & OrdemEffectPresetInput;

export const ORDEM_EFFECT_PRESETS: readonly OrdemEffectPresetDefinition[] = [
  { id: "defense", label: "Bônus de Defesa", fields: ["value"] },
  { id: "skill", label: "Bônus de Perícia", fields: ["skill", "value"] },
  { id: "movement", label: "Bônus de Deslocamento", fields: ["value"] },
  { id: "maxPV", label: "Bônus de PV máximo", fields: ["value"] },
  { id: "maxPE", label: "Bônus de PE máximo", fields: ["value"] },
  { id: "maxPD", label: "Bônus de PD máximo", fields: ["value"] },
  { id: "maxSAN", label: "Bônus de SAN máximo", fields: ["value"] },
  { id: "capacity", label: "Capacidade de carga", fields: ["value"] },
  { id: "attribute", label: "Bônus de Atributo", fields: ["attribute", "value"] },
  { id: "ritualDT", label: "Bônus de DT de rituais", fields: ["value"] },
  { id: "perRound", label: "PE/PD por rodada", fields: ["resource", "value"] },
  { id: "damageResistance", label: "Resistência a Dano", fields: ["damageType", "value"] },
  { id: "diceBonus", label: "Bônus de Dados (+Xd20)", fields: [], unavailableMessage: "AINDA NÃO IMPLEMENTADO NO SISTEMA" },
];

type ValuePresetId = Exclude<OrdemEffectPresetId, "skill" | "diceBonus" | "attribute" | "perRound" | "damageResistance">;
const VALUE_TARGETS: readonly { presetId: ValuePresetId; key: string; noun: string }[] = [
  { presetId: "defense", key: ORDEM_AGENT_BONUS_PATHS.defense, noun: "Defesa" },
  { presetId: "movement", key: ORDEM_AGENT_BONUS_PATHS.movement, noun: "Deslocamento" },
  { presetId: "maxPV", key: ORDEM_AGENT_BONUS_PATHS.resourceMax.PV, noun: "PV máximo" },
  { presetId: "maxPE", key: ORDEM_AGENT_BONUS_PATHS.resourceMax.PE, noun: "PE máximo" },
  { presetId: "maxPD", key: ORDEM_AGENT_BONUS_PATHS.resourceMax.PD, noun: "PD máximo" },
  { presetId: "maxSAN", key: ORDEM_AGENT_BONUS_PATHS.resourceMax.SAN, noun: "SAN máximo" },
  { presetId: "capacity", key: ORDEM_AGENT_BONUS_PATHS.capacity, noun: "capacidade de carga" },
  { presetId: "ritualDT", key: ORDEM_AGENT_BONUS_PATHS.ritualDT, noun: "DT de rituais" },
];

export function findOrdemEffectPreset(id: string): OrdemEffectPresetDefinition | undefined {
  return ORDEM_EFFECT_PRESETS.find(preset => preset.id === id);
}

/** Additive bonus applied before the system derives Defense, skills and resource maxima. */
export function ordemBonusChange(key: string, value: number | string): EffectChange {
  return { key, type: "add", value, phase: "initial", priority: 20 };
}

export function parseOrdemBonusValue(raw: string | undefined): number | null {
  const text = raw?.trim() ?? "";
  if (!/^[+-]?\d+$/.test(text)) return null;
  const value = Number(text);
  return Number.isSafeInteger(value) && value !== 0 ? value : null;
}

/** Ordem evaluates string changes containing data references before native AE application. */
export function isOrdemBonusFormula(raw: string): boolean {
  if (raw.length > 500 || !raw.includes("@") || /\b(?:constructor|prototype|__proto__)\b/.test(raw)) return false;
  const arithmetic = raw.replace(/@[a-z][a-z0-9]*(?:\.[a-z][a-z0-9]*)+/gi, "1")
    .replace(/\b(?:floor|ceil|round|abs|min|max)(?=\s*\()/g, "");
  return /^[\d\s.+\-*/%(),]+$/.test(arithmetic);
}

export function validateOrdemPresetFormula(preset: OrdemEffectPreset): void {
  const value = preset.changes[0]?.value;
  if (typeof value !== "string") return;
  if (!Roll.validate(value)) throw new Error("Fórmula inválida. Confira os parênteses, operadores e referências do Actor.");
}

export function buildOrdemEffectPreset(input: OrdemEffectPresetInput): Result<OrdemEffectPreset, string> {
  const preset = findOrdemEffectPreset(input.presetId);
  if (!preset) return failure("Tipo de benefício desconhecido.");
  const id = preset.id;
  if (id === "diceBonus" || preset.unavailableMessage !== undefined) {
    return failure(preset.unavailableMessage ?? "Este benefício ainda não está disponível.");
  }
  const skillId = input.skillId;
  if (id === "skill" && !isOrdemAgentSkillId(skillId)) return failure("Selecione uma perícia válida.");
  const raw = input.value?.trim() ?? "";
  const value = parseOrdemBonusValue(raw) ?? (isOrdemBonusFormula(raw) ? raw : null);
  if (value === null) return failure(raw.includes("@") ? "Use uma fórmula aritmética com referências como @NEX.value, sem dados aleatórios." : "Informe um valor inteiro diferente de zero ou uma fórmula com referências como @NEX.value.");
  if (id === "skill" && isOrdemAgentSkillId(skillId)) {
    return success({ presetId: id, name: `${preset.label} (${ordemAgentSkillLabel(skillId)})`,
      changes: [ordemBonusChange(ORDEM_AGENT_BONUS_PATHS.skill(skillId), value)] });
  }
  if (id === "attribute") {
    const attribute = ORDEM_EFFECT_ATTRIBUTES.find(entry => entry.id === (input.attributeId ?? "str"));
    if (!attribute) return failure("Selecione um atributo válido. PRE aguarda correção no sistema.");
    return success({ presetId: id, name: `${preset.label} (${attribute.label})`, changes: [ordemBonusChange(ORDEM_AGENT_BONUS_PATHS.attribute(attribute.id), value)] });
  }
  if (id === "perRound") {
    const resource = input.resourceId ?? "PE";
    if (resource !== "PE" && resource !== "PD") return failure("Selecione PE ou PD.");
    return success({ presetId: id, name: `Bônus de ${resource} por rodada`, changes: [ordemBonusChange(ORDEM_AGENT_BONUS_PATHS.perRound(resource), value)] });
  }
  if (id === "damageResistance") {
    const damageType = input.damageTypeId ?? "ballisticDamage";
    if (!isOrdemDamageType(damageType)) return failure("Selecione um tipo de dano válido.");
    if (typeof value !== "number") return failure("Fórmulas de RD exigem revisão no editor nativo; o preset aceita um inteiro positivo.");
    if (value <= 0) return failure("Informe uma resistência inteira maior que zero.");
    return success({ presetId: id, name: `Resistência a Dano (${getOrdemDamageTypeLabel(damageType)})`,
      changes: [ordemBonusChange(ORDEM_AGENT_BONUS_PATHS.resistance(damageType), value)] });
  }
  const target = VALUE_TARGETS.find(entry => entry.presetId === id)!;
  return success({ presetId: id, name: preset.label, changes: [ordemBonusChange(target.key, value)] });
}

export function recognizeOrdemEffectPreset(changes: readonly EffectChange[]): RecognizedOrdemEffectPreset | null {
  const recognized = readOrdemEffectPreset(changes);
  if (recognized) return { presetId: recognized.presetId, summary: recognized.summary };
  if (changes.length !== 1) return null;
  const [change] = changes;
  if (change.type !== "add" || change.phase !== "initial" || typeof change.value !== "string" || !change.value.trim()) return null;
  const target = VALUE_TARGETS.find(entry => entry.key === change.key);
  return target ? { presetId: target.presetId, summary: `${findOrdemEffectPreset(target.presetId)!.label} · fórmula personalizada` } : null;
}

export function readOrdemEffectPreset(changes: readonly EffectChange[]): EditableOrdemEffectPreset | null {
  if (changes.length !== 1) return null;
  const [change] = changes;
  if (change.type !== "add" || change.phase !== "initial" || typeof change.value !== "number" || !Number.isFinite(change.value)) return null;
  const amount = `${change.value > 0 ? "+" : ""}${change.value}`;
  const target = VALUE_TARGETS.find(entry => entry.key === change.key);
  const value = String(change.value);
  if (target) return { presetId: target.presetId, summary: `${amount} ${target.noun}`, value };
  const attribute = ORDEM_EFFECT_ATTRIBUTES.find(entry => ORDEM_AGENT_BONUS_PATHS.attribute(entry.id) === change.key);
  if (attribute) return { presetId: "attribute", attributeId: attribute.id, value, summary: `${attribute.label} ${amount}` };
  const resource = (["PE", "PD"] as const).find(id => ORDEM_AGENT_BONUS_PATHS.perRound(id) === change.key);
  if (resource) return { presetId: "perRound", resourceId: resource, value, summary: `${amount} ${resource} por rodada` };
  const damageType = ORDEM_DAMAGE_TYPE_IDS.find(id => ORDEM_AGENT_BONUS_PATHS.resistance(id) === change.key);
  if (damageType) return { presetId: "damageResistance", damageTypeId: damageType, value, summary: `RD ${getOrdemDamageTypeLabel(damageType)} ${amount}` };
  const skill = ORDEM_AGENT_SKILLS.find(entry => ORDEM_AGENT_BONUS_PATHS.skill(entry.id) === change.key);
  return skill ? { presetId: "skill", skillId: skill.id, value, summary: `${skill.label} ${amount}` } : null;
}
