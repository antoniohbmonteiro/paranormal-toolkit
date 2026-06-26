import { MODULE_ID } from "../../constants";
import type { AutomationStep } from "../automation/automation-definition";
import type { ResourceTransaction } from "../resources/resource-transaction";
import type { WorkflowContext } from "./workflow-context";
import type { WorkflowDamageInstance } from "./workflow-damage";
import type { WorkflowHealingInstance } from "./workflow-healing";
import type { WorkflowLifecycleEvent } from "./workflow-lifecycle-event";
import type { WorkflowPhase } from "./workflow-phase";
import type { WorkflowRollRequest, WorkflowRollResult } from "./workflow-roll";

export class WorkflowHookEmitter {
  emit(
    phase: WorkflowPhase,
    context: WorkflowContext,
    options: {
      stepIndex?: number;
      step?: AutomationStep;
      rollRequest?: WorkflowRollRequest;
      rollResult?: WorkflowRollResult;
      damage?: WorkflowDamageInstance;
      healing?: WorkflowHealingInstance;
      resourceTransaction?: ResourceTransaction;
      metadata?: Record<string, unknown>;
    } = {}
  ): WorkflowLifecycleEvent {
    const event: WorkflowLifecycleEvent = {
      phase,
      context,
      stepIndex: options.stepIndex,
      step: options.step,
      rollRequest: options.rollRequest,
      rollResult: options.rollResult,
      damage: options.damage,
      healing: options.healing,
      resourceTransaction: options.resourceTransaction,
      metadata: options.metadata
    };

    context.phases.push(phase);
    context.lifecycleEvents.push({
      phase,
      stepIndex: options.stepIndex,
      stepType: options.step?.type,
      rollId: options.rollRequest?.id ?? options.rollResult?.id,
      rollIntent: options.rollRequest?.intent ?? options.rollResult?.intent,
      damageId: options.damage?.id,
      healingId: options.healing?.id,
      resourceOperation: options.resourceTransaction?.operation,
      timestamp: Date.now()
    });

    Hooks.callAll(`${MODULE_ID}.workflow.${phase}`, event);
    Hooks.callAll(`${MODULE_ID}.workflow.phase`, event);

    return event;
  }
}
