import { escapeHtml, markTrustedHtml, type HtmlString } from "../component-html";
import type { RitualContextViewModel } from "./ritual-view-models";

export function renderRitualContextSummary(model: RitualContextViewModel): HtmlString {
  return markTrustedHtml(`
    <section class="paranormal-toolkit-ritual-context" aria-label="Contexto do ritual">
      <p class="paranormal-toolkit-ritual-context__route"><strong>${escapeHtml(model.casterName)}</strong><span aria-hidden="true">→</span><strong>${escapeHtml(model.targetName)}</strong></p>
      <div class="paranormal-toolkit-ritual-context__pills">${model.pills.map((pill) => `<span class="paranormal-toolkit-ritual-context__pill">${escapeHtml(pill)}</span>`).join("")}</div>
      <p class="paranormal-toolkit-ritual-context__resistance">${escapeHtml(model.resistanceLabel)}</p>
    </section>
  `);
}
