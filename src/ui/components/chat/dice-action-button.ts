import { escapeHtml } from "../../rendering/escape-html";

export interface DiceActionButtonViewModel {
  ariaLabel: string;
  disabled?: boolean;
}

const DICE_ICON = `<i class="paranormal-toolkit-dice-action-button__icon fa-solid fa-dice-d20" aria-hidden="true"></i>`;

export function renderDiceActionButton(
  model: DiceActionButtonViewModel,
): string {
  const disabled = model.disabled ? " disabled" : "";
  return `<button class="paranormal-toolkit-dice-action-button" type="button" aria-label="${escapeHtml(model.ariaLabel)}"${disabled}>${DICE_ICON}</button>`;
}
