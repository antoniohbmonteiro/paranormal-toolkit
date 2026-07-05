import { OrdemDamageAdapter } from "../../../adapters/ordem/ordem-damage-adapter";
import { getResistanceSkillLabel, OrdemResistanceAdapter } from "../../../adapters/ordem/ordem-resistance-roll-adapter";
import { DamageEngine } from "../../../core/damage/damage-engine";
import { ResistanceEngine } from "../../../core/resistance/resistance-engine";
import type { AutomationConditionApplicationDefinition } from "../../../core/automation/automation-definition";
import { ConditionEngine } from "../../conditions/condition-engine";
import { createToolkitConditionRegistry } from "../../conditions/condition-registry";
import { readAutomationDefinition } from "../../automation/automation-flag-reader";
import { getItemUseResistanceGateMode } from "../item-use-settings";
import type {
  ItemUseResistanceGateMode,
  ResistanceResolutionState,
} from "../config/item-use-resistance-gate-policy";
import {
  isActionResisted,
  isActionWaitingForResistance,
} from "./item-use-card-action-state";
import {
  createMultiTargetCardViewModel,
  MULTI_TARGET_FAILURE_STATE,
  MULTI_TARGET_PENDING_STATE,
  MULTI_TARGET_ROLLED_STATE,
  MULTI_TARGET_SUCCESS_STATE,
  type MultiTargetCardLayoutInput,
  type MultiTargetCardViewModel,
  type MultiTargetViewModel,
  type TargetConditionApplication,
  type TargetDamageViewModel,
  type TargetEffectViewModel,
  type TargetResistanceViewModel,
} from "./multi-target/multi-target-card-view-model";
import { resolveMultiTargetSourceItem } from "./multi-target/multi-target-source-item-resolver";
import { resolveMultiTargetActorByName } from "./multi-target/multi-target-target-resolver";
import { createMultiTargetDamageFeedbackMessage } from "./multi-target/multi-target-damage-feedback-service";
import { createPublicDamageAppliedLabel, createPublicDamageActionLabel } from "../assisted-actions/assisted-action-labels";
import { canCurrentUserControlAssistedActions } from "../assisted-actions/assisted-action-policy";
import { ApplyTargetDamageUseCase } from "../use-cases/apply-target-damage-use-case";
import { ApplyTargetEffectUseCase } from "../use-cases/apply-target-effect-use-case";
import { RollTargetResistanceUseCase } from "../use-cases/roll-target-resistance-use-case";
import {
  PROMPT_CLASS,
  WORKFLOW_DICE_TRAY_SELECTOR,
  WORKFLOW_FORMULA_SELECTOR,
  WORKFLOW_FORMULA_TOGGLE_CLASS,
  WORKFLOW_ROLL_DICE_OPEN_CLASS
} from "./item-use-chat-card-constants";
import { findWorkflowSectionByTitle } from "./item-use-card-dom";
import { createWorkflowRollDisplay } from "./item-use-card-roll-display";
import {
  persistMultiTargetDamageApplication,
  persistMultiTargetEffectApplication,
  persistMultiTargetResistanceResult,
  readPersistedMultiTargetDamageApplications,
  readPersistedMultiTargetEffectApplications,
  readPersistedMultiTargetPromptContext,
  readPersistedMultiTargetResistanceResults,
  type MultiTargetDamageApplication,
  type MultiTargetDamageMode,
  type MultiTargetEffectApplication,
  type MultiTargetResistanceResult
} from "./item-use-card-multi-target-state";

const RESISTANCE_SKILL_ATTRIBUTE = "data-paranormal-toolkit-resistance-skill";
const RESISTANCE_SKILL_LABEL_ATTRIBUTE = "data-paranormal-toolkit-resistance-skill-label";

const MULTI_TARGET_SECTION_ATTRIBUTE = "data-paranormal-toolkit-multi-target-section";
const MULTI_TARGET_DAMAGE_INFO_ATTRIBUTE = "data-paranormal-toolkit-multi-target-damage-info";
const MULTI_TARGET_EFFECT_INFO_ATTRIBUTE = "data-paranormal-toolkit-multi-target-effect-info";
const MULTI_TARGET_TOGGLE_ATTRIBUTE = "data-paranormal-toolkit-multi-target-toggle";
const MULTI_TARGET_DETAILS_ATTRIBUTE = "data-paranormal-toolkit-multi-target-details";
const MULTI_TARGET_TARGET_ATTRIBUTE = "data-paranormal-toolkit-multi-target-target";
const MULTI_TARGET_STATE_ATTRIBUTE = "data-paranormal-toolkit-multi-target-state";
const MULTI_TARGET_ROLL_TOTAL_ATTRIBUTE = "data-paranormal-toolkit-multi-target-roll-total";
const MULTI_TARGET_ROLL_FORMULA_ATTRIBUTE = "data-paranormal-toolkit-multi-target-roll-formula";
const MULTI_TARGET_ROLL_DICE_ATTRIBUTE = "data-paranormal-toolkit-multi-target-roll-dice";
const MULTI_TARGET_ROLL_SKILL_ATTRIBUTE = "data-paranormal-toolkit-multi-target-roll-skill";
const MULTI_TARGET_ROLL_SKILL_LABEL_ATTRIBUTE = "data-paranormal-toolkit-multi-target-roll-skill-label";
const MULTI_TARGET_ROLL_TARGET_NAME_ATTRIBUTE = "data-paranormal-toolkit-multi-target-roll-target-name";
const MULTI_TARGET_ROLL_ROLLED_AT_ATTRIBUTE = "data-paranormal-toolkit-multi-target-roll-rolled-at";
const MULTI_TARGET_DAMAGE_MODE_ATTRIBUTE = "data-paranormal-toolkit-multi-target-damage-mode";
const MULTI_TARGET_DAMAGE_INPUT_AMOUNT_ATTRIBUTE = "data-paranormal-toolkit-multi-target-damage-input-amount";
const MULTI_TARGET_DAMAGE_FINAL_AMOUNT_ATTRIBUTE = "data-paranormal-toolkit-multi-target-damage-final-amount";
const MULTI_TARGET_DAMAGE_BLOCKED_ATTRIBUTE = "data-paranormal-toolkit-multi-target-damage-blocked";
const MULTI_TARGET_DAMAGE_TARGET_NAME_ATTRIBUTE = "data-paranormal-toolkit-multi-target-damage-target-name";
const MULTI_TARGET_DAMAGE_APPLIED_AT_ATTRIBUTE = "data-paranormal-toolkit-multi-target-damage-applied-at";
const MULTI_TARGET_EFFECT_CONDITION_ID_ATTRIBUTE = "data-paranormal-toolkit-multi-target-effect-condition-id";
const MULTI_TARGET_EFFECT_CONDITION_LABEL_ATTRIBUTE = "data-paranormal-toolkit-multi-target-effect-condition-label";
const MULTI_TARGET_EFFECT_EFFECT_ID_ATTRIBUTE = "data-paranormal-toolkit-multi-target-effect-effect-id";
const MULTI_TARGET_EFFECT_CREATED_ATTRIBUTE = "data-paranormal-toolkit-multi-target-effect-created";
const MULTI_TARGET_EFFECT_REFRESHED_ATTRIBUTE = "data-paranormal-toolkit-multi-target-effect-refreshed";
const MULTI_TARGET_EFFECT_TARGET_NAME_ATTRIBUTE = "data-paranormal-toolkit-multi-target-effect-target-name";
const MULTI_TARGET_EFFECT_APPLIED_AT_ATTRIBUTE = "data-paranormal-toolkit-multi-target-effect-applied-at";

const conditionEngine = new ConditionEngine(createToolkitConditionRegistry());
const damageEngine = new DamageEngine(new OrdemDamageAdapter());
const resistanceEngine = new ResistanceEngine(new OrdemResistanceAdapter());
const rollTargetResistanceUseCase = new RollTargetResistanceUseCase(resistanceEngine);
const applyTargetDamageUseCase = new ApplyTargetDamageUseCase(damageEngine);
const applyTargetEffectUseCase = new ApplyTargetEffectUseCase(conditionEngine);

