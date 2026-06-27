import { failure, type Result, success } from "../result";
import { resolveAutomationAmount } from "./automation-amount-resolver";
import type { SpendResourceStep, SpendRitualCostStep } from "./automation-definition";
import type { RitualCostProvider } from "../rituals/ritual-cost-provider";
import type { ResourceEngine, ResourceOperationResult } from "../resources/resource-engine";
import type { WorkflowContext } from "../workflow/workflow-context";

export type AutomationCostStep = SpendResourceStep | SpendRitualCostStep;

export type AutomationCostFailureReason =
  | "invalid-amount-source"
  | "missing-roll-result"
  | "ritual-cost-failed"
  | "resource-operation-failed";

export type AutomationCostFailure = {
  reason: AutomationCostFailureReason;
  message: string;
  cause?: unknown;
};

export type AutomationCostResult = Result<void, AutomationCostFailure>;

export type ExecuteAutomationCostStepInput = {
  step: AutomationCostStep;
  context: WorkflowContext;
  resources: Pick<ResourceEngine, "spend">;
  ritualCosts: RitualCostProvider;
};

export async function executeAutomationCostStep(input: ExecuteAutomationCostStepInput): Promise<AutomationCostResult> {
  const { step } = input;

  switch (step.type) {
    case "spendResource":
      return spendExplicitResource(input, step);
    case "spendRitualCost":
      return spendRitualCost(input, step);
  }
}

async function spendExplicitResource(
  input: ExecuteAutomationCostStepInput,
  step: SpendResourceStep
): Promise<AutomationCostResult> {
  const { context, resources } = input;
  const amount = resolveAutomationAmount(step, context);

  if (!amount.ok) {
    return failure(amount.error);
  }

  return handleResourceOperationResult(await resources.spend(context.sourceActor, step.resource, amount.value), context);
}

async function spendRitualCost(
  input: ExecuteAutomationCostStepInput,
  step: SpendRitualCostStep
): Promise<AutomationCostResult> {
  const { context, resources, ritualCosts } = input;
  const costResult = ritualCosts.getCost({
    actor: context.sourceActor,
    ritual: context.item
  });

  if (!costResult.ok) {
    return failure({
      reason: "ritual-cost-failed",
      message: costResult.error.message,
      cause: costResult.error
    });
  }

  const cost = costResult.value;

  context.ritualCosts.push({
    ...cost,
    itemId: context.item.id ?? null,
    itemName: context.item.name ?? "Ritual sem nome"
  });

  return handleResourceOperationResult(await resources.spend(context.sourceActor, cost.resource, cost.amount), context, step);
}

function handleResourceOperationResult(
  result: ResourceOperationResult,
  context: WorkflowContext,
  step?: SpendRitualCostStep
): AutomationCostResult {
  if (!result.ok) {
    if (step?.type === "spendRitualCost") {
      context.ritualCosts.pop();
    }

    return failure({
      reason: "resource-operation-failed",
      message: result.error.message,
      cause: result.error
    });
  }

  context.resourceTransactions.push(result.value);
  return success(undefined);
}
