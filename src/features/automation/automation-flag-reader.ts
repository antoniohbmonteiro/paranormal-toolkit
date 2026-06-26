import { MODULE_ID } from "../../constants";
import type { ActorResource } from "../../core/resources/actor-resource";
import type { ResourceOperation } from "../../core/resources/resource-operation";
import type {
  AutomationActorSelector,
  AutomationDefinition,
  AutomationStep,
  ChatCardStep,
  ModifyResourceStep,
  RollFormulaStep,
  SpendResourceStep,
  SpendRitualCostStep
} from "../../core/automation/automation-definition";
import { failure, type Result, success } from "../../core/result";

export type AutomationFlagFailureReason = "missing-automation" | "invalid-automation";

export type AutomationFlagFailure = {
  reason: AutomationFlagFailureReason;
  message: string;
  value?: unknown;
};

export type AutomationFlagResult = Result<AutomationDefinition, AutomationFlagFailure>;

export function readAutomationDefinition(item: Item): AutomationFlagResult {
  const value = item.getFlag(MODULE_ID, "automation");

  if (value === undefined || value === null) {
    return failure({
      reason: "missing-automation",
      message: `Item ${item.name} não possui automação do Paranormal Toolkit.`
    });
  }

  if (!isAutomationDefinition(value)) {
    return failure({
      reason: "invalid-automation",
      message: `Automação do item ${item.name} é inválida ou não é suportada.`,
      value
    });
  }

  return success(value);
}

export function getTestRitualCostAutomationDefinition(): AutomationDefinition {
  return {
    version: 1,
    label: "Gasto de custo de ritual",
    steps: [
      {
        type: "spendRitualCost"
      },
      {
        type: "chatCard",
        title: "Gasto de custo de ritual",
        message: "Calcula o custo do ritual pelo círculo e gasta o recurso configurado."
      }
    ]
  };
}

export function getTestRitualHealingAutomationDefinition(formula = "1d8"): AutomationDefinition {
  return {
    version: 1,
    label: "Ritual de cura simples",
    steps: [
      {
        type: "spendRitualCost"
      },
      {
        type: "rollFormula",
        id: "healing",
        formula
      },
      {
        type: "modifyResource",
        actor: "target",
        resource: "PV",
        operation: "heal",
        amountFrom: "healing.total"
      },
      {
        type: "chatCard",
        title: "Ritual de cura simples",
        message: "Gasta o custo do ritual, rola a fórmula de cura e recupera PV do alvo."
      }
    ]
  };
}

export function getTestRitualDamageAutomationDefinition(formula = "1d8"): AutomationDefinition {
  return {
    version: 1,
    label: "Ritual de dano simples",
    steps: [
      {
        type: "spendRitualCost"
      },
      {
        type: "rollFormula",
        id: "damage",
        formula
      },
      {
        type: "modifyResource",
        actor: "target",
        resource: "PV",
        operation: "damage",
        amountFrom: "damage.total"
      },
      {
        type: "chatCard",
        title: "Ritual de dano simples",
        message: "Gasta o custo do ritual, rola a fórmula de dano e causa dano em PV do alvo."
      }
    ]
  };
}

export function getTestHealingAutomationDefinition(): AutomationDefinition {
  return {
    version: 1,
    label: "Cura simples de teste",
    steps: [
      {
        type: "spendResource",
        actor: "self",
        resource: "PE",
        amount: 1
      },
      {
        type: "rollFormula",
        id: "healing",
        formula: "1d8"
      },
      {
        type: "modifyResource",
        actor: "target",
        resource: "PV",
        operation: "heal",
        amountFrom: "healing.total"
      },
      {
        type: "chatCard",
        title: "Cura simples de teste",
        message: "Gasta 1 PE, rola 1d8 e cura PV do alvo."
      }
    ]
  };
}

export async function setAutomationDefinition(item: Item, definition: AutomationDefinition): Promise<void> {
  await item.setFlag(MODULE_ID, "automation", definition);
}

function isAutomationDefinition(value: unknown): value is AutomationDefinition {
  if (!value || typeof value !== "object") return false;

  const candidate = value as Partial<AutomationDefinition>;

  return candidate.version === 1 && isNonEmptyString(candidate.label) && Array.isArray(candidate.steps) && candidate.steps.every(isAutomationStep);
}

function isAutomationStep(value: unknown): value is AutomationStep {
  if (!value || typeof value !== "object") return false;

  const candidate = value as Partial<AutomationStep>;

  switch (candidate.type) {
    case "spendResource":
      return isSpendResourceStep(candidate);
    case "spendRitualCost":
      return isSpendRitualCostStep(candidate);
    case "rollFormula":
      return isRollFormulaStep(candidate);
    case "modifyResource":
      return isModifyResourceStep(candidate);
    case "chatCard":
      return isChatCardStep(candidate);
    default:
      return false;
  }
}

function isSpendResourceStep(value: Partial<AutomationStep>): value is SpendResourceStep {
  const candidate = value as Partial<SpendResourceStep>;

  return (
    candidate.type === "spendResource" &&
    candidate.actor === "self" &&
    (candidate.resource === "PE" || candidate.resource === "PD") &&
    hasAmountSource(candidate)
  );
}

function isSpendRitualCostStep(value: Partial<AutomationStep>): value is SpendRitualCostStep {
  const candidate = value as Partial<SpendRitualCostStep>;

  return candidate.type === "spendRitualCost";
}

function isRollFormulaStep(value: Partial<AutomationStep>): value is RollFormulaStep {
  const candidate = value as Partial<RollFormulaStep>;

  return candidate.type === "rollFormula" && isNonEmptyString(candidate.id) && isNonEmptyString(candidate.formula);
}

function isModifyResourceStep(value: Partial<AutomationStep>): value is ModifyResourceStep {
  const candidate = value as Partial<ModifyResourceStep>;

  return (
    candidate.type === "modifyResource" &&
    isAutomationActorSelector(candidate.actor) &&
    isActorResource(candidate.resource) &&
    isResourceOperation(candidate.operation) &&
    hasAmountSource(candidate)
  );
}

function isChatCardStep(value: Partial<AutomationStep>): value is ChatCardStep {
  const candidate = value as Partial<ChatCardStep>;

  return (
    candidate.type === "chatCard" &&
    (candidate.title === undefined || typeof candidate.title === "string") &&
    (candidate.message === undefined || typeof candidate.message === "string")
  );
}

function hasAmountSource(value: { amount?: unknown; amountFrom?: unknown }): boolean {
  return (
    (typeof value.amount === "number" && Number.isInteger(value.amount) && value.amount > 0) ||
    isNonEmptyString(value.amountFrom)
  );
}

function isAutomationActorSelector(value: unknown): value is AutomationActorSelector {
  return value === "self" || value === "target";
}

function isActorResource(value: unknown): value is ActorResource {
  return value === "PV" || value === "SAN" || value === "PE" || value === "PD";
}

function isResourceOperation(value: unknown): value is ResourceOperation {
  return value === "spend" || value === "damage" || value === "heal" || value === "recover";
}

function isNonEmptyString(value: unknown): value is string {
  return typeof value === "string" && value.length > 0;
}
