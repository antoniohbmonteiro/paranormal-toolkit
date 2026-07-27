import { readFileSync } from "node:fs";
import { describe, expect, it } from "vitest";
import { renderMetadataPill } from "../../../../src/ui/components/chat/metadata-pill";

describe("renderMetadataPill", () => {
  it("renders a non-interactive pill with escaped trimmed text", () => {
    const html = renderMetadataPill({ text: `  <Alvo & "um">  ` });
    expect(html).toBe(
      '<span class="paranormal-toolkit-metadata-pill">&lt;Alvo &amp; &quot;um&quot;&gt;</span>',
    );
    expect(html).not.toMatch(/button|title=|data-action|onclick/i);
  });

  it("returns an empty string for empty or whitespace-only text", () => {
    expect(renderMetadataPill({ text: "" })).toBe("");
    expect(renderMetadataPill({ text: "   " })).toBe("");
  });

  it("uses compact, scoped, overflow-safe pill styling", () => {
    const css = readFileSync("styles/components/metadata-pill.css", "utf8");
    for (const rule of [
      "display: inline-flex",
      "max-width: 100%",
      "border: 1px solid rgba(130, 100, 75, 0.26)",
      "border-radius: 999px",
      "padding: 2px 10px",
      "background: rgba(205, 190, 168, 0.38)",
      "font-size: 10.5px",
      "font-weight: 500",
      "overflow-wrap: anywhere",
    ]) {
      expect(css).toContain(rule);
    }
    expect(css).not.toContain("box-shadow");
    expect(css).not.toContain("white-space: nowrap");
    expect(css).not.toContain("!important");
    expect(css).not.toMatch(/(^|})\s*(span|button)\b/m);
  });

  it("has no listeners, Foundry, or production-feature integration", () => {
    const source = readFileSync(
      "src/ui/components/chat/metadata-pill.ts",
      "utf8",
    );
    expect(source).toContain("escapeHtml");
    expect(source).not.toMatch(/addEventListener|features\/(rituals|item-use|abilities)/);
    expect(source).not.toMatch(
      /\b(game|foundry|Actor|Item|Roll|ChatMessage|TextEditor|workflow|flags|targets)\b/,
    );
  });
});
