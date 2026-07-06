import type { AutomationRitualTargetingDefinition } from "../../core/automation/automation-definition";
import type { WorkflowTarget } from "../../core/workflow/workflow-context";
import type { RitualCastOptions } from "../rituals/ritual-cast-options";

export type AreaTargetingCancellationReason = "user-cancelled" | "no-targets-found";

export type AreaTargetingFailureReason =
  | "canvas-unavailable"
  | "scene-unavailable"
  | "placement-failed"
  | "native-template-unavailable"
  | "unsupported-targeting-mode";

export type NativeRayTemplatePlacementResult =
  | { status: "confirmed"; templateDocument: unknown }
  | { status: "cancelled"; reason: AreaTargetingCancellationReason }
  | { status: "failed"; reason: AreaTargetingFailureReason; message: string };

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
  reason: AreaTargetingCancellationReason;
};

export type PreCastTargetingFailed = {
  status: "failed";
  reason: AreaTargetingFailureReason;
  message: string;
};

export type PreCastTargetingResult =
  | PreCastTargetingConfirmed
  | PreCastTargetingCancelled
  | PreCastTargetingFailed;
