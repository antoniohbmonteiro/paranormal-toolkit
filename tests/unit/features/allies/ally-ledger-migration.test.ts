import { describe, expect, it } from "vitest";
import { readAllyLedger } from "../../../../src/adapters/foundry/foundry-ally-store";

function legacyLedger() {
  const sourceKey = JSON.stringify(["iris", "item", "defense"]);
  return { version: 1, revision: 4, nextSequence: 3, validatedRuntime: null, diagnostic: "Valide o ambiente",
    links: [{ allyId: "iris", state: { beneficiaryId: "joao", status: "active", sequence: 1, wait: null },
      approval: { beneficiaryId: "joao", scope: "old" },
      pending: { userId: "player", request: { id: "pending-01", revision: 4, action: "assign", beneficiaryId: "rafa" } },
      diagnostic: "Aguardando aprovação" }],
    orders: [{ sourceKey, activationSequence: 1, sequence: 2 }],
    managed: [{ effectId: "existing-effect", actorId: "joao", allyId: "iris", value: 5, sourceKey }] };
}
describe("protected Allies ledger migration", () => {
  it("preserves effective links, waits, effect identities, precedence and revision without replaying old requests", () => {
    const old = legacyLedger(), before = structuredClone(old), next = readAllyLedger(old);
    expect(old).toEqual(before);
    expect(next).toMatchObject({ version: 3, revision: 4, nextSequence: 3,
      managed: old.managed, orders: old.orders, diagnostic: null });
    expect(next.links[0]).toEqual({ allyId: "iris", state: old.links[0].state,
      notice: null, suppressedSources: [], diagnostic: null });
    expect(next).not.toHaveProperty("validatedRuntime");
    expect(readAllyLedger(next)).toEqual(next);
  });
  it("preserves pending combat transitions independently of the old approval queue", () => {
    const old = legacyLedger();
    old.links[0].state = { ...old.links[0].state, status: "pending", wait: { combatId: "combat", round: 4 } } as any;
    expect(readAllyLedger(old).links[0].state).toEqual(old.links[0].state);
  });
  it.each(["approve", "validate"])("reads legacy %s metadata without authorizing execution", action => {
    const old = legacyLedger(); old.links[0].pending.request.action = action;
    expect(readAllyLedger(old).links[0]).not.toHaveProperty("pending");
  });
  it("fails closed for corrupt legacy metadata without mutating it", () => {
    const old = legacyLedger(); (old.links[0].approval as any).scope = 42;
    const before = structuredClone(old);
    expect(() => readAllyLedger(old)).toThrow("corrompido"); expect(old).toEqual(before);
    old.links[0].approval.scope = "valid";
    old.links[0].pending.request.id = "bad";
    expect(() => readAllyLedger(old)).toThrow("corrompido");
  });
  it("validates suppression and notification baselines in the new contract", () => {
    const next = readAllyLedger(legacyLedger());
    next.links[0].suppressedSources = ["same", "same"];
    expect(() => readAllyLedger(next)).toThrow("corrompido");
    next.links[0].suppressedSources = [];
    next.links[0].notice = { status: "active", beneficiaryId: "joao", benefits: [{ sourceKey: "s", value: NaN }] };
    expect(() => readAllyLedger(next)).toThrow("corrompido");
  });
});
