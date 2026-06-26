import { failure } from "../result";
import type { ActorResource } from "../resources/actor-resource";
import type { ResourceEngine, ResourceOperationResult } from "../resources/resource-engine";
import type { ResourceOperation } from "../resources/resource-operation";

export type AutomationResourceExecutor = Pick<ResourceEngine, "spend" | "damage" | "heal" | "recover">;

export async function executeAutomationResourceOperation(
  resources: AutomationResourceExecutor,
  actor: Actor,
  resource: ActorResource,
  operation: ResourceOperation,
  amount: number
): Promise<ResourceOperationResult> {
  switch (operation) {
    case "spend":
      if (resource !== "PE" && resource !== "PD") {
        return invalidResourceOperation(actor, resource, operation, amount);
      }
      return resources.spend(actor, resource, amount);
    case "damage":
      if (resource !== "PV" && resource !== "SAN") {
        return invalidResourceOperation(actor, resource, operation, amount);
      }
      return resources.damage(actor, resource, amount);
    case "heal":
      if (resource !== "PV") {
        return invalidResourceOperation(actor, resource, operation, amount);
      }
      return resources.heal(actor, resource, amount);
    case "recover":
      if (resource !== "SAN") {
        return invalidResourceOperation(actor, resource, operation, amount);
      }
      return resources.recover(actor, resource, amount);
  }
}

function invalidResourceOperation(
  actor: Actor,
  resource: ActorResource,
  operation: ResourceOperation,
  amount: number
): ResourceOperationResult {
  return failure({
    actor,
    actorId: actor.id ?? null,
    actorName: actor.name ?? "Ator sem nome",
    resource,
    operation,
    reason: "invalid-resource-operation",
    message: `Operação ${operation} não é válida para ${resource}.`,
    requestedAmount: amount
  });
}
