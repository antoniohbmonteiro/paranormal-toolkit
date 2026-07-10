import { getResistanceSkillLabel } from "../../../../adapters/ordem/ordem-resistance-roll-adapter";
import type { AutomationConditionApplicationDefinition } from "../../../../core/automation/automation-definition";
import type { ToolkitConditionDurationInput } from "../../../conditions/condition-duration";
import type { ItemUseResistanceGateMode } from "../../config/item-use-resistance-gate-policy";
import { createTargetResistanceUiState } from "../item-use-card-resistance-state";
import {
  getResistanceOutcomeForAction,
  normalizeConditionApplicationResistanceTrigger,
  requiresResolvedResistanceOutcome,
  type ConditionApplicationResistanceTrigger,
} from "../../condition-application-resistance-outcome";
import { createAssistedTargetActionViewModel, type AssistedTargetActionViewModel } from "../../assisted-actions/assisted-action-view-model";
import {
  PROMPT_CLASS,
  RESISTANCE_ROLL_BUTTON_SELECTOR,
} from "../item-use-chat-card-constants";
import { readCastingDifficulty } from "../item-use-card-roll-context";
import { readWorkflowDiceBreakdown } from "../item-use-card-roll-display";
import type {
  MultiTargetDamageApplication,
  MultiTargetEffectApplication,
  MultiTargetResistanceResult,
} from "../item-use-card-multi-target-state";

const RESISTANCE_SKILL_ATTRIBUTE = "data-paranormal-toolkit-resistance-skill";
const RESISTANCE_SKILL_LABEL_ATTRIBUTE = "data-paranormal-toolkit-resistance-skill-label";
const ROLL_CARD_TARGET_NAMES_ATTRIBUTE = "data-paranormal-toolkit-roll-card-target-names";
const ROLL_CARD_RESISTANCE_ATTRIBUTE = "data-paranormal-toolkit-roll-card-resistance";
const ROLL_CARD_RESISTANCE_SKILL_ATTRIBUTE = "data-paranormal-toolkit-roll-card-resistance-skill";
const ROLL_CARD_RESISTANCE_SKILL_LABEL_ATTRIBUTE = "data-paranormal-toolkit-roll-card-resistance-skill-label";

export const MULTI_TARGET_PENDING_STATE = "pending";
export const MULTI_TARGET_SUCCESS_STATE = "success";
export const MULTI_TARGET_FAILURE_STATE = "failure";
export const MULTI_TARGET_ROLLED_STATE = "rolled";

export type MultiTargetState =
  | typeof MULTI_TARGET_PENDING_STATE
  | typeof MULTI_TARGET_SUCCESS_STATE
  | typeof MULTI_TARGET_FAILURE_STATE
  | typeof MULTI_TARGET_ROLLED_STATE;

export type MultiTargetCardLayoutInput = {
  rollCard: HTMLElement;
  damageSection: HTMLElement | null;
  effectSection: HTMLElement | null;
};

export type MultiTargetCardViewModelInput = MultiTargetCardLayoutInput & {
  resistanceResults: Map<string, MultiTargetResistanceResult>;
  damageApplications: Map<string, MultiTargetDamageApplication>;
  effectApplications: Map<string, MultiTargetEffectApplication>;
  resolveTargetConditionApplication: (
    rollCard: HTMLElement,
    displayLabel: string | null,
    resistanceOutcome: "failure" | "success" | null,
  ) => TargetConditionApplication | null;
  resistanceGateMode: ItemUseResistanceGateMode;
};

export type MultiTargetCardViewModel = {
  rollCard: HTMLElement;
  targets: MultiTargetViewModel[];
  damage: TargetDamageViewModel | null;
  effect: TargetEffectViewModel | null;
  resistance: TargetResistanceViewModel | null;
};

