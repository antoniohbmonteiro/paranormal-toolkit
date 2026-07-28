import { escapeHtml } from "./escape-html";

type FoundryHtmlSanitizer = (html: string) => string;

/**
 * Sanitizes HTML crossing a persisted-message trust boundary.
 * Foundry's sanitizer preserves supported enriched links and markup. If it is
 * unavailable (for example in a partial test/runtime), fail closed as text.
 */
export function sanitizePersistedHtml(value: string): string {
  const sanitizer = resolveFoundryHtmlSanitizer();
  if (!sanitizer) return escapeHtml(value);

  try {
    return sanitizer(value);
  } catch {
    return escapeHtml(value);
  }
}

function resolveFoundryHtmlSanitizer(): FoundryHtmlSanitizer | null {
  const utils = (globalThis as { foundry?: { utils?: Record<string, unknown> } })
    .foundry?.utils;
  const candidate = utils?.cleanHTML ?? utils?.sanitizeHTML;
  return typeof candidate === "function"
    ? (candidate as FoundryHtmlSanitizer)
    : null;
}
