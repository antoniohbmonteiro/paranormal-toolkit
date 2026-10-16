import { beforeEach, describe, expect, it, vi } from "vitest";
import { registerAllyEffectSheetIntegration } from "../../../../src/features/allies/ally-effect-sheet-integration";
import { buildDefenseTemplate } from "../../../../src/adapters/ordem/ordem-ally-effect-presets";

function setup() {
  const hooks = new Map<string, Function[]>();
  vi.stubGlobal("Hooks", { on: (name: string, callback: Function) => hooks.set(name, [...hooks.get(name) ?? [], callback]) });
  vi.stubGlobal("game", { user: { id: "gm", isGM: true } });
  registerAllyEffectSheetIntegration(); return hooks;
}
describe("public ItemSheetV2 passive editor entry point", () => {
  it.each([false, true])("adds one discoverable header control to a native ability (embedded=%s)", embedded => {
    const hooks = setup();
    const item = { type: "ability", parent: embedded ? { type: "paranormal-toolkit.ally" } : null, canUserModify: () => true };
    const controls: any[] = [];
    hooks.get("getHeaderControlsItemSheetV2")![0]({ document: item }, controls);
    hooks.get("getHeaderControlsItemSheetV2")![0]({ item }, controls);
    expect(controls).toHaveLength(1);
    expect(controls[0]).toMatchObject({ label: "Benefícios passivos — Toolkit", visible: true, onClick: expect.any(Function) });
  });
  it("does not replace native sheets, inspect system HTML or offer mutation to non-owners/other types", () => {
    const hooks = setup(); const controls: any[] = [];
    for (const item of [{ type: "ritual", canUserModify: () => true }, { type: "ability", canUserModify: () => false }]) {
      hooks.get("getHeaderControlsItemSheetV2")![0]({ item }, controls);
    }
    expect(controls).toEqual([]);
    expect(hooks.has("renderItemSheetV2")).toBe(false);
  });
  it.each([false, true])("opens the same editor from the real header handler (embedded=%s)", async embedded => {
    vi.resetModules();
    const hooks = setup();
    const rendered: any[] = [];
    vi.stubGlobal("foundry", { applications: { api: { ApplicationV2: class {
      async render() { rendered.push(this); return this; }
      async close() { return this; }
    } } } });
    (globalThis as any).Hooks.off = vi.fn();
    const item = { type: "ability", name: "Nativa", parent: embedded ? { type: "paranormal-toolkit.ally" } : null,
      getFlag: () => undefined, canUserModify: () => true };
    const controls: any[] = [];
    hooks.get("getHeaderControlsItemSheetV2")![0]({ item }, controls);
    controls[0].onClick();
    await vi.waitFor(() => expect(rendered).toHaveLength(1));
    expect(rendered[0].constructor.name).toBe("AllyAbilityConfigApplication");
    expect(rendered[0].item).toBe(item);
    await rendered[0].close(); expect(Hooks.off).toHaveBeenCalledTimes(3);
  });
  it("prevents native transfer on selected effects during create and subsequent native edits", () => {
    const hooks = setup();
    const effect = { parent: { type: "ability" }, getFlag: () => ({ version: 1 }), updateSource: vi.fn() };
    const data = { ...buildDefenseTemplate("Defesa", 5), transfer: true };
    hooks.get("preCreateActiveEffect")![0](effect, data);
    expect(effect.updateSource).toHaveBeenCalledWith({ transfer: false }); expect(data.transfer).toBe(false);
    const change = { transfer: true };
    hooks.get("preUpdateActiveEffect")![0](effect, change); expect(change.transfer).toBe(false);
  });
  it("keeps copied passive effects non-transferring and preserves unselected effects", () => {
    const hooks = setup();
    const data = { effects: [
      { _id: "support", transfer: true, flags: { "paranormal-toolkit": { allyPassive: { version: 1 } } } },
      { _id: "other", transfer: true },
    ] };
    const item = { type: "ability", toObject: () => structuredClone(data), updateSource: vi.fn() };
    hooks.get("preCreateItem")![0](item);
    expect(item.updateSource).toHaveBeenCalledWith({ effects: [{ ...data.effects[0], transfer: false }, data.effects[1]] });
    expect(data.effects[0].transfer).toBe(true);
  });
});
