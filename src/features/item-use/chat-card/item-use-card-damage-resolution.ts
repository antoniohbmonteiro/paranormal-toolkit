import { PROMPT_CLASS } from "./item-use-chat-card-constants";
import {
  ACTION_BUTTON_SELECTOR,
  ACTIONS_TITLE_SELECTOR,
  createButtonLabel,
  setActionTitle
} from "./item-use-card-dom";
import type {
  SingleTargetDamageButtonViewModel,
  SingleTargetDamageResolutionState,
} from "./single-target/single-target-card-view-model";
import { createSingleTargetDamageViewModel } from "./single-target/single-target-card-view-model";

const DAMAGE_RESOLUTION_STATE_ATTRIBUTE = "data-paranormal-toolkit-damage-resolution-state";
const DAMAGE_BUTTON_ICON_ATTRIBUTE = "data-paranormal-toolkit-damage-icon-enhanced";
const DAMAGE_BUTTON_ORIGINAL_LABEL_ATTRIBUTE = "data-paranormal-toolkit-damage-original-label";

const DAMAGE_BUTTON_LABELS = {
  normal: /\bnormal\b|\bcheio\b/iu,
  half: /\bmetade\b|\bmeio\b|1\/2/iu
} as const;

const SKIPPED_DAMAGE_BUTTON_LABEL = "Outra opção escolhida";

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
    removeSkippedDamageButtons(buttons);
    actions.classList.add(`${PROMPT_CLASS}__actions--compact`);
    return;
  }

  enhanceDamageButtonIcon(normalButton, "normal");
  enhanceDamageButtonIcon(halfButton, "half");

  const viewModel = createSingleTargetDamageViewModel({
    rollCard,
    normalButtonApplied: isAppliedDamageButton(normalButton),
    halfButtonApplied: isAppliedDamageButton(halfButton),
    normalButtonSkipped: isSkippedDamageButton(normalButton),
    halfButtonSkipped: isSkippedDamageButton(halfButton),
  });

  if (!viewModel.canShowApplyDamage) {
    hideUnresolvedDamageButton(normalButton);
    hideUnresolvedDamageButton(halfButton);
    updateDamageResolutionSummary(actions, viewModel.summary.state, viewModel.summary.message);
    return;
  }

  actions.classList.toggle(`${PROMPT_CLASS}__actions--assisted`, viewModel.mode === "assisted");
  actions.classList.toggle(`${PROMPT_CLASS}__actions--manual`, viewModel.mode !== "assisted");

  applyDamageButtonViewModel(normalButton, viewModel.normalButton);
  applyDamageButtonViewModel(halfButton, viewModel.halfButton);
  updateDamageResolutionSummary(actions, viewModel.summary.state, viewModel.summary.message);
}

function applyDamageButtonViewModel(button: HTMLButtonElement, viewModel: SingleTargetDamageButtonViewModel): void {
  if (viewModel.applied) return;

  if (!viewModel.visible && viewModel.skipped) {
    button.remove();
    return;
  }

  setDamageButtonVisibility(button, viewModel.visible);
  setDamageButtonEnabled(button, viewModel.enabled, viewModel.kind, viewModel.waitingLabel);
}

function removeSkippedDamageButtons(buttons: HTMLButtonElement[]): void {
  for (const button of buttons) {
    if (isSkippedDamageButton(button)) button.remove();
  }
}

function isAppliedDamageButton(button: HTMLButtonElement): boolean {
  const label = button.textContent?.trim() ?? "";
  return label.startsWith("✓") && !label.includes(SKIPPED_DAMAGE_BUTTON_LABEL);
}

function isSkippedDamageButton(button: HTMLButtonElement): boolean {
  return button.textContent?.includes(SKIPPED_DAMAGE_BUTTON_LABEL) ?? false;
}

function findDamageButton(buttons: HTMLButtonElement[], kind: "normal" | "half"): HTMLButtonElement | null {
  const matcher = DAMAGE_BUTTON_LABELS[kind];
  return buttons.find((button) => matcher.test(getDamageButtonLookupLabel(button))) ?? null;
}

function getDamageButtonLookupLabel(button: HTMLButtonElement): string {
  return [
    button.getAttribute(DAMAGE_BUTTON_ORIGINAL_LABEL_ATTRIBUTE),
    button.getAttribute("aria-label"),
    button.textContent,
  ].filter((label): label is string => Boolean(label)).join(" ");
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
  button.setAttribute(DAMAGE_BUTTON_ORIGINAL_LABEL_ATTRIBUTE, labelText);
  button.setAttribute("aria-label", labelText);
  button.replaceChildren(icon, createButtonLabel(labelText));
}

function hideUnresolvedDamageButton(button: HTMLButtonElement): void {
  if (isAppliedDamageButton(button)) return;
  button.remove();
}

function setDamageButtonVisibility(button: HTMLButtonElement, visible: boolean): void {
  button.hidden = !visible;
  button.classList.toggle(`${PROMPT_CLASS}__button--damage-resolution-selected`, visible);
}

function setDamageButtonEnabled(
  button: HTMLButtonElement,
  enabled: boolean,
  kind: "normal" | "half",
  waitingLabel = "Role resistência"
): void {
  if (isAppliedDamageButton(button)) return;

  button.disabled = !enabled;
  button.classList.toggle(`${PROMPT_CLASS}__button--damage-resolution-waiting`, !enabled);

  if (!enabled) {
    button.setAttribute("aria-disabled", "true");
    button.setAttribute("aria-label", waitingLabel);
    button.replaceChildren(createButtonLabel(waitingLabel));
    return;
  }

  button.removeAttribute("aria-disabled");
  restoreDamageButtonLabel(button, kind);
}

function restoreDamageButtonLabel(button: HTMLButtonElement, kind: "normal" | "half"): void {
  const labelText = button.getAttribute(DAMAGE_BUTTON_ORIGINAL_LABEL_ATTRIBUTE)
    ?? button.getAttribute("aria-label")
    ?? button.textContent?.trim()
    ?? "";

  if (!labelText || labelText === "Role resistência") return;

  button.setAttribute("aria-label", labelText);
  button.replaceChildren(createDamageButtonIcon(kind), createButtonLabel(labelText));
}

function createDamageButtonIcon(kind: "normal" | "half"): HTMLElement {
  const icon = document.createElement("i");
  icon.classList.add(
    "fa-solid",
    kind === "normal" ? "fa-bolt" : "fa-shield-halved",
    `${PROMPT_CLASS}__button-icon`
  );
  icon.setAttribute("aria-hidden", "true");
  return icon;
}

function updateDamageResolutionSummary(actions: HTMLElement, state: SingleTargetDamageResolutionState, message: string | null): void {
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
