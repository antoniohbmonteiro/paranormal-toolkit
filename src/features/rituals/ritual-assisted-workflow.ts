import type {
  AutomationActorSelector,
  AutomationDamageApplicationOption,
  AutomationDefinition,
  AutomationResistanceDefinition,
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
import { createWorkflowContext, type WorkflowContext } from "../../core/workflow/workflow-context";
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
  choiceGroupId?: string;
  choiceGroupResolvedLabel?: string;
  actionSectionId: string;
  actionSectionTitle: string;
};

type AssistedResourceActionSection = {
  id: string;
  title: string;
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
      variantOptions,
      automationStatus: isGenericRitualDefinition(definition) ? "generic" : "assisted"
    });

    if (!options) {
      return { status: "cancelled" };
    }

    const form = resolveRitualForm(definition, options.variant);
    const preparationDefinition = createPreparationDefinition(definition, options, form, cost);

    if (preparationDefinition.steps.length === 0) {
      const workflowContext = createEmptyRitualWorkflowContext(context, options);
      return {
        status: "completed-without-actions",
        workflowContext,
        summaryLines: createRitualSummaryLines(definition, options, form, cost, workflowContext)
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
    const summaryLines = createRitualSummaryLines(definition, options, form, cost, workflowContext);

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
      actions.push(...createAssistedResourceActionsForActor(definition, step, actor, amount.value));
    }
  }

  return { ok: true, actions };
}

function createAssistedResourceActionsForActor(
  definition: AutomationDefinition,
  step: ModifyResourceStep,
  actor: Actor,
  baseAmount: number
): AssistedResourceAction[] {
  if (!shouldCreateDamageApplicationChoices(definition, step)) {
    return [createAssistedResourceAction(step, actor, baseAmount)];
  }

  const choiceGroupId = createChoiceGroupId();

  return getDamageApplicationOptions(definition).map((option) => {
    const amount = calculateDamageApplicationAmount(baseAmount, option);
    return createAssistedResourceAction(step, actor, amount, {
      option,
      choiceGroupId
    });
  });
}

function createAssistedResourceAction(
  step: ModifyResourceStep,
  actor: Actor,
  amount: number,
  damageChoice?: { option: AutomationDamageApplicationOption; choiceGroupId: string }
): AssistedResourceAction {
  const actorName = actor.name ?? "Ator sem nome";
  const actionSection = createActionSection(step);

  return {
    kind: "resource-operation",
    actor,
    actorName,
    resource: step.resource,
    operation: step.operation,
    amount,
    label: createActionLabel(step, actorName, amount, damageChoice?.option),
    executedLabel: createExecutedLabel(step, actorName, damageChoice?.option),
    choiceGroupId: damageChoice?.choiceGroupId,
    choiceGroupResolvedLabel: damageChoice ? "✓ Outra opção escolhida" : undefined,
    actionSectionId: actionSection.id,
    actionSectionTitle: actionSection.title
  };
}

function createActionLabel(
  step: ModifyResourceStep,
  actorName: string,
  amount: number,
  damageOption?: AutomationDamageApplicationOption
): string {
  void actorName;

  if (step.operation === "heal" && step.resource === "PV") {
    return `Curar ${amount} PV`;
  }

  if (step.operation === "damage") {
    if (damageOption) {
      const prefix = damageOption.id === "normal" ? "Normal" : damageOption.label;
      return `${prefix}: ${amount} PV`;
    }

    return `Dano: ${amount} PV`;
  }

  if (step.operation === "recover") {
    return `Recuperar ${amount} ${step.resource}`;
  }

  if (step.operation === "spend") {
    return `Gastar ${amount} ${step.resource}`;
  }

  return `Aplicar ${amount} ${step.resource}`;
}

