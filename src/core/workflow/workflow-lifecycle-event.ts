import type { AutomationStep } from "../automation/automation-definition";
import type { ResourceTransaction } from "../resources/resource-transaction";
import type { WorkflowContext } from "./workflow-context";
import type { WorkflowDamageInstance } from "./workflow-damage";
import type { WorkflowHealingInstance } from "./workflow-healing";
import type { WorkflowPhase } from "./workflow-phase";
import type { WorkflowRollRequest, WorkflowRollResult } from "./workflow-roll";

export type WorkflowLifecycleEvent = {
  phase: WorkflowPhase;
  context: WorkflowContext;
  stepIndex?: number;
  step?: AutomationStep;
  rollRequest?: WorkflowRollRequest;
  rollResult?: WorkflowRollResult;
  damage?: WorkflowDamageInstance;
  healing?: WorkflowHealingInstance;
  resourceTransaction?: ResourceTransaction;
  metadata?: Record<string, unknown>;
};

export type WorkflowLifecycleEventSummary = {
  phase: WorkflowPhase;
  stepIndex?: number;
  stepType?: string;
  rollId?: string;
  rollIntent?: string;
  damageId?: string;
  healingId?: string;
  resourceOperation?: string;
  timestamp: number;
};
