import type {
  AutomationActorSelector,
  AutomationDefinition,
  AutomationRitualFormDefinition,
  AutomationRitualFormId,
  AutomationStep,
  ChatCardStep,
  ModifyResourceStep,
  RollFormulaStep,
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
import {
  getRitualCastVariantLabel,
  RITUAL_CAST_VARIANTS,
  type RitualCastOptions,
  type RitualCastVariant,
  type RitualCastVariantOption
} from "./ritual-cast-options";

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

const BASE_RITUAL_FORM: AutomationRitualFormDefinition = {
  label: "Padrão"
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
    const variantOptions = createRitualCastVariantOptions(definition, cost);
    const options = await requestRitualCastOptions({
      actor: context.actor,
      ritual: context.item,
      targetNames: context.targets.map((target) => target.name),
      cost,
      defaultSpendResource: hasRitualOrExplicitCost(definition),
      variantOptions
    });

    if (!options) {
      return { status: "cancelled" };
    }

    const form = resolveRitualForm(definition, options.variant);
    const preparationDefinition = createPreparationDefinition(definition, options, form, cost);

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
    const summaryLines = createRitualSummaryLines(options, form, cost, workflowContext);

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

function createPreparationDefinition(
  definition: AutomationDefinition,
  options: RitualCastOptions,
  form: AutomationRitualFormDefinition,
  cost: RitualCost | null
): RitualPreparationDefinition {
  const steps: RitualPreparationStep[] = [];

  for (const step of definition.steps) {
    if (step.type === "modifyResource" || step.type === "chatCard") continue;
    if (isCostStep(step) && !options.spendResource) continue;

    steps.push(applyFormOverridesToStep(step, form));
  }

  if (options.spendResource && cost && isPositiveNumber(form.extraCost)) {
    steps.push({
      type: "spendResource",
      actor: "self",
      resource: cost.resource,
      amount: form.extraCost
    });
  }

  return {
    ...definition,
    label: `${definition.label} · Conjuração assistida`,
    steps
  };
}

function applyFormOverridesToStep(step: RitualPreparationStep, form: AutomationRitualFormDefinition): RitualPreparationStep {
  if (step.type !== "rollFormula") return step;

  const formula = form.rollFormulaOverrides?.[step.id];
  if (!formula) return step;

  return {
    ...step,
    formula
  } satisfies RollFormulaStep;
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

function createRitualSummaryLines(
  options: RitualCastOptions,
  form: AutomationRitualFormDefinition,
  cost: RitualCost | null,
  context: WorkflowContext
): string[] {
  return [
    `Forma: ${getRitualCastVariantLabel(options.variant)}`,
    createCostSummaryLine(options, form, cost),
    ...Object.values(context.rolls).flatMap(createRollSummaryLines),
    ...createFormNoteLines(form)
  ];
}

function createCostSummaryLine(options: RitualCastOptions, form: AutomationRitualFormDefinition, cost: RitualCost | null): string {
  const extraCost = form.extraCost ?? 0;

  if (!cost) {
    if (!options.spendResource) return "Custo: não gasto";
    return extraCost > 0 ? `Custo: não resolvido (+${extraCost} extra)` : "Custo: não resolvido";
  }

  if (!options.spendResource) {
    return extraCost > 0 ? `Custo: ${cost.amount} ${cost.resource} + ${extraCost} extra não gasto` : `Custo: ${cost.amount} ${cost.resource} não gasto`;
  }

  if (extraCost > 0) {
    return `Custo: ${cost.amount + extraCost} ${cost.resource} gasto (${cost.amount} base + ${extraCost} extra)`;
  }

  return `Custo: ${cost.amount} ${cost.resource} gasto`;
}

function createRollSummaryLines(roll: WorkflowRollResult): string[] {
  const label = getRollLabel(roll);
  const lines = [`${label}: ${roll.formula} = ${Math.trunc(roll.total)}`];
  const breakdown = describeRollBreakdown(roll.roll);

  if (breakdown) {
    lines.push(`Dados: ${breakdown}`);
  }

  if (roll.damageType) {
    lines.push(`Tipo: ${formatLabel(roll.damageType)}`);
  }

  return lines;
}

type RollBreakdownTerm = {
  operator?: unknown;
  number?: unknown;
  faces?: unknown;
  results?: unknown;
};

type RollBreakdownPart = {
  value: string;
  operator?: "+" | "-";
};

type RollDieResult = {
  result?: unknown;
  active?: unknown;
  discarded?: unknown;
};

function describeRollBreakdown(roll: unknown): string | null {
  if (!roll || typeof roll !== "object") return null;

  const terms = (roll as { terms?: unknown }).terms;
  if (!Array.isArray(terms)) return null;

  const parts: string[] = [];
  let pendingOperator: "+" | "-" = "+";

  for (const term of terms) {
    if (!term || typeof term !== "object") continue;

    const typedTerm = term as RollBreakdownTerm;

    if (typedTerm.operator === "+" || typedTerm.operator === "-") {
      pendingOperator = typedTerm.operator;
      continue;
    }

    const part = describeBreakdownPart(typedTerm);

    if (!part) continue;

    appendRollBreakdownPart(parts, part.operator ?? pendingOperator, part.value);
    pendingOperator = "+";
  }

  return parts.length > 0 ? parts.join(" ") : null;
}

function describeBreakdownPart(term: RollBreakdownTerm): RollBreakdownPart | null {
  const diceResults = describeDieResults(term);

  if (diceResults.length > 0) {
    return { value: `(${diceResults.join(", ")})` };
  }

  return describeConstantTerm(term);
}

function describeDieResults(term: RollBreakdownTerm): string[] {
  if (!Array.isArray(term.results)) return [];

  return term.results.flatMap((result): string[] => {
    if (!result || typeof result !== "object") return [];

    const dieResult = result as RollDieResult;

    if (typeof dieResult.result !== "number" || !Number.isFinite(dieResult.result)) {
      return [];
    }

    const isActive = dieResult.active !== false && dieResult.discarded !== true;
    return isActive ? [String(dieResult.result)] : [];
  });
}

function describeConstantTerm(term: RollBreakdownTerm): RollBreakdownPart | null {
  if (typeof term.faces === "number") return null;

  if (typeof term.number === "number" && Number.isFinite(term.number)) {
    const value = Math.abs(term.number);
    return {
      value: String(value),
      operator: term.number < 0 ? "-" : undefined
    };
  }

  return null;
}

function appendRollBreakdownPart(parts: string[], operator: "+" | "-", value: string): void {
  if (parts.length === 0) {
    parts.push(operator === "-" ? `- ${value}` : value);
    return;
  }

  parts.push(`${operator} ${value}`);
}

function formatLabel(value: string): string {
  if (value.length === 0) return value;
  return `${value.charAt(0).toUpperCase()}${value.slice(1)}`;
}

function createFormNoteLines(form: AutomationRitualFormDefinition): string[] {
  return (form.notes ?? []).map((note) => `Observação: ${note}`);
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

function createRitualCastVariantOptions(definition: AutomationDefinition, cost: RitualCost | null): RitualCastVariantOption[] {
  return RITUAL_CAST_VARIANTS.map((variant) => {
    const form = resolveOptionalRitualForm(definition, variant);
    const enabled = variant === "base" || form !== null;
    const effectiveForm = form ?? (variant === "base" ? BASE_RITUAL_FORM : null);

    return {
      variant,
      label: effectiveForm?.label ?? getRitualCastVariantLabel(variant),
      enabled,
      details: effectiveForm ? createVariantDetails(effectiveForm, cost) : [],
      unavailableReason: enabled ? undefined : "não disponível neste ritual"
    };
  });
}

function createVariantDetails(form: AutomationRitualFormDefinition, cost: RitualCost | null): string[] {
  const details: string[] = [];
  const formulas = Object.values(form.rollFormulaOverrides ?? {});

  if (formulas.length > 0) {
    details.push(formulas.join(", "));
  }

  if (isPositiveNumber(form.extraCost)) {
    details.push(cost ? `+${form.extraCost} ${cost.resource}` : `+${form.extraCost} PE/PD`);
  } else {
    details.push("custo base");
  }

  return details;
}

function resolveRitualForm(definition: AutomationDefinition, variant: RitualCastVariant): AutomationRitualFormDefinition {
  return resolveOptionalRitualForm(definition, variant) ?? BASE_RITUAL_FORM;
}

function resolveOptionalRitualForm(definition: AutomationDefinition, variant: AutomationRitualFormId): AutomationRitualFormDefinition | null {
  return definition.ritualForms?.[variant] ?? null;
}

function hasRitualOrExplicitCost(definition: AutomationDefinition): boolean {
  return definition.steps.some(isCostStep);
}

function isCostStep(step: AutomationStep): step is SpendResourceStep | SpendRitualCostStep {
  return step.type === "spendResource" || step.type === "spendRitualCost";
}

function isPositiveNumber(value: unknown): value is number {
  return typeof value === "number" && Number.isFinite(value) && value > 0;
}
