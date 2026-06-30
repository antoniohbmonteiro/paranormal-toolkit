import {
  RESISTANCE_CONTENT_CLASS,
  RESISTANCE_DESCRIPTION_SELECTOR,
  RESISTANCE_HEADER_SELECTOR,
  RESISTANCE_ROLL_BUTTON_SELECTOR,
  RESISTANCE_ROLL_RESULT_SELECTOR,
  RESISTANCE_SELECTOR
} from "./item-use-chat-card-constants";

export function enhanceResistanceLayout(root: ParentNode): void {
  for (const resistance of Array.from(root.querySelectorAll<HTMLElement>(RESISTANCE_SELECTOR))) {
    enhanceResistanceCard(resistance);
  }
}

function enhanceResistanceCard(resistance: HTMLElement): void {
  const header = resistance.querySelector<HTMLElement>(RESISTANCE_HEADER_SELECTOR);
  const description = resistance.querySelector<HTMLElement>(RESISTANCE_DESCRIPTION_SELECTOR);
  const button = resistance.querySelector<HTMLElement>(RESISTANCE_ROLL_BUTTON_SELECTOR);
  const result = resistance.querySelector<HTMLElement>(RESISTANCE_ROLL_RESULT_SELECTOR);

  if (!button || (!header && !description && !result)) return;

  const content = getOrCreateResistanceContent(resistance, button);

  if (header && header.parentElement !== content) {
    content.append(header);
  }

  if (description && description.parentElement !== content) {
    content.append(description);
  }

  if (result && result.parentElement !== content && !button.contains(result)) {
    content.append(result);
  }

  if (button.parentElement !== resistance) {
    resistance.append(button);
  }
}

function getOrCreateResistanceContent(resistance: HTMLElement, button: HTMLElement): HTMLElement {
  const existing = resistance.querySelector<HTMLElement>(`.${RESISTANCE_CONTENT_CLASS}`);
  if (existing) return existing;

  const content = document.createElement("div");
  content.classList.add(RESISTANCE_CONTENT_CLASS);
  resistance.insertBefore(content, button.parentElement === resistance ? button : resistance.firstChild);
  return content;
}
