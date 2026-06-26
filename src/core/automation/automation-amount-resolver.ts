import { failure, type Result, success } from "../result";
import type { WorkflowContext } from "../workflow/workflow-context";

export type AutomationAmountInput = {
  amount?: number;
  amountFrom?: string;
};

export type AutomationAmountFailureReason = "invalid-amount-source" | "missing-roll-result";

export type AutomationAmountFailure = {
  reason: AutomationAmountFailureReason;
  message: string;
};

export type AutomationAmountResult = Result<number, AutomationAmountFailure>;

export function resolveAutomationAmount(
  step: AutomationAmountInput,
  context: Pick<WorkflowContext, "rolls">
): AutomationAmountResult {
  if (typeof step.amount === "number") {
    if (!Number.isInteger(step.amount) || step.amount <= 0) {
      return failure({
        reason: "invalid-amount-source",
        message: "Amount precisa ser um inteiro positivo."
      });
    }

    return success(step.amount);
  }

  if (typeof step.amountFrom === "string") {
    const rollId = getRollIdFromAmountSource(step.amountFrom);

    if (!rollId) {
      return failure({
        reason: "invalid-amount-source",
        message: `amountFrom inválido: ${step.amountFrom}. Use o formato rollId.total.`
      });
    }

    const roll = context.rolls[rollId];

    if (!roll) {
      return failure({
        reason: "missing-roll-result",
        message: `Resultado da rolagem não encontrado: ${rollId}.`
      });
    }

    const amount = Math.trunc(roll.total);

    if (!Number.isInteger(amount) || amount <= 0) {
      return failure({
        reason: "invalid-amount-source",
        message: `Total da rolagem ${rollId} não gerou um amount positivo.`
      });
    }

    return success(amount);
  }

  return failure({
    reason: "invalid-amount-source",
    message: "Step precisa informar amount ou amountFrom."
  });
}

export function getRollIdFromAmountSource(amountFrom: string | undefined): string | null {
  if (!amountFrom) return null;

  const match = /^(?<rollId>[A-Za-z0-9_-]+)\.total$/.exec(amountFrom);
  return match?.groups?.rollId ?? null;
}
