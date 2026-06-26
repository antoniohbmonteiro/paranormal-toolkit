import { failure, type Result, success } from "../result";
import type { RitualCostProvider } from "../rituals/ritual-cost-provider";
import type { ActorResource } from "../resources/actor-resource";
import type { ResourceEngine, ResourceOperationResult } from "../resources/resource-engine";
import type { ResourceOperation } from "../resources/resource-operation";
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
import { createWorkflowContext, type WorkflowContext, type WorkflowContextInput } from "./workflow-context";
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
    private readonly messages: WorkflowMessageService
  ) {}

  async run(definition: AutomationDefinition, input: WorkflowContextInput): Promise<AutomationRunResult> {
    const context = createWorkflowContext(input);

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
    const amount = this.resolveAmount(step, context);

    if (!amount.ok) {
      return failure({ ...amount.error, stepIndex, step, context });
    }

    const result = await this.resources.spend(context.sourceActor, step.resource, amount.value);
    return this.handleResourceOperationResult(result, context, stepIndex, step);
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
    return this.handleResourceOperationResult(result, context, stepIndex, step);
  }

  private async runRollFormulaStep(
    step: RollFormulaStep,
    context: WorkflowContext,
    stepIndex: number
  ): Promise<Result<void, AutomationRunFailure>> {
    if (!isNonEmptyString(step.id) || !isNonEmptyString(step.formula)) {
      return failure({
        reason: "invalid-step",
        message: "Step rollFormula precisa de id e formula.",
        stepIndex,
        step,
        context
      });
    }

    try {
      const roll = new Roll(step.formula);
      const evaluatedRoll = await Promise.resolve(roll.evaluate());
      const total = evaluatedRoll.total;

      if (typeof total !== "number" || !Number.isFinite(total)) {
        return failure({
          reason: "roll-failed",
          message: `A rolagem ${step.id} não retornou um total numérico válido.`,
          stepIndex,
          step,
          context
        });
      }

      context.rolls[step.id] = {
        id: step.id,
        formula: step.formula,
        total,
        roll: evaluatedRoll
      };

      return success(undefined);
    } catch (cause) {
      return failure({
        reason: "roll-failed",
        message: `Falha ao rolar fórmula: ${step.formula}.`,
        stepIndex,
        step,
        context,
        cause
      });
    }
  }

  private async runModifyResourceStep(
    step: ModifyResourceStep,
    context: WorkflowContext,
    stepIndex: number
  ): Promise<Result<void, AutomationRunFailure>> {
    const amount = this.resolveAmount(step, context);

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
      const result = await this.runResourceOperation(actor, step.resource, step.operation, amount.value);
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

  private async runResourceOperation(
    actor: Actor,
    resource: ActorResource,
    operation: ResourceOperation,
    amount: number
  ): Promise<ResourceOperationResult> {
    switch (operation) {
      case "spend":
        if (resource !== "PE" && resource !== "PD") {
          return this.invalidResourceOperation(actor, resource, operation, amount);
        }
        return this.resources.spend(actor, resource, amount);
      case "damage":
        if (resource !== "PV" && resource !== "SAN") {
          return this.invalidResourceOperation(actor, resource, operation, amount);
        }
        return this.resources.damage(actor, resource, amount);
      case "heal":
        if (resource !== "PV") {
          return this.invalidResourceOperation(actor, resource, operation, amount);
        }
        return this.resources.heal(actor, resource, amount);
      case "recover":
        if (resource !== "SAN") {
          return this.invalidResourceOperation(actor, resource, operation, amount);
        }
        return this.resources.recover(actor, resource, amount);
    }
  }

  private invalidResourceOperation(
    actor: Actor,
    resource: ActorResource,
    operation: ResourceOperation,
    amount: number
  ): ResourceOperationResult {
    return failure({
      actor,
      actorId: actor.id ?? null,
      actorName: actor.name ?? "Ator sem nome",
      resource,
      operation,
      reason: "invalid-resource-operation",
      message: `Operação ${operation} não é válida para ${resource}.`,
      requestedAmount: amount
    });
  }

  private handleResourceOperationResult(
    result: ResourceOperationResult,
    context: WorkflowContext,
    stepIndex: number,
    step: AutomationStep
  ): Result<void, AutomationRunFailure> {
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
    return success(undefined);
  }

  private resolveActors(selector: AutomationActorSelector, context: WorkflowContext): Actor[] {
    switch (selector) {
      case "self":
        return [context.sourceActor];
      case "target":
        return context.targets.flatMap((target) => (target.actor ? [target.actor] : []));
    }
  }

  private resolveAmount(
    step: { amount?: number; amountFrom?: string },
    context: WorkflowContext
  ): Result<number, Omit<AutomationRunFailure, "stepIndex" | "step" | "context">> {
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
      const match = /^(?<rollId>[A-Za-z0-9_-]+)\.total$/.exec(step.amountFrom);
      const rollId = match?.groups?.rollId;

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
}

function isNonEmptyString(value: unknown): value is string {
  return typeof value === "string" && value.length > 0;
}
