import { PROMPT_CLASS } from "./item-use-chat-card-constants";
import {
  normalizeLookupText,
  normalizeText,
  readPersistedButtonLabelForButton
} from "./item-use-card-roll-context";
import {
  ACTION_BUTTON_SELECTOR,
  createButtonIcon,
  createButtonLabel,
  EXECUTED_LABEL_ATTRIBUTE,
  PROMPT_EXECUTED_BUTTON_CLASS
} from "./item-use-card-dom";
import { createSingleTargetEffectViewModel } from "./single-target/single-target-card-view-model";

const EFFECT_BUTTON_ICON_ATTRIBUTE = "data-paranormal-toolkit-effect-icon-enhanced";
const EFFECT_ACTION_COMPACTED_ATTRIBUTE = "data-paranormal-toolkit-effect-action-compacted";
const EFFECT_RESISTANCE_GATE_ATTRIBUTE = "data-paranormal-toolkit-effect-resistance-gate";
const EFFECT_SECTION_ATTRIBUTE = "data-paranormal-toolkit-effect-section";
const EFFECT_LABEL_ATTRIBUTE = "data-paranormal-toolkit-effect-label";

type EffectActionSectionInput = {
  rollCard: HTMLElement;
  existingSection: HTMLElement | null;
  sourceActions: HTMLElement | null;
  after: HTMLElement | null;
  fallbackAfter: HTMLElement | null;
};

export function findEffectActionSection(rollCard: HTMLElement): HTMLElement | null {
  return rollCard.querySelector<HTMLElement>(`[${EFFECT_SECTION_ATTRIBUTE}="true"]`);
}

export function mountEffectActionSection(input: EffectActionSectionInput): HTMLElement | null {
  const button = resolveEffectButton(input);
  if (!button) return input.existingSection;

  const section = input.existingSection ?? createEffectSection();
  const effectLabel = resolveEffectLabel(section, input.sourceActions, button);
  if (effectLabel) section.setAttribute(EFFECT_LABEL_ATTRIBUTE, effectLabel);

  ensureEffectSectionStructure(section, button, effectLabel);
  placeEffectSection(input.rollCard, section, input.after ?? input.fallbackAfter);
  removeConsumedLegacyActionSource(input.sourceActions, section);

  return section;
}

export function updateEffectActionResistanceGate(rollCard: HTMLElement, section: HTMLElement): void {
  const button = section.querySelector<HTMLButtonElement>(ACTION_BUTTON_SELECTOR);
  if (!button) return;

  const currentLabel = button.textContent?.trim() ?? "";
  const effectLabel = resolveEffectActionDisplayLabel(section, button, currentLabel);
  const viewModel = createSingleTargetEffectViewModel({
    rollCard,
    effectLabel,
    applied: isResolvedEffectButton(button, currentLabel),
  });

  if (viewModel.applied) {
    compactResolvedEffectActionButton(button);
    return;
  }

  if (!viewModel.visible) {
    hideUnresolvedEffectButton(button);
    return;
  }

  if (viewModel.waitingForResistance) {
    setEffectWaitingForResistance(button, viewModel.actionLabel);
    return;
  }

  if (viewModel.resisted) {
    setEffectResisted(button, viewModel.compactLabel);
    return;
  }

  clearEffectResistanceGate(button);
  enhanceEffectActionButton(button, viewModel.displayLabel);
}

function resolveEffectButton(input: EffectActionSectionInput): HTMLButtonElement | null {
  return input.sourceActions?.querySelector<HTMLButtonElement>(ACTION_BUTTON_SELECTOR)
    ?? input.existingSection?.querySelector<HTMLButtonElement>(ACTION_BUTTON_SELECTOR)
    ?? null;
}

function createEffectSection(): HTMLElement {
  const section = document.createElement("section");
  section.classList.add(
    `${PROMPT_CLASS}__workflow-section`,
    `${PROMPT_CLASS}__workflow-section--effect-action`
  );
  section.setAttribute(EFFECT_SECTION_ATTRIBUTE, "true");
  return section;
}

