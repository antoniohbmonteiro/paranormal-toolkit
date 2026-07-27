import { readFileSync } from "node:fs";
import { describe, expect, it } from "vitest";
import { renderHeaderBadge } from "../../../../src/ui/components/chat/header-badge";

describe("renderHeaderBadge", () => {
  it("escapes its label and uses the accent tone by default", () => {
    const html = renderHeaderBadge({ label: `<Badge & "one">` });
    expect(html).toContain("paranormal-toolkit-header-badge--accent");
    expect(html).toContain("&lt;Badge &amp; &quot;one&quot;&gt;");
    expect(html).not.toContain(`<Badge`);
  });

  it.each(["accent", "neutral", "wine", "energy", "blood", "knowledge", "death", "fear"] as const)(
    "renders the %s visual tone",
    (tone) => {
      expect(renderHeaderBadge({ label: "Label", tone })).toContain(
        `paranormal-toolkit-header-badge--${tone}`,
      );
    },
  );

  it("contains no domain-specific logic", () => {
    const source = readFileSync("src/ui/components/chat/header-badge.ts", "utf8");
    expect(source).not.toMatch(/\b(element|circle|ritual|ability|Item|Foundry)\b/i);
    expect(source).not.toContain("ElementBadge");
  });
});
