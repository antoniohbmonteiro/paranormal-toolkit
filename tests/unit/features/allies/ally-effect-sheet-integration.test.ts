import { describe, expect, it, vi } from "vitest";
import { registerAllyEffectSheetIntegration } from "../../../../src/features/allies/ally-effect-sheet-integration";
import { buildDefenseTemplate } from "../../../../src/adapters/ordem/ordem-ally-effect-presets";

function setup() {
  const hooks = new Map<string, Function[]>();
  vi.stubGlobal("Hooks", { on: (name: string, callback: Function) => hooks.set(name, [...hooks.get(name) ?? [], callback]) });
  vi.stubGlobal("ui", { notifications: { warn: vi.fn() } });
  registerAllyEffectSheetIntegration(); return hooks;
}
describe("passive source guards without header integration", () => {
  it("registers only source guards and no header/render controls", () => {
    expect([...setup().keys()]).toEqual(["preCreateActiveEffect", "preUpdateActiveEffect", "preCreateItem"]);
  });
  it("rejects transferring benefits without rewriting source or the proposed patch", () => {
    const hooks = setup();
    const effect = { parent: { type: "ability" }, transfer: false, getFlag: () => ({ version: 1 }), updateSource: vi.fn() };
    const data = { ...buildDefenseTemplate("Defesa", 5), transfer: true }, before = structuredClone(data);
    expect(hooks.get("preCreateActiveEffect")![0](effect, data)).toBe(false);
    expect(data).toEqual(before); expect(effect.updateSource).not.toHaveBeenCalled();
    const changes = { transfer: true };
    expect(hooks.get("preUpdateActiveEffect")![0](effect, changes)).toBe(false);
    expect(changes).toEqual({ transfer: true });
    for (const patch of [{ name: "Novo nome" }, { disabled: true }, { transfer: false }]) {
      const copy = structuredClone(patch);
      expect(hooks.get("preUpdateActiveEffect")![0](effect, patch)).toBeUndefined();
      expect(patch).toEqual(copy);
    }
  });
  it("leaves unrelated edits on an incompatible old source untouched and permits explicit repair", () => {
    const hooks = setup();
    const effect = { parent: { type: "ability" }, transfer: true, getFlag: () => ({ version: 1 }) };
    const patch = { name: "Preservado" };
    expect(hooks.get("preUpdateActiveEffect")![0](effect, patch)).toBeUndefined();
    expect(patch).toEqual({ name: "Preservado" });
    expect(hooks.get("preUpdateActiveEffect")![0](effect, { transfer: false })).toBeUndefined();
    for (const flags of [{ flags: { "paranormal-toolkit": { allyPassive: { version: 1 } } } },
      { "flags.paranormal-toolkit": { allyPassive: { version: 1 } } },
      { "flags.paranormal-toolkit.allyPassive": { version: 1 } }]) {
      const before = structuredClone(flags);
      expect(hooks.get("preUpdateActiveEffect")![0]({ ...effect, getFlag: () => undefined }, flags)).toBe(false);
      expect(flags).toEqual(before);
    }
  });
  it("rejects an incompatible copy without changing its effects and accepts valid copies", () => {
    const hooks = setup();
    const data = { effects: [
      { _id: "support", transfer: true, flags: { "paranormal-toolkit": { allyPassive: { version: 1 } } } },
      { _id: "other", transfer: true },
    ] };
    const item = { type: "ability", toObject: () => structuredClone(data), updateSource: vi.fn() };
    expect(hooks.get("preCreateItem")![0](item)).toBe(false);
    expect(item.updateSource).not.toHaveBeenCalled(); expect(data.effects[0].transfer).toBe(true);
    data.effects[0].transfer = false;
    expect(hooks.get("preCreateItem")![0](item)).toBeUndefined();
    expect(data.effects[1].transfer).toBe(true);
  });
});
