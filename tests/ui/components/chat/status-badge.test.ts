import { readFileSync } from "node:fs";
import { describe, expect, it } from "vitest";
import { renderStatusBadge } from "../../../../src/ui/components/chat/status-badge";

describe("renderStatusBadge", () => {
  it("renders the success class and exact internal label", () => {
    expect(renderStatusBadge({ state: "success" })).toBe(
      '<span class="paranormal-toolkit-status-badge paranormal-toolkit-status-badge--success">✓ SUCESSO</span>',
    );
  });

  it("renders the failure class and exact internal label", () => {
    expect(renderStatusBadge({ state: "failure" })).toBe(
      '<span class="paranormal-toolkit-status-badge paranormal-toolkit-status-badge--failure">✕ FALHA</span>',
    );
  });

  it("uses explicit maps and exposes no arbitrary label or interaction", () => {
    const source = readFileSync("src/ui/components/chat/status-badge.ts", "utf8");
    const html = renderStatusBadge({ state: "success" });
    expect(source).toContain("STATE_CLASSES");
    expect(source).toContain("STATE_LABELS");
    expect(source).not.toMatch(/label\??:/);
    expect(html).not.toContain("<button");
    expect(html).not.toMatch(/data-action|onclick|onClick|tabindex/);
  });

  it("has no domain, Foundry, or workflow dependencies", () => {
    const source = readFileSync("src/ui/components/chat/status-badge.ts", "utf8");
    expect(source).not.toMatch(/^import\s/m);
    expect(source).not.toMatch(/features\/(rituals|abilities|item-use)/);
    expect(source).not.toMatch(
      /\b(game|foundry|Actor|Item|Roll|ChatMessage|ritual|casting|resistance|damage|workflow)\b/i,
    );
  });

  it("uses the specified non-interactive component-scoped CSS", () => {
    const css = readFileSync("styles/components/status-badge.css", "utf8");
    for (const rule of [
      "box-sizing: border-box",
      "display: inline-flex",
      "flex-shrink: 0",
      "align-items: center",
      "gap: 3px",
      "border: 1px solid",
      "border-radius: 99px",
      "padding: 2px 8px",
      "font-size: 9.5px",
      "font-weight: 700",
      "line-height: 1.2",
      "letter-spacing: 0.04em",
      "white-space: nowrap",
    ]) {
      expect(css).toContain(rule);
    }
    expect(css).toContain("var(--ptk-chat-success-border)");
    expect(css).toContain("var(--ptk-chat-success-background)");
    expect(css).toContain("var(--ptk-chat-success-text)");
    expect(css).toContain("var(--ptk-chat-failure-border)");
    expect(css).toContain("var(--ptk-chat-failure-background)");
    expect(css).toContain("var(--ptk-chat-failure-text)");
    expect(css).not.toContain("!important");
    expect(css).not.toMatch(/(^|})\s*span\b/m);
    expect(css).not.toMatch(/cursor\s*:/);
  });

  it("defines every exact shared success and failure token", () => {
    const css = readFileSync("styles/components/chat-card-tokens.css", "utf8");
    for (const value of [
      "#287547",
      "rgba(40, 117, 71, 0.34)",
      "#e8f4eb",
      "#205d39",
      "#a1363b",
      "rgba(161, 54, 59, 0.34)",
      "#f8e7e7",
      "#842c31",
    ]) {
      expect(css).toContain(value);
    }
  });

  it("composes casting and dedicated examples through SectionHeader", () => {
    const source = readFileSync("src/dev/chat-card-examples.ts", "utf8");
    expect(source).toContain('trailing: renderStatusBadge({ state: "success" })');
    expect(source).toContain("function renderStatusExample");
    expect(source).toMatch(
      /renderSectionHeader\(\{[\s\S]*?trailing: renderStatusBadge\(\{ state \}\)/,
    );
    expect(source).not.toContain(
      'renderHeaderBadge({ label: "SUCESSO", tone: "neutral" })',
    );
  });
});
