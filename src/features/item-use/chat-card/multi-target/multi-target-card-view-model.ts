import { getResistanceSkillLabel } from "../../../../adapters/ordem/ordem-resistance-roll-adapter";
import type { AutomationConditionApplicationDefinition } from "../../../../core/automation/automation-definition";
import type { ToolkitConditionDurationInput } from "../../../conditions/condition-duration";
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
  ) => TargetConditionApplication | null;
};

export type MultiTargetCardViewModel = {
  rollCard: HTMLElement;
  targets: MultiTargetViewModel[];
  damage: TargetDamageViewModel;
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
};

export function createMultiTargetCardViewModel(input: MultiTargetCardViewModelInput): MultiTargetCardViewModel | null {
  const resistance = createResistanceViewModel(input.rollCard, input.damageSection);
  const targets = readTargetNames(input.rollCard).map((name, index) => {
    const id = createTargetId(name, index);
    const resistanceResult = input.resistanceResults.get(id) ?? null;

    return {
      id,
      name,
      state: resolveTargetState(resistanceResult, resistance?.difficulty ?? null),
      resistanceResult,
      damageApplication: input.damageApplications.get(id) ?? null,
      effectApplication: input.effectApplications.get(id) ?? null,
    };
  });

  if (targets.length <= 1 || !input.damageSection) return null;

  return {
    rollCard: input.rollCard,
    targets,
    damage: createDamageViewModel(input.damageSection),
    effect: createEffectViewModel(input.rollCard, input.effectSection, input.resolveTargetConditionApplication),
    resistance,
  };
}

function readTargetNames(rollCard: HTMLElement): string[] {
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

function createDamageViewModel(damageSection: HTMLElement | null): TargetDamageViewModel {
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
): TargetEffectViewModel | null {
  const displayLabel = effectSection?.querySelector<HTMLElement>(`.${PROMPT_CLASS}__effect-section-label`)?.textContent?.trim();
  const application = resolveTargetConditionApplication(rollCard, displayLabel ?? null);
  if (!application) return null;

  return {
    label: displayLabel && displayLabel.length > 0 ? displayLabel : application.conditionLabel,
    conditionId: application.conditionId,
    conditionLabel: application.conditionLabel,
    duration: normalizeConditionDuration(application.duration),
    source: application.source,
    originUuid: application.originUuid,
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

function createResistanceViewModel(rollCard: HTMLElement, damageSection: HTMLElement | null): TargetResistanceViewModel | null {
  const description = damageSection?.querySelector<HTMLElement>(`.${PROMPT_CLASS}__resistance-description`)?.textContent?.trim();
  const sourceButton = damageSection?.querySelector<HTMLButtonElement>(RESISTANCE_ROLL_BUTTON_SELECTOR) ?? null;
  const skill = sourceButton?.getAttribute(RESISTANCE_SKILL_ATTRIBUTE) ?? null;
  const skillLabel = sourceButton?.getAttribute(RESISTANCE_SKILL_LABEL_ATTRIBUTE) ?? (skill ? getResistanceSkillLabel(skill) : null);

  if (!description && !skill) return null;

  return {
    description: description ?? "Resistência do alvo.",
    formula: damageSection?.querySelector<HTMLElement>(`.${PROMPT_CLASS}__resistance .${PROMPT_CLASS}__workflow-roll-formula`)?.textContent?.trim() ?? null,
    skill,
    skillLabel,
    difficulty: readCastingDifficulty(rollCard),
  };
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

function normalizeText(value: string | null | undefined): string {
  return value
    ?.normalize("NFD")
    .replace(/[\u0300-\u036f]/gu, "")
    .trim()
    .toLocaleLowerCase() ?? "";
}
