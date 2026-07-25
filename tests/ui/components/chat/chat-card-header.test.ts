import { readFileSync } from "node:fs";
import { describe, expect, it } from "vitest";
import {
  renderChatCardHeader,
  type ChatCardHeaderViewModel,
} from "../../../../src/ui/components/chat/chat-card-header";

const model: ChatCardHeaderViewModel = {
  imageUrl: "icons/sundries/books/book-symbol-reverse-blue.webp",
  imageAlt: "Ícone de Eletrocussão",
  eyebrow: "Ritual",
  title: "Eletrocussão",
  target: "Malvadão",
};

describe("renderChatCardHeader", () => {
  it("renders the image, eyebrow, title, and target", () => {
    const html = renderChatCardHeader(model);

    expect(html).toContain(`src="${model.imageUrl}"`);
    expect(html).toContain("Ritual");
    expect(html).toContain("Eletrocussão");
    expect(html).toContain("Malvadão");
  });

  it("renders an optional badge and its tone class", () => {
    const html = renderChatCardHeader({
      ...model,
      badge: { label: "Energia 1", tone: "energy" },
    });

    expect(html).toContain("Energia 1");
    expect(html).toContain("ptk-chat-card-header__badge--energy");
  });

  it("omits the badge when one is not provided", () => {
    expect(renderChatCardHeader(model)).not.toContain("__badge");
  });

  it("escapes all rendered text and image attributes", () => {
    const html = renderChatCardHeader({
      imageUrl: `icon\" onerror=\"alert('image')`,
      imageAlt: `<ritual & "icon">`,
      eyebrow: `<Ritual>` ,
      title: `Shock & "Awe"`,
      target: `Mau 'alvo'`,
      badge: { label: `<Energia & 1>`, tone: "energy" },
    });

    expect(html).not.toContain("<Ritual>");
    expect(html).not.toContain(" onerror=\"");
    expect(html).toContain("&lt;Ritual&gt;");
    expect(html).toContain("Shock &amp; &quot;Awe&quot;");
    expect(html).toContain("Mau &#039;alvo&#039;");
    expect(html).toContain("icon&quot; onerror=&quot;alert(&#039;image&#039;)");
    expect(html).toContain("&lt;ritual &amp; &quot;icon&quot;&gt;");
  });

  it("uses defensive, component-scoped CSS", () => {
    const css = readFileSync("styles/components/chat-card-header.css", "utf8");

    expect(css).toContain("grid-template-columns: 46px minmax(0, 1fr)");
    expect(css).toContain("width: 46px");
    expect(css).toContain("height: 46px");
    expect(css).toContain("max-width: 46px");
    expect(css).toContain("min-width: 0");
    expect(css).not.toMatch(/(^|,)\s*img\s*[{,]/m);
  });

  it("has no Foundry or production workflow imports", () => {
    const source = readFileSync(
      "src/ui/components/chat/chat-card-header.ts",
      "utf8",
    );

    expect(source).not.toMatch(/^import\s/m);
    expect(source).not.toMatch(/features\/(abilities|item-use|rituals)/);
    expect(source).not.toMatch(/\b(game|Actor|Item|Token|ChatMessage|Roll|flags)\b/);
  });
});
