import {
  PROMPT_CLASS,
  RESISTANCE_CONTENT_CLASS,
  RESISTANCE_DESCRIPTION_SELECTOR,
  RESISTANCE_HEADER_SELECTOR,
  RESISTANCE_ROLL_BUTTON_SELECTOR,
  RESISTANCE_ROLL_RESULT_SELECTOR,
  RESISTANCE_SELECTOR
} from "./item-use-chat-card-constants";
import { enhanceRitualCardLayout } from "./item-use-card-layout";
import { createSingleTargetResistanceUiState } from "./item-use-card-resistance-state";
import { readCastingDifficulty } from "./item-use-card-roll-context";
import {
  createResistanceDifficultyLabelParts,
  type ResistanceDifficultyLabelParts,
} from "./item-use-card-resistance-label";

const RESISTANCE_ROLL_RESULT_ENHANCED_ATTRIBUTE =
  "data-paranormal-toolkit-resistance-roll-result-enhanced";
const RESISTANCE_ORIGINAL_DESCRIPTION_ATTRIBUTE =
  "data-paranormal-toolkit-resistance-original-description";
const RESISTANCE_SKILL_ATTRIBUTE =
  "data-paranormal-toolkit-resistance-skill";
const RESISTANCE_SKILL_LABEL_ATTRIBUTE =
  "data-paranormal-toolkit-resistance-skill-label";
const RESISTANCE_WITHOUT_ROLL_BUTTON_CLASS =
  `${PROMPT_CLASS}__resistance--without-roll-button`;

const RESISTANCE_SKILL_LABELS = ["Fortitude", "Reflexos", "Vontade"] as const;

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

  enhanceRitualCardLayout(root);
}

function enhanceResistanceCard(resistance: HTMLElement): void {
  const header = resistance.querySelector<HTMLElement>(RESISTANCE_HEADER_SELECTOR);
  const description = resistance.querySelector<HTMLElement>(RESISTANCE_DESCRIPTION_SELECTOR);
  const button = resistance.querySelector<HTMLElement>(RESISTANCE_ROLL_BUTTON_SELECTOR);
  const visibleButton = isVisibleResistanceRollButton(button) ? button : null;
  const result = resistance.querySelector<HTMLElement>(RESISTANCE_ROLL_RESULT_SELECTOR);

  if (!header && !description && !result && !button) return;

  resistance.classList.toggle(RESISTANCE_WITHOUT_ROLL_BUTTON_CLASS, !visibleButton);

  const content = getOrCreateResistanceContent(resistance, button);

  if (header && header.parentElement !== content) {
    content.append(header);
  }

  if (description && description.parentElement !== content) {
    content.append(description);
  }

  if (result) {
    if (result.parentElement !== resistance && (!button || !button.contains(result))) {
      resistance.append(result);
    }

    enhanceResistanceRollResult(result);
  }

  decorateResistanceDifficultyLabel(resistance, button, description);

  if (!visibleButton) return;

  decorateResistanceRollButton(visibleButton);

  if (visibleButton.parentElement !== resistance) {
    resistance.append(visibleButton);
  }
}


function decorateResistanceDifficultyLabel(
  resistance: HTMLElement,
  button: HTMLElement | null,
  description: HTMLElement | null,
): void {
  if (!description) return;

  const rollCard = resistance.closest<HTMLElement>(`.${PROMPT_CLASS}__roll-card`);
  if (!rollCard) return;

  const originalDescription = getOriginalResistanceDescription(description);
  const label = createResistanceDifficultyLabelParts({
    description: originalDescription,
    skillLabel: resolveResistanceSkillLabel(button, originalDescription),
    difficulty: readCastingDifficulty(rollCard),
  });

  if (!label) {
    description.textContent = originalDescription;
    description.classList.remove(`${PROMPT_CLASS}__resistance-description--difficulty`);
    return;
  }

  renderResistanceDifficultyLabel(description, label);
  description.classList.add(`${PROMPT_CLASS}__resistance-description--difficulty`);
}

