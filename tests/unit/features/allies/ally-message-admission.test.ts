import { describe, expect, it, vi } from "vitest";
import { grantWorld, scope } from "../../../helpers/ally-grant-world";
import { AllyMessageAdmissionError, diagnoseAllyMessageAdmission } from "../../../../src/adapters/foundry/foundry-ally-receipt-adapter";
import { FoundryAllyAbilityRequests } from "../../../../src/adapters/foundry/foundry-ally-ability-request-adapter";

async function ready() {
  const f = await grantWorld();
  f.addAbility({ flags: { [scope]: { abilityRollConfig: { schemaVersion: 1, rolls: [{ id: "damage", label: "Dano", intent: "damage", damageType: "impact",
    formula: { mode: "fixed", formula: "1d6" } }] } } } });
  await f.support.reconcile();
  const projected = f.mauro.items.get(f.ledger().managedGrants[0].itemId);
  const message = f.message("native-admission");
  const prepare = () => f.use.handle("mauro", { id: "prepare-001", action: "prepare", messageId: message.id, itemId: projected.id, targets: [] }, "player") as Promise<any>;
  return { ...f, projected, message, prepare };
}

describe("native message admission independent of creation time and client clocks", () => {
  it("keeps the optional probe read-only and reports the corrected and legacy clock ages", async () => {
    const f = await ready();
    const { installAllyAbilityAdmissionProbe } = await import("../../../../scripts/diagnostics/ally-ability-admission-probe.mjs");
    vi.spyOn(console, "info").mockImplementation(() => {});
    const actorWrites = f.mauro.update.mock.calls.length, flagWrites = f.gm.setFlag.mock.calls.length;
    const probe = installAllyAbilityAdmissionProbe();
    for (const fn of f.hooks.get("ordemparanormal.itemUsed") ?? []) fn({ item: f.projected, message: f.message });
    const report = probe.report(); expect(report).toHaveLength(1);
    expect(report[0].ageMs).toBeGreaterThanOrEqual(0);
    expect(report[0].legacyUptimeAgeMs).toBeLessThan(-1_000_000_000_000);
    expect(f.message.update).not.toHaveBeenCalled(); expect(f.message.setFlag).not.toHaveBeenCalled();
    expect(f.mauro.update).toHaveBeenCalledTimes(actorWrites); expect(f.gm.setFlag).toHaveBeenCalledTimes(flagWrites);
    expect(f.rolls).toHaveLength(0); probe.stop(); expect(Hooks.off).toHaveBeenCalledTimes(4);
  });
  it("admits the authentic author without spending/rolling and claims authorship only afterwards", async () => {
    const f = await ready(); const before = Date.now();
    expect(game.time!.serverTime).toBe(60_000);
    expect(f.message.author.id).toBe("player");
    const prepared = await f.prepare();
    expect(prepared.status).toBe("prepared");
    expect(f.ledger().receipts[0].preparedAt).toBeGreaterThanOrEqual(before);
    expect(f.message.author.id).toBe("gm");
    expect(f.mauro.system.PE.value).toBe(20); expect(f.rolls).toHaveLength(0);
    await f.use.handle("mauro", { id: "prepare-002", action: "prepare", messageId: f.message.id, itemId: f.projected.id }, "player");
    expect(f.ledger().receipts).toHaveLength(1);
  });
  it.each([
    ["message-not-found", (f: any) => f.messages.splice(0, 1)],
    ["author-mismatch", async (f: any) => f.message.update({ author: "ally-player" })],
    ["existing-receipt", async (f: any) => f.message.setFlag(scope, "allyExecutionReceipt", { forged: true })],
    ["existing-binding", async (f: any) => f.message.setFlag(scope, "allyExecutionBinding", { forged: true })],
  ])("diagnoses %s without transferring author or starting mechanics", async (code, mutate) => {
    const f = await ready(); await (mutate as (fixture: any) => unknown)(f);
    const writes = f.message.update.mock.calls.length;
    let failure: unknown;
    try { await f.prepare(); } catch (error) { failure = error; }
    expect(failure).toBeInstanceOf(AllyMessageAdmissionError);
    expect((failure as AllyMessageAdmissionError).diagnosis.failures).toContain(code);
    expect(f.message.update).toHaveBeenCalledTimes(writes);
    expect(f.ledger().receipts).toHaveLength(0);
    expect(f.mauro.system.PE.value).toBe(20); expect(f.rolls).toHaveLength(0);
  });
  it.each([-86_400_000, -120_001, -1, 0, 120_000, 120_001, 86_400_000])(
    "admits a message when the executor clock differs by %s ms and timestamps the receipt locally", async offset => {
      const f = await ready(); const now = Date.now() + offset;
      vi.spyOn(Date, "now").mockReturnValue(now);
      expect(diagnoseAllyMessageAdmission(f.message, "player").failures).toEqual([]);
      expect((await f.prepare()).status).toBe("prepared");
      expect(f.ledger().receipts[0].preparedAt).toBe(now);
      expect(f.message.author.id).toBe("gm");
      expect(f.mauro.system.PE.value).toBe(20); expect(f.rolls).toHaveLength(0);
    },
  );
  it.each([undefined, {}, { createdTime: undefined }, { createdTime: NaN }, { createdTime: Infinity }, { createdTime: "invalid" }])(
    "admits an authentic message without usable creation stats (%j)", async stats => {
      const f = await ready(); f.message._stats = stats;
      expect((await f.prepare()).status).toBe("prepared");
      expect(f.ledger().receipts).toHaveLength(1);
      expect(f.mauro.system.PE.value).toBe(20); expect(f.rolls).toHaveLength(0);
    },
  );
  it.each(["replace", "keep"])("never readmits or reexecutes a claimed or consumed future message (%s)", async mode => {
    const f = await ready(); f.settings["itemUse.systemCardMode"] = mode;
    f.message._stats.createdTime = Date.now() + 86_400_000;
    const [first, duplicate] = await Promise.all([f.prepare(), f.prepare()]);
    expect(duplicate.sequence).toBe(first.sequence);
    expect(f.ledger().receipts).toHaveLength(1);
    expect(f.message.author.id).toBe("gm");
    const request = { id: "execute-001", action: "execute" as const, messageId: f.message.id, sequence: first.sequence,
      options: { spendResource: true, selectedNexThresholds: {} } };
    await Promise.all([f.use.handle("mauro", request, "player"), f.use.handle("mauro", request, "player")]);
    expect(f.ledger().receipts).toHaveLength(0);
    const nextSequence = f.ledger().nextExecutionSequence;
    vi.spyOn(Date, "now").mockReturnValue(f.message._stats.createdTime + 86_400_000);
    await f.prepare(); await f.use.handle("mauro", request, "player");
    expect(f.ledger().nextExecutionSequence).toBe(nextSequence);
    expect(f.ledger().receipts).toHaveLength(0);
    expect(f.rolls).toHaveLength(1); expect(f.mauro.system.PE.value).toBe(18);
    expect(f.messages).toHaveLength(mode === "keep" ? 2 : 1);
    expect(f.message.canUserModify(f.player, "update")).toBe(false);
  });
  it("still expires a preparation after fifteen minutes without readmitting its old original message", async () => {
    const f = await ready(); f.message._stats.createdTime = Date.now() - 86_400_000;
    const prepared = await f.prepare(); const preparedAt = f.ledger().receipts[0].preparedAt;
    vi.spyOn(Date, "now").mockReturnValue(preparedAt + 900_001);
    await f.use.handle("mauro", { id: "execute-expired", action: "execute", messageId: f.message.id, sequence: prepared.sequence,
      options: { spendResource: true, selectedNexThresholds: {} } }, "player");
    expect(f.message.getFlag(scope, "allyExecutionReceipt").status).toBe("cancelled");
    await f.prepare();
    expect(f.ledger().nextExecutionSequence).toBe(prepared.sequence + 1);
    expect(f.ledger().receipts).toHaveLength(0);
    expect(f.mauro.system.PE.value).toBe(20); expect(f.rolls).toHaveLength(0);
  });
  it.each([false, true])("opens the existing dialog on the clicking player once for two listeners (confirm=%s)", async confirm => {
    const f = await ready();
    const { AbilityUseApplication } = await import("../../../../src/applications/ability-use-application");
    const { AbilityUseIntegration } = await import("../../../../src/features/abilities/ability-use-integration");
    const { ItemUseIntegration } = await import("../../../../src/features/item-use/item-use-integration");
    const dialog = vi.spyOn(AbilityUseApplication, "request").mockImplementation(async () => {
      expect(game.user!.id).toBe("player");
      expect(f.mauro.system.PE.value).toBe(20); expect(f.rolls).toHaveLength(0);
      return confirm ? { spendResource: true, selectedNexThresholds: {} } : null;
    });
    const requests = new FoundryAllyAbilityRequests();
    const send = vi.spyOn(requests, "send").mockImplementation(async (actorId, request) => {
      const clicking = game.user!; game.user = f.gm;
      try { return await f.use.handle(actorId, { ...request, id: `request-${request.action}` }, clicking.id) as any; }
      finally { game.user = clicking; }
    });
    game.user = f.player;
    const context: any = { item: f.projected, actor: f.mauro, message: f.message, targets: [], source: "ordem-item-used-hook" };
    const generic: any = new AbilityUseIntegration({} as any, {} as any, {} as any, requests.gateway);
    const structured = new ItemUseIntegration({} as any, {} as any, {} as any, {} as any, {} as any, {} as any, {} as any, requests.gateway);
    await Promise.all([generic.handleItemUsed(context), structured.handleItemUsed(context)]);
    expect(dialog).toHaveBeenCalledOnce(); expect(send).toHaveBeenCalledTimes(2);
    expect(f.rolls).toHaveLength(confirm ? 1 : 0);
    expect(f.mauro.system.PE.value).toBe(confirm ? 18 : 20);
    expect(f.message.getFlag(scope, "allyExecutionReceipt").status).toBe(confirm ? "completed" : "cancelled");
  });
});
