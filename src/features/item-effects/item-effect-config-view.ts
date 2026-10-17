import { ORDEM_AGENT_SKILLS } from "../../adapters/ordem/ordem-agent-skills";
import { getOrdemDamageTypeLabel, ORDEM_DAMAGE_TYPE_IDS } from "../../adapters/ordem/ordem-damage-types";
import { findOrdemEffectPreset, ORDEM_EFFECT_ATTRIBUTES, ORDEM_EFFECT_PRESETS, readOrdemEffectPreset, recognizeOrdemEffectPreset } from "../../adapters/ordem/ordem-effect-presets";
import type { LegacyAllyImport } from "../allies/config/ally-ability-config";
import { itemEffectChanges, type ItemEffectContext, type ItemEffectSource } from "./item-effect-config-service";

export type ItemEffectDraft = { presetId: string; value: string; skillId: string; attributeId: string; resourceId: string; damageTypeId: string; transfer: string };
export type ItemEffectFieldView =
  | { kind: "skill" | "attribute" | "resource" | "damageType"; options: { id: string; label: string; selected: boolean }[] }
  | { kind: "value"; value: string };
export type ItemEffectRowView = {
  id: string; name: string; kind: string; summary: string; disabled: boolean; diagnostic: string | null;
  benefit?: boolean; transferLabel?: string; details?: string[]; canQuickEdit?: boolean; canRemove?: boolean; canOpen?: boolean;
};
export type ItemEffectConfigView = {
  editable: boolean; presets: { id: string; label: string; selected: boolean }[]; fields: ItemEffectFieldView[];
  unavailableMessage: string | null; canAdd: boolean; effects: ItemEffectRowView[];
  benefits?: boolean; title?: string; intro?: string; notice?: string | null;
  legacy?: { missing: number; canImport: boolean } | null;
  editing?: { id: string; fields: ItemEffectFieldView[] } | null;
  working?: boolean;
  transfer?: { value: string; independent: boolean };
};

