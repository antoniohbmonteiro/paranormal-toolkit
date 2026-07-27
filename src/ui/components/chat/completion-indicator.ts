import { escapeHtml } from "../../rendering/escape-html";

export interface CompletionIndicatorViewModel { label: string; }

export function renderCompletionIndicator(model: CompletionIndicatorViewModel): string {
  const label = model.label.trim();
  if (!label) return "";
  return `<span class="paranormal-toolkit-completion-indicator"><span class="paranormal-toolkit-completion-indicator__check" aria-hidden="true">✓</span><span class="paranormal-toolkit-completion-indicator__label">${escapeHtml(label)}</span></span>`;
}
