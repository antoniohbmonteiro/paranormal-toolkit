import { describe, expect, it, vi } from "vitest";
import { allyScopeFingerprint } from "../../../../src/core/allies/ally-definition";
import { AllySupportService, createAllyLedger, type AllyLedger, type AllySupportEnvironment } from "../../../../src/features/allies/ally-support-service";
import { AllyReconciliationService, type AllyManagedEffect } from "../../../../src/features/allies/ally-reconciliation-service";
import { electAllyExecutor, readAllyRequest } from "../../../../src/features/allies/ally-operation-authority";

function fixture() {
  let ledger: AllyLedger | null = null;
  const effects = new Map<string, AllyManagedEffect>();
  const sources = new Map(["iris", "guardian"].map(id => [id, [{ id: "item", definition: { version: 1 as const, benefits: [{ id: "defense", kind: "defense" as const, value: 5 }] } }]]));
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
    runtimeIdentity: () => "14.369:8.0.2",
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
    remove: vi.fn(async (effect: AllyManagedEffect) => { effects.delete(effect.effectId); }),
  };
  const service = new AllySupportService(store, env, new AllyReconciliationService(adapter));
  let requestId = 0;
  const request = (action: any, user = "gm-a", ally = "iris", beneficiaryId?: string) => service.process(ally, {
    id: "request-" + ++requestId, action, revision: ledger?.revision ?? 0,
    ...(beneficiaryId ? { beneficiaryId } : {}),
    ...(user.startsWith("gm") && ["assign", "activate", "approve"].includes(action) ? {
      scope: allyScopeFingerprint(sources.get(ally) ?? []),
      ...(action === "approve" ? { beneficiaryId: ledger?.links.find(link => link.allyId === ally)?.pending?.request.beneficiaryId
        ?? ledger?.links.find(link => link.allyId === ally)?.state.beneficiaryId ?? undefined } : {}),
    } : {}),
  }, user);
  const enable = () => request("validate");
  const activate = async (ally = "iris") => { await request("assign", "gm-a", ally, "joao"); await request("activate", "gm-a", ally); };
  return { service, store, env, adapter, effects, sources, request, enable, activate, ledger: () => ledger! };
}

