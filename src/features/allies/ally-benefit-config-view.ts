import type { AllyEffectTemplate } from "../../core/allies/ally-passive-effect";
import { buildItemEffectConfigView, defaultItemEffectDraft, type ItemEffectDraft } from "../item-effects/item-effect-config-view";
export type AllyBenefitDraft = Pick<ItemEffectDraft, "presetId" | "value" | "skillId"> & Partial<ItemEffectDraft>;
export type AllyBenefitEffectSource = { id: string; name: string; disabled: boolean; template: AllyEffectTemplate | null };
export const defaultAllyBenefitDraft = defaultItemEffectDraft;

export function buildAllyBenefitConfigView(input: { editable: boolean; draft: AllyBenefitDraft; effects: AllyBenefitEffectSource[] }) {
  return buildItemEffectConfigView({ context: "ally", editable: input.editable, draft: { ...defaultItemEffectDraft(), ...input.draft },
    sources: input.effects.map(effect => ({ id: effect.id, name: effect.name, disabled: effect.disabled, transfer: false, benefit: true,
      data: effect.template ?? {}, quick: null, diagnostic: effect.template ? null : "Estrutura incompatível: revise as mudanças no editor nativo." })),
    legacy: null, isGM: false });
}
