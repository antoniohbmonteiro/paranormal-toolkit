import { describe, expect, it } from "vitest";
import {
  getAbilityDamageTypeLabel,
  normalizeAbilityRollConfig,
  resolveAbilityRollActions,
  resolveActorNex,
  type AbilityRollConfig,
} from "../../../../src/features/abilities/config/ability-roll-config";

function createConfig(): AbilityRollConfig {
  return {
    schemaVersion: 1,
    rolls: [
      {
        id: "damage",
        label: "Dano adicional",
        intent: "damage",
        damageType: "impact",
        formula: {
          mode: "nex",
          resolution: "highest-unlocked",
          steps: [
            { minNex: 10, formula: "1d6" },
            { minNex: 40, formula: "2d6" },
            { minNex: 65, formula: "3d6" },
            { minNex: 99, formula: "4d6" },
          ],
        },
      },
      {
        id: "fixed",
        label: "Coisa 2",
        intent: "generic",
        damageType: null,
        formula: { mode: "fixed", formula: "2d6" },
      },
    ],
  };
}

describe("ability roll configuration", () => {
  it("supports fixed and NEX-scaled rolls in the same ability", () => {
    const rolls = resolveAbilityRollActions(createConfig(), 65);

    expect(rolls).toEqual([
      expect.objectContaining({
        id: "damage",
        label: "Dano adicional",
        formula: "3d6",
        nexThreshold: 65,
        damageType: "impact",
      }),
      expect.objectContaining({
        id: "fixed",
        label: "Coisa 2",
        formula: "2d6",
        nexThreshold: null,
      }),
    ]);
  });

  it("can expose every unlocked NEX option when the player must choose", () => {
    const config = createConfig();
    const firstRoll = config.rolls[0];
    if (firstRoll.formula.mode !== "nex") throw new Error("Invalid fixture");
    firstRoll.formula.resolution = "choose-unlocked";

    expect(resolveAbilityRollActions(config, 40).map((roll) => roll.formula)).toEqual([
      "1d6",
      "2d6",
      "2d6",
    ]);
  });

  it("does not expose an NEX roll before its first threshold", () => {
    const config = createConfig();
    config.rolls = [config.rolls[0]];

    expect(resolveAbilityRollActions(config, 5)).toEqual([]);
  });

  it("normalizes, sorts and deduplicates NEX steps", () => {
    const config = normalizeAbilityRollConfig({
      schemaVersion: 999,
      rolls: [
        {
          id: "same id",
          label: "Dano",
          intent: "damage",
          damageType: "knowledge",
          formula: {
            mode: "nex",
            resolution: "highest-unlocked",
            steps: [
              { minNex: 65, formula: "3d6" },
              { minNex: 10, formula: "1d6" },
              { minNex: 10, formula: "2d6" },
            ],
          },
        },
      ],
    });

    expect(config).toEqual({
      schemaVersion: 1,
      rolls: [
        expect.objectContaining({
          id: "same-id",
          formula: {
            mode: "nex",
            resolution: "highest-unlocked",
            steps: [
              { minNex: 10, formula: "2d6" },
              { minNex: 65, formula: "3d6" },
            ],
          },
        }),
      ],
    });
  });

  it("reads NEX from the current Ordem actor path", () => {
    const actor = { system: { NEX: { value: 42 } } } as unknown as Actor;
    expect(resolveActorNex(actor)).toBe(42);
  });

  it("shows localized damage type labels", () => {
    expect(getAbilityDamageTypeLabel("knowledge")).toBe("Conhecimento");
    expect(getAbilityDamageTypeLabel("custom-type")).toBe("custom-type");
  });
});
