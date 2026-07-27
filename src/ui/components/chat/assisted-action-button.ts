import { escapeHtml } from "../../rendering/escape-html";

export interface AssistedActionButtonViewModel {
  label: string;
  disabled?: boolean;
  actionId?: string;
  actionKind?: string;
}

export function renderAssistedActionButton(model: AssistedActionButtonViewModel): string {
  const label = model.label.trim();
  if (!label) return "";
  const action = model.actionId && model.actionKind
    ? ` data-paranormal-toolkit-card-action="${escapeHtml(model.actionKind)}" data-paranormal-toolkit-action-id="${escapeHtml(model.actionId)}"`
    : "";
  return `<button class="paranormal-toolkit-assisted-action-button" type="button"${action}${model.disabled ? " disabled" : ""}>${escapeHtml(label)}</button>`;
}
