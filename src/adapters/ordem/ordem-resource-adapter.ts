import { failure, success } from "../../core/result";
import type {
  ActorResource,
  ResourceAdapter,
  ResourceReadFailure,
  ResourceReadResult
} from "../../core/resources/actor-resource";
import { ORDEM_RESOURCE_PATHS } from "./ordem-paths";

export class OrdemResourceAdapter implements ResourceAdapter {
  getResource(actor: Actor, resource: ActorResource): ResourceReadResult {
    const basePath = ORDEM_RESOURCE_PATHS[resource];
    const valuePath = `${basePath}.value`;
    const maxPath = `${basePath}.max`;

    const value = foundry.utils.getProperty(actor, valuePath);
    const max = foundry.utils.getProperty(actor, maxPath);

    const valueFailure = validateNumber(actor, resource, valuePath, value, "valor atual");
    if (valueFailure) return failure(valueFailure);

    const maxFailure = validateNumber(actor, resource, maxPath, max, "valor máximo");
    if (maxFailure) return failure(maxFailure);

    return success({
      value: value as number,
      max: max as number
    });
  }

  async updateResourceValue(actor: Actor, resource: ActorResource, value: number): Promise<void> {
    const basePath = ORDEM_RESOURCE_PATHS[resource];
    await actor.update({ [`${basePath}.value`]: value });
  }
}

function validateNumber(
  actor: Actor,
  resource: ActorResource,
  path: string,
  value: unknown,
  label: string
): ResourceReadFailure | null {
  if (value === undefined || value === null) {
    return {
      actor,
      actorId: actor.id ?? null,
      actorName: actor.name ?? "Ator sem nome",
      resource,
      reason: "resource-path-not-found",
      message: `Path de ${label} de ${resource} não encontrado: ${path}.`,
      path,
      value
    };
  }

  if (typeof value !== "number" || !Number.isFinite(value)) {
    return {
      actor,
      actorId: actor.id ?? null,
      actorName: actor.name ?? "Ator sem nome",
      resource,
      reason: "invalid-resource-value",
      message: `Valor inválido para ${label} de ${resource} em ${path}.`,
      path,
      value
    };
  }

  return null;
}
