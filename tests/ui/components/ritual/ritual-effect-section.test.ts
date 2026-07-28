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
  it("uses the shared damage badge for a damage result", () => {
    const html = renderRitualEffectSection({
      title: "Dano",
      damageTypeBadge: { label: "Frio", tone: "cold" },
      formula: "2d6",
      total: 7,
    });
    expect(html).toContain("paranormal-toolkit-damage-type-badge--cold");
    expect(html).toContain(">Frio</span>");
  });
  it.each([undefined, "", "   "])("omits the result label element when the label is %s", (resultLabel) => {
    const html = renderRitualEffectSection({ title: "Efeito", resultLabel, formula: "1d6", total: 4 });
    expect(html).not.toContain("paranormal-toolkit-ritual-effect-section__result-label");
    expect(html).not.toContain(">Resultado<");
  });
});
