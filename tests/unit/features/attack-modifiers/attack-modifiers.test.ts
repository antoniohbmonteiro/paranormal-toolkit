import { describe, expect, it } from "vitest";
import { AttackModifierRegistry } from "../../../../src/features/attack-modifiers/attack-modifier-registry";
import { composeAttackModifiers, parseAttackCritical } from "../../../../src/features/attack-modifiers/attack-modifier-composer";
import { INTUITIVE_SHOT_PRESET } from "../../../../src/features/attack-modifiers/presets/intuitive-shot";
import { createAttackModifierDialogModel, toggleAttackModifierOption } from "../../../../src/features/attack-modifiers/attack-modifier-dialog-model";
import { renderAttackModifierDialog } from "../../../../src/ui/components/attack/attack-modifier-dialog";
import { readAttackCardBinding, readAttackExecution, readAttackDamage } from "../../../../src/features/attack-modifiers/attack-card-state";
import type { AttackModifierPreset, AvailableAttackModifier } from "../../../../src/features/attack-modifiers/attack-modifier-preset";

const available: AvailableAttackModifier[] = [{ preset: INTUITIVE_SHOT_PRESET, abilityUuid: "Actor.a.Item.ability", abilityName: "Renomeado" }];
const facts = { weaponType: "armament", ranged: true };
const input = { weaponName: "Fuzil", weaponImage: "weapon.png", actorName: "Rafa", targetName: null,
  available, baseCritical: { margin: 19, multiplier: 3 }, resource: "PE" as const, currentResource: 10 };
const ability = (name = "Renomeado", id = "attack.tiroIntuitivo") => ({ name, type: "ability", uuid: name, getFlag: () => ({ schemaVersion: 1, presetId: id, presetVersion: "1.0.0" }) }) as Item;
describe("declarative attack modifiers", () => {
  it.each([["", 20, 2], ["19/x3", 19, 3], ["x4", 20, 4], ["18", 18, 2], ["x3/19", 19, 3]])("parses %s", (text, margin, multiplier) => {
    expect(parseAttackCritical(text as string)).toEqual({ margin, multiplier });
  });
  it.each(["invalid", "0/x3", "21/x3", "19/x0", "19/x3/2", "19/xNaN"])("rejects malformed critical %s", text => expect(parseAttackCritical(text)).toBeNull());
  it("resolves explicit bindings without relying on item names and deduplicates copies", () => {
    const registry = new AttackModifierRegistry();
    expect(registry.resolve([ability(), ability("Outra cópia")], facts)).toHaveLength(1);
    expect(registry.resolve([{ ...ability(), getFlag: () => undefined }], facts)).toEqual([]);
    expect(registry.resolve([ability()], { ...facts, ranged: false })).toEqual([]);
    expect(registry.resolve([ability()], { ...facts, weaponType: "ability" })).toEqual([]);
  });
  it("uses relative weapon values and enforces the paid dependency", () => {
    expect(composeAttackModifiers({ margin: 19, multiplier: 3 }, available, {}).critical).toEqual({ margin: 19, multiplier: 3 });
    expect(composeAttackModifiers({ margin: 19, multiplier: 3 }, available, { "attack.tiroIntuitivo": ["use"] }).critical).toEqual({ margin: 17, multiplier: 3 });
    const result = composeAttackModifiers({ margin: 18, multiplier: 2 }, available, { "attack.tiroIntuitivo": ["use", "empower"] });
    expect(result).toMatchObject({ critical: { margin: 16, multiplier: 3 }, effortCost: 2, resistancePenetration: 10 });
    expect(() => composeAttackModifiers({ margin: 19, multiplier: 3 }, available, { "attack.tiroIntuitivo": ["empower"] })).toThrow("compatível");
  });
  it("composes multiple presets independently of registration order and supports exclusive groups", () => {
    const extra: AttackModifierPreset = { id: "attack.other", version: "1", label: "Outro", requirements: {},
      options: [{ id: "use", label: "Outro", description: "", contribution: { effortCost: 1, threatBonus: 2, multiplierBonus: 1,
        resistancePenetration: { amount: 5, group: "extra", stacking: "add" } } }] };
    const multiple = [...available, { preset: extra, abilityUuid: "b", abilityName: "b" }];
    const selection = { "attack.tiroIntuitivo": ["use", "empower"], "attack.other": ["use"] };
    const first = composeAttackModifiers({ margin: 3, multiplier: 2 }, multiple, selection);
    expect(first).toEqual(composeAttackModifiers({ margin: 3, multiplier: 2 }, [...multiple].reverse(), selection));
    expect(first).toMatchObject({ critical: { margin: 1, multiplier: 4 }, effortCost: 3, resistancePenetration: 15 });
    const conflicting = structuredClone(multiple);
    conflicting[0].preset.options[0].exclusiveGroup = "one";
    conflicting[1].preset.options[0].exclusiveGroup = "one";
    expect(() => composeAttackModifiers({ margin: 19, multiplier: 3 }, conflicting, selection)).toThrow("combinados");
  });
  it("starts unchecked, disables dependent options, updates the summary and clears child selection", () => {
    const initial = createAttackModifierDialogModel(input, {});
    expect(initial.groups.flatMap(group => group.options).every(option => !option.checked)).toBe(true);
    expect(initial.groups[0].options[1].disabled).toBe(true);
    expect(initial.critical).toBe("19/x3");
    let selection = toggleAttackModifierOption(available, {}, "attack.tiroIntuitivo", "use", true);
    selection = toggleAttackModifierOption(available, selection, "attack.tiroIntuitivo", "empower", true);
    const model = createAttackModifierDialogModel(input, selection);
    expect(model).toMatchObject({ critical: "17/x4", cost: "2 PE", after: "8 PE", canConfirm: true });
    expect(createAttackModifierDialogModel({ ...input, currentResource: 1 }, selection).canConfirm).toBe(false);
    expect(createAttackModifierDialogModel({ ...input, resource: "PD" }, selection).cost).toBe("2 PD");
    expect(toggleAttackModifierOption(available, selection, "attack.tiroIntuitivo", "use", false)["attack.tiroIntuitivo"]).toEqual([]);
  });
  it("shares the existing dialog styling and escapes presentation without runtime dependencies", () => {
    const html = renderAttackModifierDialog(createAttackModifierDialogModel({ ...input, weaponName: '<script>"x"</script>' }, {}));
    expect(html).toContain("paranormal-toolkit-ritual-cast__panel");
    expect(html).toContain("paranormal-toolkit-ability-use__header");
    expect(html).toContain("paranormal-toolkit-ritual-cast__cast-button");
    expect(html).not.toContain("<script>"); expect(html).not.toContain(" checked");
    expect(html).toContain("Cancelar"); expect(html).toContain("Atacar");
  });
  it("rejects malformed persisted data without trying to repair it", () => {
    expect(readAttackExecution({ schemaVersion: 1, snapshot: {} })).toBeNull();
    expect(readAttackDamage({ schemaVersion: 2 })).toBeNull();
    expect(readAttackCardBinding({ schemaVersion: 1, revision: 0, activeUseId: "use", executions: [
      { executionId: "same", ordinal: 0, attackMessageId: "msg", state: "published" },
      { executionId: "same", ordinal: 1, attackMessageId: "msg2", state: "published" },
    ] })).toBeNull();
    expect(readAttackCardBinding({ schemaVersion: 1, revision: 0, activeUseId: "use", executions: [
      { executionId: "one", ordinal: 0, attackMessageId: null, state: "published" },
    ] })).toBeNull();
  });
});
