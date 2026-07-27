import { describe, expect, it } from "vitest";
import { renderRitualEffectSection } from "../../../../src/ui/components/ritual/ritual-effect-section";

describe("renderRitualEffectSection", () => {
  it.each([["Dano", "damage"], ["Cura", "healing"], ["Efeito", "casting"]] as const)("uses the %s palette", (title, tone) => {
    expect(renderRitualEffectSection({ title, formula: "1d6", total: 4 })).toContain(`paranormal-toolkit-section-card--${tone}`);
  });
});
