import type { AutomationRitualTargetingDefinition } from "../../core/automation/automation-definition";
import type { WorkflowTarget } from "../../core/workflow/workflow-context";
import type { RitualCastOptions } from "../rituals/ritual-cast-options";

export type {
  FoundryRegionAdapter,
  FoundryRegionPlacementState,
} from "./region/foundry-region-adapter";

export type {
  RegionCleanupService,
} from "./region/region-cleanup-service";

export type {
  RegionLinePlacementService,
} from "./region/region-line-placement-service";

export type {
  RegionTargetResolver,
} from "./region/region-target-resolver";

export type {
  RegionLinePlacementResult,
  RegionLineShapeConfig,
  RegionPlacementMode,
  RegionTargetResolutionResult,
  RegionTargetResolutionSource,
  RegionTargetingCancellationReason,
  RegionTargetingFailureReason,
} from "./region/region-targeting-types";

export type AreaTargetingCancellationReason =
  | "user-cancelled"
  | "no-targets-found"
  | "region-targeting-unavailable"
  | "region-placement-cancelled";

export type AreaTargetingFailureReason =
  | "canvas-unavailable"
  | "scene-unavailable"
  | "placement-failed"
  | "region-layer-unavailable"
  | "region-placement-failed"
  | "region-resolution-failed"
  | "unsupported-targeting-mode";

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
