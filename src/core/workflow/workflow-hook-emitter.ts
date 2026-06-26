import { MODULE_ID } from "../../constants";
import type { AutomationStep } from "../automation/automation-definition";
import type { WorkflowContext } from "./workflow-context";
import type { WorkflowLifecycleEvent } from "./workflow-lifecycle-event";
import type { WorkflowPhase } from "./workflow-phase";

export class WorkflowHookEmitter {
  emit(
    phase: WorkflowPhase,
    context: WorkflowContext,
    options: {
      stepIndex?: number;
      step?: AutomationStep;
      metadata?: Record<string, unknown>;
    } = {}
  ): WorkflowLifecycleEvent {
    const event: WorkflowLifecycleEvent = {
      phase,
      context,
      stepIndex: options.stepIndex,
      step: options.step,
      metadata: options.metadata
    };

    context.phases.push(phase);
    context.lifecycleEvents.push({
      phase,
      stepIndex: options.stepIndex,
      stepType: options.step?.type,
      timestamp: Date.now()
    });

    Hooks.callAll(`${MODULE_ID}.workflow.${phase}`, event);
    Hooks.callAll(`${MODULE_ID}.workflow.phase`, event);

    return event;
  }
}
