import type { AutomationConditionApplicationDefinition } from "../../core/automation/automation-definition";
import type { ResistanceResolutionState } from "./config/item-use-resistance-gate-policy";

export type ConditionApplicationResistanceOutcome = "failure" | "success";
export type ConditionApplicationResistanceTrigger = "failure" | "success" | "always";

export function normalizeConditionApplicationResistanceTrigger(
  application: Pick<AutomationConditionApplicationDefinition, "applyOnResistance">,
): ConditionApplicationResistanceTrigger {
  return application.applyOnResistance ?? "failure";
}

export function getResistanceOutcomeForAction(
  resistanceState: ResistanceResolutionState,
): ConditionApplicationResistanceOutcome | null {
  if (resistanceState.kind === "succeeded") return "success";
  if (resistanceState.kind === "failed") return "failure";
  return null;
}

export function matchesResistanceOutcome(
  application: Pick<AutomationConditionApplicationDefinition, "applyOnResistance">,
  outcome: ConditionApplicationResistanceOutcome | null,
): boolean {
  const trigger = normalizeConditionApplicationResistanceTrigger(application);
  if (trigger === "always") return true;
  if (!outcome) return false;
  return trigger === outcome;
}

export function requiresResolvedResistanceOutcome(
  application: Pick<AutomationConditionApplicationDefinition, "applyOnResistance">,
): boolean {
  const trigger = normalizeConditionApplicationResistanceTrigger(application);
  return trigger === "failure" || trigger === "success";
}

export function hasConditionApplicationForResistanceSuccess(
  applications: readonly AutomationConditionApplicationDefinition[],
): boolean {
  return applications.some((application) => normalizeConditionApplicationResistanceTrigger(application) === "success");
}

export function resolveConditionApplicationForResistanceOutcome(
  applications: readonly AutomationConditionApplicationDefinition[],
  outcome: ConditionApplicationResistanceOutcome | null,
  displayLabel: string | null,
  normalizeLabel: (value: string | null | undefined) => string | null,
): AutomationConditionApplicationDefinition | null {
  const matchingOutcome = applications.filter((application) => matchesResistanceOutcome(application, outcome));
  if (matchingOutcome.length === 0) {
    return outcome ? null : applications[0] ?? null;
  }

  const exactOutcome = outcome
    ? matchingOutcome.filter((application) => normalizeConditionApplicationResistanceTrigger(application) === outcome)
    : [];
  const candidates = exactOutcome.length > 0 ? exactOutcome : matchingOutcome;
  if (candidates.length === 1) return candidates[0] ?? null;

  const normalizedDisplayLabel = normalizeLabel(displayLabel);
  if (normalizedDisplayLabel) {
    return candidates.find((application) => {
      return [application.label, application.conditionId]
        .some((candidate) => normalizeLabel(candidate) === normalizedDisplayLabel);
    }) ?? candidates[0] ?? null;
  }

  return candidates[0] ?? null;
}
