import { MODULE_ID } from "../../../constants";

export const CHAT_CARD_FLAG_KEY = "chatCard";
export const PROMPT_ID_ATTRIBUTE = "data-paranormal-toolkit-prompt-id";
export const PROMPT_CLASS = `${MODULE_ID}-item-use-prompt`;
export const PROMPT_TITLE_SELECTOR = `.${PROMPT_CLASS}__title`;
export const PROMPT_HEADER_SELECTOR = `.${PROMPT_CLASS}__header`;
export const ROLL_CARD_SELECTOR = `.${PROMPT_CLASS}__roll-card`;
export const ROLL_META_SELECTOR = `.${PROMPT_CLASS}__roll-meta`;
export const ROLL_META_PILL_SELECTOR = `.${PROMPT_CLASS}__roll-meta-pill`;
export const RESISTANCE_SELECTOR = `.${PROMPT_CLASS}__resistance`;
export const RESISTANCE_HEADER_SELECTOR = `.${PROMPT_CLASS}__resistance-header`;
export const RESISTANCE_DESCRIPTION_SELECTOR = `.${PROMPT_CLASS}__resistance-description`;
export const RESISTANCE_ROLL_BUTTON_SELECTOR = `.${PROMPT_CLASS}__resistance-roll-button`;
export const RESISTANCE_ROLL_RESULT_SELECTOR = `.${PROMPT_CLASS}__resistance-roll-result`;
export const RESISTANCE_CONTENT_CLASS = `${PROMPT_CLASS}__resistance-content`;
export const WORKFLOW_SECTION_SELECTOR = `.${PROMPT_CLASS}__workflow-section`;
export const WORKFLOW_ROLL_SELECTOR = `.${PROMPT_CLASS}__workflow-roll`;
export const WORKFLOW_ROLL_DICE_OPEN_CLASS = `${PROMPT_CLASS}__workflow-roll--dice-open`;
export const WORKFLOW_FORMULA_SELECTOR = `.${PROMPT_CLASS}__workflow-roll-formula`;
export const WORKFLOW_FORMULA_TOGGLE_CLASS = `${PROMPT_CLASS}__workflow-roll-formula--toggle`;
export const WORKFLOW_DICE_TRAY_SELECTOR = `.${PROMPT_CLASS}__workflow-dice-tray`;
export const ROLL_DETAIL_TOGGLE_SELECTOR = `.${PROMPT_CLASS}__roll-detail-toggle`;
export const ROLL_DETAIL_LIST_SELECTOR = `.${PROMPT_CLASS}__roll-detail-list`;
export const RITUAL_BADGE_SELECTOR = `.${PROMPT_CLASS}__ritual-element-badge`;
export const RITUAL_META_SELECTOR = `.${PROMPT_CLASS}__ritual-metadata`;

export const ELEMENT_TONES = ["blood", "death", "knowledge", "energy", "fear"] as const;

export type RitualElementTone = (typeof ELEMENT_TONES)[number];
