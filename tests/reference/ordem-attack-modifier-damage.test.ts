import { afterEach, describe, expect, it, vi } from "vitest";
import { createAttackReference } from "./helpers/attack-reference";
import { readAttackExecution } from "../../src/features/attack-modifiers/attack-card-state";
import { MODULE_ID } from "../../src/constants";

const root = process.env.PARANORMAL_TOOLKIT_ORDEM_REFERENCE;
const paid = { "attack.tiroIntuitivo": ["use", "empower"] };
afterEach(() => vi.unstubAllGlobals());
describe.skipIf(!root)("per-attack damage and costs using real Ordem methods", () => {
  it.each([12, 20])("applies 20 RD penetration from both paid powers on native roll %i", async die => {
    const h = await createAttackReference(root!, { presetIds: ["attack.disparoDaMorte", "attack.tiroIntuitivo"], rolls: [die],
      choices: [{ "attack.disparoDaMorte": ["use", "affinity"], "attack.tiroIntuitivo": ["use", "empower"] }] });
    await h.invoke("attack"); await h.invoke("damage");
    expect(h.cards.readExecution(h.attackMessages()[0])?.snapshot.modifiers).toMatchObject({
      critical: { margin: 15, multiplier: 4 }, effortCost: 4, resistancePenetration: 20 });
    expect(h.actor.system.PE.value).toBe(16); h.game.user = h.users[0];
    const message = h.damageMessages()[0];
    await h.assisted.apply(message); await h.assisted.apply(message);
    expect(h.targets[0].actor.system.attributes.hp.value).toBe(100 - message.rolls[0].total);
  });
  it("combines special attack, burst, death shot and aimed lethal shot using PD", async () => {
    const h = await createAttackReference(root!, { automatic: true, pd: true, rolls: [20],
      presetIds: ["attack.ataqueEspecial", "attack.disparoDaMorte", "attack.disparoLetal"],
      choices: [{ generalActions: { aim: true, burst: true }, specialAttack: { attackBlocks: 1, damageBlocks: 2 },
        presets: { "attack.ataqueEspecial": ["use"], "attack.disparoDaMorte": ["use", "affinity"], "attack.disparoLetal": ["use"] } }] });
    await h.invoke("attack"); await h.invoke("damage");
    expect(h.attackMessages()[0].rolls[0].terms[0].number).toBe(1);
    expect(h.attackMessages()[0].rolls[0].total).toBe(35);
    expect(h.cards.readExecution(h.attackMessages()[0])?.snapshot.modifiers).toMatchObject({
      critical: { margin: 15, multiplier: 3 }, effortCost: 7, attackBonus: 5, damageBonus: 10 });
    expect(h.damageMessages()[0].rolls[0].formula).toBe("6d6+(1d6)+(10)");
    expect(h.actor.system.PD.value).toBe(13); expect(h.actor.system.PE.value).toBe(20);
  });
  it("revalidates progression mode and allocation after configuration", async () => {
    const choice = { generalActions: { aim: false, burst: false }, presets: { "attack.ataqueEspecial": ["use"] },
      specialAttack: { attackBlocks: 1, damageBlocks: 2 } };
    const h = await createAttackReference(root!, { progressRule: 2, level: 11, nex: 5, presetIds: ["attack.ataqueEspecial"] });
    h.request.mockImplementationOnce(async input => {
      expect(input.progression).toEqual({ mode: "level", value: 11 }); h.actor.system.nivel.value = 5; return choice;
    });
    await h.invoke("attack"); expect(h.attackMessages()).toHaveLength(0); expect(h.actor.system.PE.value).toBe(20);
    expect(h.notifications.warn).toHaveBeenCalledWith(expect.stringContaining("limite"));
  });
  it.each([
    { generalActions: { aim: false, burst: false }, presets: { "attack.disparoLetal": ["use"] } },
    { generalActions: { aim: true, burst: false }, presets: { "attack.disparoLetal": ["use"], "attack.tiroIntuitivo": ["use"] } },
    { generalActions: { aim: false, burst: false }, presets: { "attack.disparoDaMorte": ["affinity"] } },
  ])("rejects hidden incompatible states before spending: %j", async choice => {
    const h = await createAttackReference(root!, { presetIds: ["attack.disparoLetal", "attack.disparoDaMorte", "attack.tiroIntuitivo"], choices: [choice] });
    await h.invoke("attack"); expect(h.attackMessages()).toHaveLength(0); expect(h.actor.system.PE.value).toBe(20);
  });
  it("uses damage-only bonuses without requiring a simple base and refuses a changed damage type", async () => {
    const choice = { generalActions: { aim: false, burst: false }, presets: { "attack.ataqueEspecial": ["use"] },
      specialAttack: { attackBlocks: 0, damageBlocks: 2 } };
    const h = await createAttackReference(root!, { presetIds: ["attack.ataqueEspecial"], choices: [choice], rolls: [12] });
    h.weapon.system.formulas.damage.formula = "2d6+1";
    h.weapon.system.formulas.damage.parts = [["1d4", "fireDamage"]];
    await h.invoke("attack"); const attack = h.attackMessages()[0];
    h.weapon.system.formulas.damage.type = "impactDamage";
    await expect(h.damage.execute(h.weapon, { attackMessageId: attack.id })).rejects.toThrow("tipo de dano");
    h.weapon.system.formulas.damage.type = "ballisticDamage";
    await h.damage.execute(h.weapon, { attackMessageId: attack.id });
    expect(h.damageMessages()[0].rolls[0].formula).toBe("2d6+1+(1d4)+(10)");
    expect(h.cards.readDamage(h.damageMessages()[0])?.mixedTypes).toBe(true);
  });
  it("normalizes v3 without changing raw flags and rejects malformed v4 bonus parameters", async () => {
    const h = await createAttackReference(root!); await h.invoke("attack");
    const original = h.attackMessages()[0].flags[MODULE_ID].attackExecution;
    const legacy = structuredClone(original); legacy.schemaVersion = 3;
    delete legacy.snapshot.modifiers.attackBonus; delete legacy.snapshot.modifiers.damageBonus; delete legacy.snapshot.flatDamageType;
    const before = JSON.stringify(legacy), normalized = readAttackExecution(legacy)!;
    expect(JSON.stringify(legacy)).toBe(before); expect(normalized.schemaVersion).toBe(4);
    expect(normalized.snapshot.modifiers).toMatchObject({ attackBonus: 0, damageBonus: 0 });
    for (const value of [-1, NaN, 0.5, "5", undefined]) {
      const invalid = structuredClone(original); invalid.snapshot.modifiers.damageBonus = value;
      expect(readAttackExecution(invalid)).toBeNull();
    }
    const special = await createAttackReference(root!, { presetIds: ["attack.ataqueEspecial"], choices: [{
      generalActions: { aim: false, burst: false }, presets: { "attack.ataqueEspecial": ["use"] }, specialAttack: { attackBlocks: 1, damageBlocks: 0 } }] });
    await special.invoke("attack"); const flag = special.attackMessages()[0].flags[MODULE_ID].attackExecution;
    for (const parameters of [undefined, { attackBlocks: 0, damageBlocks: 0 }, { attackBlocks: -1, damageBlocks: 1 },
      { attackBlocks: 1.5, damageBlocks: 0 }, { attackBlocks: 3, damageBlocks: 2 }]) {
      const invalid = structuredClone(flag); invalid.snapshot.modifiers.selected[0].parameters = parameters;
      expect(readAttackExecution(invalid)).toBeNull();
    }
  });
  it.each([[12, false, "2d6+(10)", 18], [20, false, "6d6+(10)", 34], [12, true, "6d6+(10)", 34]])
    ("keeps special attack damage outside native criticals (%i, forced %s)", async (die, forced, formula, total) => {
      const choice = { generalActions: { aim: false, burst: false }, presets: { "attack.ataqueEspecial": ["use"] },
        specialAttack: { attackBlocks: 1, damageBlocks: 2 } };
      const h = await createAttackReference(root!, { presetIds: ["attack.ataqueEspecial"], choices: [choice], rolls: [Number(die)] });
      h.weapon.system.formulas.attack.bonus = "-2 + 3";
      const original = h.weapon.toObject();
      await h.invoke("attack");
      const message = h.attackMessages()[0], flag = h.cards.readExecution(message)!;
      expect(message.rolls[0].total).toBe(Number(die) + 10 + 1 + 5);
      expect(flag.snapshot.rolledCritical).toBe(Number(die) === 20);
      expect(flag.schemaVersion).toBe(4);
      message.flags["paranormal-toolkit"].attackExecution = JSON.parse(JSON.stringify(message.flags["paranormal-toolkit"].attackExecution));
      h.actor.items.delete("ability"); h.actor.system.NEX.value = 5; h.game.user.targets.clear();
      await h.damage.execute(h.weapon, { attackMessageId: message.id, event: { altKey: Boolean(forced) } });
      expect(h.damageMessages()[0].rolls[0].formula).toBe(formula);
      expect(h.damageMessages()[0].rolls[0].total).toBe(total);
      await h.damage.execute(h.weapon, { attackMessageId: message.id });
      expect(h.damageMessages()).toHaveLength(1); expect(h.actor.system.PE.value).toBe(16);
      expect(h.weapon.toObject()).toEqual(original);
    });
  it("applies independent RD penetration on critical and non-critical hits without rerolling", async () => {
    const h = await createAttackReference(root!, { attacks: 3, targeted: 3, choices: [paid, { "attack.tiroIntuitivo": ["use"] }, paid], rolls: [20, 20, 12] });
    await h.invoke("attack"); await h.invoke("damage");
    h.game.user = h.users[0];
    const damage = h.damageMessages();
    for (const message of damage) await h.assisted.apply(message);
    // Raw native damage: 32 / 24 / 8. Residual RD: 5 / 15 / 0.
    expect(h.targets.map(target => target.actor.system.attributes.hp.value)).toEqual([73, 91, 92]);
    expect(h.cards.readExecution(h.attackMessages()[2])!.snapshot.rolledCritical).toBe(false);
    const count = h.messages.size;
    await h.assisted.apply(damage[0]);
    expect(h.messages.size).toBe(count);
    expect(h.targets[0].actor.system.attributes.hp.value).toBe(73);
  });
  it("deduplicates concurrent damage and applications", async () => {
    const h = await createAttackReference(root!);
    await h.invoke("attack");
    const id = h.attackMessages()[0].id;
    await Promise.all([h.damage.execute(h.weapon, { attackMessageId: id }), h.damage.execute(h.weapon, { attackMessageId: id })]);
    expect(h.damageMessages()).toHaveLength(1);
    h.game.user = h.users[0];
    await Promise.all([h.assisted.apply(h.damageMessages()[0]), h.assisted.apply(h.damageMessages()[0])]);
    expect(h.targets[0].actor.system.attributes.hp.value).toBe(73);
  });
  it("uses PD according to the native effort setting", async () => {
    const h = await createAttackReference(root!, { pd: true });
    await h.invoke("attack");
    expect(h.actor.system.PD.value).toBe(18); expect(h.actor.system.PE.value).toBe(20);
    expect(h.cards.readExecution(h.attackMessages()[0])!.snapshot.resourceReceipt?.resource).toBe("PD");
  });
  it("revalidates the balance after the dialog without rolling or charging", async () => {
    const h = await createAttackReference(root!);
    h.request.mockImplementationOnce(async () => { h.actor.system.PE.value = 1; return { generalActions: { aim: false, burst: false }, presets: paid }; });
    await h.invoke("attack");
    expect(h.attackMessages()).toHaveLength(0); expect(h.actor.system.PE.value).toBe(1);
    expect(h.cards.readBinding(h.source)!.executions[0].state).toBe("failed");
  });
  it("restores a confirmed publication veto and blocks an uncertain server response", async () => {
    const h = await createAttackReference(root!, { choices: [paid, paid] });
    h.publication.veto = true;
    await h.invoke("attack");
    expect(h.actor.system.PE.value).toBe(20);
    expect(h.cards.readBinding(h.source)!.executions[0].state).toBe("failed");
    h.publication.veto = false; h.publication.failAttack = true;
    await h.invoke("attack");
    expect(h.actor.system.PE.value).toBe(18);
    expect(h.cards.readBinding(h.source)!.executions[0].state).toBe("uncertain");
    await h.invoke("damage"); expect(h.damageMessages()).toHaveLength(0);
  });
  it("preserves earlier damage on a later failure and reuses it during an explicit retry", async () => {
    const h = await createAttackReference(root!, { attacks: 2, targeted: 2, choices: [paid, paid] });
    await h.invoke("attack");
    const original = h.ChatMessage.create.getMockImplementation()!;
    let damageCount = 0;
    h.ChatMessage.create.mockImplementation(async (data: any) => {
      if (data.flags?.["paranormal-toolkit"]?.attackDamage && ++damageCount === 2) return undefined;
      return original(data);
    });
    await h.invoke("damage");
    expect(h.damageMessages()).toHaveLength(1);
    await h.invoke("damage");
    expect(h.damageMessages()).toHaveLength(2);
    expect(h.actor.system.PE.value).toBe(16);
    expect(h.damageMessages().map(message => h.cards.readDamage(message)!.executionId)).toEqual(
      h.attackMessages().map(message => h.cards.readExecution(message)!.snapshot.executionId));
  });
  it("does not reroll a damage publication with an ambiguous response", async () => {
    const h = await createAttackReference(root!);
    await h.invoke("attack"); h.publication.failDamage = true;
    await h.invoke("damage");
    expect(h.cards.readExecution(h.attackMessages()[0])!.damage.state).toBe("uncertain");
    h.publication.failDamage = false;
    await h.invoke("damage"); expect(h.damageMessages()).toHaveLength(0);
  });
  it("keeps mixed damage manual and rejects application without an original target", async () => {
    const h = await createAttackReference(root!);
    h.weapon.system.formulas.damage.parts = [["1d6", "fireDamage"]];
    await h.invoke("attack"); await h.invoke("damage");
    expect(h.cards.readDamage(h.damageMessages()[0])!.mixedTypes).toBe(true);
    h.game.user = h.users[0];
    await expect(h.assisted.apply(h.damageMessages()[0])).rejects.toThrow("manual");
  });
  it("preserves the selected multiplier for the native forced-critical event", async () => {
    const h = await createAttackReference(root!, { rolls: [12] });
    await h.invoke("attack");
    await h.damage.execute(h.weapon, { attackMessageId: h.attackMessages()[0].id, event: { altKey: true } });
    expect(h.damageMessages()[0].rolls[0].formula).toBe("8d6");
    expect(h.cards.readExecution(h.attackMessages()[0])!.snapshot.rolledCritical).toBe(false);
  });
});
