import { MODULE_ID } from "../../../constants";
import {
  CHAT_CARD_FLAG_KEY,
  PROMPT_CLASS,
  RESISTANCE_CONTENT_CLASS,
  RESISTANCE_DESCRIPTION_SELECTOR,
  RESISTANCE_HEADER_SELECTOR,
  RESISTANCE_ROLL_BUTTON_SELECTOR,
  RESISTANCE_ROLL_RESULT_SELECTOR,
  RESISTANCE_SELECTOR
} from "./item-use-chat-card-constants";
import { getItemUseDamageResolutionMode } from "../item-use-settings";

const RESISTANCE_ROLL_RESULT_ENHANCED_ATTRIBUTE =
  "data-paranormal-toolkit-resistance-roll-result-enhanced";

const PROMPT_ID_ATTRIBUTE = "data-paranormal-toolkit-prompt-id";
const ACTIONS_SELECTOR = `.${PROMPT_CLASS}__actions`;
const ACTIONS_TITLE_SELECTOR = `.${PROMPT_CLASS}__actions-title`;
const ACTION_BUTTON_SELECTOR = `.${PROMPT_CLASS}__button`;
const PROMPT_EXECUTED_BUTTON_CLASS = `${PROMPT_CLASS}__button--executed`;
const EXECUTED_LABEL_ATTRIBUTE = "data-paranormal-toolkit-executed-label";
const DAMAGE_ACTION_SECTION_ATTRIBUTE = "data-paranormal-toolkit-action-section";
const DAMAGE_RESOLUTION_STATE_ATTRIBUTE = "data-paranormal-toolkit-damage-resolution-state";
const DAMAGE_BUTTON_ICON_ATTRIBUTE = "data-paranormal-toolkit-damage-icon-enhanced";
const EFFECT_BUTTON_ICON_ATTRIBUTE = "data-paranormal-toolkit-effect-icon-enhanced";
const EFFECT_ACTION_COMPACTED_ATTRIBUTE = "data-paranormal-toolkit-effect-action-compacted";
const EFFECT_RESISTANCE_GATE_ATTRIBUTE = "data-paranormal-toolkit-effect-resistance-gate";
const EFFECT_ACTION_WORKFLOW_CLASS = `${PROMPT_CLASS}__workflow-section--effect-action`;
const RESISTANCE_BUTTON_BOUND_ATTRIBUTE = "data-paranormal-toolkit-resistance-damage-refresh-bound";
const DAMAGE_WORKFLOW_SECTION_SELECTOR = `.${PROMPT_CLASS}__workflow-section--effect`;

const DAMAGE_RESOLUTION_REFRESH_DELAYS_MS = [0, 80, 180, 400, 900, 1_600] as const;

const SUMMARY_KEY_CASTING_DIFFICULTY = "Conjuração DT";

const DAMAGE_BUTTON_LABELS = {
  normal: /\bnormal\b|\bcheio\b/iu,
  half: /\bmetade\b|\bmeio\b|1\/2/iu
} as const;

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

type PersistedToolkitChatCard = {
  prompts?: unknown[];
};

type PersistedPromptLike = {
  pendingId?: unknown;
  actorId?: unknown;
  buttonLabel?: unknown;
  summaryLines?: unknown;
};

type ChatMessageFlagDocument = {
  id?: unknown;
  getFlag?: (scope: string, key: string) => unknown;
};

type DamageResolutionState = "manual" | "pending" | "resisted" | "failed";

