import type { EffectChange } from "../../core/allies/ally-passive-effect";
import { failure, success, type Result } from "../../core/result";
import { isOrdemAgentSkillId, ORDEM_AGENT_SKILLS, ordemAgentSkillLabel } from "./ordem-agent-skills";
import { ORDEM_AGENT_BONUS_PATHS } from "./ordem-paths";

export type OrdemEffectPresetId = "defense" | "skill" | "movement" | "maxPV" | "maxPE" | "maxPD" | "diceBonus";
export type OrdemEffectPresetField = "skill" | "value";
export type OrdemEffectPresetDefinition = {
  id: OrdemEffectPresetId;
  label: string;
  fields: readonly OrdemEffectPresetField[];
  unavailableMessage?: string;
};
export type OrdemEffectPresetInput = { presetId: string; value?: string; skillId?: string };
export type OrdemEffectPreset = { presetId: OrdemEffectPresetId; name: string; changes: EffectChange[] };
export type RecognizedOrdemEffectPreset = { presetId: OrdemEffectPresetId; summary: string };

export const ORDEM_EFFECT_PRESETS: readonly OrdemEffectPresetDefinition[] = [
  { id: "defense", label: "Bônus de Defesa", fields: ["value"] },
  { id: "skill", label: "Bônus de Perícia", fields: ["skill", "value"] },
  { id: "movement", label: "Bônus de Deslocamento", fields: ["value"] },
  { id: "maxPV", label: "Bônus de PV máximo", fields: ["value"] },
  { id: "maxPE", label: "Bônus de PE máximo", fields: ["value"] },
  { id: "maxPD", label: "Bônus de PD máximo", fields: ["value"] },
  { id: "diceBonus", label: "Bônus de Dados (+Xd20)", fields: [], unavailableMessage: "AINDA NÃO IMPLEMENTADO NO SISTEMA" },
];

type ValuePresetId = Exclude<OrdemEffectPresetId, "skill" | "diceBonus">;
const VALUE_TARGETS: readonly { presetId: ValuePresetId; key: string; noun: string }[] = [
  { presetId: "defense", key: ORDEM_AGENT_BONUS_PATHS.defense, noun: "Defesa" },
  { presetId: "movement", key: ORDEM_AGENT_BONUS_PATHS.movement, noun: "Deslocamento" },
  { presetId: "maxPV", key: ORDEM_AGENT_BONUS_PATHS.resourceMax.PV, noun: "PV máximo" },
  { presetId: "maxPE", key: ORDEM_AGENT_BONUS_PATHS.resourceMax.PE, noun: "PE máximo" },
  { presetId: "maxPD", key: ORDEM_AGENT_BONUS_PATHS.resourceMax.PD, noun: "PD máximo" },
];

export function findOrdemEffectPreset(id: string): OrdemEffectPresetDefinition | undefined {
  return ORDEM_EFFECT_PRESETS.find(preset => preset.id === id);
}

/** Additive bonus applied before the system derives Defense, skills and resource maxima. */
export function ordemBonusChange(key: string, value: number): EffectChange {
  return { key, type: "add", value, phase: "initial", priority: 20 };
}

export function parseOrdemBonusValue(raw: string | undefined): number | null {
  const text = raw?.trim() ?? "";
  if (!/^[+-]?\d+$/.test(text)) return null;
  const value = Number(text);
  return Number.isSafeInteger(value) && value !== 0 ? value : null;
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
  const value = parseOrdemBonusValue(input.value);
  if (value === null) return failure("Informe um valor inteiro diferente de zero.");
  if (id === "skill" && isOrdemAgentSkillId(skillId)) {
    return success({ presetId: id, name: `${preset.label} (${ordemAgentSkillLabel(skillId)})`,
      changes: [ordemBonusChange(ORDEM_AGENT_BONUS_PATHS.skill(skillId), value)] });
  }
  const target = VALUE_TARGETS.find(entry => entry.presetId === id)!;
  return success({ presetId: id, name: preset.label, changes: [ordemBonusChange(target.key, value)] });
}

export function recognizeOrdemEffectPreset(changes: readonly EffectChange[]): RecognizedOrdemEffectPreset | null {
  if (changes.length !== 1) return null;
  const [change] = changes;
  if (change.type !== "add" || change.phase !== "initial" || typeof change.value !== "number" || !Number.isFinite(change.value)) return null;
  const amount = `${change.value > 0 ? "+" : ""}${change.value}`;
  const target = VALUE_TARGETS.find(entry => entry.key === change.key);
  if (target) return { presetId: target.presetId, summary: `${amount} ${target.noun}` };
  const skill = ORDEM_AGENT_SKILLS.find(entry => ORDEM_AGENT_BONUS_PATHS.skill(entry.id) === change.key);
  return skill ? { presetId: "skill", summary: `${skill.label} ${amount}` } : null;
}
