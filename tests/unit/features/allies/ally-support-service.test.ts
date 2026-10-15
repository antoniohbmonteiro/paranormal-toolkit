import { defenseBenefit } from "../../../helpers/ally-effects";
import { describeAllyEffect } from "../../../../src/adapters/ordem/ordem-ally-benefit-adapter";
import { describe, expect, it, vi } from "vitest";
import { AllySupportService, createAllyLedger, type AllyLedger, type AllySupportEnvironment } from "../../../../src/features/allies/ally-support-service";
import { AllyReconciliationService, type AllyManagedEffect } from "../../../../src/features/allies/ally-reconciliation-service";
import { electAllyExecutor, readAllyRequest } from "../../../../src/features/allies/ally-operation-authority";
import { readAllyLedger } from "../../../../src/adapters/foundry/foundry-ally-store";

function fixture() {
  let ledger: AllyLedger | null = null;
  const effects = new Map<string, AllyManagedEffect>();
  const sources = new Map(["iris", "guardian"].map(id => [id, [{ id: "item", definition: { version: 2 as const, benefits: [defenseBenefit()] } }]]));
  let counter = 0;
  const env: AllySupportEnvironment = {
    currentUserId: () => "gm-a",
    users: () => [{ id: "gm-b", isGM: true, active: true }, { id: "player", isGM: false, active: true }, { id: "gm-a", isGM: true, active: true }],
    ownsAlly: (_ally, user) => user === "player",
    allyExists: id => sources.has(id),
    agentExists: id => ["joao", "rafa"].includes(id),
    abilities: id => sources.get(id) ?? null,
    resolveCombat: () => null,
    combat: () => null,
    describeEffect: describeAllyEffect,
    notify: vi.fn(async () => {}),
    publish: vi.fn(async () => {}),
  };
  const store = {
    load: vi.fn(async (create = false) => {
      if (!ledger && create) ledger = createAllyLedger();
      return ledger ? structuredClone(ledger) : null;
    }),
    save: vi.fn(async (data: AllyLedger) => { ledger = structuredClone(data); }),
  };
  const adapter = {
    newId: () => "effect-" + ++counter,
    matches: (effect: AllyManagedEffect) => JSON.stringify(effects.get(effect.effectId)) === JSON.stringify(effect),
    exists: (effect: AllyManagedEffect) => effects.has(effect.effectId),
    create: vi.fn(async (effect: AllyManagedEffect) => { effects.set(effect.effectId, structuredClone(effect)); }),
    update: vi.fn(async (effect: AllyManagedEffect) => { effects.set(effect.effectId, structuredClone(effect)); }),
    remove: vi.fn(async (effect: AllyManagedEffect) => { effects.delete(effect.effectId); }),
  };
  const service = new AllySupportService(store, env, new AllyReconciliationService(adapter));
  let requestId = 0;
  const request = (action: any, user = "gm-a", ally = "iris", beneficiaryId?: string) => service.process(ally, {
    id: "request-" + ++requestId, action, revision: ledger?.revision ?? 0,
    ...(beneficiaryId ? { beneficiaryId } : {}),
  }, user);
  const activate = async (ally = "iris") => { await request("assign", "gm-a", ally, "joao"); await request("activate", "gm-a", ally); };
  return { service, store, env, adapter, effects, sources, request, activate, ledger: () => ledger! };
}

