declare const htmlStringBrand: unique symbol;

export type HtmlString = string & { readonly [htmlStringBrand]: true };

export function escapeHtml(value: string | number | boolean | null | undefined): string {
  return value == null
    ? ""
    : String(value).replaceAll("&", "&amp;").replaceAll("<", "&lt;").replaceAll(">", "&gt;").replaceAll('"', "&quot;").replaceAll("'", "&#39;");
}

/** Marks already composed component markup; it deliberately performs no sanitization. */
export function markTrustedHtml(value: string): HtmlString {
  return value as HtmlString;
}
