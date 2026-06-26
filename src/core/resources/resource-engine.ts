import { failure, Result, success } from "../result";
import type { ActorResource, ResourceAdapter, ResourceSnapshot } from "./actor-resource";
import type { ResourceOperation } from "./resource-operation";
import type { ResourceOperationFailure, ResourceTransaction } from "./resource-transaction";

export type ResourceOperationResult = Result<ResourceTransaction, ResourceOperationFailure>;

type OperationCalculation = {
  afterValue: number;
  appliedAmount: number;
};

export class ResourceEngine {
  constructor(private readonly adapter: ResourceAdapter) {}

  async spend(actor: Actor, resource: "PE" | "PD", amount: number): Promise<ResourceOperationResult> {
    return this.execute(actor, resource, "spend", amount);
  }

  async damage(actor: Actor, resource: "PV" | "SAN", amount: number): Promise<ResourceOperationResult> {
    return this.execute(actor, resource, "damage", amount);
  }

  async heal(actor: Actor, resource: "PV", amount: number): Promise<ResourceOperationResult> {
    return this.execute(actor, resource, "heal", amount);
  }

  async recover(actor: Actor, resource: "SAN", amount: number): Promise<ResourceOperationResult> {
    return this.execute(actor, resource, "recover", amount);
  }

  private async execute(
    actor: Actor,
    resource: ActorResource,
    operation: ResourceOperation,
    amount: number
  ): Promise<ResourceOperationResult> {
    if (!Number.isInteger(amount) || amount <= 0) {
      return failure({
        actor,
        actorId: actor.id ?? null,
        actorName: actor.name ?? "Ator sem nome",
        resource,
        operation,
        reason: "invalid-amount",
        message: "A quantidade deve ser um inteiro positivo.",
        requestedAmount: amount
      });
    }

    const before = this.adapter.getResource(actor, resource);
    const calculation = this.calculate(operation, before, amount);

    if (!calculation.ok) {
      return failure({
        actor,
        actorId: actor.id ?? null,
        actorName: actor.name ?? "Ator sem nome",
        resource,
        operation,
        reason: calculation.error.reason,
        message: calculation.error.message,
        requestedAmount: amount,
        current: before.value,
        required: amount
      });
    }

    const { afterValue, appliedAmount } = calculation.value;
    const after: ResourceSnapshot = {
      value: afterValue,
      max: before.max
    };

    try {
      if (afterValue !== before.value) {
        await this.adapter.updateResourceValue(actor, resource, afterValue);
      }
    } catch (cause) {
      return failure({
        actor,
        actorId: actor.id ?? null,
        actorName: actor.name ?? "Ator sem nome",
        resource,
        operation,
        reason: "update-failed",
        message: `Falha ao atualizar ${resource} no ator.`,
        requestedAmount: amount,
        current: before.value,
        required: amount,
        cause
      });
    }

    return success({
      actor,
      actorId: actor.id ?? null,
      actorName: actor.name ?? "Ator sem nome",
      resource,
      operation,
      requestedAmount: amount,
      appliedAmount,
      before,
      after
    });
  }

  private calculate(
    operation: ResourceOperation,
    before: ResourceSnapshot,
    amount: number
  ): Result<OperationCalculation, { reason: "insufficient-resource"; message: string }> {
    switch (operation) {
      case "spend": {
        if (before.value < amount) {
          return failure({
            reason: "insufficient-resource",
            message: `Recurso insuficiente. Atual: ${before.value}; custo: ${amount}.`
          });
        }

        return success({
          afterValue: before.value - amount,
          appliedAmount: amount
        });
      }

      case "damage": {
        const afterValue = Math.max(0, before.value - amount);
        return success({
          afterValue,
          appliedAmount: before.value - afterValue
        });
      }

      case "heal":
      case "recover": {
        const afterValue = Math.min(before.max, before.value + amount);
        return success({
          afterValue,
          appliedAmount: afterValue - before.value
        });
      }
    }
  }
}
