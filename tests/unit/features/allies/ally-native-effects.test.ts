import { beforeEach, describe, expect, it, vi } from "vitest";
import { AllyEffectConfigService } from "../../../../src/features/allies/ally-effect-config-service";
import { migrateAllyAbilityEffects } from "../../../../src/features/allies/ally-effect-migration-service";
import { readAllyAbility } from "../../../../src/features/allies/config/ally-ability-config";
import { buildCustomTemplate, buildDefenseTemplate } from "../../../../src/adapters/ordem/ordem-ally-effect-presets";
import { resolveAllyBenefits } from "../../../../src/core/allies/ally-benefit-resolver";
import { readEffectTemplate } from "../../../../src/core/allies/ally-passive-effect";
import { AllyReconciliationService } from "../../../../src/features/allies/ally-reconciliation-service";
import { OrdemAllyBenefitAdapter } from "../../../../src/adapters/ordem/ordem-ally-benefit-adapter";

const scope = "paranormal-toolkit";
function apply(data: any, changes: any) {
  for (const [key, value] of Object.entries(changes)) {
    const parts = key.split("."); let target = data;
    for (const part of parts.slice(0, -1)) target = target[part] ??= {};
    target[parts.at(-1)!] = structuredClone(value);
  }
}
function effect(data: any, parent?: any): any {
  let source = structuredClone(data);
  return { id: source._id, get name() { return source.name; }, get disabled() { return source.disabled ?? false; },
    get transfer() { return source.transfer ?? false; }, parent, get system() { return structuredClone(source.system); },
    toObject: () => structuredClone(source), getFlag: (_scope: string, key: string) => source.flags?.[_scope]?.[key],
    update: vi.fn(async changes => { apply(source, changes); }),
    updateSource: vi.fn(changes => apply(source, changes)),
    unsetFlag: vi.fn(async (_scope: string, key: string) => { delete source.flags?.[_scope]?.[key]; }),
    sheet: { render: vi.fn(async () => {}) },
    replace: (data: any) => { source = structuredClone(data); },
  };
}
export function itemFixture(data: any = {}, parent: any = null): any {
  let count = 0;
  const source = { _id: "ability", name: "Habilidade", type: "ability", ...structuredClone(data) };
  const effects: any[] = [];
  const item: any = { id: source._id, name: source.name, type: source.type, parent,
    uuid: parent ? `Actor.${parent.id}.Item.${source._id}` : `Item.${source._id}`,
    effects: { contents: effects, get: (id: string) => effects.find(entry => entry.id === id) },
    canUserModify: vi.fn(() => true),
    getFlag: (_scope: string, key: string) => source.flags?.[_scope]?.[key],
    setFlag: vi.fn(async (_scope: string, key: string, value: any) => { ((source.flags ??= {})[_scope] ??= {})[key] = structuredClone(value); }),
    toObject: () => ({ ...structuredClone(source), effects: effects.map(entry => entry.toObject(true)) }),
    createEmbeddedDocuments: vi.fn(async (_type: string, entries: any[]) => {
      const created = entries.map(entry => effect({ ...entry, _id: entry._id ?? `native-effect-${++count}` }, item));
      effects.push(...created); return created;
    }),
    deleteEmbeddedDocuments: vi.fn(async (_type: string, ids: string[]) => {
      for (const id of ids) { const index = effects.findIndex(entry => entry.id === id); if (index >= 0) effects.splice(index, 1); }
    }),
  };
  for (const entry of source.effects ?? []) effects.push(effect(entry, item));
  return item;
}
beforeEach(() => {
  vi.stubGlobal("game", { user: { id: "gm", isGM: true }, actors: { get: () => undefined } });
});
describe("native passive effect editing on ordinary ability Items", () => {
  it.each([false, true])("creates marked benefits through the actual editor actions and confirms source deletion (embedded=%s)", async embedded => {
    vi.resetModules();
    const confirm = vi.fn().mockResolvedValue(false);
    vi.stubGlobal("foundry", { applications: { api: { ApplicationV2: class {
      async render() { return this; }
    }, DialogV2: { confirm } } } });
    vi.stubGlobal("Hooks", { on: vi.fn(), off: vi.fn() });
    vi.stubGlobal("ui", { notifications: { warn: vi.fn() } });
    vi.stubGlobal("document", { createElement: () => ({ innerHTML: "" }) });
    const { AllyAbilityConfigApplication } = await import("../../../../src/applications/ally-ability-config-application");
    const item = itemFixture({}, embedded ? { id: "iris", type: `${scope}.ally` } : null);
    const app = new AllyAbilityConfigApplication(item);
    const actions = AllyAbilityConfigApplication.DEFAULT_OPTIONS.actions;
    expect(actions).not.toHaveProperty("selectEffect");
    const createTarget = { closest: () => ({ querySelector: (key: string) => ({ value: key === "[data-effect-name]" ? "Benefício" : "5" }) }) } as any;
    await actions.createDefense.call(app, {} as PointerEvent, createTarget);
    await actions.createCustom.call(app, {} as PointerEvent, createTarget);
    expect(readAllyAbility(item)!.benefits).toHaveLength(2);
    for (const call of item.createEmbeddedDocuments.mock.calls) {
      expect(call[1][0]).toMatchObject({ transfer: false, flags: { [scope]: { allyPassive: { version: 1 } } } });
    }
    expect(item.effects.contents[1].sheet.render).toHaveBeenCalledWith({ force: true });
    await item.createEmbeddedDocuments("ActiveEffect", [{ ...buildDefenseTemplate("Efeito antigo não selecionado", 99), _id: "old", transfer: true }]);
    const oldSource = item.effects.get("old").toObject();
    const html = (await app._renderHTML()).innerHTML;
    expect(html).not.toContain("Efeito antigo não selecionado");
    expect(html).not.toContain('data-action="selectEffect"');
    const id = item.effects.contents[0].id;
    const removeTarget = { dataset: { effectId: id } } as any;
    await actions.removeEffect.call(app, {} as PointerEvent, removeTarget);
    expect(confirm).toHaveBeenCalledOnce(); expect(item.effects.get(id)).toBeDefined();
    expect(item.deleteEmbeddedDocuments).not.toHaveBeenCalled();
    confirm.mockResolvedValue(true);
    await actions.removeEffect.call(app, {} as PointerEvent, removeTarget);
    expect(item.deleteEmbeddedDocuments).toHaveBeenCalledWith("ActiveEffect", [id]);
    expect(item.effects.get(id)).toBeUndefined();
    expect(item.effects.get("old").toObject()).toEqual(oldSource);
  });
  it.each([5, 7, 10])("creates an editable native defense preset with bonus %s in the directory", async value => {
    const item = itemFixture({ system: { description: "Preserved", abilityType: "ability" } });
    const created = await new AllyEffectConfigService(item).create(buildDefenseTemplate("Proteção", value));
    const data = created.toObject(true);
    expect(data).toMatchObject({ name: "Proteção", type: "base", transfer: false,
      flags: { [scope]: { allyPassive: { version: 1 } } },
      system: { changes: [{ key: "system.defense.value", value, type: "add", phase: "initial", priority: 20 }] } });
    expect(data).not.toHaveProperty("changes");
    expect(item.toObject().system.description).toBe("Preserved");
    expect(readAllyAbility(item)!.benefits).toHaveLength(1);
    expect(item.createEmbeddedDocuments.mock.calls[0][1][0].flags[scope].allyPassive).toEqual({ version: 1 });
    expect(created.update).not.toHaveBeenCalled();
    await new AllyEffectConfigService(item).open(created.id);
    expect(created.sheet.render).toHaveBeenCalledWith({ force: true });
  });
  it("creates a custom native effect, allowing independent keys and multiple changes", async () => {
    const item = itemFixture(); const service = new AllyEffectConfigService(item);
    const created = await service.create(buildCustomTemplate());
    await created.update({ "system.changes": [
      { key: "system.movement.land", value: 3, type: "add", phase: "initial", priority: null },
      { key: "system.custom.unknown", value: "@NEX.value", type: "override", phase: "derived", priority: 50 },
    ] });
    expect(readAllyAbility(item)!.benefits[0].template.system.changes).toHaveLength(2);
  });
  it("copies native embedded effects and edits the copy independently of the directory source", async () => {
    const original = itemFixture();
    await new AllyEffectConfigService(original).create(buildDefenseTemplate("Defesa", 5));
    const copy = itemFixture(original.toObject(true), { id: "iris", type: `${scope}.ally` });
    const sourceId = original.effects.contents[0].id;
    expect(copy.effects.contents[0].toObject()).toEqual(original.effects.contents[0].toObject());
    await copy.effects.get(sourceId).update({ "system.changes": [{ key: "system.defense.value", value: 10, type: "add", phase: "initial", priority: 20 }] });
    expect(readAllyAbility(copy)!.benefits[0].template.system.changes[0].value).toBe(10);
    expect(readAllyAbility(original)!.benefits[0].template.system.changes[0].value).toBe(5);
  });
  it("automatically includes created benefits and leaves previously unmarked effects intact", async () => {
    const item = itemFixture(); const service = new AllyEffectConfigService(item);
    await service.create(buildDefenseTemplate("Defesa", 5));
    await item.createEmbeddedDocuments("ActiveEffect", [{ ...buildCustomTemplate("Outro"), flags: { another: { preserve: true } } }]);
    const before = item.effects.contents[1].toObject();
    expect(readAllyAbility(item)!.benefits).toHaveLength(1);
    await expect(service.remove(item.effects.contents[1].id)).rejects.toThrow("Benefício passivo");
    await expect(service.open(item.effects.contents[1].id)).rejects.toThrow("Benefício passivo");
    expect(item.effects.contents[1].toObject()).toEqual(before);
  });
  it.each([false, true])("uses Item ownership for standalone and embedded abilities (embedded=%s)", async embedded => {
    const item = itemFixture({}, embedded ? { id: "iris", type: `${scope}.ally` } : null);
    item.canUserModify.mockReturnValue(false);
    await expect(new AllyEffectConfigService(item).create(buildDefenseTemplate("Defesa", 5))).rejects.toThrow("permissão");
    expect(item.createEmbeddedDocuments).not.toHaveBeenCalled();
  });
  it("rejects invalid numeric bonuses and document/permission mutation paths", () => {
    expect(() => buildDefenseTemplate("Defesa", NaN)).toThrow();
    expect(() => buildDefenseTemplate("", 5)).toThrow();
    const data = buildCustomTemplate();
    data.system.changes = [{ key: "ownership.default", value: 3, phase: "initial", priority: 0, type: "override" }];
    expect(readEffectTemplate(data)).toBeNull();
  });
});
describe("idempotent legacy ability migration", () => {
  it("preserves flags and benefit identity, creating one native effect across retries and copies", async () => {
    const item = itemFixture({ flags: { other: { keep: 1 }, [scope]: { allyAbility: {
      version: 1, customUnknown: "preserved", benefits: [{ id: "old-defense", kind: "defense", value: 7 }],
    } } } });
    await migrateAllyAbilityEffects(item); await migrateAllyAbilityEffects(item);
    expect(item.effects.contents).toHaveLength(1);
    expect(readAllyAbility(item)!.benefits[0]).toMatchObject({ id: "old-defense", template: { system: { changes: [{ value: 7 }] } } });
    expect(item.toObject().flags[scope].allyAbility.customUnknown).toBe("preserved");
    expect(item.toObject().flags.other.keep).toBe(1);
    const copy = itemFixture(item.toObject(), { id: "iris", type: `${scope}.ally` });
    await migrateAllyAbilityEffects(copy); expect(copy.effects.contents).toHaveLength(1);
  });
  it("recovers an interrupted marker write without duplicate effects", async () => {
    const item = itemFixture({ flags: { [scope]: { allyAbility: { version: 1, benefits: [{ id: "legacy", kind: "defense", value: 5 }] } } } });
    item.setFlag.mockRejectedValueOnce(new Error("lost response"));
    await expect(migrateAllyAbilityEffects(item)).rejects.toThrow("lost response");
    const id = item.effects.contents[0].id;
    await migrateAllyAbilityEffects(item);
    expect(item.effects.contents).toHaveLength(1); expect(item.effects.contents[0].id).toBe(id);
  });
  it("does not alter unknown legacy definitions", async () => {
    const item = itemFixture({ flags: { [scope]: { allyAbility: { version: 99, custom: "unknown" } } } });
    const before = item.toObject();
    await expect(migrateAllyAbilityEffects(item)).rejects.toThrow("inválidos");
    expect(item.toObject()).toEqual(before);
    expect(item.setFlag).not.toHaveBeenCalled();
  });
});
describe("native projection writes and identity", () => {
  it("projects defense and custom religion automatically after copying, then synchronizes native edits, disable, enable and source deletion", async () => {
    const original = itemFixture(); const editor = new AllyEffectConfigService(original);
    const defense = await editor.create(buildDefenseTemplate("Defesa", 5));
    const religion = await editor.create(buildCustomTemplate("Religião +6"));
    expect(religion.toObject().flags[scope].allyPassive).toEqual({ version: 1 });
    expect(religion.update).not.toHaveBeenCalled();
    await religion.update({ "system.changes": [{ key: "system.skills.religion.mod", value: 6, type: "add", phase: "initial", priority: 20 }] });
    expect(religion.getFlag(scope, "allyPassive")).toEqual({ version: 1 });
    const copy = itemFixture(original.toObject(), { id: "iris", type: `${scope}.ally` });
    await copy.createEmbeddedDocuments("ActiveEffect", [{ ...buildDefenseTemplate("Não selecionado", 99), _id: "unmarked", transfer: true }]);
    const unmarked = copy.effects.get("unmarked").toObject();
    const existing = new Map<string, any>();
    const actor = { type: "agent", isToken: false, effects: { get: (id: string) => existing.get(id) },
      createEmbeddedDocuments: vi.fn(async (_type, entries) => { for (const data of entries) existing.set(data._id, effect(data)); }),
      updateEmbeddedDocuments: vi.fn(async (_type, entries) => {
        for (const entry of entries) existing.get(entry._id).replace({ ...entry, system: entry.system.value });
      }),
      deleteEmbeddedDocuments: vi.fn(async (_type, ids) => { for (const id of ids) existing.delete(id); }),
    };
    vi.stubGlobal("game", { user: { id: "gm", isGM: true }, actors: { get: (id: string) => id === "iris" ? { uuid: "Actor.iris" } : actor } });
    let nextId = 0;
    vi.stubGlobal("foundry", { utils: { randomID: () => `projection-${++nextId}` }, data: { operators: {
      ForcedReplacement: class { constructor(public value: unknown) {} },
    } } });
    const reconciler = new AllyReconciliationService(new OrdemAllyBenefitAdapter(() => {}));
    let registry: any[] = [];
    const reconcile = async () => reconciler.reconcile(resolveAllyBenefits([{ allyId: "iris",
      state: { status: "active", beneficiaryId: "mauro", sequence: 1, wait: null },
      abilities: [{ id: copy.id, definition: readAllyAbility(copy)! }] }]), registry,
      async value => { registry = structuredClone(value); });
    await reconcile();
    expect(existing.size).toBe(2);
    expect([...existing.values()].map(entry => entry.toObject().system.changes[0].value).sort()).toEqual([5, 6]);
    expect([...existing.values()].every(entry => entry.toObject().origin === "Actor.iris")).toBe(true);
    const defenseProjectionId = registry.find(entry => entry.sourceEffectId === defense.id).effectId;
    await copy.effects.get(defense.id).update({ "system.changes": buildDefenseTemplate("Defesa", 10).system.changes });
    await reconcile();
    expect(existing.get(defenseProjectionId).toObject().system.changes[0].value).toBe(10);
    expect(readAllyAbility(original)!.benefits[0].template.system.changes[0].value).toBe(5);
    await copy.effects.get(religion.id).update({ disabled: true }); await reconcile();
    expect(existing.size).toBe(1); expect(copy.effects.get(religion.id)).toBeDefined();
    await copy.effects.get(religion.id).update({ disabled: false }); await reconcile();
    expect(existing.size).toBe(2);
    const writeCounts = [actor.createEmbeddedDocuments.mock.calls.length, actor.updateEmbeddedDocuments.mock.calls.length, actor.deleteEmbeddedDocuments.mock.calls.length];
    for (let turn = 0; turn < 5; turn++) await reconcile();
    expect([actor.createEmbeddedDocuments.mock.calls.length, actor.updateEmbeddedDocuments.mock.calls.length, actor.deleteEmbeddedDocuments.mock.calls.length]).toEqual(writeCounts);
    expect(itemFixture(copy.toObject(), copy.parent).toObject()).toEqual(copy.toObject());
    await new AllyEffectConfigService(copy).remove(religion.id); await reconcile();
    expect(copy.effects.get(religion.id)).toBeUndefined(); expect(existing.size).toBe(1);
    expect(existing.has(defenseProjectionId)).toBe(true);
    expect(copy.effects.get("unmarked").toObject()).toEqual(unmarked);
  });
  it("updates +5 to +10 in place and performs zero writes across five unchanged turns", async () => {
    const item = itemFixture();
    await new AllyEffectConfigService(item).create(buildDefenseTemplate("Defesa", 5));
    const existing = new Map<string, any>();
    const actor = { type: "agent", isToken: false, effects: { get: (id: string) => existing.get(id) },
      createEmbeddedDocuments: vi.fn(async (_type, entries) => { for (const data of entries) existing.set(data._id, effect(data)); }),
      updateEmbeddedDocuments: vi.fn(async (_type, entries) => {
        for (const entry of entries) { const data = { ...entry, system: entry.system.value }; existing.get(entry._id).replace(data); }
      }),
      deleteEmbeddedDocuments: vi.fn(async (_type, ids) => { for (const id of ids) existing.delete(id); }),
    };
    vi.stubGlobal("game", { actors: { get: (id: string) => id === "iris" ? { uuid: "Actor.iris" } : actor } });
    vi.stubGlobal("foundry", { utils: { randomID: () => "stable-projection" }, data: { operators: {
      ForcedReplacement: class { constructor(public value: unknown) {} },
    } } });
    const service = new AllyReconciliationService(new OrdemAllyBenefitAdapter(() => {}));
    let registry: any[] = [];
    const persist = async (value: any[]) => { registry = structuredClone(value); };
    const desired = () => resolveAllyBenefits([{ allyId: "iris", state: { status: "active", beneficiaryId: "mauro", sequence: 1, wait: null },
      abilities: [{ id: item.id, definition: readAllyAbility(item)! }] }]);
    await service.reconcile(desired(), registry, persist);
    expect(existing.get("stable-projection").toObject().origin).toBe("Actor.iris");
    for (let turn = 0; turn < 5; turn++) await service.reconcile(desired(), registry, persist);
    expect(actor.createEmbeddedDocuments).toHaveBeenCalledTimes(1);
    expect(actor.updateEmbeddedDocuments).not.toHaveBeenCalled(); expect(actor.deleteEmbeddedDocuments).not.toHaveBeenCalled();
    await item.effects.contents[0].update({ "system.changes": [{ key: "system.defense.value", value: 10, type: "add", phase: "initial", priority: 20 }] });
    await service.reconcile(desired(), registry, persist);
    await service.reconcile(desired(), registry, persist);
    expect(actor.updateEmbeddedDocuments).toHaveBeenCalledTimes(1);
    expect(actor.createEmbeddedDocuments).toHaveBeenCalledTimes(1);
    expect(actor.deleteEmbeddedDocuments).not.toHaveBeenCalled();
    expect(existing.get("stable-projection").toObject().system.changes[0].value).toBe(10);
    expect(registry[0].effectId).toBe("stable-projection");
    await service.reconcile([], registry, persist); expect(existing.size).toBe(0);
  });
});
