import {
  PROMPT_CLASS,
  RESISTANCE_ROLL_BUTTON_SELECTOR,
  RESISTANCE_SELECTOR
} from "./item-use-chat-card-constants";
import {
  ACTION_SECTION_ATTRIBUTE,
  ACTIONS_SELECTOR,
  getActionTitle,
  findWorkflowSectionByTitle
} from "./item-use-card-dom";
import { enhanceDamageResolutionSection } from "./item-use-card-damage-resolution";
import {
  findEffectActionSection,
  mountEffectActionSection,
  updateEffectActionResistanceGate
} from "./item-use-card-effect-section";
import { enhanceMultiTargetCardLayout } from "./item-use-card-multi-target";

const PROMPT_ID_ATTRIBUTE = "data-paranormal-toolkit-prompt-id";
const LAYOUT_NORMALIZED_ATTRIBUTE = "data-paranormal-toolkit-card-layout-normalized";
const REFRESH_BOUND_ATTRIBUTE = "data-paranormal-toolkit-card-layout-refresh-bound";
const DAMAGE_ACTION_SECTION_ID = "apply-damage";
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
    damageSection: findWorkflowSectionByTitle(rollCard, "Dano"),
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

function findDamageActionSection(rollCard: HTMLElement): HTMLElement | null {
  const sections = getActionSectionsForCard(rollCard);

  return sections.find((section) => section.getAttribute(ACTION_SECTION_ATTRIBUTE) === DAMAGE_ACTION_SECTION_ID)
    ?? sections.find((section) => getActionTitle(section) === "aplicar danos")
    ?? null;
}

function findEffectActionSource(rollCard: HTMLElement): HTMLElement | null {
  const scopedSections = getPromptMatchedActionSections(rollCard);
  const scopedEffect = findEffectActionInSections(scopedSections);
  if (scopedEffect) return scopedEffect;

  return findEffectActionInSections(getLegacyActionSectionsForCard(rollCard));
}

function findEffectActionInSections(sections: HTMLElement[]): HTMLElement | null {
  return sections.find((section) => {
    const title = getActionTitle(section);
    return title === "aplicar efeito" || title === "efeito";
  }) ?? null;
}

function getActionSectionsForCard(rollCard: HTMLElement): HTMLElement[] {
  const matchedSections = getPromptMatchedActionSections(rollCard);
  return matchedSections.length > 0 ? matchedSections : getActionSectionsInPromptRoot(rollCard);
}

function getPromptMatchedActionSections(rollCard: HTMLElement): HTMLElement[] {
  const promptId = findPromptIdInRollCard(rollCard);
  if (!promptId) return [];

  return getActionSectionsInPromptRoot(rollCard).filter((section) => sectionContainsPromptId(section, promptId));
}

function getLegacyActionSectionsForCard(rollCard: HTMLElement): HTMLElement[] {
  const scope = getPromptRoot(rollCard);
  if (!scope) return [];

  const nextRollCard = findNextRollCard(rollCard, scope);

  return getActionSectionsInPromptRoot(rollCard)
    .filter((section) => !section.closest(`.${PROMPT_CLASS}__roll-card`))
    .filter((section) => isAfter(rollCard, section))
    .filter((section) => !nextRollCard || isBefore(section, nextRollCard));
}

function getActionSectionsInPromptRoot(rollCard: HTMLElement): HTMLElement[] {
  const scope = getPromptRoot(rollCard);
  if (!scope) return [];

  return Array.from(scope.querySelectorAll<HTMLElement>(ACTIONS_SELECTOR));
}

function getPromptRoot(rollCard: HTMLElement): HTMLElement | null {
  return rollCard.closest<HTMLElement>(`.${PROMPT_CLASS}`) ?? rollCard.parentElement;
}

function findNextRollCard(rollCard: HTMLElement, scope: HTMLElement): HTMLElement | null {
  return Array.from(scope.querySelectorAll<HTMLElement>(`.${PROMPT_CLASS}__roll-card`))
    .find((candidate) => candidate !== rollCard && isAfter(rollCard, candidate))
    ?? null;
}

function sectionContainsPromptId(section: HTMLElement, promptId: string): boolean {
  if (section.getAttribute(PROMPT_ID_ATTRIBUTE) === promptId) return true;

  return Array.from(section.querySelectorAll<HTMLElement>(`[${PROMPT_ID_ATTRIBUTE}]`))
    .some((element) => element.getAttribute(PROMPT_ID_ATTRIBUTE) === promptId);
}

function findPromptIdInRollCard(rollCard: HTMLElement): string | null {
  return rollCard.getAttribute(PROMPT_ID_ATTRIBUTE)
    ?? rollCard.querySelector<HTMLElement>(`[${PROMPT_ID_ATTRIBUTE}]`)?.getAttribute(PROMPT_ID_ATTRIBUTE)
    ?? null;
}

function isAfter(reference: HTMLElement, candidate: HTMLElement): boolean {
  return Boolean(reference.compareDocumentPosition(candidate) & Node.DOCUMENT_POSITION_FOLLOWING);
}

function isBefore(reference: HTMLElement, candidate: HTMLElement): boolean {
  return Boolean(reference.compareDocumentPosition(candidate) & Node.DOCUMENT_POSITION_FOLLOWING);
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
