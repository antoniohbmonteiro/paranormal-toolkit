import { afterEach, describe, expect, it, vi } from "vitest";
import { createAttackReference } from "./helpers/attack-reference";
import { emptyAttackConfiguration } from "../../src/features/attack-modifiers/attack-general-actions";
import { readAttackExecution } from "../../src/features/attack-modifiers/attack-card-state";
import { MODULE_ID } from "../../src/constants";
import type { AttackModifierContribution, AttackModifierPreset } from "../../src/features/attack-modifiers/attack-modifier-preset";

const root = process.env.PARANORMAL_TOOLKIT_ORDEM_REFERENCE;
const burst = () => ({ ...emptyAttackConfiguration(), generalActions: { aim: false, burst: true } });
function bindModifier(h: Awaited<ReturnType<typeof createAttackReference>>, id: string, contribution: AttackModifierContribution) {
  const preset: AttackModifierPreset = { id, version: "1", label: id, requirements: { ranged: true },
    options: [{ id: "use", label: id, description: "", contribution }] };
  h.attacks.registry.register(preset);
  h.actor.items.set(id, { id, name: id, type: "ability", uuid: h.actor.uuid + ".Item." + id,
    getFlag: () => ({ schemaVersion: 1, presetId: id, presetVersion: "1" }) });
}
afterEach(() => vi.unstubAllGlobals());
describe.skipIf(!root)("general actions with native Ordem attacks", () => {
  it("opens from the weapon card without presets, but keeps direct calls native", async () => {
    const h = await createAttackReference(root!, { bound: false, choices: [{}] });
    await h.weapon.rollAttack(); expect(h.request).not.toHaveBeenCalled(); expect(h.attackMessages()).toHaveLength(0);
    await h.invoke("attack"); expect(h.request).toHaveBeenCalledOnce(); expect(h.attackMessages()).toHaveLength(1);
    expect(h.request.mock.calls[0][0].available).toEqual([]);
    await h.invoke("damage"); expect(h.damageMessages()).toHaveLength(1); expect(h.actor.system.PE.value).toBe(20);
  });
  it("configures melee weapons without general actions and respects disabled automation", async () => {
    const h = await createAttackReference(root!, { bound: false, choices: [{}] });
    h.weapon.system.types.rangeType.name = "melee";
    await h.invoke("attack"); expect(h.request).toHaveBeenCalledOnce(); expect(h.request.mock.calls[0][0].facts.ranged).toBe(false);
    const disabled = await createAttackReference(root!, { executionMode: "disabled" });
    await disabled.invoke("attack"); expect(disabled.request).not.toHaveBeenCalled(); expect(disabled.attackMessages()).toHaveLength(0);
  });
  it.each([[3, "2d20kh"], [2, "1d20kh"], [1, "2d20kl"], [0, "3d20kl"], [-1, "3d20kl"]])("applies burst to native attribute %i", async (attribute, pool) => {
    const h = await createAttackReference(root!, { bound: false, automatic: true, choices: [burst()] });
    const weapon = h.weapon.toObject(); h.actor.system.attributes.dex.value = attribute;
    await h.invoke("attack");
    const attack = h.attackMessages()[0]; expect(attack.rolls[0].formula).toBe(pool + " + 10");
    expect(attack.rolls[0].terms[0].number).toBe(Number(pool[0]));
    expect(h.cards.readExecution(attack)?.snapshot).toMatchObject({ generalActions: { aim: false, burst: true },
      bonusDamageDie: { faces: 6, type: "ballisticDamage" }, modifiers: { attackDiceModifier: -1, bonusWeaponDamageDice: 1 } });
    expect(h.weapon.toObject()).toEqual(weapon); expect(h.actor.system.attributes.dex.value).toBe(attribute);
  });
  it.each([[6, 12, false, "2d6+(1d6)"], [10, 20, false, "6d10+(1d10)"], [12, 20, true, "8d12+(1d12)"]])
    ("adds a d%i outside the critical multiplier", async (faces, roll, paid, formula) => {
      const choice = burst(); if (paid) choice.presets = { "attack.tiroIntuitivo": ["use", "empower"] };
      const h = await createAttackReference(root!, { automatic: true, choices: [choice], rolls: [Number(roll)] });
      h.weapon.system.formulas.damage.formula = "2d" + faces;
      const weapon = h.weapon.toObject();
      await h.invoke("attack"); await h.invoke("damage"); await h.invoke("damage");
      expect(h.damageMessages()).toHaveLength(1); expect(h.damageMessages()[0].rolls[0].formula).toBe(formula);
      expect(h.cards.readDamage(h.damageMessages()[0])?.mixedTypes).toBe(false);
      expect(h.actor.system.PE.value).toBe(paid ? 18 : 20); expect(h.weapon.toObject()).toEqual(weapon);
    });
  it("preserves forced criticals, extra parts and mixed damage types", async () => {
    const h = await createAttackReference(root!, { automatic: true, choices: [burst()], rolls: [12] });
    h.weapon.system.formulas.damage.parts = [["1d4", "fireDamage"]];
    h.weapon.system.formulas.damage.attr = "str";
    await h.invoke("attack");
    await h.damage.execute(h.weapon, { attackMessageId: h.attackMessages()[0].id, event: { altKey: true } });
    const message = h.damageMessages()[0]; expect(message.rolls[0].formula).toBe("6d6+1+(1d4)+(1d6)");
    expect(h.cards.readDamage(message)?.mixedTypes).toBe(true);
    h.game.user = h.users[0]; await expect(h.assisted.apply(message)).rejects.toThrow("manual");
  });
  it("restores serialized burst choices without the ability and blocks incompatible weapon edits", async () => {
    const h = await createAttackReference(root!, { automatic: true, choices: [burst()] });
    await h.invoke("attack"); const message = h.attackMessages()[0];
    message.flags[MODULE_ID].attackExecution = JSON.parse(JSON.stringify(message.flags[MODULE_ID].attackExecution));
    h.actor.items.delete("ability"); h.game.user.targets.clear(); h.weapon.system.critical = "20/x2";
    h.weapon.system.formulas.damage.formula = "2d10";
    await expect(h.damage.execute(h.weapon, { attackMessageId: message.id })).rejects.toThrow("mudou");
    expect(h.damageMessages()).toHaveLength(0);
    h.weapon.system.formulas.damage.formula = "2d6";
    await h.damage.execute(h.weapon, { attackMessageId: message.id });
    expect(h.damageMessages()[0].rolls[0].formula).toBe("6d6+(1d6)");
    expect(h.cards.readDamage(h.damageMessages()[0])?.target?.actorUuid).toBe(h.targets[0].actor.uuid);
  });
  it("normalizes v1 in memory and rejects inconsistent current snapshots", async () => {
    const h = await createAttackReference(root!, { choices: [{}] }); await h.invoke("attack");
    const current = h.cards.readExecution(h.attackMessages()[0])!;
    const old: any = structuredClone(current); old.schemaVersion = 1;
    delete old.snapshot.generalActions; delete old.snapshot.bonusDamageDie;
    delete old.snapshot.modifiers.attackDiceModifier; delete old.snapshot.modifiers.bonusWeaponDamageDice;
    const before = JSON.stringify(old), normalized = readAttackExecution(old)!;
    expect(JSON.stringify(old)).toBe(before); expect(normalized.schemaVersion).toBe(4);
    expect(normalized.snapshot.generalActions).toEqual({ aim: false, burst: false });
    h.attackMessages()[0].flags[MODULE_ID].attackExecution = old;
    await h.invoke("damage"); expect(h.damageMessages()).toHaveLength(1);
    for (const corrupt of [
      { ...current, schemaVersion: "3" },
      { ...current, snapshot: { ...current.snapshot, generalActions: undefined } },
      { ...current, snapshot: { ...current.snapshot, generalActions: { aim: false, burst: true } } },
      { ...current, snapshot: { ...current.snapshot, modifiers: { ...current.snapshot.modifiers, attackDiceModifier: 1 } } },
      { ...current, snapshot: { ...current.snapshot, modifiers: { ...current.snapshot.modifiers, attackDiceModifier: undefined } } },
      { ...current, snapshot: { ...current.snapshot, modifiers: { ...current.snapshot.modifiers, attackDiceModifier: 0.5 } } },
    ]) expect(readAttackExecution(corrupt)).toBeNull();
  });
  it.each([false, true])("reads legacy v2 burst %s without rewriting it or resolving current presets", async active => {
    const h = await createAttackReference(root!, { bound: false, automatic: true, choices: [active ? burst() : {}], rolls: [12] });
    await h.invoke("attack"); const attack = h.attackMessages()[0];
    const legacy = structuredClone(attack.flags[MODULE_ID].attackExecution);
    legacy.schemaVersion = 2; legacy.snapshot.burstDamage = legacy.snapshot.bonusDamageDie;
    legacy.snapshot.modifiers.attackDicePenalty = active ? 1 : 0;
    delete legacy.snapshot.bonusDamageDie; delete legacy.snapshot.modifiers.attackDiceModifier;
    const before = JSON.stringify(legacy), normalized = readAttackExecution(legacy)!;
    expect(normalized.schemaVersion).toBe(4); expect(JSON.stringify(legacy)).toBe(before);
    expect(normalized.snapshot.modifiers.attackDiceModifier).toBe(active ? -1 : 0);
    expect(normalized.snapshot).not.toHaveProperty("burstDamage");
    expect(readAttackExecution({ ...legacy, snapshot: { ...legacy.snapshot, modifiers: {
      ...legacy.snapshot.modifiers, attackDicePenalty: 5,
    } } })).toBeNull();
    attack.flags[MODULE_ID].attackExecution = legacy;
    await h.invoke("damage"); expect(h.damageMessages()[0].rolls[0].formula).toBe(active ? "2d6+(1d6)" : "2d6");
  });
  it.each([[2, 2, "3d20kh", 1], [1, 2, "2d20kh", 0], [0, 2, "1d20kh", -1],
    [2, 0, "1d20kh", 1], [1, 0, "2d20kl", 0], [0, 0, "3d20kl", -1], [2, -1, "1d20kh", 1]])
    ("combines a +%i preset with burst on native attribute %i", async (bonus, attribute, pool, expected) => {
      const choice = burst(); choice.presets = { "test.bonus": ["use"] };
      const h = await createAttackReference(root!, { bound: false, automatic: true, choices: [choice] });
      bindModifier(h, "test.bonus", { attackDiceModifier: Number(bonus) });
      h.actor.system.attributes.dex.value = Number(attribute);
      await h.invoke("attack");
      expect(h.attackMessages()[0].rolls[0].formula).toBe(pool + " + 10");
      expect(h.cards.readExecution(h.attackMessages()[0])?.snapshot.modifiers.attackDiceModifier).toBe(expected);
    });
  it("persists combined damage dice and uses them once after reload without the contributing abilities", async () => {
    const choice = burst(); choice.presets = { "test.bonus": ["use"], "test.penalty": ["use"] };
    const h = await createAttackReference(root!, { bound: false, automatic: true, choices: [choice], rolls: [20] });
    bindModifier(h, "test.bonus", { attackDiceModifier: 2, bonusWeaponDamageDice: 2 });
    bindModifier(h, "test.penalty", { attackDiceModifier: -1 });
    await h.invoke("attack"); const attack = h.attackMessages()[0];
    expect(attack.rolls[0].formula).toBe("2d20kh + 10");
    expect(h.cards.readExecution(attack)?.snapshot.modifiers).toMatchObject({ attackDiceModifier: 0, bonusWeaponDamageDice: 3 });
    expect(h.cards.readExecution(attack)?.snapshot.modifiers.attackDiceContributions).toEqual([-1, 2, -1]);
    expect(h.cards.readExecution(attack)?.snapshot.modifiers.bonusWeaponDamageContributions).toEqual([1, 2]);
    attack.flags[MODULE_ID].attackExecution = JSON.parse(JSON.stringify(attack.flags[MODULE_ID].attackExecution));
    h.actor.items.delete("test.bonus"); h.actor.items.delete("test.penalty");
    await h.invoke("damage"); await h.invoke("damage");
    expect(h.damageMessages()).toHaveLength(1);
    expect(h.damageMessages()[0].rolls[0].formula).toBe("6d6+(3d6)");
    expect(h.weapon.system.formulas.damage.parts).toEqual([]);
  });
  it("preserves contribution details after reload and safely reads totals without historical details", async () => {
    const choice = burst(); choice.presets = { "test.bonus": ["use"] };
    const h = await createAttackReference(root!, { bound: false, automatic: true, choices: [choice] });
    bindModifier(h, "test.bonus", { attackDiceModifier: 2, bonusWeaponDamageDice: 2 });
    await h.invoke("attack"); const saved = JSON.parse(JSON.stringify(h.attackMessages()[0].flags[MODULE_ID].attackExecution));
    const current = readAttackExecution(saved)!;
    expect(current.snapshot.modifiers.attackDiceContributions).toEqual([-1, 2]);
    for (const [field, invalid] of [["attackDiceContributions", [5]], ["attackDiceContributions", [0, 1]],
      ["bonusWeaponDamageContributions", [1, -1, 3]], ["bonusWeaponDamageContributions", "3"]]) {
      const corrupt = structuredClone(saved); corrupt.snapshot.modifiers[String(field)] = invalid;
      expect(readAttackExecution(corrupt)).toBeNull();
    }
    delete saved.snapshot.modifiers.attackDiceContributions; delete saved.snapshot.modifiers.bonusWeaponDamageContributions;
    const before = JSON.stringify(saved), legacy = readAttackExecution(saved)!;
    expect(legacy.snapshot.modifiers.attackDiceContributions).toEqual([1]);
    expect(legacy.snapshot.modifiers.bonusWeaponDamageContributions).toEqual([3]);
    expect(JSON.stringify(saved)).toBe(before);
  });
  it("resolves bonus damage without burst and rejects an ambiguous weapon base before rolling", async () => {
    const h = await createAttackReference(root!, { bound: false, choices: [{ "test.damage": ["use"] }], rolls: [12] });
    bindModifier(h, "test.damage", { bonusWeaponDamageDice: 2 });
    await h.invoke("attack"); await h.invoke("damage");
    expect(h.damageMessages()[0].rolls[0].formula).toBe("2d6+(2d6)");
    h.weapon.system.formulas.damage.formula = "2d6+1";
    h.request.mockResolvedValueOnce({ ...emptyAttackConfiguration(), presets: { "test.damage": ["use"] } });
    await h.invoke("attack"); expect(h.attackMessages()).toHaveLength(1);
    expect(h.actor.system.PE.value).toBe(20);
  });
  it("revalidates firearm eligibility and rejects hidden incompatible selections before rolling", async () => {
    const h = await createAttackReference(root!, { automatic: true, choices: [burst()] });
    h.request.mockImplementationOnce(async () => { h.weapon.system.conditions.automatic = false; return burst(); });
    await h.invoke("attack"); expect(h.attackMessages()).toHaveLength(0); expect(h.actor.system.PE.value).toBe(20);
    h.request.mockResolvedValueOnce({ generalActions: { aim: true, burst: false }, presets: { "attack.tiroIntuitivo": ["use", "empower"] } });
    await h.invoke("attack"); expect(h.attackMessages()).toHaveLength(0); expect(h.actor.system.PE.value).toBe(20);
  });
  it("keeps aim informational, clears choices on a new use and cancels without costs", async () => {
    const h = await createAttackReference(root!, { bound: false, automatic: true,
      choices: [{ generalActions: { aim: true, burst: true }, presets: {} }, {}, null], rolls: [12, 12] });
    await h.invoke("attack"); await h.invoke("damage");
    await h.invoke("attack"); await h.invoke("damage"); await h.invoke("attack");
    expect(h.attackMessages().map(message => message.rolls[0].formula)).toEqual(["1d20kh + 10", "2d20kh + 10"]);
    expect(h.damageMessages().map(message => message.rolls[0].formula)).toEqual(["2d6+(1d6)", "2d6"]);
    expect(h.cards.readBinding(h.source)?.executions[0].state).toBe("cancelled"); expect(h.actor.system.PE.value).toBe(20);
  });
  it("rejects an unexpected native pool before evaluating or charging the paid selection", async () => {
    const choice = burst(); choice.presets = { "attack.tiroIntuitivo": ["use", "empower"] };
    const h = await createAttackReference(root!, { automatic: true, choices: [choice], rolls: [20] });
    h.actor.system.attributes.dex.value = 1.5;
    await h.invoke("attack");
    expect(h.attackMessages()).toHaveLength(0); expect(h.actor.system.PE.value).toBe(20);
    expect(h.rollQueue).toEqual([20]); expect(h.cards.readBinding(h.source)?.executions[0].state).toBe("failed");
  });
  it("keeps burst damage blocked by a pending reaction and a Dodge that turns the hit into a miss", async () => {
    const h = await createAttackReference(root!, { automatic: true, choices: [burst()], rolls: [12] });
    const target = h.targets[0].actor;
    target.type = "agent"; target.system.PV = { value: 100, max: 100 };
    target.system.attributes = { dex: { value: 2 } };
    target.system.skills = { reflexes: { degree: { value: 15 }, value: 0, mod: 0 } };
    await h.invoke("attack"); const attack = h.attackMessages()[0];
    await expect(h.damage.execute(h.weapon, { attackMessageId: attack.id })).rejects.toThrow("reação");
    h.game.user = h.users[0];
    await h.reactions.handleReaction({ sender: h.users[0], payload: { type: "dodge", messageId: attack.id, defenderUuid: target.uuid } });
    await expect(h.damage.execute(h.weapon, { attackMessageId: attack.id })).rejects.toThrow("errou");
    expect(h.damageMessages()).toHaveLength(0);
  });
  it("retains native per-attack scheduling with independent choices", async () => {
    const h = await createAttackReference(root!, { bound: false, automatic: true, attacks: 2, targeted: 2,
      choices: [burst(), {}], rolls: [20, 12] });
    await h.invoke("attack"); await h.invoke("damage");
    expect(h.request).toHaveBeenCalledTimes(2);
    expect(h.damageMessages().map(message => message.rolls[0].formula)).toEqual(["6d6+(1d6)", "2d6"]);
  });
});
