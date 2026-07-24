import { describe, expect, it } from "vitest";
import { renderAbilityUseCard } from "../../../../src/features/abilities/ability-use-chat-card";

describe("renderAbilityUseCard", () => {
  it("renders a paid ability with the resource transaction", () => {
    const html = renderAbilityUseCard({
      abilityName: "Ataque Especial",
      abilityImage: "icons/attack.webp",
      actorName: "Agente",
      activationLabel: "Livre",
      description: "<p>Recebe bônus no ataque.</p>",
      resource: "PE",
      cost: 2,
      passive: false,
      spentResource: true,
      resourceBefore: 7,
      resourceAfter: 5,
    });

    expect(html).toContain("Ataque Especial");
    expect(html).toContain("2 PE gastos (7 → 5)");
    expect(html).toContain("paranormal-toolkit-ability-card__status--spent");
  });

  it("escapes user-facing metadata while preserving enriched description HTML", () => {
    const html = renderAbilityUseCard({
      abilityName: "<Habilidade>",
      abilityImage: 'image\".webp',
      actorName: "Agente & Aliado",
      activationLabel: "Padrão",
      description: "<p><strong>Descrição enriquecida</strong></p>",
      resource: "PD",
      cost: 0,
      passive: false,
      spentResource: false,
      resourceBefore: 0,
      resourceAfter: 0,
    });

    expect(html).toContain("&lt;Habilidade&gt;");
    expect(html).toContain("Agente &amp; Aliado");
    expect(html).toContain('src="image&quot;.webp"');
    expect(html).toContain("<strong>Descrição enriquecida</strong>");
    expect(html).toContain("paranormal-toolkit-ability-card__status--neutral");
  });

  it("shows when a paid ability was intentionally used without spending", () => {
    const html = renderAbilityUseCard({
      abilityName: "Forçar a Barra",
      abilityImage: "icons/ability.webp",
      actorName: "Agente",
      activationLabel: "Livre",
      description: "",
      resource: "PE",
      cost: 3,
      passive: false,
      spentResource: false,
      resourceBefore: 1,
      resourceAfter: 1,
    });

    expect(html).toContain("3 PE não descontados");
    expect(html).toContain("paranormal-toolkit-ability-card__status--not-spent");
  });
});
