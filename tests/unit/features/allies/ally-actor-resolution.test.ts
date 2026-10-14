import { beforeEach, describe, expect, it, vi } from "vitest";
import { readFoundryAllyProfile, resolveFoundryAllyActor } from "../../../../src/adapters/foundry/foundry-ally-actor-resolver";
import { FoundryAllyEnvironment, readAllySupportView, submitAllyRequest } from "../../../../src/adapters/foundry/foundry-ally-request-adapter";
import { createAllyProfile } from "../../../../src/core/allies/ally-profile";
import { renderAllySheet } from "../../../../src/ui/components/ally/ally-sheet";

function fixture() {
  const flags: Record<string, any> = { allySupport: { revision: 7, beneficiaryId: "joao", status: "active" } };
  const actor = { id: "iris", uuid: "Actor.iris", type: "paranormal-toolkit.ally", isToken: false,
    system: createAllyProfile(), items: [], canUserModify: vi.fn(() => true),
    getFlag: vi.fn((_scope: string, key: string) => flags[key]),
    setFlag: vi.fn(async (_scope: string, key: string, value: unknown) => { flags[key] = value; }) };
  const token = { ...actor, uuid: "Scene.scene.Token.token.Actor.iris", isToken: true,
    token: { baseActor: actor }, getFlag: vi.fn(() => ({ revision: 99 })), setFlag: vi.fn() };
  const player = { id: "owner", isGM: false, active: true };
  vi.stubGlobal("game", { user: player, users: [player, { id: "gm", isGM: true, active: true }],
    actors: { get: (id: string) => id === "iris" ? actor : undefined } });
  let nonce = 0;
  vi.stubGlobal("foundry", { utils: { randomID: () => `request-${++nonce}` } });
  return { actor, token, flags };
}
beforeEach(() => { vi.spyOn(console, "error").mockImplementation(() => {}); });
describe("canonical Allies support origin (documents doubled)", () => {
  it("submits from the persistent Actor sheet", async () => {
    const { actor } = fixture();
    await submitAllyRequest(actor as any, "assign", { beneficiaryId: "joao" });
    expect(actor.setFlag).toHaveBeenCalledWith("paranormal-toolkit", "allyRequest",
      { id: "request-1", revision: 7, action: "assign", beneficiaryId: "joao" });
  });
  it("linked token actor resolves to the same world Actor", async () => {
    const { actor } = fixture();
    const linkedToken = { actor, baseActor: actor };
    expect(resolveFoundryAllyActor(linkedToken.actor as any)).toBe(actor);
    await submitAllyRequest(linkedToken.actor as any, "activate");
    expect(actor.setFlag).toHaveBeenCalledTimes(1);
  });
  it("unlinked token requests and presentation use the original Actor exclusively", async () => {
    const { actor, token } = fixture();
    expect(resolveFoundryAllyActor(token as any)).toBe(actor);
    expect(await readAllySupportView(token as any)).toMatchObject({ revision: 7, beneficiaryId: "joao" });
    await submitAllyRequest(token as any, "deactivate");
    expect(actor.setFlag).toHaveBeenCalledWith("paranormal-toolkit", "allyRequest",
      { id: "request-1", revision: 7, action: "deactivate" });
    expect(token.setFlag).not.toHaveBeenCalled();
    expect(token.getFlag).not.toHaveBeenCalled();
  });
  it("keeps support operable when a token-specific profile differs from the valid original", async () => {
    const { actor, token } = fixture();
    token.system = { ...createAllyProfile(), schemaVersion: 2 } as any;
    const support = await readAllySupportView(token as any);
    const html = renderAllySheet({ name: "Íris", image: "", profile: null, editable: true, abilities: [],
      support: { ...support, isGM: false, beneficiaries: [{ id: "joao", name: "João" }], combats: [] } });
    expect(html).toContain('data-action="assignSupport"');
    await submitAllyRequest(token as any, "activate");
    expect(actor.setFlag).toHaveBeenCalledTimes(1); expect(token.setFlag).not.toHaveBeenCalled();
  });
  it("keeps one state and revision across the directory and multiple unlinked tokens", async () => {
    const { actor, token, flags } = fixture();
    await submitAllyRequest(token as any, "assign", { beneficiaryId: "joao" });
    flags.allySupport.revision = 8;
    await submitAllyRequest({ ...token, uuid: "Scene.scene.Token.second.Actor.iris" } as any, "activate");
    await submitAllyRequest(actor as any, "deactivate");
    expect(actor.setFlag.mock.calls.map(call => (call[2] as any).revision)).toEqual([7, 8, 8]);
    expect(token.setFlag).not.toHaveBeenCalled();
  });
  it.each([null, { id: "absent", type: "paranormal-toolkit.ally" }, { id: "iris", type: "agent" }])(
    "rejects a missing or invalid baseActor without falling back to synthetic id (%j)", async baseActor => {
      const { actor, token } = fixture();
      token.token.baseActor = baseActor as any;
      await expect(submitAllyRequest(token as any, "activate")).rejects.toThrow("Aliado inválido");
      expect(actor.setFlag).not.toHaveBeenCalled(); expect(token.setFlag).not.toHaveBeenCalled();
      expect(console.error).toHaveBeenCalledWith(expect.any(String), expect.objectContaining({ bundle: expect.any(String) }));
    },
  );
  it("uses the current collection instance rather than a stale sheet document", async () => {
    const { actor } = fixture();
    const stale = { ...actor, system: { schemaVersion: 0 }, setFlag: vi.fn() };
    await submitAllyRequest(stale as any, "activate");
    expect(actor.setFlag).toHaveBeenCalledTimes(1); expect(stale.setFlag).not.toHaveBeenCalled();
  });
  it("does not accept a foreign UUID with the same id", () => {
    const { actor } = fixture();
    expect(resolveFoundryAllyActor({ ...actor, uuid: "Compendium.pack.Actor.iris" } as any)).toBeNull();
  });
  it.each(["origin", "original"])("requires update permission on %s", async denied => {
    const { actor, token } = fixture();
    token.canUserModify = vi.fn(() => denied !== "origin");
    actor.canUserModify = vi.fn(() => denied !== "original");
    await expect(submitAllyRequest(token as any, "activate")).rejects.toThrow("Sem permissão");
    expect(actor.setFlag).not.toHaveBeenCalled();
  });
  it("rejects an invalid persisted profile, even if the token profile is valid", async () => {
    const { actor, token } = fixture();
    actor.system = { ...createAllyProfile(), schemaVersion: 2 } as any;
    await expect(submitAllyRequest(token as any, "activate")).rejects.toThrow("Aliado inválido");
    expect(new FoundryAllyEnvironment().allyExists("iris")).toBe(false);
    expect(actor.setFlag).not.toHaveBeenCalled();
  });
  it("fails closed if model serialization throws", () => {
    const { actor } = fixture();
    actor.system = { toObject: () => { throw new Error("Invalid model"); } } as any;
    expect(readFoundryAllyProfile(actor as any)).toBeNull();
    expect(resolveFoundryAllyActor(actor as any)).toBeNull();
  });
});
