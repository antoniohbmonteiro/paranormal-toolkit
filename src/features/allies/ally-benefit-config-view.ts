import { ORDEM_AGENT_SKILLS } from "../../adapters/ordem/ordem-agent-skills";
import { findOrdemEffectPreset, ORDEM_EFFECT_PRESETS, recognizeOrdemEffectPreset } from "../../adapters/ordem/ordem-effect-presets";
import type { AllyEffectTemplate } from "../../core/allies/ally-passive-effect";
import type { AllyBenefitConfigView, AllyBenefitFieldView, AllyBenefitRowView } from "../../ui/components/ally/ally-ability-config";

export type AllyBenefitDraft = { presetId: string; value: string; skillId: string };
export type AllyBenefitEffectSource = { id: string; name: string; disabled: boolean; template: AllyEffectTemplate | null };

export function defaultAllyBenefitDraft(): AllyBenefitDraft {
  return { presetId: ORDEM_EFFECT_PRESETS[0].id, value: "5", skillId: ORDEM_AGENT_SKILLS[0].id };
}

function plural(count: number, singular: string, pluralForm: string): string {
  return `${count} ${count === 1 ? singular : pluralForm}`;
}
function describeRow(effect: AllyBenefitEffectSource): AllyBenefitRowView {
  const { template } = effect;
  const recognized = template && !template.statuses.length ? recognizeOrdemEffectPreset(template.system.changes) : null;
  const details = template ? [
    template.system.changes.length ? plural(template.system.changes.length, "mudança", "mudanças") : "sem mudanças",
    ...(template.statuses.length ? [plural(template.statuses.length, "condição", "condições")] : []),
  ].join(", ") : null;
  return { id: effect.id, name: effect.name, disabled: effect.disabled,
    kind: recognized?.presetId ?? "custom",
    summary: recognized?.summary ?? (details ? `Personalizado · ${details}` : "Personalizado"),
    diagnostic: template ? null : "Estrutura incompatível: revise as mudanças no editor nativo." };
}

export function buildAllyBenefitConfigView(input: {
  editable: boolean; draft: AllyBenefitDraft; effects: AllyBenefitEffectSource[];
}): AllyBenefitConfigView {
  const { editable, draft } = input;
  const preset = findOrdemEffectPreset(draft.presetId) ?? ORDEM_EFFECT_PRESETS[0];
  const fields = preset.fields.map((field): AllyBenefitFieldView => field === "skill"
    ? { kind: "skill", options: ORDEM_AGENT_SKILLS.map(skill => ({ id: skill.id, label: skill.label, selected: skill.id === draft.skillId })) }
    : { kind: "value", value: draft.value });
  return {
    editable,
    presets: ORDEM_EFFECT_PRESETS.map(entry => ({ id: entry.id, label: entry.label, selected: entry.id === preset.id })),
    fields,
    unavailableMessage: preset.unavailableMessage ?? null,
    canAdd: editable && preset.unavailableMessage === undefined,
    effects: input.effects.map(describeRow),
  };
}
