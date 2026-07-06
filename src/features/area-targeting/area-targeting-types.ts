import type { AutomationRitualTargetingDefinition } from "../../core/automation/automation-definition";
import type { WorkflowTarget } from "../../core/workflow/workflow-context";
import type { RitualCastOptions } from "../rituals/ritual-cast-options";

export type ScreenPoint = {
  x: number;
  y: number;
};

export type CanvasPoint = {
  x: number;
  y: number;
};

export type LineAreaPlacement = {
  origin: CanvasPoint;
  destination: CanvasPoint;
};

export type AreaTargetingCancellationReason = "user-cancelled";

export type AreaTargetingFailureReason =
  | "canvas-unavailable"
  | "scene-unavailable"
  | "placement-failed"
  | "unsupported-targeting-mode";

export type LineAreaPlacementResult =
  | { status: "confirmed"; line: LineAreaPlacement }
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
  line?: LineAreaPlacement;
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