const PENDING_STATE = MULTI_TARGET_PENDING_STATE;
const SUCCESS_STATE = MULTI_TARGET_SUCCESS_STATE;
const FAILURE_STATE = MULTI_TARGET_FAILURE_STATE;
const ROLLED_STATE = MULTI_TARGET_ROLLED_STATE;

export function enhanceMultiTargetCardLayout(input: MultiTargetCardLayoutInput): boolean {
  const viewModel = createMultiTargetCardViewModelFromLayout(input);
  if (!viewModel) return false;

  input.rollCard.classList.add(`${PROMPT_CLASS}__roll-card--multi-target`);
  hideSingleTargetSourceSections(input);

  const damageInfo = renderOptionalDamageInfoSection(input.rollCard, viewModel);
  const effectInfo = renderOptionalEffectInfoSection(input.rollCard, viewModel);

  if (!damageInfo && effectInfo) {
    placeEffectInfoSectionBeforeTargets(input.rollCard, effectInfo, input.effectSection);
  }

  const targetSection = getOrCreateTargetSection(input.rollCard);
  renderTargetSection(targetSection, viewModel);
  placeTargetSection(
    input.rollCard,
    targetSection,
    resolveTargetSectionAnchor(input.rollCard, {
      damageInfo,
      effectInfo,
      effectSection: input.effectSection,
    }),
  );

  if (damageInfo && effectInfo) {
    placeEffectInfoSection(input.rollCard, effectInfo, targetSection);
  }

  return true;
}

function createMultiTargetCardViewModelFromLayout(input: MultiTargetCardLayoutInput): MultiTargetCardViewModel | null {
  return createMultiTargetCardViewModel({
    ...input,
    resistanceResults: readMultiTargetResistanceResults(input.rollCard),
    damageApplications: readMultiTargetDamageApplications(input.rollCard),
    effectApplications: readMultiTargetEffectApplications(input.rollCard),
    resolveTargetConditionApplication,
    resistanceGateMode: getResistanceGateModeSafe()
  });
}

function resolveTargetConditionApplication(rollCard: HTMLElement, displayLabel: string | null): TargetConditionApplication | null {
  const context = readPersistedMultiTargetPromptContext(rollCard);
  const sourceItem = resolveMultiTargetSourceItem(context);
  if (!sourceItem) return null;

  const definition = readAutomationDefinition(sourceItem);
  if (!definition.ok) return null;

  const targetApplications = (definition.value.conditionApplications ?? [])
    .filter((application) => application.actor === "target");

  if (targetApplications.length === 0) return null;

  const application = selectTargetConditionApplication(targetApplications, displayLabel);
  if (!application) return null;

  return {
    conditionId: application.conditionId,
    conditionLabel: application.label ?? application.conditionId,
    duration: application.duration ?? null,
    source: application.source ?? "item-use.condition-action",
    originUuid: sourceItem.uuid ?? null
  };
}

function selectTargetConditionApplication(
  applications: AutomationConditionApplicationDefinition[],
  displayLabel: string | null
): AutomationConditionApplicationDefinition | null {
  if (applications.length === 1) return applications[0] ?? null;
  if (!displayLabel) return null;

  const normalizedDisplayLabel = normalizeLookupName(displayLabel);
  if (!normalizedDisplayLabel) return null;

  return applications.find((application) => {
    return [
      application.label,
      application.conditionId
    ].some((candidate) => normalizeLookupName(candidate) === normalizedDisplayLabel);
  }) ?? null;
}

function readMultiTargetResistanceResults(rollCard: HTMLElement): Map<string, MultiTargetResistanceResult> {
  const results = readPersistedMultiTargetResistanceResults(rollCard);

  for (const [targetId, result] of readRenderedMultiTargetResistanceResults(rollCard)) {
    results.set(targetId, result);
  }

  return results;
}

function readMultiTargetDamageApplications(rollCard: HTMLElement): Map<string, MultiTargetDamageApplication> {
  const applications = readPersistedMultiTargetDamageApplications(rollCard);

  for (const [targetId, application] of readRenderedMultiTargetDamageApplications(rollCard)) {
    applications.set(targetId, application);
  }

  return applications;
}

function readMultiTargetEffectApplications(rollCard: HTMLElement): Map<string, MultiTargetEffectApplication> {
  const applications = readPersistedMultiTargetEffectApplications(rollCard);

  for (const [targetId, application] of readRenderedMultiTargetEffectApplications(rollCard)) {
    applications.set(targetId, application);
  }

  return applications;
}

function readRenderedMultiTargetEffectApplications(rollCard: HTMLElement): Map<string, MultiTargetEffectApplication> {
  const applications = new Map<string, MultiTargetEffectApplication>();

  for (const row of rollCard.querySelectorAll<HTMLElement>(`[${MULTI_TARGET_TARGET_ATTRIBUTE}]`)) {
    const targetId = row.getAttribute(MULTI_TARGET_TARGET_ATTRIBUTE);
    const conditionId = row.getAttribute(MULTI_TARGET_EFFECT_CONDITION_ID_ATTRIBUTE);
    const conditionLabel = row.getAttribute(MULTI_TARGET_EFFECT_CONDITION_LABEL_ATTRIBUTE);
    const effectId = row.getAttribute(MULTI_TARGET_EFFECT_EFFECT_ID_ATTRIBUTE);
    const created = parseBoolean(row.getAttribute(MULTI_TARGET_EFFECT_CREATED_ATTRIBUTE));
    const refreshed = parseBoolean(row.getAttribute(MULTI_TARGET_EFFECT_REFRESHED_ATTRIBUTE));
    const targetName = row.getAttribute(MULTI_TARGET_EFFECT_TARGET_NAME_ATTRIBUTE);
    const appliedAt = row.getAttribute(MULTI_TARGET_EFFECT_APPLIED_AT_ATTRIBUTE);

    if (
      !targetId
      || !conditionId
      || !conditionLabel
      || created === null
      || refreshed === null
      || !targetName
      || !appliedAt
    ) {
      continue;
    }

    applications.set(targetId, {
      targetId,
      targetName,
      conditionId,
      conditionLabel,
      effectId: effectId && effectId.length > 0 ? effectId : null,
      created,
      refreshed,
      appliedAt
    });
  }

  return applications;
}

function readRenderedMultiTargetDamageApplications(rollCard: HTMLElement): Map<string, MultiTargetDamageApplication> {
  const applications = new Map<string, MultiTargetDamageApplication>();

  for (const row of rollCard.querySelectorAll<HTMLElement>(`[${MULTI_TARGET_TARGET_ATTRIBUTE}]`)) {
    const targetId = row.getAttribute(MULTI_TARGET_TARGET_ATTRIBUTE);
    const mode = row.getAttribute(MULTI_TARGET_DAMAGE_MODE_ATTRIBUTE);
    const inputAmount = parseInteger(row.getAttribute(MULTI_TARGET_DAMAGE_INPUT_AMOUNT_ATTRIBUTE));
    const targetName = row.getAttribute(MULTI_TARGET_DAMAGE_TARGET_NAME_ATTRIBUTE);
    const appliedAt = row.getAttribute(MULTI_TARGET_DAMAGE_APPLIED_AT_ATTRIBUTE);

    if (
      !targetId
      || !isDamageMode(mode)
      || inputAmount === null
      || !targetName
      || !appliedAt
    ) {
      continue;
    }

    applications.set(targetId, {
      targetId,
      targetName,
      mode,
      inputAmount,
      appliedAt
    });
  }

  return applications;
}

