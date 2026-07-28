import { afterEach, beforeAll, beforeEach, describe, expect, it, vi } from "vitest";
import { ResourceEngine } from "../../../../src/core/resources/resource-engine";
import type { ResourceAdapter } from "../../../../src/core/resources/actor-resource";
import type { ItemUseContext } from "../../../../src/features/item-use/item-use-context";

let AbilityUseWorkflow: typeof import("../../../../src/features/abilities/ability-use-workflow").AbilityUseWorkflow;
let AbilityUseApplication: typeof import("../../../../src/applications/ability-use-application").AbilityUseApplication;

class MemoryResourceAdapter implements ResourceAdapter {
  updates: number[] = [];

  constructor(public value: number) {}

  getResource() {
    return { ok: true as const, value: { value: this.value, max: 20 } };
  }

  async updateResourceValue(
    _actor: Actor,
    _resource: string,
    value: number,
  ): Promise<void> {
    this.value = value;
    this.updates.push(value);
  }
}

type FixtureOptions = {
  cost?: number;
  activation?: string;
  resource?: "PE" | "PD";
  rolls?: unknown[] | null;
  chatPublishError?: Error;
};

function fixedRoll(id: string, formula: string): unknown {
  return {
    id,
    label: id,
    intent: "generic",
    damageType: null,
    formula: { mode: "fixed", formula },
  };
}

function createFixture(options: FixtureOptions = {}) {
  const adapter = new MemoryResourceAdapter(5);
  const resources = new ResourceEngine(adapter);
  const publish = options.chatPublishError
    ? vi.fn().mockRejectedValue(options.chatPublishError)
    : vi.fn().mockResolvedValue(undefined);
  const chatCards = { publish };
  const actor = {
    id: "actor",
    uuid: "Actor.actor",
    name: "Agente",
    isOwner: true,
    system: { NEX: { value: 40 } },
    getRollData: () => ({ bonus: 2 }),
  } as unknown as Actor;
  const item = {
    id: "ability",
    uuid: "Actor.actor.Item.ability",
    name: "Habilidade",
    img: "ability.webp",
    type: "ability",
    system: {
      activation: options.activation ?? "free",
      cost: options.cost ?? 2,
      description: "Descrição",
    },
    getFlag: () =>
      options.rolls === null
        ? null
        : {
            schemaVersion: 1,
            rolls: options.rolls ?? [fixedRoll("one", "1d6")],
          },
  } as unknown as Item;
  const context: ItemUseContext = {
    source: "ordem-item-used-hook",
    actor,
    item,
    token: null,
    targets: [],
  };
  const workflow = new AbilityUseWorkflow(
    resources,
    adapter,
    chatCards as never,
  );

  return { adapter, actor, chatCards, context, workflow };
}

function installSuccessfulRolls(
  onEvaluate?: (formula: string) => void,
): void {
  class FakeRoll {
    total = 6;
    dice = [{ results: [{ result: 6 }] }];

    constructor(readonly formula: string) {}

    async evaluate(): Promise<this> {
      onEvaluate?.(this.formula);
      return this;
    }
  }
  vi.stubGlobal("Roll", FakeRoll);
}

beforeAll(async () => {
  const foundryGlobal = foundry as unknown as Record<string, unknown>;
  foundryGlobal.applications = {
    api: { ApplicationV2: class {} },
    ux: {
      TextEditor: {
        implementation: { enrichHTML: async (html: string) => html },
      },
    },
  };
  (foundry.utils as Record<string, unknown>).randomID = () => "id";
  (foundry.utils as Record<string, unknown>).cleanHTML = (html: string) => html;

  ({ AbilityUseWorkflow } = await import(
    "../../../../src/features/abilities/ability-use-workflow"
  ));
  ({ AbilityUseApplication } = await import(
    "../../../../src/applications/ability-use-application"
  ));
});

beforeEach(() => {
  vi.stubGlobal("game", {
    user: { isGM: false },
    settings: {
      get: (scope: string, key: string) =>
        scope === "ordemparanormal" && key === "globalPlayingWithoutSanity"
          ? false
          : undefined,
    },
    modules: { get: () => undefined },
    i18n: { localize: (key: string) => key },
  });
  vi.stubGlobal("ui", { notifications: { warn: vi.fn() } });
  installSuccessfulRolls();
});

