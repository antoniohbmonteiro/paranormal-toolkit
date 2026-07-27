import { readFileSync } from "node:fs";
import { describe, expect, it } from "vitest";
import { renderCompletionIndicator } from "../../../../src/ui/components/chat/completion-indicator";
describe("renderCompletionIndicator", () => {
  it("renders escaped noninteractive completion and filters empty labels", () => {
    const html=renderCompletionIndicator({label:"<Aplicado>"}); expect(html).toContain('aria-hidden="true">✓');
    expect(html).toContain("&lt;Aplicado&gt;"); expect(html).not.toContain("<button"); expect(renderCompletionIndicator({label:" "})).toBe("");
  });
  it("uses success color without interactive styles", () => { const css=readFileSync("styles/components/completion-indicator.css","utf8"); expect(css).toContain("var(--ptk-chat-success-text)"); expect(css).not.toMatch(/hover|focus|cursor/); });
});
