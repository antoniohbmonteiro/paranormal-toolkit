import { describe, expect, it, vi } from "vitest";
import { grantWorld, scope } from "../../../helpers/ally-grant-world";
import { buildDefenseTemplate } from "../../../../src/adapters/ordem/ordem-ally-effect-presets";
import { ALLY_RECEIPT_FLAG, isAllyExecutionReceipt } from "../../../../src/features/allies/ally-execution-receipts";
import { readProtectedAllyReceipt } from "../../../../src/adapters/foundry/foundry-ally-receipt-adapter";
import { readAllyLedger } from "../../../../src/adapters/foundry/foundry-ally-store";
import { classifyAllyUse, readAllyUseRequest, FoundryAllyAbilityRequests } from "../../../../src/adapters/foundry/foundry-ally-ability-request-adapter";
import { AllyItemUseGateway, resolveGrantedItemEngine } from "../../../../src/features/item-use/item-use-route";

const rollConfig = (intent = "generic") => ({ schemaVersion: 1, rolls: [{ id: "roll", label: "Resultado", intent, damageType: intent === "damage" ? "impact" : null, formula: { mode: "fixed", formula: "1d6+@NEX.value" } }] });
async function ready(data: any = {}) {
  const f = await grantWorld(); const source = f.addAbility(data); await f.support.reconcile();
  const grant = f.ledger().managedGrants[0]; const projected = f.mauro.items.get(grant.itemId);
  const message = f.message("native-message-1");
  const prepare = () => f.use.handle("mauro", { id: "request-1", action: "prepare", itemId: projected.id, messageId: message.id, targets: [] }, "player") as Promise<any>;
  return { ...f, source, projected, grant, originalMessage: message, prepare };
}
describe("managed Item grants and protected routing", () => {
  it("publishes the existing validated anchor and routing index to a newly added GM", async () => {
    const f = await ready(); const flags: any = {};
    const gm2 = { id: "gm2", isGM: true, active: true, getFlag: (s: string, k: string) => flags[s]?.[k],
      setFlag: vi.fn(async (s: string, k: string, value: unknown) => { (flags[s] ??= {})[k] = structuredClone(value); }) };
    game.users.push(gm2); await f.support.reconcile();
    expect(gm2.getFlag(scope, "allyStore")).toBe("JournalEntry.ledger");
    expect(gm2.getFlag(scope, "allyGrantRouteIndex").entries).toEqual(f.gm.getFlag(scope, "allyGrantRouteIndex").entries);
    expect(f.mauro.items.contents).toHaveLength(1);
  });
  it("preserves untracked embedded effects and blocks use instead of adopting an ID collision", async () => {
    const f = await ready();
    const extra = { ...buildDefenseTemplate("External", 3), _id: "external", transfer: true, disabled: false };
    await f.projected.createEmbeddedDocuments("ActiveEffect", [extra]);
    await expect(f.prepare()).rejects.toThrow("não gerenciados");
    await f.source.createEmbeddedDocuments("ActiveEffect", [{ ...extra, name: "Canonical", system: buildDefenseTemplate("Canonical", 5).system }]);
    await f.support.reconcile();
    expect(f.projected.effects.get("external").name).toBe("External");
    expect(f.ledger().diagnostic).toContain("não gerenciado");
    expect(f.ledger().managedGrants[0].effectIds).toEqual([]);
  });
  it("keeps native nontransferable, disabled and timed effects stable across reconciliation", async () => {
    const f = await ready({ effects: [{ ...buildDefenseTemplate("Timed", 2), _id: "timed", transfer: false, disabled: true,
      duration: { value: 3, units: "rounds", expiry: "turnEnd" } }] });
    const effect = f.projected.effects.get("timed");
    await effect.update({ "duration.startRound": 7 });
    for (let i = 0; i < 4; i++) await f.support.reconcile();
    expect(effect.disabled).toBe(true); expect(effect.transfer).toBe(false);
    expect(effect.toObject().duration).toMatchObject({ value: 3, units: "rounds", startRound: 7 });
    expect(f.projected.update).not.toHaveBeenCalled();
  });
  it("recovers a creation whose server write succeeded but response failed, keeping the reserved identity", async () => {
    const f = await grantWorld(); f.addAbility();
    const original = f.mauro.createEmbeddedDocuments.getMockImplementation()!;
    f.mauro.createEmbeddedDocuments.mockImplementationOnce(async (...args: any[]) => { await original(...args); throw new Error("lost response"); });
    await f.support.reconcile();
    const id = f.ledger().managedGrants[0].itemId;
    expect(f.ledger().managedGrants[0].provisioned).toBe(false); expect(f.mauro.items.contents).toHaveLength(1);
    await f.support.reconcile();
    expect(f.mauro.items.contents).toHaveLength(1); expect(f.ledger().managedGrants[0].itemId).toBe(id);
    expect(f.ledger().managedGrants[0].provisioned).toBe(true);
  });
  it("does not adopt or delete an ordinary Item occupying a reserved identity", async () => {
    const f = await ready(); const ledger = f.ledger(); ledger.managedGrants[0].provisioned = false; f.setLedger(ledger);
    await f.projected.update({ [`flags.${scope}.allyGrantedAbility`]: undefined, _stats: { lastModifiedBy: "player" } });
    const before = f.projected.toObject();
    await f.support.reconcile(); expect(f.projected.toObject()).toEqual(before);
    expect(f.ledger().diagnostic).toContain("não confirmado");
    await f.iris.deleteEmbeddedDocuments("Item", [f.source.id]); await f.support.reconcile();
    expect(f.mauro.items.get(f.projected.id)).toBeDefined();
  });
  it.each(["default", "passive", ""])("grants every native ability activation=%s without executing it", async activation => {
    const f = await ready({ system: { activation, cost: 2 } });
    expect(f.projected.system.activation).toBe(activation); expect(f.rolls).toHaveLength(0);
    expect(f.projected.getFlag(scope, "allyGrantedAbility")).toMatchObject({ allyId: "iris", sourceItemId: f.source.id });
    expect(f.gm.setFlag.mock.invocationCallOrder[0]).toBeLessThan(f.mauro.createEmbeddedDocuments.mock.invocationCallOrder[0]);
    expect(f.mauro.system.PE.value).toBe(20);
  });
  it("does not copy allyPassive and preserves known native non-support effects", async () => {
    const passive = { ...buildDefenseTemplate("Passivo", 5), _id: "passive", transfer: false, disabled: false, flags: { [scope]: { allyPassive: { version: 1 } } } };
    const native = { ...buildDefenseTemplate("Nativo", 7), _id: "native", transfer: true, disabled: false };
    const f = await ready({ effects: [passive, native] });
    expect(f.projected.effects.contents.map((e: any) => e.id)).toEqual(["native"]);
    expect(f.projected.effects.get("native").transfer).toBe(true);
    const before = f.source.toObject();
    const writes = f.mauro.createEmbeddedDocuments.mock.calls.length;
    for (let i = 0; i < 5; i++) await f.support.reconcile();
    expect(f.mauro.createEmbeddedDocuments).toHaveBeenCalledTimes(writes); expect(f.projected.update).not.toHaveBeenCalled();
    expect(f.source.toObject()).toEqual(before);
    await f.source.effects.get("native").update({ disabled: true }); await f.support.reconcile();
    expect(f.projected.effects.get("native").disabled).toBe(true);
    expect(f.projected.id).toBe(f.grant.itemId);
  });
  it("preserves but refuses unknown effects without applying a partial native effect set", async () => {
    const known = { ...buildDefenseTemplate("Known", 5), _id: "known", transfer: true, disabled: false };
    const unknown = { ...buildDefenseTemplate("Unknown", 7), _id: "unknown", transfer: true, disabled: false, flags: { itemMacro: { script: "unknown" } } };
    const f = await ready({ effects: [known, unknown] }); const before = f.source.toObject();
    expect(f.projected.effects.contents).toHaveLength(0); expect(f.grant.diagnostic).toContain("não compatível");
    await expect(f.prepare()).rejects.toThrow("não compatível"); expect(f.source.toObject()).toEqual(before);
    await f.source.deleteEmbeddedDocuments("ActiveEffect", ["unknown"]); await f.support.reconcile();
    expect(f.projected.effects.get("known").transfer).toBe(true); expect(f.ledger().managedGrants[0].diagnostic).toBeNull();
  });
  it("synchronizes renaming and flags with a stable Item ID, preserving normal homonymous Items", async () => {
    const f = await ready();
    await f.mauro.createEmbeddedDocuments("Item", [{ _id: "ordinary", name: f.source.name }]);
    await f.source.update({ name: "Nova habilidade", [`flags.${scope}.abilityRollConfig`]: rollConfig() });
    await f.support.reconcile();
    expect(f.projected.name).toBe("Nova habilidade"); expect(f.projected.id).toBe(f.grant.itemId);
    expect(f.projected.getFlag(scope, "abilityRollConfig")).toEqual(rollConfig());
    await f.support.process("iris", { id: "deactivate-1", revision: f.ledger().revision, action: "deactivate" }, "ally-player");
    expect(f.mauro.items.get("ordinary")).toBeDefined(); expect(f.mauro.items.get(f.grant.itemId)).toBeUndefined();
  });
  it("restores player deletions, persists GM suppression, and clears it only on real activation", async () => {
    const f = await ready();
    await f.mauro.deleteEmbeddedDocuments("Item", [f.projected.id]); await f.support.suppressGrant("mauro", f.projected.id, "player");
    expect(f.mauro.items.get(f.projected.id)).toBeDefined();
    await f.mauro.deleteEmbeddedDocuments("Item", [f.projected.id]); await f.support.suppressGrant("mauro", f.projected.id, "gm");
    for (let i = 0; i < 3; i++) await f.support.reconcile();
    await f.support.process("iris", { id: "same-target-1", action: "assign", beneficiaryId: "mauro", revision: f.ledger().revision }, "ally-player");
    expect(f.mauro.items.contents).toHaveLength(0); expect(f.source).toBeDefined();
    await f.support.process("iris", { id: "deactivate-1", action: "deactivate", revision: f.ledger().revision }, "gm");
    await f.support.process("iris", { id: "activate-1", action: "activate", revision: f.ledger().revision }, "gm");
    expect(f.mauro.items.contents).toHaveLength(1);
  });
  it("withdraws immediately on combat switching and grants only at the next round", async () => {
    const f = await ready(); let round = 1;
    f.environment.resolveCombat = () => ({ id: "combat", started: true, round });
    f.environment.combat = () => ({ id: "combat", started: true, round });
    await f.support.process("iris", { id: "switch-target", action: "assign", beneficiaryId: "rafa", revision: f.ledger().revision }, "gm");
    expect(f.mauro.items.contents).toHaveLength(0); expect(f.rafa.items.contents).toHaveLength(0);
    await f.support.reconcile(); expect(f.rafa.items.contents).toHaveLength(0);
    round = 2; await f.support.reconcile(); expect(f.rafa.items.contents).toHaveLength(1);
  });
  it("cleans deleted source/Ally grants without touching other Items", async () => {
    const f = await ready(); f.addAbility({ name: f.source.name }); await f.support.reconcile();
    expect(f.mauro.items.contents).toHaveLength(2);
    await f.iris.deleteEmbeddedDocuments("Item", [f.source.id]); await f.support.reconcile(); expect(f.mauro.items.contents).toHaveLength(1);
    (game.actors.contents as any[]).splice(0, 1); await f.support.reconcile(); expect(f.mauro.items.contents).toHaveLength(0);
  });
  it("recognizes a flag-stripped grant by protected index and blocks a copied marker", async () => {
    const f = await ready(); await f.projected.update({ [`flags.${scope}.allyGrantedAbility`]: undefined });
    expect(classifyAllyUse({ item: f.projected, actor: f.mauro } as any)).toBe("managed");
    expect(classifyAllyUse({ item: f.source, actor: f.iris } as any)).toBe("ordinary");
    const fake = { type: "ability", id: "fake", getFlag: () => ({ grantId: f.grant.grantId }) };
    expect(classifyAllyUse({ item: fake, actor: f.mauro } as any)).toBe("blocked");
    await f.gm.setFlag(scope, "allyGrantRouteIndex", undefined);
    expect(classifyAllyUse({ item: f.projected, actor: f.mauro } as any)).toBe("blocked");
  });
  it("claims the same native hook synchronously once for both integrations", async () => {
    const submit = vi.fn(async () => {}), report = vi.fn();
    const gateway = new AllyItemUseGateway(() => "managed", submit, report);
    const context: any = { message: { id: "native" } };
    expect(await Promise.all([gateway.intercept(context), gateway.intercept(context)])).toEqual([true, true]);
    expect(submit).toHaveBeenCalledOnce();
  });
  it("consumes incidental hooks for preparation/result messages without opening another intention", async () => {
    const f = await ready(); await f.prepare();
    const requests = new FoundryAllyAbilityRequests(); const send = vi.spyOn(requests, "send");
    const context: any = { item: f.projected, actor: f.mauro, message: f.originalMessage, targets: [] };
    await requests.gateway.intercept(context);
    const result = f.message("internal-result", f.gm);
    await result.setFlag(scope, ALLY_RECEIPT_FLAG, f.originalMessage.getFlag(scope, ALLY_RECEIPT_FLAG));
    await requests.gateway.intercept({ ...context, message: result });
    expect(send).not.toHaveBeenCalled(); expect(f.ledger().receipts).toHaveLength(1);
  });
  it("reads full and differential requests with native identity and ignores ordinary updates", async () => {
    const f = await ready();
    const request = { id: "request-001", action: "prepare", messageId: "m", itemId: f.projected.id, targets: [] };
    await f.mauro.setFlag(scope, "allyAbilityRequest", request);
    expect(readAllyUseRequest(f.mauro, { flags: { [scope]: { allyAbilityRequest: request } } }, "player")).toEqual(request);
    expect(readAllyUseRequest(f.mauro, { [`flags.${scope}.allyAbilityRequest.id`]: request.id }, "player")).toEqual(request);
    expect(readAllyUseRequest(f.mauro, { name: "Mauro" }, "player")).toBeUndefined();
    f.mauro._stats = { lastModifiedBy: "gm" };
    expect(() => readAllyUseRequest(f.mauro, { [`flags.${scope}.allyAbilityRequest.id`]: request.id }, "player")).toThrow("inválida");
  });
});

