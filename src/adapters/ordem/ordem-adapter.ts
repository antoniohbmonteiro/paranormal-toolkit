import { ORDEM_PATHS } from "./ordem-paths";

type ResourceSnapshot = {
  value: number;
  max: number;
};

export type ActorResourcesSnapshot = {
  pv: ResourceSnapshot;
  san: ResourceSnapshot;
  pe: ResourceSnapshot;
  pd: ResourceSnapshot;
};

export class OrdemAdapter {
  getResources(actor: Actor): ActorResourcesSnapshot {
    return {
      pv: this.getResource(actor, ORDEM_PATHS.resources.pv),
      san: this.getResource(actor, ORDEM_PATHS.resources.san),
      pe: this.getResource(actor, ORDEM_PATHS.resources.pe),
      pd: this.getResource(actor, ORDEM_PATHS.resources.pd)
    };
  }

  getRitualDT(actor: Actor): number {
    return this.getNumber(actor, ORDEM_PATHS.ritual.dt, 0);
  }

  async spendPE(actor: Actor, amount: number): Promise<void> {
    if (!Number.isInteger(amount) || amount <= 0) {
      throw new Error("A quantidade de PE deve ser um inteiro positivo.");
    }

    const current = this.getNumber(actor, `${ORDEM_PATHS.resources.pe}.value`, 0);
    const next = Math.max(0, current - amount);

    await actor.update({ [`${ORDEM_PATHS.resources.pe}.value`]: next });
  }

  private getResource(actor: Actor, path: string): ResourceSnapshot {
    return {
      value: this.getNumber(actor, `${path}.value`, 0),
      max: this.getNumber(actor, `${path}.max`, 0)
    };
  }

  private getNumber(document: unknown, path: string, fallback: number): number {
    const value = foundry.utils.getProperty(document, path);
    return typeof value === "number" ? value : fallback;
  }
}
