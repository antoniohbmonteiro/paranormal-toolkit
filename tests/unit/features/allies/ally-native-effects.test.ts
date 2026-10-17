import { beforeEach, describe, expect, it, vi } from "vitest";
import { AllyEffectConfigService } from "../../../../src/features/allies/ally-effect-config-service";
import { migrateAllyAbilityEffects } from "../../../../src/features/allies/ally-effect-migration-service";
import { readAllyAbility } from "../../../../src/features/allies/config/ally-ability-config";
import { buildAllyPresetTemplate, buildCustomTemplate, buildDefenseTemplate } from "../../../../src/adapters/ordem/ordem-ally-effect-presets";
import { buildOrdemEffectPreset } from "../../../../src/adapters/ordem/ordem-effect-presets";
import { resolveAllyBenefits } from "../../../../src/core/allies/ally-benefit-resolver";
import { readEffectTemplate } from "../../../../src/core/allies/ally-passive-effect";
import { AllyReconciliationService } from "../../../../src/features/allies/ally-reconciliation-service";
import { OrdemAllyBenefitAdapter } from "../../../../src/adapters/ordem/ordem-ally-benefit-adapter";

const scope = "paranormal-toolkit";
import { effect, itemFixture } from "../../../helpers/item-effects";
function formFields(values: Record<string, string>) {
  return { querySelector: (selector: string) => {
    const name = /\[name="(\w+)"\]/.exec(selector)?.[1];
    return name !== undefined && name in values ? { value: values[name], focus: vi.fn() } : null;
  } };
}
function formTarget(values: Record<string, string>): any {
  return { closest: () => formFields(values) };
}
function presetTemplate(input: { presetId: string; value: string; skillId?: string }) {
  const result = buildOrdemEffectPreset(input);
  if (!result.ok) throw new Error(result.error);
  return buildAllyPresetTemplate(result.value);
}
async function loadEditor(renders: unknown[] = []) {
  vi.resetModules();
  const confirm = vi.fn().mockResolvedValue(false);
  const warn = vi.fn();
  vi.stubGlobal("foundry", { applications: { api: { ApplicationV2: class {
    async render() { renders.push(this); return this; }
  }, DialogV2: { confirm } } } });
  vi.stubGlobal("Hooks", { on: vi.fn(), off: vi.fn() });
  vi.stubGlobal("ui", { notifications: { warn } });
  vi.stubGlobal("document", { createElement: () => ({ innerHTML: "" }) });
  const { AllyAbilityConfigApplication } = await import("../../../../src/applications/ally-ability-config-application");
  return { AllyAbilityConfigApplication, actions: AllyAbilityConfigApplication.DEFAULT_OPTIONS.actions, confirm, warn };
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
    await actions.addBenefit.call(app, {} as PointerEvent, formTarget({ presetId: "defense", value: "5" }));
    await actions.createCustom.call(app);
    expect(readAllyAbility(item)!.benefits).toHaveLength(embedded ? 2 : 0);
    for (const call of item.createEmbeddedDocuments.mock.calls) {
      expect(call[1][0].transfer).toBe(!embedded);
      if (embedded) expect(call[1][0].flags[scope].allyPassive).toEqual({ version: 1 });
      else expect(call[1][0]).not.toHaveProperty("flags");
    }
    expect(item.effects.contents[1].sheet.render).toHaveBeenCalledWith({ force: true });
    await item.createEmbeddedDocuments("ActiveEffect", [{ ...buildDefenseTemplate("Efeito antigo não selecionado", 99), _id: "old", transfer: true }]);
    const oldSource = item.effects.get("old").toObject();
    const html = (await app._renderHTML()).innerHTML;
    if (embedded) expect(html).not.toContain("Efeito antigo não selecionado");
    else expect(html).toContain("Efeito antigo não selecionado");
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
  it.each([false, true])("creates every functional preset through the add action and refuses unavailable or invalid input (embedded=%s)", async embedded => {
    const { AllyAbilityConfigApplication, actions, warn } = await loadEditor();
    const item = itemFixture({}, embedded ? { id: "iris", type: `${scope}.ally` } : null);
    const app = new AllyAbilityConfigApplication(item);
    const expected = [
      ["defense", undefined, "Bônus de Defesa", "system.defense.value"],
      ["skill", "occultism", "Bônus de Perícia (Ocultismo)", "system.skills.occultism.value"],
      ["movement", undefined, "Bônus de Deslocamento", "system.desloc.value"],
      ["maxPV", undefined, "Bônus de PV máximo", "system.PV.bonus"],
      ["maxPE", undefined, "Bônus de PE máximo", "system.PE.bonus"],
      ["maxPD", undefined, "Bônus de PD máximo", "system.PD.bonus"],
    ] as const;
    for (const [presetId, skillId] of expected) {
      await actions.addBenefit.call(app, {} as PointerEvent, formTarget({ presetId, value: "3", ...(skillId ? { skillId } : {}) }));
    }
    expect(warn).not.toHaveBeenCalled();
    expect(item.createEmbeddedDocuments).toHaveBeenCalledTimes(expected.length);
    item.createEmbeddedDocuments.mock.calls.forEach((call: any[], index: number) => {
      expect(call[1][0]).toMatchObject({ name: expected[index][2], type: "base", transfer: !embedded, disabled: false,
        ...(embedded ? { flags: { [scope]: { allyPassive: { version: 1 } } } } : {}),
        system: { changes: [{ key: expected[index][3], type: "add", value: 3, phase: "initial", priority: 20 }] } });
    });
    expect(readAllyAbility(item)!.benefits).toHaveLength(embedded ? expected.length : 0);
    for (const [values, message] of [
      [{ presetId: "diceBonus", value: "3" }, "AINDA NÃO IMPLEMENTADO NO SISTEMA"],
      [{ presetId: "skill", value: "3", skillId: "freeSkill" }, "Selecione uma perícia válida."],
      [{ presetId: "defense", value: "1.5" }, "Informe um valor inteiro diferente de zero ou uma fórmula com referências como @NEX.value."],
      [{ presetId: "defense", value: "" }, "Informe um valor inteiro diferente de zero ou uma fórmula com referências como @NEX.value."],
    ] as const) {
      await actions.addBenefit.call(app, {} as PointerEvent, formTarget(values));
      expect(warn).toHaveBeenLastCalledWith(message);
    }
    expect(item.createEmbeddedDocuments).toHaveBeenCalledTimes(expected.length);
  });
  it("keeps the draft across renders and re-renders only when the preset changes", async () => {
    const renders: unknown[] = [];
    const { AllyAbilityConfigApplication, actions } = await loadEditor(renders);
    const item = itemFixture();
    const app: any = new AllyAbilityConfigApplication(item);
    const values: Record<string, string> = { presetId: "defense", value: "7" };
    app.element = formFields(values);
    app._onChangeForm({}, { target: { getAttribute: () => "value" } });
    expect(renders).toHaveLength(0);
    values.presetId = "skill";
    app._onChangeForm({}, { target: { getAttribute: () => "presetId" } });
    await vi.waitFor(() => expect(renders).toHaveLength(1));
    const html = (await app._renderHTML()).innerHTML as string;
    expect(html).toContain('<option value="skill" selected>');
    expect(html).toContain('name="skillId"');
    expect(html).toContain('value="7"');
    values.skillId = "occultism";
    app._onChangeForm({}, { target: { getAttribute: () => "skillId" } });
    expect(renders).toHaveLength(1);
    await actions.addBenefit.call(app, {} as PointerEvent, { closest: () => app.element } as any);
    expect(item.createEmbeddedDocuments.mock.calls[0][1][0]).toMatchObject({ name: "Bônus de Perícia (Ocultismo)",
      system: { changes: [{ key: "system.skills.occultism.value", value: 7 }] } });
    expect((await app._renderHTML()).innerHTML).toContain("Ocultismo +7");
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
    await migrateAllyAbilityEffects(item, { confirmed: true }); await migrateAllyAbilityEffects(item, { confirmed: true });
    expect(item.effects.contents).toHaveLength(1);
    expect(readAllyAbility(item)!.benefits[0]).toMatchObject({ id: "old-defense", template: { system: { changes: [{ value: 7 }] } } });
    expect(item.toObject().flags[scope].allyAbility.customUnknown).toBe("preserved");
    expect(item.toObject().flags.other.keep).toBe(1);
    const copy = itemFixture(item.toObject(), { id: "iris", type: `${scope}.ally` });
    await migrateAllyAbilityEffects(copy, { confirmed: true }); expect(copy.effects.contents).toHaveLength(1);
  });
  it("recovers an interrupted marker write without duplicate effects", async () => {
    const item = itemFixture({ flags: { [scope]: { allyAbility: { version: 1, benefits: [{ id: "legacy", kind: "defense", value: 5 }] } } } });
    item.setFlag.mockRejectedValueOnce(new Error("lost response"));
    await expect(migrateAllyAbilityEffects(item, { confirmed: true })).rejects.toThrow("lost response");
    const id = item.effects.contents[0].id;
    await migrateAllyAbilityEffects(item, { confirmed: true });
    expect(item.effects.contents).toHaveLength(1); expect(item.effects.contents[0].id).toBe(id);
  });
  it("does not alter unknown legacy definitions", async () => {
    const item = itemFixture({ flags: { [scope]: { allyAbility: { version: 99, custom: "unknown" } } } });
    const before = item.toObject();
    await expect(migrateAllyAbilityEffects(item, { confirmed: true })).rejects.toThrow("inválidos");
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
  it("projects skill, movement and resource maximum presets, updates in place and cleans up on disable and removal", async () => {
    const item = itemFixture({}, { id: "iris", type: `${scope}.ally` }); const editor = new AllyEffectConfigService(item);
    const skill = await editor.create(presetTemplate({ presetId: "skill", value: "4", skillId: "occultism" }));
    const pv = await editor.create(presetTemplate({ presetId: "maxPV", value: "5" }));
    const movement = await editor.create(presetTemplate({ presetId: "movement", value: "3" }));
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
      abilities: [{ id: item.id, definition: readAllyAbility(item)! }] }]), registry,
      async value => { registry = structuredClone(value); });
    const projected = () => Object.fromEntries([...existing.values()].map(entry => {
      const [change] = entry.toObject().system.changes; return [change.key, change.value];
    }));
    await reconcile();
    expect(projected()).toEqual({ "system.skills.occultism.value": 4, "system.PV.bonus": 5, "system.desloc.value": 3 });
    expect([...existing.values()].every(entry => entry.toObject().origin === "Actor.iris" && entry.toObject().transfer === false)).toBe(true);
    const pvProjectionId = registry.find(entry => entry.sourceEffectId === pv.id).effectId;
    await item.effects.get(pv.id).update({ "system.changes": presetTemplate({ presetId: "maxPV", value: "8" }).system.changes });
    await reconcile();
    expect(existing.get(pvProjectionId).toObject().system.changes[0].value).toBe(8);
    const writes = () => [actor.createEmbeddedDocuments.mock.calls.length, actor.updateEmbeddedDocuments.mock.calls.length, actor.deleteEmbeddedDocuments.mock.calls.length];
    const before = writes();
    for (let turn = 0; turn < 5; turn++) await reconcile();
    expect(writes()).toEqual(before);
    await item.effects.get(skill.id).update({ disabled: true }); await reconcile();
    expect(projected()).toEqual({ "system.PV.bonus": 8, "system.desloc.value": 3 });
    await new AllyEffectConfigService(item).remove(movement.id); await reconcile();
    expect(projected()).toEqual({ "system.PV.bonus": 8 });
    await reconciler.reconcile([], registry, async value => { registry = structuredClone(value); });
    expect(existing.size).toBe(0);
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
