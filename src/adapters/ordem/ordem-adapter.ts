import { ResourceEngine, type ResourceOperationResult } from "../../core/resources/resource-engine";
import type { ActorResource, ResourceAdapter, ResourceSnapshot } from "../../core/resources/actor-resource";
import { ORDEM_PATHS } from "./ordem-paths";
import { OrdemResourceAdapter } from "./ordem-resource-adapter";

export type ActorResourcesSnapshot = {
  pv: ResourceSnapshot;
  san: ResourceSnapshot;
  pe: ResourceSnapshot;
  pd: ResourceSnapshot;
};

export type OrdemActorSnapshot = {
  id: string | null;
  name: string;
  type: string;
  resources: ActorResourcesSnapshot;
  ritualDT: number;
};

export class OrdemAdapter implements ResourceAdapter {
  private readonly resourceAdapter = new OrdemResourceAdapter();
  private readonly resourceEngine = new ResourceEngine(this.resourceAdapter);

  getActorSnapshot(actor: Actor): OrdemActorSnapshot {
    return {
      id: actor.id ?? null,
      name: actor.name ?? "Ator sem nome",
      type: actor.type ?? "unknown",
      resources: this.getResources(actor),
      ritualDT: this.getRitualDT(actor)
    };
  }

  getResources(actor: Actor): ActorResourcesSnapshot {
    return {
      pv: this.getResource(actor, "PV"),
      san: this.getResource(actor, "SAN"),
      pe: this.getResource(actor, "PE"),
      pd: this.getResource(actor, "PD")
    };
  }

  getResource(actor: Actor, resource: ActorResource): ResourceSnapshot {
    return this.resourceAdapter.getResource(actor, resource);
  }

  async updateResourceValue(actor: Actor, resource: ActorResource, value: number): Promise<void> {
    await this.resourceAdapter.updateResourceValue(actor, resource, value);
  }

  getRitualDT(actor: Actor): number {
    return this.getNumber(actor, ORDEM_PATHS.ritual.dt, 0);
  }

  async spendPE(actor: Actor, amount: number): Promise<ResourceOperationResult> {
    return this.resourceEngine.spend(actor, "PE", amount);
  }

  async spendPD(actor: Actor, amount: number): Promise<ResourceOperationResult> {
    return this.resourceEngine.spend(actor, "PD", amount);
  }

  async damagePV(actor: Actor, amount: number): Promise<ResourceOperationResult> {
    return this.resourceEngine.damage(actor, "PV", amount);
  }

  async healPV(actor: Actor, amount: number): Promise<ResourceOperationResult> {
    return this.resourceEngine.heal(actor, "PV", amount);
  }

  async damageSAN(actor: Actor, amount: number): Promise<ResourceOperationResult> {
    return this.resourceEngine.damage(actor, "SAN", amount);
  }

  async recoverSAN(actor: Actor, amount: number): Promise<ResourceOperationResult> {
    return this.resourceEngine.recover(actor, "SAN", amount);
  }

  private getNumber(document: unknown, path: string, fallback: number): number {
    const value = foundry.utils.getProperty(document, path);
    return typeof value === "number" ? value : fallback;
  }
}
