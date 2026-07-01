import {
  PROMPT_CLASS,
  RESISTANCE_CONTENT_CLASS,
  RESISTANCE_DESCRIPTION_SELECTOR,
  RESISTANCE_HEADER_SELECTOR,
  RESISTANCE_ROLL_BUTTON_SELECTOR,
  RESISTANCE_ROLL_RESULT_SELECTOR,
  RESISTANCE_SELECTOR
} from "./item-use-chat-card-constants";

const RESISTANCE_ROLL_RESULT_ENHANCED_ATTRIBUTE =
  "data-paranormal-toolkit-resistance-roll-result-enhanced";

type ResistanceRollDisplay = {
  skillLabel: string;
  formula: string;
  total: number;
  diceValues: number[];
};

type RollDieViewModel = {
  value: number;
  active: boolean;
};

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

  if (result) {
    if (result.parentElement !== content && !button.contains(result)) {
      content.append(result);
    }

    enhanceResistanceRollResult(result);
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

function enhanceResistanceRollResult(result: HTMLElement): void {
  const parsed = parseResistanceRollResult(result.textContent ?? "");
  if (!parsed) return;

  result.setAttribute(RESISTANCE_ROLL_RESULT_ENHANCED_ATTRIBUTE, "true");
  result.replaceChildren(createResistanceRollDisplay(parsed));
}

function parseResistanceRollResult(text: string): ResistanceRollDisplay | null {
  const match = /^\s*([^:]+):\s*(.+?)\s*=\s*(-?\d+)\s*$/u.exec(text);
  if (!match) return null;

  const [, rawSkillLabel, rawFormulaAndDice, rawTotal] = match;
  const skillLabel = rawSkillLabel?.trim() ?? "Resistência";
  const total = Number(rawTotal);
  if (!Number.isFinite(total)) return null;

  const { formula, diceValues } = splitFormulaAndDice(rawFormulaAndDice ?? "");
  if (!formula) return null;

  return {
    skillLabel,
    formula,
    total: Math.trunc(total),
    diceValues
  };
}

function splitFormulaAndDice(value: string): { formula: string; diceValues: number[] } {
  const normalized = value.trim();
  const diceMatch = /^(.*?)\s+\(([^)]*)\)\s*$/u.exec(normalized);

  if (!diceMatch) {
    return { formula: normalized, diceValues: [] };
  }

  return {
    formula: diceMatch[1]?.trim() ?? normalized,
    diceValues: parseDiceValues(diceMatch[2] ?? "")
  };
}

function parseDiceValues(value: string): number[] {
  return value
    .split(",")
    .map((part) => Number(part.trim()))
    .filter((die) => Number.isFinite(die))
    .map((die) => Math.trunc(die));
}

function createResistanceRollDisplay(result: ResistanceRollDisplay): HTMLElement {
  const roll = document.createElement("div");
  roll.classList.add(
    `${PROMPT_CLASS}__workflow-roll`,
    `${PROMPT_CLASS}__resistance-workflow-roll`
  );
  roll.setAttribute("data-paranormal-toolkit-resistance-total", String(result.total));

  const formula = document.createElement("span");
  formula.classList.add(`${PROMPT_CLASS}__workflow-roll-formula`);
  formula.textContent = `${result.skillLabel}: ${result.formula}`;

  roll.append(formula);

  const diceTray = createDiceTray(result);
  if (diceTray) roll.append(diceTray);

  return roll;
}

function createDiceTray(result: ResistanceRollDisplay): HTMLElement | null {
  if (result.diceValues.length === 0) return null;

  const tray = document.createElement("div");
  tray.classList.add(`${PROMPT_CLASS}__workflow-dice-tray`);

  for (const die of markActiveDice(result.diceValues, result.formula)) {
    const chip = document.createElement("span");
    chip.classList.add(`${PROMPT_CLASS}__workflow-die`);
    if (!die.active) chip.classList.add(`${PROMPT_CLASS}__workflow-die--inactive`);
    chip.textContent = String(die.value);
    tray.append(chip);
  }

  return tray;
}

function markActiveDice(values: number[], formula: string): RollDieViewModel[] {
  if (values.length <= 1) return values.map((value) => ({ value, active: true }));

  const normalizedFormula = formula.toLowerCase();

  if (normalizedFormula.includes("kh")) {
    return markExtremeDie(values, "highest");
  }

  if (normalizedFormula.includes("kl")) {
    return markExtremeDie(values, "lowest");
  }

  return values.map((value) => ({ value, active: true }));
}

function markExtremeDie(values: number[], mode: "highest" | "lowest"): RollDieViewModel[] {
  const extreme = mode === "highest" ? Math.max(...values) : Math.min(...values);
  let selected = false;

  return values.map((value) => {
    const active = !selected && value === extreme;
    if (active) selected = true;
    return { value, active };
  });
}
