export type ResourceOperation = "spend" | "damage" | "heal" | "recover";

export type ResourceFailureReason =
  | "invalid-amount"
  | "insufficient-resource"
  | "resource-path-not-found"
  | "invalid-resource-value"
  | "update-failed";
