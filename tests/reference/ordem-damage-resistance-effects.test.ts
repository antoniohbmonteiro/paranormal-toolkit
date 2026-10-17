import { beforeAll, describe, expect, it } from "vitest";
import { foundryDataModel } from "./helpers/foundry-data-model";
import { buildOrdemEffectPreset } from "../../src/adapters/ordem/ordem-effect-presets";
import { buildAllyPresetTemplate } from "../../src/adapters/ordem/ordem-ally-effect-presets";
import { ORDEM_DAMAGE_TYPE_IDS } from "../../src/adapters/ordem/ordem-damage-types";
import { resolveAllyBenefits } from "../../src/core/allies/ally-benefit-resolver";

const root = process.env.PARANORMAL_TOOLKIT_FOUNDRY_REFERENCE;
const ordem = process.env.PARANORMAL_TOOLKIT_ORDEM_REFERENCE;

// Real fields, AE application phases/filtering, Ordem preparation and damage. Database and base document lifecycle are doubled.
function runtime() {
  const native = foundryDataModel(root!);
  native.evaluate(`globalThis.game={release:{generation:14},model:{Actor:{agent:{}}},compendiumArt:{applyArt:(_cls,source)=>source},
    system:{documentTypes:{Actor:{agent:{}}}},settings:{get:()=>false},i18n:{localize:key=>key}};
    globalThis.CONFIG={Actor:{dataModels:{}},ActiveEffect:{phases:{},changeTypes:{}},specialStatusEffects:{},op:{skills:{}}};
    globalThis.CONST={ACTIVE_EFFECT_CHANGE_TYPES:{add:20,override:50},ACTIVE_EFFECT_CHANGE_PHASES:['initial','final']};
    globalThis.ui={notifications:{warn:()=>{}}}; globalThis.canvas={scene:null}; foundry.utils.IterableWeakMap=Map;`);
  const Empty = class { static metadata = native.nativeObject({}); };
  const BaseEffect = native.load("common/documents/active-effect.mjs", {
    "../abstract/document.mjs": { default: Empty }, "../data/fields.mjs": native.fields,
    "../utils/helpers.mjs": native.helpers,
  }).default;
  const AE = native.load("client/documents/active-effect.mjs", {
    "@common/documents/active-effect.mjs": { default: BaseEffect }, "./abstract/client-document.mjs": { default: (base: any) => base },
    "./actor.mjs": { default: Empty }, "./item.mjs": { default: Empty }, "../helpers/hooks.mjs": { default: {} },
    "@client/helpers/active-effect-registry.mjs": { default: Empty }, "@client/dice/roll.mjs": { default: Empty },
    "@common/constants.mjs": { ACTIVE_EFFECT_EXPIRY_EVENTS: [] }, "@client/utils/_module.mjs": { iterateEntries: Object.entries },
  }).default;
  native.evaluate("globalThis.EffectImplementation=nativeExports.default; foundry.documents={ActiveEffect:EffectImplementation}; Object.defineProperty(EffectImplementation,'implementation',{value:EffectImplementation});");
  const Model = native.load("common/data/active-effect.mjs", {
    "../abstract/type-data.mjs": { default: native.TypeDataModel }, "./fields.mjs": native.fields,
  }).default;
  const calc = native.load(`${ordem}/module/helpers/actor-calculations.mjs`, {});
  native.load(`${ordem}/module/data/actors/agent-data.mjs`, { "../../helpers/actor-calculations.mjs": calc });
  native.evaluate(`CONFIG.Actor.dataModels.agent=nativeExports.AgentData;
    globalThis.ActorShape=class extends foundry.abstract.DataModel {
      static documentName='Actor'; static TYPES=['agent']; static metadata={coreTypes:[]};
      static defineSchema(){return {type:new foundry.data.fields.StringField({initial:'agent'}),system:new foundry.data.fields.TypeDataField(this)};}
      get documentName(){return 'Actor';}
      prepareData(){this.reset();this.system.prepareBaseData();this.prepareBaseData();this.prepareEmbeddedDocuments();this.system.prepareDerivedData();this.prepareDerivedData();}
      prepareEmbeddedDocuments(){} prepareDerivedData(){}
    };`);
  const Shape = native.evaluate("ActorShape");
  native.load("client/documents/actor.mjs", {
    "@common/documents/actor.mjs": { default: Shape }, "./abstract/client-document.mjs": { default: (base: any) => base },
    "@client/helpers/hooks.mjs": { default: { onError: (_name: string, error: Error) => { throw error; } } },
    "@client/utils/helpers.mjs": { getDocumentClass: () => AE },
    "@common/data/operators.mjs": native.load("common/data/operators.mjs", {}),
  });
  native.evaluate("globalThis.Actor=nativeExports.default;");
  const Actor = native.load(`${ordem}/module/documents/actor.mjs`, {
    "../helpers/actor-calculations.mjs": calc, "../dice/basic-roll.mjs": { default: Empty },
    "../applications/skill-tool-configuration-dialog.mjs": { default: Empty }, "../applications/attribute-configuration-dialog.mjs": { default: Empty },
  }).OrdemActor;
  function effect(source: any) {
    const instance = Object.create(AE.prototype);
    Object.defineProperties(instance, {
      system: { value: new Model(native.nativeObject(source.system)) }, disabled: { value: source.disabled ?? false, writable: true },
      changes: { get: () => instance.system.changes },
      transfer: { value: source.transfer ?? true, writable: true }, statuses: { value: native.evaluate("new Set()") },
      active: { get: () => !instance.disabled },
    });
    return instance;
  }
  function actor(effects: any[] = [], source: any = {}, transferred = true, classOptions: Record<string, unknown> | null = {}) {
    const system = new (native.evaluate("CONFIG.Actor.dataModels.agent"))(native.nativeObject({ PV: { value: 100, max: 100 }, ...source })).toObject(true);
    const instance = new Actor(native.nativeObject({ type: "agent", system }));
    instance.items = transferred ? [{ effects }] : [];
    instance.effects = transferred ? [] : effects;
    instance.isOwner = true;
    Object.defineProperty(instance, "itemTypes", { value: { class: classOptions === null ? [] : [{ system: { hpInitial: 100, hpPerLevel: 4, peInitial: 5, pePerLevel: 2, sanInitial: 10, sanPerLevel: 3, ...classOptions } }] } });
    instance.update = async (patch: any) => { instance.updateSource(native.nativeObject(patch)); instance.prepareData(); return instance; };
    instance.prepareData();
    return instance;
  }
  return { ...native, effect, actor };
}
function preset(presetId: string, value: string, extra: Record<string, string> = {}) {
  const result = buildOrdemEffectPreset({ presetId, value, skillId: "occultism", ...extra });
  if (!result.ok) throw new Error(result.error);
  return { ...buildAllyPresetTemplate(result.value), transfer: true };
}

