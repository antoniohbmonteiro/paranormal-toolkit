import type { WorkflowTokenRef } from "../../../core/workflow/workflow-context";
import type { ItemUseContext } from "../../../features/item-use/item-use-context";
import { getCurrentWorkflowTargets } from "../../../features/automation/workflow-target-resolver";

type ActorWithTokenHelpers = Actor & {
  token?: TokenLike | null;
  getActiveTokens?: () => TokenLike[];
};

type ItemWithActor = Item & {
  actor?: Actor | null;
};

export type OrdemItemUsedHookPayload = {
  item?: unknown;
  actor?: unknown;
  token?: unknown;
  message?: unknown;
  chatMessageData?: unknown;
};

export function createContextFromRolledItem(item: Item, originalResult: unknown): ItemUseContext | null {
  const actor = resolveItemActor(item);

  return {
    source: "ordem-item-roll-wrapper",
    actor,
    item,
    token: resolveSourceToken(actor),
    targets: getCurrentWorkflowTargets(),
    originalResult
  };
}

export function createContextFromItemUsedHook(payload: OrdemItemUsedHookPayload): ItemUseContext | null {
  if (!isItem(payload.item)) return null;

  const actor = isActor(payload.actor) ? payload.actor : resolveItemActor(payload.item);

  return {
    source: "ordem-item-used-hook",
    actor,
    item: payload.item,
    token: resolvePayloadToken(payload.token) ?? resolveSourceToken(actor),
    targets: getCurrentWorkflowTargets(),
    message: payload.message,
    chatMessageData: payload.chatMessageData
  };
}

export function resolveItemActor(item: Item): Actor | null {
  const itemWithActor = item as ItemWithActor;

  if (isActor(itemWithActor.actor)) return itemWithActor.actor;
  if (isActor(item.parent)) return item.parent;

  return null;
}

function resolveSourceToken(actor: Actor | null): WorkflowTokenRef | null {
  const token = resolveActorToken(actor) ?? resolveSelectedTokenForActor(actor);
  return token ? createTokenRef(token) : null;
}

function resolvePayloadToken(value: unknown): WorkflowTokenRef | null {
  return isTokenLike(value) ? createTokenRef(value) : null;
}

function resolveActorToken(actor: Actor | null): TokenLike | null {
  if (!actor) return null;

  const actorWithHelpers = actor as ActorWithTokenHelpers;
  const directToken = actorWithHelpers.token;

  if (isTokenLike(directToken)) return directToken;

  const activeTokens = actorWithHelpers.getActiveTokens?.() ?? [];
  return activeTokens.find(isTokenLike) ?? null;
}

function resolveSelectedTokenForActor(actor: Actor | null): TokenLike | null {
  if (!actor) return null;

  return canvas?.tokens?.controlled?.find((token) => token.actor?.id === actor.id) ?? null;
}

function createTokenRef(token: TokenLike): WorkflowTokenRef {
  const actor = token.actor ?? null;

  return {
    tokenId: getNullableString(token.id),
    actorId: getNullableString(actor?.id),
    sceneId: getNullableString(token.scene?.id),
    name: token.name ?? actor?.name ?? "Origem sem nome"
  };
}

function isItem(value: unknown): value is Item {
  return Boolean(value && typeof value === "object" && "getFlag" in value && "setFlag" in value);
}

function isActor(value: unknown): value is Actor {
  return Boolean(value && typeof value === "object" && "update" in value && "items" in value);
}

function isTokenLike(value: unknown): value is TokenLike {
  return Boolean(value && typeof value === "object" && ("actor" in value || "id" in value || "name" in value));
}

function getNullableString(value: unknown): string | null {
  return typeof value === "string" && value.length > 0 ? value : null;
}