afterEach(() => {
  vi.restoreAllMocks();
  vi.unstubAllGlobals();
});

describe("AbilityUseWorkflow", () => {
  it("cancels without spending, rolling or publishing", async () => {
    const fixture = createFixture();
    const evaluate = vi.fn();
    installSuccessfulRolls(evaluate);
    vi.spyOn(AbilityUseApplication, "request").mockResolvedValue(null);

    await expect(fixture.workflow.run(fixture.context)).resolves.toEqual({
      status: "cancelled",
    });
    expect(fixture.adapter.updates).toEqual([]);
    expect(evaluate).not.toHaveBeenCalled();
    expect(fixture.chatCards.publish).not.toHaveBeenCalled();
  });

  it.each([
    { label: "PE", usesPd: false, expected: "PE" },
    { label: "PD", usesPd: true, expected: "PD" },
  ])("spends $label and publishes its resource snapshot", async ({ usesPd, expected }) => {
    vi.stubGlobal("game", {
      ...game,
      settings: {
        get: (scope: string, key: string) =>
          scope === "ordemparanormal" &&
          key === "globalPlayingWithoutSanity"
            ? usesPd
            : undefined,
      },
    });
    const fixture = createFixture();
    vi.spyOn(AbilityUseApplication, "request").mockResolvedValue({
      spendResource: true,
      selectedNexThresholds: {},
    });

    const result = await fixture.workflow.run(fixture.context);

    expect(result).toMatchObject({
      status: "completed",
      spentResource: true,
      resource: expected,
    });
    expect(fixture.adapter.value).toBe(3);
    expect(fixture.chatCards.publish).toHaveBeenCalledWith(
      fixture.context,
      expect.objectContaining({
        resource: expect.objectContaining({ type: expected, spent: true }),
      }),
    );
  });

  it.each([
    { label: "zero cost", cost: 0, activation: "free" },
    { label: "passive", cost: 4, activation: "passive" },
  ])("publishes a $label ability without reading or spending resource", async ({ cost, activation }) => {
    const fixture = createFixture({ cost, activation, rolls: null });
    const getResource = vi.spyOn(fixture.adapter, "getResource");
    vi.spyOn(AbilityUseApplication, "request").mockResolvedValue({
      spendResource: false,
      selectedNexThresholds: {},
    });

    const result = await fixture.workflow.run(fixture.context);

    expect(result.status).toBe("completed");
    expect(getResource).not.toHaveBeenCalled();
    expect(fixture.adapter.updates).toEqual([]);
    expect(fixture.chatCards.publish).toHaveBeenCalledOnce();
  });

  it("supports using a paid ability with spending disabled", async () => {
    const fixture = createFixture();
    vi.spyOn(AbilityUseApplication, "request").mockResolvedValue({
      spendResource: false,
      selectedNexThresholds: {},
    });

    await fixture.workflow.run(fixture.context);

    expect(fixture.adapter.value).toBe(5);
    expect(fixture.adapter.updates).toEqual([]);
    expect(fixture.chatCards.publish).toHaveBeenCalledWith(
      fixture.context,
      expect.objectContaining({
        resource: expect.objectContaining({ spent: false }),
      }),
    );
  });

  it("rejects insufficient resource before rolling or publishing", async () => {
    const fixture = createFixture({ cost: 8 });
    const evaluate = vi.fn();
    installSuccessfulRolls(evaluate);
    vi.spyOn(AbilityUseApplication, "request").mockResolvedValue({
      spendResource: true,
      selectedNexThresholds: {},
    });

    const result = await fixture.workflow.run(fixture.context);

    expect(result).toMatchObject({
      status: "failed",
      reason: "insufficient-resource",
    });
    expect(evaluate).not.toHaveBeenCalled();
    expect(fixture.chatCards.publish).not.toHaveBeenCalled();
  });

  it("rolls only the choose-unlocked threshold returned by the popup", async () => {
    const chooseRoll = {
      id: "progressive",
      label: "Progressão",
      intent: "generic",
      damageType: null,
      formula: {
        mode: "nex",
        resolution: "choose-unlocked",
        steps: [
          { minNex: 10, formula: "1d6" },
          { minNex: 40, formula: "2d6" },
          { minNex: 65, formula: "3d6" },
        ],
      },
    };
    const fixture = createFixture({ rolls: [chooseRoll] });
    const formulas: string[] = [];
    installSuccessfulRolls((formula) => formulas.push(formula));
    const request = vi
      .spyOn(AbilityUseApplication, "request")
      .mockResolvedValue({
        spendResource: false,
        selectedNexThresholds: { progressive: 10 },
      });

    await fixture.workflow.run(fixture.context);

    expect(request).toHaveBeenCalledWith(
      expect.objectContaining({
        rollChoices: [
          expect.objectContaining({
            sourceRollId: "progressive",
            selectedNexThreshold: 40,
            options: [
              expect.objectContaining({ nexThreshold: 10 }),
              expect.objectContaining({ nexThreshold: 40 }),
            ],
          }),
        ],
      }),
    );
    expect(formulas).toEqual(["1d6"]);
  });

  it("rolls in order and stops when a later roll fails", async () => {
    const fixture = createFixture({
      rolls: [
        fixedRoll("one", "1d6"),
        fixedRoll("two", "invalid"),
        fixedRoll("three", "3d6"),
      ],
    });
    const formulas: string[] = [];
    class FailingRoll {
      total = 1;
      dice: unknown[] = [];
      constructor(readonly formula: string) {}
      async evaluate(): Promise<this> {
        formulas.push(this.formula);
        if (this.formula === "invalid") throw new Error("invalid formula");
        return this;
      }
    }
    vi.stubGlobal("Roll", FailingRoll);
    vi.spyOn(AbilityUseApplication, "request").mockResolvedValue({
      spendResource: true,
      selectedNexThresholds: {},
    });

    const result = await fixture.workflow.run(fixture.context);

    expect(result).toMatchObject({ status: "failed", reason: "roll-failed" });
    expect(formulas).toEqual(["1d6", "invalid"]);
    expect(fixture.adapter.updates).toEqual([3, 5]);
    expect(fixture.chatCards.publish).not.toHaveBeenCalled();
  });

  it("rolls nothing after a first-roll failure and restores resource", async () => {
    const fixture = createFixture({
      rolls: [fixedRoll("one", "invalid"), fixedRoll("two", "2d6")],
    });
    const formulas: string[] = [];
    class FailingRoll {
      total = 1;
      dice: unknown[] = [];
      constructor(readonly formula: string) {}
      async evaluate(): Promise<this> {
        formulas.push(this.formula);
        throw new Error("invalid formula");
      }
    }
    vi.stubGlobal("Roll", FailingRoll);
    vi.spyOn(AbilityUseApplication, "request").mockResolvedValue({
      spendResource: true,
      selectedNexThresholds: {},
    });

    await fixture.workflow.run(fixture.context);

    expect(formulas).toEqual(["invalid"]);
    expect(fixture.adapter.value).toBe(5);
  });

  it("does not overwrite a concurrent resource change during rollback", async () => {
    const fixture = createFixture();
    class ConcurrentFailureRoll {
      total = 1;
      dice: unknown[] = [];
      async evaluate(): Promise<this> {
        fixture.adapter.value = 2;
        throw new Error("invalid formula");
      }
    }
    vi.stubGlobal("Roll", ConcurrentFailureRoll);
    vi.spyOn(AbilityUseApplication, "request").mockResolvedValue({
      spendResource: true,
      selectedNexThresholds: {},
    });

    const result = await fixture.workflow.run(fixture.context);

    expect(result).toMatchObject({ status: "failed", reason: "roll-failed" });
    expect(fixture.adapter.value).toBe(2);
    expect(fixture.adapter.updates).toEqual([3]);
  });

  it("restores resource when publication fails", async () => {
    const fixture = createFixture({ chatPublishError: new Error("chat") });
    vi.spyOn(AbilityUseApplication, "request").mockResolvedValue({
      spendResource: true,
      selectedNexThresholds: {},
    });

    const result = await fixture.workflow.run(fixture.context);

    expect(result).toMatchObject({
      status: "failed",
      reason: "chat-message-failed",
    });
    expect(fixture.adapter.updates).toEqual([3, 5]);
  });
});
