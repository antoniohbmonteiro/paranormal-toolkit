import { PROMPT_CLASS, RESISTANCE_SELECTOR } from "./item-use-chat-card-constants";
import {
  normalizeLookupText,
  normalizeText,
  readCastingDifficulty,
  readPersistedButtonLabelForButton,
  readResistanceTotal
} from "./item-use-card-roll-context";
import {
  ACTION_BUTTON_SELECTOR,
  ACTIONS_TITLE_SELECTOR,
  createButtonIcon,
  createButtonLabel,
  EXECUTED_LABEL_ATTRIBUTE,
  PROMPT_EXECUTED_BUTTON_CLASS,
  setActionTitle
} from "./item-use-card-dom";

const EFFECT_BUTTON_ICON_ATTRIBUTE = "data-paranormal-toolkit-effect-icon-enhanced";
const EFFECT_ACTION_COMPACTED_ATTRIBUTE = "data-paranormal-toolkit-effect-action-compacted";
const EFFECT_RESISTANCE_GATE_ATTRIBUTE = "data-paranormal-toolkit-effect-resistance-gate";
const EFFECT_ACTION_WORKFLOW_CLASS = `${PROMPT_CLASS}__workflow-section--effect-action`;

export function enhanceEffectActionSection(actions: HTMLElement): boolean {
  const title = actions.querySelector<HTMLElement>(ACTIONS_TITLE_SELECTOR);
  const normalizedTitle = normalizeText(title?.textContent);
  if (normalizedTitle !== "aplicar efeito" && normalizedTitle !== "efeito") return false;

  actions.classList.add(
    `${PROMPT_CLASS}__actions--effect-resolution`,
    `${PROMPT_CLASS}__workflow-section`,
    EFFECT_ACTION_WORKFLOW_CLASS
  );
  setActionTitle(actions, "Efeito");

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

export function updateEffectActionResistanceGate(rollCard: HTMLElement, actions: HTMLElement): void {
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

  button.classList.add(`${PROMPT_CLASS}__button--effect-resolution-action`);
  button.setAttribute(EFFECT_ACTION_COMPACTED_ATTRIBUTE, "true");
  button.setAttribute(EFFECT_BUTTON_ICON_ATTRIBUTE, "true");
  button.setAttribute(EXECUTED_LABEL_ATTRIBUTE, "✓ Aplicado");
  button.setAttribute("aria-label", `Aplicar ${originalLabel}`);
  button.replaceChildren(
    createButtonIcon("✦", `${PROMPT_CLASS}__button-icon--effect`),
    createButtonLabel("Aplicar")
  );
}

function compactResolvedEffectActionButton(button: HTMLButtonElement): void {
  if (button.getAttribute(EFFECT_ACTION_COMPACTED_ATTRIBUTE) === "true" && normalizeText(button.textContent) === "✓ aplicado") return;

  button.classList.add(`${PROMPT_CLASS}__button--effect-resolution-action`, `${PROMPT_CLASS}__button--effect-resolution-applied`);
  button.setAttribute(EFFECT_ACTION_COMPACTED_ATTRIBUTE, "true");
  button.setAttribute(EFFECT_BUTTON_ICON_ATTRIBUTE, "true");
  button.setAttribute("aria-label", "Efeito aplicado");
  button.replaceChildren(
    createButtonIcon("✓", `${PROMPT_CLASS}__button-icon--effect-applied`),
    createButtonLabel("Aplicado")
  );
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
  button.replaceChildren(createButtonLabel("Role resistência"));
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
    createButtonIcon("✓", `${PROMPT_CLASS}__button-icon--effect-resisted`),
    createButtonLabel("Resistiu")
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

function formatEffectActionLabel(label: string): string {
  return label.replace(/\s*:\s*/u, " · ");
}
