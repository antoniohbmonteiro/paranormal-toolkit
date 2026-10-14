import { describe, expect, it, vi } from "vitest";
import { registerAllyLifecycleHooks } from "../../../../src/features/allies/ally-lifecycle-hooks";
import { AllySupportService, createAllyLedger } from "../../../../src/features/allies/ally-support-service";
import { FoundryAllyStore } from "../../../../src/adapters/foundry/foundry-ally-store";
import { createAllyProfile } from "../../../../src/core/allies/ally-profile";
import { readAllyRequest } from "../../../../src/features/allies/ally-operation-authority";
import { submitAllyRequest } from "../../../../src/adapters/foundry/foundry-ally-request-adapter";

const scope = "paranormal-toolkit";
const path = `flags.${scope}.allyRequest`;
const request = (id = "request-01") => ({ id, revision: 0, action: "assign", beneficiaryId: "joao" });
function fixture(realService = false) {
  const hooks = new Map<string, Function[]>(), flags: Record<string, unknown> = { allyRequest: request() };
  const actor = { id: "iris", type: "paranormal-toolkit.ally", system: createAllyProfile(), items: [],
    getFlag: vi.fn((_scope: string, key: string) => flags[key]),
    setFlag: vi.fn(async (_scope: string, key: string, value: unknown) => { flags[key] = value; }),
    canUserModify: vi.fn(() => true) };
  const agent = { id: "joao", type: "agent", isToken: false };
  const gm = { id: "gm", isGM: true, active: true }, player = { id: "actual-player", isGM: false, active: true };
  vi.stubGlobal("Hooks", { on: (name: string, callback: Function) => hooks.set(name, [...hooks.get(name) ?? [], callback]) });
  vi.stubGlobal("game", { user: gm, users: [gm, player],
    actors: { get: (id: string) => id === "iris" ? actor : id === "joao" ? agent : undefined, contents: [actor, agent] },
    system: { version: "8.0.2" }, release: { version: "14.369" } });
  const warn = vi.fn();
  vi.stubGlobal("ui", { notifications: { warn } });
  vi.spyOn(console, "error").mockImplementation(() => {});
  let ledger = createAllyLedger();
  vi.spyOn(FoundryAllyStore.prototype, "load").mockImplementation(async () => structuredClone(ledger));
  vi.spyOn(FoundryAllyStore.prototype, "save").mockImplementation(async next => { ledger = structuredClone(next); });
  const process = vi.spyOn(AllySupportService.prototype, "process");
  if (!realService) process.mockResolvedValue();
  const reconcile = vi.spyOn(AllySupportService.prototype, "reconcile").mockResolvedValue();
  registerAllyLifecycleHooks();
  const emit = (changes: Record<string, unknown>, userId = player.id) => hooks.get("updateActor")![0](actor, changes, {}, userId);
  return { hooks, actor, agent, flags, process, reconcile, warn, emit, ledger: () => ledger };
}
describe("ally request updates (Foundry hooks/documents doubled)", () => {
  it("reads the updated Actor, ignoring the payload userId in favor of the native identity", async () => {
    const f = fixture(); f.flags.allyRequest = { ...request(), userId: "forged-gm" };
    await f.emit({ flags: { [scope]: { allyRequest: f.flags.allyRequest } } });
    expect(f.actor.getFlag).toHaveBeenCalledWith(scope, "allyRequest");
    expect(f.process).toHaveBeenCalledWith("iris", request(), "actual-player");
    expect(f.process.mock.calls[0][1]).not.toHaveProperty("userId");
  });
  it.each([
    { flags: { [scope]: { allyRequest: { id: "request-01" } } } },
    { [path]: { id: "request-01" } },
    { [`${path}.id`]: "request-01" },
    { flags: { [`${scope}.allyRequest.id`]: "request-01" } },
    { [`flags.${scope}`]: { "allyRequest.id": "request-01" } },
  ])("recovers unchanged fields from nested/dotted diffs (%j)", async changes => {
    const f = fixture(); await f.emit(changes);
    expect(f.process).toHaveBeenCalledWith("iris", request(), "actual-player");
    expect(f.warn).not.toHaveBeenCalled();
  });
  it.each([
    { name: "New name" }, { "system.description": "Edited profile" },
    { flags: { [scope]: { allySupport: { status: "active", beneficiaryId: "third-party" } } } },
    { [`${path}.revision`]: 100 },
    { flags: { [scope]: { allyRequest: { action: "activate" } } } }, { [path]: null },
  ])("does not replay stored requests without a changed nonce (%j)", async changes => {
    const f = fixture(); await f.emit(changes);
    expect(f.process).not.toHaveBeenCalled(); expect(f.actor.getFlag).not.toHaveBeenCalled();
  });
  it.each([
    { ...request(), revision: undefined }, { ...request(), revision: -1 },
    { ...request(), action: "unknown" }, { ...request(), beneficiaryId: 42 }, null,
  ])("rejects malformed full snapshots without weakening the reader (%j)", async snapshot => {
    const f = fixture(); f.flags.allyRequest = snapshot;
    await f.emit({ [`${path}.id`]: "request-01" });
    expect(readAllyRequest(snapshot)).toBeNull();
    expect(f.process).not.toHaveBeenCalled();
    expect(f.warn).toHaveBeenCalledWith("Solicitação de suporte inválida.");
  });
  it("rejects superseded snapshots and inconsistent changed fields", async () => {
    const f = fixture(); f.flags.allyRequest = request("request-02");
    await f.emit({ [`${path}.id`]: "request-01" });
    await f.emit({ [path]: { ...request("request-02"), beneficiaryId: "tampered" } });
    expect(f.process).not.toHaveBeenCalled(); expect(f.warn).toHaveBeenCalledTimes(2);
  });
  it("captures an independent snapshot before asynchronous processing", async () => {
    const f = fixture(); await f.emit({ [`${path}.id`]: "request-01" });
    (f.flags.allyRequest as ReturnType<typeof request>).beneficiaryId = "edited-later";
    expect(f.process.mock.calls[0][1].beneficiaryId).toBe("joao");
  });
  it("does not attribute a later writer's snapshot to the native original user", async () => {
    const f = fixture();
    (f.actor as any)._stats = { lastModifiedBy: "later-writer" };
    await f.emit({ [`${path}.id`]: "request-01" });
    expect(f.process).not.toHaveBeenCalled();
    expect(f.warn).toHaveBeenCalledWith("Solicitação de suporte inválida.");
    (f.actor as any)._stats.lastModifiedBy = "actual-player";
    await f.emit({ [`${path}.id`]: "request-01" });
    expect(f.process).toHaveBeenCalledWith("iris", request(), "actual-player");
  });
  it("suppresses repeated IDs, including replay after another request", async () => {
    const f = fixture();
    await f.emit({ [`${path}.id`]: "request-01" }); await f.emit({ [`${path}.id`]: "request-01" });
    f.flags.allyRequest = request("request-02"); await f.emit({ [`${path}.id`]: "request-02" });
    f.flags.allyRequest = { ...request(), revision: 100 }; await f.emit({ [path]: f.flags.allyRequest });
    expect(f.process).toHaveBeenCalledTimes(2);
  });
  it("only processes events on the elected GM", async () => {
    const f = fixture(), gameDouble = (globalThis as any).game;
    gameDouble.user = { id: "gm-b", isGM: true, active: true }; gameDouble.users.push(gameDouble.user);
    await f.emit({ [`${path}.id`]: "request-01" });
    expect(f.process).not.toHaveBeenCalled(); expect(f.actor.getFlag).not.toHaveBeenCalled();
  });
  it("ignores synthetic and stale-instance updates even with a copied original id and fresh nonce", async () => {
    const f = fixture();
    const callback = f.hooks.get("updateActor")![0];
    await callback({ ...f.actor, isToken: true, token: { baseActor: f.actor } }, { [`${path}.id`]: "request-01" }, {}, "gm");
    await callback({ ...f.actor }, { [`${path}.id`]: "request-01" }, {}, "gm");
    expect(f.process).not.toHaveBeenCalled();
    await f.emit({ [`${path}.id`]: "request-01" });
    expect(f.process).toHaveBeenCalledTimes(1);
  });
  it("assigns a persistent world agent through the real service after a diff and approval", async () => {
    const f = fixture(true); await f.emit({ [`${path}.id`]: "request-01" });
    expect(f.ledger().links[0].pending?.request.beneficiaryId).toBe("joao");
    f.flags.allyRequest = { id: "approve-01", revision: f.ledger().revision, action: "approve", beneficiaryId: "joao", scope: "[]" };
    await f.emit({ [path]: f.flags.allyRequest }, "gm");
    expect(f.ledger().links[0].state.beneficiaryId).toBe("joao");
    expect(f.ledger().links[0].approval).toEqual({ beneficiaryId: "joao", scope: "[]" });
  });
  it("shares one canonical support link when submitting through tokens and the directory", async () => {
    const f = fixture(true);
    let nonce = 0;
    vi.stubGlobal("foundry", { utils: { randomID: () => `token-request-${++nonce}` } });
    const token = { ...f.actor, isToken: true, token: { baseActor: f.actor }, setFlag: vi.fn() };
    await submitAllyRequest(token as any, "assign", { beneficiaryId: "joao" });
    await f.emit({ [`${path}.id`]: "token-request-1" }, "gm");
    await submitAllyRequest(f.actor as any, "assign", { beneficiaryId: "joao" });
    await f.emit({ [`${path}.id`]: "token-request-2" }, "gm");
    expect(f.ledger().links).toHaveLength(1);
    expect(f.ledger().links[0]).toMatchObject({ allyId: "iris", state: { beneficiaryId: "joao" } });
    expect(token.setFlag).not.toHaveBeenCalled();
    expect(f.warn).not.toHaveBeenCalled();
  });
  it("preserves stale revision, ownership and persistent-agent checks in the real service", async () => {
    const f = fixture(true); await f.emit({ [`${path}.id`]: "request-01" });
    const revision = f.ledger().revision;
    f.flags.allyRequest = request("obsolete-01"); await f.emit({ [`${path}.id`]: "obsolete-01" });
    expect(f.warn).toHaveBeenLastCalledWith("O suporte mudou. Atualize a ficha e solicite novamente.");
    f.flags.allyRequest = { ...request("ownership-01"), revision }; f.actor.canUserModify.mockReturnValue(false);
    await f.emit({ [`${path}.id`]: "ownership-01" });
    expect(f.warn).toHaveBeenLastCalledWith("Solicitante não autorizado.");
    f.actor.canUserModify.mockReturnValue(true); f.agent.isToken = true;
    f.flags.allyRequest = { ...request("synthetic-01"), revision }; await f.emit({ [`${path}.id`]: "synthetic-01" });
    expect(f.warn).toHaveBeenLastCalledWith("Selecione um Agente persistente do mundo.");
    expect(f.ledger().revision).toBe(revision);
  });
  it("observes post-update combat events and ignores its own projections", () => {
    const f = fixture();
    expect(f.hooks.has("updateCombat")).toBe(true); expect(f.hooks.has("combatRound")).toBe(false);
    const previous = f.reconcile.mock.calls.length;
    f.hooks.get("createActiveEffect")![0]({}, { allyReconciliation: true }, "gm");
    expect(f.reconcile).toHaveBeenCalledTimes(previous);
    f.hooks.get("updateActiveEffect")![0]({}, {}, {}, "actual-player");
    expect(f.reconcile).toHaveBeenCalledTimes(previous + 1);
  });
});
