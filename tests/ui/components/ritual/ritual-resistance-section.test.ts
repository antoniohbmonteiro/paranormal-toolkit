import { readFileSync } from "node:fs";
import { describe, expect, it } from "vitest";
import {
  renderRitualResistanceSection,
  type RitualResistanceSectionViewModel,
} from "../../../../src/ui/components/ritual/ritual-resistance-section";

const model: RitualResistanceSectionViewModel = {
  skill: "Fortitude",
  difficultyLabel: "DT 22",
  outcome: "reduz dano à metade",
  action: { ariaLabel: "Rolar resistência de Fortitude" },
};

describe("renderRitualResistanceSection", () => {
  it("composes a resistance SectionCard and real DiceActionButton", () => {
    const html = renderRitualResistanceSection(model);
    expect(html).toContain("paranormal-toolkit-section-card--resistance");
    expect(html).toContain("paranormal-toolkit-dice-action-button");
    expect(html).toContain('aria-label="Rolar resistência de Fortitude"');
  });

  it("uses its own top-aligned title rather than SectionHeader", () => {
    const html = renderRitualResistanceSection(model);
    expect(html).toContain("paranormal-toolkit-ritual-resistance-section__title");
    expect(html).toContain(">Resistência</div>");
    expect(html).not.toContain("paranormal-toolkit-section-header");
  });

  it("escapes skill, difficulty, outcome, and action label", () => {
    const html = renderRitualResistanceSection({
      skill: `<Fortitude & "skill">`,
      difficultyLabel: `<DT 22>`,
      outcome: `<half & safe>`,
      action: { ariaLabel: `<Roll & "now">` },
    });
    expect(html).toContain("&lt;Fortitude &amp; &quot;skill&quot;&gt;");
    expect(html).toContain("&lt;DT 22&gt;");
    expect(html).toContain("&lt;half &amp; safe&gt;");
    expect(html).toContain("&lt;Roll &amp; &quot;now&quot;&gt;");
    expect(html).not.toContain("<Fortitude");
  });

  it("renders enabled and disabled action states", () => {
    expect(renderRitualResistanceSection(model)).not.toMatch(
      /<button[^>]* disabled>/,
    );
    expect(
      renderRitualResistanceSection({
        ...model,
        action: { ariaLabel: "Unavailable", disabled: true },
      }),
    ).toMatch(/<button[^>]* disabled>/);
  });

  it("keeps outcome normal while highlighting skill and difficulty", () => {
    const html = renderRitualResistanceSection(model);
    expect(html).toContain(
      'class="paranormal-toolkit-ritual-resistance-section__metric">Fortitude</strong>',
    );
    expect(html).toContain(
      'class="paranormal-toolkit-ritual-resistance-section__metric">DT 22</strong>',
    );
    expect(html).toContain(
      'class="paranormal-toolkit-ritual-resistance-section__outcome">reduz dano à metade</span>',
    );
  });

  it("uses a top-aligned overflow-safe grid and wrapping summary", () => {
    const css = readFileSync(
      "styles/components/ritual-resistance-section.css",
      "utf8",
    );
    expect(css).toContain("grid-template-columns: minmax(0, 1fr) auto");
    expect(css).toContain("align-items: start");
    expect(css).toContain("min-width: 0");
    expect(css).toContain("overflow-wrap: anywhere");
    expect(css).toContain("font-weight: 400");
    expect(css).not.toContain("!important");
    expect(css).not.toMatch(/[;{]\s*(transform|top)\s*:/);
    expect(css).not.toContain("position: relative");
    expect(css).not.toContain("300px");
    expect(css).not.toMatch(/(^|})\s*(div|p|strong|span|section)\b/m);
  });

  it("has no listeners, action contract, Foundry, or production-feature dependencies", () => {
    const source = readFileSync(
      "src/ui/components/ritual/ritual-resistance-section.ts",
      "utf8",
    );
    const html = renderRitualResistanceSection(model);
    expect(source).toContain("renderSectionCard");
    expect(source).toContain("renderDiceActionButton");
    expect(source).not.toContain("renderSectionHeader");
    expect(html).not.toMatch(/data-action|onclick|onClick/);
    expect(source).not.toMatch(/addEventListener|features\/(rituals|item-use|abilities)/);
    expect(source).not.toMatch(
      /\b(game|foundry|Actor|Item|Roll|ChatMessage|targets|flags|workflow)\b/,
    );
  });

  it("defines three examples and all through shared message infrastructure", () => {
    const source = readFileSync("src/dev/chat-card-examples.ts", "utf8");
    expect(source).toContain(
      'export type RitualResistanceSectionExample =\n  | "enabled"\n  | "disabled"\n  | "long"\n  | "all"',
    );
    expect(source).toContain("renderRitualResistanceSection");
    expect(source).toContain('["enabled", "disabled", "long"]');
    expect(source).toContain('"ritual-resistance"');
    expect(source.match(/function createExampleMessage/g)).toHaveLength(1);
    expect(source.match(/const clearChatCardExamples/g)).toHaveLength(1);
  });
});
