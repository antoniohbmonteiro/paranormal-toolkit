import { describe, expect, it } from "vitest";
import { AttackModifierRegistry } from "../../../../src/features/attack-modifiers/attack-modifier-registry";
import { resolveAttackConfiguration } from "../../../../src/features/attack-modifiers/attack-configuration-resolver";
import { createAttackModifierDialogModel, toggleAttackConfigurationOption, toggleAttackGeneralAction } from "../../../../src/features/attack-modifiers/attack-modifier-dialog-model";
import { emptyAttackConfiguration, type AttackConfigurationSelection } from "../../../../src/features/attack-modifiers/attack-general-actions";
import { DEATH_SHOT_PRESET } from "../../../../src/features/attack-modifiers/presets/death-shot";
import { LETHAL_SHOT_PRESET } from "../../../../src/features/attack-modifiers/presets/lethal-shot";
import { SPECIAL_ATTACK_PRESET } from "../../../../src/features/attack-modifiers/presets/special-attack";
import { INTUITIVE_SHOT_PRESET } from "../../../../src/features/attack-modifiers/presets/intuitive-shot";
import { composeAttackModifiers } from "../../../../src/features/attack-modifiers/attack-modifier-composer";

const registry = new AttackModifierRegistry();
const ability = (presetId: string) => ({ type: "ability", uuid: "Actor.a.Item." + presetId, name: "Renomeado",
  getFlag: () => ({ schemaVersion: 1, presetId, presetVersion: "1" }) }) as Item;
const facts = { weaponType: "armament", ranged: true, firearm: true, automatic: true, rangedSubtype: "fire" };
const input = { baseCritical: { margin: 19, multiplier: 3 }, weaponName: "Fuzil", weaponImage: "", actorName: "Rafa", targetName: null,
  facts, burstDamage: { faces: 6, type: "ballisticDamage" }, progression: { mode: "nex" as const, value: 55 },
  available: registry.resolve(registry.list().map(preset => ability(preset.id)), facts), resource: "PE" as const, currentResource: 20 };
const special = SPECIAL_ATTACK_PRESET.id, death = DEATH_SHOT_PRESET.id, lethal = LETHAL_SHOT_PRESET.id, intuitive = INTUITIVE_SHOT_PRESET.id;