export function defaultItemEffectDraft(transfer = true): ItemEffectDraft {
  return { presetId: "defense", value: "5", skillId: ORDEM_AGENT_SKILLS[0].id, attributeId: "str", resourceId: "PE", damageTypeId: "ballisticDamage", transfer: String(transfer) };
}
export function buildItemEffectFields(draft: ItemEffectDraft): ItemEffectFieldView[] {
  const preset = findOrdemEffectPreset(draft.presetId) ?? ORDEM_EFFECT_PRESETS[0];
  return preset.fields.map(field => {
    if (field === "value") return { kind: "value", value: draft.value };
    const options = field === "skill" ? ORDEM_AGENT_SKILLS : field === "attribute" ? ORDEM_EFFECT_ATTRIBUTES
      : field === "resource" ? [{ id: "PE", label: "PE" }, { id: "PD", label: "PD" }]
      : ORDEM_DAMAGE_TYPE_IDS.map(id => ({ id, label: getOrdemDamageTypeLabel(id) }));
    const selected = draft[`${field}Id`];
    return { kind: field, options: options.map(entry => ({ ...entry, selected: entry.id === selected })) };
  });
}
export function describeItemEffect(source: ItemEffectSource, context: ItemEffectContext, editable: boolean): ItemEffectRowView {
  const changes = itemEffectChanges(source.data);
  const statuses = Array.isArray(source.data.statuses) ? source.data.statuses : [];
  const recognized = changes && !statuses.length ? recognizeOrdemEffectPreset(changes) : null;
  const duration = source.data.duration;
  const details = [
    ...(changes ? changes.map(change => `${change.key} · ${change.type} · ${change.phase} · prioridade ${change.priority ?? "padrão"} · ${JSON.stringify(change.value)}`) : ["Mudanças: estrutura não reconhecida."]),
    ...statuses.map(status => `Condição: ${String(status)}`),
    ...(duration ? [`Duração: ${JSON.stringify(duration)}`] : []),
  ];
  const customDetails = [changes?.length ? `${changes.length} ${changes.length === 1 ? "mudança" : "mudanças"}` : "sem mudanças",
    ...(statuses.length ? [`${statuses.length} ${statuses.length === 1 ? "condição" : "condições"}`] : [])].join(", ");
  return { id: source.id, name: source.name, kind: recognized?.presetId ?? "custom", disabled: source.disabled,
    summary: recognized?.summary ?? (changes ? `Personalizado · ${customDetails}` : "Personalizado"),
    benefit: source.benefit, details, diagnostic: source.diagnostic,
    transferLabel: source.benefit ? "Projeção pelo suporte" : !source.transfer
      ? "Não transferido — não concede bônus automático ao Agente"
      : context === "independent" ? "Transferência automática ao Actor que incorporar este Item" : "Transferência automática ao Agente",
    canQuickEdit: editable && source.quick !== null, canRemove: editable, canOpen: true };
}
export function buildItemEffectConfigView(input: {
  context: ItemEffectContext; editable: boolean; draft: ItemEffectDraft; sources: ItemEffectSource[];
  legacy: LegacyAllyImport | null; notice?: string | null; isGM: boolean; granted?: boolean;
  editing?: { id: string; draft: ItemEffectDraft } | null; working?: boolean;
}): ItemEffectConfigView {
  const { context, draft, legacy } = input;
  const benefits = context === "ally";
  const editable = input.editable && !input.working;
  const preset = findOrdemEffectPreset(draft.presetId) ?? ORDEM_EFFECT_PRESETS[0];
  const effects = input.sources.map(source => describeItemEffect(source, context, editable));
  if (legacy?.pending) {
    for (const row of effects) if (row.benefit) { row.canQuickEdit = false; row.canRemove = false; }
    for (const source of legacy.missing) effects.push({ id: `legacy-${source.id}`, name: source.template.name,
      kind: "defense", summary: readOrdemEffectPreset(source.template.system.changes)?.summary ?? "Benefício legado", disabled: false,
      diagnostic: null, benefit: true, transferLabel: "Formato legado · projeção pelo suporte",
      canQuickEdit: false, canRemove: false, canOpen: false });
  }
  const hints: Record<string, string> = {
    maxPV: "Exige item de Classe e cálculos automáticos ativos.", maxPE: "Exige Classe e cálculos automáticos; confira a regra de recursos.",
    maxPD: "Exige Classe e cálculos automáticos; PD usa a regra Sem Sanidade.", maxSAN: "Exige Classe e cálculos automáticos ativos.",
    attribute: "PRE aguarda correção da DT de rituais no sistema. O atributo segue a validação nativa.",
    perRound: "Altera o limite exibido pelo sistema; não controla gastos automaticamente.",
    damageResistance: "Reduz dano desse tipo quando o sistema respeita RD. Dano é um tipo explícito, sem proteção universal ou contra dano sem tipo.",
  };
  return { editable, benefits, title: benefits ? "Benefícios passivos" : "Efeitos da habilidade",
    intro: benefits ? "Configure os benefícios passivos deste aliado. Os efeitos são projetados automaticamente no beneficiário do suporte, respeitando a precedência existente."
      : context === "independent" ? "Configure os efeitos próprios deste Item. A transferência nativa determina o comportamento ao incorporá-lo em um Actor. Usar esta habilidade não aplica automaticamente este efeito."
      : "Configure os efeitos próprios da habilidade. Uma habilidade ativa também pode ter efeitos passivos aplicados automaticamente ao Agente.",
    notice: input.granted ? "Habilidade concedida e gerenciada pelo suporte: somente leitura. Edite a habilidade de origem." : input.notice ?? (!input.editable ? "Somente leitura. Confira as permissões e o bloqueio do compêndio." : null),
    presets: ORDEM_EFFECT_PRESETS.map(entry => ({ id: entry.id, label: entry.label, selected: entry.id === preset.id })),
    fields: buildItemEffectFields(draft), unavailableMessage: preset.unavailableMessage ?? hints[preset.id] ?? null,
    canAdd: editable && !input.notice && !legacy?.pending && !preset.unavailableMessage, effects,
    legacy: legacy?.pending ? { missing: legacy.missing.length, canImport: editable && input.isGM } : null,
    editing: input.editing ? { id: input.editing.id, fields: buildItemEffectFields(input.editing.draft) } : null,
    working: input.working, transfer: benefits ? undefined : { value: draft.transfer, independent: context === "independent" } };
}
