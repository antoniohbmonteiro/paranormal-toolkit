import { readFileSync } from "node:fs";
import { describe, expect, it } from "vitest";
import {
  renderRollRow,
  type RollRowResultTone,
} from "../../../../src/ui/components/chat/roll-row";

describe("renderRollRow", () => {
  it("escapes formula text and renders a numeric result", () => {
    const html = renderRollRow({ formula: `<1d20 & "bonus">`, total: 23 });
    expect(html).toContain("&lt;1d20 &amp; &quot;bonus&quot;&gt;");
    expect(html).not.toContain("<1d20");
    expect(html).toContain('aria-label="Resultado: 23">23</output>');
  });

  it("renders zero and applies the with-result modifier", () => {
    const html = renderRollRow({ formula: "1d20", total: 0 });
    expect(html).toContain("paranormal-toolkit-roll-row--with-result");
    expect(html).toContain('aria-label="Resultado: 0">0</output>');
  });

  it("omits the result cell and uses one-column markup without a result", () => {
    const html = renderRollRow({ formula: "1d20 + 4" });
    expect(html).toContain("paranormal-toolkit-roll-row--without-result");
    expect(html).not.toContain("paranormal-toolkit-roll-row__result");
    expect(html).not.toContain("<output");
  });

  it.each([
    [undefined, "section"],
    ["section", "section"],
    ["success", "success"],
    ["failure", "failure"],
  ] as const)("renders the %s result tone as %s", (tone, expected) => {
    const html = renderRollRow({ formula: "1d20", total: 1, resultTone: tone });
    expect(html).toContain(`paranormal-toolkit-roll-row__result--${expected}`);
  });

  it("falls back to section for an invalid runtime tone", () => {
    const tone = "invalid" as RollRowResultTone;
    expect(renderRollRow({ formula: "1d20", total: 1, resultTone: tone })).toContain(
      "paranormal-toolkit-roll-row__result--section",
    );
  });

  it("uses a collapsed native disclosure when dice exist", () => {
    const html = renderRollRow({ formula: "3d6", total: 9, diceResults: [2, 3, 4] });
    expect(html).toContain("<details");
    expect(html).toContain("<summary");
    expect(html).not.toMatch(/<details[^>]*\sopen(?:\s|>)/);
    expect(html).toContain("paranormal-toolkit-roll-row__chevron");
    expect(html).toContain('aria-hidden="true"');
    expect(html).toContain('aria-label="Resultados dos dados"');
  });

  it("opens the native disclosure when expanded", () => {
    const html = renderRollRow({
      formula: "3d6",
      total: 9,
      diceResults: [2, 3, 4],
      expanded: true,
    });
    expect(html).toMatch(/<details[^>]* open>/);
  });

  it("renders a static formula without empty disclosure or chevron", () => {
    for (const diceResults of [undefined, []] as const) {
      const html = renderRollRow({ formula: "1d20 + 4", diceResults });
      expect(html).toContain("paranormal-toolkit-roll-row__formula--static");
      expect(html).not.toContain("<details");
      expect(html).not.toContain("<summary");
      expect(html).not.toContain("__chevron");
      expect(html).not.toContain("data-action");
      expect(html).not.toMatch(/onclick|onClick/);
    }
  });

  it("renders only prepared individual values in breakdown order", () => {
    const html = renderRollRow({
      formula: "3d6 + 5",
      total: 14,
      diceResults: [2, 3, 4],
      expanded: true,
    });
    const breakdown = html.match(
      /paranormal-toolkit-roll-row__breakdown[^>]*>(.*?)<\/div>/s,
    )?.[1];
    expect(breakdown).toBe(
      '<span class="paranormal-toolkit-roll-row__die">2</span><span class="paranormal-toolkit-roll-row__die">3</span><span class="paranormal-toolkit-roll-row__die">4</span>',
    );
    expect(breakdown).not.toContain("3d6");
    expect(breakdown).not.toContain("14");
    expect(breakdown?.replace(/<[^>]+>/g, "")).toBe("234");
  });

  it("defensively escapes non-number runtime breakdown input", () => {
    const diceResults = [`<img src=x>`] as unknown as readonly number[];
    const html = renderRollRow({ formula: "1d20", diceResults });
    expect(html).toContain("&lt;img src=x&gt;");
    expect(html).not.toContain("<img src=x>");
    expect(html).not.toContain("[[");
  });

  it("has no Foundry, domain, listener, or workflow dependencies", () => {
    const source = readFileSync("src/ui/components/chat/roll-row.ts", "utf8");
    expect(source).not.toMatch(/features\/(rituals|abilities|item-use)/);
    expect(source).not.toMatch(
      /\b(game|foundry|Actor|Item|Roll|ChatMessage|TextEditor|ritual|casting|resistance|damage|workflow)\b/,
    );
    expect(source).not.toMatch(/data-action|addEventListener|onclick|onClick|enrichHTML|fromData/);
  });

  it("implements the required scoped, responsive CSS", () => {
    const css = readFileSync("styles/components/roll-row.css", "utf8");
    for (const rule of [
      "grid-template-columns: minmax(0, 1fr) 44px",
      "grid-template-columns: minmax(0, 1fr)",
      "min-width: 0",
      "min-height: 34px",
      "width: 44px",
      "min-width: 44px",
      "font-family: ui-monospace, SFMono-Regular, Menlo, Monaco, Consolas, monospace",
      "list-style: none",
      "cursor: pointer",
      ":focus-visible",
      "display: flex",
      "flex-wrap: wrap",
      "display: inline-grid",
      "min-width: 24px",
    ]) {
      expect(css).toContain(rule);
    }
    expect(css).toContain("var(--ptk-chat-section-border)");
    expect(css).toContain("var(--ptk-chat-success-background)");
    expect(css).toContain("var(--ptk-chat-failure-background)");
    expect(css).not.toContain("!important");
    expect(css).not.toContain("300px");
    expect(css).not.toMatch(/(^|})\s*(details|summary|output|span|div)\b/m);
    const formula = css.match(
      /\.paranormal-toolkit-roll-row__formula\s*\{[^}]+\}/,
    )?.[0];
    const formulaText = css.match(
      /\.paranormal-toolkit-roll-row__formula-text\s*\{[^}]+\}/,
    )?.[0];
    expect(formula).toContain("color: var(--ptk-chat-text-secondary)");
    expect(formula).not.toContain("color: var(--ptk-chat-text-muted)");
    expect(formulaText).toContain("font-weight: 500");
  });

  it("defines all six development scenarios through shared composition", () => {
    const source = readFileSync("src/dev/chat-card-examples.ts", "utf8");
    for (const example of [
      "with-result-success",
      "with-result-failure",
      "damage-collapsed",
      "damage-expanded",
      "without-result-collapsed",
      "without-result-expanded",
    ]) {
      expect(source).toContain(`"${example}"`);
    }
    expect(source).toContain("postRollRowExample(example: RollRowExample)");
    expect(source).toContain("renderRollRow(model)");
    expect(source).toContain('createExampleMessage(renderRollRowExample(item), "roll-row")');
    expect(source.match(/function createExampleMessage/g)).toHaveLength(1);
    expect(source.match(/const clearChatCardExamples/g)).toHaveLength(1);
  });
});
