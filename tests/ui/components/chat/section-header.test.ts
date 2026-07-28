import { readFileSync } from "node:fs";
import { describe, expect, it } from "vitest";
import { renderSectionHeader } from "../../../../src/ui/components/chat/section-header";

describe("renderSectionHeader", () => {
  it("escapes the title", () => {
    const html = renderSectionHeader({ title: `<Title & "section">` });
    expect(html).toContain("&lt;Title &amp; &quot;section&quot;&gt;");
    expect(html).not.toContain("<Title");
  });

  it("preserves trusted trailing markup", () => {
    const trailing = '<span class="internal-badge">Ready</span>';
    const html = renderSectionHeader({ title: "Title", trailing });
    expect(html).toContain(trailing);
    expect(html).toContain("paranormal-toolkit-section-header__trailing");
  });

  it("omits the trailing wrapper when trailing content is absent", () => {
    expect(renderSectionHeader({ title: "Title" })).not.toContain("__trailing");
  });

  it("has no domain or Foundry dependencies", () => {
    const source = readFileSync("src/ui/components/chat/section-header.ts", "utf8");
    expect(source).not.toMatch(/features\/(rituals|abilities|item-use)/);
    expect(source).not.toMatch(/\b(ritual|Actor|Item|Roll|game|foundry|workflow)\b/i);
  });

  it("uses inherited title color and overflow-safe flexible layout", () => {
    const css = readFileSync("styles/components/section-header.css", "utf8");
    expect(css).toContain("color: var(--ptk-chat-section-title)");
    expect(css).toContain("min-width: 0");
    expect(css).toContain("overflow-wrap: anywhere");
    expect(css).toContain("min-height: 22px");
    expect(css).not.toMatch(/(^|\s)height:\s*22px/);
    expect(css).not.toContain("!important");
  });

  it("centers trailing content without positional adjustments", () => {
    const css = readFileSync("styles/components/section-header.css", "utf8");
    const title = css.match(
      /\.paranormal-toolkit-section-header__title\s*\{[^}]+\}/,
    )?.[0];
    const trailing = css.match(
      /\.paranormal-toolkit-section-header__trailing\s*\{[^}]+\}/,
    )?.[0];
    const demoText = css.match(
      /\.paranormal-toolkit-section-header__demo-text\s*\{[^}]+\}/,
    )?.[0];

    expect(title).toContain("flex: 1 1 auto");
    expect(title).toContain("overflow-wrap: anywhere");
    expect(trailing).toContain("display: flex");
    expect(trailing).toContain("flex: 0 1 auto");
    expect(trailing).toContain("align-items: center");
    expect(trailing).toContain("justify-content: flex-end");
    expect(trailing).toContain("min-width: 0");
    expect(demoText).toContain("line-height: 1");
    expect(css).not.toMatch(/[;{]\s*(transform|top)\s*:/);
    expect(css).not.toContain("position: relative");
    expect(css).not.toContain("!important");
    expect(title).not.toContain("white-space: nowrap");
    expect(trailing).not.toContain("white-space: nowrap");
  });
});
