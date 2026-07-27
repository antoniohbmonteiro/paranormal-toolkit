import { escapeHtml } from "../../rendering/escape-html";

export interface DiceActionButtonViewModel {
  ariaLabel: string;
  disabled?: boolean;
  actionId?: string;
}

const DICE_ICON = `<i class="paranormal-toolkit-dice-action-button__icon fa-solid fa-dice-d20" aria-hidden="true"></i>`;

export function renderDiceActionButton(
  model: DiceActionButtonViewModel,
): string {
  const disabled = model.disabled ? " disabled" : "";
  const action = model.actionId ? ` data-paranormal-toolkit-card-action="roll-resistance" data-paranormal-toolkit-action-id="${escapeHtml(model.actionId)}"` : "";
  return `<button class="paranormal-toolkit-dice-action-button" type="button" aria-label="${escapeHtml(model.ariaLabel)}"${action}${disabled}>${DICE_ICON}</button>`;
}
