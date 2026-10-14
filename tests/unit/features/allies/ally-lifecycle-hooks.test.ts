import { describe, expect, it, vi } from "vitest";
import { registerAllyLifecycleHooks } from "../../../../src/features/allies/ally-lifecycle-hooks";
import { AllySupportService } from "../../../../src/features/allies/ally-support-service";
describe("ally lifecycle wiring (Foundry hooks doubled)", () => {
  function fixture() {
    const hooks = new Map<string, Function[]>();
    vi.stubGlobal("Hooks", { on: (name: string, callback: Function) => hooks.set(name, [...hooks.get(name) ?? [], callback]) });
    vi.stubGlobal("game", { user: { id: "player" }, users: [{ id: "player", isGM: false, active: true }] });
    const process = vi.spyOn(AllySupportService.prototype, "process").mockResolvedValue();
    const reconcile = vi.spyOn(AllySupportService.prototype, "reconcile").mockResolvedValue();
    registerAllyLifecycleHooks();
    return { hooks, process, reconcile };
  }
  it("uses the native update userId and strips the payload identity", async () => {
    const f = fixture();
    f.hooks.get("updateActor")![0]({ id: "iris", type: "paranormal-toolkit.ally" }, {
      flags: { "paranormal-toolkit": { allyRequest: { id: "request-01", revision: 0, action: "deactivate", userId: "forged-gm" } } },
    }, {}, "actual-player");
    expect(f.process).toHaveBeenCalledWith("iris", { id: "request-01", revision: 0, action: "deactivate" }, "actual-player");
    vi.restoreAllMocks();
  });
  it("observes post-update combat events, not the pre-update round hook, and ignores its own projections", () => {
    const f = fixture();
    expect(f.hooks.has("updateCombat")).toBe(true);
    expect(f.hooks.has("combatRound")).toBe(false);
    const previous = f.reconcile.mock.calls.length;
    f.hooks.get("createActiveEffect")![0]({}, { allyReconciliation: true }, "gm");
    expect(f.reconcile).toHaveBeenCalledTimes(previous);
    f.hooks.get("updateActiveEffect")![0]({}, {}, {}, "player");
    expect(f.reconcile).toHaveBeenCalledTimes(previous + 1);
    vi.restoreAllMocks();
  });
  it("ignores presentation-only actor updates", () => {
    const f = fixture();
    f.hooks.get("updateActor")![0]({ id: "iris", type: "paranormal-toolkit.ally" }, {
      flags: { "paranormal-toolkit": { allySupport: { status: "active", beneficiaryId: "third-party" } } },
    }, {}, "player");
    expect(f.process).not.toHaveBeenCalled();
    vi.restoreAllMocks();
  });
});
