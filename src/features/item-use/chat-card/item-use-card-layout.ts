import {
  PROMPT_CLASS,
  RESISTANCE_ROLL_BUTTON_SELECTOR,
  RESISTANCE_SELECTOR
} from "./item-use-chat-card-constants";
import { findWorkflowSectionByTitle } from "./item-use-card-dom";
import { enhanceDamageResolutionSection } from "./item-use-card-damage-resolution";
import {
  findEffectActionSection,
  mountEffectActionSection,
  updateEffectActionResistanceGate
} from "./item-use-card-effect-section";
import { enhanceMultiTargetCardLayout } from "./item-use-card-multi-target";
import {
  findDamageActionSection,
  findDamageWorkflowSection,
  findEffectActionSource
} from "./single-target/single-target-card-dom";

const LAYOUT_NORMALIZED_ATTRIBUTE = "data-paranormal-toolkit-card-layout-normalized";
const REFRESH_BOUND_ATTRIBUTE = "data-paranormal-toolkit-card-layout-refresh-bound";
const LAYOUT_REFRESH_DELAYS_MS = [0, 80, 180, 400, 900, 1_600, 3_000] as const;

const scheduledLayoutRoots = new WeakSet<ParentNode>();

type RitualCardLayout = {
  rollCard: HTMLElement;
  damageSection: HTMLElement | null;
  resistance: HTMLElement | null;
  damageActions: HTMLElement | null;
  effectActionSource: HTMLElement | null;
  effectSection: HTMLElement | null;
};

export function enhanceRitualCardLayout(root: ParentNode): void {
  normalizeRitualCards(root);
  scheduleRitualCardLayoutRefresh(root);
}

function normalizeRitualCards(root: ParentNode): void {
  for (const rollCard of Array.from(root.querySelectorAll<HTMLElement>(`.${PROMPT_CLASS}__roll-card`))) {
    normalizeRitualCardLayout(resolveRitualCardLayout(rollCard));
  }
}

function scheduleRitualCardLayoutRefresh(root: ParentNode): void {
  if (scheduledLayoutRoots.has(root)) return;
  scheduledLayoutRoots.add(root);

  for (const delayMs of LAYOUT_REFRESH_DELAYS_MS) {
    globalThis.setTimeout(() => {
      normalizeRitualCards(root);
    }, delayMs);
  }
}

function resolveRitualCardLayout(rollCard: HTMLElement): RitualCardLayout {
  return {
    rollCard,
    damageSection: findDamageWorkflowSection(rollCard),
    resistance: rollCard.querySelector<HTMLElement>(RESISTANCE_SELECTOR),
    damageActions: findDamageActionSection(rollCard),
    effectActionSource: findEffectActionSource(rollCard),
    effectSection: findEffectActionSection(rollCard)
  };
}

function normalizeRitualCardLayout(layout: RitualCardLayout): void {
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

  enhanceMultiTargetCardLayout({
    rollCard,
    damageSection,
    effectSection: mountedEffectSection ?? effectSection
  });

  bindRitualCardRefresh(rollCard);
}

function bindRitualCardRefresh(rollCard: HTMLElement): void {
  const resistanceButton = rollCard.querySelector<HTMLButtonElement>(RESISTANCE_ROLL_BUTTON_SELECTOR);
  if (!resistanceButton) return;
  if (resistanceButton.getAttribute(REFRESH_BOUND_ATTRIBUTE) === "true") return;

  resistanceButton.setAttribute(REFRESH_BOUND_ATTRIBUTE, "true");
  resistanceButton.addEventListener("click", () => {
    for (const delayMs of LAYOUT_REFRESH_DELAYS_MS) {
      globalThis.setTimeout(() => {
        normalizeRitualCardLayout(resolveRitualCardLayout(rollCard));
      }, delayMs);
    }
  });
}
