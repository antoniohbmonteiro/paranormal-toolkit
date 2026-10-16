import { describe, expect, it, vi } from "vitest";
import { grantWorld, scope } from "../../../helpers/ally-grant-world";
import { AllyGrantedAbilityShortcut } from "../../../../src/features/allies/ally-granted-ability-shortcut";
import { FoundryAllyAbilityRequests } from "../../../../src/adapters/foundry/foundry-ally-ability-request-adapter";
import { findAllyShortcutGrant } from "../../../../src/adapters/foundry/foundry-ally-item-adapter";
import { AllyItemUseGateway } from "../../../../src/features/item-use/item-use-route";

async function ready(pilot = false, automation = false) {
  const f = await grantWorld();
  if (pilot) {
    f.settings["allies.dronePilotAbilities"] = true; await f.iris.update({ "system.isDrone": true });
    await f.support.process("iris", { id: "pilot-request-01", revision: f.ledger().revision, action: "setPilot", pilotId: "rafa" }, "ally-player");
    await f.rafa.update({ "system.NEX.value": 75 });
  }
  const source = f.addAbility({ flags: { [scope]: automation ? {
    automation: { schemaVersion: 1, source: { type: "manual", label: "Teste", appliedAt: "now" }, definition: { version: 1, label: "Teste", steps: [
      { type: "spendResource", actor: "self", resource: "PE", amount: 1 }, { type: "rollFormula", id: "r", formula: "1d6+@NEX.value" },
    ] } },
  } : { abilityRollConfig: { schemaVersion: 1, rolls: [{ id: "r", label: "Teste", intent: "generic", damageType: null, formula: { mode: "fixed", formula: "1d6+@NEX.value" } }] } } } });
  source.roll = vi.fn(); await f.support.reconcile();
  const grant = f.ledger().managedGrants[0], recipient = pilot ? f.rafa : f.mauro, projected = recipient.items.get(grant.itemId);
  const view: any = { status: "active", beneficiaryId: "mauro", abilityRecipientId: recipient.id, revision: f.ledger().revision, diagnostic: null };
  await f.iris.setFlag(scope, "allySupport", view);
  const requests = new FoundryAllyAbilityRequests(), shortcut = new AllyGrantedAbilityShortcut(requests.gateway);
  game.user = f.player;
  return { ...f, source, grant, recipient, projected, view, requests, shortcut };
}
describe("source sheet shortcut through native granted Item use", () => {
  it("resolves source identity from the protected index even with the grant flag removed", async () => {
    const f = await ready(); await f.projected.setFlag(scope, "allyGrantedAbility", undefined);
    expect(findAllyShortcutGrant("iris", f.source.id)).toEqual({ actor: f.mauro, item: f.projected });
    expect(f.shortcut.inspect("iris", f.source, f.view)).toEqual({ enabled: true, reason: null });
    const original = f.source.roll; expect(original).not.toHaveBeenCalled();
  });
  it("refuses an old index without origins, a forged flag and divergent GM indices", async () => {
    const f = await ready();
    const index: any = structuredClone(f.gm.getFlag(scope, "allyGrantRouteIndex"));
    delete index.entries[0].allyId; delete index.entries[0].sourceItemId; await f.gm.setFlag(scope, "allyGrantRouteIndex", index);
    expect(f.shortcut.inspect("iris", f.source, f.view).enabled).toBe(false);
    await f.projected.setFlag(scope, "allyGrantedAbility", { allyId: "iris", sourceItemId: f.source.id });
    expect(f.shortcut.inspect("iris", f.source, f.view).enabled).toBe(false);
    game.user = f.gm; await f.support.reconcile(); game.user = f.player;
    const other: any = { ...f.gm, id: "gm2", getFlag: (s: string, key: string) => key === "allyGrantRouteIndex"
      ? { ...f.gm.getFlag(s, key), entries: [{ ...f.gm.getFlag(s, key).entries[0], itemId: "different" }] } : f.gm.getFlag(s, key) };
    game.users.push(other); expect(f.shortcut.inspect("iris", f.source, f.view).enabled).toBe(false);
  });
  it("does not authorize the Ally owner, pending support, a stale destination or no connected GM", async () => {
    const f = await ready(); game.user = f.allyPlayer;
    expect(f.shortcut.inspect("iris", f.source, f.view).reason).toContain("permissão"); game.user = f.player;
    expect(f.shortcut.inspect("iris", f.source, { ...f.view, status: "pending" }).enabled).toBe(false);
    expect(f.shortcut.inspect("iris", f.source, { ...f.view, abilityRecipientId: "rafa" }).enabled).toBe(false);
    f.gm.active = false; expect(f.shortcut.inspect("iris", f.source, f.view).reason).toContain("GM executor");
    expect(f.source.roll).not.toHaveBeenCalled();
  });
  it.each([[false, false, true], [true, true, true], [true, false, false]])
    ("opens one player dialog and uses the current recipient through both listeners (pilot=%s PD=%s confirm=%s)", async (pilot, pd, confirm) => {
      const f = await ready(pilot); f.settings.globalPlayingWithoutSanity = pd;
      const { AbilityUseApplication } = await import("../../../../src/applications/ability-use-application");
      const { AbilityUseIntegration } = await import("../../../../src/features/abilities/ability-use-integration");
      const { ItemUseIntegration } = await import("../../../../src/features/item-use/item-use-integration");
      let answer!: (value: any) => void;
      const dialog = vi.spyOn(AbilityUseApplication, "request").mockImplementation(async model => {
        expect(game.user!.id).toBe("player"); expect(model.actorName).toBe(f.recipient.id);
        expect(f.recipient.system[pd ? "PD" : "PE"].value).toBe(20); expect(f.rolls).toHaveLength(0);
        return new Promise(resolve => { answer = resolve; });
      });
      const send = vi.spyOn(f.requests, "send").mockImplementation(async (actorId, request) => {
        const user = game.user!; game.user = f.gm;
        try { return await f.use.handle(actorId, { ...request, id: `native-${request.action}` }, user.id) as any; }
        finally { game.user = user; }
      });
      const generic = new AbilityUseIntegration({} as any, {} as any, {} as any, f.requests.gateway);
      const structured = new ItemUseIntegration({} as any, {} as any, {} as any, {} as any, {} as any, {} as any, {} as any, f.requests.gateway);
      f.projected.roll = vi.fn(async () => {
        const context: any = { actor: f.recipient, item: f.projected, targets: [], message: f.message(foundry.utils.randomID(), f.player) };
        void generic.handleItemUsed(context); void structured.handleItemUsed(context);
      });
      const use = f.shortcut.use(f.iris, f.source.id);
      await vi.waitFor(() => expect(dialog).toHaveBeenCalledOnce());
      expect(f.requests.gateway.isNativeUsePending(f.recipient.id, f.projected.id)).toBe(true);
      expect(f.shortcut.inspect("iris", f.source, f.view)).toEqual({ enabled: false, reason: "Uso em andamento." });
      const second = f.shortcut.use(f.iris, f.source.id);
      answer(confirm ? { spendResource: true, selectedNexThresholds: {} } : null);
      await Promise.all([use, second]);
      expect(f.projected.roll).toHaveBeenCalledOnce(); expect(f.source.roll).not.toHaveBeenCalled(); expect(send).toHaveBeenCalledTimes(2);
      expect(f.rolls).toHaveLength(confirm ? 1 : 0); expect(f.recipient.system[pd ? "PD" : "PE"].value).toBe(confirm ? 18 : 20);
      if (pilot) expect(f.mauro.system.PE.value).toBe(20);
      if (confirm) expect(f.rolls[0].data.NEX.value).toBe(pilot ? 75 : 50);
    });
  it("reuses automation exclusively without charging the generic Item cost", async () => {
    const f = await ready(true, true); await f.source.update({ "system.cost": 19 });
    game.user = f.gm; await f.support.reconcile(); game.user = f.player;
    vi.spyOn(f.requests, "send").mockImplementation(async (actorId, request) => {
      const user = game.user!; game.user = f.gm;
      try { return await f.use.handle(actorId, { ...request, id: `native-${request.action}` }, user.id) as any; }
      finally { game.user = user; }
    });
    f.projected.roll = vi.fn(async () => {
      void f.requests.gateway.intercept({ actor: f.recipient, item: f.projected, targets: [], message: f.message("native-automation", f.player) } as any);
    });
    await f.shortcut.use(f.iris, f.source.id);
    expect(f.rafa.system.PE.value).toBe(19); expect(f.mauro.system.PE.value).toBe(20); expect(f.rolls).toHaveLength(1);
    expect(f.source.roll).not.toHaveBeenCalled();
  });
  it("releases a native invocation error without submitting a managed execution", async () => {
    const f = await ready(); const send = vi.spyOn(f.requests, "send");
    f.projected.roll = vi.fn(async () => { throw new Error("native failed"); });
    await expect(f.shortcut.use(f.iris, f.source.id)).rejects.toThrow("native failed");
    expect(send).not.toHaveBeenCalled(); expect(f.requests.gateway.isNativeUsePending("mauro", f.projected.id)).toBe(false);
  });
  it("consumes both listeners when the grant is deleted and its marker removed before the native hook", async () => {
    const f = await ready(); const send = vi.spyOn(f.requests, "send");
    const { AbilityUseIntegration } = await import("../../../../src/features/abilities/ability-use-integration");
    const { ItemUseIntegration } = await import("../../../../src/features/item-use/item-use-integration");
    const generic = new AbilityUseIntegration({} as any, {} as any, {} as any, f.requests.gateway);
    const structured = new ItemUseIntegration({} as any, {} as any, {} as any, {} as any, {} as any, {} as any, {} as any, f.requests.gateway);
    f.projected.roll = vi.fn(async () => {
      await f.projected.setFlag(scope, "allyGrantedAbility", undefined);
      const user = game.user; game.user = f.gm;
      await f.support.process("iris", { id: "clear-before-hook", revision: f.ledger().revision, action: "setBeneficiary", beneficiaryId: null }, "ally-player");
      game.user = user;
      const context: any = { actor: f.recipient, item: f.projected, targets: [], message: f.message("native-late-hook", f.player) };
      await Promise.all([generic.handleItemUsed(context), structured.handleItemUsed(context)]);
    });
    await expect(f.shortcut.use(f.iris, f.source.id)).rejects.toThrow("concessão mudou");
    expect(send).not.toHaveBeenCalled(); expect(f.rolls).toHaveLength(0); expect(f.mauro.system.PE.value).toBe(20);
  });
  it("consumes an already claimed message even if its index is retired before the next listener", async () => {
    const classify = vi.fn(() => "managed" as "managed" | "ordinary"), submit = vi.fn(async () => {});
    const gateway = new AllyItemUseGateway(classify, submit, vi.fn());
    const context: any = { actor: { id: "actor" }, item: { id: "grant" }, message: { id: "native-once" } };
    expect(await gateway.intercept(context)).toBe(true); classify.mockReturnValue("ordinary");
    expect(await gateway.intercept(context)).toBe(true); expect(submit).toHaveBeenCalledOnce();
  });
  it("keeps a native-use lock until the intercepted workflow settles, even beyond the hook timeout", async () => {
    vi.useFakeTimers(); let finish!: () => void;
    const submit = vi.fn(() => new Promise<void>(resolve => { finish = resolve; }));
    const gateway = new AllyItemUseGateway(() => "managed", submit, vi.fn());
    const invoke = vi.fn(async () => { void gateway.intercept({ actor: { id: "a" }, item: { id: "i" }, message: { id: "m" } } as any); });
    try {
      const pending = gateway.useNative("a", "i", invoke); await vi.advanceTimersByTimeAsync(180_000);
      expect(gateway.isNativeUsePending("a", "i")).toBe(true); finish(); await pending;
      expect(gateway.isNativeUsePending("a", "i")).toBe(false);
    } finally { vi.useRealTimers(); }
  });
  it("consumes a late hook after native invocation times out, without starting either execution path", async () => {
    vi.useFakeTimers(); let finish!: () => void;
    const submit = vi.fn(async () => {}), gateway = new AllyItemUseGateway(() => "ordinary", submit, vi.fn());
    const context: any = { actor: { id: "a" }, item: { id: "i" }, message: { id: "late-native" } };
    try {
      const pending = gateway.useNative("a", "i", async () => {
        await new Promise<void>(resolve => { finish = resolve; });
        expect(await gateway.intercept(context)).toBe(true); expect(await gateway.intercept(context)).toBe(true);
      }).catch(error => error);
      await vi.advanceTimersByTimeAsync(120_001); expect((await pending).message).toContain("não foi confirmado");
      expect(gateway.isNativeUsePending("a", "i")).toBe(true);
      finish(); await vi.advanceTimersByTimeAsync(0);
      expect(submit).not.toHaveBeenCalled(); expect(gateway.isNativeUsePending("a", "i")).toBe(false);
    } finally { vi.useRealTimers(); }
  });
});
