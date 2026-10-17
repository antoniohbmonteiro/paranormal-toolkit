import { beforeEach, describe, expect, it, vi } from "vitest";
import { itemFixture } from "../../../helpers/item-effects";
import { buildCustomTemplate, buildDefenseTemplate } from "../../../../src/adapters/ordem/ordem-ally-effect-presets";
import { buildOrdemEffectPreset, readOrdemEffectPreset } from "../../../../src/adapters/ordem/ordem-effect-presets";
import { ORDEM_DAMAGE_TYPE_IDS, resolveOrdemDamageType } from "../../../../src/adapters/ordem/ordem-damage-types";
import { ItemEffectConfigService, resolveItemEffectConfigContext, itemEffectQuickEdit } from "../../../../src/features/item-effects/item-effect-config-service";
import { inspectLegacyAllyImport, readAllyAbility } from "../../../../src/features/allies/config/ally-ability-config";
import { migrateAllyAbilityEffects } from "../../../../src/features/allies/ally-effect-migration-service";
import { buildItemEffectConfigView, defaultItemEffectDraft } from "../../../../src/features/item-effects/item-effect-config-view";
import { renderItemEffectConfig } from "../../../../src/ui/components/item-effects/item-effect-config";

const scope = "paranormal-toolkit";
const ally = { id: "iris", type: `${scope}.ally` };
const legacy = () => itemFixture({ flags: { [scope]: { allyAbility: { version: 1, unknown: "keep", benefits: [
  { id: "first", kind: "defense", value: 5 }, { id: "second", kind: "defense", value: 7 },
] } }, foreign: { keep: true } } }, ally);
beforeEach(() => {
  vi.stubGlobal("game", { system: { id: "ordemparanormal" }, user: { id: "gm", isGM: true }, packs: new Map() });
  vi.stubGlobal("CONFIG", {});
});

describe("effect configuration contexts and permissions", () => {
  it.each([
    [null, "free", true], [{ type: "agent" }, "", true],
    [{ type: "agent" }, "passive", false], [null, "passive", false],
  ])("allows choosing transfer per new effect, independently of activation (owner=%j, activation=%s)", async (owner, activation, transfer) => {
    const item = itemFixture({ system: { activation }, effects: [{ ...buildDefenseTemplate("Existente", 2), _id: "old", transfer: false }] }, owner);
    const before = item.effects.get("old").toObject();
    const service = new ItemEffectConfigService(item);
    const preset = await service.create({ presetId: "attribute", value: "1", attributeId: "str" }, { transfer });
    const custom = await service.create(undefined, { transfer });
    expect(preset.transfer).toBe(transfer); expect(custom.transfer).toBe(transfer);
    expect(preset.getFlag(scope, "allyPassive")).toBeUndefined();
    expect(item.effects.get("old").toObject()).toEqual(before);
  });
  it("keeps ally projection non-transferable and excludes its creation selector", async () => {
    const item = itemFixture({ system: { activation: "passive" } }, ally);
    const service = new ItemEffectConfigService(item);
    expect(service.defaultTransfer).toBe(false);
    await expect(service.create({ presetId: "defense", value: "5" }, { transfer: true })).rejects.toThrow("projetados pelo suporte");
    expect(item.createEmbeddedDocuments).not.toHaveBeenCalled();
    const view = buildItemEffectConfigView({ context: "ally", editable: true, draft: defaultItemEffectDraft(true), sources: [], legacy: null, isGM: true });
    expect(renderItemEffectConfig(view)).not.toContain('name="transfer"');
  });
  it.each([[null, "independent"], [{ type: "agent" }, "agent"], [ally, "ally"], [{ type: "threat" }, null]])("uses only the actual owner %j", (owner, expected) => {
    const item = itemFixture({ flags: { [scope]: { allyAbility: { version: 1, benefits: [] } } } }, owner);
    expect(resolveItemEffectConfigContext(item)).toBe(expected);
    item.type = "ritual"; expect(resolveItemEffectConfigContext(item)).toBeNull();
  });
  it.each([null, { type: "agent" }, ally])("keeps locked packs read-only, including embedded Items (owner=%j)", owner => {
    const item = itemFixture({ pack: owner ? undefined : "pack" }, owner && { ...owner, pack: "pack" });
    const pack = { locked: true }; (game as any).packs.set("pack", pack);
    const service = new ItemEffectConfigService(item);
    expect(service.readable).toBe(true); expect(service.editable).toBe(false);
    pack.locked = false; expect(service.editable).toBe(true);
    item.canUserModify.mockReturnValue(false); expect(service.editable).toBe(false);
    item.testUserPermission.mockReturnValue(false); expect(service.readable).toBe(false);
  });
  it("does not offer mutation to granted copies or limited viewers", async () => {
    const item = itemFixture({ flags: { [scope]: { allyGrantedAbility: { grantId: "grant" } } } }, { type: "agent" });
    const service = new ItemEffectConfigService(item);
    expect(service.readable).toBe(true); expect(service.editable).toBe(false);
    await expect(service.create({ presetId: "defense", value: "5" })).rejects.toThrow("permissão");
    item.limited = true; expect(service.readable).toBe(false); expect(service.sources()).toEqual([]);
  });
  it.each([[null, "passive", true], [{ type: "agent" }, "passiva", true], [{ type: "agent" }, "default", true],
    [null, "", true], [ally, "passive", false]])("sets creation defaults without changing existing sources (%j, %s)", async (owner, activation, transfer) => {
    const item = itemFixture({ system: { activation }, effects: [{ ...buildDefenseTemplate("Antigo", 2), _id: "old", transfer: true, disabled: true }] }, owner);
    const before = item.effects.get("old").toObject(true);
    const effect = await new ItemEffectConfigService(item).create({ presetId: "defense", value: "5" });
    expect(effect.transfer).toBe(transfer);
    expect(effect.getFlag(scope, "allyPassive")).toEqual(owner === ally ? { version: 1 } : undefined);
    await item.update({ "system.activation": "reaction" });
    expect(effect.transfer).toBe(transfer); expect(item.effects.get("old").toObject(true)).toEqual(before);
  });
});