function readRenderedMultiTargetResistanceResults(rollCard: HTMLElement): Map<string, MultiTargetResistanceResult> {
  const results = new Map<string, MultiTargetResistanceResult>();

  for (const row of rollCard.querySelectorAll<HTMLElement>(`[${MULTI_TARGET_TARGET_ATTRIBUTE}]`)) {
    const targetId = row.getAttribute(MULTI_TARGET_TARGET_ATTRIBUTE);
    const total = parseInteger(row.getAttribute(MULTI_TARGET_ROLL_TOTAL_ATTRIBUTE));
    const formula = row.getAttribute(MULTI_TARGET_ROLL_FORMULA_ATTRIBUTE);
    const skill = row.getAttribute(MULTI_TARGET_ROLL_SKILL_ATTRIBUTE);
    const skillLabel = row.getAttribute(MULTI_TARGET_ROLL_SKILL_LABEL_ATTRIBUTE);
    const targetName = row.getAttribute(MULTI_TARGET_ROLL_TARGET_NAME_ATTRIBUTE);
    const rolledAt = row.getAttribute(MULTI_TARGET_ROLL_ROLLED_AT_ATTRIBUTE);

    if (!targetId || total === null || !formula || !skill || !skillLabel || !targetName || !rolledAt) continue;

    results.set(targetId, {
      targetId,
      targetName,
      skill,
      skillLabel,
      formula,
      total,
      diceBreakdown: row.getAttribute(MULTI_TARGET_ROLL_DICE_ATTRIBUTE),
      rolledAt
    });
  }

  return results;
}

function hideSingleTargetSourceSections(input: MultiTargetCardLayoutInput): void {
  input.damageSection?.classList.add(`${PROMPT_CLASS}__workflow-section--multi-target-source`);
  input.effectSection?.classList.add(`${PROMPT_CLASS}__workflow-section--multi-target-effect-source`);
}

function renderOptionalDamageInfoSection(
  rollCard: HTMLElement,
  viewModel: MultiTargetCardViewModel,
): HTMLElement | null {
  if (!viewModel.damage) {
    findDamageInfoSection(rollCard)?.remove();
    return null;
  }

  const damageInfo = getOrCreateDamageInfoSection(rollCard);
  renderDamageInfoSection(damageInfo, viewModel.damage);
  placeDamageInfoSection(rollCard, damageInfo);
  return damageInfo;
}

function renderOptionalEffectInfoSection(
  rollCard: HTMLElement,
  viewModel: MultiTargetCardViewModel,
): HTMLElement | null {
  if (!viewModel.effect) {
    findEffectInfoSection(rollCard)?.remove();
    return null;
  }

  const effectInfo = getOrCreateEffectInfoSection(rollCard);
  renderEffectInfoSection(effectInfo, viewModel.effect);
  return effectInfo;
}

type TargetSectionAnchorInput = {
  damageInfo: HTMLElement | null;
  effectInfo: HTMLElement | null;
  effectSection: HTMLElement | null;
};

function resolveTargetSectionAnchor(
  rollCard: HTMLElement,
  input: TargetSectionAnchorInput,
): HTMLElement | null {
  if (input.damageInfo?.parentElement === rollCard) return input.damageInfo;
  if (input.effectInfo?.parentElement === rollCard) return input.effectInfo;
  if (input.effectSection?.parentElement === rollCard) return input.effectSection;
  return findWorkflowSectionByTitle(rollCard, "Conjuração");
}

function getOrCreateDamageInfoSection(rollCard: HTMLElement): HTMLElement {
  const existing = findDamageInfoSection(rollCard);
  if (existing) return existing;

  const section = document.createElement("section");
  section.classList.add(
    `${PROMPT_CLASS}__workflow-section`,
    `${PROMPT_CLASS}__workflow-section--effect`,
    `${PROMPT_CLASS}__workflow-section--damage-info`
  );
  section.setAttribute(MULTI_TARGET_DAMAGE_INFO_ATTRIBUTE, "true");
  return section;
}

function findDamageInfoSection(rollCard: HTMLElement): HTMLElement | null {
  return rollCard.querySelector<HTMLElement>(`[${MULTI_TARGET_DAMAGE_INFO_ATTRIBUTE}="true"]`);
}

function renderDamageInfoSection(section: HTMLElement, damage: TargetDamageViewModel): void {
  section.replaceChildren();

  const header = document.createElement("div");
  header.classList.add(`${PROMPT_CLASS}__workflow-section-header`);

  const title = document.createElement("strong");
  title.textContent = "Dano";
  header.append(title);
  section.append(header);

  if (damage.typeLabel) {
    const description = document.createElement("span");
    description.classList.add(`${PROMPT_CLASS}__workflow-section-description`);
    description.textContent = damage.typeLabel;
    section.append(description);
  }

  section.append(createCompactWorkflowRollDisplay(damage.formula, damage.total, damage.diceBreakdown));
}

function createCompactWorkflowRollDisplay(
  formulaText: string,
  total: number | null,
  diceBreakdown: string | null,
  open = false
): HTMLElement {
  const roll = createWorkflowRollDisplay({
    formula: formulaText,
    total,
    diceBreakdown,
    classNames: [`${PROMPT_CLASS}__workflow-roll--compact-info`]
  });

  prepareWorkflowRollToggle(roll, open);
  return roll;
}

function prepareWorkflowRollToggle(roll: HTMLElement, open: boolean): void {
  const diceTray = roll.querySelector<HTMLElement>(WORKFLOW_DICE_TRAY_SELECTOR);
  const formula = roll.querySelector<HTMLElement>(WORKFLOW_FORMULA_SELECTOR);
  if (!diceTray || !formula) return;

  roll.classList.toggle(WORKFLOW_ROLL_DICE_OPEN_CLASS, open);
  diceTray.hidden = !open;

  formula.classList.add(WORKFLOW_FORMULA_TOGGLE_CLASS);
  formula.setAttribute("role", "button");
  formula.setAttribute("tabindex", "0");
  formula.setAttribute("aria-expanded", open ? "true" : "false");
  formula.title = open ? "Ocultar dados da rolagem" : "Mostrar dados da rolagem";
  formula.setAttribute("aria-label", formula.title);

  const icon = formula.querySelector("i") ?? document.createElement("i");
  icon.classList.add("fa-solid");
  icon.classList.toggle("fa-chevron-down", !open);
  icon.classList.toggle("fa-chevron-up", open);
  icon.setAttribute("aria-hidden", "true");

  if (!icon.parentElement) formula.append(icon);
}

function placeDamageInfoSection(rollCard: HTMLElement, section: HTMLElement): void {
  const castingSection = findWorkflowSectionByTitle(rollCard, "Conjuração");

  if (!castingSection) {
    rollCard.prepend(section);
    return;
  }

  if (section.parentElement === rollCard && section.previousElementSibling === castingSection) return;
  rollCard.insertBefore(section, castingSection.nextElementSibling);
}

function getOrCreateTargetSection(rollCard: HTMLElement): HTMLElement {
  const existing = rollCard.querySelector<HTMLElement>(`[${MULTI_TARGET_SECTION_ATTRIBUTE}="true"]`);
  if (existing) return existing;

  const section = document.createElement("section");
  section.classList.add(
    `${PROMPT_CLASS}__workflow-section`,
    `${PROMPT_CLASS}__workflow-section--targets`
  );
  section.setAttribute(MULTI_TARGET_SECTION_ATTRIBUTE, "true");
  return section;
}

function renderTargetSection(section: HTMLElement, viewModel: MultiTargetCardViewModel): void {
  const expandedTargets = readExpandedTargets(section);
  section.replaceChildren(createTargetSectionHeader(viewModel), createTargetList(viewModel, expandedTargets));
}

function readExpandedTargets(section: HTMLElement): Set<string> {
  return new Set(
    Array.from(section.querySelectorAll<HTMLElement>(`[${MULTI_TARGET_TARGET_ATTRIBUTE}]`))
      .filter((row) => row.getAttribute("aria-expanded") === "true")
      .map((row) => row.getAttribute(MULTI_TARGET_TARGET_ATTRIBUTE))
      .filter(isNonEmptyString)
  );
}

