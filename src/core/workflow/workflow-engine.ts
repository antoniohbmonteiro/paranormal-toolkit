import type { AutomationDefinition } from "../automation/automation-definition";
import type { AutomationRunFailure, AutomationRunResult, AutomationRunner } from "../automation/automation-runner";
import { createWorkflowContext, type WorkflowContext, type WorkflowContextInput } from "./workflow-context";
import type { WorkflowHookEmitter } from "./workflow-hook-emitter";

export class WorkflowEngine {
  constructor(
    private readonly automation: AutomationRunner,
    private readonly hooks: WorkflowHookEmitter
  ) {}

  async runAutomation(definition: AutomationDefinition, input: WorkflowContextInput): Promise<AutomationRunResult> {
    const context = createWorkflowContext(input);

    this.hooks.emit("created", context, {
      metadata: {
        definitionLabel: definition.label,
        itemId: context.item.id ?? null,
        itemName: context.item.name ?? "Item sem nome"
      }
    });
    this.hooks.emit("beforeItemUse", context);
    this.hooks.emit("resolveTargets", context, {
      metadata: {
        targetCount: context.targets.length
      }
    });

    const result = await this.automation.run(definition, context);

    if (!result.ok) {
      this.emitFailed(context, result.error);
      return result;
    }

    this.hooks.emit("completed", context);
    return result;
  }

  private emitFailed(context: WorkflowContext, cause: AutomationRunFailure): void {
    this.hooks.emit("failed", context, {
      stepIndex: cause.stepIndex,
      step: cause.step,
      metadata: {
        reason: cause.reason,
        message: cause.message
      }
    });
  }

}
