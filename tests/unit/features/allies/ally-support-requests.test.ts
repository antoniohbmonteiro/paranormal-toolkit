import { afterEach, describe, expect, it, vi } from "vitest";
import { FoundryAllySupportRequests, ALLY_RESPONSE_FLAG, type AllySupportReply } from "../../../../src/adapters/foundry/foundry-ally-request-adapter";
import { createAllyProfile } from "../../../../src/core/allies/ally-profile";

function fixture() {
  const hooks = new Map<string, Function[]>();
  const flags: any = { allySupport: { revision: 2, status: "inactive", beneficiaryId: null } }; let sequence = 0;
  const owner = { id: "owner", isGM: false, active: true }, gm = { id: "gm", isGM: true, active: true };
  const actor: any = { id: "iris", type: "paranormal-toolkit.ally", uuid: "Actor.iris", system: createAllyProfile(), isToken: false,
    _stats: { lastModifiedBy: "owner" }, canUserModify: () => true, getFlag: (_scope: string, key: string) => flags[key],
    setFlag: vi.fn(async (_scope, key, value) => { flags[key] = { ...flags[key], ...value }; return actor; }) };
  vi.stubGlobal("Hooks", { on: (name: string, fn: Function) => { hooks.set(name, [...hooks.get(name) ?? [], fn]); } });
  vi.stubGlobal("game", { user: owner, users: [owner, gm], actors: { get: (id: string) => id === actor.id ? actor : undefined } });
  vi.stubGlobal("foundry", { utils: { randomID: () => `request-${++sequence}` } });
  const requests = new FoundryAllySupportRequests(); requests.register();
  const reply = (id: string, sender = "gm", patch: Partial<AllySupportReply> = {}) => {
    flags[ALLY_RESPONSE_FLAG] = { id, userId: owner.id, ok: true, view: { revision: 3, status: "active", beneficiaryId: "mauro" }, ...patch };
    actor._stats.lastModifiedBy = sender;
    for (const fn of hooks.get("updateActor") ?? []) fn(actor, { [`flags.paranormal-toolkit.${ALLY_RESPONSE_FLAG}.id`]: id }, {}, sender);
  };
  return { actor, owner, gm, flags, requests, reply, hooks };
}
afterEach(() => vi.useRealTimers());
describe("support request acknowledgement using native hook identity", () => {
  it("waits for the GM response and rejects player-forged or mismatched replies", async () => {
    const f = fixture(); let settled = false;
    const result = f.requests.submit(f.actor, "setBeneficiary", { beneficiaryId: "mauro" }).then(value => { settled = true; return value; });
    await vi.waitFor(() => expect(f.actor.setFlag).toHaveBeenCalledOnce());
    expect(f.requests.isPending("iris")).toBe(true); expect(settled).toBe(false);
    f.reply("request-1", "owner"); f.reply("request-1", "gm", { userId: "forged" }); f.reply("other-request");
    await Promise.resolve(); expect(settled).toBe(false);
    f.reply("request-1"); expect(await result).toMatchObject({ ok: true, view: { revision: 3 } });
    expect(f.requests.isPending("iris")).toBe(false);
  });
  it("serializes local requests and reads the new canonical revision only when the next starts", async () => {
    const f = fixture(); const first = f.requests.submit(f.actor, "setBeneficiary", { beneficiaryId: null });
    const second = f.requests.submit(f.actor, "setPilot", { pilotId: "rafa" });
    await vi.waitFor(() => expect(f.actor.setFlag).toHaveBeenCalledTimes(1));
    f.flags.allySupport.revision = 5; f.reply("request-1"); await first;
    await vi.waitFor(() => expect(f.actor.setFlag).toHaveBeenCalledTimes(2));
    expect(f.actor.setFlag.mock.calls[1][2]).toMatchObject({ revision: 5, action: "setPilot", pilotId: "rafa" });
    f.reply("request-2"); await second;
  });
  it("returns validation failures and combat choices without retrying", async () => {
    const f = fixture(); const promise = f.requests.submit(f.actor, "setBeneficiary", { beneficiaryId: "mauro" });
    await vi.waitFor(() => expect(f.actor.setFlag).toHaveBeenCalledOnce());
    f.reply("request-1", "gm", { ok: false, error: "Escolha o combate", combats: [{ id: "combat", name: "Combate" }] });
    expect(await promise).toMatchObject({ ok: false, combats: [{ id: "combat" }] }); expect(f.actor.setFlag).toHaveBeenCalledOnce();
  });
  it("clears the previous intent's combat choice instead of inheriting it through setFlag merging", async () => {
    const f = fixture();
    const first = f.requests.submit(f.actor, "setBeneficiary", { beneficiaryId: "mauro", combatId: "old-combat" });
    await vi.waitFor(() => expect(f.actor.setFlag).toHaveBeenCalledOnce()); f.reply("request-1"); await first;
    const next = f.requests.submit(f.actor, "setBeneficiary", { beneficiaryId: "rafa" });
    await vi.waitFor(() => expect(f.actor.setFlag).toHaveBeenCalledTimes(2));
    expect(f.actor.setFlag.mock.calls[1][2].combatId).toBe("");
    expect(f.flags.allyRequest.combatId).toBe(""); f.reply("request-2"); await next;
  });
  it("does not repeat timed-out requests", async () => {
    vi.useFakeTimers(); const f = fixture(); const promise = f.requests.submit(f.actor, "setBeneficiary", { beneficiaryId: null }).catch(error => error);
    await vi.advanceTimersByTimeAsync(120_001);
    expect((await promise).message).toContain("Sem confirmação"); expect(f.actor.setFlag).toHaveBeenCalledOnce(); expect(f.requests.isPending("iris")).toBe(false);
  });
  it("stops waiting after an executor change without resubmission", async () => {
    const f = fixture(); const promise = f.requests.submit(f.actor, "setBeneficiary", { beneficiaryId: null }).catch(error => error);
    await vi.waitFor(() => expect(f.actor.setFlag).toHaveBeenCalledOnce()); f.gm.active = false;
    for (const fn of f.hooks.get("userConnected") ?? []) fn(f.gm, false);
    expect((await promise).message).toContain("GM executor mudou"); expect(f.actor.setFlag).toHaveBeenCalledOnce();
  });
  it("rejects a missing GM or failed Document write before reporting success", async () => {
    const f = fixture(); f.gm.active = false;
    await expect(f.requests.submit(f.actor, "setBeneficiary", { beneficiaryId: null })).rejects.toThrow("Nenhum GM");
    expect(f.actor.setFlag).not.toHaveBeenCalled(); f.gm.active = true; f.actor.setFlag.mockRejectedValueOnce(new Error("write failed"));
    await expect(f.requests.submit(f.actor, "setBeneficiary", { beneficiaryId: null })).rejects.toThrow("write failed");
  });
});
