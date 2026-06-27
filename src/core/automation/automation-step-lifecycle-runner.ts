import type { Result } from "../result";
import type { AutomationStep } from "./automation-definition";
import type { WorkflowContext } from "../workflow/workflow-context";
import type { WorkflowHookEmitter } from "../workflow/workflow-hook-emitter";
import type { WorkflowPhase } from "../workflow/workflow-phase";

export type AutomationStepLifecyclePhases = {
  before: WorkflowPhase[];
  after: WorkflowPhase[];
};

export type RunAutomationStepWithGenericLifecycleInput<TFailure> = {
  step: AutomationStep;
  context: WorkflowContext;
  stepIndex: number;
  lifecycle: WorkflowHookEmitter;
  execute: () => Promise<Result<void, TFailure>>;
};

export async function runAutomationStepWithGenericLifecycle<TFailure>(
  input: RunAutomationStepWithGenericLifecycleInput<TFailure>
): Promise<Result<void, TFailure>> {
  const { step, context, stepIndex, lifecycle, execute } = input;
  const phases = getAutomationGenericStepLifecyclePhases(step);

  for (const phase of phases.before) {
    lifecycle.emit(phase, context, { stepIndex, step });
  }

  const result = await execute();

  if (!result.ok) {
    return result;
  }

  for (const phase of phases.after) {
    lifecycle.emit(phase, context, { stepIndex, step });
  }

  return result;
}

export function getAutomationGenericStepLifecyclePhases(step: AutomationStep): AutomationStepLifecyclePhases {
  switch (step.type) {
    case "spendResource":
    case "spendRitualCost":
      return {
        before: ["beforeCost", "spendCost"],
        after: ["afterCost"]
      };
    case "chatCard":
      return {
        before: ["beforeChat", "chat"],
        after: []
      };
    default:
      return {
        before: [],
        after: []
      };
  }
}
