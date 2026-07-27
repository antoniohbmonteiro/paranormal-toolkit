import { describe, expect, it } from "vitest";
import { escapeHtml } from "../../../src/ui/rendering/escape-html";

describe("escapeHtml", () => {
  it("escapes every HTML-sensitive character", () => {
    expect(escapeHtml(`&<>"'`)).toBe("&amp;&lt;&gt;&quot;&#039;");
  });

  it("preserves ordinary text", () => {
    expect(escapeHtml("Texto normal 123 — ação")).toBe("Texto normal 123 — ação");
  });
});
