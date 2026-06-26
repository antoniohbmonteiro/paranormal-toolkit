import type { ActorResource, ResourceSnapshot } from "./actor-resource";
import type { ResourceFailureReason, ResourceOperation } from "./resource-operation";

export type ResourceTransaction = {
  actor: Actor;
  actorId: string | null;
  actorName: string;
  resource: ActorResource;
  operation: ResourceOperation;
  requestedAmount: number;
  appliedAmount: number;
  before: ResourceSnapshot;
  after: ResourceSnapshot;
};

export type ResourceOperationFailure = {
  actor: Actor;
  actorId: string | null;
  actorName: string;
  resource: ActorResource;
  operation: ResourceOperation;
  reason: ResourceFailureReason;
  message: string;
  requestedAmount: number;
  current?: number;
  required?: number;
  cause?: unknown;
};