describe("attack preset combinations", () => {
  it.each(["attackBonus", "damageBonus"] as const)("rejects malformed and overflowing %s contributions", field => {
    for (const value of [-1, 0.5, NaN, Infinity, Number.MAX_SAFE_INTEGER + 1]) {
      const invalid = structuredClone(DEATH_SHOT_PRESET); invalid.options[0].contribution[field] = value;
      expect(() => new AttackModifierRegistry([invalid])).toThrow("inválidas");
      expect(() => composeAttackModifiers(input.baseCritical, [], {}, { [field]: value })).toThrow("limites");
    }
    const first = structuredClone(DEATH_SHOT_PRESET); first.options[0].contribution[field] = Number.MAX_SAFE_INTEGER;
    expect(() => composeAttackModifiers(input.baseCritical, [{ preset: first, abilityUuid: "one", abilityName: "one" }],
      { [death]: ["use"] }, { [field]: 1 })).toThrow("limites");
  });
  it("keeps other valid contributions visible while special attack has zero blocks", () => {
    const model = createAttackModifierDialogModel(input, { generalActions: { aim: false, burst: false },
      presets: { [death]: ["use", "affinity"], [special]: ["use"] }, specialAttack: { attackBlocks: 0, damageBlocks: 0 } });
    expect(model).toMatchObject({ canConfirm: false, critical: "19/x3 → 17/x3", cost: { additional: "2 PE" },
      penetration: "Até 10 RD ao acertar", attackBonus: null, damageBonus: null });
    expect(model.error).toContain("Distribua");
  });
  it.each(["fire", "shoot"])("accepts death shot with native subtype %s", rangedSubtype => {
    expect(registry.resolve([ability(death), ability(death)], { ...facts, rangedSubtype })).toHaveLength(1);
  });
  it.each(["", "throw", "melee", "unknown"])("rejects death shot with subtype %s", rangedSubtype => {
    expect(registry.resolve([ability(death)], { ...facts, rangedSubtype })).toEqual([]);
    expect(() => resolveAttackConfiguration({ ...input, facts: { ...facts, rangedSubtype } },
      { ...emptyAttackConfiguration(), presets: { [death]: ["use"] } })).toThrow("indisponível");
  });
  it.each([
    [{ [special]: ["use"], [death]: ["use", "affinity"] }, false, false, 6, 17, 3, 10],
    [{ [special]: ["use"], [intuitive]: ["use", "empower"] }, false, false, 6, 17, 4, 10],
    [{ [death]: ["use", "affinity"], [lethal]: ["use"] }, true, false, 3, 15, 3, 10],
    [{ [death]: ["use", "affinity"], [intuitive]: ["use", "empower"] }, false, false, 4, 15, 4, 20],
    [{ [special]: ["use"] }, false, true, 4, 19, 3, 0],
  ] as const)("composes costs, criticals and penetration %j", (presets, aim, burst, cost, margin, multiplier, penetration) => {
    const selection: AttackConfigurationSelection = { generalActions: { aim, burst }, presets: structuredClone(presets) as any };
    if (presets[special as keyof typeof presets]) selection.specialAttack = { attackBlocks: 1, damageBlocks: 2 };
    const result = resolveAttackConfiguration(input, selection);
    expect(result).toMatchObject({ effortCost: cost, critical: { margin, multiplier }, resistancePenetration: penetration,
      attackBonus: selection.specialAttack ? 5 : 0, damageBonus: selection.specialAttack ? 10 : 0,
      attackDiceModifier: burst ? -1 : 0, bonusWeaponDamageDice: burst ? 1 : 0 });
    expect(createAttackModifierDialogModel(input, selection).cost?.balance).toBe("20 → " + (20 - cost) + " PE");
  });
  it("starts affinity unchecked, keeps its cost at two and clears it when deselected", () => {
    let selection = toggleAttackConfigurationOption(input.available, emptyAttackConfiguration(), death, "use", true);
    expect(createAttackModifierDialogModel(input, selection).groups.find(group => group.id === death)?.options[0].checked).toBe(false);
    expect(resolveAttackConfiguration(input, selection)).toMatchObject({ effortCost: 2, resistancePenetration: 0 });
    selection = toggleAttackConfigurationOption(input.available, selection, death, "affinity", true);
    expect(resolveAttackConfiguration(input, selection)).toMatchObject({ effortCost: 2, resistancePenetration: 10 });
    selection = toggleAttackConfigurationOption(input.available, selection, death, "use", false);
    expect(selection.presets[death]).toBeUndefined();
    expect(resolveAttackConfiguration(input, selection).effortCost).toBe(0);
    expect(() => resolveAttackConfiguration(input, { ...selection, presets: { [death]: ["affinity"] } })).toThrow("compatível");
  });
  it("requires aim for lethal shot and clears incompatible choices in both directions", () => {
    let selection = emptyAttackConfiguration();
    expect(createAttackModifierDialogModel(input, selection).groups.find(group => group.id === lethal)?.disabled).toBe(true);
    expect(toggleAttackConfigurationOption(input.available, selection, lethal, "use", true)).toEqual(selection);
    expect(() => resolveAttackConfiguration(input, { ...selection, presets: { [lethal]: ["use"] } })).toThrow("Mirar");
    selection = toggleAttackGeneralAction(input, selection, "aim", true);
    selection = toggleAttackConfigurationOption(input.available, selection, lethal, "use", true);
    expect(resolveAttackConfiguration(input, selection)).toMatchObject({ effortCost: 1, critical: { margin: 17, multiplier: 3 } });
    const cleared = toggleAttackGeneralAction(input, selection, "aim", false);
    expect(cleared.presets[lethal]).toBeUndefined(); expect(resolveAttackConfiguration(input, cleared).effortCost).toBe(0);
    selection = toggleAttackConfigurationOption(input.available, selection, intuitive, "use", true);
    expect(selection.generalActions.aim).toBe(false); expect(selection.presets[lethal]).toBeUndefined();
    selection = toggleAttackConfigurationOption(input.available, selection, intuitive, "empower", true);
    selection = toggleAttackGeneralAction(input, selection, "aim", true);
    expect(selection.presets[intuitive]).toBeUndefined();
    expect(() => resolveAttackConfiguration(input, { ...selection, presets: { [lethal]: ["use"], [intuitive]: ["use"] } })).toThrow("combinados");
  });
});