describe.skipIf(!root || !ordem)("v14 native transferred/projection RD and Ordem consumers", () => {
  let reference: ReturnType<typeof runtime>;
  beforeAll(() => { reference = runtime(); });
  it("matches the real Ordem damage catalog exactly", () => {
    const config = reference.load(`${ordem}/module/helpers/config.mjs`, {}).op;
    expect([...ORDEM_DAMAGE_TYPE_IDS].sort()).toEqual(Object.keys(config.dropdownDamageType).sort());
  });
  it.each(ORDEM_DAMAGE_TYPE_IDS)("handles %s through phases, filtering, damage, reset and rehydration", async type => {
    const n = reference;
    const a = n.effect(preset("damageResistance", "3", { damageTypeId: type }));
    const b = n.effect(preset("damageResistance", "2", { damageTypeId: type }));
    const actor = n.actor([a, b]);
    expect(actor.system.resistances[type].value).toBe(5);
    expect(actor.toObject(true).system).not.toHaveProperty("resistances");
    for (let i = 0; i < 5; i++) { actor.prepareData(); expect(actor.system.resistances[type].value).toBe(5); }
    let result = await actor.applyDamage(10, { damageType: type });
    expect(result).toMatchObject({ finalDamage: 5, blocked: 5, newPV: 95 });
    expect(actor.system.resistances[type].value).toBe(5);
    expect((await actor.applyDamage(2, { damageType: type })).finalDamage).toBe(0);
    expect((await actor.applyDamage(10, { damageType: type, ignoreRD: true })).finalDamage).toBe(10);
    expect((await actor.applyDamage(10, { damageType: type, ignoreRD: true, extraRD: 2 })).finalDamage).toBe(8);
    const other = type === "fireDamage" ? "ballisticDamage" : "fireDamage";
    expect((await actor.applyDamage(10, { damageType: other })).finalDamage).toBe(10);
    expect((await actor.applyDamage(10)).finalDamage).toBe(10);
    b.system.updateSource(n.nativeObject(preset("damageResistance", "2", { damageTypeId: other }).system));
    actor.prepareData();
    expect(actor.system.resistances[type].value).toBe(3);
    expect(actor.system.resistances[other].value).toBe(2);
    expect((await actor.applyDamage(10, { damageType: other })).finalDamage).toBe(8);
    b.system.updateSource(n.nativeObject(preset("damageResistance", "2", { damageTypeId: type }).system));
    actor.prepareData(); expect(actor.system.resistances[other]).toBeUndefined();
    a.disabled = true; actor.prepareData(); expect(actor.system.resistances[type].value).toBe(2);
    b.transfer = false; actor.prepareData(); expect(actor.system.resistances).toBeUndefined();
    a.disabled = false; actor.prepareData(); expect(actor.system.resistances[type].value).toBe(3);
    actor.items = []; actor.prepareData(); expect(actor.system.resistances).toBeUndefined();
    const reloaded = n.actor([n.effect(preset("damageResistance", "3", { damageTypeId: type }))], actor.toObject(true).system);
    expect(reloaded.system.resistances[type].value).toBe(3);
    expect(reloaded.toObject(true).system).not.toHaveProperty("resistances");
  });
  it.each(ORDEM_DAMAGE_TYPE_IDS)("preserves ally precedence and native addition with %s", async type => {
    const n = reference;
    const sources = [3, 2].map((value, i) => ({ allyId: `ally-${i}`, state: { status: "active", beneficiaryId: "agent", sequence: i + 1 } as any,
      abilities: [{ id: "ability", definition: { version: 2 as const, benefits: [{ id: "rd", effectId: "source", template: preset("damageResistance", String(value), { damageTypeId: type }) }] } }] }));
    const desired = resolveAllyBenefits(sources);
    expect(desired).toHaveLength(1); expect(desired[0].template.system.changes[0].value).toBe(2);
    const projection = n.effect({ ...desired[0].template, transfer: false });
    const actor = n.actor([projection], {}, false);
    expect(actor.system.resistances[type].value).toBe(2);
    expect((await actor.applyDamage(10, { damageType: type })).finalDamage).toBe(8);
    actor.items = [{ effects: [n.effect(preset("damageResistance", "3", { damageTypeId: type }))] }];
    actor.prepareData(); expect(actor.system.resistances[type].value).toBe(5);
    expect((await actor.applyDamage(10, { damageType: type })).finalDamage).toBe(5);
    projection.disabled = true; actor.prepareData(); expect(actor.system.resistances[type].value).toBe(3);
    actor.effects = []; actor.prepareData(); expect(actor.system.resistances[type].value).toBe(3);
  });
  it.each([
    ["defense", "5", "system.defense.value", 5], ["movement", "3", "system.desloc.value", 3],
    ["skill", "5", "system.skills.occultism.value", 5], ["maxPV", "5", "system.PV.max", 5],
    ["maxPE", "5", "system.PE.max", 5], ["maxPD", "5", "system.PD.max", 5], ["maxSAN", "5", "system.SAN.max", 5],
    ["capacity", "5", "system.spaces.max", 5], ["attribute", "1", "system.attributes.str.value", 1],
    ["ritualDT", "3", "system.ritual.DT", 3], ["perRound", "2", "system.PE.perRound", 2],
  ])("validates %s through the native preparation cycle", (id, value, path, delta) => {
    const n = reference, base = n.actor(), boosted = n.actor([n.effect(preset(id as string, value as string))]);
    expect(n.helpers.getProperty(boosted, path) - n.helpers.getProperty(base, path)).toBe(delta);
  });
  it("checks derived attributes and reproduces the PRE limitation without compensating", () => {
    const n = reference, base = n.actor();
    for (const [attributeId, path, delta] of [["str", "system.spaces.max", 5], ["dex", "system.defense.value", 1],
      ["vit", "system.PV.max", 1], ["int", "system.attributes.int.value", 1]] as const) {
      const boosted = n.actor([n.effect(preset("attribute", "1", { attributeId }))]);
      expect(n.helpers.getProperty(boosted, path) - n.helpers.getProperty(base, path)).toBe(delta);
    }
    const pre = preset("attribute", "1"); pre.system.changes[0].key = "system.attributes.pre.value";
    const boosted = n.actor([n.effect(pre)]);
    expect(boosted.system.attributes.pre.value).toBe(base.system.attributes.pre.value + 1);
    expect(boosted.system.ritual.DT).toBe(base.system.ritual.DT);
  });
  it.each([false, true])("preserves PE/PD limits across survivor and progression rules (withoutSanity=%s)", withoutSanity => {
    const n = reference;
    n.evaluate(`game.settings.get=(_scope,key)=>key==='globalPlayingWithoutSanity'?${withoutSanity}:key==='globalProgressRules'?1:false;`);
    try {
      for (const isSurvivor of [false, true]) {
        const source = { NEX: { value: 30 }, stage: { value: 3 } };
        const base = n.actor([], source, true, { isSurvivor });
        for (const resourceId of ["PE", "PD"]) {
          const effect = n.effect(preset("perRound", "2", { resourceId }));
          const boosted = n.actor([effect], source, true, { isSurvivor });
          const field = `system.${resourceId}.perRound`;
          expect(n.helpers.getProperty(boosted, field) - n.helpers.getProperty(base, field)).toBe(2);
          boosted.prepareData();
          expect(n.helpers.getProperty(boosted, field) - n.helpers.getProperty(base, field)).toBe(2);
          effect.disabled = true; boosted.prepareData();
          expect(n.helpers.getProperty(boosted, field)).toBe(n.helpers.getProperty(base, field));
        }
      }
    } finally { n.evaluate("game.settings.get=()=>false;"); }
  });
  it.each(["PV", "PE", "PD", "SAN"])("keeps %s maximum conditional on class and automatic calculations", resource => {
    const n = reference, source = { [resource]: { value: 10, max: 30 } };
    for (const [data, classOptions] of [[source, null], [{ ...source, disableCalculations: true }, {}]] as const) {
      const effect = n.effect(preset(`max${resource}`, "5"));
      const boosted = n.actor([effect], data, true, classOptions);
      expect(boosted.system[resource].max).toBe(30);
      expect(boosted.toObject(true).system[resource]).not.toHaveProperty("bonus");
    }
  });
  it("retains Defense, dodge and movement bonuses with armor and overload", () => {
    const n = reference;
    const base = n.actor(), boosted = n.actor([n.effect(preset("defense", "5")), n.effect(preset("movement", "3"))]);
    const equipment = { type: "protection", effects: [], system: { defense: 4, quantity: 1, weight: 7, using: { state: true } } };
    base.items.push(equipment); boosted.items.push(equipment);
    base.prepareData(); boosted.prepareData();
    expect(boosted.system.defense.value - base.system.defense.value).toBe(5);
    expect(boosted.system.defense.dodge - base.system.defense.dodge).toBe(5);
    expect(boosted.system.desloc.value - base.system.desloc.value).toBe(3);
    expect(boosted.system.spaces.value).toBe(7);
  });
});
