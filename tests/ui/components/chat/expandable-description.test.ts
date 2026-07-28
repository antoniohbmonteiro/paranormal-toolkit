import { describe, expect, it } from "vitest";
import { renderExpandableDescription } from "../../../../src/ui/components/chat/expandable-description";
import { renderAbilityUseCard } from "../../../../src/ui/components/ability/ability-use-card";
import { renderRitualSingleTargetCard } from "../../../../src/ui/components/ritual/ritual-single-target-card";

describe("renderExpandableDescription", () => {
  it("omits empty descriptions", () => expect(renderExpandableDescription({ html: "   " })).toBe(""));
  it("starts collapsed and preserves prepared paragraphs, lists, and emphasis", () => {
    const html = renderExpandableDescription({ html: "<p>Primeiro</p><p><strong>Segundo</strong></p><ul><li>Item</li></ul>" });
    expect(html).toContain("<details");
    expect(html).not.toContain(" open");
    expect(html).toContain("<summary");
    expect(html).toContain("<strong>Segundo</strong>");
    expect(html).toContain("<ul><li>Item</li></ul>");
  });
  it("produces identical description markup for ability and ritual cards", () => {
    const description = { html: "<p>Descrição compartilhada</p>" };
    const expected = renderExpandableDescription(description);
    const ability = renderAbilityUseCard({
      header: { title: "Habilidade" },
      description,
      metadata: { items: [] },
      rolls: [],
    });
    const ritual = renderRitualSingleTargetCard({
      header: { title: "Ritual" },
      description,
    });
    expect(ability).toContain(expected);
    expect(ritual).toContain(expected);
  });
});
