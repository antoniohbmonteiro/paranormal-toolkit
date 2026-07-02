export function resolveMultiTargetActorByName(targetName: string): Actor | null {
  const normalizedTargetName = normalizeLookupName(targetName);
  if (!normalizedTargetName) return null;

  const tokenActor = getCanvasTokens()
    .filter((token) => normalizeLookupName(getTokenName(token)) === normalizedTargetName)
    .map((token) => resolveTokenActor(token))
    .find(isActorLike) ?? null;

  if (tokenActor) return tokenActor;

  const actors = game.actors as { find?: (predicate: (actor: unknown) => boolean) => unknown } | undefined;
  const actor = actors?.find?.((candidate) => isActorLike(candidate) && normalizeLookupName(candidate.name) === normalizedTargetName);

  return isActorLike(actor) ? actor : null;
}

function getCanvasTokens(): unknown[] {
  const foundryCanvas = (globalThis as { canvas?: { tokens?: { placeables?: unknown[] } } }).canvas;
  const placeables = foundryCanvas?.tokens?.placeables;
  return Array.isArray(placeables) ? placeables : [];
}

function getTokenName(token: unknown): string | null {
  if (!token || typeof token !== "object") return null;

  const directName = (token as { name?: unknown }).name;
  if (typeof directName === "string") return directName;

  const documentName = (token as { document?: { name?: unknown } }).document?.name;
  if (typeof documentName === "string") return documentName;

  const actor = resolveTokenActor(token);
  return actor?.name ?? null;
}

function resolveTokenActor(value: unknown): Actor | null {
  if (!value || typeof value !== "object") return null;

  const actor = (value as { actor?: unknown }).actor;
  if (isActorLike(actor)) return actor;

  const documentActor = (value as { document?: { actor?: unknown } }).document?.actor;
  return isActorLike(documentActor) ? documentActor : null;
}

function isActorLike(value: unknown): value is Actor {
  return Boolean(value && typeof value === "object" && "system" in value);
}

function normalizeLookupName(value: string | null | undefined): string | null {
  const normalized = value?.trim().toLocaleLowerCase();
  return normalized && normalized.length > 0 ? normalized : null;
}
