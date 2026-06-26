import { hasValidAutomationFlag } from "./automation-flag-reader";

export function getActorItems(actor: Actor): Item[] {
  const maybeItems = actor.items;

  if (Array.isArray(maybeItems)) {
    return maybeItems;
  }

  if (maybeItems && typeof maybeItems === "object") {
    const withContents = maybeItems as { contents?: unknown };

    if (Array.isArray(withContents.contents)) {
      return withContents.contents.filter(isItem);
    }

    if (isIterable(maybeItems)) {
      return Array.from(maybeItems).filter(isItem);
    }
  }

  return [];
}

export function getFirstActorItem(actor: Actor): Item | null {
  return getActorItems(actor)[0] ?? null;
}

export function getFirstActorItemWithAutomation(actor: Actor): Item | null {
  return getActorItems(actor).find(hasValidAutomationFlag) ?? null;
}

function isIterable(value: unknown): value is Iterable<unknown> {
  return Boolean(value && typeof value === "object" && Symbol.iterator in value);
}

function isItem(value: unknown): value is Item {
  return Boolean(value && typeof value === "object" && "getFlag" in value && "setFlag" in value);
}