export type MultiTargetViewModel = {
  id: string;
  name: string;
  state: MultiTargetState;
  resistanceResult: MultiTargetResistanceResult | null;
  damageApplication: MultiTargetDamageApplication | null;
  effectApplication: MultiTargetEffectApplication | null;
  assistedActions: AssistedTargetActionViewModel;
  effect: TargetEffectViewModel | null;
};

export type TargetDamageViewModel = {
  typeLabel: string | null;
  formula: string;
  total: number | null;
  diceBreakdown: string | null;
  normalAmount: number | null;
  halfAmount: number | null;
  normalLabel: string;
  normalCompactLabel: string;
  halfLabel: string | null;
  halfCompactLabel: string | null;
};

export type TargetEffectViewModel = {
  label: string;
  conditionId: string;
  conditionLabel: string;
  duration: ToolkitConditionDurationInput | null;
  source: string | null;
  originUuid: string | null;
  applyOnResistance: ConditionApplicationResistanceTrigger;
};

export type TargetResistanceViewModel = {
  description: string;
  formula: string | null;
  skill: string | null;
  skillLabel: string | null;
  difficulty: number | null;
};

export type TargetConditionApplication = {
  conditionId: string;
  conditionLabel: string;
  duration: AutomationConditionApplicationDefinition["duration"] | null;
  source: string | null;
  originUuid: string | null;
  applyOnResistance: ConditionApplicationResistanceTrigger;
};

export function createMultiTargetCardViewModel(input: MultiTargetCardViewModelInput): MultiTargetCardViewModel | null {
  const resistance = createResistanceViewModel(input.rollCard, [
    input.damageSection,
    input.effectSection,
    input.rollCard,
  ]);
  const damage = input.damageSection ? createDamageViewModel(input.damageSection) : null;
  const effect = createEffectViewModel(input.rollCard, input.effectSection, input.resolveTargetConditionApplication, null);
  const targets = readTargetNames(input.rollCard).map((name, index) => {
    const id = createTargetId(name, index);
    const resistanceResult = input.resistanceResults.get(id) ?? null;
    const state = resolveTargetState(resistanceResult, resistance?.difficulty ?? null);
    const damageApplication = input.damageApplications.get(id) ?? null;
    const effectApplication = input.effectApplications.get(id) ?? null;
    const resistanceState = createTargetResistanceUiState({
      hasResistance: Boolean(resistance),
      difficulty: resistance?.difficulty ?? null,
      total: resistanceResult?.total ?? null,
      status: getTargetResistanceStatusFromState(state),
    }).state;
    const targetEffect = createEffectViewModel(
      input.rollCard,
      input.effectSection,
      input.resolveTargetConditionApplication,
      getResistanceOutcomeForAction(resistanceState),
    ) ?? effect;

    return {
      id,
      name,
      state,
      resistanceResult,
      damageApplication,
      effectApplication,
      effect: targetEffect,
      assistedActions: createAssistedTargetActionViewModel({
        targetId: id,
        targetName: name,
        resistanceGateMode: input.resistanceGateMode,
        resistanceState,
        damage,
        effect: targetEffect,
        damageAlreadyApplied: Boolean(damageApplication),
        effectAlreadyApplied: Boolean(effectApplication),
        effectCanApplyOnSuccessfulResistance: targetEffect?.applyOnResistance === "success" || targetEffect?.applyOnResistance === "always",
        effectRequiresResolvedResistance: targetEffect ? requiresResolvedResistanceOutcome(targetEffect) : false,
      }),
    };
  });

  if (targets.length <= 1 || (!damage && !effect && !resistance)) return null;

  return {
    rollCard: input.rollCard,
    targets,
    damage,
    effect,
    resistance,
  };
}

function readTargetNames(rollCard: HTMLElement): string[] {
  const encodedTargetNames = rollCard.getAttribute(ROLL_CARD_TARGET_NAMES_ATTRIBUTE);
  const targetNames = encodedTargetNames ? parseStringArray(encodedTargetNames) : [];

  if (targetNames.length > 0) return targetNames;

  const prompt = rollCard.closest<HTMLElement>(`.${PROMPT_CLASS}`);
  const summary = prompt?.querySelector<HTMLElement>(`.${PROMPT_CLASS}__summary`)?.textContent ?? "";
  const [, targetText] = summary.split("→");
  if (!targetText) return [];

  return targetText
    .split(",")
    .map((target) => target.trim())
    .filter((target) => target.length > 0 && normalizeText(target) !== "nenhum alvo");
}

