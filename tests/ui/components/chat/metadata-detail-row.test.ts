import { readFileSync } from "node:fs";
import { describe, expect, it } from "vitest";
import { renderMetadataDetailRow } from "../../../../src/ui/components/chat/metadata-detail-row";

describe("renderMetadataDetailRow", () => {
  it("escapes the label and preserves trusted internal detail HTML", () => {
    const html = renderMetadataDetailRow({
      label: `  <Resistência & "especial">:  `,
      detailHtml: "  Fortitude · <strong>DT 22</strong> · reduz dano à metade  ",
    });
    expect(html).toContain("&lt;Resistência &amp; &quot;especial&quot;&gt;:");
    expect(html).toContain("Fortitude · <strong>DT 22</strong> · reduz dano à metade");
    expect(html).not.toContain("<Resistência");
  });

  it("renders an accessible decorative accent and distinct content regions", () => {
    const html = renderMetadataDetailRow({
      label: "Alcance:",
      detailHtml: "Médio · até 15 metros",
    });
    expect(html).toContain('class="paranormal-toolkit-metadata-detail-row__accent" aria-hidden="true"');
    expect(html).toContain('class="paranormal-toolkit-metadata-detail-row__label">Alcance:</span>');
    expect(html).toContain('class="paranormal-toolkit-metadata-detail-row__detail">Médio · até 15 metros</span>');
  });

  it("returns an empty string when either required region is blank", () => {
    expect(renderMetadataDetailRow({ label: "", detailHtml: "detail" })).toBe("");
    expect(renderMetadataDetailRow({ label: "   ", detailHtml: "detail" })).toBe("");
    expect(renderMetadataDetailRow({ label: "Label:", detailHtml: "" })).toBe("");
    expect(renderMetadataDetailRow({ label: "Label:", detailHtml: "   " })).toBe("");
  });

  it("documents the trusted internal HTML contract", () => {
    const source = readFileSync(
      "src/ui/components/chat/metadata-detail-row.ts",
      "utf8",
    );
    expect(source).toContain("Trusted HTML produced exclusively by internal Paranormal Toolkit renderers");
    expect(source).toContain("never raw document or player HTML");
  });

  it("uses the referenced accent, dimensions, typography, and defensive wrapping", () => {
    const css = readFileSync("styles/components/metadata-detail-row.css", "utf8");
    for (const rule of [
      "gap: 7px",
      "flex: 0 0 3px",
      "width: 3px",
      "border-radius: 99px",
      "font-size: 10.5px",
      "line-height: 1.5",
      "font-weight: 700",
      "font-weight: 400",
      "overflow-wrap: anywhere",
      "var(--ptk-chat-section-accent, var(--ptk-chat-wine))",
    ]) {
      expect(css).toContain(rule);
    }
    expect(css).not.toContain("white-space: nowrap");
    expect(css).not.toContain("!important");
    expect(css).not.toContain("cursor: pointer");
    expect(css).not.toMatch(/(^|})\s*(div|span|strong)\b/m);
  });

  it("has no interaction, Foundry, or production-feature integration", () => {
    const source = readFileSync(
      "src/ui/components/chat/metadata-detail-row.ts",
      "utf8",
    );
    const html = renderMetadataDetailRow({ label: "Label:", detailHtml: "Detail" });
    expect(html).not.toMatch(/button|data-action|onclick|onClick/);
    expect(source).not.toMatch(/addEventListener|features\/(rituals|item-use|abilities)/);
    expect(source).not.toMatch(
      /\b(game|foundry|Actor|Item|Roll|ChatMessage|TextEditor|workflow|flags|targets)\b/,
    );
  });

  it("defines three shell examples and all through shared infrastructure", () => {
    const source = readFileSync("src/dev/chat-card-examples.ts", "utf8");
    expect(source).toContain(
      'export type MetadataDetailRowExample = "short" | "long" | "generic" | "all"',
    );
    expect(source).toContain("renderMetadataDetailRowExample");
    expect(source).toContain("renderChatCardShell({ content: renderMetadataDetailRow(model) })");
    expect(source).toContain('detailHtml: "Fortitude · <strong>DT 22</strong> · reduz dano à metade"');
    expect(source).toContain('detailHtml: "Reflexos · <strong>DT 24</strong> · evita completamente os efeitos do ritual"');
    expect(source).toContain('detailHtml: "Médio · até 15 metros"');
    expect(source).toContain('["short", "long", "generic"]');
    expect(source).toContain('"metadata-detail-row"');
    expect(source.match(/function createExampleMessage/g)).toHaveLength(1);
    expect(source.match(/const clearChatCardExamples/g)).toHaveLength(1);
  });
});
