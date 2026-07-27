import { readFileSync } from "node:fs";
import { describe, expect, it } from "vitest";

describe("unified ritual configuration UI", () => {
  const source = readFileSync(
    "src/ui/item-sheet-actions/item-sheet-ritual-resistance-outcome-block.ts",
    "utf8",
  ).replace(/\r\n/g, "\n");
  const css = readFileSync(
    "styles/ritual-resistance-outcomes.css",
    "utf8",
  ).replace(/\r\n/g, "\n");

  it("embeds resistance outcomes in the generic ritual configuration", () => {
    expect(source).toContain('title.textContent = "Configuração genérica do ritual"');
    expect(source).toContain('sectionTitle.textContent = "Fórmula de rolagem"');
    expect(source).toContain('title.textContent = "Efeitos da resistência"');
    expect(source).toContain('actions.insertAdjacentElement("beforebegin", section)');
  });

  it("uses one save and one clear action for both flags", () => {
    expect(source).toContain('save.textContent = "Salvar configuração"');
    expect(source).toContain('clear.textContent = "Limpar configuração"');
    expect(source).not.toContain("Salvar efeitos");
    expect(source).not.toContain("Limpar efeitos");
    expect(source).toContain(`flags.\${MODULE_ID}.\${RITUAL_ROLL_CONFIG_FLAG_KEY}`);
    expect(source).toContain(`flags.\${MODULE_ID}.\${RITUAL_RESISTANCE_OUTCOME_CONFIG_FLAG_KEY}`);
  });

  it("gives the condition selector the full row width", () => {
    expect(css).toContain(
      ".paranormal-toolkit-ritual-resistance-outcomes__condition-field {\n  grid-column: 1 / -1;",
    );
  });
});
