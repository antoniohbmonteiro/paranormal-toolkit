import { readFileSync } from "node:fs";
import { describe, expect, it } from "vitest";
import { renderChatCardHeader } from "../../../../src/ui/components/chat/chat-card-header";

describe("renderChatCardHeader", () => {
  it("renders supplied fields, multiple badges, and the shared badge renderer markup", () => {
    const html = renderChatCardHeader({
      image: { src: "icons/example.webp", alt: "Example" },
      title: "Card title",
      subtitle: "Subtitle",
      badges: [
        { label: "First", tone: "accent" },
        { label: "Second", tone: "neutral" },
      ],
      context: "Prepared context",
    });

    expect(html).toContain("<header class=\"paranormal-toolkit-chat-card-header\">");
    expect(html).toContain("Card title");
    expect(html).toContain("· Subtitle");
    expect(html.match(/paranormal-toolkit-header-badge--/g)).toHaveLength(2);
    expect(html).toContain("Prepared context");
  });

  it("renders a defensive placeholder without an image source", () => {
    const html = renderChatCardHeader({ title: "Title" });
    expect(html).toContain("__placeholder-icon");
    expect(html).not.toContain("<img");
  });

  it("omits absent optional subtitle, badges, and context", () => {
    const html = renderChatCardHeader({ title: "Only title" });
    expect(html).not.toContain("__subtitle");
    expect(html).not.toContain("__badges");
    expect(html).not.toContain("__context");
  });

  it("escapes every external text and image attribute", () => {
    const html = renderChatCardHeader({
      image: {
        src: `image\" onerror=\"alert('x')`,
        alt: `<Alt & "text">`,
      },
      title: `<Title & "one">`,
      subtitle: `<Subtitle>`,
      badges: [{ label: `<Badge>` }],
      context: `Context 'quoted' & more`,
    });

    expect(html).not.toContain("<Title");
    expect(html).not.toContain(" onerror=\"");
    expect(html).toContain("&lt;Title &amp; &quot;one&quot;&gt;");
    expect(html).toContain("&lt;Subtitle&gt;");
    expect(html).toContain("&lt;Badge&gt;");
    expect(html).toContain("Context &#039;quoted&#039; &amp; more");
    expect(html).toContain("image&quot; onerror=&quot;alert(&#039;x&#039;)");
    expect(html).toContain("&lt;Alt &amp; &quot;text&quot;&gt;");
  });

  it("uses renderHeaderBadge and has no Foundry or feature imports", () => {
    const source = readFileSync(
      "src/ui/components/chat/chat-card-header.ts",
      "utf8",
    );
    expect(source).toContain("renderHeaderBadge");
    expect(source).not.toMatch(/\b(game|Actor|Item|Foundry|workflow)\b/);
    expect(source).not.toMatch(/features\/(rituals|abilities|item-use)/);
  });
});
