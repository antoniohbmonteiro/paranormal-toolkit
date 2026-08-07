import { describe, expect, it } from "vitest";
import { buildAbilityUseCardState } from "../../../../src/features/abilities/ability-use-card-state-builder";
import { createAbilityAssistedActionId } from "../../../../src/features/abilities/ability-use-card-state";
import type { ExecutedAbilityRoll } from "../../../../src/features/abilities/ability-roll-executor";

const actor = {
  id: "source",
  uuid: "Actor.source",
  name: "Agente",
} as Actor;
const item = {
  id: "ability",
  uuid: "Actor.source.Item.ability",
  name: "Habilidade",
} as Item;

function roll(
  id: string,
  intent: "generic" | "damage" | "healing",
): ExecutedAbilityRoll {
  return {
    id,
    sourceRollId: id,
    label: id,
    intent,
    damageType: intent === "damage" ? "energy" : null,
    formula: "2d6",
    total: 7,
    diceResults: [3, 4],
    nexThreshold: null,
  };
}

function target(index: number) {
  const targetActor = {
    id: `actor-${index}`,
    uuid: `Actor.actor-${index}`,
    name: `Target ${index}`,
  } as Actor;
  return {
    tokenId: `token-${index}`,
    actorId: targetActor.id,
    sceneId: "scene",
    name: targetActor.name,
    actor: targetActor,
  };
}

function build(rolls: ExecutedAbilityRoll[], targets = [target(1)]) {
  return buildAbilityUseCardState({
    ability: {
      actor,
      item,
      name: "Habilidade",
      image: "",
      activation: "free",
      description: "",
      chatDescription: "",
      activationLabel: "Livre",
      resource: "PE",
      cost: 0,
      passive: false,
      rollPreparation: { rolls: [], choices: [] },
      rolls: [],
    },
    descriptionHtml: "",
    rolls,
    targets,
    spentResource: false,
    resourceBefore: 0,
    resourceAfter: 0,
    now: 1,
  });
}

describe("buildAbilityUseCardState", () => {
  it("keeps generic and zero-target results informational", () => {
    expect(build([roll("generic", "generic")]).actions).toEqual([]);
    expect(build([roll("damage", "damage")], []).actions).toEqual([]);
    expect(build([roll("healing", "healing")], []).actions).toEqual([]);
  });

  it("creates one deterministic action per actionable roll and target", () => {
    const state = build(
      [roll("damage", "damage"), roll("healing", "healing"), roll("generic", "generic")],
      [target(1), target(2), target(3)],
    );

    expect(state.schemaVersion).toBe(2);
    expect(state.targets).toHaveLength(3);
    expect(state.actions).toHaveLength(6);
    expect(state.actions[0]).toMatchObject({
      id: "damage:token:scene:token-1:damage",
      kind: "damage",
      rollId: "damage",
      targetId: "token:scene:token-1",
      state: "available",
    });
  });

  it("uses stable action ids without random values", () => {
    const first = createAbilityAssistedActionId("roll", "token:scene:token", "damage");
    const second = createAbilityAssistedActionId("roll", "token:scene:token", "damage");
    expect(first).toBe("roll:token:scene:token:damage");
    expect(second).toBe(first);
    expect(createAbilityAssistedActionId("roll", "token:scene:other", "damage"))
      .not.toBe(first);
  });
});
