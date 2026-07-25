import { markTrustedHtml, type HtmlString } from "../component-html";
import { renderChatCardHeader, type ChatCardHeaderModel } from "../chat-card-header";
import { renderRitualConjurationCard } from "./ritual-conjuration-card";
import { renderRitualContextSummary } from "./ritual-context-summary";
import { renderRitualDamageCard } from "./ritual-damage-card";
import { renderRitualEffectCard } from "./ritual-effect-card";
import type { RitualConjurationViewModel, RitualContextViewModel, RitualDamageViewModel, RitualEffectViewModel } from "./ritual-view-models";

export type RitualSingleTargetCardViewModel = { header: ChatCardHeaderModel; context: RitualContextViewModel; conjuration: RitualConjurationViewModel; damage: RitualDamageViewModel; effect: RitualEffectViewModel };
export function renderRitualSingleTargetCard(model: RitualSingleTargetCardViewModel, options: { disabled?: boolean } = {}): HtmlString {
  const disabled = options.disabled ?? false;
  return markTrustedHtml(`<article class="paranormal-toolkit-chat-card paranormal-toolkit-ritual-single-target"><div class="paranormal-toolkit-chat-card__demo">Demonstração</div>${renderChatCardHeader(model.header)}<div class="paranormal-toolkit-ritual-single-target__body">${renderRitualContextSummary(model.context)}${renderRitualConjurationCard(model.conjuration, disabled)}${renderRitualDamageCard(model.damage, disabled)}${renderRitualEffectCard(model.effect, disabled)}</div></article>`);
}
