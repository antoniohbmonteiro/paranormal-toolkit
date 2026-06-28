import type { ActorResource } from "../resources/actor-resource";
import type { ResourceOperation } from "../resources/resource-operation";
import type { WorkflowRollIntent } from "../workflow/workflow-roll";

export type AutomationDefinition = {
  version: 1;
  label: string;
  steps: AutomationStep[];
  ritualForms?: Partial<Record<AutomationRitualFormId, AutomationRitualFormDefinition>>;
  resistance?: AutomationResistanceDefinition;
};

export type AutomationResistanceEffect = "reducesByHalf";

export type AutomationResistanceSkill = "resilience" | "reflexes" | "will" | string;

export type AutomationDamageApplicationRounding = "floor" | "ceil" | "round";

export type AutomationDamageApplicationOption = {
  id: string;
  label: string;
  multiplier: number;
  rounding?: AutomationDamageApplicationRounding;
  summary?: string;
};

export type AutomationResistanceDefinition = {
  skill: AutomationResistanceSkill;
  label: string;
  effect: AutomationResistanceEffect;
  summary: string;
  damageApplications?: AutomationDamageApplicationOption[];
};

export type AutomationRitualFormId = "base" | "discente" | "verdadeiro";

export type AutomationRitualFormDefinition = {
  label?: string;
  extraCost?: number;
  rollFormulaOverrides?: Record<string, string>;
  notes?: string[];
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
