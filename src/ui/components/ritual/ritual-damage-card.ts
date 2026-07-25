import { escapeHtml, markTrustedHtml, type HtmlString } from "../component-html";
import { findSelectedFormula, renderRitualFormulaControl, renderRitualResultTotal } from "./ritual-formula-control";
import { renderRitualResistancePanel } from "./ritual-resistance-panel";
import type { RitualDamageViewModel } from "./ritual-view-models";

export function renderRitualDamageCard(model: RitualDamageViewModel, disabled = false): HtmlString {
  const selected = findSelectedFormula(model.options, model.selectedFormulaId);
  const actionEnabled = model.resistance.state !== "pending" && !disabled;
  const actionLabel = model.damageApplied ? "Dano aplicado na demonstração" : actionEnabled ? "Aplicar dano" : "Role resistência";
  return markTrustedHtml(`
    <section class="paranormal-toolkit-ritual-workflow paranormal-toolkit-ritual-workflow--damage">
      <header class="paranormal-toolkit-ritual-workflow__header"><strong>Dano</strong></header>
      <p class="paranormal-toolkit-ritual-workflow__description">${escapeHtml(model.damageType)}</p>
      <div class="paranormal-toolkit-ritual-workflow__roll">${renderRitualFormulaControl(model.options, model.selectedFormulaId, "damage-formula", disabled)}${renderRitualResultTotal(selected.total)}</div>
      ${renderRitualResistancePanel(model.resistance, disabled)}
      <section class="paranormal-toolkit-ritual-assisted-action">
        <strong class="paranormal-toolkit-ritual-assisted-action__title">Aplicar dano</strong>
        <p class="paranormal-toolkit-ritual-assisted-action__hint">${model.resistance.state === "pending" ? "Role a resistência antes de aplicar esta ação." : "A resistência foi resolvida; a ação local está disponível."}</p>
        <button type="button" class="paranormal-toolkit-ritual-assisted-action__button" data-ritual-control="apply-damage"${actionEnabled && !model.damageApplied ? "" : " disabled"}>${actionLabel}</button>
      </section>
    </section>
  `);
}
