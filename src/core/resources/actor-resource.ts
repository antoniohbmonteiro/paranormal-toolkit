export type ActorResource = "PV" | "SAN" | "PE" | "PD";

export type ResourceSnapshot = {
  value: number;
  max: number;
};

export type ResourceAdapter = {
  getResource(actor: Actor, resource: ActorResource): ResourceSnapshot;
  updateResourceValue(actor: Actor, resource: ActorResource, value: number): Promise<void>;
};
