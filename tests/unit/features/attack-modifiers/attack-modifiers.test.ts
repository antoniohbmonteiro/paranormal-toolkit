import { describe, expect, it } from "vitest";
import { AttackModifierRegistry } from "../../../../src/features/attack-modifiers/attack-modifier-registry";
import { composeAttackModifiers, parseAttackCritical } from "../../../../src/features/attack-modifiers/attack-modifier-composer";
import { INTUITIVE_SHOT_PRESET } from "../../../../src/features/attack-modifiers/presets/intuitive-shot";
import { createAttackModifierDialogModel, toggleAttackModifierOption, toggleAttackConfigurationOption, toggleAttackGeneralAction } from "../../../../src/features/attack-modifiers/attack-modifier-dialog-model";
import { emptyAttackConfiguration, availableAttackGeneralActions, validateAttackGeneralActions } from "../../../../src/features/attack-modifiers/attack-general-actions";
import { renderAttackModifierDialog } from "../../../../src/ui/components/attack/attack-modifier-dialog";
import { readAttackCardBinding, readAttackExecution, readAttackDamage } from "../../../../src/features/attack-modifiers/attack-card-state";
import type { AttackModifierPreset, AvailableAttackModifier } from "../../../../src/features/attack-modifiers/attack-modifier-preset";

