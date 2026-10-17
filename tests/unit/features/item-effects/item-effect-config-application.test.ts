import { beforeEach, describe, expect, it, vi } from "vitest";
import { itemFixture } from "../../../helpers/item-effects";
import { buildDefenseTemplate } from "../../../../src/adapters/ordem/ordem-ally-effect-presets";

const scope = "paranormal-toolkit";
async function editor() {
  const subscriptions = new Map<string, Function[]>();
  const confirm = vi.fn().mockResolvedValue(false);
  vi.stubGlobal("Hooks", { on: (name: string, callback: Function) => subscriptions.set(name, [...subscriptions.get(name) ?? [], callback]), off: vi.fn() });
  vi.stubGlobal("foundry", { applications: { api: { ApplicationV2: class {
    bringToFront = vi.fn();
    async render() { return this; } async close() { return this; }
  }, DialogV2: { confirm } } } });
  vi.stubGlobal("document", { createElement: () => ({ innerHTML: "" }) });
  const mod = await import("../../../../src/applications/item-effect-config-application");
  return { ...mod, actions: mod.ItemEffectConfigApplication.DEFAULT_OPTIONS.actions, confirm, subscriptions };
}
beforeEach(() => {
  vi.resetModules(); vi.stubGlobal("game", { user: { id: "gm", isGM: true } }); vi.stubGlobal("CONFIG", {});
  vi.stubGlobal("ui", { notifications: { warn: vi.fn() } });
});
const target = (id: string) => ({ dataset: { effectId: id } }) as any;
function form(values: Record<string, string>): any {
  return { querySelector: (selector: string) => {
    const key = /name="([^"]+)"/.exec(selector)?.[1];
    return key && key in values ? { value: values[key], focus() {} } : null;
  } };
}
describe("shared specialized editor actions", () => {
  it.each(["", "free", "passive"])("defaults to automatic application regardless of activation %j and preserves an explicit opt-out", async activation => {
    const { ItemEffectConfigApplication, actions } = await editor();
    const item = itemFixture({ system: { activation } }, { type: "agent" });
    const app = new ItemEffectConfigApplication(item);
    const initial = (await app._renderHTML()).innerHTML;
    expect(initial).toContain('name="transfer"');
    expect(initial).toContain('<option value="true" selected>');
    const transfer = false;
    (app as any).element = form({ transfer: String(transfer), presetId: "attribute", attributeId: "str", value: "1" });
    await app.render();
    expect(item.createEmbeddedDocuments).not.toHaveBeenCalled();
    await actions.addBenefit.call(app, {} as any, { closest: () => (app as any).element } as any);
    expect(item.effects.contents[0].transfer).toBe(transfer);
    await item.update({ "system.activation": "reaction" });
    await app.render();
    expect((await app._renderHTML()).innerHTML).toContain(`<option value="${transfer}" selected>`);
    await actions.createCustom.call(app);
    expect(item.effects.contents[1].transfer).toBe(transfer);
    expect(item.effects.contents[1].sheet.render).toHaveBeenCalledOnce();
    expect(item.effects.contents[0].update).not.toHaveBeenCalled();
    item.canUserModify.mockReturnValue(false);
    expect((await app._renderHTML()).innerHTML).toContain('<select name="transfer" disabled>');
  });
  it("opens one window per UUID, reuses it across entries, and releases subscriptions on close", async () => {
    const { openItemEffectConfig } = await editor(); const item = itemFixture();
    const before = item.toObject();
    const [a, b] = await Promise.all([openItemEffectConfig(item), openItemEffectConfig(item)]);
    expect(a).toBe(b); expect(item.toObject()).toEqual(before);
    expect(a.bringToFront).toHaveBeenCalledOnce();
    await a._renderHTML(); await a.render(); await a.close();
    expect(Hooks.off).toHaveBeenCalledTimes(7);
    expect(await openItemEffectConfig(item)).not.toBe(a);
    expect(item.createEmbeddedDocuments).not.toHaveBeenCalled(); expect(item.setFlag).not.toHaveBeenCalled();
  });
  it("cancels and closes quick edits with no writes, then saves only an explicitly changed value", async () => {
    const { ItemEffectConfigApplication, actions } = await editor();
    const item = itemFixture({ effects: [{ ...buildDefenseTemplate("Defesa", 5), _id: "effect", transfer: true }] });
    const app = new ItemEffectConfigApplication(item); const effect = item.effects.get("effect");
    await actions.editEffect.call(app, {} as any, target(effect.id));
    expect((await app._renderHTML()).innerHTML).toContain('name="editValue"');
    (app as any).element = form({ editValue: "9" });
    await actions.cancelEdit.call(app);
    expect(effect.update).not.toHaveBeenCalled();
    (app as any).element = form({});
    await actions.editEffect.call(app, {} as any, target(effect.id));
    (app as any).element = form({ editValue: "7" });
    await actions.saveEffect.call(app);
    expect(effect.update).toHaveBeenCalledExactlyOnceWith({ "system.changes": [{ key: "system.defense.value", type: "add", phase: "initial", priority: 20, value: 7 }] });
    await app.close(); expect(effect.update).toHaveBeenCalledTimes(1);
  });
  it("does not copy a previous row draft when switching the editing target", async () => {
    const { ItemEffectConfigApplication, actions } = await editor();
    const item = itemFixture({ effects: [5, 3].map((value, i) => ({ ...buildDefenseTemplate(`Defesa ${i}`, value), _id: `${i}` })) });
    const app = new ItemEffectConfigApplication(item);
    await actions.editEffect.call(app, {} as any, target("0"));
    (app as any).element = form({ editValue: "99" });
    await actions.editEffect.call(app, {} as any, target("1"));
    expect((await app._renderHTML()).innerHTML).toContain('name="editValue" placeholder="5 ou (@NEX.value / 5) * 1" value="3"');
    expect(item.effects.get("0").update).not.toHaveBeenCalled();
  });
  it("confirms deletion once, preserves cancellation, and rechecks permissions after approval", async () => {
    const { ItemEffectConfigApplication, actions, confirm } = await editor();
    const item = itemFixture({ effects: [{ ...buildDefenseTemplate("Defesa", 5), _id: "effect" }] });
    const app = new ItemEffectConfigApplication(item);
    await actions.removeEffect.call(app, {} as any, target("effect")); expect(item.deleteEmbeddedDocuments).not.toHaveBeenCalled();
    confirm.mockImplementationOnce(async () => { item.canUserModify.mockReturnValue(false); return true; });
    await actions.removeEffect.call(app, {} as any, target("effect")); expect(item.deleteEmbeddedDocuments).not.toHaveBeenCalled();
    item.canUserModify.mockReturnValue(true); confirm.mockResolvedValue(true);
    await Promise.all([actions.removeEffect.call(app, {} as any, target("effect")), actions.removeEffect.call(app, {} as any, target("effect"))]);
    expect(confirm).toHaveBeenCalledTimes(3); expect(item.deleteEmbeddedDocuments).toHaveBeenCalledExactlyOnceWith("ActiveEffect", ["effect"]);
  });
  it("does not import on render or cancellation, and confirms the current preview explicitly", async () => {
    const { ItemEffectConfigApplication, actions, confirm } = await editor();
    const item = itemFixture({ flags: { [scope]: { allyAbility: { version: 1, benefits: [{ id: "old", kind: "defense", value: 5 }] } } } }, { type: `${scope}.ally` });
    const before = item.toObject(); const app = new ItemEffectConfigApplication(item);
    expect((await app._renderHTML()).innerHTML).toContain("Importar benefícios legados");
    await app.render(); await actions.importLegacy.call(app);
    expect(item.toObject()).toEqual(before); expect(item.createEmbeddedDocuments).not.toHaveBeenCalled();
    confirm.mockResolvedValue(true); await actions.importLegacy.call(app);
    expect(item.effects.contents).toHaveLength(1); expect(item.getFlag(scope, "allyEffectsMigration")).toEqual({ version: 1 });
  });
  it("opens complex effects natively, supports read-only consultation and closes deleted sources", async () => {
    const { ItemEffectConfigApplication, actions, subscriptions } = await editor();
    const item = itemFixture({ effects: [{ ...buildDefenseTemplate("Condição", 5), _id: "effect", statuses: ["blind"] }] });
    const app = new ItemEffectConfigApplication(item);
    await actions.editEffect.call(app, {} as any, target("effect"));
    item.canUserModify.mockReturnValue(false);
    await actions.advancedEffect.call(app, {} as any, target("effect"));
    expect(item.effects.get("effect").sheet.render).toHaveBeenCalledTimes(2);
    subscriptions.get("deleteItem")![0](item);
    await vi.waitFor(() => expect(Hooks.off).toHaveBeenCalledTimes(7));
  });
});
