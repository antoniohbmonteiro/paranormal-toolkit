import type { ResourceTransaction } from "../resources/resource-transaction";

export type WorkflowTokenRef = {
  tokenId: string | null;
  actorId: string | null;
  sceneId: string | null;
  name: string;
};

export type WorkflowTarget = WorkflowTokenRef & {
  actor: Actor | null;
};

export type WorkflowRollResult = {
  id: string;
  formula: string;
  total: number;
  roll: Roll;
};

export type WorkflowContext = {
  sourceActor: Actor;
  sourceToken: WorkflowTokenRef | null;
  item: Item;
  targets: WorkflowTarget[];
  rolls: Record<string, WorkflowRollResult>;
  resourceTransactions: ResourceTransaction[];
};

export type WorkflowContextInput = {
  sourceActor: Actor;
  sourceToken?: WorkflowTokenRef | null;
  item: Item;
  targets?: WorkflowTarget[];
};

export function createWorkflowContext(input: WorkflowContextInput): WorkflowContext {
  return {
    sourceActor: input.sourceActor,
    sourceToken: input.sourceToken ?? null,
    item: input.item,
    targets: input.targets ?? [],
    rolls: {},
    resourceTransactions: []
  };
}
