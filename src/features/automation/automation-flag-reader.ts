import type { ActorResource } from "../../core/resources/actor-resource";
import type { ResourceOperation } from "../../core/resources/resource-operation";
import type { WorkflowRollIntent } from "../../core/workflow/workflow-roll";
import type { AutomationFlagValue } from "../../core/automation/automation-binder";
import type {
  AutomationActorSelector,
  AutomationConditionApplicationDefinition,
  AutomationConditionDurationDefinition,
  AutomationDefinition,
  AutomationStep,
  ChatCardStep,
  ModifyResourceStep,
  RollFormulaStep,
  SpendResourceStep,
  SpendRitualCostStep,
} from "../../core/automation/automation-definition";
import { failure, type Result, success } from "../../core/result";
import { MODULE_ID } from "../../constants";

export type AutomationFlagFailureReason =
  "missing-automation" | "invalid-automation";

export type AutomationFlagFailure = {
  reason: AutomationFlagFailureReason;
  message: string;
  value?: unknown;
};

export type AutomationFlagResult = Result<
  AutomationDefinition,
  AutomationFlagFailure
>;

export function readAutomationDefinition(item: Item): AutomationFlagResult {
  const value = item.getFlag(MODULE_ID, "automation");

  if (value === undefined || value === null) {
    return failure({
      reason: "missing-automation",
      message: `Item ${item.name} não possui automação do Paranormal Toolkit.`,
    });
  }

  if (!isAutomationFlagValue(value)) {
    return failure({
      reason: "invalid-automation",
      message: `Automação do item ${item.name} usa formato inválido ou antigo. Reaplique um preset do Paranormal Toolkit.`,
      value,
    });
  }

  return success(value.definition);
}

export function hasValidAutomationFlag(item: Item): boolean {
  return isAutomationFlagValue(item.getFlag(MODULE_ID, "automation"));
}

export function isAutomationFlagValue(
  value: unknown,
): value is AutomationFlagValue {
  if (!value || typeof value !== "object") return false;

  const candidate = value as Partial<AutomationFlagValue>;

  return (
    candidate.schemaVersion === 1 &&
    isAutomationFlagSource(candidate.source) &&
    isAutomationDefinition(candidate.definition)
  );
}

export function isAutomationDefinition(
  value: unknown,
): value is AutomationDefinition {
  if (!value || typeof value !== "object") return false;

  const candidate = value as Partial<AutomationDefinition>;

  return (
    candidate.version === 1 &&
    isNonEmptyString(candidate.label) &&
    Array.isArray(candidate.steps) &&
    candidate.steps.every(isAutomationStep) &&
    (candidate.conditionApplications === undefined ||
      isConditionApplicationList(candidate.conditionApplications))
  );
}

function isAutomationFlagSource(
  value: unknown,
): value is AutomationFlagValue["source"] {
  if (!value || typeof value !== "object") return false;

  const candidate = value as Partial<AutomationFlagValue["source"]>;

  if (candidate.type === "preset") {
    return (
      isNonEmptyString(candidate.presetId) &&
      isNonEmptyString(candidate.presetVersion) &&
      isNonEmptyString(candidate.appliedAt)
    );
  }

  if (candidate.type === "manual") {
    return (
      isNonEmptyString(candidate.label) && isNonEmptyString(candidate.appliedAt)
    );
  }

  return false;
}

function isAutomationStep(value: unknown): value is AutomationStep {
  if (!value || typeof value !== "object") return false;

  const candidate = value as Partial<AutomationStep>;

  switch (candidate.type) {
    case "spendResource":
      return isSpendResourceStep(candidate);
    case "spendRitualCost":
      return isSpendRitualCostStep(candidate);
    case "rollFormula":
      return isRollFormulaStep(candidate);
    case "modifyResource":
      return isModifyResourceStep(candidate);
    case "chatCard":
      return isChatCardStep(candidate);
    default:
      return false;
  }
}

function isSpendResourceStep(
  value: Partial<AutomationStep>,
): value is SpendResourceStep {
  const candidate = value as Partial<SpendResourceStep>;

  return (
    candidate.type === "spendResource" &&
    candidate.actor === "self" &&
    (candidate.resource === "PE" || candidate.resource === "PD") &&
    hasAmountSource(candidate)
  );
}

function isSpendRitualCostStep(
  value: Partial<AutomationStep>,
): value is SpendRitualCostStep {
  const candidate = value as Partial<SpendRitualCostStep>;

  return candidate.type === "spendRitualCost";
}

