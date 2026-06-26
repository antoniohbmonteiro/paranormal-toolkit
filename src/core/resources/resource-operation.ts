export type ResourceOperation = "spend" | "damage" | "heal" | "recover";

export type ResourceFailureReason =
  | "invalid-amount"
  | "insufficient-resource"
  | "update-failed";
