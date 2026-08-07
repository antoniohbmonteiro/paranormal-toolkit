import { escapeHtml } from "../../ui/rendering/escape-html";

const ALLOWED_TAGS = new Set(["p", "br", "strong", "b", "em", "i", "ul", "ol", "li"]);
const TOKEN_PREFIX = "__PTK_SAFE_HTML_";

/** Reads the real Ordem item description path and returns presentation-safe HTML. */
export function resolveSafeRitualDescription(item: Item): string | null {
  const value = (item.system as { description?: unknown } | undefined)?.description;

  if (typeof value !== "string" || !stripMarkup(value).trim()) {
    return null;
  }

  const sanitized = sanitizeRitualDescriptionHtml(value);
  return sanitized.trim() ? sanitized : null;
}

export function sanitizeRitualDescriptionHtml(value: string): string {
  const withoutUnsafeBlocks = value
    .replace(/<!--[\s\S]*?-->/gu, "")
    .replace(/<(script|style|iframe|object|embed)\b[^>]*>[\s\S]*?<\/\1\s*>/giu, "")
    .replace(/<(script|style|iframe|object|embed)\b[^>]*\/?\s*>/giu, "");

  const tokens: string[] = [];

  let tokenized = withoutUnsafeBlocks.replace(
    /<\/?([a-z0-9]+)\b[^>]*>/giu,
    (tag, name: string) => {
      const normalized = name.toLowerCase();

      if (!ALLOWED_TAGS.has(normalized)) {
        return "";
      }

      const closing = /^<\s*\//u.test(tag);
      const safe =
        normalized === "br"
          ? "<br>"
          : closing
            ? `</${normalized}>`
            : `<${normalized}>`;

      const token = `${TOKEN_PREFIX}${tokens.length}__`;
      tokens.push(safe);

      return token;
    }
  );

  tokenized = tokenized.replace(
    /&(?:#[0-9]+|#x[0-9a-f]+|[a-z][a-z0-9]+);/giu,
    (entity) => {
      const token = `${TOKEN_PREFIX}${tokens.length}__`;
      tokens.push(entity);

      return token;
    }
  );

  let escaped = escapeHtml(tokenized);

  tokens.forEach((token, index) => {
    escaped = escaped.replace(`${TOKEN_PREFIX}${index}__`, token);
  });

  return escaped;
}

function stripMarkup(value: string): string {
  return value
    .replace(/<[^>]*>/gu, "")
    .replace(/&nbsp;/giu, " ");
}