export function enhanceResistanceLayout(root: ParentNode): void {
  for (const resistance of Array.from(root.querySelectorAll<HTMLElement>(RESISTANCE_SELECTOR))) {
    enhanceResistanceCard(resistance);
  }

  enhanceDamageResolutionLayout(root);
  enhanceEffectActionsLayout(root);
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
    if (result.parentElement !== resistance && !button.contains(result)) {
      resistance.append(result);
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
  formula.textContent = result.formula;
  formula.title = `${result.skillLabel}: ${result.formula}`;

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

function enhanceDamageResolutionLayout(root: ParentNode): void {
  for (const rollCard of Array.from(root.querySelectorAll<HTMLElement>(`.${PROMPT_CLASS}__roll-card`))) {
    enhanceRollCardDamageResolution(rollCard);
  }
}

function enhanceRollCardDamageResolution(rollCard: HTMLElement): void {
  const damageSection = findDamageWorkflowSection(rollCard);
  if (!damageSection) return;

  const damageActions = findDamageActionSection(rollCard);
  const resistance = rollCard.querySelector<HTMLElement>(RESISTANCE_SELECTOR);

  if (resistance && resistance.parentElement !== damageSection) {
    damageSection.append(resistance);
  }

  if (damageActions) {
    damageActions.classList.add(`${PROMPT_CLASS}__actions--embedded`, `${PROMPT_CLASS}__actions--damage-resolution`);

    const title = damageActions.querySelector<HTMLElement>(ACTIONS_TITLE_SELECTOR);
    if (title) title.textContent = "Aplicar dano";

    if (damageActions.parentElement !== damageSection) {
      damageSection.append(damageActions);
    }

    bindDamageResolutionRefresh(rollCard);
    updateDamageActionButtons(rollCard, damageActions);
  }

  const effectActions = findEffectActionSection(rollCard);
  if (!effectActions) return;

  enhanceEffectActionSection(effectActions);
  moveEffectActionSectionIntoRollCard(rollCard, damageSection, effectActions);
  updateEffectActionResistanceGate(rollCard, effectActions);
}

function enhanceEffectActionsLayout(root: ParentNode): void {
  for (const actions of Array.from(root.querySelectorAll<HTMLElement>(ACTIONS_SELECTOR))) {
    enhanceEffectActionSection(actions);
  }
}

function enhanceEffectActionSection(actions: HTMLElement): boolean {
  const title = actions.querySelector<HTMLElement>(ACTIONS_TITLE_SELECTOR);
  const normalizedTitle = normalizeText(title?.textContent);
  if (normalizedTitle !== "aplicar efeito" && normalizedTitle !== "efeito") return false;

  actions.classList.add(
    `${PROMPT_CLASS}__actions--effect-resolution`,
    `${PROMPT_CLASS}__workflow-section`,
    EFFECT_ACTION_WORKFLOW_CLASS
  );
  if (title) title.textContent = "Efeito";

  const button = actions.querySelector<HTMLButtonElement>(ACTION_BUTTON_SELECTOR);
  if (!button) return true;

  const currentLabel = button.textContent?.trim() ?? "";
  if (!currentLabel) return true;

  const originalLabel = resolveEffectActionOriginalLabel(button, currentLabel);
  if (originalLabel) {
    ensureEffectActionLabel(actions, title, originalLabel);
  }

  if (isResolvedEffectButton(button, currentLabel)) {
    compactResolvedEffectActionButton(button);
    return true;
  }

  if (isResistanceGatedEffectButton(button, currentLabel)) {
    return true;
  }

  enhanceEffectActionButton(button, originalLabel ?? currentLabel);
  return true;
}

function findEffectActionSection(rollCard: HTMLElement): HTMLElement | null {
  const sections = Array.from(rollCard.parentElement?.querySelectorAll<HTMLElement>(ACTIONS_SELECTOR) ?? []);

  return sections.find((section) => {
    const title = section.querySelector<HTMLElement>(ACTIONS_TITLE_SELECTOR);
    const normalizedTitle = normalizeText(title?.textContent);
    return normalizedTitle === "aplicar efeito" || normalizedTitle === "efeito";
  }) ?? null;
}

function moveEffectActionSectionIntoRollCard(
  rollCard: HTMLElement,
  damageSection: HTMLElement,
  effectActions: HTMLElement
): void {
  if (effectActions.parentElement === rollCard && effectActions.previousElementSibling === damageSection) return;

  const insertionReference = damageSection.nextElementSibling;
  rollCard.insertBefore(effectActions, insertionReference);
}

function ensureEffectActionLabel(actions: HTMLElement, title: HTMLElement | null, label: string): void {
  if (actions.querySelector(`.${PROMPT_CLASS}__effect-resolution-label`)) return;

  const effectLabel = document.createElement("span");
  effectLabel.classList.add(`${PROMPT_CLASS}__effect-resolution-label`);
  effectLabel.textContent = formatEffectActionLabel(label);

  title?.after(effectLabel);
}

function resolveEffectActionOriginalLabel(button: HTMLButtonElement, currentLabel: string): string | null {
  const ariaLabel = button.getAttribute("aria-label")?.replace(/^Aplicar\s+/iu, "").trim();
  if (ariaLabel && normalizeText(ariaLabel) !== "efeito aplicado") return ariaLabel;

  const persistedButtonLabel = readPersistedButtonLabelForButton(button);
  if (persistedButtonLabel) return persistedButtonLabel;

  const normalized = currentLabel
    .replace(/^✓\s*/u, "")
    .replace(/\s+aplicad[oa]$/iu, "")
    .trim();

  return normalized.length > 0 && normalizeText(normalized) !== "aplicado" ? normalized : null;
}

function readPersistedButtonLabelForButton(button: HTMLButtonElement): string | null {
  const promptId = button.getAttribute(PROMPT_ID_ATTRIBUTE);
  if (!promptId) return null;

  const message = resolveChatMessageDocumentFromElement(button);
  const card = readToolkitChatCard(message);
  const prompts = Array.isArray(card?.prompts) ? card.prompts : [];
  const prompt = prompts.find((candidate): candidate is PersistedPromptLike => {
    if (!isRecord(candidate)) return false;
    return candidate.pendingId === promptId;
  });

  const buttonLabel = prompt?.buttonLabel;
  return typeof buttonLabel === "string" && buttonLabel.trim().length > 0 ? buttonLabel.trim() : null;
}

function isResolvedEffectButton(button: HTMLButtonElement, currentLabel: string): boolean {
  return button.classList.contains(PROMPT_EXECUTED_BUTTON_CLASS)
    || normalizeText(currentLabel).includes("aplicado");
}

function isResistanceGatedEffectButton(button: HTMLButtonElement, currentLabel: string): boolean {
  const gate = button.getAttribute(EFFECT_RESISTANCE_GATE_ATTRIBUTE);
  if (gate === "pending" || gate === "resisted") return true;

  const normalizedLabel = normalizeLookupText(currentLabel);
  return normalizedLabel.includes("resistiu") || normalizedLabel.includes("role resistencia");
}

function enhanceEffectActionButton(button: HTMLButtonElement, originalLabel: string): void {
  if (button.getAttribute(EFFECT_ACTION_COMPACTED_ATTRIBUTE) === "true" && button.getAttribute(EFFECT_BUTTON_ICON_ATTRIBUTE) === "true") return;

  const icon = document.createElement("span");
  icon.classList.add(`${PROMPT_CLASS}__button-icon`, `${PROMPT_CLASS}__button-icon--effect`);
  icon.setAttribute("aria-hidden", "true");
  icon.textContent = "✦";

  const label = document.createElement("span");
  label.classList.add(`${PROMPT_CLASS}__button-label`);
  label.textContent = "Aplicar";

  button.classList.add(`${PROMPT_CLASS}__button--effect-resolution-action`);
  button.setAttribute(EFFECT_ACTION_COMPACTED_ATTRIBUTE, "true");
  button.setAttribute(EFFECT_BUTTON_ICON_ATTRIBUTE, "true");
  button.setAttribute(EXECUTED_LABEL_ATTRIBUTE, "✓ Aplicado");
  button.setAttribute("aria-label", `Aplicar ${originalLabel}`);
  button.replaceChildren(icon, label);
}

function compactResolvedEffectActionButton(button: HTMLButtonElement): void {
  if (button.getAttribute(EFFECT_ACTION_COMPACTED_ATTRIBUTE) === "true" && normalizeText(button.textContent) === "✓ aplicado") return;

  const icon = document.createElement("span");
  icon.classList.add(`${PROMPT_CLASS}__button-icon`, `${PROMPT_CLASS}__button-icon--effect-applied`);
  icon.setAttribute("aria-hidden", "true");
  icon.textContent = "✓";

  const label = document.createElement("span");
  label.classList.add(`${PROMPT_CLASS}__button-label`);
  label.textContent = "Aplicado";

  button.classList.add(`${PROMPT_CLASS}__button--effect-resolution-action`, `${PROMPT_CLASS}__button--effect-resolution-applied`);
  button.setAttribute(EFFECT_ACTION_COMPACTED_ATTRIBUTE, "true");
  button.setAttribute(EFFECT_BUTTON_ICON_ATTRIBUTE, "true");
  button.setAttribute("aria-label", "Efeito aplicado");
  button.replaceChildren(icon, label);
}


function updateEffectActionResistanceGate(rollCard: HTMLElement, actions: HTMLElement): void {
  const button = actions.querySelector<HTMLButtonElement>(ACTION_BUTTON_SELECTOR);
  if (!button) return;

  const currentLabel = button.textContent?.trim() ?? "";
  if (isResolvedEffectButton(button, currentLabel)) {
    compactResolvedEffectActionButton(button);
    return;
  }

  const effectLabel = resolveEffectActionDisplayLabel(actions, button, currentLabel);
  if (!shouldGateEffectByResistance(rollCard, effectLabel)) {
    clearEffectResistanceGate(button);
    return;
  }

  const difficulty = readCastingDifficulty(rollCard);
  const resistanceTotal = readResistanceTotal(rollCard);

  if (difficulty === null || resistanceTotal === null) {
    setEffectWaitingForResistance(button);
    return;
  }

  if (resistanceTotal >= difficulty) {
    setEffectResisted(button);
    return;
  }

  setEffectAvailableAfterFailedResistance(button, effectLabel);
}

function resolveEffectActionDisplayLabel(actions: HTMLElement, button: HTMLButtonElement, currentLabel: string): string {
  const explicitLabel = actions.querySelector<HTMLElement>(`.${PROMPT_CLASS}__effect-resolution-label`)?.textContent?.trim();
  if (explicitLabel) return explicitLabel;

  return resolveEffectActionOriginalLabel(button, currentLabel) ?? currentLabel;
}

function shouldGateEffectByResistance(rollCard: HTMLElement, effectLabel: string): boolean {
  if (!rollCard.querySelector(RESISTANCE_SELECTOR)) return false;

  const normalized = normalizeLookupText(effectLabel);
  return normalized.includes("vulneravel") || normalized.includes("vulnerable");
}

function setEffectWaitingForResistance(button: HTMLButtonElement): void {
  button.disabled = true;
  button.removeAttribute(EFFECT_ACTION_COMPACTED_ATTRIBUTE);
  button.removeAttribute(EFFECT_BUTTON_ICON_ATTRIBUTE);
  button.classList.remove(
    `${PROMPT_CLASS}__button--effect-resolution-applied`,
    `${PROMPT_CLASS}__button--effect-resolution-resisted`
  );
  button.classList.add(`${PROMPT_CLASS}__button--effect-resolution-waiting`);
  button.setAttribute(EFFECT_RESISTANCE_GATE_ATTRIBUTE, "pending");
  button.setAttribute("aria-label", "Role a resistência antes de aplicar o efeito");
  button.replaceChildren(createButtonTextLabel("Role resistência"));
}

function setEffectResisted(button: HTMLButtonElement): void {
  button.disabled = true;
  button.removeAttribute(EFFECT_ACTION_COMPACTED_ATTRIBUTE);
  button.removeAttribute(EFFECT_BUTTON_ICON_ATTRIBUTE);
  button.classList.remove(
    `${PROMPT_CLASS}__button--effect-resolution-applied`,
    `${PROMPT_CLASS}__button--effect-resolution-waiting`
  );
  button.classList.add(`${PROMPT_CLASS}__button--effect-resolution-resisted`);
  button.setAttribute(EFFECT_RESISTANCE_GATE_ATTRIBUTE, "resisted");
  button.setAttribute("aria-label", "O alvo resistiu ao efeito");
  button.replaceChildren(
    createEffectButtonIcon("✓", `${PROMPT_CLASS}__button-icon--effect-resisted`),
    createButtonTextLabel("Resistiu")
  );
}

function setEffectAvailableAfterFailedResistance(button: HTMLButtonElement, effectLabel: string): void {
  clearEffectResistanceGate(button);
  button.disabled = false;
  enhanceEffectActionButton(button, effectLabel);
}

function clearEffectResistanceGate(button: HTMLButtonElement): void {
  button.classList.remove(
    `${PROMPT_CLASS}__button--effect-resolution-waiting`,
    `${PROMPT_CLASS}__button--effect-resolution-resisted`
  );
  button.removeAttribute(EFFECT_RESISTANCE_GATE_ATTRIBUTE);
}

function createEffectButtonIcon(text: string, extraClass: string): HTMLElement {
  const icon = document.createElement("span");
  icon.classList.add(`${PROMPT_CLASS}__button-icon`, extraClass);
  icon.setAttribute("aria-hidden", "true");
  icon.textContent = text;
  return icon;
}

function createButtonTextLabel(text: string): HTMLElement {
  const label = document.createElement("span");
  label.classList.add(`${PROMPT_CLASS}__button-label`);
  label.textContent = text;
  return label;
}

function formatEffectActionLabel(label: string): string {
  return label.replace(/\s*:\s*/u, " · ");
}

function findDamageWorkflowSection(rollCard: HTMLElement): HTMLElement | null {
  return Array.from(rollCard.querySelectorAll<HTMLElement>(DAMAGE_WORKFLOW_SECTION_SELECTOR)).find((section) => {
    const title = section.querySelector<HTMLElement>(`.${PROMPT_CLASS}__workflow-section-header strong`)?.textContent?.trim();
    return normalizeText(title) === "dano";
  }) ?? null;
}

function findDamageActionSection(rollCard: HTMLElement): HTMLElement | null {
  const sections = Array.from(rollCard.parentElement?.querySelectorAll<HTMLElement>(ACTIONS_SELECTOR) ?? []);

  return sections.find((section) => section.getAttribute(DAMAGE_ACTION_SECTION_ATTRIBUTE) === "apply-damage")
    ?? sections.find((section) => normalizeText(section.querySelector<HTMLElement>(ACTIONS_TITLE_SELECTOR)?.textContent) === "aplicar danos")
    ?? null;
}

function updateDamageActionButtons(rollCard: HTMLElement, actions: HTMLElement): void {
  const buttons = Array.from(actions.querySelectorAll<HTMLButtonElement>(ACTION_BUTTON_SELECTOR));
  const normalButton = findDamageButton(buttons, "normal");
  const halfButton = findDamageButton(buttons, "half");

  if (!normalButton || !halfButton) {
    actions.classList.add(`${PROMPT_CLASS}__actions--compact`);
    return;
  }

  enhanceDamageButtonIcon(normalButton, "normal");
  enhanceDamageButtonIcon(halfButton, "half");

  const mode = getDamageResolutionModeSafe();
  actions.classList.toggle(`${PROMPT_CLASS}__actions--assisted`, mode === "assisted");
  actions.classList.toggle(`${PROMPT_CLASS}__actions--manual`, mode !== "assisted");

  if (mode !== "assisted") {
    setDamageButtonVisibility(normalButton, true);
    setDamageButtonVisibility(halfButton, true);
    updateDamageResolutionSummary(actions, "manual", null);
    return;
  }

  const resistanceTotal = readResistanceTotal(rollCard);
  const difficulty = readCastingDifficulty(rollCard);

  if (difficulty === null) {
    setDamageButtonVisibility(normalButton, true);
    setDamageButtonVisibility(halfButton, true);
    updateDamageResolutionSummary(actions, "manual", "Sem DT confiável: escolha manualmente.");
    return;
  }

  if (resistanceTotal === null) {
    setDamageButtonVisibility(normalButton, true);
    setDamageButtonVisibility(halfButton, false);
    updateDamageResolutionSummary(actions, "pending", null);
    return;
  }

  const resisted = resistanceTotal >= difficulty;
  setDamageButtonVisibility(normalButton, !resisted);
  setDamageButtonVisibility(halfButton, resisted);
  updateDamageResolutionSummary(
    actions,
    resisted ? "resisted" : "failed",
    resisted
      ? `Resistiu: ${resistanceTotal} vs DT ${difficulty}.`
      : `Falhou: ${resistanceTotal} vs DT ${difficulty}.`
  );
}

function findDamageButton(buttons: HTMLButtonElement[], kind: "normal" | "half"): HTMLButtonElement | null {
  const matcher = DAMAGE_BUTTON_LABELS[kind];
  return buttons.find((button) => matcher.test(button.textContent ?? "")) ?? null;
}

function enhanceDamageButtonIcon(button: HTMLButtonElement, kind: "normal" | "half"): void {
  if (button.getAttribute(DAMAGE_BUTTON_ICON_ATTRIBUTE) === "true") return;

  const labelText = button.textContent?.trim() ?? "";
  if (!labelText || labelText.startsWith("✓")) return;

  const icon = document.createElement("i");
  icon.classList.add(
    "fa-solid",
    kind === "normal" ? "fa-bolt" : "fa-shield-halved",
    `${PROMPT_CLASS}__button-icon`
  );
  icon.setAttribute("aria-hidden", "true");

  const label = document.createElement("span");
  label.classList.add(`${PROMPT_CLASS}__button-label`);
  label.textContent = labelText;

  button.classList.add(
    `${PROMPT_CLASS}__button--damage-resolution-action`,
    `${PROMPT_CLASS}__button--damage-resolution-${kind}`
  );
  button.setAttribute(DAMAGE_BUTTON_ICON_ATTRIBUTE, "true");
  button.setAttribute("aria-label", labelText);
  button.replaceChildren(icon, label);
}

function setDamageButtonVisibility(button: HTMLButtonElement, visible: boolean): void {
  button.hidden = !visible;
  button.classList.toggle(`${PROMPT_CLASS}__button--damage-resolution-selected`, visible);
}

function updateDamageResolutionSummary(actions: HTMLElement, state: DamageResolutionState, message: string | null): void {
  actions.setAttribute(DAMAGE_RESOLUTION_STATE_ATTRIBUTE, state);

  const existing = actions.querySelector<HTMLElement>(`.${PROMPT_CLASS}__damage-resolution-summary`);

  if (!message) {
    existing?.remove();
    return;
  }

  const summary = existing ?? document.createElement("span");
  summary.classList.add(`${PROMPT_CLASS}__damage-resolution-summary`);
  summary.textContent = message;

  if (!existing) {
    const title = actions.querySelector<HTMLElement>(ACTIONS_TITLE_SELECTOR);
    title?.after(summary);
  }
}

function bindDamageResolutionRefresh(rollCard: HTMLElement): void {
  const resistanceButton = rollCard.querySelector<HTMLButtonElement>(RESISTANCE_ROLL_BUTTON_SELECTOR);
  if (!resistanceButton) return;
  if (resistanceButton.getAttribute(RESISTANCE_BUTTON_BOUND_ATTRIBUTE) === "true") return;

  resistanceButton.setAttribute(RESISTANCE_BUTTON_BOUND_ATTRIBUTE, "true");
  resistanceButton.addEventListener("click", () => {
    for (const delayMs of DAMAGE_RESOLUTION_REFRESH_DELAYS_MS) {
      globalThis.setTimeout(() => {
        enhanceRollCardDamageResolution(rollCard);
      }, delayMs);
    }
  });
}

function readResistanceTotal(rollCard: HTMLElement): number | null {
  const buttonTotal = rollCard.querySelector<HTMLElement>(RESISTANCE_ROLL_BUTTON_SELECTOR)?.getAttribute("data-paranormal-toolkit-resistance-roll-result");
  const parsedButtonTotal = parseInteger(buttonTotal);
  if (parsedButtonTotal !== null) return parsedButtonTotal;

  const resultText = rollCard.querySelector<HTMLElement>(RESISTANCE_ROLL_RESULT_SELECTOR)?.textContent ?? null;
  const match = resultText ? /=\s*(-?\d+)\s*$/u.exec(resultText) : null;
  return parseInteger(match?.[1] ?? null);
}

function readCastingDifficulty(rollCard: HTMLElement): number | null {
  const prompt = readPersistedPromptForRollCard(rollCard);
  const persistedDifficulty = readDifficultyFromPersistedPrompt(prompt);
  if (persistedDifficulty !== null) return persistedDifficulty;

  const actorDifficulty = readDifficultyFromPromptActor(prompt);
  if (actorDifficulty !== null) return actorDifficulty;

  return readLegacyDifficultyFromRenderedCard(rollCard);
}

function readDifficultyFromPersistedPrompt(prompt: PersistedPromptLike | null): number | null {
  const summaryLines = getPromptSummaryLines(prompt);
  if (summaryLines.length === 0) return null;

  return parseInteger(findSummaryValue(summaryLines, SUMMARY_KEY_CASTING_DIFFICULTY));
}

function readDifficultyFromPromptActor(prompt: PersistedPromptLike | null): number | null {
  const actorId = typeof prompt?.actorId === "string" ? prompt.actorId : null;
  if (!actorId) return null;

  const actors = game.actors as { get?: (id: string) => unknown } | undefined;
  const actor = actors?.get?.(actorId);
  if (!actor || typeof actor !== "object") return null;

  return readNestedInteger(actor, ["system", "ritual", "DT"])
    ?? readNestedInteger(actor, ["system", "ritual", "dt"]);
}

function readLegacyDifficultyFromRenderedCard(rollCard: HTMLElement): number | null {
  const castingDescription = Array.from(rollCard.querySelectorAll<HTMLElement>(`.${PROMPT_CLASS}__workflow-section--casting .${PROMPT_CLASS}__workflow-section-description`))
    .map((element) => element.textContent)
    .find((text) => typeof text === "string" && text.includes("DT"));

  if (!castingDescription) return null;

  const match = /\bDT\s*(-?\d+)\b/iu.exec(castingDescription);
  return parseInteger(match?.[1] ?? null);
}

function readPersistedPromptForRollCard(rollCard: HTMLElement): PersistedPromptLike | null {
  const promptId = findPromptId(rollCard);
  if (!promptId) return null;

  const message = resolveChatMessageDocumentFromElement(rollCard);
  const card = readToolkitChatCard(message);
  const prompts = Array.isArray(card?.prompts) ? card.prompts : [];

  return prompts.find((prompt): prompt is PersistedPromptLike => {
    if (!isRecord(prompt)) return false;
    return prompt.pendingId === promptId;
  }) ?? null;
}

function findPromptId(rollCard: HTMLElement): string | null {
  const promptElement = rollCard.closest<HTMLElement>(`[${PROMPT_ID_ATTRIBUTE}]`)
    ?? rollCard.querySelector<HTMLElement>(`[${PROMPT_ID_ATTRIBUTE}]`)
    ?? rollCard.parentElement?.querySelector<HTMLElement>(`[${PROMPT_ID_ATTRIBUTE}]`)
    ?? null;

  return promptElement?.getAttribute(PROMPT_ID_ATTRIBUTE) ?? null;
}

function resolveChatMessageDocumentFromElement(element: HTMLElement): ChatMessageFlagDocument | null {
  const messageElement = element.closest<HTMLElement>("[data-message-id]");
  const messageId = messageElement?.dataset.messageId ?? null;
  if (!messageId) return null;

  const messages = game.messages as { get?: (messageId: string) => unknown } | undefined;
  const message = messages?.get?.(messageId);
  return isChatMessageFlagDocument(message) ? message : null;
}

function readToolkitChatCard(message: ChatMessageFlagDocument | null): PersistedToolkitChatCard | null {
  const value = message?.getFlag?.(MODULE_ID, CHAT_CARD_FLAG_KEY);
  return isRecord(value) ? (value as PersistedToolkitChatCard) : null;
}

function getPromptSummaryLines(prompt: PersistedPromptLike | null): string[] {
  if (!Array.isArray(prompt?.summaryLines)) return [];

  return prompt.summaryLines.filter((line): line is string => typeof line === "string");
}

function findSummaryValue(summaryLines: string[], key: string): string | null {
  const prefix = `${key}:`;

  for (const line of summaryLines) {
    if (!line.startsWith(prefix)) continue;

    const value = line.slice(prefix.length).trim();
    if (value.length > 0) return value;
  }

  return null;
}

function readNestedInteger(source: unknown, path: string[]): number | null {
  let current = source;

  for (const segment of path) {
    if (!isRecord(current)) return null;
    current = current[segment];
  }

  return typeof current === "number" ? Math.trunc(current) : parseInteger(typeof current === "string" ? current : null);
}

function parseInteger(value: string | null | undefined): number | null {
  if (!value) return null;
  const parsed = Number(value);
  return Number.isFinite(parsed) ? Math.trunc(parsed) : null;
}

function getDamageResolutionModeSafe(): "manual" | "assisted" {
  try {
    return getItemUseDamageResolutionMode();
  } catch {
    return "assisted";
  }
}

function normalizeText(value: string | null | undefined): string {
  return value?.trim().toLocaleLowerCase() ?? "";
}

function normalizeLookupText(value: string | null | undefined): string {
  return normalizeText(value)
    .normalize("NFD")
    .replace(/\p{Diacritic}/gu, "");
}

function isChatMessageFlagDocument(value: unknown): value is ChatMessageFlagDocument {
  return Boolean(value && typeof value === "object" && typeof (value as ChatMessageFlagDocument).getFlag === "function");
}

function isRecord(value: unknown): value is Record<string, unknown> {
  return Boolean(value && typeof value === "object");
}
