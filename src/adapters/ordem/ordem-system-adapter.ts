import type { ActorResource, ResourceReadFailure, ResourceSnapshot } from "../../core/resources/actor-resource";
import { ORDEM_PATHS } from "./ordem-paths";
import { OrdemResourceAdapter } from "./ordem-resource-adapter";

export type ActorResourcesSnapshot = Record<ActorResource, ResourceSnapshot | null>;

export type OrdemActorSnapshot = {
  id: string | null;
  name: string;
  type: string;
  resources: ActorResourcesSnapshot;
  resourceErrors: ResourceReadFailure[];
  ritualDT: number;
};

export class OrdemSystemAdapter {
  constructor(private readonly resourceAdapter: OrdemResourceAdapter) {}

  getActorSnapshot(actor: Actor): OrdemActorSnapshot {
    const resources = this.getResources(actor);

    return {
      id: actor.id ?? null,
      name: actor.name ?? "Ator sem nome",
      type: actor.type ?? "unknown",
      resources: resources.values,
      resourceErrors: resources.errors,
      ritualDT: this.getRitualDT(actor)
    };
  }

  getRitualDT(actor: Actor): number {
    return this.getNumber(actor, ORDEM_PATHS.ritual.dt, 0);
  }

  private getResources(actor: Actor): { values: ActorResourcesSnapshot; errors: ResourceReadFailure[] } {
    const values: ActorResourcesSnapshot = {
      PV: null,
      SAN: null,
      PE: null,
      PD: null
    };
    const errors: ResourceReadFailure[] = [];

    for (const resource of ["PV", "SAN", "PE", "PD"] as const) {
      const result = this.resourceAdapter.getResource(actor, resource);

      if (result.ok) {
        values[resource] = result.value;
      } else {
        errors.push(result.error);
      }
    }

    return { values, errors };
  }

  private getNumber(document: unknown, path: string, fallback: number): number {
    const value = foundry.utils.getProperty(document, path);
    return typeof value === "number" && Number.isFinite(value) ? value : fallback;
  }
}
