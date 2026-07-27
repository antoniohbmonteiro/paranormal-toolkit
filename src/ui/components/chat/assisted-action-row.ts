import { escapeHtml } from "../../rendering/escape-html";
import { renderAssistedActionButton, type AssistedActionButtonViewModel } from "./assisted-action-button";
import { renderCompletionIndicator, type CompletionIndicatorViewModel } from "./completion-indicator";

export type AssistedActionRowControl =
  | { state: "active"; button: AssistedActionButtonViewModel }
  | { state: "disabled"; button: AssistedActionButtonViewModel }
  | { state: "completed"; indicator: CompletionIndicatorViewModel };
export interface AssistedActionRowDetailsViewModel { items: readonly string[]; }
export interface AssistedActionRowViewModel { label: string; description: string; details?: AssistedActionRowDetailsViewModel; control: AssistedActionRowControl; }

export function renderAssistedActionRow(model: AssistedActionRowViewModel): string {
  const label = model.label.trim();
  const description = model.description.trim();
  if (!label || !description) return "";
  const control = model.control.state === "completed"
    ? renderCompletionIndicator(model.control.indicator)
    : renderAssistedActionButton({ ...model.control.button, disabled: model.control.state === "disabled" });
  if (!control) return "";
  const details = renderDetails(model.details);
  return `<div class="paranormal-toolkit-assisted-action-row"><div class="paranormal-toolkit-assisted-action-row__content"><span class="paranormal-toolkit-assisted-action-row__label">${escapeHtml(label)}</span><span class="paranormal-toolkit-assisted-action-row__description">${escapeHtml(description)}</span>${details}</div><div class="paranormal-toolkit-assisted-action-row__control">${control}</div></div>`;
}

function renderDetails(model: AssistedActionRowDetailsViewModel | undefined): string {
  const items = model?.items.map((item) => item.trim()).filter(Boolean) ?? [];
  if (!items.length) return "";
  const list = items.map((item) => `<li>${escapeHtml(item)}</li>`).join("");
  return `<details class="paranormal-toolkit-assisted-action-row__details"><summary><span class="paranormal-toolkit-assisted-action-row__details-show">Ver efeitos</span><span class="paranormal-toolkit-assisted-action-row__details-hide">Ocultar efeitos</span></summary><ul>${list}</ul></details>`;
}