describe("safe source editing", () => {
  it.each([null, ally])("displays a PV maximum formula with its native editor and no source writes (owner=%j)", async owner => {
    const template = buildCustomTemplate("Efeito Ativo");
    const formula = "\n(@NEX.value / 5) * 1";
    const item = itemFixture({ effects: [{ ...template, _id: "formula", transfer: !owner,
      flags: owner ? { [scope]: { allyPassive: { version: 1 } } } : {},
      system: { changes: [{ key: "system.PV.bonus", type: "add", phase: "initial", priority: null, value: formula }] },
    }] }, owner);
    const before = item.toObject();
    const service = new ItemEffectConfigService(item);
    const view = buildItemEffectConfigView({ context: service.context!, editable: true, draft: defaultItemEffectDraft(), sources: service.sources(), legacy: service.legacy(), isGM: true });
    expect(view.effects[0]).toMatchObject({ kind: "maxPV", summary: "Bônus de PV máximo · fórmula personalizada", canQuickEdit: false, canOpen: true });
    expect(renderItemEffectConfig(view)).toContain("Bônus de PV máximo · fórmula personalizada");
    expect(renderItemEffectConfig(view)).toContain('title="Editar no editor nativo"');
    expect(service.sources()[0].quick).toBeNull();
    await service.open("formula");
    expect(item.toObject()).toEqual(before);
    expect(item.effects.get("formula").update).not.toHaveBeenCalled();
    expect(item.createEmbeddedDocuments).not.toHaveBeenCalled();
    expect(item.setFlag).not.toHaveBeenCalled();
  });
  it("updates only requested change properties and keeps identity, flags, duration, state and unknown metadata", async () => {
    const template = buildDefenseTemplate("Nome manual", 5);
    const source = { ...template, _id: "effect", transfer: false, disabled: true, origin: "Item.source", unknown: { preserve: [1] },
      flags: { [scope]: { extra: "keep" } }, system: { extra: "keep", changes: [{ ...template.system.changes[0], priority: 37, extra: { keep: true } }] } };
    const item = itemFixture({ effects: [source] }); const service = new ItemEffectConfigService(item);
    const baseline = service.sources()[0].quick!;
    await service.save("effect", baseline, { presetId: "movement", value: "8" });
    const expected = structuredClone(source); expected.system.changes[0].value = 8;
    expect(item.effects.get("effect").toObject(true)).toEqual(expected);
    expect(item.effects.get("effect").update).toHaveBeenCalledExactlyOnceWith({ "system.changes": expected.system.changes });
    const fresh = service.sources()[0].quick!;
    await service.save("effect", fresh, { ...fresh.draft });
    expect(item.effects.get("effect").update).toHaveBeenCalledTimes(1);
  });
  it("detects concurrent changes, permission loss and deletion without overwriting", async () => {
    const item = itemFixture({ effects: [{ ...buildDefenseTemplate("Defesa", 5), _id: "effect" }] });
    const service = new ItemEffectConfigService(item); const baseline = service.sources()[0].quick!;
    await item.effects.get("effect").update({ name: "Outro editor" });
    await expect(service.save("effect", baseline, { presetId: "defense", value: "7" })).rejects.toThrow("mudou");
    item.canUserModify.mockReturnValue(false);
    await expect(service.remove("effect")).rejects.toThrow("permissão");
    await service.open("effect"); expect(item.effects.get("effect").sheet.render).toHaveBeenCalledOnce();
    item.canUserModify.mockReturnValue(true); await service.remove("effect");
    await expect(service.save("effect", baseline, baseline.draft)).rejects.toThrow("não encontrado");
  });
  it("keeps complex and third-party effects available natively without flattening", async () => {
    const complex = { ...buildDefenseTemplate("Complexo", 5), _id: "complex", statuses: ["blind"], flags: { another: { data: "keep" } } };
    const item = itemFixture({ effects: [complex] }); const service = new ItemEffectConfigService(item);
    const before = item.toObject(); expect(service.sources()[0].quick).toBeNull();
    await service.open("complex"); expect(item.toObject()).toEqual(before);
    const simple = buildDefenseTemplate("Simples", 5);
    (CONFIG as any).ActiveEffect = { changeTypes: { add: { handler: () => {} } } };
    expect(itemEffectQuickEdit(simple)).toBeNull();
  });
  it("segregates existing benefits on directory Items without changing creation policy", async () => {
    const item = itemFixture({ effects: [{ ...buildDefenseTemplate("Suporte", 5), _id: "support", transfer: false, flags: { [scope]: { allyPassive: { version: 1 } } } }] });
    const service = new ItemEffectConfigService(item);
    expect(service.context).toBe("independent"); expect(service.sources()[0].benefit).toBe(true);
    const created = await service.create(); expect(created.getFlag(scope, "allyPassive")).toBeUndefined();
    const view = buildItemEffectConfigView({ context: service.context!, editable: true, draft: defaultItemEffectDraft(), sources: service.sources(), legacy: service.legacy(), isGM: true });
    expect(view.benefits).toBe(false); expect(view.effects[0].transferLabel).toBe("Projeção pelo suporte");
  });
});

