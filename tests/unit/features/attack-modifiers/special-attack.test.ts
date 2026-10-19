import { describe, expect, it } from "vitest";
import { resolveSpecialAttack, specialAttackMaxBlocks, SPECIAL_ATTACK_PRESET } from "../../../../src/features/attack-modifiers/presets/special-attack";
import { resolveAttackConfiguration } from "../../../../src/features/attack-modifiers/attack-configuration-resolver";
import { adjustSpecialAttack, createAttackModifierDialogModel, toggleAttackConfigurationOption } from "../../../../src/features/attack-modifiers/attack-modifier-dialog-model";
import { emptyAttackConfiguration } from "../../../../src/features/attack-modifiers/attack-general-actions";
import { renderAttackModifierDialog } from "../../../../src/ui/components/attack/attack-modifier-dialog";

const input = { baseCritical: { margin: 19, multiplier: 3 }, weaponName: "Fuzil", weaponImage: "", actorName: "Rafa", targetName: null,
  available: [{ preset: SPECIAL_ATTACK_PRESET, abilityUuid: "Actor.a.Item.special", abilityName: "Renomeado" }],
  facts: { weaponType: "armament", ranged: true, firearm: true, automatic: true }, burstDamage: { faces: 6, type: "ballisticDamage" },
  progression: { mode: "nex" as const, value: 55 }, resource: "PE" as const, currentResource: 20 };
const selected = () => toggleAttackConfigurationOption(input.available, emptyAttackConfiguration(), SPECIAL_ATTACK_PRESET.id, "use", true);

describe("special attack allocation", () => {
  it.each([[0, 0], [4, 0], [5, 1], [24, 1], [25, 2], [54, 2], [55, 3], [84, 3], [85, 4], [99, 4]])
    ("limits NEX %i to %i blocks", (value, blocks) => expect(specialAttackMaxBlocks({ mode: "nex", value })).toBe(blocks));
  it.each([[1, 1], [4, 1], [5, 2], [10, 2], [11, 3], [16, 3], [17, 4], [20, 4]])
    ("limits level %i to %i blocks", (value, blocks) => expect(specialAttackMaxBlocks({ mode: "level", value })).toBe(blocks));
  it.each([null, undefined, { mode: "unknown", value: 55 }, { mode: "nex", value: -1 }, { mode: "nex", value: 100 },
    { mode: "level", value: 0 }, { mode: "nex", value: NaN }, { mode: "level", value: 1.5 }])("rejects invalid progression %j", progression => {
    expect(specialAttackMaxBlocks(progression as any)).toBeNull();
  });
  it("resolves every distribution and cost without mutating the preset", () => {
    const original = structuredClone(SPECIAL_ATTACK_PRESET);
    for (let total = 1; total <= 4; total++) for (let attackBlocks = 0; attackBlocks <= total; attackBlocks++) {
      const damageBlocks = total - attackBlocks;
      expect(resolveSpecialAttack({ attackBlocks, damageBlocks }, { mode: "nex", value: 99 }))
        .toEqual({ attackBonus: attackBlocks * 5, damageBonus: damageBlocks * 5, effortCost: total + 1 });
      const result = resolveAttackConfiguration({ ...input, progression: { mode: "nex", value: 99 } },
        { ...selected(), specialAttack: { attackBlocks, damageBlocks } });
      expect(result.selected[0].parameters).toEqual({ attackBlocks, damageBlocks });
      expect(result.critical).toEqual(input.baseCritical); expect(result.attackDiceModifier).toBe(0);
    }
    expect(SPECIAL_ATTACK_PRESET).toEqual(original);
  });
  it.each([undefined, { attackBlocks: 0, damageBlocks: 0 }, { attackBlocks: -1, damageBlocks: 2 },
    { attackBlocks: 0.5, damageBlocks: 0 }, { attackBlocks: 4, damageBlocks: 0 }, { attackBlocks: Infinity, damageBlocks: 0 }])
    ("rejects incomplete or excessive distributions %j", specialAttack => {
      expect(() => resolveAttackConfiguration(input, { ...selected(), specialAttack })).toThrow();
    });
  it("starts empty, updates the preview and bounds compact controls", () => {
    let selection = selected();
    expect(selection.specialAttack).toEqual({ attackBlocks: 0, damageBlocks: 0 });
    expect(createAttackModifierDialogModel(input, selection)).toMatchObject({ canConfirm: false, cost: null, attackBonus: null });
    selection = adjustSpecialAttack(input, selection, "attackBlocks", 1);
    selection = adjustSpecialAttack(input, selection, "damageBlocks", 1);
    selection = adjustSpecialAttack(input, selection, "damageBlocks", 1);
    expect(adjustSpecialAttack(input, selection, "attackBlocks", 1)).toEqual(selection);
    const model = createAttackModifierDialogModel(input, selection);
    expect(model).toMatchObject({ canConfirm: true, attackBonus: "+5", damageBonus: "+10 (fora do crítico)",
      cost: { additional: "4 PE", balance: "20 → 16 PE" } });
    expect(renderAttackModifierDialog(model)).toContain('class="paranormal-toolkit-attack-allocation"');
    expect(model.groups[0].allocation?.controls.every(control => !control.canIncrease)).toBe(true);
    selection = toggleAttackConfigurationOption(input.available, selection, SPECIAL_ATTACK_PRESET.id, "use", false);
    expect(selection.specialAttack).toBeUndefined();
    expect(createAttackModifierDialogModel(input, selection).canConfirm).toBe(true);
  });
  it("allows an invalid progression until the ability is selected and revalidates limits", () => {
    expect(createAttackModifierDialogModel({ ...input, progression: null }, emptyAttackConfiguration()).canConfirm).toBe(true);
    expect(() => resolveAttackConfiguration({ ...input, progression: null }, { ...selected(), specialAttack: { attackBlocks: 1, damageBlocks: 0 } })).toThrow("Progressão");
    expect(() => resolveAttackConfiguration({ ...input, progression: { mode: "nex", value: 25 } },
      { ...selected(), specialAttack: { attackBlocks: 1, damageBlocks: 2 } })).toThrow("limite");
  });
  it("persists only the numeric allocation and rejects orphan configuration", () => {
    const selection = { ...selected(), specialAttack: { attackBlocks: 1, damageBlocks: 0, runtimeDocument: { actor: "not serializable state" } } };
    expect(resolveAttackConfiguration(input, selection).selected[0].parameters).toEqual({ attackBlocks: 1, damageBlocks: 0 });
    expect(() => resolveAttackConfiguration(input, { ...emptyAttackConfiguration(), specialAttack: { attackBlocks: 1, damageBlocks: 0 } }))
      .toThrow("sem a habilidade");
  });
});
