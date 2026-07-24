import { existsSync, readFileSync } from "node:fs";
import { describe, expect, it } from "vitest";
import {
  renderChatCardHeader,
  renderChatCardMetadata,
  renderChatCardSection,
  renderChatRollDisplay,
  renderChatStatusBanner,
} from "../../../../src/ui/components";
import { markTrustedHtml } from "../../../../src/ui/components/component-html";

const stylesheetPath = "styles/components/chat-card-components.css";
const galleryStylesheetPath = "styles/components/component-gallery.css";
const stylesheet = readFileSync(stylesheetPath, "utf8");

function classNames(html: string): string[] {
  return Array.from(html.matchAll(/class="([^"]+)"/gu))
    .flatMap((match) => match[1]!.split(/\s+/u))
    .filter((name) => name.startsWith("paranormal-toolkit-"));
}

describe("chat card stylesheets", () => {
  it("registra assets existentes no manifesto e no empacotamento da release", () => {
    const manifest = JSON.parse(readFileSync("module.json", "utf8")) as { styles: string[] };
    expect(manifest.styles).toContain(stylesheetPath);
    expect(manifest.styles).toContain(galleryStylesheetPath);
    expect(existsSync(stylesheetPath)).toBe(true);
    expect(existsSync(galleryStylesheetPath)).toBe(true);

    const workflow = readFileSync(".github/workflows/release.yml", "utf8");
    expect(workflow).toContain("for dir in dist styles templates lang assets packs docs");
  });

  it("possui seletores para as classes estruturais renderizadas", () => {
    const examples = [
      renderChatCardHeader({ eyebrow: "Tipo", title: "Título", badges: [{ label: "Badge" }] }),
      renderChatCardMetadata({ entries: [{ label: "Campo", value: "Valor" }] }),
      renderChatCardSection({ title: "Seção", content: markTrustedHtml("<p>Conteúdo</p>") }),
      renderChatRollDisplay({ label: "Teste", formula: "1d20", total: 12, dice: [{ value: "12", state: "active" }], action: { label: "Visual" } }),
      renderChatStatusBanner({ tone: "info", title: "Estado", message: "Mensagem" }),
    ];

    for (const name of new Set(examples.flatMap(classNames))) {
      expect(stylesheet, `selector for .${name}`).toContain(`.${name}`);
    }
  });

  it("mantém o shell claro e remove os principais tokens do tema escuro anterior", () => {
    expect(stylesheet).toContain("rgba(248, 244, 237, 0.98)");
    expect(stylesheet).toContain("border-left: 4px solid rgba(89, 36, 42, 0.78)");
    expect(stylesheet).not.toMatch(/#171a20|#242832|#eceff4/iu);
  });
});
