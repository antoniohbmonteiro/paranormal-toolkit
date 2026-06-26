import type { RitualCost } from "../rituals/ritual-types";
import type { ResourceTransaction } from "../resources/resource-transaction";
import type { WorkflowLifecycleEventSummary } from "./workflow-lifecycle-event";
import type { WorkflowPhase } from "./workflow-phase";
import type { WorkflowTarget, WorkflowTokenRef } from "./workflow-target";

export type { WorkflowTarget, WorkflowTokenRef };

export type WorkflowRollResult = {
  id: string;
  formula: string;
  total: number;
  roll: Roll;
};

export type WorkflowRitualCostEntry = RitualCost & {
  itemId: string | null;
  itemName: string;
};

export type WorkflowContext = {
  id: string;
  sourceActor: Actor;
  sourceToken: WorkflowTokenRef | null;
  item: Item;
  targets: WorkflowTarget[];
  phases: WorkflowPhase[];
  lifecycleEvents: WorkflowLifecycleEventSummary[];
  rolls: Record<string, WorkflowRollResult>;
  ritualCosts: WorkflowRitualCostEntry[];
  resourceTransactions: ResourceTransaction[];
  flags: Record<string, unknown>;
};

export type WorkflowContextInput = {
  sourceActor: Actor;
  sourceToken?: WorkflowTokenRef | null;
  item: Item;
  targets?: WorkflowTarget[];
  flags?: Record<string, unknown>;
};

export function createWorkflowContext(input: WorkflowContextInput): WorkflowContext {
  return {
    id: createWorkflowId(),
    sourceActor: input.sourceActor,
    sourceToken: input.sourceToken ?? null,
    item: input.item,
    targets: input.targets ?? [],
    phases: [],
    lifecycleEvents: [],
    rolls: {},
    ritualCosts: [],
    resourceTransactions: [],
    flags: input.flags ?? {}
  };
}

function createWorkflowId(): string {
  const cryptoObject = globalThis.crypto as { randomUUID?: () => string } | undefined;

  if (cryptoObject?.randomUUID) {
    return cryptoObject.randomUUID();
  }

  return `workflow-${Date.now()}-${Math.random().toString(36).slice(2)}`;
}
