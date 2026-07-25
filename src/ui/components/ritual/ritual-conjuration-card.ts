import { escapeHtml, markTrustedHtml, type HtmlString } from "../component-html";
import { findSelectedFormula, renderRitualFormulaControl, renderRitualResultTotal } from "./ritual-formula-control";
import type { RitualConjurationViewModel } from "./ritual-view-models";

const STATUS_LABEL = { pending: "Pendente", success: "Sucesso", failure: "Falha" } as const;

export function renderRitualConjurationCard(model: RitualConjurationViewModel, disabled = false): HtmlString {
  const selected = findSelectedFormula(model.options, model.selectedFormulaId);
  return markTrustedHtml(`
    <section class="paranormal-toolkit-ritual-workflow paranormal-toolkit-ritual-workflow--conjuration paranormal-toolkit-ritual-workflow--${model.status}">
      <header class="paranormal-toolkit-ritual-workflow__header"><strong>Conjuração</strong><span class="paranormal-toolkit-ritual-workflow__status">${STATUS_LABEL[model.status]}</span></header>
      <p class="paranormal-toolkit-ritual-workflow__description">${escapeHtml(model.skillLabel)}: ${selected.total ?? "—"} vs DT ${model.difficulty}</p>
      <div class="paranormal-toolkit-ritual-workflow__roll">${renderRitualFormulaControl(model.options, model.selectedFormulaId, "conjuration-formula", disabled)}${renderRitualResultTotal(selected.total)}</div>
    </section>
  `);
}
