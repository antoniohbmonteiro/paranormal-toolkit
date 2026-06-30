export type CollectionLike<T> = {
  get?: (id: string) => T | undefined;
};

export type GameLike = {
  messages?: CollectionLike<ChatMessageLike>;
  actors?: CollectionLike<ActorLike>;
  items?: CollectionLike<ItemLike>;
  i18n?: {
    localize?: (key: string) => string;
  };
};

export type ChatMessageLike = {
  getFlag?: (scope: string, key: string) => unknown;
};

export type ActorLike = {
  items?: CollectionLike<ItemLike>;
};

export type ItemLike = {
  id?: unknown;
  system?: unknown;
};

export function resolveRootElement(value: unknown): ParentNode | null {
  if (value instanceof Document || value instanceof HTMLElement || value instanceof DocumentFragment) {
    return value;
  }

  if (!value || typeof value !== "object") return null;

  const maybeIndexed = value as { 0?: unknown };
  return maybeIndexed[0] instanceof HTMLElement ? maybeIndexed[0] : null;
}

export function getGame(): GameLike | null {
  const value = (globalThis as { game?: unknown }).game;
  return isRecord(value) ? (value as GameLike) : null;
}

export function readStringPath(source: unknown, path: string): string | null {
  const value = readPath(source, path);
  return asStringOrNull(value);
}

export function readPath(source: unknown, path: string): unknown {
  return path.split(".").reduce<unknown>((current, key) => {
    if (!isRecord(current)) return null;
    return current[key];
  }, source);
}

export function readPrefixedValue(source: string, label: string): string | null {
  const separatorIndex = source.indexOf(":");
  if (separatorIndex < 0) return null;

  const key = normalizeText(source.slice(0, separatorIndex));
  if (key !== normalizeText(label)) return null;

  return normalizeWhitespace(source.slice(separatorIndex + 1));
}

export function asStringOrNull(value: unknown): string | null {
  if (typeof value === "string") return normalizeWhitespace(value);
  if (typeof value === "number" && Number.isFinite(value)) return String(value);
  return null;
}

export function isRecord(value: unknown): value is Record<string, unknown> {
  return Boolean(value) && typeof value === "object";
}

export function isString(value: unknown): value is string {
  return typeof value === "string";
}

export function isNonEmptyString(value: string | null | undefined): value is string {
  return typeof value === "string" && value.trim().length > 0;
}

export function normalizeWhitespace(value: string | null | undefined): string | null {
  if (!value) return null;

  const normalized = value.replace(/\s+/gu, " ").trim();
  return normalized.length > 0 ? normalized : null;
}

export function normalizeText(value: string | null | undefined): string {
  return (value ?? "")
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/gu, "")
    .replace(/[^a-z0-9]+/giu, "")
    .toLowerCase();
}

export function lowercaseFirst(value: string): string {
  if (value.length === 0) return value;
  return value[0].toLocaleLowerCase("pt-BR") + value.slice(1);
}

export function titleCase(value: string): string {
  return value
    .replace(/([a-z])([A-Z])/gu, "$1 $2")
    .replace(/[_-]+/gu, " ")
    .trim()
    .replace(/\S+/gu, (part) => part[0].toLocaleUpperCase("pt-BR") + part.slice(1).toLocaleLowerCase("pt-BR"));
}

export function trimTrailingPeriod(value: string): string {
  return value.replace(/[.。]+$/u, "").trim();
}