function createTargetSectionHeader(viewModel: MultiTargetCardViewModel): HTMLElement {
  const header = document.createElement("div");
  header.classList.add(`${PROMPT_CLASS}__workflow-section-header`, `${PROMPT_CLASS}__targets-header`);

  const title = document.createElement("strong");
  title.textContent = "Alvos";

  const status = document.createElement("span");
  status.classList.add(`${PROMPT_CLASS}__targets-status`);
  status.textContent = createTargetStatusLabel(viewModel.targets);

  header.append(title, status);
  return header;
}

function createTargetStatusLabel(targets: MultiTargetViewModel[]): string {
  const total = targets.length;
  const failures = targets.filter((target) => target.state === FAILURE_STATE).length;
  const successes = targets.filter((target) => target.state === SUCCESS_STATE).length;
  const pending = targets.filter((target) => target.state === PENDING_STATE).length;
  const rolled = targets.filter((target) => target.state === ROLLED_STATE).length;
  const parts = [`${total} ${total === 1 ? "alvo" : "alvos"}`];

  if (failures > 0) parts.push(`${failures} ${failures === 1 ? "falha" : "falhas"}`);
  if (successes > 0) parts.push(`${successes} ${successes === 1 ? "sucesso" : "sucessos"}`);
  if (pending > 0) parts.push(`${pending} ${pending === 1 ? "pendente" : "pendentes"}`);
  if (rolled > 0) parts.push(`${rolled} ${rolled === 1 ? "rolado" : "rolados"}`);

  return parts.join(" • ");
}

function createTargetList(viewModel: MultiTargetCardViewModel, expandedTargets: Set<string>): HTMLElement {
  const list = document.createElement("div");
  list.classList.add(`${PROMPT_CLASS}__targets-list`);

  for (const target of viewModel.targets) {
    list.append(createTargetRow(target, viewModel, expandedTargets.has(target.id)));
  }

  return list;
}

function createTargetRow(target: MultiTargetViewModel, viewModel: MultiTargetCardViewModel, expanded: boolean): HTMLElement {
  const row = document.createElement("article");
  row.classList.add(`${PROMPT_CLASS}__target-row`, `${PROMPT_CLASS}__target-row--${target.state}`);
  if (target.damageApplication) {
    row.classList.add(`${PROMPT_CLASS}__target-row--damage-applied`);
  }
  if (target.effectApplication) {
    row.classList.add(`${PROMPT_CLASS}__target-row--effect-applied`);
  }
  row.setAttribute(MULTI_TARGET_TARGET_ATTRIBUTE, target.id);
  row.setAttribute(MULTI_TARGET_STATE_ATTRIBUTE, target.state);
  row.setAttribute("aria-expanded", expanded ? "true" : "false");
  row.setAttribute("role", "button");
  row.setAttribute("tabindex", "0");
  row.setAttribute("aria-label", `${expanded ? "Fechar" : "Abrir"} detalhes de ${target.name}`);
  setTargetResistanceResultAttributes(row, target.resistanceResult);
  setTargetDamageApplicationAttributes(row, target.damageApplication);
  setTargetEffectApplicationAttributes(row, target.effectApplication);

  const summary = createTargetSummary(target, viewModel, row);
  const details = createTargetDetails(target, viewModel);
  details.hidden = !expanded;

  row.addEventListener("click", (event) => {
    if (isInteractiveTarget(event.target)) return;
    toggleTargetRow(row);
  });

  row.addEventListener("keydown", (event) => {
    if (event.key !== "Enter" && event.key !== " ") return;
    if (isInteractiveTarget(event.target)) return;

    event.preventDefault();
    toggleTargetRow(row);
  });

  row.append(summary, details);
  return row;
}

function setTargetResistanceResultAttributes(row: HTMLElement, result: MultiTargetResistanceResult | null): void {
  if (!result) {
    row.removeAttribute(MULTI_TARGET_ROLL_TOTAL_ATTRIBUTE);
    row.removeAttribute(MULTI_TARGET_ROLL_FORMULA_ATTRIBUTE);
    row.removeAttribute(MULTI_TARGET_ROLL_DICE_ATTRIBUTE);
    row.removeAttribute(MULTI_TARGET_ROLL_SKILL_ATTRIBUTE);
    row.removeAttribute(MULTI_TARGET_ROLL_SKILL_LABEL_ATTRIBUTE);
    row.removeAttribute(MULTI_TARGET_ROLL_TARGET_NAME_ATTRIBUTE);
    row.removeAttribute(MULTI_TARGET_ROLL_ROLLED_AT_ATTRIBUTE);
    return;
  }

  row.setAttribute(MULTI_TARGET_ROLL_TOTAL_ATTRIBUTE, String(result.total));
  row.setAttribute(MULTI_TARGET_ROLL_FORMULA_ATTRIBUTE, result.formula);
  row.setAttribute(MULTI_TARGET_ROLL_SKILL_ATTRIBUTE, result.skill);
  row.setAttribute(MULTI_TARGET_ROLL_SKILL_LABEL_ATTRIBUTE, result.skillLabel);
  row.setAttribute(MULTI_TARGET_ROLL_TARGET_NAME_ATTRIBUTE, result.targetName);
  row.setAttribute(MULTI_TARGET_ROLL_ROLLED_AT_ATTRIBUTE, result.rolledAt);

  if (result.diceBreakdown) {
    row.setAttribute(MULTI_TARGET_ROLL_DICE_ATTRIBUTE, result.diceBreakdown);
  } else {
    row.removeAttribute(MULTI_TARGET_ROLL_DICE_ATTRIBUTE);
  }
}

function setTargetDamageApplicationAttributes(row: HTMLElement, application: MultiTargetDamageApplication | null): void {
  if (!application) {
    row.removeAttribute(MULTI_TARGET_DAMAGE_MODE_ATTRIBUTE);
    row.removeAttribute(MULTI_TARGET_DAMAGE_INPUT_AMOUNT_ATTRIBUTE);
    row.removeAttribute(MULTI_TARGET_DAMAGE_FINAL_AMOUNT_ATTRIBUTE);
    row.removeAttribute(MULTI_TARGET_DAMAGE_BLOCKED_ATTRIBUTE);
    row.removeAttribute(MULTI_TARGET_DAMAGE_TARGET_NAME_ATTRIBUTE);
    row.removeAttribute(MULTI_TARGET_DAMAGE_APPLIED_AT_ATTRIBUTE);
    return;
  }

  row.setAttribute(MULTI_TARGET_DAMAGE_MODE_ATTRIBUTE, application.mode);
  row.setAttribute(MULTI_TARGET_DAMAGE_INPUT_AMOUNT_ATTRIBUTE, String(application.inputAmount));
  row.removeAttribute(MULTI_TARGET_DAMAGE_FINAL_AMOUNT_ATTRIBUTE);
  row.removeAttribute(MULTI_TARGET_DAMAGE_BLOCKED_ATTRIBUTE);
  row.setAttribute(MULTI_TARGET_DAMAGE_TARGET_NAME_ATTRIBUTE, application.targetName);
  row.setAttribute(MULTI_TARGET_DAMAGE_APPLIED_AT_ATTRIBUTE, application.appliedAt);
}

