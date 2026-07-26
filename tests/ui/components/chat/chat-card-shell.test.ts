import { readFileSync } from "node:fs";
import { describe, expect, it } from "vitest";
import { renderChatCardShell } from "../../../../src/ui/components/chat/chat-card-shell";

describe("renderChatCardShell", () => {
  it("renders a semantic article and trusted content exactly once", () => {
    const content = '<header class="internal">Header</header>';
    const html = renderChatCardShell({ content });

    expect(html).toBe(
      `<article class="paranormal-toolkit-chat-card-shell">${content}</article>`,
    );
    expect(html.split(content)).toHaveLength(2);
    expect(html).not.toContain("&lt;header");
  });

  it("documents the internal-only trusted HTML contract", () => {
    const source = readFileSync(
      "src/ui/components/chat/chat-card-shell.ts",
      "utf8",
    );
    expect(source).toContain("exclusively by internal Paranormal Toolkit renderers");
    expect(source).toContain("does not accept arbitrary HTML supplied by a player or user");
  });

  it("contains no imports or domain knowledge", () => {
    const source = readFileSync(
      "src/ui/components/chat/chat-card-shell.ts",
      "utf8",
    );
    expect(source).not.toMatch(/^import\s/m);
    expect(source).not.toMatch(/\b(Foundry|Actor|Item|ritual|workflow|target)\b/i);
  });
});
