import { beforeEach, describe, expect, it, vi } from "vitest";
import type { ResolvedAbilityRoll } from "../../../../src/features/abilities/config/ability-roll-config";

const { animate } = vi.hoisted(() => ({ animate: vi.fn() }));
vi.mock("../../../../src/features/dice/dice-animation-service", () => ({
  animateRollWithDiceSoNice: animate,
}));

import { executeAbilityRolls } from "../../../../src/features/abilities/ability-roll-executor";

const inputs: ResolvedAbilityRoll[] = [
  {
    id: "one",
    sourceRollId: "one",
    label: "Ataque",
    intent: "generic",
    damageType: null,
    formula: "1d20",
    nexThreshold: null,
  },
  {
    id: "two",
    sourceRollId: "two",
    label: "Dano",
    intent: "damage",
    damageType: "fear",
    formula: "2d6",
    nexThreshold: 40,
  },
];

describe("executeAbilityRolls", () => {
  beforeEach(() => animate.mockReset());

  it("executes sequentially, animates and serializes results", async () => {
    const order: string[] = [];
    let index = 0;

    class FakeRoll {
      total = 0;
      dice: unknown[] = [];

      constructor(
        readonly formula: string,
        readonly data: unknown,
      ) {}

      async evaluate(): Promise<this> {
        order.push(this.formula);
        this.total = ++index * 5;
        this.dice = [{ results: [{ result: index }, { result: index + 1 }] }];
        return this;
      }
    }

    vi.stubGlobal("Roll", FakeRoll);
    animate.mockResolvedValue(undefined);

    const actor = {
      getRollData: () => ({ bonus: 2 }),
    } as unknown as Actor;
    const result = await executeAbilityRolls(inputs, actor);

    expect(order).toEqual(["1d20", "2d6"]);
    expect(animate).toHaveBeenCalledTimes(2);
    expect(animate.mock.calls.map(([roll]) => roll.formula)).toEqual([
      "1d20",
      "2d6",
    ]);
    expect(result).toEqual([
      expect.objectContaining({ total: 5, diceResults: [1, 2] }),
      expect.objectContaining({
        total: 10,
        diceResults: [2, 3],
        damageType: "fear",
      }),
    ]);
  });

  it("stops after the first technical failure", async () => {
    const formulas: string[] = [];

    class FakeRoll {
      total = 1;

      constructor(readonly formula: string) {}

      async evaluate(): Promise<this> {
        formulas.push(this.formula);
        if (this.formula === "1d20") throw new Error("invalid");
        return this;
      }
    }

    vi.stubGlobal("Roll", FakeRoll);

    await expect(executeAbilityRolls(inputs, {} as Actor)).rejects.toThrow(
      "invalid",
    );
    expect(formulas).toEqual(["1d20"]);
    expect(animate).not.toHaveBeenCalled();
  });
});
