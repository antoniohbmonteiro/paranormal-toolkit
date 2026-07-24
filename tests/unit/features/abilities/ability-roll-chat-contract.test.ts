import { describe, expect, it } from "vitest";
import { normalizeAbilityUseMessageFlag } from "../../../../src/features/abilities/ability-roll-chat-contract";

describe("normalizeAbilityUseMessageFlag", () => {
  it("keeps only valid roll actions from version 2 cards", () => {
    const flag = normalizeAbilityUseMessageFlag({
      version: 2,
      actorUuid: "Actor.actor-id",
      itemUuid: "Actor.actor-id.Item.ability-id",
      abilityName: "Ataque Furtivo",
      resource: "PE",
      cost: 1,
      spentResource: true,
      resourceBefore: 5,
      resourceAfter: 4,
      rolls: [
        {
          id: "damage",
          sourceRollId: "damage",
          label: "Dano adicional",
          intent: "damage",
          damageType: "impact",
          formula: "2d6",
          nexThreshold: 40,
        },
        { id: "invalid" },
      ],
    });

    expect(flag?.rolls).toEqual([
      expect.objectContaining({
        id: "damage",
        formula: "2d6",
        nexThreshold: 40,
      }),
    ]);
  });

  it("rejects legacy or malformed card flags", () => {
    expect(normalizeAbilityUseMessageFlag({ version: 1, rolls: [] })).toBeNull();
    expect(normalizeAbilityUseMessageFlag({ version: 2, rolls: [] })).toBeNull();
  });
});
