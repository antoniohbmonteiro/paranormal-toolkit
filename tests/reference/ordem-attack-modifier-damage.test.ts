import { afterEach, describe, expect, it, vi } from "vitest";
import { createAttackReference } from "./helpers/attack-reference";

const root = process.env.PARANORMAL_TOOLKIT_ORDEM_REFERENCE;
const paid = { "attack.tiroIntuitivo": ["use", "empower"] };
afterEach(() => vi.unstubAllGlobals());
describe.skipIf(!root)("per-attack damage and costs using real Ordem methods", () => {
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
    h.request.mockImplementationOnce(async () => { h.actor.system.PE.value = 1; return paid; });
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