function setTargetEffectApplicationAttributes(row: HTMLElement, application: MultiTargetEffectApplication | null): void {
  if (!application) {
    row.removeAttribute(MULTI_TARGET_EFFECT_CONDITION_ID_ATTRIBUTE);
    row.removeAttribute(MULTI_TARGET_EFFECT_CONDITION_LABEL_ATTRIBUTE);
    row.removeAttribute(MULTI_TARGET_EFFECT_EFFECT_ID_ATTRIBUTE);
    row.removeAttribute(MULTI_TARGET_EFFECT_CREATED_ATTRIBUTE);
    row.removeAttribute(MULTI_TARGET_EFFECT_REFRESHED_ATTRIBUTE);
    row.removeAttribute(MULTI_TARGET_EFFECT_TARGET_NAME_ATTRIBUTE);
    row.removeAttribute(MULTI_TARGET_EFFECT_APPLIED_AT_ATTRIBUTE);
    return;
  }

  row.setAttribute(MULTI_TARGET_EFFECT_CONDITION_ID_ATTRIBUTE, application.conditionId);
  row.setAttribute(MULTI_TARGET_EFFECT_CONDITION_LABEL_ATTRIBUTE, application.conditionLabel);
  row.setAttribute(MULTI_TARGET_EFFECT_EFFECT_ID_ATTRIBUTE, application.effectId ?? "");
  row.setAttribute(MULTI_TARGET_EFFECT_CREATED_ATTRIBUTE, String(application.created));
  row.setAttribute(MULTI_TARGET_EFFECT_REFRESHED_ATTRIBUTE, String(application.refreshed));
  row.setAttribute(MULTI_TARGET_EFFECT_TARGET_NAME_ATTRIBUTE, application.targetName);
  row.setAttribute(MULTI_TARGET_EFFECT_APPLIED_AT_ATTRIBUTE, application.appliedAt);
}

function createTargetSummary(target: MultiTargetViewModel, viewModel: MultiTargetCardViewModel, row: HTMLElement): HTMLElement {
  const summary = document.createElement("div");
  summary.classList.add(`${PROMPT_CLASS}__target-summary`);

  const main = document.createElement("div");
  main.classList.add(`${PROMPT_CLASS}__target-summary-main`);

  const avatar = createTargetAvatar(target);

  const name = document.createElement("strong");
  name.classList.add(`${PROMPT_CLASS}__target-name`);
  name.textContent = target.name;

  const resistance = createResistanceButton(target, viewModel.resistance);
  bindTargetResistanceButton(resistance, row, target, viewModel);
  const toggle = createTargetToggleIndicator(row);

  main.append(avatar, name, resistance, toggle);

  const actions = document.createElement("div");
  actions.classList.add(`${PROMPT_CLASS}__target-summary-actions`);
  appendVisibleTargetActions(actions, [
    createTargetDamageActionButton(target, viewModel, "compact"),
    createTargetEffectActionButton(target, viewModel, "compact")
  ]);

  summary.append(main, actions);
  return summary;
}

function createTargetAvatar(target: MultiTargetViewModel): HTMLElement {
  const avatar = document.createElement("span");
  avatar.classList.add(`${PROMPT_CLASS}__target-avatar`);
  avatar.setAttribute("aria-hidden", "true");
  avatar.textContent = target.name.trim().charAt(0).toLocaleUpperCase() || "?";
  return avatar;
}

function createResistanceButton(target: MultiTargetViewModel, resistance: TargetResistanceViewModel | null): HTMLElement {
  if (!canCurrentUserControlAssistedActions()) {
    return createResistanceStatusDisplay(target, resistance);
  }

  const button = document.createElement("button");
  button.type = "button";
  button.classList.add(`${PROMPT_CLASS}__target-resistance-button`, `${PROMPT_CLASS}__target-resistance-button--${target.state}`);
  button.setAttribute("aria-label", createResistanceButtonAriaLabel(target, resistance));

  if (resistance?.skill) {
    button.setAttribute(RESISTANCE_SKILL_ATTRIBUTE, resistance.skill);
    button.setAttribute(RESISTANCE_SKILL_LABEL_ATTRIBUTE, resistance.skillLabel ?? getResistanceSkillLabel(resistance.skill));
  }

  if (!resistance?.skill) {
    button.disabled = true;
    button.title = "Resistência não configurada";
    button.textContent = "—";
    return button;
  }

  button.title = target.resistanceResult
    ? `Rolar ${resistance.skillLabel ?? resistance.skill} novamente`
    : `Rolar ${resistance.skillLabel ?? resistance.skill} de ${target.name}`;

  if (!target.resistanceResult) {
    const icon = document.createElement("i");
    icon.classList.add("fa-solid", "fa-dice-d20");
    icon.setAttribute("aria-hidden", "true");

    const fallback = document.createElement("span");
    fallback.classList.add(`${PROMPT_CLASS}__target-resistance-fallback`);
    fallback.textContent = "d20";

    button.append(icon, fallback);
    return button;
  }

  const total = document.createElement("span");
  total.classList.add(`${PROMPT_CLASS}__target-resistance-total`);
  total.textContent = String(target.resistanceResult.total);

  const mark = document.createElement("span");
  mark.classList.add(`${PROMPT_CLASS}__target-resistance-mark`);
  mark.setAttribute("aria-hidden", "true");
  mark.textContent = target.state === SUCCESS_STATE ? "✓" : target.state === FAILURE_STATE ? "✕" : "";

  button.append(total, mark);
  return button;
}

function createResistanceStatusDisplay(target: MultiTargetViewModel, resistance: TargetResistanceViewModel | null): HTMLElement {
  const status = document.createElement("span");
  status.classList.add(`${PROMPT_CLASS}__target-resistance-button`, `${PROMPT_CLASS}__target-resistance-button--${target.state}`);
  status.setAttribute("aria-label", createResistanceStatusAriaLabel(target, resistance));

  if (!target.resistanceResult) {
    status.textContent = "—";
    return status;
  }

  const total = document.createElement("span");
  total.classList.add(`${PROMPT_CLASS}__target-resistance-total`);
  total.textContent = String(target.resistanceResult.total);

  const mark = document.createElement("span");
  mark.classList.add(`${PROMPT_CLASS}__target-resistance-mark`);
  mark.setAttribute("aria-hidden", "true");
  mark.textContent = target.state === SUCCESS_STATE ? "✓" : target.state === FAILURE_STATE ? "✕" : "";

  status.append(total, mark);
  return status;
}

function createResistanceStatusAriaLabel(target: MultiTargetViewModel, resistance: TargetResistanceViewModel | null): string {
  const skillLabel = resistance?.skillLabel ?? resistance?.skill ?? "resistência";

  if (!target.resistanceResult) return `${skillLabel} de ${target.name}: pendente.`;

  const outcome = target.state === SUCCESS_STATE ? "sucesso" : target.state === FAILURE_STATE ? "falha" : "resultado";
  return `${skillLabel} de ${target.name}: ${target.resistanceResult.total}, ${outcome}.`;
}

function createResistanceButtonAriaLabel(target: MultiTargetViewModel, resistance: TargetResistanceViewModel | null): string {
  const skillLabel = resistance?.skillLabel ?? resistance?.skill ?? "resistência";

  if (!target.resistanceResult) return `Rolar ${skillLabel} de ${target.name}`;

  const outcome = target.state === SUCCESS_STATE ? "sucesso" : target.state === FAILURE_STATE ? "falha" : "resultado";
  return `${skillLabel} de ${target.name}: ${target.resistanceResult.total}, ${outcome}. Rolar novamente`;
}

function bindTargetResistanceButton(
  button: HTMLElement,
  row: HTMLElement,
  target: MultiTargetViewModel,
  viewModel: MultiTargetCardViewModel
): void {
  if (!(button instanceof HTMLButtonElement) || !canCurrentUserControlAssistedActions()) return;

  button.addEventListener("click", (event) => {
    event.stopPropagation();
    void handleTargetResistanceRoll(row, button, target, viewModel);
  });
}

