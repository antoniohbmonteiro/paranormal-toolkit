import { beforeAll, beforeEach, describe, expect, it, vi } from "vitest";
let AbilityUseIntegration: any, AbilityUseWorkflow: any, ItemUseIntegration: any;
beforeAll(async () => {
  vi.stubGlobal("foundry", { ...(globalThis as any).foundry,
    applications: { api: { ApplicationV2: class {} } } });
  ({ AbilityUseIntegration } = await import("../../../../src/features/abilities/ability-use-integration"));
  ({ AbilityUseWorkflow } = await import("../../../../src/features/abilities/ability-use-workflow"));
  ({ ItemUseIntegration } = await import("../../../../src/features/item-use/item-use-integration"));
});
beforeEach(() => {
  vi.stubGlobal("game", { settings: { get: () => undefined } });
});
function context(ally = true) {
  const actor = { id: "actor", uuid: "Actor.actor", name: "Actor", type: ally ? "paranormal-toolkit.ally" : "agent" };
  const item = { id: "item", uuid: "Actor.actor.Item.item", name: "Item", type: "ability", parent: actor, getFlag: vi.fn() };
  return { actor, item, targets: [], source: "ordem-item-used-hook" };
}
describe("Ally source routing (workflow dependencies doubled)", () => {
  it("never starts a generic ability workflow from an Ally source", async () => {
    const run = vi.spyOn(AbilityUseWorkflow.prototype, "run").mockResolvedValue({ status: "completed" });
    const integration = new AbilityUseIntegration({}, {}, {});
    await integration.handleItemUsed(context());
    expect(run).not.toHaveBeenCalled();
  });
  it("rejects Ally sources before inspecting an automation flag or charging resources", async () => {
    const execute = vi.fn(), spend = vi.fn();
    const integration = new ItemUseIntegration({ execute }, { spend }, {}, {}, {}, {}, {});
    const input = context();
    input.item.getFlag.mockImplementation(() => { throw new Error("Must not inspect source automation"); });
    await integration.handleItemUsed(input);
    expect(execute).not.toHaveBeenCalled();
    expect(spend).not.toHaveBeenCalled();
    expect(input.item.getFlag).not.toHaveBeenCalled();
  });
  it("keeps ordinary Agent abilities on their existing workflow", async () => {
    const run = vi.spyOn(AbilityUseWorkflow.prototype, "run").mockResolvedValue({ status: "completed" });
    const integration = new AbilityUseIntegration({}, {}, {});
    await integration.handleItemUsed(context(false));
    expect(run).toHaveBeenCalledTimes(1);
  });
});
