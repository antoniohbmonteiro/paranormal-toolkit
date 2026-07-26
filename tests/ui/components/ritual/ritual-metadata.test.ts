import { readFileSync } from "node:fs";
import { describe, expect, it } from "vitest";
import {
  renderRitualMetadata,
  type RitualMetadataViewModel,
} from "../../../../src/ui/components/ritual/ritual-metadata";

const model: RitualMetadataViewModel = {
  items: [
    { text: "1 PE gasto" },
    { text: "Alvo: 1 Ser" },
    { text: "Duração: Instantânea" },
  ],
};

describe("renderRitualMetadata", () => {
  it("composes real MetadataPills in received order", () => {
    const html = renderRitualMetadata(model);
    expect(html).toMatch(/^<div class="paranormal-toolkit-ritual-metadata">/);
    expect(html.match(/paranormal-toolkit-metadata-pill/g)).toHaveLength(3);
    expect(html).toMatch(/1 PE gasto.*Alvo: 1 Ser.*Duração: Instantânea/);
  });

  it("escapes pill content through MetadataPill", () => {
    const html = renderRitualMetadata({
      items: [{ text: `<Alvo & "um">` }],
    });
    expect(html).toContain("&lt;Alvo &amp; &quot;um&quot;&gt;");
    expect(html).not.toContain("<Alvo");
  });

  it("ignores empty pills while preserving valid items", () => {
    const html = renderRitualMetadata({
      items: [
        { text: "First" },
        { text: "" },
        { text: "   " },
        { text: "Last" },
      ],
    });
    expect(html).toMatch(/First.*Last/);
    expect(html.match(/paranormal-toolkit-metadata-pill/g)).toHaveLength(2);
  });

  it("returns an empty string without valid pills", () => {
    expect(renderRitualMetadata({ items: [] })).toBe("");
    expect(renderRitualMetadata({ items: [{ text: " " }] })).toBe("");
  });

  it("contains no definition-list markup or dot separators", () => {
    const html = renderRitualMetadata(model);
    expect(html).not.toMatch(/<\/?(?:dl|dt|dd)\b/);
    expect(html).not.toContain("·");
  });

  it("uses a compact overflow-safe wrapping container", () => {
    const css = readFileSync("styles/components/ritual-metadata.css", "utf8");
    expect(css).toContain("display: flex");
    expect(css).toContain("flex-wrap: wrap");
    expect(css).toContain("gap: 5px");
    expect(css).toContain("min-width: 0");
    expect(css).toContain("max-width: 100%");
    expect(css).toContain("overflow-wrap: anywhere");
    expect(css).not.toContain("white-space: nowrap");
    expect(css).not.toContain("!important");
    expect(css).not.toContain("300px");
  });

  it("exclusively composes MetadataPill without Foundry integration", () => {
    const source = readFileSync(
      "src/ui/components/ritual/ritual-metadata.ts",
      "utf8",
    );
    expect(source).toContain("renderMetadataPill");
    expect(source).not.toContain("escapeHtml");
    expect(source).not.toMatch(/<\/?(?:span|dl|dt|dd)\b/);
    expect(source).not.toMatch(/features\/(rituals|item-use|abilities)/);
    expect(source).not.toMatch(
      /\b(game|foundry|Actor|Item|Roll|ChatMessage|TextEditor|workflow|flags|targets)\b/,
    );
  });

  it("defines the three corrected shell examples through shared infrastructure", () => {
    const source = readFileSync("src/dev/chat-card-examples.ts", "utf8");
    expect(source).toContain('export type RitualMetadataExample = "default" | "partial" | "long" | "all"');
    for (const text of [
      "1 PE gasto",
      "Alvo: 1 Ser",
      "Duração: Instantânea",
      "Alcance: Pessoal",
      "Duração: Cena",
    ]) {
      expect(source).toContain(`{ text: "${text}" }`);
    }
    expect(source).toContain('["default", "partial", "long"]');
    expect(source).toContain('content: renderRitualMetadata(ritualMetadataExample(example))');
    expect(source).toContain('"ritual-metadata"');
    expect(source.match(/function createExampleMessage/g)).toHaveLength(1);
    expect(source.match(/const clearChatCardExamples/g)).toHaveLength(1);
  });
});
