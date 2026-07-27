import { escapeHtml } from "../../rendering/escape-html";
import { renderAssistedActionButton, type AssistedActionButtonViewModel } from "./assisted-action-button";
import { renderCompletionIndicator, type CompletionIndicatorViewModel } from "./completion-indicator";

export type AssistedActionRowControl =
  | { state: "active"; button: AssistedActionButtonViewModel }
  | { state: "disabled"; button: AssistedActionButtonViewModel }
  | { state: "completed"; indicator: CompletionIndicatorViewModel };
export interface AssistedActionRowViewModel { label: string; description: string; control: AssistedActionRowControl; }

export function renderAssistedActionRow(model: AssistedActionRowViewModel): string {
  const label = model.label.trim();
  const description = model.description.trim();
  if (!label || !description) return "";
  const control = model.control.state === "completed"
    ? renderCompletionIndicator(model.control.indicator)
    : renderAssistedActionButton({ ...model.control.button, disabled: model.control.state === "disabled" });
  if (!control) return "";
  return `<div class="paranormal-toolkit-assisted-action-row"><div class="paranormal-toolkit-assisted-action-row__content"><span class="paranormal-toolkit-assisted-action-row__label">${escapeHtml(label)}</span><span class="paranormal-toolkit-assisted-action-row__description">${escapeHtml(description)}</span></div><div class="paranormal-toolkit-assisted-action-row__control">${control}</div></div>`;
}
