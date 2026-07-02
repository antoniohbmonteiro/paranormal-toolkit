export type MultiTargetSourceItemContext = {
  actorId: string | null;
  itemId: string | null;
  itemName: string | null;
};

export function resolveMultiTargetSourceItem(context: MultiTargetSourceItemContext | null): Item | null {
  if (!context) return null;

  const sourceActor = context.actorId ? resolveActorById(context.actorId) : null;
  const actorItem = sourceActor ? resolveEmbeddedItem(sourceActor, context.itemId, context.itemName) : null;
  if (actorItem) return actorItem;

  return resolveWorldItem(context.itemId, context.itemName);
}

function resolveEmbeddedItem(actor: Actor, itemId: string | null, itemName: string | null): Item | null {
  const items = actor.items as {
    get?: (id: string) => unknown;
    find?: (predicate: (item: unknown) => boolean) => unknown;
  } | undefined;

  if (itemId) {
    const item = items?.get?.(itemId);
    if (isItemLike(item)) return item;
  }

  const normalizedName = normalizeLookupName(itemName);
  if (normalizedName) {
    const item = items?.find?.((candidate) => {
      if (!isItemLike(candidate)) return false;
      return normalizeLookupName(candidate.name) === normalizedName;
    });
    if (isItemLike(item)) return item;
  }

  return null;
}

function resolveWorldItem(itemId: string | null, itemName: string | null): Item | null {
  const items = (game as { items?: {
    get?: (id: string) => unknown;
    find?: (predicate: (item: unknown) => boolean) => unknown;
  } }).items;

  if (itemId) {
    const item = items?.get?.(itemId);
    if (isItemLike(item)) return item;
  }

  const normalizedName = normalizeLookupName(itemName);
  if (normalizedName) {
    const item = items?.find?.((candidate) => {
      if (!isItemLike(candidate)) return false;
      return normalizeLookupName(candidate.name) === normalizedName;
    });
    if (isItemLike(item)) return item;
  }

  return null;
}

function resolveActorById(actorId: string): Actor | null {
  const actors = game.actors as { get?: (id: string) => unknown } | undefined;
  const actor = actors?.get?.(actorId);
  return isActorLike(actor) ? actor : null;
}

function isActorLike(value: unknown): value is Actor {
  return Boolean(value && typeof value === "object" && "system" in value);
}

function isItemLike(value: unknown): value is Item {
  return Boolean(
    value
      && typeof value === "object"
      && "getFlag" in value
      && typeof (value as { name?: unknown }).name === "string"
  );
}

function normalizeLookupName(value: string | null | undefined): string | null {
  const normalized = value?.trim().toLocaleLowerCase();
  return normalized && normalized.length > 0 ? normalized : null;
}
