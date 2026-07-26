import { readFileSync } from "node:fs";
import { describe, expect, it } from "vitest";
import {
  renderRitualMetadata,
  type RitualMetadataViewModel,
} from "../../../../src/ui/components/ritual/ritual-metadata";

const model: RitualMetadataViewModel = {
  entries: [
    { label: "Execução", value: "Padrão" },
    { label: "Alcance", value: "Curto" },
    { label: "Duração", value: "Instantânea" },
    { label: "Alvo", value: "1 criatura" },
  ],
};

describe("renderRitualMetadata", () => {
  it("renders ordered semantic metadata with separate label and value classes", () => {
    const html = renderRitualMetadata(model);
    expect(html).toMatch(/^<dl class="paranormal-toolkit-ritual-metadata">/);
    expect(html).toContain('<dt class="paranormal-toolkit-ritual-metadata__label">Execução:</dt>');
    expect(html).toContain('<dd class="paranormal-toolkit-ritual-metadata__value">Padrão</dd>');
    expect(html).toMatch(/Execução.*Padrão.*Alcance.*Curto.*Duração.*Instantânea.*Alvo.*1 criatura/);
    expect(html).toMatch(/<\/dl>$/);
  });

  it("escapes labels and values", () => {
    const html = renderRitualMetadata({
      entries: [{ label: `<Label & "kind">`, value: `<Value 'safe'>` }],
    });
    expect(html).toContain("&lt;Label &amp; &quot;kind&quot;&gt;:");
    expect(html).toContain("&lt;Value &#039;safe&#039;&gt;");
    expect(html).not.toContain("<Label");
    expect(html).not.toContain("<Value");
  });

  it("omits blank entries while preserving valid-entry order", () => {
    const html = renderRitualMetadata({
      entries: [
        { label: "First", value: "1" },
        { label: "", value: "ignored" },
        { label: "ignored", value: "   " },
        { label: " Last ", value: " 2 " },
      ],
    });
    expect(html).not.toContain("ignored");
    expect(html).toMatch(/First.*1.*Last.*2/);
    expect(html.match(/paranormal-toolkit-ritual-metadata__entry/g)).toHaveLength(2);
  });

  it("returns an empty string without valid entries", () => {
    expect(renderRitualMetadata({ entries: [] })).toBe("");
    expect(
      renderRitualMetadata({ entries: [{ label: " ", value: " " }] }),
    ).toBe("");
  });

  it("uses scoped, compact wrapping CSS and separators only between entries", () => {
    const css = readFileSync("styles/components/ritual-metadata.css", "utf8");
    expect(css).toContain("display: flex");
    expect(css).toContain("flex-wrap: wrap");
    expect(css).toContain("min-width: 0");
    expect(css).toContain("overflow-wrap: anywhere");
    expect(css).toContain(
      ".paranormal-toolkit-ritual-metadata__entry:not(:last-child)::after",
    );
    expect(css).toContain('content: "·"');
    expect(css).toContain("font-weight: 700");
    expect(css).toContain("font-weight: 400");
    expect(css).not.toContain("white-space: nowrap");
    expect(css).not.toContain("!important");
    expect(css).not.toContain("300px");
    expect(css).not.toMatch(/(^|})\s*(dl|dt|dd|div)\b/m);
  });

  it("has no Foundry or production-feature integration", () => {
    const source = readFileSync(
      "src/ui/components/ritual/ritual-metadata.ts",
      "utf8",
    );
    expect(source).toContain("escapeHtml");
    expect(source).not.toMatch(/features\/(rituals|item-use|abilities)/);
    expect(source).not.toMatch(
      /\b(game|foundry|Actor|Item|Roll|ChatMessage|TextEditor|workflow|flags|targets)\b/,
    );
  });

  it("defines three shell examples and all through shared infrastructure", () => {
    const source = readFileSync("src/dev/chat-card-examples.ts", "utf8");
    expect(source).toContain(
      'export type RitualMetadataExample = "default" | "partial" | "long" | "all"',
    );
    expect(source).toContain("renderRitualMetadata");
    expect(source).toContain('content: renderRitualMetadata(ritualMetadataExample(example))');
    expect(source).toContain('["default", "partial", "long"]');
    expect(source).toContain('"ritual-metadata"');
    expect(source.match(/function createExampleMessage/g)).toHaveLength(1);
    expect(source.match(/const clearChatCardExamples/g)).toHaveLength(1);
  });
});