describe("authorized use, checkpoints and bounded durable receipts", () => {
  it("preserves uncertainty after an interrupted roll instead of re-evaluating on recovery", async () => {
    const f = await ready({ flags: { [scope]: { abilityRollConfig: rollConfig() } } }); const prepared = await f.prepare();
    const evaluate = vi.spyOn(Roll.prototype, "evaluate").mockRejectedValueOnce(new Error("roll connection lost"));
    const request: any = { id: "execute-001", action: "execute", messageId: f.originalMessage.id, sequence: prepared.sequence,
      options: { spendResource: true, selectedNexThresholds: {} } };
    await f.use.handle("mauro", request, "player"); await f.makeUseService().handle("mauro", request, "player");
    expect(evaluate).toHaveBeenCalledOnce(); expect(f.mauro.system.PE.value).toBe(18);
    expect(f.originalMessage.getFlag(scope, ALLY_RECEIPT_FLAG).status).toBe("uncertain");
  });
  it("recovers a publication whose write succeeded before its response was lost", async () => {
    const f = await ready({ flags: { [scope]: { abilityRollConfig: rollConfig() } } }); const prepared = await f.prepare();
    const update = f.originalMessage.update.getMockImplementation()!;
    f.originalMessage.update.mockImplementationOnce(async changes => { await update(changes); throw new Error("publication response lost"); });
    const request: any = { id: "execute-001", action: "execute", messageId: f.originalMessage.id, sequence: prepared.sequence,
      options: { spendResource: true, selectedNexThresholds: {} } };
    await expect(f.use.handle("mauro", request, "player")).rejects.toThrow("publication response lost");
    await f.makeUseService().recoverPending();
    expect(f.ledger().receipts).toHaveLength(0); expect(f.messages).toHaveLength(1);
    expect(f.rolls).toHaveLength(1); expect(f.mauro.system.PE.value).toBe(18);
  });
  it.each([1, 2, 3, 4, 5, 6, 7, 8])("never repeats spending or rolls after persistence failure #%s", async failAt => {
    const f = await ready({ flags: { [scope]: { abilityRollConfig: rollConfig() } } });
    const prepared = await f.prepare();
    const save = f.store.save.getMockImplementation()!;
    let writes = 0;
    f.store.save.mockImplementation(async next => { if (++writes === failAt) throw new Error("lost persistence"); await save(next); });
    const request: any = { id: "execute-001", action: "execute", messageId: f.originalMessage.id, sequence: prepared.sequence,
      options: { spendResource: true, selectedNexThresholds: {} } };
    await f.use.handle("mauro", request, "player").catch(() => undefined);
    const remaining = f.mauro.system.PE.value, rolled = f.rolls.length;
    expect(remaining).toBeGreaterThanOrEqual(18); expect(rolled).toBeLessThanOrEqual(1);
    const recovered = f.makeUseService(); await recovered.recoverPending();
    await recovered.handle("mauro", request, "player");
    expect(f.mauro.system.PE.value).toBe(remaining); expect(f.rolls).toHaveLength(rolled);
    expect(f.ledger().receipts).toHaveLength(0);
  });
  it("records a known insufficient balance without rolling or treating it as an uncertain write", async () => {
    const f = await ready({ flags: { [scope]: { abilityRollConfig: rollConfig() } } });
    const prepared = await f.prepare(); await f.mauro.update({ "system.PE.value": 1 });
    await f.use.handle("mauro", { id: "execute-001", action: "execute", messageId: f.originalMessage.id, sequence: prepared.sequence,
      options: { spendResource: true, selectedNexThresholds: {} } }, "player");
    expect(f.originalMessage.getFlag(scope, ALLY_RECEIPT_FLAG).status).toBe("failed");
    expect(f.rolls).toHaveLength(0); expect(f.mauro.system.PE.value).toBe(1);
  });
  it("does not refund or retry an ambiguous resource write", async () => {
    const f = await ready(); const prepared = await f.prepare();
    const update = f.mauro.update.getMockImplementation()!;
    f.mauro.update.mockImplementationOnce(async changes => { await update(changes); throw new Error("lost response"); });
    const request: any = { id: "execute-001", action: "execute", messageId: f.originalMessage.id, sequence: prepared.sequence,
      options: { spendResource: true, selectedNexThresholds: {} } };
    await f.use.handle("mauro", request, "player");
    expect(f.originalMessage.getFlag(scope, ALLY_RECEIPT_FLAG).status).toBe("uncertain");
    await f.makeUseService().handle("mauro", request, "player");
    expect(f.mauro.system.PE.value).toBe(18); expect(f.mauro.update).toHaveBeenCalledTimes(1);
  });
  it("requires the elected GM and marks abandoned actions uncertain when another GM takes over", async () => {
    const f = await ready({ flags: { [scope]: { abilityRollConfig: rollConfig("healing") } } });
    const prepared: any = await f.use.handle("mauro", { id: "prepare-001", action: "prepare", itemId: f.projected.id, messageId: f.originalMessage.id,
      targets: [{ id: "actor:Actor.rafa", actorId: "rafa", actorUuid: "Actor.rafa", tokenId: null, tokenUuid: null, sceneId: null, name: "Rafa" }] }, "player");
    await f.use.handle("mauro", { id: "execute-001", action: "execute", messageId: f.originalMessage.id, sequence: prepared.sequence,
      options: { spendResource: true, selectedNexThresholds: {} } }, "player");
    const receipt = structuredClone(f.originalMessage.getFlag(scope, ALLY_RECEIPT_FLAG));
    receipt.card.actions[0].state = "executing";
    await f.originalMessage.update({ [`flags.${scope}.${ALLY_RECEIPT_FLAG}`]: receipt });
    f.gm.active = false;
    await expect(f.makeUseService().recoverPending()).rejects.toThrow();
    const gm2 = { ...f.gm, id: "gm2", active: true }; game.users.push(gm2); game.user = gm2;
    await f.makeUseService().recoverPending();
    expect(f.originalMessage.getFlag(scope, ALLY_RECEIPT_FLAG).card.actions[0].state).toBe("uncertain");
    await expect(f.makeUseService().handle("mauro", { id: "apply-001", action: "apply", messageId: f.originalMessage.id,
      actionId: receipt.card.actions[0].id, sequence: receipt.sequence }, "gm2")).rejects.toThrow("incerta");
    expect(f.rolls).toHaveLength(1);
  });
  it("refuses forged player-owned card receipts and malformed states", async () => {
    const f = await ready(); await f.prepare();
    const receipt = structuredClone(f.originalMessage.getFlag(scope, ALLY_RECEIPT_FLAG));
    const fake = f.message("fake-message"); receipt.messageId = fake.id; receipt.resultMessageId = fake.id;
    await fake.update({ [`flags.${scope}.${ALLY_RECEIPT_FLAG}`]: receipt });
    expect(readProtectedAllyReceipt(fake, f.ledger().ledgerInstanceId)).toBeNull();
    expect(isAllyExecutionReceipt({ ...receipt, status: "retry" })).toBe(false);
    expect(isAllyExecutionReceipt({ ...receipt, sequence: -1 })).toBe(false);
    expect(isAllyExecutionReceipt({ ...receipt, targets: [f.mauro] })).toBe(false);
  });
  it("fences an old execution after another operational generation has been persisted", async () => {
    const f = await ready(); const prepared = await f.prepare();
    const update = f.mauro.update.getMockImplementation()!;
    f.mauro.update.mockImplementationOnce(async changes => {
      await update(changes);
      const ledger = f.ledger(); ledger.executionGeneration = "new-executor-generation";
      f.setLedger(ledger);
    });
    const request: any = { id: "execute-001", action: "execute", messageId: f.originalMessage.id, sequence: prepared.sequence,
      options: { spendResource: true, selectedNexThresholds: {} } };
    await expect(f.use.handle("mauro", request, "player")).rejects.toThrow("geração operacional");
    expect(f.ledger().executionGeneration).toBe("new-executor-generation");
    const recovered = f.makeUseService(); await recovered.recoverPending();
    await recovered.handle("mauro", request, "player");
    expect(f.originalMessage.getFlag(scope, ALLY_RECEIPT_FLAG).status).toBe("uncertain");
    expect(f.mauro.system.PE.value).toBe(18); expect(f.rolls).toHaveLength(0);
  });
  it("does not invalidate the support revision displayed to the owner when receipts advance", async () => {
    const f = await ready(); const revision = f.ledger().revision;
    const prepared = await f.prepare();
    await f.use.handle("mauro", { id: "execute-001", action: "execute", messageId: f.originalMessage.id, sequence: prepared.sequence,
      options: { spendResource: false, selectedNexThresholds: {} } }, "player");
    expect(f.ledger().revision).toBe(revision);
    await f.support.process("iris", { id: "deactivate-001", action: "deactivate", revision }, "ally-player");
    expect(f.ledger().links[0].state.status).toBe("inactive");
    expect(f.mauro.items.get(f.projected.id)).toBeUndefined();
  });
  it("uses the existing automation confirmation and permits only the GM to confirm once", async () => {
    const f = await ready({ flags: { [scope]: { automation: { schemaVersion: 1, source: { type: "manual", label: "Teste", appliedAt: "now" },
      definition: { version: 1, label: "Teste", steps: [{ type: "spendResource", actor: "self", resource: "PE", amount: 1 }] } } } } });
    f.settings["itemUse.executionMode"] = "ask";
    const prepared = await f.prepare(); expect(prepared.mode).toBe("ask");
    expect(f.mauro.system.PE.value).toBe(20);
    const request: any = { id: "execute-001", action: "execute", messageId: f.originalMessage.id, sequence: prepared.sequence };
    await expect(f.use.handle("mauro", request, "player")).rejects.toThrow("GM");
    await f.use.handle("mauro", request, "gm"); await f.use.handle("mauro", request, "gm");
    expect(f.mauro.system.PE.value).toBe(19); expect(f.rolls).toHaveLength(0);
  });
  it("persists a selected NEX branch and uses original targets for manual healing after support is removed", async () => {
    const config = rollConfig("healing"); (config.rolls[0].formula as any) = { mode: "nex", resolution: "choose-unlocked", steps: [{ minNex: 10, formula: "1d6" }, { minNex: 40, formula: "2d6" }] };
    const f = await ready({ flags: { [scope]: { abilityRollConfig: config } } });
    const prepared: any = await f.use.handle("mauro", { id: "prepare-001", action: "prepare", itemId: f.projected.id, messageId: f.originalMessage.id,
      targets: [{ id: "actor:Actor.rafa", actorId: "rafa", actorUuid: "Actor.rafa", tokenId: null, tokenUuid: null, sceneId: null, name: "Rafa" }] }, "player");
    await f.use.handle("mauro", { id: "execute-001", action: "execute", messageId: f.originalMessage.id, sequence: prepared.sequence,
      options: { spendResource: true, selectedNexThresholds: { roll: 10 } } }, "player");
    expect(f.rolls[0].formula).toBe("1d6");
    await f.support.process("iris", { id: "deactivate-01", action: "deactivate", revision: f.ledger().revision }, "gm");
    const receipt = f.originalMessage.getFlag(scope, ALLY_RECEIPT_FLAG);
    const actionId = receipt.card.actions[0].id;
    const apply: any = { id: "apply-001", action: "apply", actionId, messageId: f.originalMessage.id, sequence: receipt.sequence };
    await expect(f.use.handle("mauro", apply, "player")).rejects.toThrow("GM");
    await f.use.handle("mauro", apply, "gm");
    expect(f.rafa.system.PV.value).toBe(16); expect(f.mauro.system.PV.value).toBe(10); expect(f.rolls).toHaveLength(1);
    await expect(f.use.handle("mauro", apply, "gm")).rejects.toThrow("já executada");
  });
  it("keeps separate result cards protected and reuses their reserved message identity on recovery", async () => {
    const f = await ready(); f.settings["itemUse.systemCardMode"] = "keep";
    const prepared = await f.prepare();
    await f.use.handle("mauro", { id: "execute-001", action: "execute", messageId: f.originalMessage.id, sequence: prepared.sequence,
      options: { spendResource: true, selectedNexThresholds: {} } }, "player");
    expect(f.messages).toHaveLength(2); expect(f.messages.every(message => message.author.id === "gm")).toBe(true);
    expect(f.ledger().receipts).toHaveLength(0);
    await f.prepare(); expect(f.messages).toHaveLength(2); expect(f.mauro.system.PE.value).toBe(18);
  });
  it("expires prepared receipts on reload and preserves historical action uncertainty across GM takeover", async () => {
    const f = await ready(); await f.prepare();
    await f.makeUseService().recoverPending();
    expect(f.originalMessage.getFlag(scope, ALLY_RECEIPT_FLAG).status).toBe("cancelled");
    expect(f.rolls).toHaveLength(0); expect(f.mauro.system.PE.value).toBe(20);
  });
  it("rejects messages older than admission window and refuses to discard 256 unpublished receipts", async () => {
    const f = await ready(); f.originalMessage._stats.createdTime -= 120_001;
    await expect(f.prepare()).rejects.toThrow("antiga");
    f.originalMessage._stats.createdTime = Date.now();
    await f.prepare(); const ledger = f.ledger(); const base = ledger.receipts[0];
    ledger.receipts = Array.from({ length: 256 }, (_, i) => ({ ...structuredClone(base), sequence: i + 1, messageId: `missing-${i}`, status: "uncertain" as const }));
    ledger.nextExecutionSequence = 257; f.setLedger(ledger);
    vi.spyOn(console, "warn").mockImplementation(() => {});
    const fresh = f.message("fresh-native");
    await expect(f.use.handle("mauro", { id: "prepare-002", action: "prepare", itemId: f.projected.id, messageId: fresh.id }, "player")).rejects.toThrow("256");
    expect(f.ledger().receipts).toHaveLength(256);
  });
  it.each([false, true])("spends PE/PD exactly once, evaluates beneficiary data and retires a protected receipt (PD=%s)", async pd => {
    const f = await ready({ flags: { [scope]: { abilityRollConfig: rollConfig() } } }); f.settings.globalPlayingWithoutSanity = pd;
    const prepared = await f.prepare(); const request: any = { id: "execute-001", action: "execute", messageId: f.originalMessage.id, sequence: prepared.sequence,
      options: { spendResource: true, selectedNexThresholds: {} } };
    await f.use.handle("mauro", request, "player"); await f.use.handle("mauro", request, "player");
    expect(f.mauro.system[pd ? "PD" : "PE"].value).toBe(18); expect(f.rolls).toHaveLength(1);
    expect(f.rolls[0].data.NEX.value).toBe(50);
    expect(f.ledger().receipts).toHaveLength(0); expect(f.ledger().retiredExecutionThrough).toBe(prepared.sequence);
    expect(f.originalMessage.author.id).toBe("gm"); expect(f.originalMessage.canUserModify(f.player, "update")).toBe(false);
    expect(f.originalMessage.getFlag(scope, ALLY_RECEIPT_FLAG)).toMatchObject({ status: "completed", requesterId: "player", allyId: "iris" });
    await f.prepare(); expect(f.rolls).toHaveLength(1);
  });
  it("supports zero/manual cost and passive consultation without forced spending", async () => {
    const f = await ready(); const prepared = await f.prepare();
    await f.use.handle("mauro", { id: "execute-001", action: "execute", messageId: f.originalMessage.id, sequence: prepared.sequence,
      options: { spendResource: false, selectedNexThresholds: {} } }, "player");
    expect(f.mauro.system.PE.value).toBe(20);
    expect(f.originalMessage.getFlag(scope, ALLY_RECEIPT_FLAG).card.resource.spent).toBe(false);
  });
  it("gives automation precedence, executes only its configured PE step and preserves native cost", async () => {
    const f = await ready({ system: { activation: "default", cost: 19 }, flags: { [scope]: {
      abilityRollConfig: rollConfig(), automation: { schemaVersion: 1, source: { type: "manual", label: "Teste", appliedAt: "now" },
        definition: { version: 1, label: "Teste", steps: [{ type: "spendResource", actor: "self", resource: "PE", amount: 1 },
          { type: "rollFormula", id: "r", formula: "1d6+@NEX.value" }] } } } } });
    f.settings.globalPlayingWithoutSanity = true;
    const prepared = await f.prepare(); expect(prepared.engine).toBe("automation");
    await f.use.handle("mauro", { id: "execute-001", action: "execute", messageId: f.originalMessage.id, sequence: prepared.sequence }, "player");
    expect(f.mauro.system.PE.value).toBe(19); expect(f.mauro.system.PD.value).toBe(20);
    expect(f.rolls).toHaveLength(1); expect(f.rolls[0].data.NEX.value).toBe(50);
  });
  it("rejects invalid automation without fallback and ritual-only capabilities before spending", async () => {
    const f = await ready({ flags: { [scope]: { automation: { invalid: true }, abilityRollConfig: rollConfig() } } });
    expect(() => resolveGrantedItemEngine(f.source)).toThrow(); await expect(f.prepare()).rejects.toThrow();
    expect(f.mauro.system.PE.value).toBe(20); expect(f.rolls).toHaveLength(0);
  });
  it("refuses owner impersonation, forged identities and stale preparations", async () => {
    const f = await ready(); await expect(f.use.handle("mauro", { id: "prepare-01", action: "prepare", messageId: f.originalMessage.id, itemId: f.projected.id }, "ally-player")).rejects.toThrow("permissão");
    await expect(f.use.handle("mauro", { id: "execute-01", action: "execute", messageId: f.originalMessage.id, sequence: 1 }, "player")).rejects.toThrow("ausente");
    const prepared = await f.prepare(); await f.source.update({ "system.cost": 3 });
    await f.use.handle("mauro", { id: "execute-02", action: "execute", messageId: f.originalMessage.id, sequence: prepared.sequence, options: { spendResource: true, selectedNexThresholds: {} } }, "player");
    expect(f.mauro.system.PE.value).toBe(20); expect(f.originalMessage.getFlag(scope, ALLY_RECEIPT_FLAG).status).toBe("failed");
  });
  it("recovers publication after a confirmed roll without charging or rolling again", async () => {
    const f = await ready({ flags: { [scope]: { abilityRollConfig: rollConfig() } } }); const prepared = await f.prepare();
    const publish = vi.spyOn(f.receiptAdapter, "publish").mockRejectedValueOnce(new Error("connection"));
    await expect(f.use.handle("mauro", { id: "execute-01", action: "execute", messageId: f.originalMessage.id, sequence: prepared.sequence,
      options: { spendResource: true, selectedNexThresholds: {} } }, "player")).rejects.toThrow("connection");
    expect(f.ledger().receipts[0].status).toBe("resolved");
    await f.makeUseService().recoverPending();
    expect(f.ledger().receipts).toHaveLength(0); expect(f.rolls).toHaveLength(1); expect(f.mauro.system.PE.value).toBe(18);
    expect(publish).toHaveBeenCalledTimes(2);
  });
  it("marks interrupted running receipts uncertain and never resumes their engine", async () => {
    const f = await ready(); const prepared = await f.prepare(); const ledger = f.ledger();
    ledger.receipts[0].status = "running"; ledger.receipts[0].checkpoint = "resource:spend"; f.setLedger(ledger);
    await f.makeUseService().recoverPending();
    expect(f.originalMessage.getFlag(scope, ALLY_RECEIPT_FLAG).status).toBe("uncertain");
    await f.use.handle("mauro", { id: "execute-01", action: "execute", messageId: f.originalMessage.id, sequence: prepared.sequence }, "player");
    expect(f.mauro.system.PE.value).toBe(20); expect(f.rolls).toHaveLength(0);
  });
  it("does not readmit old messages after card deletion and compaction", async () => {
    const f = await ready(); const prepared = await f.prepare();
    await f.use.handle("mauro", { id: "cancel-001", action: "cancel", messageId: f.originalMessage.id, sequence: prepared.sequence }, "player");
    f.messages.splice(0, 1);
    await expect(f.prepare()).rejects.toThrow("Mensagem original");
    await expect(f.use.handle("mauro", { id: "execute-01", action: "execute", messageId: f.originalMessage.id, sequence: prepared.sequence }, "player")).rejects.toThrow("ausente");
    expect(f.ledger().nextExecutionSequence).toBe(prepared.sequence + 1);
  });
  it("migrates v3 without losing passives, source orders or suppression and rejects corrupt v4", async () => {
    const f = await ready(); const old: any = { ...f.ledger(), version: 3 };
    old.links[0].suppressedSources = ["passive"];
    const next = readAllyLedger(old, "JournalEntry.ledger");
    expect(next.version).toBe(4); expect(next.ledgerInstanceId).toBe("JournalEntry.ledger");
    expect(next.links[0].suppressedSources).toEqual(["passive"]); expect(next.managedGrants).toEqual([]);
    expect(() => readAllyLedger({ ...next, receipts: [{ sequence: 1 }] })).toThrow("corrompido");
    const current = f.ledger();
    expect(() => readAllyLedger({ ...current, managedGrants: [current.managedGrants[0], { ...current.managedGrants[0], itemId: "another-item" }] })).toThrow("corrompido");
  });
});
