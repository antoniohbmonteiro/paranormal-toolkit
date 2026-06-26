import { failure, type Result, success } from "../result";
import { getRollIdFromAmountSource, resolveAutomationAmount } from "./automation-amount-resolver";
import { createAutomationRollRequest, executeAutomationRollFormula } from "./automation-roll-executor";
import { executeAutomationResourceOperation } from "./automation-resource-executor";
import type { RitualCostProvider } from "../rituals/ritual-cost-provider";
import type { ResourceEngine, ResourceOperationResult } from "../resources/resource-engine";
import type { ResourceOperation } from "../resources/resource-operation";
import type { ResourceTransaction } from "../resources/resource-transaction";
import type { WorkflowContext } from "../workflow/workflow-context";
import type { WorkflowDamageInstance } from "../workflow/workflow-damage";
import type { WorkflowHealingInstance } from "../workflow/workflow-healing";
import type { WorkflowHookEmitter } from "../workflow/workflow-hook-emitter";
import type { WorkflowPhase } from "../workflow/workflow-phase";
import type { WorkflowRollIntent, WorkflowRollRequest, WorkflowRollResult } from "../workflow/workflow-roll";
import type {
  AutomationActorSelector,
  AutomationDefinition,
  AutomationStep,
  ChatCardStep,
  ModifyResourceStep,
  RollFormulaStep,
  SpendResourceStep,
  SpendRitualCostStep
} from "./automation-definition";
import type { WorkflowMessageService } from "./workflow-message-service";

export type AutomationRunSuccess = {
  definition: AutomationDefinition;
  context: WorkflowContext;
};

export type AutomationRunFailureReason =
  | "empty-automation"
  | "unsupported-step"
  | "invalid-step"
  | "invalid-amount-source"
  | "missing-roll-result"
  | "roll-failed"
  | "no-target"
  | "invalid-resource-operation"
  | "ritual-cost-failed"
  | "resource-operation-failed"
  | "chat-card-failed";

export type AutomationRunFailure = {
  reason: AutomationRunFailureReason;
  message: string;
  stepIndex?: number;
  step?: AutomationStep;
  context: WorkflowContext;
  cause?: unknown;
};

export type AutomationRunResult = Result<AutomationRunSuccess, AutomationRunFailure>;

export class AutomationRunner {
  constructor(
    private readonly resources: ResourceEngine,
    private readonly ritualCosts: RitualCostProvider,
    private readonly messages: WorkflowMessageService,
    private readonly lifecycle: WorkflowHookEmitter
  ) {}

  async run(definition: AutomationDefinition, context: WorkflowContext): Promise<AutomationRunResult> {
    if (definition.steps.length === 0) {
      return failure({
        reason: "empty-automation",
        message: "A automação não possui steps para executar.",
        context
      });
    }

    for (const [index, step] of definition.steps.entries()) {
      const result = await this.runStep(step, context, index);

      if (!result.ok) {
        return result;
      }
    }

    return success({ definition, context });
  }

  private async runStep(step: AutomationStep, context: WorkflowContext, stepIndex: number): Promise<Result<void, AutomationRunFailure>> {
    switch (step.type) {
      case "rollFormula":
        return this.runRollFormulaStepWithLifecycle(step, context, stepIndex);
      case "modifyResource":
        return this.runModifyResourceStepWithLifecycle(step, context, stepIndex);
      default:
        return this.runGenericStepWithLifecycle(step, context, stepIndex);
    }
  }

  private async runGenericStepWithLifecycle(
    step: AutomationStep,
    context: WorkflowContext,
    stepIndex: number
  ): Promise<Result<void, AutomationRunFailure>> {
    const phases = getGenericStepLifecyclePhases(step);

    for (const phase of phases.before) {
      this.lifecycle.emit(phase, context, { stepIndex, step });
    }

    const result = await this.executeStep(step, context, stepIndex);

    if (!result.ok) {
      return result;
    }

    for (const phase of phases.after) {
      this.lifecycle.emit(phase, context, { stepIndex, step });
    }

    return success(undefined);
  }

  private async executeStep(step: AutomationStep, context: WorkflowContext, stepIndex: number): Promise<Result<void, AutomationRunFailure>> {
    switch (step.type) {
      case "spendResource":
        return this.runSpendResourceStep(step, context, stepIndex);
      case "spendRitualCost":
        return this.runSpendRitualCostStep(step, context, stepIndex);
      case "rollFormula":
        return this.runRollFormulaStep(step, context, stepIndex);
      case "modifyResource":
        return this.runModifyResourceStep(step, context, stepIndex);
      case "chatCard":
        return this.runChatCardStep(step, context, stepIndex);
      default:
        return failure({
          reason: "unsupported-step",
          message: "Tipo de step não suportado pela versão atual do AutomationRunner.",
          stepIndex,
          step,
          context
        });
    }
  }

