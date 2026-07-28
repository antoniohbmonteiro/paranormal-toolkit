import { describe, expect, it } from "vitest";
import { renderAbilityUseCard } from "../../../../src/features/abilities/ability-use-chat-card";

describe("renderAbilityUseCard", () => {
  it("renders a persisted result without any reroll affordance", () => {
    const html = renderAbilityUseCard({
      header: { eyebrow: "Habilidade", title: "Visão do Medo", context: "Agente" },
      metadata: { items: [{ text: "2 PE" }, { text: "Execução: Livre" }] },
      rolls: [{ label: "Presságio", detail: "Dano · Medo · NEX 40%", tone: "damage", roll: { formula: "2d6 + 3", total: 11, diceResults: [4, 4] } }],
      resourceStatus: { text: "2 PE gastos (5 → 3)", tone: "spent" },
    });
    expect(html).toContain("2d6 + 3");
    expect(html).toContain('aria-label="Resultado: 11"');
    expect(html).toContain("Resultados dos dados");
    expect(html).not.toContain("<button");
    expect(html).not.toContain("data-paranormal-toolkit-ability-roll-id");
    expect(html).not.toContain("inline-roll");
  });
  it("renders configured fixed and NEX roll actions", () => {
    const html = renderAbilityUseCard({
      abilityName: "Habilidade",
      abilityImage: "ability.webp",
      actorName: "Agente",
      activationLabel: "Livre",
      description: "",
      resource: "PE",
      cost: 1,
      passive: false,
      spentResource: true,
      resourceBefore: 5,
      resourceAfter: 4,
      rolls: [
        {
          id: "damage--nex-40",
          sourceRollId: "damage",
          label: "Dano adicional",
          intent: "damage",
          damageType: "knowledge",
          formula: "2d6",
          nexThreshold: 40,
        },
      ],
    });

    expect(html).not.toContain("data-paranormal-toolkit-ability-roll-id");
    expect(html).toContain("Dano · Conhecimento");
    expect(html).toContain("NEX 40%");
  });

  it("omits the roll section when the ability has no configured formulas", () => {
    const html = renderAbilityUseCard({
      abilityName: "Habilidade",
      abilityImage: "ability.webp",
      actorName: "Agente",
      activationLabel: "Livre",
      description: "",
      resource: "PE",
      cost: 0,
      passive: false,
      spentResource: false,
      resourceBefore: 0,
      resourceAfter: 0,
      rolls: [],
    });

    expect(html).not.toContain("paranormal-toolkit-ability-card__rolls");
  });
});
