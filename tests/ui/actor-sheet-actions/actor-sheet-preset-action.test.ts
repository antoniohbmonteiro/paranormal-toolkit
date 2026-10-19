import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";
import type { ToolkitServices } from "../../../src/toolkit-services";

class ApplicationDouble {
  render = vi.fn(async () => this);
  close = vi.fn(async () => this);
  constructor(public options: unknown) {}
}
vi.stubGlobal("foundry", { utils: foundry.utils, applications: { api: { ApplicationV2: ApplicationDouble } } });
const { RitualPresetManagerApplication } = await import("../../../src/applications/ritual-preset-manager-app");
const { registerActorSheetRitualPresetAction } = await import("../../../src/ui/actor-sheet-actions/actor-sheet-ritual-preset-action");
const registeredFlag = "__paranormal-toolkit_ritualPresetHeaderControlRegistered";
const hooks = new Map<string, (...args: any[]) => void>();
const diagnostic = { actorName: "Rafa", total: 0, available: [], outdated: [], upToDate: [], unsupported: [], canApply: false };
let actor: any, manager: any, notifications: any;

beforeEach(() => {
  delete (globalThis as any)[registeredFlag]; hooks.clear();
  vi.stubGlobal("Hooks", { on: (name: string, callback: (...args: any[]) => void) => hooks.set(name, callback) });
  vi.stubGlobal("game", { user: { id: "player", isGM: false }, packs: new Map() });
  vi.stubGlobal("document", { createElement: () => ({ className: "", innerHTML: "" }) });
  notifications = { warn: vi.fn(), info: vi.fn() };
  vi.stubGlobal("ui", { notifications });
  actor = { id: "actor", name: "Rafa", documentName: "Actor", type: "agent", items: { contents: [] },
    testUserPermission: vi.fn(() => true), canUserModify: vi.fn(() => true) };
  manager = { analyzeActor: vi.fn(() => structuredClone(diagnostic)), applyPending: vi.fn(async () => ({ applied: [], skipped: [] })) };
});
afterEach(() => { delete (globalThis as any)[registeredFlag]; vi.unstubAllGlobals(); });
const services = () => ({ presetManager: manager }) as ToolkitServices;
const event = () => ({ preventDefault: vi.fn(), stopPropagation: vi.fn() }) as unknown as PointerEvent;

describe("existing preset screen and actor action", () => {
  it.each(["agent", "threat", "paranormal-toolkit.ally"])("keeps the access action on an empty owned %s actor", type => {
    actor.type = type;
    registerActorSheetRitualPresetAction(services());
    const controls: any[] = [], sheet = { actor, options: {} };
    for (const hook of hooks.values()) hook(sheet, controls);
    expect(controls).toHaveLength(1);
    expect(controls[0]).toMatchObject({ label: "Gerenciar presets", visible: true });
    controls[0].onClick(event());
    expect(actor.testUserPermission).toHaveBeenCalledWith(game.user, "OWNER");
  });

  it("lets GM use the same action and rejects nonowners or stale access", () => {
    (game.user as any).isGM = true;
    registerActorSheetRitualPresetAction(services());
    const hook = hooks.get("getHeaderControlsOrdemActorSheet")!, controls: any[] = [];
    hook({ actor, options: {} }, controls);
    expect(controls).toHaveLength(1);
    actor.testUserPermission.mockReturnValue(false);
    const hidden: any[] = []; hook({ actor, options: {} }, hidden);
    expect(hidden).toEqual([]);
    controls[0].onClick(event());
    expect(notifications.warn).toHaveBeenCalled();
  });

  it("renders the empty state inside the existing application without selectors", async () => {
    const app = new RitualPresetManagerApplication(actor, services());
    const root = await app._renderHTML({}, {});
    expect(root.innerHTML).toContain("Nenhum preset disponível para este personagem.");
    expect(root.innerHTML).toContain('data-action="apply" disabled');
    expect(root.innerHTML).toContain("Gerenciar presets");
    expect(root.innerHTML).not.toContain("<select");
    expect(root.className).toBe("paranormal-toolkit-preset-manager");
    expect(RitualPresetManagerApplication.DEFAULT_OPTIONS.classes).toContain("paranormal-toolkit-ritual-preset-manager");
  });

  it("shows persisted and outdated entries instead of the empty state and escapes names", async () => {
    manager.analyzeActor.mockReturnValue({ ...diagnostic, total: 2,
      upToDate: [{ itemName: "<img>", reason: "Já aplicado", appliedPresetId: "attack.tiroIntuitivo", appliedPresetVersion: "1.0.0",
        preset: { label: "Tiro Intuitivo", version: "1.0.0" } }],
      outdated: [{ itemName: "Eletrocussão", reason: "Desatualizado", preset: { label: "Eletrocussão", version: "1.4.1" } }], canApply: true });
    const app = new RitualPresetManagerApplication(actor, services());
    const root = await app._renderHTML({}, {});
    expect(root.innerHTML).not.toContain("Nenhum preset disponível para este personagem.");
    expect(root.innerHTML).toContain("Tiro Intuitivo"); expect(root.innerHTML).toContain("Eletrocussão");
    expect(root.innerHTML).toContain("&lt;img&gt;"); expect(root.innerHTML).not.toContain("<img>");
  });

  it("uses the shared apply action for OWNER and blocks double clicks", async () => {
    manager.analyzeActor.mockReturnValue({ ...diagnostic, total: 1, canApply: true });
    let finish!: (value: any) => void;
    manager.applyPending.mockImplementationOnce(() => new Promise(resolve => { finish = resolve; }));
    const app = new RitualPresetManagerApplication(actor, services());
    const apply = RitualPresetManagerApplication.DEFAULT_OPTIONS.actions.apply;
    const first = apply.call(app, event());
    await Promise.resolve();
    await apply.call(app, event());
    expect(manager.applyPending).toHaveBeenCalledTimes(1);
    finish({ applied: [], skipped: [] }); await first;
    actor.testUserPermission.mockReturnValue(false);
    await apply.call(app, event());
    expect(manager.applyPending).toHaveBeenCalledTimes(1);
    expect(notifications.warn).toHaveBeenCalled();
  });

  it("reports failure and closes if ownership was lost", async () => {
    manager.analyzeActor.mockReturnValue({ ...diagnostic, total: 1, canApply: true });
    manager.applyPending.mockImplementationOnce(async () => {
      actor.testUserPermission.mockReturnValue(false); throw new Error("Permission lost");
    });
    const app = new RitualPresetManagerApplication(actor, services());
    await RitualPresetManagerApplication.DEFAULT_OPTIONS.actions.apply.call(app, event());
    expect(notifications.info).not.toHaveBeenCalled();
    expect(notifications.warn).toHaveBeenCalledWith("Permission lost");
    expect(app.close).toHaveBeenCalledTimes(1);
  });
});