async function handleTargetResistanceRoll(
  row: HTMLElement,
  button: HTMLButtonElement,
  target: MultiTargetViewModel,
  viewModel: MultiTargetCardViewModel
): Promise<void> {
  if (!canCurrentUserControlAssistedActions()) {
    ui.notifications?.warn?.("Paranormal Toolkit: apenas o Mestre pode rolar resistência assistida.");
    return;
  }

  const resistance = viewModel.resistance;
  const skill = resistance?.skill;
  const skillLabel = resistance?.skillLabel ?? (skill ? getResistanceSkillLabel(skill) : "Resistência");

  if (!skill) {
    ui.notifications?.warn?.("Paranormal Toolkit: este card não tem perícia de resistência configurada.");
    return;
  }

  const actor = resolveMultiTargetActorByName(target.name);
  if (!actor) {
    ui.notifications?.warn?.(`Paranormal Toolkit: não consegui encontrar o alvo ${target.name} para rolar resistência.`);
    return;
  }

  button.disabled = true;
  button.classList.add(`${PROMPT_CLASS}__target-resistance-button--rolling`);
  const originalContent = button.innerHTML;
  button.textContent = "...";

  try {
    const resistanceRoll = await rollTargetResistanceUseCase.execute({ actor, skill, skillLabel });
    await showDiceAnimationIfAvailable(resistanceRoll.roll);

    const result: MultiTargetResistanceResult = {
      targetId: target.id,
      targetName: actor.name ?? target.name,
      skill,
      skillLabel,
      formula: resistanceRoll.formula,
      total: resistanceRoll.total,
      diceBreakdown: resistanceRoll.diceBreakdown,
      rolledAt: new Date().toISOString()
    };

    setTargetResistanceResultAttributes(row, result);

    try {
      await persistMultiTargetResistanceResult(viewModel.rollCard, result);
    } catch (cause) {
      console.warn("Paranormal Toolkit: não foi possível persistir resistência multi-target.", cause);
    }

    refreshTargetSection(row);
  } catch (cause) {
    console.warn("Paranormal Toolkit: não foi possível rolar resistência multi-target.", cause);
    ui.notifications?.warn?.(`Paranormal Toolkit: não foi possível rolar ${skillLabel} de ${target.name}.`);
    button.innerHTML = originalContent;
  } finally {
    button.disabled = false;
    button.classList.remove(`${PROMPT_CLASS}__target-resistance-button--rolling`);
  }
}

function refreshTargetSection(row: HTMLElement): void {
  const targetSection = row.closest<HTMLElement>(`[${MULTI_TARGET_SECTION_ATTRIBUTE}="true"]`);
  const rollCard = row.closest<HTMLElement>(`.${PROMPT_CLASS}__roll-card`);
  if (!targetSection || !rollCard) return;

  const viewModel = createMultiTargetCardViewModelFromLayout({
    rollCard,
    damageSection: findMultiTargetDamageSourceSection(rollCard) ?? findWorkflowSectionByTitle(rollCard, "Dano"),
    effectSection: findMultiTargetEffectSourceSection(rollCard)
  });

  if (!viewModel) return;
  renderTargetSection(targetSection, viewModel);
}

function findMultiTargetDamageSourceSection(rollCard: HTMLElement): HTMLElement | null {
  return Array.from(rollCard.querySelectorAll<HTMLElement>(`.${PROMPT_CLASS}__workflow-section--multi-target-source`))
    .find((section) => section.getAttribute(MULTI_TARGET_DAMAGE_INFO_ATTRIBUTE) !== "true")
    ?? null;
}

function findMultiTargetEffectSourceSection(rollCard: HTMLElement): HTMLElement | null {
  return rollCard.querySelector<HTMLElement>(`.${PROMPT_CLASS}__workflow-section--multi-target-effect-source`);
}

function shouldBlockTargetActionsByResistance(target: MultiTargetViewModel, viewModel: MultiTargetCardViewModel): boolean {
  void viewModel;
  return isActionWaitingForResistance(target.assistedActions.policy.damageActionState);
}

function getResistanceGateModeSafe(): ItemUseResistanceGateMode {
  try {
    return getItemUseResistanceGateMode();
  } catch {
    return "strict";
  }
}

function createTargetDamageActionButton(
  target: MultiTargetViewModel,
  viewModel: MultiTargetCardViewModel,
  density: "compact" | "full"
): HTMLElement | null {
  if (target.damageApplication) {
    return createTargetActionButton(
      "✓",
      createPublicDamageAppliedLabel({ inputAmount: target.damageApplication.inputAmount, mode: target.damageApplication.mode }),
      [`${PROMPT_CLASS}__target-action--damage`, `${PROMPT_CLASS}__target-action--applied`],
      true
    );
  }

  const actionState = target.assistedActions.policy.damageActionState;

  if (!target.assistedActions.policy.canShowApplyDamage) {
    return null;
  }

  if (isActionWaitingForResistance(actionState)) {
    return createTargetActionButton(
      "◇",
      density === "full" ? actionState.label : actionState.compactLabel,
      [`${PROMPT_CLASS}__target-action--damage`, `${PROMPT_CLASS}__target-action--waiting-damage`],
      true
    );
  }

  const mode = target.assistedActions.policy.damageMode ?? "normal";
  if (!viewModel.damage) return null;

  const amount = getTargetDamageAmount(mode, viewModel.damage);
  if (amount === null) {
    return createTargetActionButton(
      "⚡",
      "Dano indisponível",
      [`${PROMPT_CLASS}__target-action--damage`, `${PROMPT_CLASS}__target-action--disabled`],
      true
    );
  }

  const label = createPublicDamageActionLabel({ inputAmount: amount, mode, compact: density === "compact" });
  const icon = mode === "half" ? "🛡️" : "⚡";
  const stateClass = mode === "half" ? `${PROMPT_CLASS}__target-action--half-damage` : `${PROMPT_CLASS}__target-action--normal-damage`;
  const button = createTargetActionButton(
    icon,
    label,
    [`${PROMPT_CLASS}__target-action--damage`, stateClass],
    false
  );

  button.title = `Aplicar ${label} em ${target.name}`;
  button.setAttribute("aria-label", button.title);
  button.addEventListener("click", (event) => {
    event.stopPropagation();

    const row = button.closest<HTMLElement>(`[${MULTI_TARGET_TARGET_ATTRIBUTE}]`);
    if (!row) return;

    void handleTargetDamageApplication(row, button, target, viewModel);
  });

  return button;
}

function getTargetDamageAmount(mode: MultiTargetDamageMode, damage: TargetDamageViewModel): number | null {
  return mode === "half" ? damage.halfAmount : damage.normalAmount;
}

async function handleTargetDamageApplication(
  row: HTMLElement,
  button: HTMLButtonElement,
  target: MultiTargetViewModel,
  viewModel: MultiTargetCardViewModel
): Promise<void> {
  if (target.damageApplication) return;

  if (shouldBlockTargetActionsByResistance(target, viewModel)) {
    ui.notifications?.warn?.("Paranormal Toolkit: role a resistência do alvo antes de aplicar dano.");
    return;
  }

  const damage = viewModel.damage;
  if (!damage) {
    ui.notifications?.warn?.("Paranormal Toolkit: este card não possui dano estruturado para aplicar.");
    return;
  }

  const mode = target.assistedActions.policy.damageMode ?? "normal";
  const amount = getTargetDamageAmount(mode, damage);

  if (amount === null) {
    ui.notifications?.warn?.("Paranormal Toolkit: não consegui resolver o dano deste card.");
    return;
  }

  const actor = resolveMultiTargetActorByName(target.name);
  if (!actor) {
    ui.notifications?.warn?.(`Paranormal Toolkit: não consegui encontrar o alvo ${target.name} para aplicar dano.`);
    return;
  }

  button.disabled = true;
  button.classList.add(`${PROMPT_CLASS}__target-action--applying`);
  const originalContent = button.innerHTML;
  button.textContent = "Aplicando...";

  try {
    const result = await applyTargetDamageUseCase.execute({
      actor,
      amount,
      damageType: damage.typeLabel,
      label: mode === "half" ? "Metade" : "Dano normal",
      sourceRollId: "damage",
      source: "item-use.multi-target-damage",
      originUuid: null,
      resistanceGateMode: getResistanceGateModeSafe(),
      resistanceState: target.assistedActions.resistanceState
    });

    if (!result.ok) {
      ui.notifications?.warn?.(`Paranormal Toolkit: ${result.error.message}`);
      button.innerHTML = originalContent;
      return;
    }

    const application: MultiTargetDamageApplication = {
      targetId: target.id,
      targetName: actor.name ?? target.name,
      mode,
      inputAmount: amount,
      appliedAt: new Date().toISOString()
    };

    setTargetDamageApplicationAttributes(row, application);

    try {
      await persistMultiTargetDamageApplication(viewModel.rollCard, application);
    } catch (cause) {
      console.warn("Paranormal Toolkit: não foi possível persistir dano multi-target.", cause);
    }

    try {
      await createMultiTargetDamageFeedbackMessage(result.value);
    } catch (cause) {
      console.warn("Paranormal Toolkit: não foi possível criar mensagem privada de dano multi-target.", cause);
    }

    refreshTargetSection(row);
  } catch (cause) {
    console.warn("Paranormal Toolkit: não foi possível aplicar dano multi-target.", cause);
    ui.notifications?.warn?.(`Paranormal Toolkit: não foi possível aplicar dano em ${target.name}.`);
    button.innerHTML = originalContent;
  } finally {
    button.disabled = false;
    button.classList.remove(`${PROMPT_CLASS}__target-action--applying`);
  }
}

