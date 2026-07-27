import { escapeHtml } from "../../rendering/escape-html";

export interface AssistedActionButtonViewModel {
  label: string;
  disabled?: boolean;
}

export function renderAssistedActionButton(model: AssistedActionButtonViewModel): string {
  const label = model.label.trim();
  if (!label) return "";
  return `<button class="paranormal-toolkit-assisted-action-button" type="button"${model.disabled ? " disabled" : ""}>${escapeHtml(label)}</button>`;
}
