import { afterEach, describe, expect, it, vi } from "vitest";
import { MODULE_ID } from "../../../src/constants";
import { AutomationBinder } from "../../../src/core/automation/automation-binder";
import { AutomationRegistry } from "../../../src/core/automation/automation-registry";
import { OrdemItemPatchAdapter } from "../../../src/adapters/ordem/ordem-item-patch-adapter";
import { AttackModifierRegistry } from "../../../src/features/attack-modifiers/attack-modifier-registry";
import { readAttackModifierBinding } from "../../../src/features/attack-modifiers/attack-modifier-binding";
import { PresetManagerService } from "../../../src/features/presets/preset-manager-service";
import { createBuiltInAutomationPresets } from "../../../src/features/rituals/ritual-automation-presets";
import { RitualPresetDiagnosticService } from "../../../src/features/rituals/presets/ritual-preset-diagnostic";
import { RitualPresetApplicationService } from "../../../src/features/rituals/presets/ritual-preset-application-service";

function setup(role: "gm" | "owner" | "observer" = "owner") {
  const game = { user: { id: role, isGM: role === "gm" }, packs: new Map() };
  vi.stubGlobal("game", game);
  const items: any[] = [];
  const actor: any = { id: "actor", uuid: "Actor.actor", name: "Rafa", type: "agent", items: { contents: items }, system: {},
    testUserPermission: vi.fn((user: any) => user.isGM || user.id === "owner"),
    canUserModify: vi.fn((user: any) => user.isGM || user.id === "owner") };
  const registry = new AutomationRegistry(); registry.registerMany(createBuiltInAutomationPresets());
  const diagnostic = new RitualPresetDiagnosticService(registry);
  const rituals = new RitualPresetApplicationService(diagnostic, new AutomationBinder(), new OrdemItemPatchAdapter());
  const attacks = new AttackModifierRegistry();
  const manager = new PresetManagerService(diagnostic, rituals, attacks);
  function add(name: string, type = "ritual", initial: Record<string, unknown> = {}) {
    const flags: Record<string, any> = structuredClone(initial);
    const item: any = { id: String(items.length), uuid: actor.uuid + ".Item." + items.length,
      parent: actor, name, type, flags: { [MODULE_ID]: flags }, system: { description: "<p>Original</p>", chatDescription: "Chat" },
      canUserModify: vi.fn((user: any) => actor.canUserModify(user)),
      getFlag: (_scope: string, key: string) => flags[key],
      setFlag: vi.fn(async (_scope: string, key: string, value: unknown) => { flags[key] = structuredClone(value); return item; }),
      unsetFlag: vi.fn(async (_scope: string, key: string) => { delete flags[key]; return item; }),
      update: vi.fn(async (changes: Record<string, unknown>) => {
        for (const [path, value] of Object.entries(changes)) {
          const keys = path.split("."); let target = item;
          for (const key of keys.slice(0, -1)) target = target[key] ??= {};
          target[keys.at(-1)!] = structuredClone(value);
        }
        return item;
      }) };
    items.push(item); return item;
  }
  return { actor, items, add, registry, diagnostic, rituals, attacks, manager, game };
}
afterEach(() => vi.unstubAllGlobals());

