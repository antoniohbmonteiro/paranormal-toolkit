import { readFileSync } from "node:fs";
import { describe, expect, it } from "vitest";
import {
  renderSectionCard,
  type SectionCardTone,
} from "../../../../src/ui/components/chat/section-card";

describe("renderSectionCard", () => {
  it.each(["casting", "damage", "resistance"] as const)(
    "renders the %s tone class",
    (tone) => {
      expect(renderSectionCard({ tone, content: "Content" })).toContain(
        `paranormal-toolkit-section-card--${tone}`,
      );
    },
  );

  it("falls back safely when an invalid runtime tone is received", () => {
    const tone = "invalid" as SectionCardTone;
    expect(renderSectionCard({ tone, content: "Content" })).toContain(
      "paranormal-toolkit-section-card--casting",
    );
  });

  it("preserves trusted internal content", () => {
    const content = '<div class="internal-component">Prepared HTML</div>';
    const html = renderSectionCard({ tone: "casting", content });
    expect(html).toContain(content);
    expect(html.split(content)).toHaveLength(2);
    expect(html).not.toContain("&lt;div");
  });

  it("has no Foundry or feature dependencies", () => {
    const source = readFileSync("src/ui/components/chat/section-card.ts", "utf8");
    expect(source).not.toMatch(/^import\s/m);
    expect(source).not.toMatch(/features\/(rituals|abilities|item-use)/);
    expect(source).not.toMatch(/\b(Actor|Item|Roll|game|foundry|workflow)\b/);
  });

  it("defines defensive structure and all tone tokens", () => {
    const css = readFileSync("styles/components/section-card.css", "utf8");
    expect(css).toContain("border-radius: 7px");
    expect(css).toContain("padding: 0.5rem 0.6rem");
    expect(css).toContain("gap: 0.22rem");
    expect(css).toContain("min-width: 0");
    for (const tone of ["casting", "damage", "resistance"]) {
      expect(css).toContain(`paranormal-toolkit-section-card--${tone}`);
    }
    expect(css).toContain("--ptk-chat-section-accent");
    expect(css).toContain("--ptk-chat-section-border");
    expect(css).toContain("--ptk-chat-section-background");
    expect(css).toContain("--ptk-chat-section-title");
  });
});