  private async runSpendResourceStep(
    step: SpendResourceStep,
    context: WorkflowContext,
    stepIndex: number
  ): Promise<Result<void, AutomationRunFailure>> {
    const amount = resolveAutomationAmount(step, context);

    if (!amount.ok) {
      return failure({ ...amount.error, stepIndex, step, context });
    }

    const result = await this.resources.spend(context.sourceActor, step.resource, amount.value);
    const handled = this.handleResourceOperationResult(result, context, stepIndex, step);
    return handled.ok ? success(undefined) : handled;
  }

  private async runSpendRitualCostStep(
    step: SpendRitualCostStep,
    context: WorkflowContext,
    stepIndex: number
  ): Promise<Result<void, AutomationRunFailure>> {
    const costResult = this.ritualCosts.getCost({
      actor: context.sourceActor,
      ritual: context.item
    });

    if (!costResult.ok) {
      return failure({
        reason: "ritual-cost-failed",
        message: costResult.error.message,
        stepIndex,
        step,
        context,
        cause: costResult.error
      });
    }

    const cost = costResult.value;

    context.ritualCosts.push({
      ...cost,
      itemId: context.item.id ?? null,
      itemName: context.item.name ?? "Ritual sem nome"
    });

    const result = await this.resources.spend(context.sourceActor, cost.resource, cost.amount);
    const handled = this.handleResourceOperationResult(result, context, stepIndex, step);
    return handled.ok ? success(undefined) : handled;
  }

  private async runRollFormulaStepWithLifecycle(
    step: RollFormulaStep,
    context: WorkflowContext,
    stepIndex: number
  ): Promise<Result<void, AutomationRunFailure>> {
    const rollRequest = createAutomationRollRequest(step, stepIndex);
    context.rollRequests[rollRequest.id] = rollRequest;

    this.lifecycle.emit("beforeRoll", context, { stepIndex, step, rollRequest });
    this.emitSpecificRollPhase("before", rollRequest, context, stepIndex, step);
    this.lifecycle.emit("roll", context, { stepIndex, step, rollRequest });
    this.emitSpecificRollPhase("roll", rollRequest, context, stepIndex, step);

    const result = await this.runRollFormulaStep(step, context, stepIndex);

    if (!result.ok) {
      return result;
    }

    const rollResult = context.rolls[rollRequest.id];

    this.emitSpecificRollPhase("after", rollRequest, context, stepIndex, step, rollResult);
    this.lifecycle.emit("afterRoll", context, { stepIndex, step, rollRequest, rollResult });

    return success(undefined);
  }

  private async runRollFormulaStep(
    step: RollFormulaStep,
    context: WorkflowContext,
    stepIndex: number
  ): Promise<Result<void, AutomationRunFailure>> {
    const result = await executeAutomationRollFormula(step, stepIndex, context);

    if (!result.ok) {
      return failure({ ...result.error, stepIndex, step, context });
    }

    return success(undefined);
  }

  private async runModifyResourceStepWithLifecycle(
    step: ModifyResourceStep,
    context: WorkflowContext,
    stepIndex: number
  ): Promise<Result<void, AutomationRunFailure>> {
    const amount = resolveAutomationAmount(step, context);

    if (!amount.ok) {
      return failure({ ...amount.error, stepIndex, step, context });
    }

    const metadata = this.createApplyMetadata(step, context, amount.value);

    this.lifecycle.emit("beforeApply", context, { stepIndex, step, metadata });
    this.emitSpecificApplyPhase("before", step, context, stepIndex, metadata);
    this.emitDamageResolutionPhase("before", step, context, stepIndex, metadata);
    this.emitDamageResolutionPhase("resolve", step, context, stepIndex, metadata);
    this.lifecycle.emit("apply", context, { stepIndex, step, metadata });
    this.emitSpecificApplyPhase("apply", step, context, stepIndex, metadata);

    const actors = this.resolveActors(step.actor, context);

    if (actors.length === 0) {
      return failure({
        reason: "no-target",
        message: "Nenhum alvo válido encontrado para modificar recurso.",
        stepIndex,
        step,
        context
      });
    }

    for (const actor of actors) {
      const result = await executeAutomationResourceOperation(this.resources, actor, step.resource, step.operation, amount.value);
      const handled = this.handleResourceOperationResult(result, context, stepIndex, step);

      if (!handled.ok) {
        return handled;
      }

      this.recordTypedApplication(step, context, handled.value, stepIndex);
    }

    this.lifecycle.emit("afterApply", context, { stepIndex, step, metadata });

    return success(undefined);
  }

