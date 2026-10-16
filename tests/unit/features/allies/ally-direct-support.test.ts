import { describe, expect, it } from "vitest";
import { grantWorld, scope } from "../../../helpers/ally-grant-world";
import { buildDefenseTemplate } from "../../../../src/adapters/ordem/ordem-ally-effect-presets";
import { readAllyRequest } from "../../../../src/features/allies/ally-operation-authority";

async function ready() {
  const f = await grantWorld();
  f.addAbility({ effects: [{ ...buildDefenseTemplate("Defesa", 5), _id: "defense", transfer: false,
    flags: { [scope]: { allyPassive: { version: 1 } } } }] });
  await f.support.reconcile(); let id = 0;
  const select = (beneficiaryId: string | null) => f.support.process("iris", { id: `direct-request-${++id}`, revision: f.ledger().revision,
    action: "setBeneficiary", beneficiaryId }, "ally-player");
  return { ...f, select };
}
describe("direct beneficiary selection and safe development cleanup", () => {
  it("clears all tracked projections, then activates with one coherent beneficiary intent", async () => {
    const f = await ready(); expect(f.effects.size).toBe(1); expect(f.mauro.items.contents).toHaveLength(1);
    await f.select(null);
    expect(f.ledger().links[0].state).toMatchObject({ beneficiaryId: null, status: "inactive" });
    expect(f.effects.size).toBe(0); expect(f.mauro.items.contents).toHaveLength(0); expect(f.ledger().managedGrants).toHaveLength(0);
    f.store.save.mockClear(); await f.select("rafa");
    expect(f.ledger().links[0].state.status).toBe("active"); expect(f.ledger().managedGrants[0].actorId).toBe("rafa");
    expect([...f.effects.values()][0].actorId).toBe("rafa");
    for (const [snapshot] of f.store.save.mock.calls) {
      if (snapshot.links[0].state.beneficiaryId === "rafa") expect(snapshot.links[0].state.status).toBe("active");
    }
  });
  it("does not change precedence, suppression or notifications on repeated selection", async () => {
    const f = await ready(); const state = f.ledger().links[0].state;
    const grant = f.ledger().managedGrants[0]; await f.mauro.deleteEmbeddedDocuments("Item", [grant.itemId]);
    await f.support.suppressGrant("mauro", grant.itemId, "gm");
    const before = f.ledger(), notices = f.environment.notify.mock.calls.length;
    await f.select("mauro");
    expect(f.ledger().links[0].state).toEqual(state); expect(f.ledger().orders).toEqual(before.orders);
    expect(f.ledger().links[0].suppressedGrants).toEqual(before.links[0].suppressedGrants);
    expect(f.mauro.items.contents).toHaveLength(0); expect(f.environment.notify).toHaveBeenCalledTimes(notices);
  });
  it("preserves a combat wait through clearing and repeated selections, including a new recipient", async () => {
    const f = await ready(); let round = 4;
    f.environment.resolveCombat = () => ({ id: "combat", round, started: true });
    f.environment.combat = () => ({ id: "combat", round, started: true });
    await f.select(null); expect(f.ledger().links[0].state.wait).toEqual({ combatId: "combat", round: 5 });
    await f.select("rafa"); await f.select(null); await f.select("mauro");
    expect(f.ledger().links[0].state).toMatchObject({ status: "pending", wait: { round: 5 } });
    expect(f.effects.size).toBe(0); expect(f.ledger().managedGrants).toHaveLength(0);
    round = 5; await f.support.reconcile();
    expect(f.ledger().links[0].state.status).toBe("active"); expect(f.mauro.items.contents).toHaveLength(1);
  });
  it("preserves tracking on a failed removal and does not create a replacement", async () => {
    const f = await ready(); const grant = f.ledger().managedGrants[0];
    f.mauro.deleteEmbeddedDocuments.mockRejectedValueOnce(new Error("delete refused"));
    await f.select("rafa");
    expect(f.ledger().diagnostic).toContain("delete refused"); expect(f.ledger().managedGrants[0]).toEqual(grant);
    expect(f.rafa.items.contents).toHaveLength(0); expect(f.mauro.items.get(grant.itemId)).toBeDefined();
    await f.select(null); expect(f.ledger().managedGrants).toHaveLength(0); expect(f.mauro.items.contents).toHaveLength(0);
  });
  it("can clear broken source configurations and does not remove external Items", async () => {
    const f = await ready(); await f.mauro.createEmbeddedDocuments("Item", [{ _id: "external", name: "Habilidade", type: "ability" }]);
    f.environment.abilities = () => null; await f.select(null);
    expect(f.effects.size).toBe(0); expect(f.ledger().managedGrants).toHaveLength(0);
    expect(f.mauro.items.contents.map((item: any) => item.id)).toEqual(["external"]);
  });
  it("keeps execution identities, protected historical cards and replay protection after cleanup", async () => {
    const f = await ready(), grant = f.ledger().managedGrants[0], message = f.message("native-history", f.player);
    const prepared: any = await f.use.handle("mauro", { id: "prepare-history", action: "prepare", itemId: grant.itemId, messageId: message.id }, "player");
    const execute = { id: "execute-history", action: "execute" as const, messageId: message.id, sequence: prepared.sequence,
      options: { spendResource: true, selectedNexThresholds: {} } };
    await f.use.handle("mauro", execute, "player");
    const ledger = f.ledger(), receipt = structuredClone(message.getFlag(scope, "allyExecutionReceipt"));
    const spent = f.mauro.system.PE.value, rolls = f.rolls.length;
    await f.select(null); await f.use.handle("mauro", execute, "player");
    expect(message.getFlag(scope, "allyExecutionReceipt")).toEqual(receipt);
    expect(f.ledger()).toMatchObject({ ledgerInstanceId: ledger.ledgerInstanceId, nextExecutionSequence: ledger.nextExecutionSequence,
      retiredExecutionThrough: ledger.retiredExecutionThrough, executionGeneration: ledger.executionGeneration });
    expect(f.mauro.system.PE.value).toBe(spent); expect(f.rolls).toHaveLength(rolls);
  });
  it.each([undefined, false, 7, {}, "", "   "])("rejects an incomplete or invalid nullable beneficiary (%s)", beneficiaryId => {
    expect(readAllyRequest({ id: "request-valid", revision: 0, action: "setBeneficiary", beneficiaryId })).toBeNull();
  });
  it("accepts clearing and ignores stale null beneficiary fields on a later pilot request", () => {
    expect(readAllyRequest({ id: "request-valid", revision: 0, action: "setBeneficiary", beneficiaryId: null })).toMatchObject({ beneficiaryId: null });
    expect(readAllyRequest({ id: "request-valid", revision: 0, action: "setPilot", beneficiaryId: null, pilotId: "rafa" })).not.toHaveProperty("beneficiaryId");
  });
});
