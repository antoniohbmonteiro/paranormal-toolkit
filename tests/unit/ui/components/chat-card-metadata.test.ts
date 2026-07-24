import { expect, it } from "vitest";
import { renderChatCardMetadata } from "../../../../src/ui/components";

it("renderiza metadados compactos com texto escapado", () => {
  const html = renderChatCardMetadata({
    entries: [
      { label: "Execução <breve>", value: "1 & 2" },
      { label: "Custo", value: '3 "cargas"' },
    ],
  });

  expect(html).toContain("paranormal-toolkit-chat-card-metadata");
  expect(html).toContain("Execução &lt;breve&gt;");
  expect(html).toContain("1 &amp; 2");
  expect(html).toContain("3 &quot;cargas&quot;");
});
