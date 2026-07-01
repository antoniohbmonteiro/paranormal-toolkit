import { animateRollWithDiceSoNice } from "../../features/dice/dice-animation-service";
import { failure, type Result, success } from "../result";
import type { WorkflowContext } from "../workflow/workflow-context";
import type { WorkflowRollIntent, WorkflowRollRequest, WorkflowRollResult } from "../workflow/workflow-roll";
import type { RollFormulaStep } from "./automation-definition";

export type AutomationRollFailureReason = "invalid-step" | "roll-failed";

export type AutomationRollFailure = {
  reason: AutomationRollFailureReason;
  message: string;
  cause?: unknown;
};

export type AutomationRollResult = Result<WorkflowRollResult, AutomationRollFailure>;

export async function executeAutomationRollFormula(
  step: RollFormulaStep,
  stepIndex: number,
  context: Pick<WorkflowContext, "rollRequests" | "rolls">
): Promise<AutomationRollResult> {
  if (!isNonEmptyString(step.id) || !isNonEmptyString(step.formula)) {
    return failure({
      reason: "invalid-step",
      message: "Step rollFormula precisa de id e formula."
    });
  }

  try {
    const roll = new Roll(step.formula);
    const evaluatedRoll = await Promise.resolve(roll.evaluate());
    const total = evaluatedRoll.total;

    if (typeof total !== "number" || !Number.isFinite(total)) {
      return failure({
        reason: "roll-failed",
        message: `A rolagem ${step.id} não retornou um total numérico válido.`
      });
    }

    await animateRollWithDiceSoNice(evaluatedRoll);

    const rollRequest = context.rollRequests[step.id] ?? createAutomationRollRequest(step, stepIndex);
    const rollResult: WorkflowRollResult = {
      ...rollRequest,
      total,
      roll: evaluatedRoll
    };

    context.rolls[step.id] = rollResult;

    return success(rollResult);
  } catch (cause) {
    return failure({
      reason: "roll-failed",
      message: `Falha ao rolar fórmula: ${step.formula}.`,
      cause
    });
  }
}

export function createAutomationRollRequest(step: RollFormulaStep, stepIndex: number): WorkflowRollRequest {
  const intent = step.intent ?? inferRollIntent(step.id);

  return {
    id: step.id,
    formula: step.formula,
    intent,
    damageType: step.damageType ?? undefined,
    sourceStepIndex: stepIndex
  };
}

export function inferRollIntent(rollId: string): WorkflowRollIntent {
  const normalized = rollId.toLowerCase();

  if (normalized.includes("damage") || normalized.includes("dano")) return "damage";
  if (normalized.includes("healing") || normalized.includes("heal") || normalized.includes("cura")) return "healing";
  if (normalized.includes("attack") || normalized.includes("ataque")) return "attack";
  if (normalized.includes("resistance") || normalized.includes("resistencia") || normalized.includes("resistência")) return "resistance";

  return "generic";
}

function isNonEmptyString(value: unknown): value is string {
  return typeof value === "string" && value.length > 0;
}
