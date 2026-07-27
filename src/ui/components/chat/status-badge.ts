export type StatusBadgeState = "success" | "failure";

export interface StatusBadgeViewModel {
  state: StatusBadgeState;
}

const STATE_CLASSES: Record<StatusBadgeState, string> = {
  success: "paranormal-toolkit-status-badge--success",
  failure: "paranormal-toolkit-status-badge--failure",
};

const STATE_LABELS: Record<StatusBadgeState, string> = {
  success: "✓ SUCESSO",
  failure: "✕ FALHA",
};

export function renderStatusBadge(model: StatusBadgeViewModel): string {
  const state = STATE_CLASSES[model.state] ? model.state : "failure";
  return `<span class="paranormal-toolkit-status-badge ${STATE_CLASSES[state]}">${STATE_LABELS[state]}</span>`;
}
