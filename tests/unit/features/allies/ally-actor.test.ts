import { beforeAll, beforeEach, describe, expect, it, vi } from "vitest";
import { readFileSync } from "node:fs";
import { createAllyProfile } from "../../../../src/core/allies/ally-profile";

const nativeDrop = vi.fn();
const registerSheet = vi.fn();
const confirm = vi.fn();
const warn = vi.fn();

class Field {
  constructor(public options: Record<string, unknown>) {}
}
class Model {}
class NativeSheet {
  static instances() { return openSheets.values(); }
  document: any;
  get actor() { return this.document; }
  isEditable = true;
  render = vi.fn();
  constructor(options: { document: any }) { this.document = options.document; }
  async _prepareContext() { return {}; }
  async _onDropItem(event: unknown, item: unknown) { return nativeDrop(event, item); }
}
const openSheets: NativeSheet[] = [];
let AllyDataModel: typeof import("../../../../src/features/allies/ally-data-model").AllyDataModel;
let AllySheet: typeof import("../../../../src/applications/ally-sheet").AllySheet;
let refreshAllySheets: typeof import("../../../../src/applications/ally-sheet").refreshAllySheets;
let registerAllyActor: typeof import("../../../../src/features/allies/ally-registration").registerAllyActor;

beforeAll(async () => {
  vi.stubGlobal("foundry", {
    ...(globalThis as any).foundry,
    abstract: { TypeDataModel: Model },
    data: { fields: { NumberField: Field, HTMLField: Field, BooleanField: Field } },
    applications: { sheets: { ActorSheetV2: NativeSheet }, apps: { DocumentSheetConfig: { registerSheet } },
      api: { DialogV2: { confirm } } },
  });
  ({ AllyDataModel } = await import("../../../../src/features/allies/ally-data-model"));
  ({ AllySheet, refreshAllySheets } = await import("../../../../src/applications/ally-sheet"));
  ({ registerAllyActor } = await import("../../../../src/features/allies/ally-registration"));
});

beforeEach(() => {
  vi.clearAllMocks();
  openSheets.length = 0;
  vi.stubGlobal("game", { system: { id: "ordemparanormal" }, user: { id: "u" }, settings: { get: vi.fn(() => false) } });
  vi.stubGlobal("ui", { notifications: { warn } });
  confirm.mockResolvedValue(true);
  nativeDrop.mockImplementation(async (_event, item) => item);
});

function ability(id = "a", type = "ability") {
  return { id, name: "Skill", type, documentName: "Item", getFlag: vi.fn(), setFlag: vi.fn(),
    sheet: { render: vi.fn() } };
}
function fixture(editable = true) {
  const item = ability();
  const actor = { name: "Íris", img: "iris.webp", system: createAllyProfile(), items: [item],
    canUserModify: vi.fn(() => editable), update: vi.fn(async () => actor),
    createEmbeddedDocuments: vi.fn(async () => [item]), deleteEmbeddedDocuments: vi.fn() };
  const sheet = new AllySheet({ document: actor });
  sheet.isEditable = editable;
  return { actor, item, sheet };
}
function action(name: "createAbility" | "openAbility" | "removeAbility", sheet: InstanceType<typeof AllySheet>, id = "a") {
  return AllySheet.DEFAULT_OPTIONS.actions[name].call(sheet, {} as PointerEvent, { dataset: { itemId: id } } as HTMLElement);
}

