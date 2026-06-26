import type { ResourceTransaction } from "../resources/resource-transaction";
import type { WorkflowContext } from "./workflow-context";
import type { WorkflowDamageInstance } from "./workflow-damage";
import type { WorkflowHealingInstance } from "./workflow-healing";
import type { WorkflowLifecycleEventSummary } from "./workflow-lifecycle-event";
import type { WorkflowPhase } from "./workflow-phase";
import type { WorkflowRollRequest, WorkflowRollResult } from "./workflow-roll";
import type { WorkflowTarget, WorkflowTokenRef } from "./workflow-target";

export type WorkflowActorDebugSnapshot = {
  actorId: string | null;
  actorName: string;
  actorType: string;
};

export type WorkflowSourceDebugSnapshot = WorkflowActorDebugSnapshot & {
  token: WorkflowTokenRef | null;
};

export type WorkflowItemDebugSnapshot = {
  itemId: string | null;
  itemName: string;
  itemType: string;
  itemUuid: string | null;
};

export type WorkflowTargetDebugSnapshot = {
  tokenId: string | null;
  actorId: string | null;
  sceneId: string | null;
  name: string;
  actorName?: string;
  actorType?: string;
};

export type WorkflowRollRequestDebugSnapshot = {
  id: string;
  formula: string;
  intent: string;
  damageType?: string;
  sourceStepIndex?: number;
};

export type WorkflowRollResultDebugSnapshot = WorkflowRollRequestDebugSnapshot & {
  total: number;
};

export type ResourceTransactionDebugSnapshot = {
  actorId: string | null;
  actorName: string;
  resource: string;
  operation: string;
  requestedAmount: number;
  appliedAmount: number;
  before: {
    value: number;
    max: number;
  };
  after: {
    value: number;
    max: number;
  };
};

export type WorkflowDebugSnapshot = {
  id: string;
  source: WorkflowSourceDebugSnapshot;
  item: WorkflowItemDebugSnapshot;
  targets: WorkflowTargetDebugSnapshot[];
  phases: WorkflowPhase[];
  lifecycleEvents: WorkflowLifecycleEventSummary[];
  rollRequests: Record<string, WorkflowRollRequestDebugSnapshot>;
  rolls: Record<string, WorkflowRollResultDebugSnapshot>;
  ritualCosts: WorkflowContext["ritualCosts"];
  damageInstances: WorkflowDamageInstance[];
  healingInstances: WorkflowHealingInstance[];
  resourceTransactions: ResourceTransactionDebugSnapshot[];
  flagKeys: string[];
};

export function createWorkflowDebugSnapshot(context: WorkflowContext | null): WorkflowDebugSnapshot | null {
  if (!context) return null;

  return {
    id: context.id,
    source: {
      ...createActorDebugSnapshot(context.sourceActor),
      token: context.sourceToken
    },
    item: createItemDebugSnapshot(context.item),
    targets: context.targets.map(createTargetDebugSnapshot),
    phases: [...context.phases],
    lifecycleEvents: context.lifecycleEvents.map((event) => ({ ...event })),
    rollRequests: mapRecord(context.rollRequests, createRollRequestDebugSnapshot),
    rolls: mapRecord(context.rolls, createRollResultDebugSnapshot),
    ritualCosts: context.ritualCosts.map((cost) => ({ ...cost })),
    damageInstances: context.damageInstances.map((damage) => ({ ...damage, tags: [...damage.tags] })),
    healingInstances: context.healingInstances.map((healing) => ({ ...healing, tags: [...healing.tags] })),
    resourceTransactions: context.resourceTransactions.map(createResourceTransactionDebugSnapshot),
    flagKeys: Object.keys(context.flags)
  };
}

export function createResourceTransactionDebugSnapshot(
  transaction: ResourceTransaction
): ResourceTransactionDebugSnapshot {
  return {
    actorId: transaction.actorId,
    actorName: transaction.actorName,
    resource: transaction.resource,
    operation: transaction.operation,
    requestedAmount: transaction.requestedAmount,
    appliedAmount: transaction.appliedAmount,
    before: {
      value: transaction.before.value,
      max: transaction.before.max
    },
    after: {
      value: transaction.after.value,
      max: transaction.after.max
    }
  };
}

function createActorDebugSnapshot(actor: Actor): WorkflowActorDebugSnapshot {
  return {
    actorId: actor.id ?? null,
    actorName: actor.name ?? "Ator sem nome",
    actorType: actor.type ?? "unknown"
  };
}

function createItemDebugSnapshot(item: Item): WorkflowItemDebugSnapshot {
  return {
    itemId: item.id ?? null,
    itemName: item.name ?? "Item sem nome",
    itemType: item.type ?? "unknown",
    itemUuid: item.uuid ?? null
  };
}

function createTargetDebugSnapshot(target: WorkflowTarget): WorkflowTargetDebugSnapshot {
  return {
    tokenId: target.tokenId,
    actorId: target.actorId,
    sceneId: target.sceneId,
    name: target.name,
    actorName: target.actor?.name,
    actorType: target.actor?.type
  };
}

function createRollRequestDebugSnapshot(roll: WorkflowRollRequest): WorkflowRollRequestDebugSnapshot {
  return {
    id: roll.id,
    formula: roll.formula,
    intent: roll.intent,
    damageType: roll.damageType,
    sourceStepIndex: roll.sourceStepIndex
  };
}

function createRollResultDebugSnapshot(roll: WorkflowRollResult): WorkflowRollResultDebugSnapshot {
  return {
    ...createRollRequestDebugSnapshot(roll),
    total: roll.total
  };
}

function mapRecord<TInput, TOutput>(
  record: Record<string, TInput>,
  mapper: (value: TInput) => TOutput
): Record<string, TOutput> {
  return Object.fromEntries(Object.entries(record).map(([key, value]) => [key, mapper(value)]));
}
