import { PROMPT_CLASS } from "./item-use-chat-card-constants";

const CASTING_BACKLASH_ACTION_SECTION_ID = "casting-backlash";
const ACTION_SECTION_ATTRIBUTE = "data-paranormal-toolkit-action-section";
const PROMPT_ID_ATTRIBUTE = "data-paranormal-toolkit-prompt-id";
const PENDING_ID_ATTRIBUTE = "data-paranormal-toolkit-pending-id";
const CASTING_BACKLASH_ENHANCED_ATTRIBUTE = "data-paranormal-toolkit-casting-backlash-enhanced";

const PROMPT_SELECTOR = `.${PROMPT_CLASS}`;
const CASTING_SECTION_SELECTOR = `.${PROMPT_CLASS}__workflow-section--casting`;
const CASTING_SECTION_HEADER_SELECTOR = `.${PROMPT_CLASS}__workflow-section-header`;
const WORKFLOW_NOTES_SELECTOR = `.${PROMPT_CLASS}__workflow-notes`;
const CASTING_BACKLASH_ACTION_SELECTOR = `[${ACTION_SECTION_ATTRIBUTE}="${CASTING_BACKLASH_ACTION_SECTION_ID}"]`;
const TITLE_ROW_CLASS = `${PROMPT_CLASS}__workflow-section-title-row`;
const CASTING_BACKLASH_HEADER_CLASS = `${PROMPT_CLASS}__workflow-section-header--casting-backlash`;
const CASTING_BACKLASH_BUTTON_CLASS = `${PROMPT_CLASS}__casting-backlash-button`;

export function enhanceCastingBacklashAction(root: ParentNode): void {
  for (const prompt of findPromptSections(root)) {
    moveCastingBacklashActionToCastingHeader(prompt);
    removeCastingBacklashObservation(prompt);
  }
}

function findPromptSections(root: ParentNode): HTMLElement[] {
  const prompts = new Set<HTMLElement>();

  if (root instanceof HTMLElement && root.matches(PROMPT_SELECTOR)) {
    prompts.add(root);
  }

  for (const prompt of root.querySelectorAll<HTMLElement>(PROMPT_SELECTOR)) {
    prompts.add(prompt);
  }

  return Array.from(prompts);
}

function moveCastingBacklashActionToCastingHeader(prompt: HTMLElement): void {
  const actionSection = prompt.querySelector<HTMLElement>(CASTING_BACKLASH_ACTION_SELECTOR);
  if (!actionSection) return;

  const actionButton = findCastingBacklashButton(actionSection);
  if (!actionButton) return;

  const castingHeader = prompt.querySelector<HTMLElement>(`${CASTING_SECTION_SELECTOR} ${CASTING_SECTION_HEADER_SELECTOR}`);
  if (!castingHeader) return;

  castingHeader.classList.add(CASTING_BACKLASH_HEADER_CLASS);
  ensureTitleRow(castingHeader);
  configureCastingBacklashButton(actionButton);
  castingHeader.append(actionButton);
  actionSection.remove();
}

function findCastingBacklashButton(actionSection: HTMLElement): HTMLButtonElement | null {
  return actionSection.querySelector<HTMLButtonElement>(
    `button[${PENDING_ID_ATTRIBUTE}], button[${PROMPT_ID_ATTRIBUTE}]`
  );
}

function ensureTitleRow(header: HTMLElement): HTMLElement {
  const existing = header.querySelector<HTMLElement>(`:scope > .${TITLE_ROW_CLASS}`);
  if (existing) return existing;

  const titleRow = document.createElement("div");
  titleRow.classList.add(TITLE_ROW_CLASS);

  const children = Array.from(header.childNodes);
  header.prepend(titleRow);

  for (const child of children) {
    if (child === titleRow) continue;
    if (child instanceof HTMLButtonElement && child.classList.contains(CASTING_BACKLASH_BUTTON_CLASS)) continue;
    titleRow.append(child);
  }

  return titleRow;
}

function configureCastingBacklashButton(button: HTMLButtonElement): void {
  if (button.getAttribute(CASTING_BACKLASH_ENHANCED_ATTRIBUTE) === "true") return;

  const label = button.textContent?.trim() || "Aplicar dano na SAN";
  const title = createCastingBacklashButtonTitle(label, button.disabled);

  button.classList.add(CASTING_BACKLASH_BUTTON_CLASS);
  button.setAttribute(CASTING_BACKLASH_ENHANCED_ATTRIBUTE, "true");
  button.setAttribute("title", title);
  button.setAttribute("aria-label", title);
}

function createCastingBacklashButtonTitle(label: string, executed: boolean): string {
  if (executed) return "Dano na SAN já aplicado";

  const normalizedLabel = label.toLocaleLowerCase().includes("san") ? label : `${label} na SAN`;
  return `${normalizedLabel} no conjurador`;
}

function removeCastingBacklashObservation(prompt: HTMLElement): void {
  for (const notes of prompt.querySelectorAll<HTMLElement>(WORKFLOW_NOTES_SELECTOR)) {
    for (const line of Array.from(notes.children)) {
      const text = line.textContent?.trim() ?? "";

      if (text.startsWith("Falha de conjuração:")) {
        line.remove();
      }
    }

    if (notes.children.length === 0) {
      notes.remove();
    }
  }
}
