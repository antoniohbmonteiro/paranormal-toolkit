import { escapeHtml, markTrustedHtml, type HtmlString } from "../component-html";
import type { RitualResistanceViewModel } from "./ritual-view-models";

export function renderRitualResistancePanel(model: RitualResistanceViewModel, disabled = false): HtmlString {
  const result = model.state === "pending" ? "" : `<span class="paranormal-toolkit-ritual-resistance__result">${model.total} · ${model.state === "success" ? "Sucesso" : "Falha"}</span>`;
  return markTrustedHtml(`
    <section class="paranormal-toolkit-ritual-resistance paranormal-toolkit-ritual-resistance--${model.state}">
      <div class="paranormal-toolkit-ritual-resistance__content">
        <strong class="paranormal-toolkit-ritual-resistance__title">Resistência</strong>
        <p class="paranormal-toolkit-ritual-resistance__description">${escapeHtml(model.label)} · <strong>DT ${model.difficulty}</strong> · ${escapeHtml(model.consequence)}</p>
        ${result}
      </div>
      <button type="button" class="paranormal-toolkit-ritual-resistance__button" data-ritual-control="resistance"${disabled ? " disabled" : ""} aria-label="Rolar resistência">${model.total ?? '<i class="fa-solid fa-dice-d20" aria-hidden="true"></i>'}</button>
    </section>
  `);
}