describe("passive support service (Foundry ports doubled)", () => {
  it("lazily creates the store and applies effects without an environment gate", async () => {
    const f = fixture();
    await f.service.reconcile();
    expect(f.store.save).not.toHaveBeenCalled();
    await f.activate();
    expect(f.effects.size).toBe(1);
    expect(f.ledger().diagnostic).toBeNull();
  });
  it("assigns, activates, deactivates and switches while keeping assigned identity", async () => {
    const f = fixture(); await f.activate();
    expect([...f.effects.values()][0].actorId).toBe("joao");
    await f.request("assign", "gm-a", "iris", "rafa");
    expect([...f.effects.values()][0].actorId).toBe("rafa");
    await f.request("deactivate");
    expect(f.effects.size).toBe(0);
    expect(f.ledger().links[0].state.beneficiaryId).toBe("rafa");
  });
  it("applies the next round only after removal and releases on combat deletion", async () => {
    const f = fixture(); await f.activate();
    f.env.resolveCombat = () => ({ id: "combat", round: 2, started: true });
    f.env.combat = () => ({ id: "combat", round: 2, started: true });
    await f.request("assign", "gm-a", "iris", "rafa");
    expect(f.effects.size).toBe(0);
    await f.service.reconcile();
    expect(f.ledger().links[0].state.status).toBe("pending");
    f.env.combat = () => null;
    await f.service.reconcile();
    expect([...f.effects.values()][0].actorId).toBe("rafa");
  });
  it("automatically executes an owner's support on another beneficiary through the elected GM", async () => {
    const f = fixture();
    await f.request("assign", "player", "iris", "joao");
    expect(f.ledger().links[0].state.beneficiaryId).toBe("joao");
    await f.request("activate", "player");
    expect(f.effects.size).toBe(1);
  });
  it("rejects forged identities, lost ownership and stale revisions", async () => {
    const f = fixture(); await f.activate();
    await expect(f.request("reconcile", "player")).rejects.toThrow("GM");
    await expect(f.request("deactivate", "forged")).rejects.toThrow("autorizado");
    f.env.ownsAlly = () => false;
    await expect(f.request("deactivate", "player")).rejects.toThrow("autorizado");
    await expect(f.service.process("iris", { id: "replay-000", action: "deactivate", revision: 0 }, "gm-a")).rejects.toThrow("mudou");
    expect(f.effects.size).toBe(1);
  });
  it("rejects unknown operations, invalid beneficiaries and malformed source definitions", async () => {
    const f = fixture();
    await expect(f.request("approve", "player")).rejects.toThrow("inválida");
    await expect(f.request("validate", "gm-a")).rejects.toThrow("inválida");
    await expect(f.request("assign", "player", "iris", "missing")).rejects.toThrow("persistente");
    f.env.abilities = () => null;
    await expect(f.request("assign", "player", "iris", "joao")).rejects.toThrow("Configuração");
    expect(f.effects.size).toBe(0);
  });
  it("automatically accepts benefit edits without stealing precedence", async () => {
    const f = fixture(); await f.activate(); await f.activate("guardian");
    const sequence = f.ledger().orders.find(entry => entry.sourceKey.includes("iris"))?.sequence;
    f.sources.get("iris")![0].definition.benefits[0].template.system.changes[0].value = 99;
    await f.service.reconcile();
    expect([...f.effects.values()][0].allyId).toBe("guardian");
    expect(f.ledger().orders.find(entry => entry.sourceKey.includes("iris"))?.sequence).toBe(sequence);
    await f.request("deactivate", "gm-a", "guardian");
    expect([...f.effects.values()][0].template!.system.changes[0].value).toBe(99);
  });
  it("reconciles repeatedly without new effect identities or precedence changes", async () => {
    const f = fixture(); await f.activate();
    const before = structuredClone(f.ledger().orders);
    const revision = f.ledger().revision;
    await f.service.reconcile(); await f.service.reconcile();
    expect(f.adapter.create).toHaveBeenCalledTimes(1);
    expect(f.ledger().orders).toEqual(before);
    expect(f.ledger().revision).toBe(revision);
  });
  it("preserves projections and reports an invalid active source until repaired or deactivated", async () => {
    const f = fixture(); await f.activate();
    const id = f.ledger().managed[0].effectId;
    f.env.abilities = () => null;
    await f.service.reconcile();
    expect(f.effects.has(id)).toBe(true);
    expect(f.adapter.remove).not.toHaveBeenCalled();
    expect(f.ledger().diagnostic).toContain("preservadas");
    await f.request("deactivate"); expect(f.effects.size).toBe(0);
  });
  it("cleans up deleted skills/allies and falls back to the previous source", async () => {
    const f = fixture(); await f.activate(); await f.activate("guardian");
    f.sources.get("guardian")![0].definition.benefits = [];
    await f.service.reconcile();
    expect([...f.effects.values()][0].allyId).toBe("iris");
    f.sources.delete("iris");
    await f.service.reconcile();
    expect(f.effects.size).toBe(0);
  });
  it("blocks replacement if removing the old projection fails and recovers on retry", async () => {
    const f = fixture(); await f.activate();
    f.adapter.remove.mockRejectedValueOnce(new Error("delete failed"));
    await f.request("assign", "gm-a", "iris", "rafa");
    expect([...f.effects.values()][0].actorId).toBe("joao");
    expect(f.adapter.create).toHaveBeenCalledTimes(1);
    expect(f.ledger().diagnostic).toContain("delete failed");
    await f.service.reconcile();
    expect([...f.effects.values()][0].actorId).toBe("rafa");
  });
  it("records the identity before creating and recovers a lost creation response", async () => {
    const f = fixture();
    f.adapter.create.mockImplementationOnce(async effect => {
      expect(f.ledger().managed.some(entry => entry.effectId === effect.effectId)).toBe(true);
      f.effects.set(effect.effectId, effect);
      throw new Error("response lost");
    });
    await f.activate();
    await f.service.reconcile();
    expect(f.adapter.create).toHaveBeenCalledTimes(1);
    expect(f.effects.size).toBe(1);
  });
  it("does not execute from a second GM or without an elected GM", async () => {
    const f = fixture(); f.env.currentUserId = () => "gm-b";
    await f.request("reconcile");
    expect(f.store.load).not.toHaveBeenCalled();
    f.env.users = () => [{ id: "player", active: true, isGM: false }];
    await f.service.reconcile();
    expect(f.store.load).not.toHaveBeenCalled();
  });
  it("cancels before persisting if the executor changes during an operation", async () => {
    const f = fixture();
    f.store.load.mockImplementationOnce(async () => { f.env.currentUserId = () => "gm-b"; return createAllyLedger(); });
    await expect(f.request("reconcile")).rejects.toThrow("executor mudou");
    expect(f.store.save).not.toHaveBeenCalled();
  });
  it("processes concurrent requests serially and rejects the outdated second request", async () => {
    const f = fixture(); await f.activate();
    const results = await Promise.allSettled([f.request("deactivate"), f.request("activate")]);
    expect(results[0].status).toBe("fulfilled");
    expect(results[1].status).toBe("rejected");
    expect(f.effects.size).toBe(0);
  });
});
describe("passive support recovery and canonical configuration", () => {
  it("reuses a tracked identity when creation fails before the response can be verified", async () => {
    const f = fixture();
    f.adapter.create.mockRejectedValueOnce(new Error("connection lost"));
    await f.activate();
    const identity = f.ledger().managed[0].effectId;
    expect(f.effects.size).toBe(0);
    await f.service.reconcile();
    expect([...f.effects.values()][0].effectId).toBe(identity);
  });
  it("allows deactivation even with a malformed source definition", async () => {
    const f = fixture(); await f.activate();
    f.env.abilities = () => null;
    await f.request("deactivate");
    expect(f.effects.size).toBe(0);
    expect(f.ledger().links[0].state.status).toBe("inactive");
  });
  it("does not replace effects when an empty ability is added", async () => {
    const f = fixture(); await f.activate();
    f.sources.get("iris")!.push({ id: "empty", definition: { version: 2, benefits: [] } });
    await f.service.reconcile();
    expect(f.effects.size).toBe(1);
    expect(f.adapter.create).toHaveBeenCalledTimes(1);
  });
  it("uses canonical abilities instead of arbitrary mechanics carried in client flags", async () => {
    const f = fixture(); await f.activate();
    await f.service.process("iris", { id: "forged-01", revision: f.ledger().revision,
      action: "activate", scope: "arbitrary", benefits: [{ value: 999 }], userId: "gm-a" } as any, "player");
    expect([...f.effects.values()][0].template!.system.changes[0].value).toBe(5);
  });
  it("does not automatically reactivate an Ally after deletion and restoration", async () => {
    const f = fixture(); await f.activate();
    const original = f.sources.get("iris")!;
    f.sources.delete("iris"); await f.service.reconcile();
    f.sources.set("iris", original); await f.service.reconcile();
    expect(f.ledger().links[0].state.status).toBe("inactive");
    expect(f.effects.size).toBe(0);
  });
  it("rejects activation without a beneficiary, then immediately accepts an owner's assignment", async () => {
    const f = fixture();
    await expect(f.request("activate", "player")).rejects.toThrow("beneficiário");
    await f.request("assign", "player", "iris", "joao");
    await f.request("activate", "player");
    expect(f.ledger().links[0].state.beneficiaryId).toBe("joao");
    expect(f.effects.size).toBe(1);
  });
});

