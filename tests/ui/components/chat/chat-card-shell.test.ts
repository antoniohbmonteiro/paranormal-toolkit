import { readFileSync } from "node:fs";
import { describe, expect, it } from "vitest";
import { renderChatCardShell } from "../../../../src/ui/components/chat/chat-card-shell";

describe("renderChatCardShell", () => {
  it("renders a semantic outer container with child content exactly once", () => {
    const child = '<header class="internal-header">Header</header>';
    const html = renderChatCardShell({ content: child });

    expect(html).toBe(
      `<article class="ptk-chat-card-shell">${child}</article>`,
    );
    expect(html.split(child)).toHaveLength(2);
  });

  it("preserves trusted internal component markup", () => {
    const child = '<header class="ptk-chat-card-header">Ritual</header>';

    expect(renderChatCardShell({ content: child })).toContain(child);
    expect(renderChatCardShell({ content: child })).not.toContain("&lt;header");
  });

  it("documents its internal-renderer-only content contract", () => {
    const source = readFileSync(
      "src/ui/components/chat/chat-card-shell.ts",
      "utf8",
    );

    expect(source).toContain("internal Paranormal Toolkit renderers only");
    expect(source).toContain("Do not pass arbitrary or user-authored HTML");
  });

  it("has no Foundry or production feature imports", () => {
    const source = readFileSync(
      "src/ui/components/chat/chat-card-shell.ts",
      "utf8",
    );

    expect(source).not.toMatch(/^import\s/m);
    expect(source).not.toMatch(/features\/(abilities|item-use|rituals)/);
    expect(source).not.toMatch(
      /\b(game|Actor|Item|ritual|ability|damage|effect|roll|workflow)\b/i,
    );
  });

  it("uses the production card values and defensive sizing", () => {
    const css = readFileSync("styles/components/chat-card-shell.css", "utf8");

    expect(css).toContain("border-left: 4px solid rgba(89, 36, 42, 0.72)");
    expect(css).toContain("rgba(248, 244, 237, 0.96)");
    expect(css).toContain("rgba(234, 226, 214, 0.98)");
    expect(css).toContain("box-sizing: border-box");
    expect(css).toContain("width: 100%");
    expect(css).toContain("max-width: 100%");
    expect(css).toContain("min-width: 0");
  });

  it("uses component-scoped selectors only", () => {
    const css = readFileSync("styles/components/chat-card-shell.css", "utf8");
    const selectors = [...css.matchAll(/(^|})\s*([^@][^{]+)\s*\{/g)].map(
      ([, , selector]) => selector.trim(),
    );

    expect(selectors).toEqual([".ptk-chat-card-shell"]);
    expect(css).not.toMatch(/(^|,)\s*(article|header|img|h3|p|span)\b/m);
    expect(css).not.toContain("!important");
  });
});
