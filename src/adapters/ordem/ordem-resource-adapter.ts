import { failure, type Result, success } from "../../core/result";
import type {
  ActorResource,
  ResourceAdapter,
  ResourceReadFailure,
  ResourceReadResult
} from "../../core/resources/actor-resource";
import {
  ORDEM_AGENT_RESOURCE_PATHS,
  ORDEM_RESOURCE_PATH_CANDIDATES,
  ORDEM_THREAT_RESOURCE_PATHS
} from "./ordem-paths";

type ResourcePathResolution = Result<string, ResourceReadFailure>;

export class OrdemResourceAdapter implements ResourceAdapter {
  getResource(actor: Actor, resource: ActorResource): ResourceReadResult {
    const basePathResult = resolveResourceBasePath(actor, resource);

    if (!basePathResult.ok) {
      return failure(basePathResult.error);
    }

    const basePath = basePathResult.value;
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
    const basePathResult = resolveResourceBasePath(actor, resource);

    if (!basePathResult.ok) {
      throw new Error(basePathResult.error.message);
    }

    await actor.update({ [`${basePathResult.value}.value`]: value });
  }
}

function resolveResourceBasePath(actor: Actor, resource: ActorResource): ResourcePathResolution {
  const actorTypePath = getActorTypeResourcePath(actor.type, resource);

  if (actorTypePath && hasValidResourceShape(actor, actorTypePath)) {
    return success(actorTypePath);
  }

  const candidatePath = ORDEM_RESOURCE_PATH_CANDIDATES[resource].find((path) =>
    hasValidResourceShape(actor, path)
  );

  if (candidatePath) {
    return success(candidatePath);
  }

  return failure({
    actor,
    actorId: actor.id ?? null,
    actorName: actor.name ?? "Ator sem nome",
    actorType: actor.type ?? "unknown",
    resource,
    reason: "resource-path-not-found",
    message: createMissingResourcePathMessage(actor, resource),
    path: ORDEM_RESOURCE_PATH_CANDIDATES[resource].join(" | ")
  });
}

function getActorTypeResourcePath(actorType: string | undefined, resource: ActorResource): string | null {
  if (actorType === "threat") {
    return ORDEM_THREAT_RESOURCE_PATHS[resource] ?? null;
  }

  if (actorType === "agent") {
    return ORDEM_AGENT_RESOURCE_PATHS[resource];
  }

  return null;
}

function hasValidResourceShape(actor: Actor, basePath: string): boolean {
  const value = foundry.utils.getProperty(actor, `${basePath}.value`);
  const max = foundry.utils.getProperty(actor, `${basePath}.max`);

  return typeof value === "number" && Number.isFinite(value) && typeof max === "number" && Number.isFinite(max);
}

function createMissingResourcePathMessage(actor: Actor, resource: ActorResource): string {
  const actorType = actor.type ?? "unknown";
  const candidates = ORDEM_RESOURCE_PATH_CANDIDATES[resource].join(", ");

  return `${resource} não encontrado no ator ${actor.name ?? "sem nome"} (${actorType}). Paths testados: ${candidates}.`;
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
      actorType: actor.type ?? "unknown",
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
      actorType: actor.type ?? "unknown",
      resource,
      reason: "invalid-resource-value",
      message: `Valor inválido para ${label} de ${resource} em ${path}.`,
      path,
      value
    };
  }

  return null;
}
