import { describe, expect, it } from "vitest";
import {
  getToolkitDamageTypePresentation,
  type DamageTypeBadgeTone,
} from "../../../../src/core/damage/damage-types";
import { renderDamageTypeBadge } from "../../../../src/ui/components/chat/damage-type-badge";

describe("damage type badge", () => {
  it.each<[string, string, DamageTypeBadgeTone]>([
    ["cutting", "Corte", "physical"],
    ["impact", "Impacto", "physical"],
    ["blood", "Sangue", "blood"],
    ["death", "Morte", "death"],
    ["knowledge", "Conhecimento", "knowledge"],
    ["energy", "Energia", "energy"],
    ["fear", "Medo", "fear"],
    ["fire", "Fogo", "fire"],
    ["cold", "Frio", "cold"],
    ["electric", "Eletricidade", "electric"],
    ["chemical", "Químico", "chemical"],
    ["mental", "Mental", "mental"],
    ["homebrew", "Homebrew", "neutral"],
  ])("maps %s to label %s and tone %s", (type, label, tone) => {
    expect(getToolkitDamageTypePresentation(type)).toEqual({ label, tone });
  });

  it("escapes the visible label", () => {
    const html = renderDamageTypeBadge({
      label: '<Medo & "perigo">',
      tone: "fear",
    });
    expect(html).toContain("&lt;Medo &amp; &quot;perigo&quot;&gt;");
    expect(html).not.toContain("<Medo");
  });

  it("omits an empty badge", () => {
    expect(renderDamageTypeBadge({ label: "  ", tone: "neutral" })).toBe("");
  });
});
