import { describe, expect, it } from "vitest";
import { renderRitualEffectSection } from "../../../../src/ui/components/ritual/ritual-effect-section";

describe("renderRitualEffectSection", () => {
  it.each([["Dano", "damage"], ["Cura", "healing"], ["Efeito", "effect"]] as const)("uses the %s palette", (title, tone) => {
    expect(renderRitualEffectSection({ title, formula: "1d6", total: 4 })).toContain(`paranormal-toolkit-section-card--${tone}`);
  });
  it("renders the configured utility label without introducing actions", () => {
    const html = renderRitualEffectSection({ title: "Efeito", resultLabel: "PV temporários", formula: "3d6", total: 13 });
    expect(html).toContain("PV temporários");
    expect(html).toContain("paranormal-toolkit-ritual-effect-section__result-label");
    expect(html).not.toContain("data-paranormal-toolkit-card-action");
  });
  it("falls back to Resultado for old payloads", () => {
    expect(renderRitualEffectSection({ title: "Efeito", formula: "1d6", total: 4 })).toContain("Resultado");
  });
});
