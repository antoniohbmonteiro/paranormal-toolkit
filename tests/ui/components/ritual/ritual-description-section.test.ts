import { describe, expect, it } from "vitest";
import { renderRitualDescriptionSection } from "../../../../src/ui/components/ritual/ritual-description-section";

describe("renderRitualDescriptionSection", () => {
  it("omits empty descriptions", () => expect(renderRitualDescriptionSection({ html: "   " })).toBe(""));
  it("starts collapsed and preserves prepared paragraphs, lists, and emphasis", () => {
    const html = renderRitualDescriptionSection({ html: "<p>Primeiro</p><p><strong>Segundo</strong></p><ul><li>Item</li></ul>" });
    expect(html).toContain("<details");
    expect(html).not.toContain(" open");
    expect(html).toContain("<summary");
    expect(html).toContain("<strong>Segundo</strong>");
    expect(html).toContain("<ul><li>Item</li></ul>");
  });
});