describe("ally actor registration and schema (Foundry doubles)", () => {
  it("registers only the ally type and preserves the native document class and models", () => {
    const nativeActor = class {};
    const agent = class {};
    const threat = class {};
    const actorConfig = { dataModels: { agent, threat } };
    Object.defineProperty(actorConfig, "documentClass", { value: nativeActor, writable: false });
    vi.stubGlobal("CONFIG", { Actor: actorConfig });
    registerAllyActor();
    registerAllyActor();
    expect((actorConfig.dataModels as any)["paranormal-toolkit.ally"]).toBe(AllyDataModel);
    expect(actorConfig.dataModels.agent).toBe(agent);
    expect(actorConfig.dataModels.threat).toBe(threat);
    expect(registerSheet).toHaveBeenCalledExactlyOnceWith(nativeActor, "paranormal-toolkit", AllySheet,
      { types: ["paranormal-toolkit.ally"], makeDefault: true, label: "Aliado" });
    expect(Object.getPrototypeOf(AllySheet)).toBe(NativeSheet);
    expect(Object.getPrototypeOf(AllyDataModel)).toBe(Model);
  });

  it("does not register on another system", () => {
    vi.stubGlobal("game", { system: { id: "other" } });
    vi.stubGlobal("CONFIG", {});
    registerAllyActor();
    expect(registerSheet).not.toHaveBeenCalled();
  });

  it("defines only profile fields with bounded version and explicit defaults", () => {
    const schema = AllyDataModel.defineSchema() as unknown as Record<string, Field>;
    expect(Object.keys(schema)).toEqual(["schemaVersion", "description", "isDrone"]);
    expect(schema.schemaVersion.options).toMatchObject({ initial: 1, min: 1, max: 1, integer: true });
    expect(schema.description.options.initial).toBe("");
    expect(schema.isDrone.options.initial).toBe(false);
  });

  it("declares the server subtype, HTML sanitization and matching translation", () => {
    const manifest = JSON.parse(readFileSync(new URL("../../../../module.json", import.meta.url), "utf8"));
    const language = JSON.parse(readFileSync(new URL("../../../../lang/pt-BR.json", import.meta.url), "utf8"));
    expect(manifest.documentTypes.Actor.ally.htmlFields).toEqual(["description"]);
    const pkg = JSON.parse(readFileSync(new URL("../../../../package.json", import.meta.url), "utf8"));
    const lock = JSON.parse(readFileSync(new URL("../../../../package-lock.json", import.meta.url), "utf8"));
    expect(manifest.version).toBe(pkg.version);
    expect(lock.version).toBe(pkg.version); expect(lock.packages[""].version).toBe(pkg.version);
    expect(manifest.languages).toContainEqual({ lang: "pt-BR", name: "Português (Brasil)", path: "lang/pt-BR.json" });
    expect(language.TYPES.Actor.ally).toBe("Aliado");
  });
});

