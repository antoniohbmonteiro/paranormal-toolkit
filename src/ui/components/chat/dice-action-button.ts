import { escapeHtml } from "../../rendering/escape-html";

export interface DiceActionButtonViewModel {
  ariaLabel: string;
  disabled?: boolean;
}

const DICE_ICON = `<svg class="paranormal-toolkit-dice-action-button__icon" viewBox="0 0 24 24" aria-hidden="true"><path d="M12 2 2 8v8l10 6 10-6V8L12 2Z"/><path d="m2 8 10 6 10-6M12 2v12"/></svg>`;

export function renderDiceActionButton(
  model: DiceActionButtonViewModel,
): string {
  const disabled = model.disabled ? " disabled" : "";
  return `<button class="paranormal-toolkit-dice-action-button" type="button" aria-label="${escapeHtml(model.ariaLabel)}"${disabled}>${DICE_ICON}</button>`;
}