function createTargetId(name: string, index: number): string {
  return `${normalizeText(name)}:${index}`;
}

function createDamageViewModel(damageSection: HTMLElement): TargetDamageViewModel {
  const total = readRollTotal(damageSection);
  const halfAmount = total !== null ? Math.floor(total / 2) : null;

  return {
    typeLabel: readWorkflowSectionDescription(damageSection),
    formula: readRollFormula(damageSection) ?? "—",
    total,
    diceBreakdown: readWorkflowDiceBreakdown(damageSection),
    normalAmount: total,
    halfAmount,
    normalLabel: total !== null ? `Normal: ${total} PV` : "Normal: —",
    normalCompactLabel: total !== null ? `${total} PV` : "—",
    halfLabel: halfAmount !== null ? `Metade: ${halfAmount} PV` : null,
    halfCompactLabel: halfAmount !== null ? `½ ${halfAmount} PV` : null,
  };
}

function createEffectViewModel(
  rollCard: HTMLElement,
  effectSection: HTMLElement | null,
  resolveTargetConditionApplication: MultiTargetCardViewModelInput["resolveTargetConditionApplication"],
  resistanceOutcome: "failure" | "success" | null,
): TargetEffectViewModel | null {
  const displayLabel = effectSection?.querySelector<HTMLElement>(`.${PROMPT_CLASS}__effect-section-label`)?.textContent?.trim();
  const application = resolveTargetConditionApplication(rollCard, displayLabel ?? null, resistanceOutcome);
  if (!application) return null;

  return {
    label: displayLabel && displayLabel.length > 0 ? displayLabel : application.conditionLabel,
    conditionId: application.conditionId,
    conditionLabel: application.conditionLabel,
    duration: normalizeConditionDuration(application.duration),
    source: application.source,
    originUuid: application.originUuid,
    applyOnResistance: normalizeConditionApplicationResistanceTrigger(application),
  };
}

function normalizeConditionDuration(
  duration: AutomationConditionApplicationDefinition["duration"] | null,
): ToolkitConditionDurationInput | null {
  if (!duration) return null;

  return {
    rounds: duration.rounds ?? null,
    expiry: duration.expiry ?? null,
  };
}

function createResistanceViewModel(
  rollCard: HTMLElement,
  candidateSections: readonly (HTMLElement | null)[],
): TargetResistanceViewModel | null {
  const candidates = normalizeResistanceCandidateSections(candidateSections);
  const metadata = readRollCardResistanceMetadata(rollCard);
  const description = metadata.description ?? findResistanceDescriptionElement(candidates)?.textContent?.trim();
  const sourceButton = findResistanceButtonElement(candidates);
  const skill = metadata.skill ?? sourceButton?.getAttribute(RESISTANCE_SKILL_ATTRIBUTE) ?? null;
  const skillLabel = metadata.skillLabel ?? sourceButton?.getAttribute(RESISTANCE_SKILL_LABEL_ATTRIBUTE) ?? (skill ? getResistanceSkillLabel(skill) : null);

  if (!description && !skill) return null;

  return {
    description: description ?? "Resistência do alvo.",
    formula: findResistanceFormulaElement(candidates)?.textContent?.trim() ?? null,
    skill,
    skillLabel,
    difficulty: readCastingDifficulty(rollCard),
  };
}

