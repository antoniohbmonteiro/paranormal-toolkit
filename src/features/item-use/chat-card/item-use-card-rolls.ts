import {
  WORKFLOW_DICE_TRAY_SELECTOR,
  WORKFLOW_FORMULA_SELECTOR,
  WORKFLOW_FORMULA_TOGGLE_CLASS,
  WORKFLOW_ROLL_DICE_OPEN_CLASS,
  WORKFLOW_ROLL_SELECTOR
} from "./item-use-chat-card-constants";

const ENHANCED_ATTRIBUTE = "data-paranormal-toolkit-dice-toggle-enhanced";

export function enhanceWorkflowRolls(root: ParentNode): void {
  for (const roll of Array.from(root.querySelectorAll<HTMLElement>(WORKFLOW_ROLL_SELECTOR))) {
    enhanceRoll(roll);
  }
}

export function handleWorkflowRollClick(event: MouseEvent): void {
  const formula = resolveFormulaElement(event.target);
  if (!formula) return;

  const roll = resolveRollElement(formula);
  if (!roll) return;

  event.preventDefault();
  toggleDiceTray(roll, formula);
}

export function handleWorkflowRollKeydown(event: KeyboardEvent): void {
  if (event.key !== "Enter" && event.key !== " ") return;

  const formula = resolveFormulaElement(event.target);
  if (!formula) return;

  const roll = resolveRollElement(formula);
  if (!roll) return;

  event.preventDefault();
  toggleDiceTray(roll, formula);
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
