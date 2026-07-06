import type { AutomationRitualTargetingDefinition } from "../../core/automation/automation-definition";
import type { WorkflowTarget } from "../../core/workflow/workflow-context";
import type { RitualCastOptions } from "../rituals/ritual-cast-options";

export type PreCastTargetingInput = {
  castOptions: RitualCastOptions;
  formTargeting?: AutomationRitualTargetingDefinition;
  currentTargets: WorkflowTarget[];
};

export type PreCastTargetingConfirmed = {
  status: "confirmed";
  targets: WorkflowTarget[];
};

export type PreCastTargetingCancelled = {
  status: "cancelled";
  reason: "line-area-not-implemented" | "user-cancelled";
};

export type PreCastTargetingFailed = {
  status: "failed";
  reason: "unsupported-targeting-mode";
  message: string;
};

export type PreCastTargetingResult =
  | PreCastTargetingConfirmed
  | PreCastTargetingCancelled
  | PreCastTargetingFailed;
