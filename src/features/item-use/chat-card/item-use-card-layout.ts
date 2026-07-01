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
import { enhanceEffectActionSection, updateEffectActionResistanceGate } from "./item-use-card-effect-section";

const PROMPT_ID_ATTRIBUTE = "data-paranormal-toolkit-prompt-id";
const LAYOUT_NORMALIZED_ATTRIBUTE = "data-paranormal-toolkit-card-layout-normalized";
const REFRESH_BOUND_ATTRIBUTE = "data-paranormal-toolkit-card-layout-refresh-bound";
const DAMAGE_ACTION_SECTION_ID = "apply-damage";
const LAYOUT_REFRESH_DELAYS_MS = [0, 80, 180, 400, 900, 1_600] as const;

type RitualCardLayout = {
  rollCard: HTMLElement;
  damageSection: HTMLElement | null;
  resistance: HTMLElement | null;
  damageActions: HTMLElement | null;
  effectActions: HTMLElement | null;
};

export function enhanceRitualCardLayout(root: ParentNode): void {
  for (const rollCard of Array.from(root.querySelectorAll<HTMLElement>(`.${PROMPT_CLASS}__roll-card`))) {
    normalizeRitualCardLayout(resolveRitualCardLayout(rollCard));
  }

  enhanceLooseEffectActions(root);
}

function resolveRitualCardLayout(rollCard: HTMLElement): RitualCardLayout {
  return {
    rollCard,
    damageSection: findWorkflowSectionByTitle(rollCard, "Dano"),
    resistance: rollCard.querySelector<HTMLElement>(RESISTANCE_SELECTOR),
    damageActions: findDamageActionSection(rollCard),
    effectActions: findEffectActionSection(rollCard)
  };
}

function normalizeRitualCardLayout(layout: RitualCardLayout): void {
  const { rollCard, damageSection, resistance, damageActions, effectActions } = layout;

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

  if (effectActions) {
    enhanceEffectActionSection(effectActions);
    moveEffectSectionIntoCard(rollCard, damageSection, effectActions);
    updateEffectActionResistanceGate(rollCard, effectActions);
  }

  bindRitualCardRefresh(rollCard);
}

function findDamageActionSection(rollCard: HTMLElement): HTMLElement | null {
  return getActionSectionsForCard(rollCard).find((section) => section.getAttribute(ACTION_SECTION_ATTRIBUTE) === DAMAGE_ACTION_SECTION_ID)
    ?? getActionSectionsForCard(rollCard).find((section) => getActionTitle(section) === "aplicar danos")
    ?? null;
}

function findEffectActionSection(rollCard: HTMLElement): HTMLElement | null {
  return getActionSectionsForCard(rollCard).find((section) => {
    const title = getActionTitle(section);
    return title === "aplicar efeito" || title === "efeito";
  }) ?? null;
}

function getActionSectionsForCard(rollCard: HTMLElement): HTMLElement[] {
  const scope = rollCard.closest<HTMLElement>(`.${PROMPT_CLASS}`) ?? rollCard.parentElement;
  if (!scope) return [];

  const promptId = findPromptIdInRollCard(rollCard);
  const sections = Array.from(scope.querySelectorAll<HTMLElement>(ACTIONS_SELECTOR));
  if (!promptId) return sections;

  return sections.filter((section) => sectionContainsPromptId(section, promptId));
}

function sectionContainsPromptId(section: HTMLElement, promptId: string): boolean {
  return Array.from(section.querySelectorAll<HTMLElement>(`[${PROMPT_ID_ATTRIBUTE}]`))
    .some((element) => element.getAttribute(PROMPT_ID_ATTRIBUTE) === promptId);
}

function findPromptIdInRollCard(rollCard: HTMLElement): string | null {
  return rollCard.querySelector<HTMLElement>(`[${PROMPT_ID_ATTRIBUTE}]`)?.getAttribute(PROMPT_ID_ATTRIBUTE) ?? null;
}

function moveEffectSectionIntoCard(
  rollCard: HTMLElement,
  damageSection: HTMLElement | null,
  effectActions: HTMLElement
): void {
  if (effectActions.parentElement === rollCard && isEffectSectionInExpectedPosition(effectActions, damageSection)) return;

  const insertionReference = damageSection?.nextElementSibling ?? null;
  rollCard.insertBefore(effectActions, insertionReference);
}

function isEffectSectionInExpectedPosition(effectActions: HTMLElement, damageSection: HTMLElement | null): boolean {
  if (!damageSection) return effectActions.parentElement?.firstElementChild === effectActions;
  return effectActions.previousElementSibling === damageSection;
}

function enhanceLooseEffectActions(root: ParentNode): void {
  for (const actions of Array.from(root.querySelectorAll<HTMLElement>(ACTIONS_SELECTOR))) {
    if (actions.closest(`.${PROMPT_CLASS}__roll-card`)) continue;
    enhanceEffectActionSection(actions);
  }
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
