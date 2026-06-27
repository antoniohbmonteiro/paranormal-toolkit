import { failure, type Result, success } from "../result";
import { resolveAutomationAmount } from "./automation-amount-resolver";
import { createAutomationRollRequest, executeAutomationRollFormula } from "./automation-roll-executor";
import { executeAutomationResourceOperation } from "./automation-resource-executor";
import { recordAutomationApplication } from "./automation-application-recorder";
import {
  createAutomationApplyMetadata,
  emitAutomationApplyAfterLifecycle,
  emitAutomationApplyBeforeLifecycle,
  emitAutomationApplyLifecycle
} from "./automation-apply-lifecycle";
import { executeAutomationChatStep } from "./automation-chat-executor";
import { executeAutomationCostStep } from "./automation-cost-executor";
import { runAutomationStepWithGenericLifecycle } from "./automation-step-lifecycle-runner";
import type { RitualCostProvider } from "../rituals/ritual-cost-provider";
import type { ResourceEngine, ResourceOperationResult } from "../resources/resource-engine";
import type { ResourceTransaction } from "../resources/resource-transaction";
import type { WorkflowContext } from "../workflow/workflow-context";
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
        return runAutomationStepWithGenericLifecycle({
          step,
          context,
          stepIndex,
          lifecycle: this.lifecycle,
          execute: () => this.executeStep(step, context, stepIndex)
        });
    }
  }

  private async executeStep(step: AutomationStep, context: WorkflowContext, stepIndex: number): Promise<Result<void, AutomationRunFailure>> {
    switch (step.type) {
      case "spendResource":
      case "spendRitualCost":
        return this.runCostStep(step, context, stepIndex);
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

  private async runCostStep(
    step: SpendResourceStep | SpendRitualCostStep,
    context: WorkflowContext,
    stepIndex: number
  ): Promise<Result<void, AutomationRunFailure>> {
    const result = await executeAutomationCostStep({
      step,
      context,
      resources: this.resources,
      ritualCosts: this.ritualCosts
    });

    if (!result.ok) {
      return failure({ ...result.error, stepIndex, step, context });
    }

    return success(undefined);
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

    const metadata = createAutomationApplyMetadata(step, context, amount.value);

    emitAutomationApplyBeforeLifecycle({
      step,
      context,
      stepIndex,
      metadata,
      lifecycle: this.lifecycle
    });

    emitAutomationApplyLifecycle({
      step,
      context,
      stepIndex,
      metadata,
      lifecycle: this.lifecycle
    });

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

      recordAutomationApplication({
        step,
        context,
        transaction: handled.value,
        stepIndex,
        lifecycle: this.lifecycle
      });
    }

    emitAutomationApplyAfterLifecycle({
      step,
      context,
      stepIndex,
      metadata,
      lifecycle: this.lifecycle
    });

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
    const result = await executeAutomationChatStep(this.messages, step, context);

    if (!result.ok) {
      return failure({ ...result.error, stepIndex, step, context });
    }

    return success(undefined);
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

  private resolveActors(selector: AutomationActorSelector, context: WorkflowContext): Actor[] {
    switch (selector) {
      case "self":
        return [context.sourceActor];
      case "target":
        return context.targets.flatMap((target) => (target.actor ? [target.actor] : []));
    }
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