const available: AvailableAttackModifier[] = [{ preset: INTUITIVE_SHOT_PRESET, abilityUuid: "Actor.a.Item.ability", abilityName: "Renomeado" }];
const facts = { weaponType: "armament", ranged: true, firearm: true, automatic: true };
const input = { weaponName: "Fuzil", weaponImage: "weapon.png", actorName: "Rafa", targetName: null,
  available, baseCritical: { margin: 19, multiplier: 3 }, resource: "PE" as const, currentResource: 10,
  facts, burstDamage: { faces: 6, type: "ballisticDamage" } };
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
  it.each([[2, "−1d20 + 2d20 = +1d20"], [1, "−1d20 + 1d20 = 0d20"], [-1, "−1d20 − 1d20 = −2d20"]])("combines signed modifiers into one summary card with bonus %i", (bonus, expected) => {
    const entries = [-1, Number(bonus)].map((attackDiceModifier, index) => ({
      preset: { id: "test.dice." + index, version: "1", label: "Teste " + index, requirements: {},
        options: [{ id: "use", label: "Usar", description: "", contribution: { attackDiceModifier, bonusWeaponDamageDice: index + 1 } }] },
      abilityUuid: "ability." + index, abilityName: "Teste " + index,
    }));
    const selection = { ...emptyAttackConfiguration(), presets: Object.fromEntries(entries.map(entry => [entry.preset.id, ["use"]])) };
    const model = createAttackModifierDialogModel({ ...input, available: entries }, selection);
    expect(model).toMatchObject({ attackDice: expected, bonusDamage: "+1d6 + 2d6 = +3d6", canConfirm: true });
    const html = renderAttackModifierDialog(model);
    expect(html.match(/<dt>Dados de ataque<\/dt>/g)).toHaveLength(1);
    expect(html.match(/<dt>Dano adicional<\/dt>/g)).toHaveLength(1);
    expect(html).toContain('<dt>Dano adicional</dt><dd>+1d6 + 2d6 = +3d6</dd>');
    expect(composeAttackModifiers(input.baseCritical, entries, selection.presets))
      .toEqual(composeAttackModifiers(input.baseCritical, [...entries].reverse(), selection.presets));
  });
  it("accepts signed integer contributions and rejects malformed or overflowing modifiers", () => {
    const preset = structuredClone(INTUITIVE_SHOT_PRESET);
    preset.options[0].contribution.attackDiceModifier = -2;
    expect(() => new AttackModifierRegistry([preset])).not.toThrow();
    for (const invalid of [NaN, Infinity, 0.5, Number.MAX_SAFE_INTEGER + 1]) {
      preset.options[0].contribution.attackDiceModifier = invalid;
      expect(() => new AttackModifierRegistry([preset])).toThrow("inválidas");
      expect(() => composeAttackModifiers(input.baseCritical, [{ ...available[0], preset }], { [preset.id]: ["use"] })).toThrow("limites");
    }
    preset.options[0].contribution.attackDiceModifier = Number.MAX_SAFE_INTEGER;
    expect(() => composeAttackModifiers(input.baseCritical, [{ ...available[0], preset }], { [preset.id]: ["use"] }, { attackDiceModifier: 1 })).toThrow("limites");
  });
  it("starts unchecked, disables dependent options, updates the summary and clears child selection", () => {
    const initial = createAttackModifierDialogModel(input, emptyAttackConfiguration());
    expect(initial.groups.flatMap(group => group.options).every(option => !option.checked)).toBe(true);
    expect(initial.groups[0].selected).toBe(false);
    expect(initial.groups[0].options[0].disabled).toBe(true);
    expect(initial.critical).toBe("19/x3");
    let selection = toggleAttackModifierOption(available, {}, "attack.tiroIntuitivo", "use", true);
    selection = toggleAttackModifierOption(available, selection, "attack.tiroIntuitivo", "empower", true);
    const configuration = { ...emptyAttackConfiguration(), presets: selection };
    const model = createAttackModifierDialogModel(input, configuration);
    expect(model).toMatchObject({ critical: "19/x3 → 17/x4", cost: { additional: "2 PE", balance: "10 → 8 PE" }, canConfirm: true });
    expect(createAttackModifierDialogModel({ ...input, currentResource: 1 }, configuration).canConfirm).toBe(false);
    expect(createAttackModifierDialogModel({ ...input, resource: "PD" }, configuration).cost?.additional).toBe("2 PD");
    expect(toggleAttackModifierOption(available, selection, "attack.tiroIntuitivo", "use", false)["attack.tiroIntuitivo"]).toEqual([]);
  });
  it("shares the existing dialog styling and escapes presentation without runtime dependencies", () => {
    const html = renderAttackModifierDialog(createAttackModifierDialogModel({ ...input, weaponName: '<script>"x"</script>' }, emptyAttackConfiguration()));
    expect(html).toContain("paranormal-toolkit-ritual-cast__panel");
    expect(html).toContain("paranormal-toolkit-ability-use__header");
    expect(html).toContain("paranormal-toolkit-ritual-cast__cast-button");
    expect(html).not.toContain("<script>"); expect(html).not.toContain(" checked");
    expect(html).toContain("Cancelar"); expect(html).toContain("Atacar");
  });
  it.each([
    [{}, true, true], [{ ranged: false }, false, false], [{ firearm: false }, true, false],
    [{ automatic: false }, true, false], [{ weaponType: "ability" }, false, false],
    [{ firearm: undefined, automatic: undefined }, true, false],
  ])("resolves general actions from weapon properties %j", (overrides, aim, burst) => {
    expect(availableAttackGeneralActions({ ...facts, ...overrides } as typeof facts)).toEqual({ aim, burst });
  });
  it("clears aim and intuitive shot in both directions, including paid options", () => {
    let state = toggleAttackGeneralAction(input, emptyAttackConfiguration(), "aim", true);
    state = toggleAttackConfigurationOption(available, state, INTUITIVE_SHOT_PRESET.id, "use", true);
    expect(state.generalActions.aim).toBe(false);
    state = toggleAttackConfigurationOption(available, state, INTUITIVE_SHOT_PRESET.id, "empower", true);
    expect(createAttackModifierDialogModel(input, state).cost?.additional).toBe("2 PE");
    state = toggleAttackGeneralAction(input, state, "aim", true);
    expect(state.presets[INTUITIVE_SHOT_PRESET.id]).toBeUndefined();
    expect(createAttackModifierDialogModel(input, state)).toMatchObject({ critical: "19/x3", cost: null, penetration: null });
    state = toggleAttackConfigurationOption(available, state, INTUITIVE_SHOT_PRESET.id, "use", true);
    expect(createAttackModifierDialogModel(input, state)).toMatchObject({ critical: "19/x3 → 17/x3", cost: null });
  });
  it("rejects incompatible or ineligible actions at the domain boundary", () => {
    const conflict = { generalActions: { aim: true, burst: false }, presets: { [INTUITIVE_SHOT_PRESET.id]: ["use", "empower"] } };
    expect(() => validateAttackGeneralActions(facts, conflict, input.burstDamage)).toThrow("não podem");
    expect(createAttackModifierDialogModel(input, conflict).canConfirm).toBe(false);
    const burst = { ...emptyAttackConfiguration(), generalActions: { aim: false, burst: true } };
    expect(() => validateAttackGeneralActions({ ...facts, automatic: false }, burst, input.burstDamage)).toThrow("indisponível");
    expect(() => validateAttackGeneralActions(facts, burst, null)).toThrow("NdM");
    expect(composeAttackModifiers(input.baseCritical, [], {}, validateAttackGeneralActions(facts, burst, input.burstDamage)))
      .toMatchObject({ attackDiceModifier: -1, bonusWeaponDamageDice: 1, effortCost: 0 });
  });
  it("omits empty sections and only renders configurations for selected abilities", () => {
    const initial = renderAttackModifierDialog(createAttackModifierDialogModel(input, emptyAttackConfiguration()));
    for (const absent of ['data-option-id="empower"', 'Crítico original', 'Crítico resultante', 'RD ignorada', '<h3>Custo</h3>', 'Nenhuma', '<dt>Dados de ataque</dt>', '<dt>Dano adicional</dt>']) {
      expect(initial).not.toContain(absent);
    }
    expect(initial.match(/<dt>Crítico<\/dt>/g)).toHaveLength(1);
    const paid = { ...emptyAttackConfiguration(), presets: { [INTUITIVE_SHOT_PRESET.id]: ["use", "empower"] } };
    const expanded = renderAttackModifierDialog(createAttackModifierDialogModel(input, paid));
    for (const included of ['data-option-id="empower"', 'RD ignorada', '<h3>Custo</h3>', '10 → 8 PE']) expect(expanded).toContain(included);
    const burst = renderAttackModifierDialog(createAttackModifierDialogModel(input, toggleAttackGeneralAction(input, paid, "burst", true)));
    expect(burst).toContain('<dt>Dados de ataque</dt><dd>−1d20</dd>');
    expect(burst).toContain('<dt>Dano adicional</dt><dd>+1d6</dd>');
    expect(burst).not.toContain("Rajada: −1 dado");
    const melee = renderAttackModifierDialog(createAttackModifierDialogModel({ ...input, available: [], facts: { ...facts, ranged: false } }, emptyAttackConfiguration()));
    expect(melee).not.toContain("Ações gerais"); expect(melee).not.toContain("Habilidades"); expect(melee).toContain("Atacar");
  });
  it("disables only burst for unsupported damage and keeps free attacks available without resources", () => {
    const model = createAttackModifierDialogModel({ ...input, burstDamage: null, currentResource: null }, emptyAttackConfiguration());
    expect(model.generalActions.find(action => action.id === "burst")).toMatchObject({ disabled: true, checked: false });
    expect(model.generalActions.find(action => action.id === "aim")?.disabled).toBe(false);
    expect(model.canConfirm).toBe(true); expect(model.cost).toBeNull();
    expect(toggleAttackGeneralAction({ ...input, burstDamage: null }, emptyAttackConfiguration(), "burst", true).generalActions.burst).toBe(false);
  });
  it("clears all hidden options when deselecting the ability and starts each configuration independently", () => {
    const entries = structuredClone(available);
    delete entries[0].preset.options[1].requires;
    const state = { ...emptyAttackConfiguration(), presets: { [INTUITIVE_SHOT_PRESET.id]: ["use", "empower"] } };
    expect(toggleAttackConfigurationOption(entries, state, INTUITIVE_SHOT_PRESET.id, "use", false).presets).toEqual({});
    expect(state.presets[INTUITIVE_SHOT_PRESET.id]).toHaveLength(2);
    const first = emptyAttackConfiguration(); first.generalActions.aim = true;
    expect(emptyAttackConfiguration().generalActions.aim).toBe(false);
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