function ensureEffectSectionStructure(section: HTMLElement, button: HTMLButtonElement, effectLabel: string | null): void {
  section.setAttribute(EFFECT_SECTION_ATTRIBUTE, "true");
  section.classList.add(
    `${PROMPT_CLASS}__workflow-section`,
    `${PROMPT_CLASS}__workflow-section--effect-action`
  );
  section.classList.remove(`${PROMPT_CLASS}__actions`, `${PROMPT_CLASS}__actions--effect-resolution`);

  const header = getOrCreateEffectHeader(section);
  const title = getOrCreateEffectTitle(header);
  title.textContent = "Efeito";

  const body = getOrCreateEffectBody(section, header);
  const label = getOrCreateEffectLabel(body);
  label.textContent = formatEffectActionLabel(effectLabel ?? resolveEffectActionDisplayLabel(section, button, button.textContent?.trim() ?? ""));

  const action = getOrCreateEffectActionContainer(body);
  if (button.parentElement !== action) {
    action.append(button);
  }

  const currentLabel = button.textContent?.trim() ?? "";
  if (!isResolvedEffectButton(button, currentLabel) && !isResistanceGatedEffectButton(button, currentLabel)) {
    enhanceEffectActionButton(button, effectLabel ?? currentLabel);
  }
}

function getOrCreateEffectHeader(section: HTMLElement): HTMLElement {
  const existing = section.querySelector<HTMLElement>(`:scope > .${PROMPT_CLASS}__workflow-section-header`);
  if (existing) return existing;

  const header = document.createElement("div");
  header.classList.add(`${PROMPT_CLASS}__workflow-section-header`);
  section.prepend(header);
  return header;
}

function getOrCreateEffectTitle(header: HTMLElement): HTMLElement {
  const existing = header.querySelector<HTMLElement>("strong");
  if (existing) return existing;

  const title = document.createElement("strong");
  header.append(title);
  return title;
}

function getOrCreateEffectBody(section: HTMLElement, header: HTMLElement): HTMLElement {
  const existing = section.querySelector<HTMLElement>(`:scope > .${PROMPT_CLASS}__effect-section-body`);
  if (existing) return existing;

  const body = document.createElement("div");
  body.classList.add(`${PROMPT_CLASS}__effect-section-body`);
  header.after(body);
  return body;
}

function getOrCreateEffectLabel(body: HTMLElement): HTMLElement {
  const existing = body.querySelector<HTMLElement>(`:scope > .${PROMPT_CLASS}__effect-section-label`);
  if (existing) return existing;

  const label = document.createElement("span");
  label.classList.add(`${PROMPT_CLASS}__effect-section-label`);
  body.prepend(label);
  return label;
}

function getOrCreateEffectActionContainer(body: HTMLElement): HTMLElement {
  const existing = body.querySelector<HTMLElement>(`:scope > .${PROMPT_CLASS}__effect-section-action`);
  if (existing) return existing;

  const action = document.createElement("div");
  action.classList.add(`${PROMPT_CLASS}__effect-section-action`);
  body.append(action);
  return action;
}

function placeEffectSection(rollCard: HTMLElement, section: HTMLElement, after: HTMLElement | null): void {
  if (!after) {
    if (section.parentElement === rollCard && section.nextElementSibling === null) return;
    rollCard.append(section);
    return;
  }

  if (section.parentElement === rollCard && section.previousElementSibling === after) return;

  rollCard.insertBefore(section, after.nextElementSibling);
}

function removeConsumedLegacyActionSource(sourceActions: HTMLElement | null, section: HTMLElement): void {
  if (!sourceActions || sourceActions === section) return;
  sourceActions.remove();
}