function renderResistanceDifficultyLabel(
  description: HTMLElement,
  label: ResistanceDifficultyLabelParts,
): void {
  const skill = document.createElement("span");
  skill.classList.add(`${PROMPT_CLASS}__resistance-label-skill`);
  skill.textContent = label.skillLabel;

  const difficulty = document.createElement("strong");
  difficulty.classList.add(`${PROMPT_CLASS}__resistance-label-difficulty`);
  difficulty.textContent = label.difficultyLabel;

  const children: Array<Node> = [skill, document.createTextNode(" · "), difficulty];

  if (label.description) {
    const descriptionText = document.createElement("span");
    descriptionText.classList.add(`${PROMPT_CLASS}__resistance-label-effect`);
    descriptionText.textContent = label.description;
    children.push(document.createTextNode(" · "), descriptionText);
  }

  description.replaceChildren(...children);
}

function getOriginalResistanceDescription(description: HTMLElement): string {
  const existing = description.getAttribute(RESISTANCE_ORIGINAL_DESCRIPTION_ATTRIBUTE);
  if (existing !== null) return existing;

  const original = description.textContent?.trim() ?? "";
  description.setAttribute(RESISTANCE_ORIGINAL_DESCRIPTION_ATTRIBUTE, original);
  return original;
}

function getOrCreateResistanceContent(resistance: HTMLElement, button: HTMLElement | null): HTMLElement {
  const existing = resistance.querySelector<HTMLElement>(`.${RESISTANCE_CONTENT_CLASS}`);
  if (existing) return existing;

  const content = document.createElement("div");
  content.classList.add(RESISTANCE_CONTENT_CLASS);
  resistance.insertBefore(content, button?.parentElement === resistance ? button : resistance.firstChild);
  return content;
}

function isVisibleResistanceRollButton(button: HTMLElement | null): button is HTMLElement {
  if (!button) return false;
  if (button.hidden) return false;
  return button.getAttribute("aria-hidden") !== "true";
}

function resolveResistanceSkillLabel(button: HTMLElement | null, description: string): string | null {
  const buttonSkillLabel = button?.getAttribute(RESISTANCE_SKILL_LABEL_ATTRIBUTE)
    ?? button?.getAttribute(RESISTANCE_SKILL_ATTRIBUTE)
    ?? null;

  if (buttonSkillLabel) return buttonSkillLabel;
  return readResistanceSkillLabelFromDescription(description);
}

function readResistanceSkillLabelFromDescription(description: string): string | null {
  const normalizedDescription = normalizeResistanceText(description);

  return RESISTANCE_SKILL_LABELS.find((label) => {
    return normalizedDescription.startsWith(normalizeResistanceText(label));
  }) ?? null;
}

function normalizeResistanceText(value: string): string {
  return value
    .normalize("NFD")
    .replace(/\p{Diacritic}/gu, "")
    .replace(/\s+/gu, " ")
    .trim()
    .toLocaleLowerCase();
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
  formula.textContent = result.formula;
  formula.title = `${result.skillLabel}: ${result.formula}`;

  roll.append(formula);

  const diceTray = createDiceTray(result);
  if (diceTray) roll.append(diceTray);

  return roll;
}


function decorateResistanceRollButton(button: HTMLElement): void {
  button.classList.remove(
    `${PROMPT_CLASS}__resistance-roll-button--succeeded`,
    `${PROMPT_CLASS}__resistance-roll-button--failed`,
  );

  const rollCard = button.closest<HTMLElement>(`.${PROMPT_CLASS}__roll-card`);
  if (!rollCard) return;

  const state = createSingleTargetResistanceUiState(rollCard).state;
  if (state.kind !== "succeeded" && state.kind !== "failed") return;

  const outcome = state.kind === "succeeded" ? "succeeded" : "failed";
  const marker = outcome === "succeeded" ? "✓" : "✕";
  const outcomeLabel = outcome === "succeeded" ? "sucesso" : "falha";

  button.classList.add(`${PROMPT_CLASS}__resistance-roll-button--${outcome}`);
  button.textContent = `${state.total} ${marker}`;
  button.title = `${button.getAttribute("data-paranormal-toolkit-resistance-skill-label") ?? "Resistência"}: ${state.total}, ${outcomeLabel}. Rolar novamente`;
  button.setAttribute("aria-label", button.title);
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
