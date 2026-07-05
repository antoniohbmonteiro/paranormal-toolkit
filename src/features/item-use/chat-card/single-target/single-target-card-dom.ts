import { PROMPT_CLASS } from "../item-use-chat-card-constants";
import {
  ACTION_SECTION_ATTRIBUTE,
  ACTIONS_SELECTOR,
  getActionTitle
} from "../item-use-card-dom";

const PROMPT_ID_ATTRIBUTE = "data-paranormal-toolkit-prompt-id";
const DAMAGE_ACTION_SECTION_ID = "apply-damage";
const MULTI_TARGET_DAMAGE_INFO_ATTRIBUTE = "data-paranormal-toolkit-multi-target-damage-info";

export function findDamageWorkflowSection(rollCard: HTMLElement): HTMLElement | null {
  return Array.from(rollCard.querySelectorAll<HTMLElement>(`.${PROMPT_CLASS}__workflow-section`))
    .find((section) => {
      if (section.getAttribute(MULTI_TARGET_DAMAGE_INFO_ATTRIBUTE) === "true") return false;

      const title = section.querySelector<HTMLElement>(`.${PROMPT_CLASS}__workflow-section-header strong`)?.textContent;
      return title?.trim().toLocaleLowerCase() === "dano";
    })
    ?? null;
}

export function findDamageActionSection(rollCard: HTMLElement): HTMLElement | null {
  const sections = getActionSectionsForCard(rollCard);

  return sections.find((section) => section.getAttribute(ACTION_SECTION_ATTRIBUTE) === DAMAGE_ACTION_SECTION_ID)
    ?? sections.find((section) => getActionTitle(section) === "aplicar danos")
    ?? null;
}

export function findEffectActionSource(rollCard: HTMLElement): HTMLElement | null {
  const scopedSections = getPromptMatchedActionSections(rollCard);
  const scopedEffect = findEffectActionInSections(scopedSections);
  if (scopedEffect) return scopedEffect;

  return findEffectActionInSections(getLegacyActionSectionsForCard(rollCard));
}

export function findEffectActionInSections(sections: HTMLElement[]): HTMLElement | null {
  return sections.find((section) => {
    const title = getActionTitle(section);
    return title === "aplicar efeito" || title === "efeito";
  }) ?? null;
}

export function getActionSectionsForCard(rollCard: HTMLElement): HTMLElement[] {
  const matchedSections = getPromptMatchedActionSections(rollCard);
  return matchedSections.length > 0 ? matchedSections : getActionSectionsInPromptRoot(rollCard);
}

export function getPromptMatchedActionSections(rollCard: HTMLElement): HTMLElement[] {
  const promptId = findPromptIdInRollCard(rollCard);
  if (!promptId) return [];

  return getActionSectionsInPromptRoot(rollCard).filter((section) => sectionContainsPromptId(section, promptId));
}

export function getLegacyActionSectionsForCard(rollCard: HTMLElement): HTMLElement[] {
  const scope = getPromptRoot(rollCard);
  if (!scope) return [];

  const nextRollCard = findNextRollCard(rollCard, scope);

  return getActionSectionsInPromptRoot(rollCard)
    .filter((section) => !section.closest(`.${PROMPT_CLASS}__roll-card`))
    .filter((section) => isAfter(rollCard, section))
    .filter((section) => !nextRollCard || isBefore(section, nextRollCard));
}

export function getActionSectionsInPromptRoot(rollCard: HTMLElement): HTMLElement[] {
  const scope = getPromptRoot(rollCard);
  if (!scope) return [];

  return Array.from(scope.querySelectorAll<HTMLElement>(ACTIONS_SELECTOR));
}

export function getPromptRoot(rollCard: HTMLElement): HTMLElement | null {
  return rollCard.closest<HTMLElement>(`.${PROMPT_CLASS}`) ?? rollCard.parentElement;
}

export function findNextRollCard(rollCard: HTMLElement, scope: HTMLElement): HTMLElement | null {
  return Array.from(scope.querySelectorAll<HTMLElement>(`.${PROMPT_CLASS}__roll-card`))
    .find((candidate) => candidate !== rollCard && isAfter(rollCard, candidate))
    ?? null;
}

export function sectionContainsPromptId(section: HTMLElement, promptId: string): boolean {
  if (section.getAttribute(PROMPT_ID_ATTRIBUTE) === promptId) return true;

  return Array.from(section.querySelectorAll<HTMLElement>(`[${PROMPT_ID_ATTRIBUTE}]`))
    .some((element) => element.getAttribute(PROMPT_ID_ATTRIBUTE) === promptId);
}

export function findPromptIdInRollCard(rollCard: HTMLElement): string | null {
  return rollCard.getAttribute(PROMPT_ID_ATTRIBUTE)
    ?? rollCard.querySelector<HTMLElement>(`[${PROMPT_ID_ATTRIBUTE}]`)?.getAttribute(PROMPT_ID_ATTRIBUTE)
    ?? null;
}

export function isAfter(reference: HTMLElement, candidate: HTMLElement): boolean {
  return Boolean(reference.compareDocumentPosition(candidate) & Node.DOCUMENT_POSITION_FOLLOWING);
}

export function isBefore(reference: HTMLElement, candidate: HTMLElement): boolean {
  return Boolean(reference.compareDocumentPosition(candidate) & Node.DOCUMENT_POSITION_FOLLOWING);
}
