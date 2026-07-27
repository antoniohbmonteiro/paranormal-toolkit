import { readFileSync } from "node:fs";
import { describe, expect, it } from "vitest";
import {
  renderRitualConjurationSection,
  type RitualConjurationSectionViewModel,
} from "../../../../src/ui/components/ritual/ritual-conjuration-section";

const successModel: RitualConjurationSectionViewModel = {
  status: "success",
  skillLabel: "Ocultismo",
  total: 23,
  difficultyClass: 21,
  formula: "1d20 + 10 + 5",
  diceResults: [8],
};

describe("renderRitualConjurationSection", () => {
  it("composes the fixed casting section, heading, success status, and roll tone", () => {
    const html = renderRitualConjurationSection(successModel);
    expect(html).toContain("paranormal-toolkit-section-card--casting");
    expect(html).toContain("Conjuração");
    expect(html).toContain("paranormal-toolkit-status-badge--success");
    expect(html).toContain("paranormal-toolkit-roll-row__result--success");
  });

  it("composes failure status and failure roll tone without controlling later content", () => {
    const html = renderRitualConjurationSection({
      ...successModel,
      status: "failure",
      total: 17,
      diceResults: [2],
    });
    expect(html).toContain("paranormal-toolkit-status-badge--failure");
    expect(html).toContain("paranormal-toolkit-roll-row__result--failure");
    expect(html).not.toMatch(/remove|hide|subsequent|next-section|workflow/i);
  });

  it("renders skill and difficulty while keeping total only in RollRow, including zero", () => {
    const html = renderRitualConjurationSection({
      ...successModel,
      skillLabel: "Perícia",
      total: 0,
      difficultyClass: 0,
    });
    const description = html.match(/__result-description[^>]*>(.*?)<\/p>/s)?.[1] ?? "";
    expect(description).toContain("Perícia");
    expect(description).toContain("contra");
    expect(description).not.toContain(">0<");
    expect(html).toContain(">DT 0</strong>");
    expect(html).toContain('aria-label="Resultado: 0">0</output>');
    expect(html.match(/\bDT\b/g)).toHaveLength(1);
  });

  it("does not duplicate a normal total in the result description", () => {
    const html = renderRitualConjurationSection(successModel);
    const description = html.match(/__result-description[^>]*>(.*?)<\/p>/s)?.[1] ?? "";
    expect(description).toContain("Ocultismo");
    expect(description).toContain("contra");
    expect(description).toContain("DT 21");
    expect(description).not.toContain("23");
    expect(html).toContain('aria-label="Resultado: 23">23</output>');
  });

  it("escapes skill, formula, and consequence text", () => {
    const html = renderRitualConjurationSection({
      ...successModel,
      skillLabel: `<Skill & "one">`,
      formula: `<1d20 & bonus>`,
      consequence: `<Sanidade & "perdida">`,
    });
    expect(html).toContain("&lt;Skill &amp; &quot;one&quot;&gt;");
    expect(html).toContain("&lt;1d20 &amp; bonus&gt;");
    expect(html).toContain("&lt;Sanidade &amp; &quot;perdida&quot;&gt;");
    expect(html).not.toContain("<Skill");
    expect(html).not.toContain("<Sanidade");
  });

  it("renders a fixed consequence label and a prepared value", () => {
    const html = renderRitualConjurationSection({
      ...successModel,
      consequence: "Dano de Sanidade",
    });
    expect(html).toContain("__consequence");
    expect(html).toContain("Consequência:");
    expect(html).toContain("Dano de Sanidade");
  });

  it.each([undefined, "", "   "])(
    "omits consequence markup for %s",
    (consequence) => {
      const html = renderRitualConjurationSection({
        ...successModel,
        consequence,
      });
      expect(html).not.toContain("__consequence");
      expect(html).not.toContain("Consequência:");
    },
  );

  it("delegates expanded disclosure and individual dice to RollRow", () => {
    const html = renderRitualConjurationSection({
      ...successModel,
      expanded: true,
    });
    expect(html).toMatch(/<details[^>]* open>/);
    const breakdown = html.match(
      /paranormal-toolkit-roll-row__breakdown[^>]*>(.*?)<\/div>/s,
    )?.[1];
    expect(breakdown?.replace(/<[^>]+>/g, "")).toBe("8");
    expect(breakdown).not.toContain(successModel.formula);
    expect(breakdown).not.toContain(String(successModel.total));
    expect(breakdown).not.toContain("DT");
  });

  it("preserves RollRow's static fallback without dice results", () => {
    const html = renderRitualConjurationSection({
      ...successModel,
      diceResults: undefined,
    });
    expect(html).toContain("paranormal-toolkit-roll-row__formula--static");
    expect(html).not.toContain("<details");
    expect(html).not.toContain("<summary");
  });

  it("reuses all generic renderers and shared escaping without duplicating internals", () => {
    const source = readFileSync(
      "src/ui/components/ritual/ritual-conjuration-section.ts",
      "utf8",
    );
    for (const renderer of [
      "renderSectionCard",
      "renderSectionHeader",
      "renderStatusBadge",
      "renderRollRow",
      "escapeHtml",
    ]) {
      expect(source).toContain(renderer);
    }
    expect(source).not.toMatch(
      /<details|<summary|paranormal-toolkit-roll-row__result|class="paranormal-toolkit-status-badge|class="paranormal-toolkit-section-(card|header)/,
    );
    expect(source).not.toMatch(/RollRowViewModel|SectionCardTone/);
  });

  it("has no Foundry, production-feature, or workflow dependencies", () => {
    const source = readFileSync(
      "src/ui/components/ritual/ritual-conjuration-section.ts",
      "utf8",
    );
    expect(source).not.toMatch(/features\/(rituals|item-use|abilities)/);
    expect(source).not.toMatch(
      /\b(game|foundry|Actor|Item|ChatMessage|TextEditor|flags|targets|hooks|workflow|damage|resistance)\b/i,
    );
    expect(source).not.toMatch(/\b(new Roll|Roll\.|Roll\.fromData)\b/);
    expect(source).not.toMatch(/Dice So Nice|gasto de PE/i);
    expect(source).not.toMatch(/status\s*=|total\s*[><=]+\s*difficultyClass/);
  });

  it("uses only scoped token-based CSS", () => {
    const css = readFileSync(
      "styles/components/ritual-conjuration-section.css",
      "utf8",
    );
    expect(css).toContain("color: var(--ptk-chat-text-secondary)");
    expect(css).toContain("color: var(--ptk-chat-section-title)");
    expect(css).toContain("color: var(--ptk-chat-failure-text)");
    expect(css).toContain("padding-top: 1px");
    expect(css).toContain("overflow-wrap: anywhere");
    expect(css).toContain("font-variant-numeric: tabular-nums");
    expect(css).not.toContain("!important");
    expect(css).not.toMatch(/#[0-9a-f]{3,8}\b/i);
    expect(css).not.toMatch(/(^|})\s*(p|span|strong|section|div)\b/m);
    expect(css).not.toMatch(/[;{]\s*(transform|top)\s*:/);
    expect(css).not.toContain("position: relative");
    for (const selector of css.matchAll(/(^|})\s*([^@][^{]+)\{/g)) {
      expect(selector[2].trim()).toMatch(
        /^\.paranormal-toolkit-ritual-conjuration-section/,
      );
    }
  });

  it("defines isolated development examples through the specific renderer", () => {
    const source = readFileSync("src/dev/chat-card-examples.ts", "utf8");
    for (const example of [
      "success",
      "failure",
      "failure-consequence",
      "expanded",
      "all",
    ]) {
      expect(source).toContain(`"${example}"`);
    }
    const helper = source.slice(source.indexOf("function renderRitualConjurationExample"));
    expect(helper).toContain("renderRitualConjurationSection");
    expect(helper).not.toContain("renderSectionCard({");
    expect(helper).not.toContain("renderSectionHeader({");
    expect(helper).not.toContain("renderStatusBadge({");
    expect(helper).not.toContain("renderRollRow({");
    expect(source).toContain('"success", "failure", "failure-consequence", "expanded"');
    expect(source).toContain('"ritual-conjuration"');
    expect(source.match(/function createExampleMessage/g)).toHaveLength(1);
    expect(source.match(/const clearChatCardExamples/g)).toHaveLength(1);
  });
});
