import { getRollIdFromAmountSource } from "./automation-amount-resolver";
import type { ModifyResourceStep } from "./automation-definition";
import type { WorkflowContext } from "../workflow/workflow-context";
import type { WorkflowHookEmitter } from "../workflow/workflow-hook-emitter";
import type { WorkflowPhase } from "../workflow/workflow-phase";

export type AutomationApplyMetadata = Record<string, unknown>;

export type AutomationApplyLifecycleInput = {
  lifecycle: WorkflowHookEmitter;
  context: WorkflowContext;
  step: ModifyResourceStep;
  stepIndex: number;
  metadata: AutomationApplyMetadata;
};

export function createAutomationApplyMetadata(
  step: ModifyResourceStep,
  context: WorkflowContext,
  amount: number
): AutomationApplyMetadata {
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

export function emitAutomationApplyStartLifecycle(input: AutomationApplyLifecycleInput): void {
  const { lifecycle, context, step, stepIndex, metadata } = input;

  lifecycle.emit("beforeApply", context, { stepIndex, step, metadata });
  emitSpecificApplyPhase("before", input);
  emitDamageResolutionPhase("before", input);
  emitDamageResolutionPhase("resolve", input);
  lifecycle.emit("apply", context, { stepIndex, step, metadata });
  emitSpecificApplyPhase("apply", input);
}

export function emitAutomationApplyCompletedLifecycle(input: AutomationApplyLifecycleInput): void {
  const { lifecycle, context, step, stepIndex, metadata } = input;

  lifecycle.emit("afterApply", context, { stepIndex, step, metadata });
}

function emitSpecificApplyPhase(
  timing: "before" | "apply" | "after",
  input: AutomationApplyLifecycleInput
): void {
  const phase = getSpecificApplyPhase(timing, input.step.operation);

  if (!phase) return;

  input.lifecycle.emit(phase, input.context, {
    stepIndex: input.stepIndex,
    step: input.step,
    metadata: input.metadata
  });
}

function emitDamageResolutionPhase(timing: "before" | "resolve", input: AutomationApplyLifecycleInput): void {
  if (input.step.operation !== "damage") return;

  input.lifecycle.emit(timing === "before" ? "beforeDamageResolution" : "damageResolution", input.context, {
    stepIndex: input.stepIndex,
    step: input.step,
    metadata: input.metadata
  });
}

function getSpecificApplyPhase(
  timing: "before" | "apply" | "after",
  operation: ModifyResourceStep["operation"]
): WorkflowPhase | null {
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
