export type WorkflowRollIntent = "attack" | "damage" | "healing" | "resistance" | "skill" | "ritual" | "generic";

export type WorkflowRollRequest = {
  id: string;
  formula: string;
  intent: WorkflowRollIntent;
  damageType?: string;
  sourceStepIndex?: number;
};

export type WorkflowRollResult = WorkflowRollRequest & {
  total: number;
  roll: Roll;
};