  private async runModifyResourceStep(
    step: ModifyResourceStep,
    context: WorkflowContext,
    stepIndex: number
  ): Promise<Result<void, AutomationRunFailure>> {
    const amount = resolveAutomationAmount(step, context);

    if (!amount.ok) {
      return failure({ ...amount.error, stepIndex, step, context });
    }

    const actors = this.resolveActors(step.actor, context);

    if (actors.length === 0) {
      return failure({
        reason: "no-target",
        message: "Nenhum alvo válido encontrado para modificar recurso.",
        stepIndex,
        step,
        context
      });
    }

    for (const actor of actors) {
      const result = await executeAutomationResourceOperation(this.resources, actor, step.resource, step.operation, amount.value);
      const handled = this.handleResourceOperationResult(result, context, stepIndex, step);

      if (!handled.ok) {
        return handled;
      }
    }

    return success(undefined);
  }

  private async runChatCardStep(
    step: ChatCardStep,
    context: WorkflowContext,
    stepIndex: number
  ): Promise<Result<void, AutomationRunFailure>> {
    try {
      await this.messages.createWorkflowSummaryMessage(context, step);
      return success(undefined);
    } catch (cause) {
      return failure({
        reason: "chat-card-failed",
        message: "Workflow executado, mas falhou ao criar chat card de resumo.",
        stepIndex,
        step,
        context,
        cause
      });
    }
  }

  private handleResourceOperationResult(
    result: ResourceOperationResult,
    context: WorkflowContext,
    stepIndex: number,
    step: AutomationStep
  ): Result<ResourceTransaction, AutomationRunFailure> {
    if (!result.ok) {
      return failure({
        reason: "resource-operation-failed",
        message: result.error.message,
        stepIndex,
        step,
        context,
        cause: result.error
      });
    }

    context.resourceTransactions.push(result.value);
    return success(result.value);
  }

  private emitSpecificRollPhase(
    timing: "before" | "roll" | "after",
    rollRequest: WorkflowRollRequest,
    context: WorkflowContext,
    stepIndex: number,
    step: RollFormulaStep,
    rollResult?: WorkflowRollResult
  ): void {
    const phase = getSpecificRollPhase(timing, rollRequest.intent);

    if (!phase) return;

    this.lifecycle.emit(phase, context, {
      stepIndex,
      step,
      rollRequest,
      rollResult
    });
  }

  private createApplyMetadata(step: ModifyResourceStep, context: WorkflowContext, amount: number): Record<string, unknown> {
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

  private emitSpecificApplyPhase(
    timing: "before" | "apply" | "after",
    step: ModifyResourceStep,
    context: WorkflowContext,
    stepIndex: number,
    metadata: Record<string, unknown>
  ): void {
    const phase = getSpecificApplyPhase(timing, step.operation);

    if (!phase) return;

    this.lifecycle.emit(phase, context, {
      stepIndex,
      step,
      metadata
    });
  }

  private emitDamageResolutionPhase(
    timing: "before" | "resolve",
    step: ModifyResourceStep,
    context: WorkflowContext,
    stepIndex: number,
    metadata: Record<string, unknown>
  ): void {
    if (step.operation !== "damage") return;

    this.lifecycle.emit(timing === "before" ? "beforeDamageResolution" : "damageResolution", context, {
      stepIndex,
      step,
      metadata
    });
  }

  private recordTypedApplication(
    step: ModifyResourceStep,
    context: WorkflowContext,
    transaction: ResourceTransaction,
    stepIndex: number
  ): void {
    if (step.operation === "damage") {
      const damage = this.createDamageInstance(step, context, transaction, stepIndex);
      context.damageInstances.push(damage);

      this.lifecycle.emit("afterDamageResolution", context, {
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
      this.lifecycle.emit("afterApplyDamage", context, {
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
      const healing = this.createHealingInstance(step, context, transaction, stepIndex);
      context.healingInstances.push(healing);

      this.lifecycle.emit("afterApplyHealing", context, {
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

  private createDamageInstance(
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

  private createHealingInstance(
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

  private resolveActors(selector: AutomationActorSelector, context: WorkflowContext): Actor[] {
    switch (selector) {
      case "self":
        return [context.sourceActor];
      case "target":
        return context.targets.flatMap((target) => (target.actor ? [target.actor] : []));
    }
  }

}

function getGenericStepLifecyclePhases(step: AutomationStep): { before: WorkflowPhase[]; after: WorkflowPhase[] } {
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

function getSpecificRollPhase(timing: "before" | "roll" | "after", intent: WorkflowRollIntent): WorkflowPhase | null {
  if (intent === "damage") {
    if (timing === "before") return "beforeDamageRoll";
    if (timing === "roll") return "damageRoll";
    return "afterDamageRoll";
  }

  if (intent === "healing") {
    if (timing === "before") return "beforeHealingRoll";
    if (timing === "roll") return "healingRoll";
    return "afterHealingRoll";
  }

  return null;
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

function createWorkflowChildId(workflowId: string, type: string, stepIndex: number, index: number): string {
  return `${workflowId}.${type}.${stepIndex}.${index}`;
}




