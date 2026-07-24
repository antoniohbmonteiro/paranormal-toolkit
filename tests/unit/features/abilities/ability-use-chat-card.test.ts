import { describe, expect, it } from "vitest";
import { renderAbilityUseCard } from "../../../../src/features/abilities/ability-use-chat-card";

describe("renderAbilityUseCard", () => {
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

    expect(html).toContain("data-paranormal-toolkit-ability-roll-id=\"damage--nex-40\"");
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
