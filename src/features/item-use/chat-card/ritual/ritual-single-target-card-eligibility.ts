import type { ItemUseContext } from "../../item-use-context";
import type { AssistedRitualAction, RitualCastSnapshot } from "../../../rituals/ritual-assisted-workflow";

export type RitualCardEligibilityReason = "no-target-supported" | "missing-required-target" | "multiple-targets" | "unsupported-area-targeting";
export type RitualCardIneligibilityReason = "mode-legacy" | "unsupported-system" | "not-ritual" | Exclude<RitualCardEligibilityReason, "no-target-supported"> | "missing-source" | "missing-item" | "missing-target-actor" | "unsupported-roll-intent" | "multiple-effect-rolls" | "unsupported-action" | "missing-resistance-difficulty";
export type RitualCardEligibility = { eligible: true; reason?: "no-target-supported" } | { eligible: false; reason: RitualCardIneligibilityReason };
export function resolveRitualSingleTargetEligibility(input: { mode: "auto" | "legacy"; systemId: string; context: ItemUseContext; snapshot: RitualCastSnapshot; actions: AssistedRitualAction[]; resistanceDifficulty: number | null }): RitualCardEligibility {
  if (input.mode === "legacy") return { eligible: false, reason: "mode-legacy" };
  if (input.systemId !== "ordemparanormal") return { eligible: false, reason: "unsupported-system" };
  if (input.context.item.type !== "ritual") return { eligible: false, reason: "not-ritual" };
  if (input.snapshot.areaTargeting) return { eligible: false, reason: "unsupported-area-targeting" };
  if (input.context.targets.length > 1) return { eligible: false, reason: "multiple-targets" };
  if (!input.context.actor?.id && !input.context.actor?.uuid) return { eligible: false, reason: "missing-source" };
  if (!input.context.item.id && !input.context.item.uuid) return { eligible: false, reason: "missing-item" };
  if (input.snapshot.rolls.some((roll) => !["damage", "healing", "ritual", "generic"].includes(roll.intent))) return { eligible: false, reason: "unsupported-roll-intent" };
  if (input.snapshot.rolls.filter((roll) => roll.intent !== "ritual").length > 1) return { eligible: false, reason: "multiple-effect-rolls" };
  if (input.actions.some((action) => !["resource-operation", "damage-application", "condition-application"].includes(action.kind))) return { eligible: false, reason: "unsupported-action" };
  if (input.context.targets.length === 0) {
    if (requiresTarget(input)) return { eligible: false, reason: "missing-required-target" };
    return { eligible: true, reason: "no-target-supported" };
  }
  const target = input.context.targets[0]?.actor;
  if (!target || (!target.id && !target.uuid)) return { eligible: false, reason: "missing-target-actor" };
  if (input.snapshot.resistance && input.resistanceDifficulty === null) return { eligible: false, reason: "missing-resistance-difficulty" };
  return { eligible: true };
}

function requiresTarget(input: { context: ItemUseContext; snapshot: RitualCastSnapshot; actions: AssistedRitualAction[] }): boolean {
  if (input.snapshot.resistance) return true;
  if (input.snapshot.rolls.some((roll) => roll.intent === "damage" || roll.intent === "healing")) return true;
  return input.actions.some((action) => action.kind === "damage-application" || action.kind === "condition-application" || action.actor !== input.context.actor);
}
