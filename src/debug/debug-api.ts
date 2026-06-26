import type { ToolkitServices } from "../toolkit-services";
import { createAutomationDebugApi, type AutomationDebugApi } from "./automation-debug-api";
import { ActorDebugApi, createActorDebugApi } from "./actor-debug-api";
import { createDebugOutputApi, type DebugOutputApi } from "./output/debug-output-api";
import { createRitualDebugApi, type RitualDebugApi } from "./ritual-debug-api";
import { createWorkflowDebugApi, type WorkflowDebugApi } from "./workflow-debug-api";

export type DebugApi = {
  actor: ActorDebugApi;
  automation: AutomationDebugApi;
  ritual: RitualDebugApi;
  workflow: WorkflowDebugApi;
  output: DebugOutputApi;

  /** @deprecated Use ParanormalToolkit.debug.actor.getSelected() */
  getSelectedActor(): Actor | null;

  /** @deprecated Use ParanormalToolkit.debug.actor.logResources() */
  logSelectedActorResources(): void;

  /** @deprecated Use ParanormalToolkit.debug.actor.spendPE(amount) */
  spendSelectedActorPE(amount: number): Promise<void>;
};

export function createDebugApi(services: ToolkitServices): DebugApi {
  const actor = createActorDebugApi(services);
  const automation = createAutomationDebugApi(services);
  const ritual = createRitualDebugApi(services);
  const workflow = createWorkflowDebugApi(services);
  const output = createDebugOutputApi();

  return {
    actor,
    automation,
    ritual,
    workflow,
    output,

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
