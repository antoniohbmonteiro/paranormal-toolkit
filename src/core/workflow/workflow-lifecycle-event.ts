import type { AutomationStep } from "../automation/automation-definition";
import type { WorkflowContext } from "./workflow-context";
import type { WorkflowPhase } from "./workflow-phase";

export type WorkflowLifecycleEvent = {
  phase: WorkflowPhase;
  context: WorkflowContext;
  stepIndex?: number;
  step?: AutomationStep;
  metadata?: Record<string, unknown>;
};

export type WorkflowLifecycleEventSummary = {
  phase: WorkflowPhase;
  stepIndex?: number;
  stepType?: string;
  timestamp: number;
};
