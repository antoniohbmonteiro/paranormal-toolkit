import {
  PROMPT_CLASS,
  RESISTANCE_ROLL_BUTTON_SELECTOR,
  RESISTANCE_SELECTOR
} from "../item-use-chat-card-constants";
import { findWorkflowSectionByTitle } from "../item-use-card-dom";
import { enhanceDamageResolutionSection } from "../item-use-card-damage-resolution";
import {
  findEffectActionSection,
  mountEffectActionSection,
  updateEffectActionResistanceGate
} from "../item-use-card-effect-section";
import {
  findDamageActionSection,
  findDamageWorkflowSection,
  findEffectActionSource
} from "./single-target-card-dom";

const LAYOUT_NORMALIZED_ATTRIBUTE = "data-paranormal-toolkit-card-layout-normalized";
const REFRESH_BOUND_ATTRIBUTE = "data-paranormal-toolkit-card-layout-refresh-bound";

type EnhanceSingleTargetCardLayoutInput = {
  rollCard: HTMLElement;
  refreshDelaysMs: readonly number[];
  onRefresh: () => void;
};

export type EnhancedSingleTargetCardLayout = {
  damageSection: HTMLElement | null;
  effectSection: HTMLElement | null;
};

type SingleTargetCardLayout = {
  rollCard: HTMLElement;
  damageSection: HTMLElement | null;
  resistance: HTMLElement | null;
  damageActions: HTMLElement | null;
  effectActionSource: HTMLElement | null;
  effectSection: HTMLElement | null;
};

export function enhanceSingleTargetCardLayout(input: EnhanceSingleTargetCardLayoutInput): EnhancedSingleTargetCardLayout {
  const layout = resolveSingleTargetCardLayout(input.rollCard);
  const mountedEffectSection = normalizeSingleTargetCardLayout(layout);
  bindSingleTargetCardRefresh(input.rollCard, input.refreshDelaysMs, input.onRefresh);

  return {
    damageSection: layout.damageSection,
    effectSection: mountedEffectSection ?? layout.effectSection,
  };
}

function resolveSingleTargetCardLayout(rollCard: HTMLElement): SingleTargetCardLayout {
  return {
    rollCard,
    damageSection: findDamageWorkflowSection(rollCard),
    resistance: rollCard.querySelector<HTMLElement>(RESISTANCE_SELECTOR),
    damageActions: findDamageActionSection(rollCard),
    effectActionSource: findEffectActionSource(rollCard),
    effectSection: findEffectActionSection(rollCard)
  };
}

function normalizeSingleTargetCardLayout(layout: SingleTargetCardLayout): HTMLElement | null {
  const {
    rollCard,
    damageSection,
    resistance,
    damageActions,
    effectActionSource,
    effectSection
  } = layout;

  rollCard.setAttribute(LAYOUT_NORMALIZED_ATTRIBUTE, "true");
  rollCard.classList.add(`${PROMPT_CLASS}__roll-card--structured`);

  if (damageSection && resistance && resistance.parentElement !== damageSection) {
    damageSection.append(resistance);
  }

  if (damageSection && damageActions) {
    if (damageActions.parentElement !== damageSection) {
      damageSection.append(damageActions);
    }

    enhanceDamageResolutionSection(rollCard, damageActions);
  }

  const mountedEffectSection = mountEffectActionSection({
    rollCard,
    existingSection: effectSection,
    sourceActions: effectActionSource,
    after: damageSection,
    fallbackAfter: findWorkflowSectionByTitle(rollCard, "Conjuração")
  });

  if (mountedEffectSection) {
    updateEffectActionResistanceGate(rollCard, mountedEffectSection);
  }

  return mountedEffectSection;
}

function bindSingleTargetCardRefresh(
  rollCard: HTMLElement,
  refreshDelaysMs: readonly number[],
  onRefresh: () => void
): void {
  const resistanceButton = rollCard.querySelector<HTMLButtonElement>(RESISTANCE_ROLL_BUTTON_SELECTOR);
  if (!resistanceButton) return;
  if (resistanceButton.getAttribute(REFRESH_BOUND_ATTRIBUTE) === "true") return;

  resistanceButton.setAttribute(REFRESH_BOUND_ATTRIBUTE, "true");
  resistanceButton.addEventListener("click", () => {
    for (const delayMs of refreshDelaysMs) {
      globalThis.setTimeout(onRefresh, delayMs);
    }
  });
}
