import { beforeEach, describe, expect, it, vi } from "vitest";
import { FoundryAllyStore, readAllyLedger } from "../../../../src/adapters/foundry/foundry-ally-store";
import { FoundryAllyEnvironment, submitAllyRequest } from "../../../../src/adapters/foundry/foundry-ally-request-adapter";
import { buildAllyDefenseEffect, OrdemAllyBenefitAdapter } from "../../../../src/adapters/ordem/ordem-ally-benefit-adapter";
import { createAllyLedger } from "../../../../src/features/allies/ally-support-service";
import { createAllyProfile } from "../../../../src/core/allies/ally-profile";
import { readAllyAbility, writeAllyAbility } from "../../../../src/features/allies/config/ally-ability-config";

function user(id: string, isGM = false, reference: unknown = undefined) {
  return { id, isGM, active: true, getFlag: vi.fn(() => reference), setFlag: vi.fn(async () => {}) };
}
function journal(publicAccess = false) {
  return { uuid: "JournalEntry.ledger", documentName: "JournalEntry",
    testUserPermission: vi.fn(() => publicAccess), getFlag: vi.fn(() => createAllyLedger()), setFlag: vi.fn(async () => {}) };
}
function actor(id: string, type = "agent") {
  return { id, type, name: id, isToken: false, system: type.endsWith(".ally") ? createAllyProfile() : {}, items: [],
    getFlag: vi.fn(), setFlag: vi.fn(async () => {}), canUserModify: vi.fn(() => true),
    createEmbeddedDocuments: vi.fn(async () => []), deleteEmbeddedDocuments: vi.fn(async () => []),
    effects: { get: vi.fn() } };
}
beforeEach(() => {
  vi.stubGlobal("game", { user: user("gm", true), users: [user("gm", true), user("player")], actors: { contents: [], get: vi.fn() },
    system: { version: "8.0.2" }, release: { version: "14.369" } });
  vi.stubGlobal("foundry", { utils: { randomID: () => "stable-id-000" }, data: { operators: { ForcedDeletion: class {} } } });
});
describe("protected store (native document operations doubled)", () => {
  it("ignores player anchors and creates one restricted record, anchoring every GM", async () => {
    const gm1 = user("gm-a", true), gm2 = user("gm-b", true), player = user("player", false, "JournalEntry.forged");
    const record = journal(), create = vi.fn(async () => record);
    vi.stubGlobal("game", { user: gm1, users: [gm1, gm2, player] });
    vi.stubGlobal("foundry", { utils: { randomID: () => "id" }, documents: { JournalEntry: { create } } });
    const store = new FoundryAllyStore();
    expect(await store.load()).toBeNull();
    await store.load(true);
    expect(create).toHaveBeenCalledWith(expect.objectContaining({ ownership: { default: 0 }, pages: [] }));
    expect(gm1.setFlag).toHaveBeenCalledWith("paranormal-toolkit", "allyStore", record.uuid);
    expect(gm2.setFlag).toHaveBeenCalledWith("paranormal-toolkit", "allyStore", record.uuid);
    expect(player.setFlag).not.toHaveBeenCalled();
  });
  it("rejects a public or missing protected reference without replacing it", async () => {
    const gm = user("gm", true, "JournalEntry.ledger");
    vi.stubGlobal("game", { user: gm, users: [gm, user("player")] });
    vi.stubGlobal("fromUuid", vi.fn(async () => journal(true)));
    await expect(new FoundryAllyStore().load()).rejects.toThrow("restrito");
    vi.stubGlobal("fromUuid", vi.fn(async () => null));
    await expect(new FoundryAllyStore().load(true)).rejects.toThrow("não encontrado");
  });
  it("blocks malformed and conflicting GM anchors", async () => {
    const gm = user("gm-a", true, "JournalEntry.one"), other = user("gm-b", true, "JournalEntry.two");
    vi.stubGlobal("game", { user: gm, users: [gm, other] });
    await expect(new FoundryAllyStore().load()).rejects.toThrow("divergem");
    other.getFlag.mockReturnValue(123 as any);
    await expect(new FoundryAllyStore().load()).rejects.toThrow("inválida");
  });
  it("refuses access from players", async () => {
    vi.stubGlobal("game", { user: user("player"), users: [] });
    await expect(new FoundryAllyStore().load(true)).rejects.toThrow("GM");
  });
  it("fails closed for unknown ledger versions and corrupted state", () => {
    expect(readAllyLedger(createAllyLedger())).toEqual(createAllyLedger());
    expect(() => readAllyLedger({ ...createAllyLedger(), version: 3 })).toThrow("corrompido");
    expect(() => readAllyLedger({ ...createAllyLedger(), links: [{ allyId: "a", state: { status: "active" } }] })).toThrow();
    const value = createAllyLedger();
    value.managed.push({ effectId: "effect", actorId: "joao", sourceKey: "s", allyId: "a", value: 5 });
    const read = readAllyLedger(value);
    read.managed[0].value = 10;
    expect(value.managed[0].value).toBe(5);
  });
  it("saves migration in one flag operation, removing the obsolete gate with the v14 operator", async () => {
    const gm = user("gm", true, "JournalEntry.ledger"), record = journal();
    const old = { ...createAllyLedger(), version: 1, validatedRuntime: null };
    record.getFlag.mockReturnValue(old as any);
    vi.stubGlobal("game", { user: gm, users: [gm, user("player")] });
    vi.stubGlobal("fromUuid", vi.fn(async () => record));
    const store = new FoundryAllyStore(); const migrated = await store.load();
    await store.save(migrated!);
    expect(record.setFlag).toHaveBeenCalledTimes(1);
    expect(record.setFlag).toHaveBeenCalledWith("paranormal-toolkit", "allyLedger",
      { ...createAllyLedger(), validatedRuntime: expect.any(foundry.data.operators.ForcedDeletion) });
  });
});
describe("request and Ordem adapters", () => {
  it("reads a GM view from the protected ledger instead of a forged actor presentation", async () => {
    const gm = user("gm", true, "JournalEntry.ledger");
    const record = journal(), ally = actor("iris", "paranormal-toolkit.ally");
    ally.getFlag.mockReturnValue({ status: "active", beneficiaryId: "forged", revision: 99 } as any);
    vi.stubGlobal("game", { user: gm, users: [gm, user("player")], actors: { get: () => ally }, system: { version: "8.0.2" }, release: { version: "14.369" } });
    vi.stubGlobal("fromUuid", vi.fn(async () => record));
    const { readAllySupportView } = await import("../../../../src/adapters/foundry/foundry-ally-request-adapter");
    expect(await readAllySupportView(ally as any)).toMatchObject({ revision: 0, beneficiaryId: null, status: "inactive" });
  });
  it("submits current support operations without an approval scope or review dialog", async () => {
    const gm = user("gm", true, "JournalEntry.ledger");
    const record = journal(), ally = actor("iris", "paranormal-toolkit.ally"), joao = actor("joao");
    const definition = { version: 1, benefits: [{ id: "d", kind: "defense", value: 5 }] };
    (ally as any).items = [{ id: "item", name: "Defense", type: "ability", getFlag: () => definition }];
    const ledger = createAllyLedger();
    ledger.revision = 7;
    ledger.links.push({ allyId: "iris", state: { beneficiaryId: "joao", status: "inactive", sequence: 0, wait: null },
      suppressedSources: [], notice: null, diagnostic: null });
    record.getFlag.mockReturnValue(ledger);
    vi.stubGlobal("game", { user: gm, users: [gm, user("player")],
      actors: { get: (id: string) => id === "iris" ? ally : joao },
      system: { version: "8.0.2" }, release: { version: "14.369" } });
    vi.stubGlobal("fromUuid", vi.fn(async () => record));
    definition.benefits[0].value = 99;
    await submitAllyRequest(ally as any, "activate");
    expect(ally.setFlag).toHaveBeenCalledWith("paranormal-toolkit", "allyRequest",
      { id: "stable-id-000", revision: 7, action: "activate" });
    expect(new FoundryAllyEnvironment().abilities("iris")![0].definition.benefits[0].value).toBe(99);
  });
  it("rejects a request without an executor before updating an actor", async () => {
    const ally = actor("iris", "paranormal-toolkit.ally");
    const player = user("player");
    vi.stubGlobal("game", { user: player, users: [player], actors: { get: () => ally } });
    await expect(submitAllyRequest(ally as any, "activate")).rejects.toThrow("Nenhum GM");
    expect(ally.setFlag).not.toHaveBeenCalled();
  });
  it("cleans old presentation flags once and ignores unrelated display fields on subsequent reconciliation", async () => {
    const ally = actor("iris", "paranormal-toolkit.ally");
    const mirror = { revision: 0, beneficiaryId: null, status: "inactive", waitRound: null, diagnostic: null };
    ally.getFlag.mockReturnValue({ ...mirror, validated: false, pending: true, pendingAction: "activate", pendingBeneficiaryId: "joao" } as any);
    vi.stubGlobal("game", { actors: { contents: [ally] } });
    const environment = new FoundryAllyEnvironment();
    await environment.publish(createAllyLedger());
    expect(ally.setFlag).toHaveBeenCalledWith("paranormal-toolkit", "allySupport", expect.objectContaining({
      validated: expect.any(foundry.data.operators.ForcedDeletion), pending: expect.any(foundry.data.operators.ForcedDeletion),
      pendingAction: expect.any(foundry.data.operators.ForcedDeletion), pendingBeneficiaryId: expect.any(foundry.data.operators.ForcedDeletion),
    }));
    ally.getFlag.mockReturnValue({ ...mirror, extraDisplayField: "ignored" } as any);
    await environment.publish(createAllyLedger());
    expect(ally.setFlag).toHaveBeenCalledTimes(1);
  });
  it("rejects synthetic beneficiaries and resolves ambiguous combats explicitly", () => {
    const ally = actor("iris", "paranormal-toolkit.ally"), joao = actor("joao");
    const combat = (id: string) => ({ id, round: 2, started: true, combatants: { contents: [{ actorId: "joao" }] } });
    vi.stubGlobal("game", { user: user("gm", true), users: [], actors: { get: (id: string) => id === "iris" ? ally : joao },
      combats: { contents: [combat("one"), combat("two")], get: vi.fn() } });
    const env = new FoundryAllyEnvironment();
    expect(env.agentExists("joao")).toBe(true);
    joao.isToken = true;
    expect(env.agentExists("joao")).toBe(false);
    expect(() => env.resolveCombat("iris", "joao")).toThrow("mais de um");
    expect(env.resolveCombat("iris", "joao", "two")).toEqual({ id: "two", round: 2, started: true });
    expect(() => env.resolveCombat("iris", "joao", "unrelated")).toThrow("não envolve");
  });
  it("builds native v14 initial additions without writing the base defense", async () => {
    const beneficiary = actor("joao");
    vi.stubGlobal("game", { actors: { get: () => beneficiary } });
    const effect = { actorId: "joao", effectId: "id", sourceKey: "source", value: 5, allyId: "iris" };
    expect(buildAllyDefenseEffect(effect)).toMatchObject({ transfer: false,
      changes: [{ key: "system.defense.value", value: "5", type: "add", phase: "initial", priority: 20 }] });
    const guard = vi.fn(), adapter = new OrdemAllyBenefitAdapter(guard);
    await adapter.create(effect);
    expect(beneficiary.createEmbeddedDocuments).toHaveBeenCalledWith("ActiveEffect", [buildAllyDefenseEffect(effect)],
      { keepId: true, allyReconciliation: true });
    beneficiary.effects.get.mockReturnValue({ ...buildAllyDefenseEffect(effect), getFlag: () => ({ version: 1, sourceKey: "source", allyId: "iris" }) } as any);
    expect(adapter.matches(effect)).toBe(true);
    await adapter.remove(effect);
    expect(beneficiary.deleteEmbeddedDocuments).toHaveBeenCalledWith("ActiveEffect", ["id"], { allyReconciliation: true });
    expect(guard).toHaveBeenCalledTimes(2);
  });
  it("preserves malformed source configs and enforces native edit permission", async () => {
    const ally = actor("iris", "paranormal-toolkit.ally");
    const item = { type: "ability", parent: ally, getFlag: vi.fn(() => ({ version: 2 })), setFlag: vi.fn() };
    expect(readAllyAbility(item as any)).toBeNull();
    ally.canUserModify.mockReturnValue(false);
    await expect(writeAllyAbility(item as any, { version: 1, benefits: [] })).rejects.toThrow("permissão");
    expect(item.setFlag).not.toHaveBeenCalled();
  });
});