function createExecutedLabel(step: ModifyResourceStep, actorName: string, damageOption?: AutomationDamageApplicationOption): string {
  if (step.operation === "heal" && step.resource === "PV") {
    return `✓ ${actorName} curado`;
  }

  if (step.operation === "damage") {
    if (damageOption) {
      const prefix = damageOption.id === "normal" ? "dano normal" : damageOption.label.toLowerCase();
      return `✓ ${prefix} aplicado`;
    }

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

function createActionSection(step: ModifyResourceStep): AssistedResourceActionSection {
  if (step.operation === "damage" && step.resource === "PV") {
    return { id: "apply-damage", title: "Aplicar danos" };
  }

  if (step.operation === "heal" && step.resource === "PV") {
    return { id: "apply-healing", title: "Aplicar cura" };
  }

  if (step.operation === "recover" || step.operation === "spend") {
    return { id: "apply-resources", title: "Aplicar recursos" };
  }

  return { id: "actions", title: "Ações" };
}

function shouldCreateDamageApplicationChoices(definition: AutomationDefinition, step: ModifyResourceStep): boolean {
  return step.operation === "damage" && step.resource === "PV" && getDamageApplicationOptions(definition).length > 1;
}

function getDamageApplicationOptions(definition: AutomationDefinition): AutomationDamageApplicationOption[] {
  const configured = definition.resistance?.damageApplications;

  if (configured && configured.length > 0) {
    return configured;
  }

  if (definition.resistance?.effect === "reducesByHalf") {
    return [
      { id: "normal", label: "Dano normal", multiplier: 1 },
      { id: "half", label: "Metade", multiplier: 0.5, rounding: "floor" }
    ];
  }

  return [{ id: "normal", label: "Dano normal", multiplier: 1 }];
}

function calculateDamageApplicationAmount(baseAmount: number, option: AutomationDamageApplicationOption): number {
  const rawAmount = baseAmount * option.multiplier;
  const roundedAmount = roundDamageApplicationAmount(rawAmount, option.rounding ?? "floor");
  return Math.max(0, roundedAmount);
}

function roundDamageApplicationAmount(amount: number, rounding: NonNullable<AutomationDamageApplicationOption["rounding"]>): number {
  switch (rounding) {
    case "ceil":
      return Math.ceil(amount);
    case "round":
      return Math.round(amount);
    case "floor":
      return Math.floor(amount);
  }
}

function createChoiceGroupId(): string {
  const cryptoObject = globalThis.crypto as { randomUUID?: () => string } | undefined;

  if (cryptoObject?.randomUUID) {
    return cryptoObject.randomUUID();
  }

  return `choice-${Date.now()}-${Math.random().toString(36).slice(2)}`;
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
  definition: AutomationDefinition,
  options: RitualCastOptions,
  form: AutomationRitualFormDefinition,
  cost: RitualCost | null,
  context: WorkflowContext
): string[] {
  return [
    `Forma: ${getRitualCastVariantLabel(options.variant)}`,
    createCostSummaryLine(options, form, cost),
    ...Object.values(context.rolls).flatMap(createRollSummaryLines),
    ...createResistanceSummaryLines(definition.resistance),
    ...createFormNoteLines(form)
  ];
}

function createCostSummaryLine(options: RitualCastOptions, form: AutomationRitualFormDefinition, cost: RitualCost | null): string {
  const finalCost = calculateFinalRitualCost(cost, form);

  if (!finalCost) {
    return options.spendResource ? "Custo: não resolvido" : "Custo: não gasto";
  }

  return options.spendResource
    ? `Custo: ${finalCost.amount} ${finalCost.resource} gasto`
    : `Custo: ${finalCost.amount} ${finalCost.resource} não gasto`;
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

function createResistanceSummaryLines(resistance: AutomationResistanceDefinition | undefined): string[] {
  if (!resistance) return [];

  return [
    `Resistência: ${resistance.summary}`,
    `Resistência Perícia: ${resistance.skill}`,
    `Resistência Rótulo: ${resistance.label}`
  ];
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
      finalCostText: effectiveForm ? createFinalCostText(cost, effectiveForm) : null,
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

  const finalCost = calculateFinalRitualCost(cost, form);
  details.push(finalCost ? `Custo final: ${finalCost.amount} ${finalCost.resource}` : "Custo final não resolvido");

  return details;
}


function calculateFinalRitualCost(
  cost: RitualCost | null,
  form: AutomationRitualFormDefinition
): { resource: RitualCost["resource"]; amount: number } | null {
  if (!cost) return null;
  return {
    resource: cost.resource,
    amount: cost.amount + (form.extraCost ?? 0)
  };
}

function createFinalCostText(cost: RitualCost | null, form: AutomationRitualFormDefinition): string | null {
  const finalCost = calculateFinalRitualCost(cost, form);
  return finalCost ? `${finalCost.amount} ${finalCost.resource}` : null;
}

function isGenericRitualDefinition(definition: AutomationDefinition): boolean {
  return (
    !definition.ritualForms &&
    !definition.resistance &&
    definition.steps.length > 0 &&
    definition.steps.every(isCostStep)
  );
}

function createEmptyRitualWorkflowContext(context: ItemUseContext, options: RitualCastOptions): WorkflowContext {
  return createWorkflowContext({
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
