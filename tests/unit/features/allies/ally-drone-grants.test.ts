import { describe, expect, it, vi } from "vitest";
import { grantWorld, scope } from "../../../helpers/ally-grant-world";
import { buildDefenseTemplate } from "../../../../src/adapters/ordem/ordem-ally-effect-presets";
import { ALLY_PILOT_ABILITIES_SETTING as setting } from "../../../../src/features/allies/ally-settings";
import { FoundryAllyAbilityRequests, classifyAllyUse } from "../../../../src/adapters/foundry/foundry-ally-ability-request-adapter";
import { readAllyLedger } from "../../../../src/adapters/foundry/foundry-ally-store";

const rolls = (intent = "damage") => ({ schemaVersion: 1, rolls: [{ id: "r", label: "Resultado", intent,
  damageType: intent === "damage" ? "impact" : null, formula: { mode: "fixed", formula: "1d6+@NEX.value" } }] });
async function ready({ enabled = true, drone = true, pilot = "rafa", automation = false, intent = "damage" }:
  { enabled?: boolean; drone?: boolean; pilot?: string | null; automation?: boolean; intent?: string } = {}) {
  const f = await grantWorld(); f.settings[setting] = enabled;
  await f.iris.update({ "system.isDrone": drone });
  await f.rafa.update({ "system.NEX.value": 75 });
  f.rafa.canUserModify = (user: any) => user.isGM || user.id === f.pilotPlayer.id;
  const source = f.addAbility({ name: "Drone", flags: { [scope]: { abilityRollConfig: rolls(intent), ...(automation ? {
    automation: { schemaVersion: 1, source: { type: "manual", label: "Drone", appliedAt: "now" }, definition: { version: 1, label: "Drone",
      steps: [{ type: "spendResource", actor: "self", resource: "PE", amount: 1 }, { type: "rollFormula", id: "r", formula: "1d6+@NEX.value" }] } },
  } : {}) } }, effects: [{ ...buildDefenseTemplate("Defesa", 5), _id: "defense", transfer: false, disabled: false,
    flags: { [scope]: { allyPassive: { version: 1 } } } }] });
  let sequence = 0;
  const change = (action: any, fields: Record<string, unknown> = {}, userId = "ally-player") => f.support.process("iris", {
    id: `request-${++sequence}`, action, revision: f.ledger().revision, ...fields,
  }, userId);
  await change("setPilot", { pilotId: pilot });
  return { ...f, source, change, currentGrant: () => f.ledger().managedGrants.find(grant => grant.allyId === "iris") };
}
async function prepare(f: Awaited<ReturnType<typeof ready>>, actorId = "rafa", requesterId = "pilot-player") {
  const actor = game.actors.get!(actorId)!;
  const grant = f.currentGrant()!;
  const user = game.users.find(user => user.id === requesterId)!;
  const message = f.message(foundry.utils.randomID(), user);
  const response: any = await f.use.handle(actorId, { id: "prepare-001", action: "prepare", itemId: grant.itemId, messageId: message.id }, requesterId);
  return { actor, grant, message, response, request: { id: "execute-001", action: "execute" as const, messageId: message.id, sequence: response.sequence,
    options: { spendResource: true, selectedNexThresholds: {} } } };
}

