import { renderAssistedActionRow, type AssistedActionRowViewModel } from "../chat/assisted-action-row";
import { escapeHtml } from "../../rendering/escape-html";

export interface RitualAssistedActionsPanelViewModel { rows: readonly AssistedActionRowViewModel[]; note?: string; }

export function renderRitualAssistedActionsPanel(model: RitualAssistedActionsPanelViewModel): string {
  const rows = model.rows.map(renderAssistedActionRow).filter(Boolean);
  if (!rows.length && !model.note?.trim()) return "";
  const note = model.note?.trim() ? `<p class="paranormal-toolkit-ritual-assisted-actions-panel__note">${escapeHtml(model.note)}</p>` : "";
  return `<section class="paranormal-toolkit-ritual-assisted-actions-panel"><h4 class="paranormal-toolkit-ritual-assisted-actions-panel__title">AÇÕES ASSISTIDAS</h4>${note}<div class="paranormal-toolkit-ritual-assisted-actions-panel__rows">${rows.join("")}</div></section>`;
}
