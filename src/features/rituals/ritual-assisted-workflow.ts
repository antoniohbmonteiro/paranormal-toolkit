import type {
  AutomationActorSelector,
  AutomationDefinition,
  AutomationStep,
  ChatCardStep,
  ModifyResourceStep,
  SpendResourceStep,
  SpendRitualCostStep
} from "../../core/automation/automation-definition";
import { resolveAutomationAmount } from "../../core/automation/automation-amount-resolver";
import { executeAutomationResourceOperation } from "../../core/automation/automation-resource-executor";
import type { RitualCostProvider } from "../../core/rituals/ritual-cost-provider";
import type { RitualCost } from "../../core/rituals/ritual-types";
import type { ResourceEngine, ResourceOperationResult } from "../../core/resources/resource-engine";
import type { WorkflowContext } from "../../core/workflow/workflow-context";
import type { WorkflowEngine } from "../../core/workflow/workflow-engine";
import type { WorkflowRollResult } from "../../core/workflow/workflow-roll";
import type { ItemUseContext } from "../item-use/item-use-context";
import { requestRitualCastOptions } from "./ritual-cast-dialog";
import { getRitualCastVariantLabel, type RitualCastOptions } from "./ritual-cast-options";

export type AssistedResourceAction = {
  kind: "resource-operation";
  actor: Actor;
  actorName: string;
  resource: ModifyResourceStep["resource"];
  operation: ModifyResourceStep["operation"];
  amount: number;
  label: string;
  executedLabel: string;
};

export type RitualAssistedRunResult =
  | {
      status: "cancelled";
    }
  | {
      status: "failed";
      reason: string;
      message: string;
      cause?: unknown;
    }
  | {
      status: "completed-without-actions";
      workflowContext: WorkflowContext;
      summaryLines: string[];
    }
  | {
      status: "ready";
      workflowContext: WorkflowContext;
      actions: AssistedResourceAction[];
      summaryLines: string[];
    };

type RitualPreparationStep = Exclude<AutomationStep, ModifyResourceStep | ChatCardStep>;

type RitualPreparationDefinition = AutomationDefinition & {
  steps: RitualPreparationStep[];
};

export class RitualAssistedWorkflow {
  constructor(
    private readonly workflow: WorkflowEngine,
    private readonly resources: ResourceEngine,
    private readonly ritualCosts: RitualCostProvider
  ) {}

  canHandle(context: ItemUseContext, definition: AutomationDefinition): boolean {
    return context.item.type === "ritual" || definition.steps.some((step) => step.type === "spendRitualCost");
  }

  async run(context: ItemUseContext, definition: AutomationDefinition): Promise<RitualAssistedRunResult> {
    if (!context.actor) {
      return {
        status: "failed",
        reason: "missing-actor",
        message: "Não foi possível resolver o conjurador do ritual."
      };
    }

    const cost = this.resolveCostPreview(context);
    const options = await requestRitualCastOptions({
      actor: context.actor,
      ritual: context.item,
      targetNames: context.targets.map((target) => target.name),
      cost,
      defaultSpendResource: hasRitualOrExplicitCost(definition)
    });

    if (!options) {
      return { status: "cancelled" };
    }

    const preparationDefinition = createPreparationDefinition(definition, options);

    if (preparationDefinition.steps.length === 0) {
      return {
        status: "failed",
        reason: "empty-preparation",
        message: "O ritual não possui custo ou rolagem para preparar antes das ações no chat."
      };
    }

    const runResult = await this.workflow.runAutomation(preparationDefinition, {
      sourceActor: context.actor as Actor,
      sourceToken: context.token,
      item: context.item,
      targets: context.targets,
      flags: {
        itemUse: {
          source: context.source,
          executionMode: "ask"
        },
        ritualCast: {
          variant: options.variant,
          spendResource: options.spendResource
        }
      }
    });

    if (!runResult.ok) {
      return {
        status: "failed",
        reason: runResult.error.reason,
        message: runResult.error.message,
        cause: runResult.error
      };
    }

    const workflowContext = runResult.value.context;
    const actionResult = createAssistedResourceActions(definition, context, workflowContext);
    const summaryLines = createRitualSummaryLines(options, cost, workflowContext);

    if (!actionResult.ok) {
      return {
        status: "failed",
        reason: actionResult.reason,
        message: actionResult.message
      };
    }

    if (actionResult.actions.length === 0) {
      return {
        status: "completed-without-actions",
        workflowContext,
        summaryLines
      };
    }

    return {
      status: "ready",
      workflowContext,
      actions: actionResult.actions,
      summaryLines
    };
  }

  async applyAction(action: AssistedResourceAction): Promise<ResourceOperationResult> {
    return executeAutomationResourceOperation(this.resources, action.actor, action.resource, action.operation, action.amount);
  }

  private resolveCostPreview(context: ItemUseContext): RitualCost | null {
    if (!context.actor) return null;

    const result = this.ritualCosts.getCost({
      actor: context.actor,
      ritual: context.item
    });

    return result.ok ? result.value : null;
  }
}

