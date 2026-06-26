export type WorkflowPhase =
  | "created"
  | "beforeItemUse"
  | "resolveTargets"
  | "beforeCost"
  | "spendCost"
  | "afterCost"
  | "beforeRoll"
  | "beforeDamageRoll"
  | "beforeHealingRoll"
  | "roll"
  | "damageRoll"
  | "healingRoll"
  | "afterDamageRoll"
  | "afterHealingRoll"
  | "afterRoll"
  | "beforeDamageResolution"
  | "damageResolution"
  | "afterDamageResolution"
  | "beforeApply"
  | "beforeApplyDamage"
  | "beforeApplyHealing"
  | "apply"
  | "applyDamage"
  | "applyHealing"
  | "afterApplyDamage"
  | "afterApplyHealing"
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
  "beforeDamageRoll",
  "beforeHealingRoll",
  "roll",
  "damageRoll",
  "healingRoll",
  "afterDamageRoll",
  "afterHealingRoll",
  "afterRoll",
  "beforeDamageResolution",
  "damageResolution",
  "afterDamageResolution",
  "beforeApply",
  "beforeApplyDamage",
  "beforeApplyHealing",
  "apply",
  "applyDamage",
  "applyHealing",
  "afterApplyDamage",
  "afterApplyHealing",
  "afterApply",
  "beforeChat",
  "chat",
  "completed",
  "failed"
] as const satisfies readonly WorkflowPhase[];