describe("explicit legacy imports with read-only compatibility", () => {
  it("projects a valid legacy definition without source writes", () => {
    const item = legacy(), before = item.toObject();
    for (let i = 0; i < 5; i++) expect(readAllyAbility(item)!.benefits.map(entry => entry.id)).toEqual(["first", "second"]);
    expect(item.toObject()).toEqual(before); expect(item.createEmbeddedDocuments).not.toHaveBeenCalled(); expect(item.setFlag).not.toHaveBeenCalled();
  });
  it("requires authorization and validates the entire definition before creating anything", async () => {
    const item = legacy(), before = item.toObject();
    await expect(migrateAllyAbilityEffects(item)).rejects.toThrow("confirmação"); expect(item.toObject()).toEqual(before);
    await item.createEmbeddedDocuments("ActiveEffect", [{ ...buildDefenseTemplate("Divergente", 9), _id: "partial", transfer: false,
      flags: { [scope]: { allyPassive: { version: 1, legacyId: "second" } } } }]);
    item.createEmbeddedDocuments.mockClear();
    await expect(migrateAllyAbilityEffects(item, { confirmed: true })).rejects.toThrow("divergente");
    expect(item.createEmbeddedDocuments).not.toHaveBeenCalled(); expect(item.setFlag).not.toHaveBeenCalled();
  });
  it("keeps source keys, projection identities and flag data stable across partial import and retry", async () => {
    const item = legacy(); const before = readAllyAbility(item)!;
    item.setFlag.mockRejectedValueOnce(new Error("lost response"));
    await expect(migrateAllyAbilityEffects(item, { confirmed: true })).rejects.toThrow("lost response");
    expect(readAllyAbility(item)).toEqual(before);
    expect(inspectLegacyAllyImport(item)).toMatchObject({ pending: true, missing: [] });
    await migrateAllyAbilityEffects(item, { confirmed: true });
    expect(readAllyAbility(item)).toEqual(before); expect(item.effects.contents).toHaveLength(2);
    expect(item.toObject().flags[scope].allyAbility.unknown).toBe("keep"); expect(item.toObject().flags.foreign).toEqual({ keep: true });
    await item.effects.contents[0].update({ disabled: true });
    expect(readAllyAbility(item)!.benefits.map(entry => entry.id)).toEqual(["second"]);
  });
  it("rejects stale previews and non-GMs without source writes", async () => {
    const item = legacy(), preview = inspectLegacyAllyImport(item);
    await item.createEmbeddedDocuments("ActiveEffect", [{ ...buildCustomTemplate("Outro"), _id: "other" }]);
    await expect(migrateAllyAbilityEffects(item, { confirmed: true, fingerprint: preview.fingerprint })).rejects.toThrow("mudou");
    (game.user as any).isGM = false;
    await expect(migrateAllyAbilityEffects(item, { confirmed: true })).rejects.toThrow("permissão");
    expect(item.effects.contents).toHaveLength(1); expect(item.setFlag).not.toHaveBeenCalled();
  });
});