function createTargetEffectActionButton(
  target: MultiTargetViewModel,
  viewModel: MultiTargetCardViewModel,
  density: "compact" | "full"
): HTMLElement | null {
  const actionState = target.assistedActions.policy.effectActionState;

  if (!viewModel.effect) {
    return createTargetActionButton(
      "✦",
      density === "full" ? actionState.label : actionState.compactLabel,
      [`${PROMPT_CLASS}__target-action--effect`, `${PROMPT_CLASS}__target-action--disabled`],
      true
    );
  }

  if (target.effectApplication) {
    return createTargetActionButton(
      "✓",
      density === "full" ? `${target.effectApplication.conditionLabel} aplicado` : actionState.compactLabel,
      [`${PROMPT_CLASS}__target-action--effect`, `${PROMPT_CLASS}__target-action--effect-applied`],
      true
    );
  }

  if (isActionWaitingForResistance(actionState)) {
    return createTargetActionButton(
      "◇",
      density === "full" ? actionState.label : actionState.compactLabel,
      [`${PROMPT_CLASS}__target-action--effect`, `${PROMPT_CLASS}__target-action--waiting-effect`],
      true
    );
  }

  if (isActionResisted(actionState)) {
    return createTargetActionButton(
      "✓",
      density === "full" ? actionState.label : actionState.compactLabel,
      [`${PROMPT_CLASS}__target-action--effect`, `${PROMPT_CLASS}__target-action--resisted`],
      true
    );
  }

  if (!target.assistedActions.policy.canShowApplyEffect) {
    return null;
  }

  const button = createTargetActionButton(
    "✦",
    density === "full" ? `Aplicar ${viewModel.effect.conditionLabel}` : "Efeito",
    [`${PROMPT_CLASS}__target-action--effect`, `${PROMPT_CLASS}__target-action--pending-effect`],
    false
  );

  button.title = `Aplicar ${viewModel.effect.conditionLabel} em ${target.name}`;
  button.setAttribute("aria-label", button.title);
  button.addEventListener("click", (event) => {
    event.stopPropagation();

    const row = button.closest<HTMLElement>(`[${MULTI_TARGET_TARGET_ATTRIBUTE}]`);
    if (!row) return;

    void handleTargetEffectApplication(row, button, target, viewModel);
  });

  return button;
}

async function handleTargetEffectApplication(
  row: HTMLElement,
  button: HTMLButtonElement,
  target: MultiTargetViewModel,
  viewModel: MultiTargetCardViewModel
): Promise<void> {
  if (target.effectApplication) return;

  if (shouldBlockTargetActionsByResistance(target, viewModel)) {
    ui.notifications?.warn?.("Paranormal Toolkit: role a resistência do alvo antes de aplicar efeito.");
    return;
  }

  if (target.assistedActions.policy.effectMode === "resisted") {
    ui.notifications?.warn?.("Paranormal Toolkit: este alvo resistiu ao efeito.");
    return;
  }

  const effect = viewModel.effect;
  if (!effect) {
    ui.notifications?.warn?.("Paranormal Toolkit: este card não possui efeito estruturado para aplicar.");
    return;
  }

  const actor = resolveMultiTargetActorByName(target.name);
  if (!actor) {
    ui.notifications?.warn?.(`Paranormal Toolkit: não consegui encontrar o alvo ${target.name} para aplicar efeito.`);
    return;
  }

  button.disabled = true;
  button.classList.add(`${PROMPT_CLASS}__target-action--applying`);
  const originalContent = button.innerHTML;
  button.textContent = "Aplicando...";

  try {
    const result = await applyTargetEffectUseCase.execute({
      actor,
      conditionId: effect.conditionId,
      duration: effect.duration,
      originUuid: effect.originUuid,
      source: effect.source,
      resistanceGateMode: getResistanceGateModeSafe(),
      resistanceState: target.assistedActions.resistanceState
    });

    if (!result.ok) {
      ui.notifications?.warn?.(`Paranormal Toolkit: ${result.error.message}`);
      button.innerHTML = originalContent;
      return;
    }

    const application: MultiTargetEffectApplication = {
      targetId: target.id,
      targetName: result.value.actorName,
      conditionId: result.value.conditionId,
      conditionLabel: result.value.conditionLabel,
      effectId: result.value.effectId,
      created: result.value.created,
      refreshed: result.value.refreshed,
      appliedAt: new Date().toISOString()
    };

    setTargetEffectApplicationAttributes(row, application);

    try {
      await persistMultiTargetEffectApplication(viewModel.rollCard, application);
    } catch (cause) {
      console.warn("Paranormal Toolkit: não foi possível persistir efeito multi-target.", cause);
    }

    if (result.value.warning) {
      ui.notifications?.warn?.(`Paranormal Toolkit: ${result.value.warning}`);
    }

    refreshTargetSection(row);
  } catch (cause) {
    console.warn("Paranormal Toolkit: não foi possível aplicar efeito multi-target.", cause);
    ui.notifications?.warn?.(`Paranormal Toolkit: não foi possível aplicar efeito em ${target.name}.`);
    button.innerHTML = originalContent;
  } finally {
    button.disabled = false;
    button.classList.remove(`${PROMPT_CLASS}__target-action--applying`);
  }
}

function appendVisibleTargetActions(container: HTMLElement, actions: Array<HTMLElement | null>): void {
  for (const action of actions) {
    if (action) container.append(action);
  }
}

function createTargetActionButton(
  iconText: string,
  labelText: string,
  stateClasses: string[],
  disabled: boolean
): HTMLButtonElement {
  const button = document.createElement("button");
  button.type = "button";
  button.classList.add(`${PROMPT_CLASS}__target-action`, `${PROMPT_CLASS}__target-action--pending`, ...stateClasses);
  button.disabled = disabled;

  const icon = document.createElement("span");
  icon.classList.add(`${PROMPT_CLASS}__target-action-icon`);
  icon.setAttribute("aria-hidden", "true");
  icon.textContent = iconText;

  const label = document.createElement("span");
  label.classList.add(`${PROMPT_CLASS}__target-action-label`);
  label.textContent = labelText;

  button.append(icon, label);
  return button;
}

function createTargetToggleIndicator(row: HTMLElement): HTMLElement {
  const indicator = document.createElement("span");
  indicator.classList.add(`${PROMPT_CLASS}__target-toggle`);
  indicator.setAttribute(MULTI_TARGET_TOGGLE_ATTRIBUTE, "true");
  indicator.setAttribute("aria-hidden", "true");
  updateToggleIcon(row, indicator);
  return indicator;
}

function toggleTargetRow(row: HTMLElement): void {
  const details = row.querySelector<HTMLElement>(`[${MULTI_TARGET_DETAILS_ATTRIBUTE}="true"]`);
  if (!details) return;

  const willExpand = details.hidden;
  details.hidden = !willExpand;
  row.setAttribute("aria-expanded", willExpand ? "true" : "false");
  row.setAttribute("aria-label", `${willExpand ? "Fechar" : "Abrir"} detalhes do alvo`);

  const indicator = row.querySelector<HTMLElement>(`[${MULTI_TARGET_TOGGLE_ATTRIBUTE}="true"]`);
  if (indicator) updateToggleIcon(row, indicator);
}

