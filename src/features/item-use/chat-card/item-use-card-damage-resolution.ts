import { PROMPT_CLASS } from "./item-use-chat-card-constants";
import { getItemUseDamageResolutionMode } from "../item-use-settings";
import { readCastingDifficulty, readResistanceTotal } from "./item-use-card-roll-context";
import {
  ACTION_BUTTON_SELECTOR,
  ACTIONS_TITLE_SELECTOR,
  createButtonLabel,
  setActionTitle
} from "./item-use-card-dom";

const DAMAGE_RESOLUTION_STATE_ATTRIBUTE = "data-paranormal-toolkit-damage-resolution-state";
const DAMAGE_BUTTON_ICON_ATTRIBUTE = "data-paranormal-toolkit-damage-icon-enhanced";

const DAMAGE_BUTTON_LABELS = {
  normal: /\bnormal\b|\bcheio\b/iu,
  half: /\bmetade\b|\bmeio\b|1\/2/iu
} as const;

type DamageResolutionState = "manual" | "pending" | "resisted" | "failed";

export function enhanceDamageResolutionSection(rollCard: HTMLElement, actions: HTMLElement): void {
  actions.classList.add(`${PROMPT_CLASS}__actions--embedded`, `${PROMPT_CLASS}__actions--damage-resolution`);
  setActionTitle(actions, "Aplicar dano");
  updateDamageActionButtons(rollCard, actions);
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

  button.classList.add(
    `${PROMPT_CLASS}__button--damage-resolution-action`,
    `${PROMPT_CLASS}__button--damage-resolution-${kind}`
  );
  button.setAttribute(DAMAGE_BUTTON_ICON_ATTRIBUTE, "true");
  button.setAttribute("aria-label", labelText);
  button.replaceChildren(icon, createButtonLabel(labelText));
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

function getDamageResolutionModeSafe(): "manual" | "assisted" {
  try {
    return getItemUseDamageResolutionMode();
  } catch {
    return "assisted";
  }
}
