import { escapeHtml, markTrustedHtml, type HtmlString } from "../component-html";
import type { RitualEffectViewModel } from "./ritual-view-models";

export function renderRitualEffectCard(model: RitualEffectViewModel, disabled = false): HtmlString {
  const label = model.resistanceState === "pending" ? "Role resistência" : `${model.resistanceTotal} · ${model.resistanceState === "success" ? "Sucesso" : "Falha"}`;
  return markTrustedHtml(`
    <section class="paranormal-toolkit-ritual-effect">
      <strong class="paranormal-toolkit-ritual-effect__title">Efeito</strong>
      <div class="paranormal-toolkit-ritual-effect__body"><span class="paranormal-toolkit-ritual-effect__label">${escapeHtml(model.name)} · ${escapeHtml(model.duration)}</span><button type="button" class="paranormal-toolkit-ritual-effect__button" data-ritual-control="effect-resistance"${disabled ? " disabled" : ""}>${label}</button></div>
    </section>
  `);
}