function updateToggleIcon(row: HTMLElement, indicator: HTMLElement): void {
  const expanded = row.getAttribute("aria-expanded") === "true";
  indicator.textContent = expanded ? "⌃" : "⌄";
}

function isInteractiveTarget(target: EventTarget | null): boolean {
  if (!(target instanceof HTMLElement)) return false;

  return Boolean(
    target.closest([
      "button",
      "a",
      "input",
      "select",
      "textarea",
      `.${PROMPT_CLASS}__workflow-roll`,
      `.${PROMPT_CLASS}__workflow-roll-formula`,
      `.${PROMPT_CLASS}__workflow-dice-tray`
    ].join(", "))
  );
}

function createTargetDetails(target: MultiTargetViewModel, viewModel: MultiTargetCardViewModel): HTMLElement {
  const details = document.createElement("div");
  details.classList.add(`${PROMPT_CLASS}__target-details`);
  details.setAttribute(MULTI_TARGET_DETAILS_ATTRIBUTE, "true");

  const resistance = document.createElement("div");
  resistance.classList.add(`${PROMPT_CLASS}__target-resistance-details`);

  const title = document.createElement("strong");
  title.textContent = "Resistência";

  const description = document.createElement("span");
  description.textContent = viewModel.resistance?.description ?? "Resistência pendente.";

  resistance.append(title, description);

  const outcome = createTargetOutcomeLine(target, viewModel.resistance);
  if (outcome) resistance.append(outcome);

  const roll = createTargetResistanceRollDisplay(target, viewModel.resistance);
  const actions = createTargetDetailsActions(target, viewModel);

  details.append(resistance, roll, actions);
  details.setAttribute("aria-label", `Detalhes de ${target.name}`);
  return details;
}

function createTargetOutcomeLine(target: MultiTargetViewModel, resistance: TargetResistanceViewModel | null): HTMLElement | null {
  if (!target.resistanceResult) return null;

  const line = document.createElement("span");
  line.classList.add(`${PROMPT_CLASS}__target-resistance-outcome`);

  if (resistance?.difficulty === null || resistance?.difficulty === undefined) {
    line.textContent = `${target.resistanceResult.skillLabel}: ${target.resistanceResult.total}`;
    return line;
  }

  const status = target.state === SUCCESS_STATE ? "sucesso" : "falha";
  line.textContent = `${target.resistanceResult.skillLabel}: ${target.resistanceResult.total} vs DT ${resistance.difficulty} — ${status}`;
  return line;
}

function createTargetResistanceRollDisplay(
  target: MultiTargetViewModel,
  resistance: TargetResistanceViewModel | null
): HTMLElement {
  const wrapper = document.createElement("div");
  wrapper.classList.add(`${PROMPT_CLASS}__target-resistance-roll`);

  const formulaText = target.resistanceResult?.formula ?? resistance?.formula ?? "—";
  const total = target.resistanceResult?.total ?? null;
  const roll = createCompactWorkflowRollDisplay(
    formulaText,
    total,
    target.resistanceResult?.diceBreakdown ?? null,
    target.resistanceResult !== null
  );

  wrapper.append(roll);
  return wrapper;
}

function createTargetDetailsActions(target: MultiTargetViewModel, viewModel: MultiTargetCardViewModel): HTMLElement {
  const actions = document.createElement("div");
  actions.classList.add(`${PROMPT_CLASS}__target-details-actions`);
  appendVisibleTargetActions(actions, [
    createTargetDamageActionButton(target, viewModel, "full"),
    createTargetEffectActionButton(target, viewModel, "full")
  ]);
  return actions;
}

function placeTargetSection(rollCard: HTMLElement, section: HTMLElement, anchor: HTMLElement | null): void {
  if (!anchor) {
    rollCard.prepend(section);
    return;
  }

  if (section.parentElement === rollCard && section.previousElementSibling === anchor) return;
  rollCard.insertBefore(section, anchor.nextElementSibling);
}

function getOrCreateEffectInfoSection(rollCard: HTMLElement): HTMLElement {
  const existing = findEffectInfoSection(rollCard);
  if (existing) return existing;

  const section = document.createElement("section");
  section.classList.add(
    `${PROMPT_CLASS}__workflow-section`,
    `${PROMPT_CLASS}__workflow-section--effect-info`
  );
  section.setAttribute(MULTI_TARGET_EFFECT_INFO_ATTRIBUTE, "true");
  return section;
}

function findEffectInfoSection(rollCard: HTMLElement): HTMLElement | null {
  return rollCard.querySelector<HTMLElement>(`[${MULTI_TARGET_EFFECT_INFO_ATTRIBUTE}="true"]`);
}

function renderEffectInfoSection(section: HTMLElement, effect: TargetEffectViewModel): void {
  section.replaceChildren();

  const header = document.createElement("div");
  header.classList.add(`${PROMPT_CLASS}__workflow-section-header`);

  const title = document.createElement("strong");
  title.textContent = "Efeito";

  header.append(title);

  const body = document.createElement("div");
  body.classList.add(`${PROMPT_CLASS}__effect-info-body`);

  const label = document.createElement("span");
  label.classList.add(`${PROMPT_CLASS}__effect-info-label`);
  label.textContent = effect.label;

  const hint = document.createElement("span");
  hint.classList.add(`${PROMPT_CLASS}__effect-info-hint`);
  hint.textContent = "Aplicação por alvo";

  body.append(label, hint);
  section.append(header, body);
}

function placeEffectInfoSectionBeforeTargets(
  rollCard: HTMLElement,
  section: HTMLElement,
  effectSection: HTMLElement | null,
): void {
  const anchor = effectSection?.parentElement === rollCard
    ? effectSection
    : findWorkflowSectionByTitle(rollCard, "Conjuração");

  if (!anchor) {
    rollCard.prepend(section);
    return;
  }

  if (section.parentElement === rollCard && section.previousElementSibling === anchor) return;
  rollCard.insertBefore(section, anchor.nextElementSibling);
}

function placeEffectInfoSection(rollCard: HTMLElement, section: HTMLElement, targetSection: HTMLElement): void {
  if (section.parentElement === rollCard && section.previousElementSibling === targetSection) return;
  rollCard.insertBefore(section, targetSection.nextElementSibling);
}

function normalizeLookupName(value: string | null | undefined): string | null {
  const normalized = value?.trim().toLocaleLowerCase();
  return normalized && normalized.length > 0 ? normalized : null;
}

async function showDiceAnimationIfAvailable(roll: Roll): Promise<void> {
  const dice3d = (game as { dice3d?: { showForRoll?: (roll: Roll, user: unknown, synchronize?: boolean) => unknown } }).dice3d;

  if (typeof dice3d?.showForRoll !== "function") return;

  await Promise.resolve(dice3d.showForRoll(roll, game.user, true));
}

function createTargetId(name: string, index: number): string {
  return `${index}-${normalizeText(name).replace(/[^a-z0-9]+/gu, "-")}`;
}

function normalizeText(value: string | null | undefined): string {
  return value?.trim().toLocaleLowerCase() ?? "";
}

function isNonEmptyString(value: string | null): value is string {
  return typeof value === "string" && value.length > 0;
}

function isDamageMode(value: string | null): value is MultiTargetDamageMode {
  return value === "normal" || value === "half";
}

function parseBoolean(value: string | null | undefined): boolean | null {
  if (value === "true") return true;
  if (value === "false") return false;
  return null;
}

function parseInteger(value: string | null | undefined): number | null {
  if (!value) return null;
  const parsed = Number(value);
  return Number.isFinite(parsed) ? Math.trunc(parsed) : null;
}
