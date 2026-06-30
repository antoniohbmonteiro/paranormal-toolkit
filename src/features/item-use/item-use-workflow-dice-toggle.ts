import { MODULE_ID } from "../../constants";

const PROMPT_CLASS = `${MODULE_ID}-item-use-prompt`;
const WORKFLOW_SECTION_SELECTOR = `.${PROMPT_CLASS}__workflow-section`;
const WORKFLOW_ROLL_SELECTOR = `.${PROMPT_CLASS}__workflow-roll`;
const WORKFLOW_ROLL_DICE_OPEN_CLASS = `${PROMPT_CLASS}__workflow-roll--dice-open`;
const WORKFLOW_FORMULA_SELECTOR = `.${PROMPT_CLASS}__workflow-roll-formula`;
const WORKFLOW_FORMULA_TOGGLE_CLASS = `${PROMPT_CLASS}__workflow-roll-formula--toggle`;
const WORKFLOW_DICE_TRAY_SELECTOR = `.${PROMPT_CLASS}__workflow-dice-tray`;
const ROLL_DETAIL_TOGGLE_SELECTOR = `.${PROMPT_CLASS}__roll-detail-toggle`;
const ROLL_DETAIL_LIST_SELECTOR = `.${PROMPT_CLASS}__roll-detail-list`;
const ENHANCED_ATTRIBUTE = "data-paranormal-toolkit-dice-toggle-enhanced";

const INITIAL_ENHANCEMENT_DELAYS_MS = [0, 100, 500, 1_500, 3_000] as const;

let registered = false;
let observer: MutationObserver | null = null;

export function registerItemUseWorkflowDiceToggle(): void {
  if (registered) return;
  registered = true;

  Hooks.on("renderChatMessageHTML", (_message: unknown, html: unknown) => {
    enhanceRoot(resolveRootElement(html));
  });

  Hooks.on("renderChatMessage", (_message: unknown, html: unknown) => {
    enhanceRoot(resolveRootElement(html));
  });

  Hooks.once("ready", () => {
    enhanceRoot(document);
    observeRenderedChatCards();
  });

  document.addEventListener("click", handleDocumentClick);
  document.addEventListener("keydown", handleDocumentKeydown);

  for (const delayMs of INITIAL_ENHANCEMENT_DELAYS_MS) {
    globalThis.setTimeout(() => enhanceRoot(document), delayMs);
  }
}

function handleDocumentClick(event: MouseEvent): void {
  const formula = resolveFormulaElement(event.target);
  if (!formula) return;

  const roll = resolveRollElement(formula);
  if (!roll) return;

  event.preventDefault();
  toggleDiceTray(roll, formula);
}

function handleDocumentKeydown(event: KeyboardEvent): void {
  if (event.key !== "Enter" && event.key !== " ") return;

  const formula = resolveFormulaElement(event.target);
  if (!formula) return;

  const roll = resolveRollElement(formula);
  if (!roll) return;

  event.preventDefault();
  toggleDiceTray(roll, formula);
}

function observeRenderedChatCards(): void {
  if (observer || !document.body) return;

  observer = new MutationObserver((mutations) => {
    for (const mutation of mutations) {
      for (const node of mutation.addedNodes) {
        if (node instanceof HTMLElement || node instanceof DocumentFragment) {
          enhanceRoot(node);
        }
      }
    }
  });

  observer.observe(document.body, { childList: true, subtree: true });
}

function enhanceRoot(root: ParentNode | null): void {
  if (!root) return;

  removeWorkflowRollDetails(root);

  for (const roll of root.querySelectorAll<HTMLElement>(WORKFLOW_ROLL_SELECTOR)) {
    enhanceRoll(roll);
  }
}

function removeWorkflowRollDetails(root: ParentNode): void {
  for (const section of root.querySelectorAll<HTMLElement>(WORKFLOW_SECTION_SELECTOR)) {
    for (const element of section.querySelectorAll<HTMLElement>(`${ROLL_DETAIL_TOGGLE_SELECTOR}, ${ROLL_DETAIL_LIST_SELECTOR}`)) {
      element.remove();
    }
  }
}

function enhanceRoll(roll: HTMLElement): void {
  const diceTray = roll.querySelector<HTMLElement>(WORKFLOW_DICE_TRAY_SELECTOR);
  if (!diceTray) return;

  const formula = roll.querySelector<HTMLElement>(WORKFLOW_FORMULA_SELECTOR);
  if (!formula) return;

  if (formula.getAttribute(ENHANCED_ATTRIBUTE) === "true") return;

  formula.setAttribute(ENHANCED_ATTRIBUTE, "true");
  formula.classList.add(WORKFLOW_FORMULA_TOGGLE_CLASS);
  formula.setAttribute("role", "button");
  formula.setAttribute("tabindex", "0");
  formula.setAttribute("aria-expanded", "false");
  formula.title = "Mostrar dados da rolagem";
  formula.setAttribute("aria-label", formula.title);

  diceTray.hidden = true;

  if (!formula.querySelector("i")) {
    const icon = document.createElement("i");
    icon.classList.add("fa-solid", "fa-chevron-down");
    icon.setAttribute("aria-hidden", "true");
    formula.append(icon);
  }
}

function toggleDiceTray(roll: HTMLElement, formula: HTMLElement): void {
  const diceTray = roll.querySelector<HTMLElement>(WORKFLOW_DICE_TRAY_SELECTOR);
  if (!diceTray) return;

  const willOpen = !roll.classList.contains(WORKFLOW_ROLL_DICE_OPEN_CLASS);
  setDiceTrayOpen(roll, formula, diceTray, willOpen);
}

function setDiceTrayOpen(roll: HTMLElement, formula: HTMLElement, diceTray: HTMLElement, isOpen: boolean): void {
  roll.classList.toggle(WORKFLOW_ROLL_DICE_OPEN_CLASS, isOpen);
  diceTray.hidden = !isOpen;
  formula.setAttribute("aria-expanded", isOpen ? "true" : "false");
  formula.title = isOpen ? "Ocultar dados da rolagem" : "Mostrar dados da rolagem";
  formula.setAttribute("aria-label", formula.title);

  const icon = formula.querySelector("i");
  if (!icon) return;

  icon.classList.toggle("fa-chevron-down", !isOpen);
  icon.classList.toggle("fa-chevron-up", isOpen);
}

function resolveFormulaElement(target: EventTarget | null): HTMLElement | null {
  if (!(target instanceof Element)) return null;

  const formula = target.closest<HTMLElement>(WORKFLOW_FORMULA_SELECTOR);
  if (!formula) return null;

  const roll = resolveRollElement(formula);
  if (!roll) return null;

  enhanceRoll(roll);
  return formula.classList.contains(WORKFLOW_FORMULA_TOGGLE_CLASS) ? formula : null;
}

function resolveRollElement(formula: HTMLElement): HTMLElement | null {
  const roll = formula.closest<HTMLElement>(WORKFLOW_ROLL_SELECTOR);
  if (!roll) return null;

  return roll.querySelector(WORKFLOW_DICE_TRAY_SELECTOR) ? roll : null;
}

function resolveRootElement(value: unknown): ParentNode | null {
  if (value instanceof Document || value instanceof HTMLElement || value instanceof DocumentFragment) {
    return value;
  }

  if (!value || typeof value !== "object") return null;

  const maybeIndexed = value as { 0?: unknown };
  return maybeIndexed[0] instanceof HTMLElement ? maybeIndexed[0] : null;
}