describe("damage resistance preset", () => {
  it.each(ORDEM_DAMAGE_TYPE_IDS)("creates, recognizes and edits %s with no Actor mutation", async damageTypeId => {
    const item = itemFixture({ system: { activation: "passive" } }, { type: "agent" });
    const service = new ItemEffectConfigService(item);
    const effect = await service.create({ presetId: "damageResistance", value: "3", damageTypeId });
    const baseline = service.sources()[0].quick!;
    expect(effect.transfer).toBe(true); expect(readOrdemEffectPreset(effect.toObject().system.changes)).toMatchObject({ damageTypeId, value: "3" });
    const nextType = damageTypeId === "fireDamage" ? "ballisticDamage" : "fireDamage";
    await service.save(effect.id, baseline, { ...baseline.draft, value: "7", damageTypeId: nextType });
    expect(effect.toObject().system.changes).toEqual([{ key: `system.resistances.${nextType}.value`, type: "add", phase: "initial", priority: 20, value: 7 }]);
    const supportItem = itemFixture({}, ally);
    const supportEffect = await new ItemEffectConfigService(supportItem).create({ presetId: "damageResistance", value: "2", damageTypeId });
    expect(supportEffect.transfer).toBe(false);
    expect(supportEffect.getFlag(scope, "allyPassive")).toEqual({ version: 1 });
    expect(readAllyAbility(supportItem)!.benefits[0].template.system.changes).toEqual([
      { key: `system.resistances.${damageTypeId}.value`, type: "add", phase: "initial", priority: 20, value: 2 },
    ]);
  });
  it.each(["0", "-1", "1.2", "1e3", "99999999999999999999"])("rejects unsafe RD value %s", value => {
    expect(buildOrdemEffectPreset({ presetId: "damageResistance", value, damageTypeId: "ballisticDamage" }).ok).toBe(false);
  });
  it("distinguishes the explicit damage type from untyped damage and rejects path injection", () => {
    expect(resolveOrdemDamageType("damageDamage")).toMatchObject({ ok: true, value: "damageDamage" });
    expect(resolveOrdemDamageType("generic")).toMatchObject({ ok: true, value: null });
    expect(buildOrdemEffectPreset({ presetId: "damageResistance", value: "5", damageTypeId: "constructor.value" }).ok).toBe(false);
    expect(buildOrdemEffectPreset({ presetId: "attribute", value: "1", attributeId: "pre" }).ok).toBe(false);
  });
});