function readRollCardResistanceMetadata(rollCard: HTMLElement): {
  description: string | null;
  skill: string | null;
  skillLabel: string | null;
} {
  return {
    description: readNonEmptyAttribute(rollCard, ROLL_CARD_RESISTANCE_ATTRIBUTE),
    skill: readNonEmptyAttribute(rollCard, ROLL_CARD_RESISTANCE_SKILL_ATTRIBUTE),
    skillLabel: readNonEmptyAttribute(rollCard, ROLL_CARD_RESISTANCE_SKILL_LABEL_ATTRIBUTE),
  };
}

function normalizeResistanceCandidateSections(candidateSections: readonly (HTMLElement | null)[]): HTMLElement[] {
  const normalized: HTMLElement[] = [];

  for (const section of candidateSections) {
    if (!section || normalized.includes(section)) continue;
    normalized.push(section);
  }

  return normalized;
}

function findResistanceDescriptionElement(candidates: readonly HTMLElement[]): HTMLElement | null {
  return findFirstInCandidateSections(candidates, `.${PROMPT_CLASS}__resistance-description`);
}

function findResistanceButtonElement(candidates: readonly HTMLElement[]): HTMLButtonElement | null {
  return findFirstInCandidateSections(candidates, RESISTANCE_ROLL_BUTTON_SELECTOR);
}

function findResistanceFormulaElement(candidates: readonly HTMLElement[]): HTMLElement | null {
  return findFirstInCandidateSections(
    candidates,
    `.${PROMPT_CLASS}__resistance .${PROMPT_CLASS}__workflow-roll-formula`,
  );
}

function findFirstInCandidateSections<T extends HTMLElement>(
  candidates: readonly HTMLElement[],
  selector: string,
): T | null {
  for (const candidate of candidates) {
    const element = candidate.querySelector<T>(selector);
    if (element) return element;
  }

  return null;
}

function resolveTargetState(result: MultiTargetResistanceResult | null, difficulty: number | null): MultiTargetState {
  if (!result) return MULTI_TARGET_PENDING_STATE;
  if (difficulty === null) return MULTI_TARGET_ROLLED_STATE;
  return result.total >= difficulty ? MULTI_TARGET_SUCCESS_STATE : MULTI_TARGET_FAILURE_STATE;
}

function readRollTotal(section: HTMLElement | null): number | null {
  const totalText = section?.querySelector<HTMLElement>(`.${PROMPT_CLASS}__workflow-roll-total`)?.textContent?.trim();
  if (!totalText) return null;

  const total = Number(totalText.replace(/[^\d-]/gu, ""));
  return Number.isFinite(total) ? Math.trunc(total) : null;
}

function readRollFormula(section: HTMLElement | null): string | null {
  const formula = section?.querySelector<HTMLElement>(`.${PROMPT_CLASS}__workflow-roll-formula`)?.textContent?.trim();
  return formula && formula.length > 0 ? formula : null;
}

function readWorkflowSectionDescription(section: HTMLElement | null): string | null {
  const description = section?.querySelector<HTMLElement>(`.${PROMPT_CLASS}__workflow-section-description`)?.textContent?.trim();
  return description && description.length > 0 ? description : null;
}

function parseStringArray(value: string): string[] {
  try {
    const parsed = JSON.parse(value);
    if (!Array.isArray(parsed)) return [];

    return parsed
      .filter((entry): entry is string => typeof entry === "string")
      .map((entry) => entry.trim())
      .filter((entry) => entry.length > 0);
  } catch {
    return [];
  }
}

function readNonEmptyAttribute(element: HTMLElement, attribute: string): string | null {
  const value = element.getAttribute(attribute)?.trim();
  return value && value.length > 0 ? value : null;
}

function normalizeText(value: string | null | undefined): string {
  return value
    ?.normalize("NFD")
    .replace(/[\u0300-\u036f]/gu, "")
    .trim()
    .toLocaleLowerCase() ?? "";
}

function getTargetResistanceStatusFromState(state: MultiTargetState): "pending" | "succeeded" | "failed" {
  if (state === MULTI_TARGET_SUCCESS_STATE) return "succeeded";
  if (state === MULTI_TARGET_FAILURE_STATE) return "failed";
  return "pending";
}