describe("existing preset manager expansion", () => {
  it("keeps empty and generic-only actors empty without writes", () => {
    const h = setup();
    expect(h.manager.analyzeActor(h.actor)).toMatchObject({ total: 0, canApply: false });
    const ritual = h.add("Ritual genérico"), ability = h.add("Habilidade genérica", "ability");
    expect(h.manager.analyzeActor(h.actor)).toMatchObject({ total: 0, available: [], upToDate: [] });
    expect(ritual.setFlag).not.toHaveBeenCalled(); expect(ability.setFlag).not.toHaveBeenCalled();
  });

  it.each(["gm", "owner"] as const)("allows %s to apply both families and preserves patches and custom flags", async role => {
    const h = setup(role);
    const custom = { ritualRollConfig: { formula: "1d6" }, ritualResistanceOutcomes: { custom: true }, ritual: { cost: { amount: 3 } } };
    const ritual = h.add("Eletrocussão", "ritual", custom);
    const ability = h.add("Tiro Intuitivo", "ability", { abilityRollConfig: { custom: true } });
    expect(h.manager.analyzeActor(h.actor).available.map(entry => entry.family)).toEqual(["ritual", "attackModifier"]);
    expect(ritual.setFlag).not.toHaveBeenCalled(); expect(ability.setFlag).not.toHaveBeenCalled();
    expect((await h.manager.applyPending(h.actor)).applied).toHaveLength(2);
    expect(ritual.getFlag(MODULE_ID, "automation").source).toMatchObject({ presetId: "ritual.eletrocussao", appliedBy: role });
    expect(ritual.update).toHaveBeenCalledWith(expect.objectContaining({ "system.element": "energy", "system.studentForm": true }));
    expect(ritual.system).toMatchObject({ description: "<p>Original</p>", chatDescription: "Chat" });
    for (const [key, value] of Object.entries(custom)) expect(ritual.getFlag(MODULE_ID, key)).toEqual(value);
    expect(readAttackModifierBinding(ability)).toEqual({ schemaVersion: 1, presetId: "attack.tiroIntuitivo", presetVersion: "1.0.0" });
    expect(ability.getFlag(MODULE_ID, "abilityRollConfig")).toEqual({ custom: true });
    expect(h.manager.analyzeActor(h.actor)).toMatchObject({ available: [], outdated: [], canApply: false });
  });

  it("applies intuitive shot without acquisition facts, weapons, or rituals", async () => {
    const h = setup(); h.actor.type = "threat";
    const ability = h.add("TIRO INTUITIVO", "ability");
    await h.manager.applyPending(h.actor);
    expect(h.actor.system).toEqual({});
    expect(readAttackModifierBinding(ability)?.presetId).toBe("attack.tiroIntuitivo");
  });

  it("keeps IDs ahead of names for renamed and outdated presets", async () => {
    const h = setup(), ritual = h.add("Eletrocussão"), ability = h.add("Tiro Intuitivo", "ability");
    await h.manager.applyPending(h.actor);
    ritual.name = "Definhar"; ability.name = "Outro poder";
    ritual.getFlag(MODULE_ID, "automation").source.presetVersion = "1.0.0";
    ability.getFlag(MODULE_ID, "attackModifier").presetVersion = "0.9.0";
    expect(h.manager.analyzeActor(h.actor).outdated.map(entry => entry.preset?.id)).toEqual(["ritual.eletrocussao", "attack.tiroIntuitivo"]);
    expect((await h.manager.applyPending(h.actor)).applied).toHaveLength(2);
    ability.name = ritual.name = "Renomeado";
    expect(h.manager.analyzeActor(h.actor).upToDate).toHaveLength(2);
  });

  it("preserves manual automation and malformed flags instead of replacing them by name", async () => {
    const h = setup();
    const manual = { schemaVersion: 1, source: { type: "manual", label: "Homebrew", appliedAt: "today" }, definition: h.registry.get("ritual.eletrocussao")!.automation };
    const ritual = h.add("Eletrocussão", "ritual", { automation: manual });
    const corrupt = h.add("Cicatrização", "ritual", { automation: { schemaVersion: 99 } });
    const ability = h.add("Tiro Intuitivo", "ability", { attackModifier: { schemaVersion: 99 } });
    expect(h.manager.analyzeActor(h.actor).canApply).toBe(false);
    expect((await h.manager.applyPending(h.actor)).applied).toEqual([]);
    expect(ritual.getFlag(MODULE_ID, "automation")).toEqual(manual);
    for (const item of [ritual, corrupt, ability]) { expect(item.setFlag).not.toHaveBeenCalled(); expect(item.update).not.toHaveBeenCalled(); }
  });

  it("does not suggest another preset for unknown bound IDs", async () => {
    const h = setup(), ritual = h.add("Eletrocussão"); await h.manager.applyPending(h.actor);
    ritual.getFlag(MODULE_ID, "automation").source.presetId = "ritual.unavailable";
    const ability = h.add("Tiro Intuitivo", "ability", { attackModifier: { schemaVersion: 1, presetId: "attack.unavailable", presetVersion: "1" } });
    expect(h.manager.analyzeActor(h.actor).canApply).toBe(false);
    await h.manager.applyPending(h.actor);
    expect(ritual.getFlag(MODULE_ID, "automation").source.presetId).toBe("ritual.unavailable");
    expect(ability.setFlag).not.toHaveBeenCalled();
  });

  it.each(["ritual.costOnly", "ritual.simpleDamage", "generic.simpleHealing"])("does not manage generic binding %s", async id => {
    const h = setup(), item = h.add("Eletrocussão");
    await new AutomationBinder().applyPreset(item, h.registry.get(id)!);
    expect(h.manager.analyzeActor(h.actor)).toMatchObject({ total: 0, canApply: false });
    expect((await h.manager.applyPending(h.actor)).applied).toHaveLength(0);
  });

  it.each(["Eletrocussão", "Definhar", "Cicatrização"])("preserves %s definition and itemPatch", async name => {
    const h = setup(), item = h.add(name), preset = h.registry.findForItem(item)[0].preset;
    await h.manager.applyPending(h.actor);
    expect(item.getFlag(MODULE_ID, "automation").definition).toEqual(preset.automation);
    expect(item.update).toHaveBeenCalledWith(expect.objectContaining({ "system.circle": 1, name: preset.label }));
  });

  it("denies nonowners in shared and legacy application services", async () => {
    const h = setup("observer"), item = h.add("Eletrocussão");
    expect(() => h.manager.analyzeActor(h.actor)).toThrow("dono");
    expect(() => h.manager.applyPending(h.actor)).toThrow("dono");
    await expect(h.rituals.applyPending(h.actor)).rejects.toThrow("permissão");
    expect(item.setFlag).not.toHaveBeenCalled();
  });

  it("revalidates permissions, removed items and changed bindings after applying a ritual", async () => {
    for (const change of ["permission", "removed", "binding"] as const) {
      const h = setup(), ritual = h.add("Eletrocussão"), ability = h.add("Tiro Intuitivo", "ability");
      ritual.update.mockImplementationOnce(async () => {
        if (change === "permission") h.actor.testUserPermission.mockReturnValue(false);
        if (change === "removed") h.items.splice(h.items.indexOf(ability), 1);
        if (change === "binding") await ability.setFlag(MODULE_ID, "attackModifier", { schemaVersion: 99 });
        return ritual;
      });
      const operation = h.manager.applyPending(h.actor);
      if (change === "permission") await expect(operation).rejects.toThrow("dono");
      else expect((await operation).applied).toHaveLength(1);
      expect(ability.setFlag).toHaveBeenCalledTimes(change === "binding" ? 1 : 0);
    }
  });

  it("keeps granted abilities and locked or read-only documents protected", () => {
    const h = setup(); h.add("Tiro Intuitivo", "ability", { allyGrantedAbility: {} });
    const locked = h.add("Tiro Intuitivo", "ability"); locked.pack = "locked";
    h.game.packs.set("locked", { locked: true });
    h.add("Eletrocussão").canUserModify.mockReturnValue(false);
    expect(h.manager.analyzeActor(h.actor)).toMatchObject({ available: [], canApply: false });
  });

  it("coalesces duplicate applications without charging resources", async () => {
    const h = setup(), ability = h.add("Tiro Intuitivo", "ability");
    const first = h.manager.applyPending(h.actor), second = h.manager.applyPending(h.actor);
    expect(second).toBe(first); await first;
    expect(ability.setFlag).toHaveBeenCalledTimes(1);
    expect((await h.manager.applyPending(h.actor)).applied).toHaveLength(0);
    expect(h.actor.system).toEqual({}); expect(ability.update).not.toHaveBeenCalled();
  });

  it("reports ritual patch failure without applying abilities or retrying", async () => {
    const h = setup(), ritual = h.add("Eletrocussão"), ability = h.add("Tiro Intuitivo", "ability");
    ritual.update.mockRejectedValueOnce(new Error("patch failed"));
    await expect(h.manager.applyPending(h.actor)).rejects.toThrow("patch failed");
    expect(ritual.update).toHaveBeenCalledTimes(1); expect(ability.setFlag).not.toHaveBeenCalled();
  });
});
