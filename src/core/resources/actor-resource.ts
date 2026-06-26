import type { Result } from "../result";

export type ActorResource = "PV" | "SAN" | "PE" | "PD";

export type ResourceSnapshot = {
  value: number;
  max: number;
};

export type ResourceReadFailureReason =
  | "resource-path-not-found"
  | "invalid-resource-value";

export type ResourceReadFailure = {
  actor: Actor;
  actorId: string | null;
  actorName: string;
  actorType: string;
  resource: ActorResource;
  reason: ResourceReadFailureReason;
  message: string;
  path?: string;
  value?: unknown;
};

export type ResourceReadResult = Result<ResourceSnapshot, ResourceReadFailure>;

export type ResourceAdapter = {
  getResource(actor: Actor, resource: ActorResource): ResourceReadResult;
  updateResourceValue(actor: Actor, resource: ActorResource, value: number): Promise<void>;
};
