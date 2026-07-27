import { readFileSync } from "node:fs";
import { describe, expect, it } from "vitest";

const files = [
  "styles/components/chat-card-tokens.css",
  "styles/components/chat-card-shell.css",
  "styles/components/header-badge.css",
  "styles/components/chat-card-header.css",
];

describe("chat card foundation CSS", () => {
  it("defines component-scoped visual tokens", () => {
    const css = readFileSync(files[0], "utf8");
    expect(css).toContain("--ptk-chat-shell-background");
    expect(css).toContain("--ptk-chat-shell-stripe: rgba(89, 36, 42, 0.72)");
    expect(css).toContain("--ptk-chat-energy-background: rgba(107, 54, 168, 0.09)");
  });

  it("uses defensive shell and header layout rules", () => {
    const shell = readFileSync(files[1], "utf8");
    const header = readFileSync(files[3], "utf8");
    expect(shell).toContain("border-left: 2px solid");
    expect(shell).toContain("width: 100%");
    expect(shell).toContain("min-width: 0");
    expect(shell).not.toContain("max-width: 300px");
    expect(header).toContain("width: 52px");
    expect(header).toContain("height: 52px");
    expect(header).toContain("max-width: 52px");
    expect(header).toContain("object-fit: cover");
    expect(header).toContain("overflow-wrap: anywhere");
    const outerHeaderRule = header.match(
      /\.paranormal-toolkit-chat-card-header\s*\{[^}]+\}/,
    )?.[0];
    expect(outerHeaderRule).not.toContain("height:");
  });

  it("has no global image selectors, inline escape hatches, or important rules", () => {
    const css = files.map((file) => readFileSync(file, "utf8")).join("\n");
    expect(css).not.toMatch(/(^|,)\s*img\b/m);
    expect(css).not.toContain("!important");
    expect(css).not.toMatch(/(^|})\s*(article|header|button|img|span)\b/m);
  });
});
