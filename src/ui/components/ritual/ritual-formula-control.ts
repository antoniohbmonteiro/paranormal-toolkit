import { escapeHtml, markTrustedHtml, type HtmlString } from "../component-html";
import type { RitualFormulaOptionViewModel } from "./ritual-view-models";

export function findSelectedFormula(
  options: readonly RitualFormulaOptionViewModel[],
  selectedId: string,
): RitualFormulaOptionViewModel {
  return options.find((option) => option.id === selectedId) ?? options[0]!;
}

export function renderRitualFormulaControl(
  options: readonly RitualFormulaOptionViewModel[],
  selectedId: string,
  control: "conjuration-formula" | "damage-formula",
  disabled = false,
): HtmlString {
  const selected = findSelectedFormula(options, selectedId);
  const optionMarkup = options.map((option) =>
    `<option value="${escapeHtml(option.id)}"${option.id === selected.id ? " selected" : ""}>${escapeHtml(option.formula)}</option>`,
  ).join("");

  return markTrustedHtml(`
    <label class="paranormal-toolkit-ritual-formula">
      <span class="paranormal-toolkit-ritual-formula__label">${escapeHtml(selected.label)}</span>
      <select class="paranormal-toolkit-ritual-formula__select" data-ritual-control="${control}"${disabled ? " disabled" : ""} aria-label="${escapeHtml(selected.label)}">
        ${optionMarkup}
      </select>
    </label>
  `);
}

export function renderRitualResultTotal(total: number | null): HtmlString {
  return markTrustedHtml(`<strong class="paranormal-toolkit-ritual-result-total">${total ?? "—"}</strong>`);
}