function resolveEffectLabel(section: HTMLElement, sourceActions: HTMLElement | null, button: HTMLButtonElement): string | null {
  const existingLabel = section.getAttribute(EFFECT_LABEL_ATTRIBUTE);
  if (existingLabel && existingLabel.trim().length > 0) return existingLabel.trim();

  const sourceLabel = sourceActions?.querySelector<HTMLElement>(`.${PROMPT_CLASS}__effect-resolution-label`)?.textContent?.trim();
  if (sourceLabel) return sourceLabel;

  return resolveEffectActionOriginalLabel(button, button.textContent?.trim() ?? "");
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

  button.disabled = false;
  button.classList.add(`${PROMPT_CLASS}__button--effect-resolution-action`);
  button.classList.remove(
    `${PROMPT_CLASS}__button--effect-resolution-applied`,
    `${PROMPT_CLASS}__button--effect-resolution-waiting`,
    `${PROMPT_CLASS}__button--effect-resolution-resisted`
  );
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
  button.classList.remove(
    `${PROMPT_CLASS}__button--effect-resolution-waiting`,
    `${PROMPT_CLASS}__button--effect-resolution-resisted`
  );
  button.setAttribute(EFFECT_ACTION_COMPACTED_ATTRIBUTE, "true");
  button.setAttribute(EFFECT_BUTTON_ICON_ATTRIBUTE, "true");
  button.setAttribute("aria-label", "Efeito aplicado");
  button.replaceChildren(
    createButtonIcon("✓", `${PROMPT_CLASS}__button-icon--effect-applied`),
    createButtonLabel("Aplicado")
  );
}

function resolveEffectActionDisplayLabel(section: HTMLElement, button: HTMLButtonElement, currentLabel: string): string {
  const explicitLabel = section.getAttribute(EFFECT_LABEL_ATTRIBUTE)
    ?? section.querySelector<HTMLElement>(`.${PROMPT_CLASS}__effect-section-label`)?.textContent?.trim();

  if (explicitLabel && explicitLabel.trim().length > 0) return explicitLabel.trim();

  return resolveEffectActionOriginalLabel(button, currentLabel) ?? currentLabel;
}

function hideUnresolvedEffectButton(button: HTMLButtonElement): void {
  if (isResolvedEffectButton(button, button.textContent?.trim() ?? "")) return;
  button.remove();
}

function setEffectWaitingForResistance(button: HTMLButtonElement, label = "Role resistência"): void {
  button.disabled = true;
  button.setAttribute("aria-disabled", "true");
  button.removeAttribute(EFFECT_ACTION_COMPACTED_ATTRIBUTE);
  button.removeAttribute(EFFECT_BUTTON_ICON_ATTRIBUTE);
  button.classList.remove(
    `${PROMPT_CLASS}__button--effect-resolution-applied`,
    `${PROMPT_CLASS}__button--effect-resolution-resisted`
  );
  button.classList.add(`${PROMPT_CLASS}__button--effect-resolution-action`, `${PROMPT_CLASS}__button--effect-resolution-waiting`);
  button.setAttribute(EFFECT_RESISTANCE_GATE_ATTRIBUTE, "pending");
  button.setAttribute("aria-label", "Role a resistência antes de aplicar o efeito");
  button.replaceChildren(createButtonLabel(label));
}

function setEffectResisted(button: HTMLButtonElement, label = "Resistiu"): void {
  button.disabled = true;
  button.removeAttribute(EFFECT_ACTION_COMPACTED_ATTRIBUTE);
  button.removeAttribute(EFFECT_BUTTON_ICON_ATTRIBUTE);
  button.classList.remove(
    `${PROMPT_CLASS}__button--effect-resolution-applied`,
    `${PROMPT_CLASS}__button--effect-resolution-waiting`
  );
  button.classList.add(`${PROMPT_CLASS}__button--effect-resolution-action`, `${PROMPT_CLASS}__button--effect-resolution-resisted`);
  button.setAttribute(EFFECT_RESISTANCE_GATE_ATTRIBUTE, "resisted");
  button.setAttribute("aria-label", "O alvo resistiu ao efeito");
  button.replaceChildren(
    createButtonIcon("✓", `${PROMPT_CLASS}__button-icon--effect-resisted`),
    createButtonLabel(label)
  );
}

function clearEffectResistanceGate(button: HTMLButtonElement): void {
  button.classList.remove(
    `${PROMPT_CLASS}__button--effect-resolution-waiting`,
    `${PROMPT_CLASS}__button--effect-resolution-resisted`
  );
  button.removeAttribute(EFFECT_RESISTANCE_GATE_ATTRIBUTE);
  button.removeAttribute("aria-disabled");
}

function formatEffectActionLabel(label: string): string {
  return label.replace(/\s*:\s*/u, " · ");
}
