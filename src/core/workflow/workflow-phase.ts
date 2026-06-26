export type WorkflowPhase =
  | "created"
  | "beforeItemUse"
  | "resolveTargets"
  | "beforeCost"
  | "spendCost"
  | "afterCost"
  | "beforeRoll"
  | "roll"
  | "afterRoll"
  | "beforeApply"
  | "apply"
  | "afterApply"
  | "beforeChat"
  | "chat"
  | "completed"
  | "failed";

export const WORKFLOW_PHASES = [
  "created",
  "beforeItemUse",
  "resolveTargets",
  "beforeCost",
  "spendCost",
  "afterCost",
  "beforeRoll",
  "roll",
  "afterRoll",
  "beforeApply",
  "apply",
  "afterApply",
  "beforeChat",
  "chat",
  "completed",
  "failed"
] as const satisfies readonly WorkflowPhase[];
