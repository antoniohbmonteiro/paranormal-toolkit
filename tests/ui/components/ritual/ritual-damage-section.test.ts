import { readFileSync } from "node:fs";
import { describe, expect, it } from "vitest";
import {
  renderRitualDamageSection,
  type RitualDamageSectionViewModel,
} from "../../../../src/ui/components/ritual/ritual-damage-section";

const model: RitualDamageSectionViewModel = {
  damageType: "Eletricidade",
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
      damageType: `<Electric & "paranormal">`,
    });
    expect(html).toContain("paranormal-toolkit-ritual-damage-section__damage-type");
    expect(html).toContain("&lt;Electric &amp; &quot;paranormal&quot;&gt;");
    expect(html).not.toContain("<Electric");
    expect(html).not.toContain("__demo-");
  });

  it.each(["", "   "])("omits trailing markup for damage type %s", (damageType) => {
    const html = renderRitualDamageSection({ ...model, damageType });
    expect(html).not.toContain("paranormal-toolkit-section-header__trailing");
    expect(html).not.toContain("__damage-type");
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
      "escapeHtml",
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

  it("uses minimal component-scoped inherited-token CSS", () => {
    const css = readFileSync("styles/components/ritual-damage-section.css", "utf8");
    expect(css).toContain("font-size: 10.5px");
    expect(css).toContain("font-weight: 600");
    expect(css).toContain("line-height: 1");
    expect(css).toContain("min-width: 0");
    expect(css).toContain("text-align: right");
    expect(css).toContain("color: var(--ptk-chat-section-title)");
    expect(css).toContain("overflow-wrap: anywhere");
    expect(css).not.toContain("!important");
    expect(css).not.toMatch(/#[0-9a-f]{3,8}\b/i);
    expect(css).not.toMatch(/(^|})\s*(span|div|section|p)\b/m);
    expect(css).not.toMatch(/[;{]\s*(transform|top)\s*:/);
    expect(css).not.toContain("position: relative");
    expect(css).not.toContain("white-space: nowrap");
    for (const selector of css.matchAll(/(^|})\s*([^@][^{]+)\{/g)) {
      expect(selector[2].trim()).toMatch(
        /^\.paranormal-toolkit-ritual-damage-section/,
      );
    }
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
