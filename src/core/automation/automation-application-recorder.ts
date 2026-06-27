import { getRollIdFromAmountSource } from "./automation-amount-resolver";
import type { ModifyResourceStep } from "./automation-definition";
import type { ResourceTransaction } from "../resources/resource-transaction";
import type { WorkflowContext } from "../workflow/workflow-context";
import type { WorkflowDamageInstance } from "../workflow/workflow-damage";
import type { WorkflowHealingInstance } from "../workflow/workflow-healing";
import type { WorkflowHookEmitter } from "../workflow/workflow-hook-emitter";

export type RecordAutomationApplicationInput = {
  step: ModifyResourceStep;
  context: WorkflowContext;
  transaction: ResourceTransaction;
  stepIndex: number;
  lifecycle: WorkflowHookEmitter;
};

export function recordAutomationApplication(input: RecordAutomationApplicationInput): void {
  const { step, context, transaction, stepIndex, lifecycle } = input;

  if (step.operation === "damage") {
    const damage = createDamageInstance(step, context, transaction, stepIndex);
    context.damageInstances.push(damage);

    lifecycle.emit("afterDamageResolution", context, {
      stepIndex,
      step,
      damage,
      resourceTransaction: transaction,
      metadata: {
        rawAmount: damage.rawAmount,
        finalAmount: damage.finalAmount,
        appliedAmount: damage.appliedAmount,
        damageType: damage.damageType
      }
    });

    lifecycle.emit("afterApplyDamage", context, {
      stepIndex,
      step,
      damage,
      resourceTransaction: transaction,
      metadata: {
        rawAmount: damage.rawAmount,
        finalAmount: damage.finalAmount,
        appliedAmount: damage.appliedAmount,
        damageType: damage.damageType
      }
    });

    return;
  }

  if (step.operation === "heal") {
    const healing = createHealingInstance(step, context, transaction, stepIndex);
    context.healingInstances.push(healing);

    lifecycle.emit("afterApplyHealing", context, {
      stepIndex,
      step,
      healing,
      resourceTransaction: transaction,
      metadata: {
        rawAmount: healing.rawAmount,
        finalAmount: healing.finalAmount,
        appliedAmount: healing.appliedAmount
      }
    });
  }
}

function createDamageInstance(
  step: ModifyResourceStep,
  context: WorkflowContext,
  transaction: ResourceTransaction,
  stepIndex: number
): WorkflowDamageInstance {
  const rollId = getRollIdFromAmountSource(step.amountFrom);
  const roll = rollId ? context.rolls[rollId] : undefined;

  return {
    id: createWorkflowChildId(context.id, "damage", stepIndex, context.damageInstances.length),
    source: context.item.type === "ritual" ? "ritual" : "automation",
    sourceId: context.item.id ?? null,
    sourceName: context.item.name ?? "Item sem nome",
    targetActorId: transaction.actorId,
    targetActorName: transaction.actorName,
    rollId: rollId ?? undefined,
    damageType: roll?.damageType,
    rawAmount: transaction.requestedAmount,
    finalAmount: transaction.requestedAmount,
    appliedAmount: transaction.appliedAmount,
    tags: ["workflow", "resource", step.resource]
  };
}

function createHealingInstance(
  step: ModifyResourceStep,
  context: WorkflowContext,
  transaction: ResourceTransaction,
  stepIndex: number
): WorkflowHealingInstance {
  const rollId = getRollIdFromAmountSource(step.amountFrom);

  return {
    id: createWorkflowChildId(context.id, "healing", stepIndex, context.healingInstances.length),
    source: context.item.type === "ritual" ? "ritual" : "automation",
    sourceId: context.item.id ?? null,
    sourceName: context.item.name ?? "Item sem nome",
    targetActorId: transaction.actorId,
    targetActorName: transaction.actorName,
    rollId: rollId ?? undefined,
    rawAmount: transaction.requestedAmount,
    finalAmount: transaction.requestedAmount,
    appliedAmount: transaction.appliedAmount,
    tags: ["workflow", "resource", step.resource]
  };
}

function createWorkflowChildId(workflowId: string, type: string, stepIndex: number, index: number): string {
  return `${workflowId}.${type}.${stepIndex}.${index}`;
}