function createPreparationDefinition(definition: AutomationDefinition, options: RitualCastOptions): RitualPreparationDefinition {
  const steps: RitualPreparationStep[] = [];

  for (const step of definition.steps) {
    if (step.type === "modifyResource" || step.type === "chatCard") continue;
    if (isCostStep(step) && !options.spendResource) continue;

    steps.push(step);
  }

  return {
    ...definition,
    label: `${definition.label} · Conjuração assistida`,
    steps
  };
}

function createAssistedResourceActions(
  definition: AutomationDefinition,
  itemUseContext: ItemUseContext,
  workflowContext: WorkflowContext
): { ok: true; actions: AssistedResourceAction[] } | { ok: false; reason: string; message: string } {
  const actions: AssistedResourceAction[] = [];

  for (const step of definition.steps) {
    if (step.type !== "modifyResource") continue;

    const amount = resolveAutomationAmount(step, workflowContext);

    if (!amount.ok) {
      return {
        ok: false,
        reason: amount.error.reason,
        message: amount.error.message
      };
    }

    const actors = resolveActors(step.actor, itemUseContext);

    if (actors.length === 0) {
      return {
        ok: false,
        reason: "no-target",
        message: "Nenhum alvo válido encontrado para criar ação assistida do ritual."
      };
    }

    for (const actor of actors) {
      actions.push(createAssistedResourceAction(step, actor, amount.value));
    }
  }

  return { ok: true, actions };
}

function createAssistedResourceAction(step: ModifyResourceStep, actor: Actor, amount: number): AssistedResourceAction {
  const actorName = actor.name ?? "Ator sem nome";

  return {
    kind: "resource-operation",
    actor,
    actorName,
    resource: step.resource,
    operation: step.operation,
    amount,
    label: createActionLabel(step, actorName, amount),
    executedLabel: createExecutedLabel(step, actorName)
  };
}

function createActionLabel(step: ModifyResourceStep, actorName: string, amount: number): string {
  if (step.operation === "heal" && step.resource === "PV") {
    return `Curar ${actorName} em ${amount} PV`;
  }

  if (step.operation === "damage") {
    return `Aplicar ${amount} de dano em ${actorName}`;
  }

  if (step.operation === "recover") {
    return `Recuperar ${amount} ${step.resource} de ${actorName}`;
  }

  if (step.operation === "spend") {
    return `Gastar ${amount} ${step.resource} de ${actorName}`;
  }

  return `Aplicar ${amount} ${step.resource} em ${actorName}`;
}

function createExecutedLabel(step: ModifyResourceStep, actorName: string): string {
  if (step.operation === "heal" && step.resource === "PV") {
    return `✓ ${actorName} curado`;
  }

  if (step.operation === "damage") {
    return `✓ Dano aplicado em ${actorName}`;
  }

  if (step.operation === "recover") {
    return `✓ ${actorName} recuperado`;
  }

  if (step.operation === "spend") {
    return `✓ Recurso gasto de ${actorName}`;
  }

  return "✓ Ação aplicada";
}

function resolveActors(selector: AutomationActorSelector, context: ItemUseContext): Actor[] {
  switch (selector) {
    case "self":
      return context.actor ? [context.actor as Actor] : [];
    case "target":
      return context.targets.flatMap((target) => (target.actor ? [target.actor] : []));
  }
}

function createRitualSummaryLines(options: RitualCastOptions, cost: RitualCost | null, context: WorkflowContext): string[] {
  return [
    `Forma: ${getRitualCastVariantLabel(options.variant)}`,
    createCostSummaryLine(options, cost),
    ...Object.values(context.rolls).map(createRollSummaryLine)
  ];
}

function createCostSummaryLine(options: RitualCastOptions, cost: RitualCost | null): string {
  if (!cost) {
    return options.spendResource ? "Custo: não resolvido" : "Custo: não gasto";
  }

  const suffix = options.spendResource ? "gasto" : "não gasto";
  return `Custo: ${cost.amount} ${cost.resource} ${suffix}`;
}

function createRollSummaryLine(roll: WorkflowRollResult): string {
  return `${getRollLabel(roll)}: ${roll.formula} = ${Math.trunc(roll.total)}`;
}

function getRollLabel(roll: WorkflowRollResult): string {
  switch (roll.intent) {
    case "healing":
      return "Cura";
    case "damage":
      return "Dano";
    case "resistance":
      return "Resistência";
    case "attack":
      return "Ataque";
    case "ritual":
      return "Ritual";
    case "skill":
      return "Perícia";
    case "generic":
      return "Rolagem";
  }
}

function hasRitualOrExplicitCost(definition: AutomationDefinition): boolean {
  return definition.steps.some(isCostStep);
}

function isCostStep(step: AutomationStep): step is SpendResourceStep | SpendRitualCostStep {
  return step.type === "spendResource" || step.type === "spendRitualCost";
}