describe("drone grants with a pilot distinct from the passive beneficiary", () => {
  it.each([
    [false, false, "rafa", "mauro"], [false, true, "rafa", "mauro"], [true, false, "rafa", "mauro"],
    [true, true, "rafa", "rafa"], [true, true, "mauro", "mauro"], [true, true, null, null],
  ])("keeps passives on Mauro for enabled=%s drone=%s pilot=%s", async (enabled, drone, pilot, destination) => {
    const f = await ready({ enabled, drone, pilot });
    expect([...f.effects.values()].map(effect => effect.actorId)).toEqual(["mauro"]);
    expect(f.ledger().diagnostic).toBeNull();
    expect(f.currentGrant()?.actorId ?? null).toBe(destination);
    expect(f.mauro.items.contents.length + f.rafa.items.contents.length).toBe(destination ? 1 : 0);
    if (destination) expect(game.actors.get!(destination)!.items.contents[0].effects.contents).toHaveLength(0);
    else expect(f.ledger().links[0].diagnostic).toContain("Selecione um piloto");
  });
  it("does not let a missing pilot block another Ally or apply fallback grants", async () => {
    const f = await ready({ pilot: null });
    const guardian = f.makeActor("guardian", `${scope}.ally`);
    await guardian.createEmbeddedDocuments("Item", [{ _id: "ordinary-source", name: "Guardião", type: "ability" }]);
    const ledger = f.ledger(); ledger.links.push({ allyId: "guardian", state: { beneficiaryId: "mauro", status: "active", sequence: ledger.nextSequence++, wait: null },
      suppressedSources: [], suppressedGrants: [], notice: null, diagnostic: null }); f.setLedger(ledger);
    await f.support.reconcile();
    expect(f.ledger().managedGrants.map(grant => grant.allyId)).toEqual(["guardian"]);
    expect(f.ledger().diagnostic).toBeNull(); expect(f.effects.size).toBe(1);
  });
  it("removes grants on pilot clearing without interrupting passives and restores them on configuration", async () => {
    const f = await ready(); const before = f.ledger().links[0].state; const effects = [...f.effects.values()];
    await f.change("setPilot", { pilotId: null });
    expect(f.currentGrant()).toBeUndefined(); expect(f.rafa.items.contents).toHaveLength(0);
    expect(f.mauro.items.contents).toHaveLength(0); expect([...f.effects.values()]).toEqual(effects);
    expect(f.ledger().links[0]).toMatchObject({ pilotId: null, state: before });
    expect(f.ledger().links[0].diagnostic).toContain("Selecione um piloto");
    await f.change("setPilot", { pilotId: "rafa" });
    expect(f.currentGrant()?.actorId).toBe("rafa"); expect(f.ledger().links[0].diagnostic).toBeNull();
  });
  it("moves grants on live setting and drone changes while keeping the passive projection stable", async () => {
    const f = await ready(); const passive = [...f.effects.values()][0]; const state = f.ledger().links[0].state;
    for (const [enabled, drone, target] of [[false, true, "mauro"], [true, true, "rafa"], [true, false, "mauro"], [true, true, "rafa"]] as const) {
      f.settings[setting] = enabled; await f.iris.update({ "system.isDrone": drone }); await f.support.reconcile();
      expect(f.currentGrant()?.actorId).toBe(target);
      expect(f.mauro.items.contents.length + f.rafa.items.contents.length).toBe(1);
      expect([...f.effects.values()]).toEqual([passive]); expect(f.ledger().links[0].state).toEqual(state);
      expect(f.ledger().links[0].pilotId).toBe("rafa");
    }
    expect(f.effectAdapter.update).not.toHaveBeenCalled();
  });
  it("rejects synthetic or non-agent pilots without changing the stored recipient", async () => {
    const f = await ready(); const grant = f.currentGrant()!;
    const token = f.makeActor("token"); token.isToken = true;
    const threat = f.makeActor("threat", "threat");
    for (const pilotId of [token.id, threat.id, "Actor.rafa", "missing"]) {
      await expect(f.change("setPilot", { pilotId })).rejects.toThrow("Agente persistente");
      expect(f.currentGrant()).toEqual(grant); expect(f.ledger().links[0].pilotId).toBe("rafa");
    }
  });
  it("switches pilot immediately in combat without changing passive order, support state or external Items", async () => {
    const f = await ready(); const before = f.ledger(), passive = [...f.effects.values()][0];
    f.environment.resolveCombat = () => ({ id: "combat", started: true, round: 4 });
    await f.mauro.createEmbeddedDocuments("Item", [{ _id: "external", name: f.source.name, type: "ability" }]);
    const noticeCount = f.environment.notify.mock.calls.length;
    await f.change("setPilot", { pilotId: "mauro" });
    expect(f.rafa.items.contents).toHaveLength(0); expect(f.mauro.items.contents).toHaveLength(2);
    expect(f.currentGrant()?.actorId).toBe("mauro"); expect(f.mauro.items.get("external")).toBeDefined();
    expect(f.ledger().links[0].state).toEqual(before.links[0].state); expect(f.ledger().nextSequence).toBe(before.nextSequence);
    expect([...f.effects.values()]).toEqual([passive]); expect(f.effectAdapter.update).not.toHaveBeenCalled();
    expect(f.environment.notify).toHaveBeenCalledTimes(noticeCount);
    expect(f.rafa.deleteEmbeddedDocuments.mock.invocationCallOrder.at(-1)).toBeLessThan(f.mauro.createEmbeddedDocuments.mock.invocationCallOrder.at(-1)!);
  });
  it("retains IDs when policy changes but the destination remains the same, with no repeated writes", async () => {
    const f = await ready({ pilot: "mauro" }); const grant = f.currentGrant()!, item = f.mauro.items.get(grant.itemId);
    const saved = f.store.save.mock.calls.length;
    for (const enabled of [false, true, false, true]) { f.settings[setting] = enabled; await f.support.reconcile(); }
    await f.change("setPilot", { pilotId: "mauro" });
    for (let i = 0; i < 5; i++) await f.support.reconcile();
    expect(f.currentGrant()).toEqual(grant); expect(item.update).not.toHaveBeenCalled(); expect(f.store.save).toHaveBeenCalledTimes(saved);
    expect(f.mauro.createEmbeddedDocuments).toHaveBeenCalledTimes(1);
  });
  it("keeps GM grant suppression through pilot, setting and drone changes, until real reactivation", async () => {
    const f = await ready(); const grant = f.currentGrant()!;
    await f.rafa.deleteEmbeddedDocuments("Item", [grant.itemId]); await f.support.suppressGrant("rafa", grant.itemId, "gm");
    await f.change("setPilot", { pilotId: "mauro" });
    for (const enabled of [false, true]) { f.settings[setting] = enabled; await f.support.reconcile(); }
    for (const drone of [false, true]) { await f.iris.update({ "system.isDrone": drone }); await f.support.reconcile(); }
    expect(f.ledger().managedGrants).toHaveLength(0); expect(f.ledger().links[0].suppressedGrants).toHaveLength(1);
    expect(f.effects.size).toBe(1);
    await f.change("deactivate"); await f.change("activate");
    expect(f.currentGrant()?.actorId).toBe("mauro"); expect(f.ledger().links[0].suppressedGrants).toEqual([]);
  });
  it("preserves a pending beneficiary transition while changing pilots and grants at the existing next round", async () => {
    const f = await ready(); const marco = f.makeActor("marco", "agent"); let round = 2;
    f.environment.resolveCombat = () => ({ id: "combat", started: true, round });
    f.environment.combat = () => ({ id: "combat", started: true, round });
    await f.change("assign", { beneficiaryId: marco.id });
    expect(f.effects.size).toBe(0); expect(f.rafa.items.contents).toHaveLength(0);
    const waiting = f.ledger().links[0].state;
    await f.change("setPilot", { pilotId: "mauro" });
    expect(f.ledger().links[0].state).toEqual(waiting); expect(f.ledger().managedGrants).toHaveLength(0);
    round = 3; await f.support.reconcile();
    expect([...f.effects.values()][0].actorId).toBe(marco.id); expect(f.currentGrant()?.actorId).toBe("mauro");
  });
  it("keeps a pilot grant stable on a beneficiary switch outside combat and preserves pilot while inactive", async () => {
    const f = await ready(); const grant = f.currentGrant()!;
    await f.change("assign", { beneficiaryId: "rafa" });
    expect(f.currentGrant()?.itemId).toBe(grant.itemId); expect([...f.effects.values()][0].actorId).toBe("rafa");
    await f.change("deactivate"); expect(f.rafa.items.contents).toHaveLength(0); expect(f.effects.size).toBe(0);
    await f.change("setPilot", { pilotId: "mauro" });
    expect(f.ledger().links[0].state.status).toBe("inactive"); expect(f.currentGrant()).toBeUndefined();
    await f.change("activate"); expect(f.currentGrant()?.actorId).toBe("mauro");
  });
  it.each(["deleted", "type"])("withdraws a %s pilot without removing the beneficiary's passives", async how => {
    const f = await ready();
    if (how === "deleted") game.actors.contents!.splice(game.actors.contents!.indexOf(f.rafa), 1);
    else f.rafa.type = "threat";
    await f.support.reconcile();
    expect(f.currentGrant()).toBeUndefined(); expect(f.ledger().links[0].pilotId).toBe("rafa");
    expect(f.ledger().links[0].diagnostic).toContain("Piloto ausente"); expect(f.ledger().diagnostic).toBeNull();
    expect([...f.effects.values()][0].actorId).toBe("mauro"); expect(f.mauro.items.contents).toHaveLength(0);
  });
  it("blocks a replacement grant when removal fails and refuses stale use before reconciliation succeeds", async () => {
    const f = await ready(); const old = f.currentGrant()!;
    f.rafa.deleteEmbeddedDocuments.mockRejectedValueOnce(new Error("removal failed"));
    await f.change("setPilot", { pilotId: "mauro" });
    expect(f.mauro.items.contents).toHaveLength(0); expect(f.rafa.items.get(old.itemId)).toBeDefined();
    expect(f.ledger().diagnostic).toContain("removal failed");
    await expect(prepare(f)).rejects.toThrow("suporte ativo válido");
    expect(f.rafa.system.PE.value).toBe(20); expect(f.rolls).toHaveLength(0);
    await f.support.reconcile(); expect(f.rafa.items.contents).toHaveLength(0); expect(f.currentGrant()?.actorId).toBe("mauro");
  });
  it("synchronizes all source abilities and removes their projections without touching homonymous Items", async () => {
    const f = await ready(); f.addAbility({ name: "Drone", system: { activation: "passive", cost: 0 } }); await f.support.reconcile();
    const grant = f.currentGrant()!; const item = f.rafa.items.get(grant.itemId);
    await f.source.update({ name: "Drone atualizado", "system.cost": 3 }); await f.support.reconcile();
    expect(item.name).toBe("Drone atualizado"); expect(item.id).toBe(grant.itemId);
    await f.iris.deleteEmbeddedDocuments("Item", [f.source.id]); await f.support.reconcile();
    expect(f.rafa.items.contents).toHaveLength(1); expect(f.effects.size).toBe(0);
  });
});

