import { readFileSync } from "node:fs";
import { describe, expect, it } from "vitest";
import {
  renderRitualDamageSection,
  type RitualDamageSectionViewModel,
} from "../../../../src/ui/components/ritual/ritual-damage-section";

const model: RitualDamageSectionViewModel = {
  damageTypeBadge: { label: "Eletricidade", tone: "electric" },
  formula: "3d6",
  total: 9,
  diceResults: [2, 3, 4],
};

describe("renderRitualDamageSection", () => {
  it("composes fixed damage SectionCard, fixed heading, and section-tone RollRow", () => {
    const html = renderRitualDamageSection(model);
    expect(html).toContain("paranormal-toolkit-section-card--damage");
    expect(html).toContain("paranormal-toolkit-section-header__title\">Dano");
    expect(html).toContain("paranormal-toolkit-roll-row__result--section");
  });

  it("escapes the damage type in component-owned trailing markup", () => {
    const html = renderRitualDamageSection({
      ...model,
      damageTypeBadge: { label: `<Electric & "paranormal">`, tone: "neutral" },
    });
    expect(html).toContain("paranormal-toolkit-damage-type-badge--neutral");
    expect(html).toContain("&lt;Electric &amp; &quot;paranormal&quot;&gt;");
    expect(html).not.toContain("<Electric");
    expect(html).not.toContain("__demo-");
  });

  it("omits trailing markup without a damage badge", () => {
    const html = renderRitualDamageSection({ ...model, damageTypeBadge: undefined });
    expect(html).not.toContain("paranormal-toolkit-section-header__trailing");
    expect(html).not.toContain("paranormal-toolkit-damage-type-badge");
  });

  it("renders normal and zero totals", () => {
    expect(renderRitualDamageSection(model)).toContain(
      'aria-label="Resultado: 9">9</output>',
    );
    expect(renderRitualDamageSection({ ...model, total: 0 })).toContain(
      'aria-label="Resultado: 0">0</output>',
    );
  });

  it("supports no total without creating a result cell", () => {
    const html = renderRitualDamageSection({ ...model, total: undefined });
    expect(html).toContain("paranormal-toolkit-roll-row--without-result");
    expect(html).not.toContain("paranormal-toolkit-roll-row__result");
    expect(html).not.toContain("<output");
  });

  it("delegates expanded disclosure and individual dice to RollRow", () => {
    const html = renderRitualDamageSection({ ...model, expanded: true });
    expect(html).toMatch(/<details[^>]* open>/);
    const breakdown = html.match(
      /paranormal-toolkit-roll-row__breakdown[^>]*>(.*?)<\/div>/s,
    )?.[1];
    expect(breakdown?.replace(/<[^>]+>/g, "")).toBe("234");
    expect(breakdown).not.toContain(model.formula);
    expect(breakdown).not.toContain(String(model.total));
  });

  it("preserves RollRow's static fallback without dice", () => {
    const html = renderRitualDamageSection({ ...model, diceResults: undefined });
    expect(html).toContain("paranormal-toolkit-roll-row__formula--static");
    expect(html).not.toContain("<details");
    expect(html).not.toContain("<summary");
  });

  it("composes generic renderers without duplicating their internals", () => {
    const source = readFileSync(
      "src/ui/components/ritual/ritual-damage-section.ts",
      "utf8",
    );
    for (const renderer of [
      "renderSectionCard",
      "renderSectionHeader",
      "renderRollRow",
      "renderDamageTypeBadge",
    ]) {
      expect(source).toContain(renderer);
    }
    expect(source).toContain('tone: "damage"');
    expect(source).toContain('title: "Dano"');
    expect(source).toContain('resultTone: "section"');
    expect(source).not.toMatch(/<details|<summary|paranormal-toolkit-roll-row__result/);
  });

  it("has no Foundry, production-feature, or workflow dependencies", () => {
    const source = readFileSync(
      "src/ui/components/ritual/ritual-damage-section.ts",
      "utf8",
    );
    expect(source).not.toMatch(/features\/(rituals|item-use|abilities)/);
    expect(source).not.toMatch(
      /\b(game|foundry|Actor|Item|ChatMessage|TextEditor|flags|targets|hooks|workflow)\b/i,
    );
    expect(source).not.toMatch(/\b(new Roll|Roll\.|Roll\.fromData)\b/);
    expect(source).not.toMatch(/calculate|evaluate|apply damage|resistance/i);
  });

  it("uses the shared damage type badge instead of ritual-specific CSS", () => {
    const source = readFileSync(
      "src/ui/components/ritual/ritual-damage-section.ts",
      "utf8",
    );
    expect(source).toContain("renderDamageTypeBadge");
    expect(source).not.toContain("ritual-damage-section__damage-type");
  });

  it("defines four isolated examples through shared infrastructure", () => {
    const source = readFileSync("src/dev/chat-card-examples.ts", "utf8");
    for (const example of ["collapsed", "expanded", "without-result", "long-type"]) {
      expect(source).toContain(`"${example}"`);
    }
    const helper = source.slice(source.indexOf("function renderRitualDamageExample"));
    expect(helper).toContain("renderRitualDamageSection");
    expect(helper).not.toContain("renderSectionCard({");
    expect(helper).not.toContain("renderSectionHeader({");
    expect(helper).not.toContain("renderRollRow({");
    expect(source).toContain(
      '["collapsed", "expanded", "without-result", "long-type"]',
    );
    expect(source).toContain('"ritual-damage"');
    expect(source.match(/function createExampleMessage/g)).toHaveLength(1);
    expect(source.match(/const clearChatCardExamples/g)).toHaveLength(1);
  });
});
