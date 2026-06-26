import type { ActorResource } from "../resources/actor-resource";
import type { ResourceOperation } from "../resources/resource-operation";
import type { WorkflowRollIntent } from "../workflow/workflow-roll";

export type AutomationDefinition = {
  version: 1;
  label: string;
  steps: AutomationStep[];
};

export type AutomationActorSelector = "self" | "target";

export type AutomationAmountSource = {
  amount?: number;
  amountFrom?: string;
};

export type SpendResourceStep = AutomationAmountSource & {
  type: "spendResource";
  actor: Extract<AutomationActorSelector, "self">;
  resource: Extract<ActorResource, "PE" | "PD">;
};

export type RollFormulaStep = {
  type: "rollFormula";
  id: string;
  formula: string;
  intent?: WorkflowRollIntent;
  damageType?: string;
};

export type ModifyResourceStep = AutomationAmountSource & {
  type: "modifyResource";
  actor: AutomationActorSelector;
  resource: ActorResource;
  operation: ResourceOperation;
};

export type SpendRitualCostStep = {
  type: "spendRitualCost";
};

export type ChatCardStep = {
  type: "chatCard";
  title?: string;
  message?: string;
};

export type AutomationStep = SpendResourceStep | SpendRitualCostStep | RollFormulaStep | ModifyResourceStep | ChatCardStep;
