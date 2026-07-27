import { readFileSync } from "node:fs";
import { describe, expect, it } from "vitest";
import { renderRitualResistanceSection, type RitualResistanceSectionViewModel } from "../../../../src/ui/components/ritual/ritual-resistance-section";

const pending: RitualResistanceSectionViewModel = { skill: "Fortitude", difficultyLabel: "DT 22", description: "reduz dano à metade", status: "pending", action: { ariaLabel: "Rolar resistência de Fortitude" } };

describe("renderRitualResistanceSection", () => {
  it("renders pending resistance with yellow tone, description, and d20 action", () => {
    const html = renderRitualResistanceSection(pending);
    expect(html).toContain("paranormal-toolkit-section-card--resistance");
    expect(html).toContain("reduz dano à metade");
    expect(html).toContain("paranormal-toolkit-dice-action-button");
    expect(html).not.toContain("paranormal-toolkit-status-badge");
  });
  it.each(["success", "failure"] as const)("keeps resistance tone while rendering %s badge and total tone", (status) => {
    const html = renderRitualResistanceSection({ ...pending, status, result: { formula: "1d20 + 20", total: status === "success" ? 32 : 17, diceResults: [12] } });
    expect(html).toContain("paranormal-toolkit-section-card--resistance");
    expect(html).not.toContain(`paranormal-toolkit-section-card--${status}`);
    expect(html).toContain(`paranormal-toolkit-status-badge--${status}`);
    expect(html).toContain(`paranormal-toolkit-roll-row__result--${status}`);
    expect(html).toContain(status === "success" ? "SUCESSO" : "FALHA");
    expect(html).toContain("1d20 + 20");
    expect(html).not.toContain("paranormal-toolkit-dice-action-button");
    expect(html).toContain("paranormal-toolkit-ritual-resistance-section--resolved");
    expect(html).not.toContain("reduz dano à metade");
    expect(html.match(new RegExp(status === "success" ? "SUCESSO" : "FALHA", "g"))).toHaveLength(1);
  });
  it("escapes all pending presentation text", () => {
    const html = renderRitualResistanceSection({ skill: `<Fortitude & "skill">`, difficultyLabel: `<DT 22>`, description: `<half & safe>`, status: "pending", action: { ariaLabel: `<Roll & "now">` } });
    expect(html).toContain("&lt;Fortitude &amp; &quot;skill&quot;&gt;");
    expect(html).toContain("&lt;DT 22&gt;");
    expect(html).toContain("&lt;half &amp; safe&gt;");
    expect(html).toContain("&lt;Roll &amp; &quot;now&quot;&gt;");
  });
  it("uses an overflow-safe grid without brittle positioning", () => {
    const css = readFileSync("styles/components/ritual-resistance-section.css", "utf8").replace(/\r\n/gu, "\n");
    expect(css).toContain("grid-template-columns: minmax(0, 1fr) auto");
    expect(css).toContain(".paranormal-toolkit-ritual-resistance-section--resolved");
    expect(css).toContain("grid-template-columns: minmax(0, 1fr)");
    expect(css).toContain("align-items: start");
    expect(css).toContain("overflow-wrap: anywhere");
    expect(css).not.toContain("!important");
  });
  it("keeps the component pure", () => {
    const source = readFileSync("src/ui/components/ritual/ritual-resistance-section.ts", "utf8").replace(/\r\n/gu, "\n");
    expect(source).toContain("renderStatusBadge");
    expect(source).not.toMatch(/addEventListener|features\/(rituals|item-use|abilities)/);
    expect(source).not.toMatch(/\b(game|foundry|Actor|Item|Roll|ChatMessage|targets|flags|workflow)\b/);
  });
  it("defines examples structurally without line-ending-sensitive whole blocks", () => {
    const source = readFileSync("src/dev/chat-card-examples.ts", "utf8").replace(/\r\n/gu, "\n");
    expect(source).toMatch(/export type RitualResistanceSectionExample\s*=\s*[\s\S]*"enabled"[\s\S]*"disabled"[\s\S]*"long"[\s\S]*"all"/u);
    expect(source).toContain("renderRitualResistanceSection");
    expect(source.match(/function createExampleMessage/g)).toHaveLength(1);
  });
});