function isRollFormulaStep(
  value: Partial<AutomationStep>,
): value is RollFormulaStep {
  const candidate = value as Partial<RollFormulaStep>;

  return (
    candidate.type === "rollFormula" &&
    isNonEmptyString(candidate.id) &&
    isNonEmptyString(candidate.formula) &&
    (candidate.intent === undefined ||
      isWorkflowRollIntent(candidate.intent)) &&
    (candidate.damageType === undefined ||
      isNonEmptyString(candidate.damageType))
  );
}

function isModifyResourceStep(
  value: Partial<AutomationStep>,
): value is ModifyResourceStep {
  const candidate = value as Partial<ModifyResourceStep>;

  return (
    candidate.type === "modifyResource" &&
    isAutomationActorSelector(candidate.actor) &&
    isActorResource(candidate.resource) &&
    isResourceOperation(candidate.operation) &&
    hasAmountSource(candidate) &&
    (candidate.damageType === undefined ||
      candidate.damageType === null ||
      isNonEmptyString(candidate.damageType)) &&
    (candidate.ignoreResistance === undefined ||
      typeof candidate.ignoreResistance === "boolean")
  );
}

function isChatCardStep(value: Partial<AutomationStep>): value is ChatCardStep {
  const candidate = value as Partial<ChatCardStep>;

  return (
    candidate.type === "chatCard" &&
    (candidate.title === undefined || typeof candidate.title === "string") &&
    (candidate.message === undefined || typeof candidate.message === "string")
  );
}

function isConditionApplicationList(
  value: unknown,
): value is AutomationConditionApplicationDefinition[] {
  return Array.isArray(value) && value.every(isConditionApplicationDefinition);
}

function isConditionApplicationDefinition(
  value: unknown,
): value is AutomationConditionApplicationDefinition {
  if (!value || typeof value !== "object") return false;

  const candidate = value as Partial<AutomationConditionApplicationDefinition>;

  return (
    isNonEmptyString(candidate.id) &&
    isAutomationActorSelector(candidate.actor) &&
    isNonEmptyString(candidate.conditionId) &&
    (candidate.label === undefined || isNonEmptyString(candidate.label)) &&
    (candidate.duration === undefined ||
      candidate.duration === null ||
      isConditionDurationDefinition(candidate.duration)) &&
    (candidate.source === undefined || isNonEmptyString(candidate.source)) &&
    (candidate.actionSectionId === undefined ||
      isNonEmptyString(candidate.actionSectionId)) &&
    (candidate.actionSectionTitle === undefined ||
      isNonEmptyString(candidate.actionSectionTitle)) &&
    (candidate.executedLabel === undefined ||
      isNonEmptyString(candidate.executedLabel)) &&
    (candidate.applyOnResistance === undefined ||
      isConditionApplicationResistanceTrigger(candidate.applyOnResistance))
  );
}

function isConditionApplicationResistanceTrigger(
  value: unknown,
): value is AutomationConditionApplicationDefinition["applyOnResistance"] {
  return value === "failure" || value === "success" || value === "always";
}

function isConditionDurationDefinition(
  value: unknown,
): value is AutomationConditionDurationDefinition {
  if (!value || typeof value !== "object") return false;

  const candidate = value as Partial<AutomationConditionDurationDefinition>;
  return (
    (candidate.rounds === undefined ||
      candidate.rounds === null ||
      isPositiveInteger(candidate.rounds)) &&
    (candidate.expiry === undefined ||
      candidate.expiry === null ||
      isConditionExpiryEvent(candidate.expiry))
  );
}

function isConditionExpiryEvent(
  value: unknown,
): value is NonNullable<AutomationConditionDurationDefinition["expiry"]> {
  return value === "turnStart" || value === "turnEnd";
}

function hasAmountSource(value: {
  amount?: unknown;
  amountFrom?: unknown;
}): boolean {
  return (
    (typeof value.amount === "number" &&
      Number.isInteger(value.amount) &&
      value.amount > 0) ||
    isNonEmptyString(value.amountFrom)
  );
}

function isAutomationActorSelector(
  value: unknown,
): value is AutomationActorSelector {
  return value === "self" || value === "target";
}

function isActorResource(value: unknown): value is ActorResource {
  return value === "PV" || value === "SAN" || value === "PE" || value === "PD";
}

function isResourceOperation(value: unknown): value is ResourceOperation {
  return (
    value === "spend" ||
    value === "damage" ||
    value === "heal" ||
    value === "recover"
  );
}

function isWorkflowRollIntent(value: unknown): value is WorkflowRollIntent {
  return (
    value === "attack" ||
    value === "damage" ||
    value === "healing" ||
    value === "resistance" ||
    value === "skill" ||
    value === "ritual" ||
    value === "generic"
  );
}

function isPositiveInteger(value: unknown): value is number {
  return typeof value === "number" && Number.isInteger(value) && value > 0;
}

function isNonEmptyString(value: unknown): value is string {
  return typeof value === "string" && value.length > 0;
}
