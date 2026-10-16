import { describe, expect, it, vi } from "vitest";
import { publishAllySupportChange } from "../../../../src/adapters/foundry/foundry-ally-notifications";
import { FoundryAllyEnvironment } from "../../../../src/adapters/foundry/foundry-ally-request-adapter";
import { buildAllySupportChange, type AllySupportChange } from "../../../../src/features/allies/ally-support-notifications";

const change: AllySupportChange = { allyId: "iris", events: ["beneficiaryChanged"],
  before: { beneficiaryId: "joao", status: "active", benefits: [{ sourceKey: "old", value: 5 }] },
  after: { beneficiaryId: "rafa", status: "active", benefits: [{ sourceKey: "new", value: 10 }] } };
function fixture() {
  const gm = { id: "gm-a", isGM: true, active: true };
  vi.stubGlobal("game", { user: gm,
    users: [gm, { id: "gm-b", isGM: true, active: false }, { id: "player", isGM: false, active: true }],
    actors: { get: (id: string) => ({ name: { iris: 'Íris <script>alert(1)</script>', joao: "João", rafa: "Rafa" }[id] }) } });
  const create = vi.fn(async () => {}); vi.stubGlobal("ChatMessage", { create });
  return { create, gm };
}
describe("discreet GM support notices", () => {
  it("whispers only to GMs, escapes names, and shows both beneficiaries and affected bonuses", async () => {
    const { create } = fixture(); await publishAllySupportChange(change);
    const data = create.mock.calls[0][0] as any;
    expect(data.whisper).toEqual(["gm-a", "gm-b"]);
    expect(data.content).toContain("João → Rafa");
    expect(data.content).toContain("Defesa +5 → Defesa +10");
    expect(data.content).toContain("&lt;script&gt;"); expect(data.content).not.toContain("<script>");
    expect(data.content).not.toMatch(/<button|aprovar|validar/i);
    expect(data.flags["paranormal-toolkit"].allySupportNotice).toEqual({ version: 1, allyId: "iris", events: ["beneficiaryChanged"] });
  });
  it("does not publish on another GM or a player client", async () => {
    const { create, gm } = fixture();
    const environment = new FoundryAllyEnvironment();
    await environment.notify(change); expect(create).toHaveBeenCalledTimes(1);
    const gameDouble = (globalThis as any).game;
    gameDouble.user = { ...gm, id: "gm-z" }; gameDouble.users.push(gameDouble.user);
    await environment.notify(change);
    gameDouble.user.isGM = false; await environment.notify(change);
    expect(create).toHaveBeenCalledTimes(1);
  });
  it("does not classify a baseline or identical snapshot as a change", () => {
    expect(buildAllySupportChange("iris", null, change.after)).toBeNull();
    expect(buildAllySupportChange("iris", change.after, structuredClone(change.after))).toBeNull();
  });
});