describe("ally sheet handlers (Foundry doubles)", () => {
  it("creates and opens a normal ability without executing it", async () => {
    const { actor, item, sheet } = fixture();
    await action("createAbility", sheet);
    expect(actor.createEmbeddedDocuments).toHaveBeenCalledExactlyOnceWith("Item", [
      { name: "Nova habilidade", type: "ability", system: { abilityType: "ability" } },
    ]);
    expect(item.sheet.render).toHaveBeenCalledWith({ force: true });
  });

  it("accepts abilities through the native drop API and rejects other document types", async () => {
    const { item, sheet } = fixture();
    expect(await sheet._onDropDocument({} as DragEvent, item)).toBe(item);
    await sheet._onDropItem({} as DragEvent, ability("x", "ritual") as unknown as Item);
    await sheet._onDropDocument({} as DragEvent, { documentName: "ActiveEffect" });
    await sheet._onDropDocument({} as DragEvent, { documentName: "Folder" });
    expect(nativeDrop).toHaveBeenCalledTimes(1);
  });

  it("removes only an ability on this actor after confirmation", async () => {
    const { actor, sheet } = fixture();
    await action("removeAbility", sheet, "missing");
    expect(confirm).not.toHaveBeenCalled();
    await action("removeAbility", sheet);
    expect(actor.deleteEmbeddedDocuments).toHaveBeenCalledExactlyOnceWith("Item", ["a"]);
  });

  it("does not remove on cancellation or lost ownership", async () => {
    const { actor, sheet } = fixture();
    confirm.mockResolvedValueOnce(false);
    await action("removeAbility", sheet);
    confirm.mockImplementationOnce(async () => { actor.canUserModify.mockReturnValue(false); return true; });
    await action("removeAbility", sheet);
    expect(actor.deleteEmbeddedDocuments).not.toHaveBeenCalled();
  });

  it("denies creation, deletion, drops and form writes for non-owners", async () => {
    const { actor, item, sheet } = fixture(false);
    await action("createAbility", sheet);
    await action("removeAbility", sheet);
    expect(await sheet._onDropItem({} as DragEvent, item as unknown as Item)).toBeNull();
    await expect(sheet._processSubmitData({} as SubmitEvent, {} as HTMLFormElement, {})).rejects.toThrow("permissão");
    expect(actor.createEmbeddedDocuments).not.toHaveBeenCalled();
    expect(actor.deleteEmbeddedDocuments).not.toHaveBeenCalled();
    expect(actor.update).not.toHaveBeenCalled();
    expect(nativeDrop).not.toHaveBeenCalled();
  });

  it("opens only an existing ability and leaves readonly access to its native sheet", async () => {
    const { actor, item, sheet } = fixture(false);
    actor.items.push(ability("ritual", "ritual"));
    await action("openAbility", sheet, "missing");
    await action("openAbility", sheet, "ritual");
    await action("openAbility", sheet);
    expect(item.sheet.render).toHaveBeenCalledExactlyOnceWith({ force: true });
  });

  it("updates only editable profile fields and does not accept resource or ownership payloads", async () => {
    const { actor, sheet } = fixture();
    await sheet._processSubmitData({} as SubmitEvent, {} as HTMLFormElement, {
      name: " Íris ", img: "iris.webp", system: { description: "<p>Descrição</p>", isDrone: true, PV: { value: 20 } },
      ownership: { user: 3 },
    });
    expect(actor.update).toHaveBeenCalledExactlyOnceWith({
      name: "Íris", img: "iris.webp", "system.description": "<p>Descrição</p>", "system.isDrone": true,
    });
  });

  it("rejects malformed forms and unknown stored profile versions without writing", async () => {
    const { actor, sheet } = fixture();
    await expect(sheet._processSubmitData({} as SubmitEvent, {} as HTMLFormElement, { name: "  " })).rejects.toThrow();
    actor.system.schemaVersion = 2 as 1;
    await action("createAbility", sheet);
    await expect(sheet._processSubmitData({} as SubmitEvent, {} as HTMLFormElement, {})).rejects.toThrow("versão");
    expect(actor.createEmbeddedDocuments).not.toHaveBeenCalled();
    expect(actor.update).not.toHaveBeenCalled();
  });

  it("builds a view model without document mutation and with only abilities", async () => {
    const { actor, sheet } = fixture();
    actor.items.push(ability("ritual", "ritual"));
    const model = await sheet._prepareContext({});
    expect(model.abilities).toEqual([{ id: "a", name: "Skill" }]);
    expect(model.profile).toEqual(createAllyProfile());
    expect(actor.update).not.toHaveBeenCalled();
    expect(actor.createEmbeddedDocuments).not.toHaveBeenCalled();
  });
  it.each(["directory", "linked", "unlinked"])("assigns from the %s sheet to the same persistent Actor", async origin => {
    const { actor } = fixture();
    const original = { ...actor, id: "iris", uuid: "Actor.iris", type: "paranormal-toolkit.ally", isToken: false,
      getFlag: vi.fn(() => ({ revision: 7 })), setFlag: vi.fn(async () => {}) };
    const synthetic = { ...original, uuid: "Scene.scene.Token.token.Actor.iris", isToken: true,
      token: { baseActor: original }, setFlag: vi.fn() };
    const document = origin === "unlinked" ? synthetic : original;
    const player = { id: "owner", isGM: false, active: true };
    vi.stubGlobal("game", { user: player, users: [player, { id: "gm", isGM: true, active: true }],
      actors: { contents: [original], get: () => original } });
    vi.stubGlobal("foundry", { ...(globalThis as any).foundry,
      utils: { ...(globalThis as any).foundry.utils, randomID: () => "sheet-request-01" } });
    const sheet = new AllySheet({ document });
    expect(sheet.actor).toBe(original);
    const button = { closest: () => ({ querySelector: (selector: string) => ({
      value: selector.includes("beneficiary") ? "joao" : "",
    }) }) };
    await AllySheet.DEFAULT_OPTIONS.actions.assignSupport.call(sheet, {} as PointerEvent, button as any);
    expect(original.setFlag).toHaveBeenCalledWith("paranormal-toolkit", "allyRequest",
      { id: "sheet-request-01", revision: 7, action: "assign", beneficiaryId: "joao" });
    expect(synthetic.setFlag).not.toHaveBeenCalled();
    expect(warn).not.toHaveBeenCalled();
  });
  it.each(["directory", "linked", "unlinked"])("saves and clears the pilot from the %s sheet on the world Actor only", async origin => {
    const { actor } = fixture();
    const original = { ...actor, id: "iris", uuid: "Actor.iris", type: "paranormal-toolkit.ally", isToken: false,
      getFlag: vi.fn(() => ({ revision: 7 })), setFlag: vi.fn(async () => {}) };
    const synthetic = { ...original, isToken: true, token: { baseActor: original }, setFlag: vi.fn() };
    const owner = { id: "owner", isGM: false, active: true };
    vi.stubGlobal("game", { user: owner, users: [owner, { id: "gm", isGM: true, active: true }],
      actors: { contents: [original], get: () => original } });
    vi.stubGlobal("foundry", { ...(globalThis as any).foundry,
      utils: { ...(globalThis as any).foundry.utils, randomID: () => "pilot-request-01" } });
    const sheet = new AllySheet({ document: origin === "unlinked" ? synthetic : original });
    for (const value of ["rafa", ""]) {
      const button = { closest: () => ({ querySelector: (selector: string) => selector === '[data-ally-pilot]' ? { value } : null }) };
      await AllySheet.DEFAULT_OPTIONS.actions.savePilot.call(sheet, {} as PointerEvent, button as any);
      expect(original.setFlag).toHaveBeenLastCalledWith("paranormal-toolkit", "allyRequest",
        { id: "pilot-request-01", revision: 7, action: "setPilot", pilotId: value || null });
    }
    sheet.isEditable = false;
    await AllySheet.DEFAULT_OPTIONS.actions.savePilot.call(sheet, {} as PointerEvent,
      { closest: () => ({ querySelector: () => ({ value: "rafa" }) }) } as any);
    expect(original.setFlag).toHaveBeenCalledTimes(2);
    expect(synthetic.setFlag).not.toHaveBeenCalled();
    expect(warn).not.toHaveBeenCalled();
  });
  it("refreshes existing directory and token instances through the native ApplicationV2 API", async () => {
    const { actor } = fixture();
    const original = { ...actor, id: "iris", type: "paranormal-toolkit.ally", isToken: false };
    (game as any).actors = { get: (id: string) => id === "iris" ? original : undefined };
    const world = new AllySheet({ document: original });
    const token = new AllySheet({ document: { ...original, isToken: true, token: { baseActor: original } } });
    const other = new AllySheet({ document: { ...original, id: "other" } });
    openSheets.push(world, token, other);
    await refreshAllySheets("iris");
    expect(world.render).toHaveBeenCalledExactlyOnceWith({ force: false });
    expect(token.render).toHaveBeenCalledExactlyOnceWith({ force: false });
    expect(other.render).not.toHaveBeenCalled();
    await refreshAllySheets();
    expect(other.render).toHaveBeenCalledExactlyOnceWith({ force: false });
  });
});