describe("passive support service (Foundry ports doubled)", () => {
  it("lazily creates the store and requires the runtime gate before creating projections", async () => {
    const f = fixture();
    await f.service.reconcile();
    expect(f.store.save).not.toHaveBeenCalled();
    await f.activate();
    expect(f.effects.size).toBe(0);
    expect(f.ledger().diagnostic).toContain("valide");
    await f.enable();
    expect(f.effects.size).toBe(1);
  });
  it("assigns, activates, deactivates and switches while keeping assigned identity", async () => {
    const f = fixture(); await f.enable(); await f.activate();
    expect([...f.effects.values()][0].actorId).toBe("joao");
    await f.request("assign", "gm-a", "iris", "rafa");
    expect([...f.effects.values()][0].actorId).toBe("rafa");
    await f.request("deactivate");
    expect(f.effects.size).toBe(0);
    expect(f.ledger().links[0].state.beneficiaryId).toBe("rafa");
  });
  it("applies the next round only after removal and releases on combat deletion", async () => {
    const f = fixture(); await f.enable(); await f.activate();
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
  it("requires approval before writing to a beneficiary owned by someone else", async () => {
    const f = fixture(); await f.enable();
    await f.request("assign", "player", "iris", "joao");
    expect(f.ledger().links[0].state.beneficiaryId).toBeNull();
    expect(f.ledger().links[0].pending?.userId).toBe("player");
    await f.request("approve");
    await f.request("activate", "player");
    expect(f.effects.size).toBe(1);
  });
  it("rejects forged identities, lost ownership and stale revisions", async () => {
    const f = fixture(); await f.enable(); await f.activate();
    await expect(f.request("approve", "player")).rejects.toThrow("GM");
    f.env.ownsAlly = () => false;
    await expect(f.request("deactivate", "player")).rejects.toThrow("autorizado");
    await expect(f.service.process("iris", { id: "replay-000", action: "deactivate", revision: 0 }, "gm-a")).rejects.toThrow("mudou");
    expect(f.effects.size).toBe(1);
  });
  it("does not apply edits to unapproved mechanical scope, or steal precedence on approval", async () => {
    const f = fixture(); await f.enable(); await f.activate(); await f.activate("guardian");
    const sequence = f.ledger().orders.find(entry => entry.sourceKey.includes("iris"))?.sequence;
    f.sources.get("iris")![0].definition.benefits[0].value = 99;
    await f.service.reconcile();
    await f.request("approve");
    expect([...f.effects.values()][0].allyId).toBe("guardian");
    expect(f.ledger().orders.find(entry => entry.sourceKey.includes("iris"))?.sequence).toBe(sequence);
    await f.request("deactivate", "gm-a", "guardian");
    expect([...f.effects.values()][0].value).toBe(99);
  });
  it("reconciles repeatedly without new effect identities or precedence changes", async () => {
    const f = fixture(); await f.enable(); await f.activate();
    const before = structuredClone(f.ledger().orders);
    const revision = f.ledger().revision;
    await f.service.reconcile(); await f.service.reconcile();
    expect(f.adapter.create).toHaveBeenCalledTimes(1);
    expect(f.ledger().orders).toEqual(before);
    expect(f.ledger().revision).toBe(revision);
  });
  it("cleans up deleted skills/allies and falls back to the previous source", async () => {
    const f = fixture(); await f.enable(); await f.activate(); await f.activate("guardian");
    f.sources.get("guardian")![0].definition.benefits = [];
    await f.service.reconcile();
    expect([...f.effects.values()][0].allyId).toBe("iris");
    f.sources.delete("iris");
    await f.service.reconcile();
    expect(f.effects.size).toBe(0);
  });
  it("blocks replacement if removing the old projection fails and recovers on retry", async () => {
    const f = fixture(); await f.enable(); await f.activate();
    f.adapter.remove.mockRejectedValueOnce(new Error("delete failed"));
    await f.request("assign", "gm-a", "iris", "rafa");
    expect([...f.effects.values()][0].actorId).toBe("joao");
    expect(f.adapter.create).toHaveBeenCalledTimes(1);
    expect(f.ledger().diagnostic).toContain("delete failed");
    await f.service.reconcile();
    expect([...f.effects.values()][0].actorId).toBe("rafa");
  });
  it("records the identity before creating and recovers a lost creation response", async () => {
    const f = fixture(); await f.enable();
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
    await f.request("validate");
    expect(f.store.load).not.toHaveBeenCalled();
    f.env.users = () => [{ id: "player", active: true, isGM: false }];
    await f.service.reconcile();
    expect(f.store.load).not.toHaveBeenCalled();
  });
  it("cancels before persisting if the executor changes during an operation", async () => {
    const f = fixture();
    f.store.load.mockImplementationOnce(async () => { f.env.currentUserId = () => "gm-b"; return createAllyLedger(); });
    await expect(f.request("validate")).rejects.toThrow("executor mudou");
    expect(f.store.save).not.toHaveBeenCalled();
  });
  it("processes concurrent requests serially and rejects the outdated second request", async () => {
    const f = fixture(); await f.enable(); await f.activate();
    const results = await Promise.allSettled([f.request("deactivate"), f.request("activate")]);
    expect(results[0].status).toBe("fulfilled");
    expect(results[1].status).toBe("rejected");
    expect(f.effects.size).toBe(0);
  });
});
describe("passive support recovery and review regressions", () => {
  it("reuses a tracked identity when creation fails before the response can be verified", async () => {
    const f = fixture(); await f.enable();
    f.adapter.create.mockRejectedValueOnce(new Error("connection lost"));
    await f.activate();
    const identity = f.ledger().managed[0].effectId;
    expect(f.effects.size).toBe(0);
    await f.service.reconcile();
    expect([...f.effects.values()][0].effectId).toBe(identity);
  });
  it("allows deactivation even with a malformed source definition", async () => {
    const f = fixture(); await f.enable(); await f.activate();
    f.env.abilities = () => null;
    await f.request("deactivate");
    expect(f.effects.size).toBe(0);
    expect(f.ledger().links[0].state.status).toBe("inactive");
  });
  it("does not invalidate approval when an empty ability is added", async () => {
    const f = fixture(); await f.enable(); await f.activate();
    f.sources.get("iris")!.push({ id: "empty", definition: { version: 1, benefits: [] } });
    await f.service.reconcile();
    expect(f.effects.size).toBe(1);
    expect(f.adapter.create).toHaveBeenCalledTimes(1);
  });
  it("rejects approving scope edited after the GM reviewed it", async () => {
    const f = fixture(); await f.enable(); await f.activate();
    const scope = allyScopeFingerprint(f.sources.get("iris")!);
    f.sources.get("iris")![0].definition.benefits[0].value = 99;
    await expect(f.service.process("iris", { id: "review-01", revision: f.ledger().revision,
      action: "approve", beneficiaryId: "joao", scope }, "gm-a")).rejects.toThrow("mudaram");
  });
  it("requires a new approval after deleting and restoring an Ally identity", async () => {
    const f = fixture(); await f.enable(); await f.activate();
    const original = f.sources.get("iris")!;
    f.sources.delete("iris"); await f.service.reconcile();
    f.sources.set("iris", original); await f.service.reconcile();
    expect(f.ledger().links[0].approval).toBeNull();
    expect(f.effects.size).toBe(0);
  });
  it("does not lose a pending assignment when activation is requested too early", async () => {
    const f = fixture(); await f.enable();
    await f.request("assign", "player", "iris", "joao");
    await expect(f.request("activate", "player")).rejects.toThrow("beneficiário");
    expect(f.ledger().links[0].pending?.request.beneficiaryId).toBe("joao");
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
  });
});
