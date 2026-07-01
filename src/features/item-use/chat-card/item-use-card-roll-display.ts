import { PROMPT_CLASS } from "./item-use-chat-card-constants";

export type WorkflowRollDisplayInput = {
  formula: string;
  total: number | null;
  diceBreakdown?: string | null;
  classNames?: string[];
};

type WorkflowRollDieViewModel = {
  value: number;
  active: boolean;
};

export function createWorkflowRollDisplay(input: WorkflowRollDisplayInput): HTMLElement {
  const roll = document.createElement("div");
  roll.classList.add(`${PROMPT_CLASS}__workflow-roll`, ...(input.classNames ?? []));

  const formula = document.createElement("span");
  formula.classList.add(`${PROMPT_CLASS}__workflow-roll-formula`);
  formula.textContent = input.formula;

  const total = document.createElement("strong");
  total.classList.add(`${PROMPT_CLASS}__workflow-roll-total`);
  total.textContent = input.total === null ? "—" : String(input.total);

  roll.append(formula, total);

  const dice = createWorkflowDiceTray(input.formula, input.diceBreakdown ?? null);
  if (dice) roll.append(dice);

  return roll;
}

export function readWorkflowDiceBreakdown(section: HTMLElement | null): string | null {
  const dice = Array.from(section?.querySelectorAll<HTMLElement>(`.${PROMPT_CLASS}__workflow-die`) ?? [])
    .map((die) => die.textContent?.trim() ?? "")
    .filter((value) => value.length > 0);

  return dice.length > 0 ? `(${dice.join(", ")})` : null;
}

function createWorkflowDiceTray(formula: string, diceBreakdown: string | null): HTMLElement | null {
  const dice = parseDiceValues(diceBreakdown);
  if (dice.length === 0) return null;

  const tray = document.createElement("div");
  tray.classList.add(`${PROMPT_CLASS}__workflow-dice-tray`);

  for (const die of markActiveDice(dice, formula)) {
    const chip = document.createElement("span");
    chip.classList.add(`${PROMPT_CLASS}__workflow-die`);
    if (!die.active) chip.classList.add(`${PROMPT_CLASS}__workflow-die--inactive`);
    chip.textContent = String(die.value);
    tray.append(chip);
  }

  return tray;
}

function parseDiceValues(diceBreakdown: string | null): number[] {
  if (!diceBreakdown) return [];

  const firstGroup = /\(([^)]+)\)/u.exec(diceBreakdown);
  const source = firstGroup?.[1] ?? diceBreakdown;

  return source
    .split(",")
    .map((part) => Number(part.trim()))
    .filter((value) => Number.isFinite(value))
    .map((value) => Math.trunc(value));
}

function markActiveDice(values: number[], formula: string): WorkflowRollDieViewModel[] {
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

function markExtremeDie(values: number[], mode: "highest" | "lowest"): WorkflowRollDieViewModel[] {
  const extreme = mode === "highest" ? Math.max(...values) : Math.min(...values);
  let selected = false;

  return values.map((value) => {
    const active = !selected && value === extreme;
    if (active) selected = true;
    return { value, active };
  });
}
