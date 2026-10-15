import { describe, expect, it, vi } from "vitest";
import { foundryDataModel } from "./helpers/foundry-data-model";
import { buildDefenseTemplate } from "../../src/adapters/ordem/ordem-ally-effect-presets";
import { buildAllyDefenseEffect, OrdemAllyBenefitAdapter } from "../../src/adapters/ordem/ordem-ally-benefit-adapter";

const root = process.env.PARANORMAL_TOOLKIT_FOUNDRY_REFERENCE;
function nativeEffects() {
  const native = foundryDataModel(root!);
  const Model = native.load("common/data/active-effect.mjs", {
    "../abstract/type-data.mjs": { default: native.TypeDataModel }, "./fields.mjs": native.fields,
  }).default;
  const DocumentDouble = native.load("common/abstract/document.mjs", {
    "./data.mjs": { default: native.DataModel }, "../utils/helpers.mjs": native.helpers,
    "../constants.mjs": { BASE_DOCUMENT_TYPE: "base" }, "../utils/logging.mjs": { logCompatibilityWarning: () => {} },
    "../data/fields.mjs": native.fields, "../data/operators.mjs": native.load("common/data/operators.mjs", {}),
  }).default;
  const Base = native.load("common/documents/active-effect.mjs", {
    "../abstract/document.mjs": { default: DocumentDouble }, "../data/fields.mjs": native.fields,
    "../utils/helpers.mjs": native.helpers,
  }).default;
  return { ...native, Model, Base };
}
describe.skipIf(!root)("native v14 effect migration and serialized comparison (document parent/database doubled)", () => {
  it("proves old root changes are migrated into system and numeric strings become numbers", () => {
    const native = nativeEffects();
    const legacy = native.nativeObject({ name: "Defesa", changes: [
      { key: "system.defense.value", type: "add", phase: "initial", priority: 20, value: "5" },
    ] });
    native.Base.migrateData(legacy);
    expect(legacy).not.toHaveProperty("changes");
    const model = new native.Model(legacy.system);
    expect(model.changes[0].value).toBe(5);
    expect(model.changes[0].value === "5").toBe(false);
    expect(model.toObject().changes[0]).toMatchObject({ value: 5, phase: "initial", type: "add" });
  });
  it("matches five unchanged preparations with native numeric values and ignores prepared formula changes", () => {
    const native = nativeEffects();
    const managed = { actorId: "mauro", allyId: "iris", effectId: "projection", itemId: "ability", sourceEffectId: "native-source",
      sourceKey: '["iris","ability","native-source"]', template: buildDefenseTemplate("Defesa", 5) };
    vi.stubGlobal("game", { actors: { get: () => undefined } });
    const data = buildAllyDefenseEffect(managed);
    const model = new native.Model(native.nativeObject(data.system));
    const actual = { disabled: false, transfer: false, system: model,
      toObject: () => ({ ...data, system: model.toObject(true) }),
      getFlag: () => (data.flags as any)["paranormal-toolkit"].allyBenefit };
    const create = vi.fn(), update = vi.fn(), remove = vi.fn();
    vi.stubGlobal("game", { actors: { get: (id: string) => id === "iris" ? { uuid: "Actor.iris" } : {
      effects: { get: () => actual }, createEmbeddedDocuments: create, updateEmbeddedDocuments: update, deleteEmbeddedDocuments: remove,
    } } });
    const adapter = new OrdemAllyBenefitAdapter(() => {});
    for (let turn = 0; turn < 5; turn++) {
      model.changes[0].value = 999;
      model.changes[0].effect = actual;
      expect(adapter.matches(managed)).toBe(true);
    }
    expect(create).not.toHaveBeenCalled(); expect(update).not.toHaveBeenCalled(); expect(remove).not.toHaveBeenCalled();
    expect(model.toObject(true).changes[0].value).toBe(5);
  });
  it("uses the native ActorSheetV2 drop path to copy embedded effects without changing the directory Item", async () => {
    const native = foundryDataModel(root!);
    const create = vi.fn(async (data, options) => ({ data, options }));
    const Sheet = native.load("client/applications/sheets/actor-sheet.mjs", {
      "../api/document-sheet.mjs": { default: class {} }, "../apps/image-popout.mjs": { default: class {} },
      "../../documents/active-effect.mjs": { default: class {} }, "../../documents/item.mjs": { default: { implementation: { create } } },
      "../ux/_module.mjs": {}, "../../helpers/hooks.mjs": {},
    }).default;
    const original = { name: "Proteção", type: "ability", system: { description: "Original" }, effects: [
      { ...buildDefenseTemplate("Defesa", 5), _id: "effect-source", transfer: false,
        flags: { "paranormal-toolkit": { allyPassive: { version: 1 } } } },
    ] };
    const actor = { uuid: "Actor.iris", isOwner: true, items: { has: () => false } };
    const item = { id: "ability", parent: null, inCompendium: false, toObject: () => structuredClone(original) };
    await Sheet.prototype._onDropItem.call({ actor }, {}, item);
    expect(create).toHaveBeenCalledWith(original, { parent: actor, keepId: true });
    const copy = create.mock.calls[0][0]; copy.effects[0].system.changes[0].value = 10;
    expect(original.effects[0].system.changes[0].value).toBe(5);
  });
});
