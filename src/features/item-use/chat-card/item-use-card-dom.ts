import { PROMPT_CLASS } from "./item-use-chat-card-constants";
import { normalizeText } from "./item-use-card-roll-context";

export const ACTIONS_SELECTOR = `.${PROMPT_CLASS}__actions`;
export const ACTIONS_TITLE_SELECTOR = `.${PROMPT_CLASS}__actions-title`;
export const ACTION_BUTTON_SELECTOR = `.${PROMPT_CLASS}__button`;
export const ACTION_SECTION_ATTRIBUTE = "data-paranormal-toolkit-action-section";
export const PROMPT_EXECUTED_BUTTON_CLASS = `${PROMPT_CLASS}__button--executed`;
export const EXECUTED_LABEL_ATTRIBUTE = "data-paranormal-toolkit-executed-label";

export function getActionTitle(actions: HTMLElement): string {
  return normalizeText(actions.querySelector<HTMLElement>(ACTIONS_TITLE_SELECTOR)?.textContent);
}

export function setActionTitle(actions: HTMLElement, title: string): void {
  const titleElement = actions.querySelector<HTMLElement>(ACTIONS_TITLE_SELECTOR);
  if (titleElement) titleElement.textContent = title;
}

export function findWorkflowSectionByTitle(rollCard: HTMLElement, title: string): HTMLElement | null {
  const normalizedExpectedTitle = normalizeText(title);

  return Array.from(rollCard.querySelectorAll<HTMLElement>(`.${PROMPT_CLASS}__workflow-section`)).find((section) => {
    const sectionTitle = section.querySelector<HTMLElement>(`.${PROMPT_CLASS}__workflow-section-header strong`)?.textContent;
    return normalizeText(sectionTitle) === normalizedExpectedTitle;
  }) ?? null;
}

export function createButtonIcon(text: string, extraClass: string): HTMLElement {
  const icon = document.createElement("span");
  icon.classList.add(`${PROMPT_CLASS}__button-icon`, extraClass);
  icon.setAttribute("aria-hidden", "true");
  icon.textContent = text;
  return icon;
}

export function createButtonLabel(text: string): HTMLElement {
  const label = document.createElement("span");
  label.classList.add(`${PROMPT_CLASS}__button-label`);
  label.textContent = text;
  return label;
}
