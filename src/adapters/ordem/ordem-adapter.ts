import { failure, Result, success } from "../../core/result";
import { ORDEM_PATHS } from "./ordem-paths";

export type ResourceSnapshot = {
  value: number;
  max: number;
};

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

export type ResourceSpendSuccess = {
  actor: Actor;
  resource: "PE";
  amount: number;
  before: number;
  after: number;
  snapshot: OrdemActorSnapshot;
};

export type ResourceSpendFailureReason =
  | "invalid-amount"
  | "insufficient-resource"
  | "update-failed";

export type ResourceSpendFailure = {
  actor: Actor;
  resource: "PE";
  reason: ResourceSpendFailureReason;
  message: string;
  amount: number;
  current?: number;
  required?: number;
  cause?: unknown;
};

export type ResourceSpendResult = Result<ResourceSpendSuccess, ResourceSpendFailure>;

export class OrdemAdapter {
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
      pv: this.getResource(actor, ORDEM_PATHS.resources.pv),
      san: this.getResource(actor, ORDEM_PATHS.resources.san),
      pe: this.getResource(actor, ORDEM_PATHS.resources.pe),
      pd: this.getResource(actor, ORDEM_PATHS.resources.pd)
    };
  }

  getRitualDT(actor: Actor): number {
    return this.getNumber(actor, ORDEM_PATHS.ritual.dt, 0);
  }

  async spendPE(actor: Actor, amount: number): Promise<ResourceSpendResult> {
    if (!Number.isInteger(amount) || amount <= 0) {
      return failure({
        actor,
        resource: "PE",
        reason: "invalid-amount",
        message: "A quantidade de PE deve ser um inteiro positivo.",
        amount
      });
    }

    const before = this.getNumber(actor, `${ORDEM_PATHS.resources.pe}.value`, 0);

    if (before < amount) {
      return failure({
        actor,
        resource: "PE",
        reason: "insufficient-resource",
        message: `PE insuficiente. Atual: ${before}; custo: ${amount}.`,
        amount,
        current: before,
        required: amount
      });
    }

    const after = before - amount;

    try {
      await actor.update({ [`${ORDEM_PATHS.resources.pe}.value`]: after });
    } catch (cause) {
      return failure({
        actor,
        resource: "PE",
        reason: "update-failed",
        message: "Falha ao atualizar PE no ator.",
        amount,
        current: before,
        required: amount,
        cause
      });
    }

    return success({
      actor,
      resource: "PE",
      amount,
      before,
      after,
      snapshot: this.getActorSnapshot(actor)
    });
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
