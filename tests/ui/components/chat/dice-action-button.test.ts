import { readFileSync } from "node:fs";
import { describe, expect, it } from "vitest";
import { renderDiceActionButton } from "../../../../src/ui/components/chat/dice-action-button";

describe("renderDiceActionButton", () => {
  it("renders an enabled button with an escaped accessible label", () => {
    const html = renderDiceActionButton({ ariaLabel: `<Roll & "resist">` });
    expect(html).toContain('<button class="paranormal-toolkit-dice-action-button" type="button"');
    expect(html).toContain('aria-label="&lt;Roll &amp; &quot;resist&quot;&gt;"');
    expect(html).not.toMatch(/\sdisabled(?:\s|>)/);
    expect(html).not.toContain("<Roll");
  });

  it("applies disabled only when requested", () => {
    expect(renderDiceActionButton({ ariaLabel: "Roll", disabled: true })).toMatch(
      /<button[^>]* disabled>/,
    );
    expect(renderDiceActionButton({ ariaLabel: "Roll", disabled: false })).not.toMatch(
      /\sdisabled(?:\s|>)/,
    );
  });

  it("renders an internal hidden SVG icon without visible text", () => {
    const html = renderDiceActionButton({ ariaLabel: "Rolar resistência" });
    expect(html).toContain("<svg");
    expect(html).toContain("paranormal-toolkit-dice-action-button__icon");
    expect(html).toContain('aria-hidden="true"');
    expect(html).not.toContain(">Rolar resistência<");
  });

  it("contains no action contract, listener, or Foundry integration", () => {
    const source = readFileSync(
      "src/ui/components/chat/dice-action-button.ts",
      "utf8",
    );
    const html = renderDiceActionButton({ ariaLabel: "Roll" });
    expect(html).not.toMatch(/data-action|onclick|onClick/);
    expect(source).not.toMatch(/addEventListener|features\/(rituals|abilities|item-use)/);
    expect(source).not.toMatch(
      /\b(game|foundry|Actor|Item|Roll|ChatMessage|targets|workflow)\b/,
    );
    expect(source).not.toMatch(/from ['"](react|lucide-react)/);
  });

  it("uses fixed non-shrinking component-scoped visual states", () => {
    const css = readFileSync("styles/components/dice-action-button.css", "utf8");
    for (const rule of [
      "flex: 0 0 auto",
      "width: 34px",
      "height: 34px",
      "border-radius: 6px",
      "background: var(--ptk-chat-section-background)",
      "color: var(--ptk-chat-section-accent)",
      "box-shadow:",
      ":focus-visible",
      ":disabled",
      "filter: grayscale(0.5)",
    ]) {
      expect(css).toContain(rule);
    }
    expect(css).toContain(
      ".paranormal-toolkit-dice-action-button:not(:disabled):hover",
    );
    expect(css).not.toMatch(/\.paranormal-toolkit-dice-action-button:hover\s*\{/);
    expect(css).not.toContain("!important");
    expect(css).not.toMatch(/(^|})\s*(button|svg|path)\b/m);
  });

  it("defines enabled, disabled, and all examples through shared infrastructure", () => {
    const source = readFileSync("src/dev/chat-card-examples.ts", "utf8");
    expect(source).toContain(
      'export type DiceActionButtonExample = "enabled" | "disabled" | "all"',
    );
    expect(source).toContain("renderDiceActionButtonExample");
    expect(source).toContain("renderDiceActionButton({");
    expect(source).toContain('["enabled", "disabled"]');
    expect(source).toContain('"dice-action-button"');
    expect(source.match(/function createExampleMessage/g)).toHaveLength(1);
    expect(source.match(/const clearChatCardExamples/g)).toHaveLength(1);
  });
});