describe("authorized pilot use through the existing engines", () => {
  it.each([false, true])("spends the pilot's PE/PD once using their NEX (PD=%s)", async pd => {
    const f = await ready(); f.settings.globalPlayingWithoutSanity = pd;
    const prepared = await prepare(f);
    await f.use.handle("rafa", prepared.request, "pilot-player"); await f.use.handle("rafa", prepared.request, "pilot-player");
    expect(f.rafa.system[pd ? "PD" : "PE"].value).toBe(18); expect(f.mauro.system.PE.value).toBe(20); expect(f.mauro.system.PD.value).toBe(20);
    expect(f.rolls).toHaveLength(1); expect(f.rolls[0].data.NEX.value).toBe(75);
    expect(prepared.message.getFlag(scope, "allyExecutionReceipt")).toMatchObject({ actorId: "rafa", allyId: "iris", requesterId: "pilot-player" });
    expect(classifyAllyUse({ item: f.rafa.items.get(prepared.grant.itemId), actor: f.rafa } as any)).toBe("managed");
  });
  it("executes automation only with its explicit pilot resource cost and beneficiary-independent formula data", async () => {
    const f = await ready({ automation: true }); f.settings.globalPlayingWithoutSanity = true;
    await f.source.update({ "system.cost": 19 }); await f.support.reconcile();
    const prepared = await prepare(f); expect(prepared.response.engine).toBe("automation");
    await f.use.handle("rafa", prepared.request, "pilot-player");
    expect(f.rafa.system.PE.value).toBe(19); expect(f.rafa.system.PD.value).toBe(20); expect(f.mauro.system.PE.value).toBe(20);
    expect(f.rolls).toHaveLength(1); expect(f.rolls[0].data.NEX.value).toBe(75);
  });
  it("does not give the Ally or beneficiary owner permission to use the pilot", async () => {
    const f = await ready();
    await expect(prepare(f, "rafa", "ally-player")).rejects.toThrow("permissão");
    await expect(prepare(f, "rafa", "player")).rejects.toThrow("permissão");
    expect(f.rolls).toHaveLength(0); expect(f.rafa.system.PE.value).toBe(20);
  });
  it.each(["pilot", "setting", "drone"])("rejects a prepared command when %s changes before confirmation", async change => {
    const f = await ready(); const prepared = await prepare(f);
    if (change === "pilot") await f.change("setPilot", { pilotId: "mauro" });
    if (change === "setting") f.settings[setting] = false;
    if (change === "drone") await f.iris.update({ "system.isDrone": false });
    const result: any = await f.use.handle("rafa", prepared.request, "pilot-player");
    expect(result.status).toBe("failed"); expect(f.rolls).toHaveLength(0); expect(f.rafa.system.PE.value).toBe(20); expect(f.mauro.system.PE.value).toBe(20);
  });
  it("stops at the next checkpoint after an external policy change, without redirecting or refunding the in-flight payment", async () => {
    const f = await ready(); const prepared = await prepare(f); const update = f.rafa.update.getMockImplementation()!;
    f.rafa.update.mockImplementationOnce(async changes => { await update(changes); f.settings[setting] = false; });
    await f.use.handle("rafa", prepared.request, "pilot-player");
    expect(prepared.message.getFlag(scope, "allyExecutionReceipt").status).toBe("uncertain");
    expect(f.rafa.system.PE.value).toBe(18); expect(f.mauro.system.PE.value).toBe(20); expect(f.rolls).toHaveLength(0);
    await f.makeUseService().handle("rafa", prepared.request, "pilot-player"); expect(f.rafa.system.PE.value).toBe(18);
  });
  it("keeps historical healing on the original target after switching the pilot", async () => {
    const f = await ready({ intent: "healing" });
    const message = f.message(foundry.utils.randomID(), f.pilotPlayer);
    const response: any = await f.use.handle("rafa", { id: "prepare-001", action: "prepare", itemId: f.currentGrant()!.itemId, messageId: message.id,
      targets: [{ id: "actor:Actor.mauro", actorId: "mauro", actorUuid: "Actor.mauro", name: "Mauro", tokenId: null, tokenUuid: null, sceneId: null }] }, "pilot-player");
    await f.use.handle("rafa", { id: "execute-001", action: "execute", messageId: message.id, sequence: response.sequence,
      options: { spendResource: true, selectedNexThresholds: {} } }, "pilot-player");
    await f.change("setPilot", { pilotId: "mauro" }); const receipt = message.getFlag(scope, "allyExecutionReceipt");
    await f.use.handle("rafa", { id: "apply-001", action: "apply", messageId: message.id, sequence: receipt.sequence, actionId: receipt.card.actions[0].id }, "gm");
    expect(f.mauro.system.PV.value).toBe(16); expect(f.rafa.system.PV.value).toBe(10); expect(f.rolls).toHaveLength(1);
  });
  it.each([false, true])("opens the existing dialog only on the pilot's client, sharing both listeners (confirm=%s)", async confirm => {
    const f = await ready();
    const { AbilityUseApplication } = await import("../../../../src/applications/ability-use-application");
    const { AbilityUseIntegration } = await import("../../../../src/features/abilities/ability-use-integration");
    const { ItemUseIntegration } = await import("../../../../src/features/item-use/item-use-integration");
    const dialog = vi.spyOn(AbilityUseApplication, "request").mockImplementation(async model => {
      expect(game.user!.id).toBe("pilot-player"); expect(model.actorName).toBe("rafa");
      expect(f.rafa.system.PE.value).toBe(20); expect(f.rolls).toHaveLength(0);
      return confirm ? { spendResource: true, selectedNexThresholds: {} } : null;
    });
    const requests = new FoundryAllyAbilityRequests();
    const send = vi.spyOn(requests, "send").mockImplementation(async (actorId, request) => {
      const user = game.user!; game.user = f.gm;
      try { return await f.use.handle(actorId, { ...request, id: `request-${request.action}` }, user.id) as any; }
      finally { game.user = user; }
    });
    game.user = f.pilotPlayer;
    const context: any = { actor: f.rafa, item: f.rafa.items.get(f.currentGrant()!.itemId), message: f.message(foundry.utils.randomID(), f.pilotPlayer), targets: [] };
    const generic: any = new AbilityUseIntegration({} as any, {} as any, {} as any, requests.gateway);
    const structured = new ItemUseIntegration({} as any, {} as any, {} as any, {} as any, {} as any, {} as any, {} as any, requests.gateway);
    await Promise.all([generic.handleItemUsed(context), structured.handleItemUsed(context)]);
    expect(dialog).toHaveBeenCalledOnce(); expect(send).toHaveBeenCalledTimes(2);
    expect(f.rafa.system.PE.value).toBe(confirm ? 18 : 20); expect(f.mauro.system.PE.value).toBe(20); expect(f.rolls).toHaveLength(confirm ? 1 : 0);
  });
  it("reads v4 without a pilot, preserves its identities/receipts and rejects malformed references", async () => {
    const f = await ready(); const ledger = f.ledger(); const old = structuredClone(ledger); delete old.links[0].pilotId;
    expect(readAllyLedger(old)).toMatchObject({ ...old, links: [expect.objectContaining({ pilotId: null })] });
    expect(readAllyLedger(ledger)).toEqual(ledger);
    for (const invalid of [false, 7, {}, "", "   "]) {
      const corrupted = structuredClone(ledger); (corrupted.links[0] as any).pilotId = invalid;
      expect(() => readAllyLedger(corrupted)).toThrow("corrompido");
    }
  });
});
