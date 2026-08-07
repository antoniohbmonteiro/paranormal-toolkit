import type { WorkflowTarget } from "./workflow-target";

export type WorkflowTargetReference = {
  id: string;
  name: string;
  sceneId: string | null;
  tokenId: string | null;
  tokenUuid: string | null;
  actorId: string | null;
  actorUuid: string | null;
};

export function createWorkflowTargetReferences(
  targets: readonly WorkflowTarget[],
): WorkflowTargetReference[] {
  return targets.map((target, index) => createWorkflowTargetReference(target, index));
}

export function createWorkflowTargetReference(
  target: WorkflowTarget,
  index = 0,
): WorkflowTargetReference {
  const sceneId = normalizeNullableString(target.sceneId);
  const tokenId = normalizeNullableString(target.tokenId);
  const actorId = normalizeNullableString(target.actor?.id ?? target.actorId);
  const actorUuid = normalizeNullableString(target.actor?.uuid);
  const tokenUuid = sceneId && tokenId ? `Scene.${sceneId}.Token.${tokenId}` : null;

  return {
    id: createWorkflowTargetReferenceId({ sceneId, tokenId, actorId, actorUuid }, index),
    name: normalizeNullableString(target.name) ?? target.actor?.name ?? "Alvo sem nome",
    sceneId,
    tokenId,
    tokenUuid,
    actorId,
    actorUuid,
  };
}

export function createWorkflowTargetReferenceId(
  target: Pick<WorkflowTargetReference, "sceneId" | "tokenId" | "actorId" | "actorUuid">,
  index = 0,
): string {
  if (target.sceneId && target.tokenId) return `token:${target.sceneId}:${target.tokenId}`;
  if (target.actorUuid) return `actor:${target.actorUuid}`;
  if (target.actorId) return `actor:${target.actorId}`;
  return `target:${Math.max(0, Math.trunc(index)) + 1}`;
}

export function canResolveWorkflowTargetActor(target: WorkflowTargetReference): boolean {
  return Boolean(target.tokenUuid || target.actorUuid || target.actorId);
}

export async function resolveWorkflowTargetActor(
  target: WorkflowTargetReference,
): Promise<Actor | null> {
  if (target.tokenUuid) {
    const tokenDocument = await resolveUuid(target.tokenUuid);
    const tokenActor = readActorFromTokenDocument(tokenDocument);
    if (tokenActor && actorMatchesReference(tokenActor, target)) return tokenActor;
  }

  if (target.actorUuid) {
    const actor = asActor(await resolveUuid(target.actorUuid));
    if (actor && actorMatchesReference(actor, target)) return actor;
    if (isSyntheticActorUuid(target.actorUuid)) return null;
  }

  const actor = target.actorId ? game.actors?.get?.(target.actorId) : null;
  return actorMatchesReference(actor, target) ? actor : null;
}

async function resolveUuid(uuid: string): Promise<unknown> {
  try {
    return await fromUuid(uuid);
  } catch {
    return null;
  }
}

function readActorFromTokenDocument(value: unknown): Actor | null {
  if (!value || typeof value !== "object") return null;
  return asActor((value as { actor?: unknown }).actor);
}

function actorMatchesReference(
  value: unknown,
  target: WorkflowTargetReference,
): value is Actor {
  const actor = asActor(value);
  if (!actor) return false;
  if (target.actorUuid && actor.uuid) return actor.uuid === target.actorUuid;
  if (target.actorId) return actor.id === target.actorId;
  return true;
}

function asActor(value: unknown): Actor | null {
  return Boolean(value && typeof value === "object" && "system" in value)
    ? (value as Actor)
    : null;
}

function isSyntheticActorUuid(uuid: string): boolean {
  return uuid.startsWith("Scene.") || uuid.includes(".Token.");
}

function normalizeNullableString(value: unknown): string | null {
  return typeof value === "string" && value.trim() ? value.trim() : null;
}