describe("support notifications and manual GM suppression", () => {
  it("initializes legacy notification baselines without chat spam or recreating existing projections", async () => {
    const f = fixture(); await f.activate();
    const legacy = { ...structuredClone(f.ledger()), version: 1, validatedRuntime: null,
      links: f.ledger().links.map(link => ({ allyId: link.allyId, state: link.state,
        approval: null, pending: { userId: "player", request: { id: "old-pending", revision: 0, action: "assign", beneficiaryId: "rafa" } },
        diagnostic: "Aguardando aprovação" })) };
    vi.mocked(f.env.notify).mockClear();
    f.store.load.mockResolvedValueOnce(readAllyLedger(legacy));
    await f.service.reconcile();
    expect(f.adapter.create).toHaveBeenCalledTimes(1);
    expect(f.adapter.remove).not.toHaveBeenCalled();
    expect(f.env.notify).not.toHaveBeenCalled();
    expect(f.ledger().links[0].state.beneficiaryId).toBe("joao");
    expect(f.ledger().version).toBe(4);
  });
  it("emits changes only once across no-op requests, reconciliation and service reload", async () => {
    const f = fixture(); await f.activate();
    const notices = vi.mocked(f.env.notify);
    expect(notices.mock.calls.map(([change]) => change.events)).toEqual([["beneficiaryChanged"], ["activated"]]);
    await f.request("assign", "player", "iris", "joao");
    await f.request("activate", "player");
    await f.service.reconcile();
    await new AllySupportService(f.store, f.env, new AllyReconciliationService(f.adapter)).reconcile();
    expect(notices).toHaveBeenCalledTimes(2);
    expect(f.adapter.create).toHaveBeenCalledTimes(1);
  });
  it("notifies benefit edits and removals without changing support precedence", async () => {
    const f = fixture(); await f.activate();
    const sequence = f.ledger().links[0].state.sequence;
    f.sources.get("iris")![0].definition.benefits[0].template.system.changes[0].value = 10;
    await f.service.reconcile();
    expect([...f.effects.values()][0].template!.system.changes[0].value).toBe(10);
    expect(f.env.notify).toHaveBeenLastCalledWith(expect.objectContaining({ events: ["benefitsChanged"],
      before: expect.objectContaining({ benefits: [expect.objectContaining({ value: 5 })] }),
      after: expect.objectContaining({ benefits: [expect.objectContaining({ value: 10 })] }) }));
    f.sources.get("iris")![0].definition.benefits = [];
    await f.service.reconcile();
    expect(f.effects.size).toBe(0);
    expect(f.ledger().links[0].state.sequence).toBe(sequence);
    expect(f.env.notify).toHaveBeenLastCalledWith(expect.objectContaining({ events: ["benefitsChanged"],
      after: expect.objectContaining({ benefits: [] }) }));
  });
  it("announces switch and next-round activation once, never during an unchanged round", async () => {
    const f = fixture(); await f.activate();
    f.env.resolveCombat = () => ({ id: "combat", round: 2, started: true });
    f.env.combat = () => ({ id: "combat", round: 2, started: true });
    await f.request("assign", "player", "iris", "rafa");
    expect(f.effects.size).toBe(0);
    expect(f.env.notify).toHaveBeenLastCalledWith(expect.objectContaining({ events: ["beneficiaryChanged"],
      before: expect.objectContaining({ beneficiaryId: "joao" }), after: expect.objectContaining({ beneficiaryId: "rafa" }) }));
    const count = vi.mocked(f.env.notify).mock.calls.length;
    await f.service.reconcile(); expect(f.env.notify).toHaveBeenCalledTimes(count);
    f.env.combat = () => ({ id: "combat", round: 3, started: true });
    await f.service.reconcile(); await f.service.reconcile();
    expect(f.env.notify).toHaveBeenCalledTimes(count + 1);
    expect(f.env.notify).toHaveBeenLastCalledWith(expect.objectContaining({ events: ["transitionCompleted"] }));
    expect([...f.effects.values()][0].actorId).toBe("rafa");
  });
  it("does not roll back mechanics or repeat a failed chat publication", async () => {
    const f = fixture(); await f.request("assign", "player", "iris", "joao");
    vi.spyOn(console, "warn").mockImplementation(() => {});
    vi.mocked(f.env.notify).mockRejectedValueOnce(new Error("chat unavailable"));
    await expect(f.request("activate", "player")).resolves.toBeUndefined();
    expect(f.effects.size).toBe(1);
    await f.service.reconcile();
    expect(f.env.notify).toHaveBeenCalledTimes(2);
    expect(console.warn).toHaveBeenCalled();
  });
  it("announces a switch only after an interrupted removal actually completes", async () => {
    const f = fixture(); await f.activate();
    const notices = vi.mocked(f.env.notify).mock.calls.length;
    f.adapter.remove.mockRejectedValueOnce(new Error("delete failed"));
    await f.request("assign", "player", "iris", "rafa");
    expect(f.env.notify).toHaveBeenCalledTimes(notices);
    await f.service.reconcile(); await f.service.reconcile();
    expect(f.env.notify).toHaveBeenCalledTimes(notices + 1);
  });
  it("preserves a GM's removal through edits and reload, clearing suppression on reactivation", async () => {
    const f = fixture(); await f.activate();
    const effect = [...f.effects.values()][0]; f.effects.delete(effect.effectId);
    await f.service.suppressEffect(effect.actorId, effect.effectId, "gm-b");
    f.sources.get("iris")![0].definition.benefits[0].template.system.changes[0].value = 10;
    await f.service.reconcile();
    await new AllySupportService(f.store, f.env, new AllyReconciliationService(f.adapter)).reconcile();
    expect(f.effects.size).toBe(0); expect(f.adapter.create).toHaveBeenCalledTimes(1);
    expect(f.ledger().links[0].suppressedSources).toEqual([effect.sourceKey]);
    await f.request("deactivate", "gm-b"); await f.request("activate", "player");
    expect([...f.effects.values()][0].template!.system.changes[0].value).toBe(10);
    expect(f.ledger().links[0].suppressedSources).toEqual([]);
  });
  it("does not let a player or a forged effect identity suppress a canonical benefit", async () => {
    const f = fixture(); await f.activate();
    const effect = [...f.effects.values()][0];
    await f.service.suppressEffect(effect.actorId, "unmanaged-id", "gm-a");
    f.effects.delete(effect.effectId);
    await f.service.suppressEffect(effect.actorId, effect.effectId, "player");
    expect(f.ledger().links[0].suppressedSources).toEqual([]);
    expect(f.effects.size).toBe(1);
  });
  it("retains fallback to another Ally when the winning source is suppressed", async () => {
    const f = fixture(); await f.activate(); await f.activate("guardian");
    const effect = [...f.effects.values()][0]; f.effects.delete(effect.effectId);
    await f.service.suppressEffect(effect.actorId, effect.effectId, "gm-a");
    expect([...f.effects.values()][0].allyId).toBe("iris");
    expect(f.ledger().links.find(link => link.allyId === "guardian")!.state.status).toBe("active");
  });
  it("clears suppression on a real beneficiary change but not same-reference assignment", async () => {
    const f = fixture(); await f.activate();
    const effect = [...f.effects.values()][0]; f.effects.delete(effect.effectId);
    await f.service.suppressEffect(effect.actorId, effect.effectId, "gm-a");
    await f.request("assign", "player", "iris", "joao"); expect(f.effects.size).toBe(0);
    await f.request("assign", "player", "iris", "rafa");
    expect([...f.effects.values()][0].actorId).toBe("rafa");
  });
});

describe("support request validation", () => {
  it("elects deterministically and never elects players", () => {
    expect(electAllyExecutor([{ id: "b", isGM: true, active: true }, { id: "a", isGM: true, active: true }])).toBe("a");
    expect(electAllyExecutor([{ id: "a", isGM: false, active: true }])).toBeNull();
  });
  it("discards a payload userId and rejects malformed requests", () => {
    expect(readAllyRequest({ id: "request-01", revision: 0, action: "deactivate", userId: "gm" })).not.toHaveProperty("userId");
    expect(readAllyRequest({ id: "request-01", revision: 0, action: "assign" })).toBeNull();
    expect(readAllyRequest({ id: "request-01", revision: -1, action: "activate" })).toBeNull();
    expect(readAllyRequest({ id: "request-01", revision: 0, action: "approve" })).toBeNull();
    expect(readAllyRequest({ id: "request-01", revision: 0, action: "validate" })).toBeNull();
  });
});
