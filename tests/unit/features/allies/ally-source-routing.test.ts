import { beforeAll, beforeEach, describe, expect, it, vi } from "vitest";
import { AllyItemUseGateway } from "../../../../src/features/item-use/item-use-route";
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
  it.each([false, true])("intercepts both real integrations once before generic/automation execution (automation=%s)", async automation => {
    const submit = vi.fn(async () => {});
    const gateway = new AllyItemUseGateway(() => "managed", submit, vi.fn());
    const run = vi.spyOn(AbilityUseWorkflow.prototype, "run").mockResolvedValue({ status: "completed" });
    const engine = { runAutomation: vi.fn() };
    const generic = new AbilityUseIntegration({}, {}, {}, gateway);
    const structured = new ItemUseIntegration(engine, {}, {}, {}, {}, {}, {}, gateway);
    const input: any = { ...context(false), message: { id: "native-message" } };
    input.item.getFlag.mockReturnValue(automation ? { schemaVersion: 1, source: { type: "manual", label: "Teste", appliedAt: "now" }, definition: { version: 1, label: "Teste", steps: [] } } : undefined);
    await Promise.all([generic.handleItemUsed(input), structured.handleItemUsed(input)]);
    expect(submit).toHaveBeenCalledOnce(); expect(run).not.toHaveBeenCalled(); expect(engine.runAutomation).not.toHaveBeenCalled();
  });
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
