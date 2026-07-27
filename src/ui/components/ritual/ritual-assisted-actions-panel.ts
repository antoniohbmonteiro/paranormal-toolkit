import { renderAssistedActionRow, type AssistedActionRowViewModel } from "../chat/assisted-action-row";

export interface RitualAssistedActionsPanelViewModel { rows: readonly AssistedActionRowViewModel[]; }

export function renderRitualAssistedActionsPanel(model: RitualAssistedActionsPanelViewModel): string {
  const rows = model.rows.map(renderAssistedActionRow).filter(Boolean);
  if (!rows.length) return "";
  return `<section class="paranormal-toolkit-ritual-assisted-actions-panel"><h4 class="paranormal-toolkit-ritual-assisted-actions-panel__title">AÇÕES ASSISTIDAS</h4><div class="paranormal-toolkit-ritual-assisted-actions-panel__rows">${rows.join("")}</div></section>`;
}
