import { getRollIdFromAmountSource } from "./automation-amount-resolver";
import type { ModifyResourceStep } from "./automation-definition";
import type { WorkflowContext } from "../workflow/workflow-context";
import type { WorkflowHookEmitter } from "../workflow/workflow-hook-emitter";
import type { WorkflowPhase } from "../workflow/workflow-phase";
import type { ResourceOperation } from "../resources/resource-operation";

export type AutomationApplyLifecycleInput = {
  step: ModifyResourceStep;
  context: WorkflowContext;
  stepIndex: number;
  metadata: Record<string, unknown>;
  lifecycle: WorkflowHookEmitter;
};

export function createAutomationApplyMetadata(
  step: ModifyResourceStep,
  context: WorkflowContext,
  amount: number
): Record<string, unknown> {
  const rollId = getRollIdFromAmountSource(step.amountFrom);
  const roll = rollId ? context.rolls[rollId] : undefined;

  return {
    actorSelector: step.actor,
    resource: step.resource,
    operation: step.operation,
    amount,
    amountFrom: step.amountFrom,
    rollId,
    rollIntent: roll?.intent,
    damageType: roll?.damageType
  };
}

export function emitAutomationApplyBeforeLifecycle(input: AutomationApplyLifecycleInput): void {
  const { step, context, stepIndex, metadata, lifecycle } = input;

  lifecycle.emit("beforeApply", context, { stepIndex, step, metadata });
  emitSpecificApplyPhase("before", input);
  emitDamageResolutionPhase("before", input);
  emitDamageResolutionPhase("resolve", input);
}

export function emitAutomationApplyLifecycle(input: AutomationApplyLifecycleInput): void {
  const { step, context, stepIndex, metadata, lifecycle } = input;

  lifecycle.emit("apply", context, { stepIndex, step, metadata });
  emitSpecificApplyPhase("apply", input);
}

export function emitAutomationApplyAfterLifecycle(input: AutomationApplyLifecycleInput): void {
  const { step, context, stepIndex, metadata, lifecycle } = input;

  lifecycle.emit("afterApply", context, { stepIndex, step, metadata });
}

function emitSpecificApplyPhase(
  timing: "before" | "apply" | "after",
  input: AutomationApplyLifecycleInput
): void {
  const { step, context, stepIndex, metadata, lifecycle } = input;
  const phase = getSpecificApplyPhase(timing, step.operation);

  if (!phase) return;

  lifecycle.emit(phase, context, {
    stepIndex,
    step,
    metadata
  });
}

function emitDamageResolutionPhase(
  timing: "before" | "resolve",
  input: AutomationApplyLifecycleInput
): void {
  const { step, context, stepIndex, metadata, lifecycle } = input;

  if (step.operation !== "damage") return;

  lifecycle.emit(timing === "before" ? "beforeDamageResolution" : "damageResolution", context, {
    stepIndex,
    step,
    metadata
  });
}

function getSpecificApplyPhase(timing: "before" | "apply" | "after", operation: ResourceOperation): WorkflowPhase | null {
  if (operation === "damage") {
    if (timing === "before") return "beforeApplyDamage";
    if (timing === "apply") return "applyDamage";
    return "afterApplyDamage";
  }

  if (operation === "heal") {
    if (timing === "before") return "beforeApplyHealing";
    if (timing === "apply") return "applyHealing";
    return "afterApplyHealing";
  }

  return null;
}
