import { readFileSync } from "node:fs";
import { describe, expect, it } from "vitest";
import {
  renderChatCardHeader,
  type ChatCardHeaderViewModel,
} from "../../../../src/ui/components/chat/chat-card-header";

const baseModel: ChatCardHeaderViewModel = {
  imageUrl: "ritual.webp",
  imageAlt: "Ritual",
  eyebrow: "Ritual",
  title: "Eletrocussão",
};

describe("renderChatCardHeader", () => {
  it("renders its image, eyebrow, title and optional context", () => {
    const html = renderChatCardHeader({ ...baseModel, context: "Mercy → Malvadão" });

    expect(html).toContain('src="ritual.webp"');
    expect(html).toContain(">Ritual</span>");
    expect(html).toContain(">Eletrocussão</h3>");
    expect(html).toContain("Mercy → Malvadão");
  });

  it("omits context when it is absent", () => {
    expect(renderChatCardHeader(baseModel)).not.toContain("__context");
  });

  it.each([
    [[], 0],
    [[{ label: "Energia", tone: "energy" as const }], 1],
    [[{ label: "Sangue", tone: "blood" as const }, { label: "Medo", tone: "fear" as const }], 2],
  ])("renders zero, one or multiple badges", (badges, count) => {
    const html = renderChatCardHeader({ ...baseModel, badges });
    expect(html.match(/chat-card-header__badge(?!s)/gu) ?? []).toHaveLength(count * 2);
  });

  it.each(["neutral", "blood", "death", "knowledge", "energy", "fear"] as const)(
    "maps the %s tone to its modifier class",
    (tone) => {
      expect(renderChatCardHeader({ ...baseModel, badges: [{ label: tone, tone }] }))
        .toContain(`chat-card-header__badge--${tone}`);
    },
  );

  it("escapes user strings and image attributes", () => {
    const html = renderChatCardHeader({
      imageUrl: 'x" onerror="alert(1)',
      imageAlt: "<alt>",
      eyebrow: "<script>",
      title: "A & B",
      context: "'target'",
      badges: [{ label: "<badge>" }],
    });

    expect(html).not.toContain("<script>");
    expect(html).not.toContain('onerror="alert');
    expect(html).toContain('src="x&quot; onerror=&quot;alert(1)"');
    expect(html).toContain("&lt;alt&gt;");
    expect(html).toContain("A &amp; B");
    expect(html).toContain("&#039;target&#039;");
    expect(html).toContain("&lt;badge&gt;");
  });

  it("has no Foundry dependencies", () => {
    const source = readFileSync("src/ui/components/chat/chat-card-header.ts", "utf8");
    expect(source).not.toMatch(/\b(game|Hooks|Actor|Item|ChatMessage|Roll|foundry)\b/u);
  });

  it("uses defensive icon and narrow-width CSS", () => {
    const css = readFileSync("styles/components/chat-card-header.css", "utf8");
    expect(css).toMatch(/width:\s*46px/u);
    expect(css).toMatch(/height:\s*46px/u);
    expect(css).toMatch(/max-width:\s*46px/u);
    expect(css).toContain("object-fit: cover");
    expect(css).toContain("minmax(0, 1fr)");
    expect(css).toContain("min-width: 0");
  });
});
