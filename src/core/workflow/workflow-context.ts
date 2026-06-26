import type { RitualCost } from "../rituals/ritual-types";
import type { ResourceTransaction } from "../resources/resource-transaction";
import type { WorkflowDamageInstance } from "./workflow-damage";
import type { WorkflowHealingInstance } from "./workflow-healing";
import type { WorkflowLifecycleEventSummary } from "./workflow-lifecycle-event";
import type { WorkflowPhase } from "./workflow-phase";
import type { WorkflowRollRequest, WorkflowRollResult } from "./workflow-roll";
import type { WorkflowTarget, WorkflowTokenRef } from "./workflow-target";

export type { WorkflowDamageInstance };
export type { WorkflowHealingInstance };
export type { WorkflowRollIntent, WorkflowRollRequest, WorkflowRollResult } from "./workflow-roll";
export type { WorkflowTarget, WorkflowTokenRef };

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
  rollRequests: Record<string, WorkflowRollRequest>;
  rolls: Record<string, WorkflowRollResult>;
  ritualCosts: WorkflowRitualCostEntry[];
  damageInstances: WorkflowDamageInstance[];
  healingInstances: WorkflowHealingInstance[];
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
    rollRequests: {},
    rolls: {},
    ritualCosts: [],
    damageInstances: [],
    healingInstances: [],
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
