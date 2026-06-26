import type { ActorResource, ResourceAdapter, ResourceSnapshot } from "../../core/resources/actor-resource";
import { ORDEM_PATHS } from "./ordem-paths";

const RESOURCE_PATHS: Record<ActorResource, string> = {
  PV: ORDEM_PATHS.resources.PV,
  SAN: ORDEM_PATHS.resources.SAN,
  PE: ORDEM_PATHS.resources.PE,
  PD: ORDEM_PATHS.resources.PD
};

export class OrdemResourceAdapter implements ResourceAdapter {
  getResource(actor: Actor, resource: ActorResource): ResourceSnapshot {
    const path = RESOURCE_PATHS[resource];

    return {
      value: this.getNumber(actor, `${path}.value`, 0),
      max: this.getNumber(actor, `${path}.max`, 0)
    };
  }

  async updateResourceValue(actor: Actor, resource: ActorResource, value: number): Promise<void> {
    const path = RESOURCE_PATHS[resource];
    await actor.update({ [`${path}.value`]: value });
  }

  private getNumber(document: unknown, path: string, fallback: number): number {
    const value = foundry.utils.getProperty(document, path);
    return typeof value === "number" ? value : fallback;
  }
}
