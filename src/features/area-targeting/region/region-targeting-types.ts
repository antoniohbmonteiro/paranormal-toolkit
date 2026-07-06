export type RegionTargetingCancellationReason =
  | "user-cancelled"
  | "region-placement-cancelled";

export type RegionTargetingFailureReason =
  | "canvas-unavailable"
  | "scene-unavailable"
  | "region-layer-unavailable"
  | "region-placement-failed";

export type RegionPlacementMode = "ephemeral" | "persistent";

export type RegionLineShapeConfig = {
  shape: "line";
  length?: number | null;
  width?: number | null;
  direction?: number | null;
  elevation?: number | null;
};

export type RegionLinePlacementConfirmed = {
  status: "confirmed";
  region: RegionDocumentLike;
  wasCreated: boolean;
};

export type RegionLinePlacementCancelled = {
  status: "cancelled";
  reason: RegionTargetingCancellationReason;
};

export type RegionLinePlacementFailed = {
  status: "failed";
  reason: RegionTargetingFailureReason;
  message: string;
};

export type RegionLinePlacementResult =
  | RegionLinePlacementConfirmed
  | RegionLinePlacementCancelled
  | RegionLinePlacementFailed;
