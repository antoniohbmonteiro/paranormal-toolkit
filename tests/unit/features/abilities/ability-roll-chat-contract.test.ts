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

it("normalizes a serializable v3 result snapshot defensively", () => {
  const flag = normalizeAbilityUseMessageFlag({ version: 3, state: { schemaVersion: 1, ability: { name:"Premonição",image:"a.webp",descriptionHtml:"<p>Visão</p>",activationLabel:"Livre" }, actor:{id:"a",uuid:"Actor.a",name:"Agente"}, item:{id:"i",uuid:"Actor.a.Item.i",name:"Premonição"}, resource:{type:"PE",cost:2,passive:false,spent:true,before:5,after:3}, rolls:[{id:"r",sourceRollId:"r",label:"Medo",intent:"damage",damageType:"fear",formula:"2d6",total:7,diceResults:[3,4],nexThreshold:40}], createdAt:10 } });
  expect(flag).toMatchObject({ version:3, state:{ rolls:[{total:7,diceResults:[3,4]}] } });
  expect(normalizeAbilityUseMessageFlag({ version:3,state:{schemaVersion:1} })).toBeNull();
});
