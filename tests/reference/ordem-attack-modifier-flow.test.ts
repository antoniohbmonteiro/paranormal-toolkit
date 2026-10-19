import { afterEach, describe, expect, it, vi } from "vitest";
import { MODULE_ID } from "../../src/constants";
import { AutomationRegistry } from "../../src/core/automation/automation-registry";
import { AutomationBinder } from "../../src/core/automation/automation-binder";
import { OrdemItemPatchAdapter } from "../../src/adapters/ordem/ordem-item-patch-adapter";
import { PresetManagerService } from "../../src/features/presets/preset-manager-service";
import { RitualPresetDiagnosticService } from "../../src/features/rituals/presets/ritual-preset-diagnostic";
import { RitualPresetApplicationService } from "../../src/features/rituals/presets/ritual-preset-application-service";
import { createAttackReference } from "./helpers/attack-reference";

const root = process.env.PARANORMAL_TOOLKIT_ORDEM_REFERENCE;
const paid = { "attack.tiroIntuitivo": ["use", "empower"] };
const free = { "attack.tiroIntuitivo": ["use"] };
afterEach(() => vi.unstubAllGlobals());
describe.skipIf(!root)("attack modifier integration with real OrdemItem methods", () => {
  it("uses a manager-applied binding after renaming without acquisition checks and preserves the published snapshot", async () => {
    const h = await createAttackReference(root!, { bound: false, attacks: 2, choices: [paid, free], rolls: [20, 20] });
    h.actor.system.skills.aim.degree.value = 0;
    const ItemClass = h.weapon.constructor as any;
    const ability = new ItemClass({ _id: "ability", type: "ability", name: "Tiro Intuitivo", system: {} }, { parent: h.actor });
    h.actor.items.set(ability.id, ability);
    expect(h.attacks.available(h.weapon)).toEqual([]);
    const rituals = new RitualPresetDiagnosticService(new AutomationRegistry());
    const manager = new PresetManagerService(rituals,
      new RitualPresetApplicationService(rituals, new AutomationBinder(), new OrdemItemPatchAdapter()), h.attacks.registry);
    expect((await manager.applyPending(h.actor)).applied).toHaveLength(1);
    ability.name = "Poder renomeado";
    expect(manager.analyzeActor(h.actor).upToDate).toHaveLength(1);
    await h.invoke("attack");
    const snapshots = h.attackMessages().map(message => structuredClone(h.cards.readExecution(message)!.snapshot));
    await ability.unsetFlag(MODULE_ID, "attackModifier");
    await h.invoke("damage");
    expect(h.damageMessages().map(message => message.rolls[0].formula)).toEqual(["8d6", "6d6"]);
    expect(h.damageMessages().map(message => h.cards.readDamage(message)!.resistancePenetration)).toEqual([10, 0]);
    expect(h.attackMessages().map(message => h.cards.readExecution(message)!.snapshot)).toEqual(snapshots);
    expect(h.actor.system.PE.value).toBe(18);
  });
  it("leaves ordinary attacks native without any dialog or resource spending", async () => {
    const h = await createAttackReference(root!, { bound: false });
    const result = await h.weapon.rollAttack();
    expect(result.roll).toBeTruthy(); expect(h.request).not.toHaveBeenCalled();
    expect(h.actor.system.PE.value).toBe(20); expect(h.attackMessages()).toHaveLength(0);
  });
  it("preserves one snapshot and one cost per native inner attack, keeping the volley damage loop", async () => {
    const h = await createAttackReference(root!, { attacks: 3, targeted: 3, choices: [paid, free, paid], rolls: [20, 20, 12] });
    await h.invoke("attack");
    expect(h.request).toHaveBeenCalledTimes(3);
    const binding = h.cards.readBinding(h.source)!;
    expect(binding.executions).toHaveLength(3);
    const flags = h.attackMessages().map(message => h.cards.readExecution(message)!);
    expect(flags.map(flag => flag.snapshot.modifiers.critical.multiplier)).toEqual([4, 3, 4]);
    expect(flags.map(flag => flag.snapshot.modifiers.resistancePenetration)).toEqual([10, 0, 10]);
    expect(flags.map(flag => flag.snapshot.rolledCritical)).toEqual([true, true, false]);
    expect(flags.map(flag => flag.snapshot.target?.actorUuid)).toEqual(h.targets.map(target => target.actor.uuid));
    expect(new Set(binding.executions.map(entry => entry.executionId)).size).toBe(3);
    expect(h.actor.system.PE.value).toBe(16);
    await h.invoke("damage");
    expect(h.damageMessages().map(message => message.rolls[0].formula)).toEqual(["8d6", "6d6", "2d6"]);
    expect(h.damageMessages().map(message => h.cards.readDamage(message)!.resistancePenetration)).toEqual([10, 0, 10]);
    expect(h.damageMessages().map(message => h.cards.readDamage(message)!.target?.actorUuid)).toEqual(h.targets.map(target => target.actor.uuid));
    await h.invoke("damage");
    expect(h.damageMessages()).toHaveLength(3); expect(h.actor.system.PE.value).toBe(16);
    expect(h.weapon.system.critical).toBe("19/x3");
  });
  it("captures every untargeted message, even with no native hitResult", async () => {
    const h = await createAttackReference(root!, { attacks: 3, targeted: 0, choices: [paid, free, {}] });
    const result = await h.weapon.rollAttack();
    expect(h.attackMessages()).toHaveLength(3);
    expect(h.attackMessages().every(message => message.getFlag("ordemparanormal", "hitResult") === undefined)).toBe(true);
    expect(result.hitResult.attackResults.map((entry: any) => entry.attackMessageId)).toEqual(h.attackMessages().map(message => message.id));
    await h.weapon.rollVolleyDamage(result.hitResult.attackResults, {});
    expect(h.damageMessages()).toHaveLength(3);
    expect(h.damageMessages().every(message => h.cards.readDamage(message)!.target === null)).toBe(true);
    expect(h.damageMessages().every(message => message.getFlag("ordemparanormal", "damageTarget") === undefined)).toBe(true);
  });
  it("handles null native indexes for multiple targeted rolls", async () => {
    const h = await createAttackReference(root!, { attacks: 1, targeted: 2, choices: [paid, free] });
    await h.invoke("attack");
    const binding = h.cards.readBinding(h.source)!;
    expect(binding.executions).toHaveLength(2);
    expect(h.attackMessages().map(message => h.cards.readExecution(message)!.snapshot.nativeAttackIndex)).toEqual([null, null]);
    await h.invoke("damage");
    expect(h.damageMessages().map(message => h.cards.readDamage(message)!.resistancePenetration)).toEqual([10, 0]);
  });
  it.each([0, 1, 2])("cancels native attack %i without a roll, cost, or false hit", async cancelled => {
    const choices: any[] = [paid, paid, paid]; choices[cancelled] = null;
    const h = await createAttackReference(root!, { attacks: 3, targeted: 0, choices });
    await h.invoke("attack");
    expect(h.cards.readBinding(h.source)!.executions[cancelled].state).toBe("cancelled");
    expect(h.attackMessages()).toHaveLength(2); expect(h.actor.system.PE.value).toBe(16);
    await h.invoke("damage");
    expect(h.damageMessages()).toHaveLength(2);
  });
  it("does not carry modifiers across successive uses of the same card, including no target and cancellation", async () => {
    const h = await createAttackReference(root!, { choices: [paid, {}, null], rolls: [20, 20] });
    await h.invoke("attack");
    const first = h.cards.readBinding(h.source)!;
    h.game.user.targets.clear();
    await h.invoke("attack");
    const second = h.cards.readBinding(h.source)!;
    expect(second.activeUseId).not.toBe(first.activeUseId);
    await h.invoke("damage", h.source, first.activeUseId);
    expect(h.damageMessages()).toHaveLength(0);
    await h.invoke("damage");
    expect(h.damageMessages()).toHaveLength(1);
    const flag = h.cards.readDamage(h.damageMessages()[0])!;
    expect(flag.target).toBeNull(); expect(flag.multiplier).toBe(3); expect(flag.resistancePenetration).toBe(0);
    await h.invoke("attack");
    await h.invoke("damage");
    expect(h.damageMessages()).toHaveLength(1);
    expect(h.cards.readBinding(h.source)!.executions[0].state).toBe("cancelled");
  });
  it("protects two cards for the same weapon from the native most-recent-card heuristic", async () => {
    const h = await createAttackReference(root!);
    const newer = await h.ChatMessage.create({ content: '<div class="chat-card item-card" data-item-id="weapon"></div>' });
    await h.invoke("attack", h.source);
    expect(newer.getFlag("ordemparanormal", "hitResult")).toBeUndefined();
    expect(h.cards.readBinding(h.source)!.executions[0].attackMessageId).toBe(h.attackMessages()[0].id);
  });
  it("keeps snapshots usable with fresh services after a chat reload and weapon changes", async () => {
    const h = await createAttackReference(root!, { attacks: 2, targeted: 2, choices: [paid, free] });
    await h.invoke("attack");
    const old = h.cards.readBinding(h.source)!;
    h.weapon.system.critical = "20/x2";
    const { AttackChatCardService } = await import("../../src/features/attack-modifiers/attack-chat-card-service");
    const { AttackDamageResolver } = await import("../../src/features/attack-modifiers/attack-damage-resolver");
    const { OrdemAttackAdapter } = await import("../../src/adapters/ordem/attacks/ordem-attack-adapter");
    const resolver = new AttackDamageResolver(new AttackChatCardService(), new OrdemAttackAdapter());
    const entries = await resolver.card(h.source, old.activeUseId, h.weapon);
    await h.weapon.rollVolleyDamage(entries, {});
    expect(h.damageMessages().map(message => message.rolls[0].formula)).toEqual(["8d6", "6d6"]);
    expect(h.damageMessages().map(message => message.getFlag(MODULE_ID, "attackDamage").multiplier)).toEqual([4, 3]);
  });
  it("does not merge attacks on the same target or roll damage for a native miss", async () => {
    const h = await createAttackReference(root!, { attacks: 2, targeted: 1, choices: [paid, free], rolls: [20, 12] });
    h.targets[0].actor.system.defense.value = 30;
    await h.invoke("attack");
    const flags = h.attackMessages().map(message => h.cards.readExecution(message)!);
    expect(flags[0].snapshot.target?.actorUuid).toBe(flags[1].snapshot.target?.actorUuid);
    expect(flags[0].snapshot.executionId).not.toBe(flags[1].snapshot.executionId);
    await h.invoke("damage");
    expect(h.damageMessages()).toHaveLength(1);
    expect(h.cards.readDamage(h.damageMessages()[0])!.executionId).toBe(flags[0].snapshot.executionId);
  });
  it("coalesces two overlapping clicks on the same card", async () => {
    const h = await createAttackReference(root!);
    await Promise.all([h.invoke("attack"), h.invoke("attack")]);
    expect(h.request).toHaveBeenCalledTimes(1);
    expect(h.attackMessages()).toHaveLength(1);
    expect(h.actor.system.PE.value).toBe(18);
  });
  it("rejects a corrupt persisted snapshot instead of falling back to native unmodified damage", async () => {
    const h = await createAttackReference(root!);
    await h.invoke("attack");
    await h.attackMessages()[0].setFlag(MODULE_ID, "attackExecution", { schemaVersion: 999 });
    await h.invoke("damage");
    expect(h.damageMessages()).toHaveLength(0);
  });
  it("rejects an aggregate hitResult passed to individual damage instead of applying the first snapshot to it", async () => {
    const h = await createAttackReference(root!, { attacks: 2, targeted: 2, choices: [paid, free] });
    const result = await h.weapon.rollAttack();
    await expect(h.weapon.rollDamage({ hitResult: result.hitResult })).rejects.toThrow("individualmente");
    expect(h.damageMessages()).toHaveLength(0);
    await h.weapon.rollVolleyDamage(result.hitResult.attackResults, {});
    expect(h.damageMessages()).toHaveLength(2);
  });
});
