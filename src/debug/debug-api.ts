import type { ToolkitServices } from "../toolkit-services";
import { ActorDebugApi, createActorDebugApi } from "./actor-debug-api";
import { createWorkflowDebugApi, type WorkflowDebugApi } from "./workflow-debug-api";

export type DebugApi = {
  actor: ActorDebugApi;
  workflow: WorkflowDebugApi;

  /** @deprecated Use ParanormalToolkit.debug.actor.getSelected() */
  getSelectedActor(): Actor | null;

  /** @deprecated Use ParanormalToolkit.debug.actor.logResources() */
  logSelectedActorResources(): void;

  /** @deprecated Use ParanormalToolkit.debug.actor.spendPE(amount) */
  spendSelectedActorPE(amount: number): Promise<void>;
};

export function createDebugApi(services: ToolkitServices): DebugApi {
  const actor = createActorDebugApi(services);
  const workflow = createWorkflowDebugApi(services);

  return {
    actor,
    workflow,

    getSelectedActor(): Actor | null {
      return actor.getSelected();
    },

    logSelectedActorResources(): void {
      actor.logResources();
    },

    async spendSelectedActorPE(amount: number): Promise<void> {
      await actor.spendPE(amount);
    }
  };
}
