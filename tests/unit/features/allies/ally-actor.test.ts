import { beforeAll, beforeEach, describe, expect, it, vi } from "vitest";
import { readFileSync } from "node:fs";
import { createAllyProfile } from "../../../../src/core/allies/ally-profile";

const nativeDrop = vi.fn();
const registerSheet = vi.fn();
const confirm = vi.fn();
const warn = vi.fn();
const supportSubmit = vi.fn();
const shortcutUse = vi.fn();
const dialogWait = vi.fn();
const dialogPrompt = vi.fn();
const enrichHTML = vi.fn(async (content: string) => content);
const browse = vi.fn();
const pickerOptions: Record<string, any>[] = [];
const benefitWindows = vi.hoisted(() => [] as { item: unknown; render: any }[]);
vi.mock("../../../../src/applications/ally-ability-config-application", async () => {
  const { vi: mocks } = await import("vitest");
  return { AllyAbilityConfigApplication: class {
    render = mocks.fn(async () => this);
    constructor(public item: unknown) { benefitWindows.push(this); }
  } };
});

class Field {
  constructor(public options: Record<string, unknown>) {}
}
class Model {}
class NativeSheet {
  static instances() { return openSheets.values(); }
  document: any;
  get actor() { return this.document; }
  isEditable = true;
  id = "ally-test";
  tabGroups = { ally: "support" };
  element = { querySelectorAll: () => [], querySelector: () => null };
  render = vi.fn();
  constructor(options: { document: any }) { this.document = options.document; }
  async _prepareContext() { return {}; }
  async _onRender() {}
  async _onDropItem(event: unknown, item: unknown) { return nativeDrop(event, item); }
  changeTab(tab: string, group: string) { (this.tabGroups as any)[group] = tab; }
  _getHeaderControls() { return []; }
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
    applications: { sheets: { ActorSheetV2: NativeSheet }, ux: { TextEditor: { implementation: { enrichHTML } } },
      apps: { FilePicker: { implementation: class { constructor(options: Record<string, unknown>) { pickerOptions.push(options); } browse = browse; } }, DocumentSheetConfig: { registerSheet } },
      api: { DialogV2: { confirm, wait: dialogWait, prompt: dialogPrompt } } },
  });
  ({ AllyDataModel } = await import("../../../../src/features/allies/ally-data-model"));
  ({ AllySheet, refreshAllySheets } = await import("../../../../src/applications/ally-sheet"));
  ({ registerAllyActor } = await import("../../../../src/features/allies/ally-registration"));
});

beforeEach(() => {
  vi.clearAllMocks();
  openSheets.length = 0;
  pickerOptions.length = 0;
  benefitWindows.length = 0;
  vi.stubGlobal("game", { system: { id: "ordemparanormal" }, user: { id: "u" }, settings: { get: vi.fn(() => false) } });
  vi.stubGlobal("ui", { notifications: { warn } });
  confirm.mockResolvedValue(true);
  supportSubmit.mockResolvedValue({ ok: true, view: { diagnostic: null } });
  AllySheet.configureServices({ support: { submit: supportSubmit, isPending: () => false } as any,
    shortcuts: { use: shortcutUse, inspect: () => ({ enabled: true, reason: null }) } as any });
  nativeDrop.mockImplementation(async (_event, item) => item);
});

function ability(id = "a", type = "ability") {
  return { id, name: "Skill", type, documentName: "Item", system: {}, img: "skill.webp", getFlag: vi.fn(), setFlag: vi.fn(),
    sheet: { render: vi.fn() } };
}
function fixture(editable = true) {
  const item = ability();
  const actor = { name: "Íris", img: "iris.webp", system: createAllyProfile(), items: [item],
    canUserModify: vi.fn(() => editable), update: vi.fn(async (changes: Record<string, unknown>) => {
      for (const [key, value] of Object.entries(changes)) {
        if (key.startsWith("system.")) (actor.system as any)[key.slice(7)] = value;
        else (actor as any)[key] = value;
      }
      return actor;
    }),
    createEmbeddedDocuments: vi.fn(async () => [item]), deleteEmbeddedDocuments: vi.fn() };
  const sheet = new AllySheet({ document: actor });
  sheet.isEditable = editable;
  return { actor, item, sheet };
}
function action(name: "createAbility" | "openAbility" | "removeAbility" | "configureBenefits", sheet: InstanceType<typeof AllySheet>, id = "a") {
  return AllySheet.DEFAULT_OPTIONS.actions[name].call(sheet, { stopPropagation: vi.fn(), preventDefault: vi.fn() } as unknown as PointerEvent, { dataset: { itemId: id } } as HTMLElement);
}
function change(sheet: InstanceType<typeof AllySheet>, field: string, value: string | boolean) {
  const target = { dataset: { allyField: field }, type: typeof value === "boolean" ? "checkbox" : "text", value, checked: value,
    closest() { return this; }, hasAttribute: () => false };
  sheet._onChangeForm({}, { target } as any);
}
function draft(sheet: InstanceType<typeof AllySheet>, field: string, value: string) {
  const target = { dataset: { allyField: field }, type: "text", value, closest() { return this; } };
  (sheet as any).captureField({ target });
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
    expect(language.TYPES.Actor["paranormal-toolkit"].ally).toBe("Aliado");
  });
});

describe("ally sheet handlers (Foundry doubles)", () => {
  it("changes native tab state without writing or rebuilding the window", async () => {
    const { actor, sheet } = fixture();
    sheet.changeTab("details", "ally");
    expect((await sheet._prepareContext({})).activeTab).toBe("details");
    expect(actor.update).not.toHaveBeenCalled(); expect(sheet.render).not.toHaveBeenCalled();
    sheet.changeTab("abilities", "ally"); expect(sheet.tabGroups.ally).toBe("abilities");
  });
  it.each([["img", "updated.webp"], ["system.description", "<p>Descrição</p>"], ["system.isDrone", true]])("autosaves only %s", async (field, value) => {
    const { actor, sheet } = fixture(); change(sheet, field as string, value as string | boolean);
    await vi.waitFor(() => expect(actor.update).toHaveBeenCalledExactlyOnceWith({ [field as string]: value }));
  });
  it("holds typed text locally until confirmation and keeps the error/draft on failure", async () => {
    const { actor, sheet } = fixture(); draft(sheet, "system.description", "Texto novo");
    expect(actor.update).not.toHaveBeenCalled(); actor.update.mockRejectedValueOnce(new Error("write failed"));
    change(sheet, "system.description", "Texto novo"); await vi.waitFor(() => expect((sheet as any).saving.size).toBe(0));
    expect((await sheet._prepareContext({})).fields?.["system.description"]).toMatchObject({ value: "Texto novo", dirty: true, error: "write failed" });
  });
  it.each(["mine", "current", null])("resolves a real field conflict with choice %s without overwriting a cancelled draft", async choice => {
    const { actor, sheet } = fixture(); (sheet as any).edits.focus("name", actor.name);
    draft(sheet, "name", "Local"); actor.name = "Remote"; dialogWait.mockResolvedValueOnce(choice);
    change(sheet, "name", "Local"); await vi.waitFor(() => expect((sheet as any).saving.size).toBe(0));
    expect(dialogWait).toHaveBeenCalledOnce();
    const field = (await sheet._prepareContext({})).fields!.name!;
    if (choice === "mine") expect(actor.update).toHaveBeenCalledExactlyOnceWith({ name: "Local" });
    else expect(actor.update).not.toHaveBeenCalled();
    expect(field.value).toBe(choice === "current" ? "Remote" : "Local");
    expect(field.dirty).toBe(choice === null);
  });
  it("does not overwrite another remote edit that arrives while the conflict dialog is open", async () => {
    const { actor, sheet } = fixture(); (sheet as any).edits.focus("name", actor.name); draft(sheet, "name", "Local"); actor.name = "Remote";
    dialogWait.mockImplementationOnce(async () => { actor.name = "New remote"; return "mine"; });
    change(sheet, "name", "Local"); await vi.waitFor(() => expect((sheet as any).saving.size).toBe(0));
    expect(actor.update).not.toHaveBeenCalled(); expect((await sheet._prepareContext({})).fields!.name!.error).toContain("mudou novamente");
  });
  it("uses once on the icon and opens the source sheet only through the separate edit action", async () => {
    const { item, sheet } = fixture(false); let finish!: () => void;
    shortcutUse.mockImplementationOnce(() => new Promise<void>(resolve => { finish = resolve; }));
    const event: any = { preventDefault: vi.fn(), stopPropagation: vi.fn() }, target: any = { dataset: { itemId: "a" } };
    const first = AllySheet.DEFAULT_OPTIONS.actions.useAbility.call(sheet, event, target);
    const second = AllySheet.DEFAULT_OPTIONS.actions.useAbility.call(sheet, event, target);
    await vi.waitFor(() => expect(shortcutUse).toHaveBeenCalledOnce());
    expect(item.sheet.render).not.toHaveBeenCalled(); finish(); await Promise.all([first, second]);
    await action("openAbility", sheet); expect(item.sheet.render).toHaveBeenCalledOnce(); expect(event.stopPropagation).toHaveBeenCalled();
  });
  it("expands the real source description without opening or rolling the Item", async () => {
    const { actor, item, sheet } = fixture(false);
    item.system = { description: "<p><strong>Descrição real</strong></p>" };
    const event: any = { preventDefault: vi.fn(), stopPropagation: vi.fn() }, target: any = { dataset: { itemId: "a" } };
    expect((await sheet._prepareContext({})).abilities[0].expanded).toBe(false);
    await AllySheet.DEFAULT_OPTIONS.actions.toggleAbility.call(sheet, event, target);
    expect((await sheet._prepareContext({})).abilities[0]).toMatchObject({ expanded: true, descriptionHTML: item.system.description });
    expect(enrichHTML).toHaveBeenCalledWith(item.system.description, { secrets: false, relativeTo: item, rollData: {} });
    expect(item.sheet.render).not.toHaveBeenCalled(); expect(shortcutUse).not.toHaveBeenCalled(); expect(actor.update).not.toHaveBeenCalled();
    await AllySheet.DEFAULT_OPTIONS.actions.toggleAbility.call(sheet, event, target);
    expect((await sheet._prepareContext({})).abilities[0].expanded).toBe(false);
  });
  it("edits the header name and closes the input only after a successful field save", async () => {
    const { actor, sheet } = fixture();
    await AllySheet.DEFAULT_OPTIONS.actions.editAllyName.call(sheet, { preventDefault() {}, stopPropagation() {} } as any);
    expect((await sheet._prepareContext({})).editingName).toBe(true);
    change(sheet, "name", "Íris nova"); await vi.waitFor(() => expect((sheet as any).saving.size).toBe(0));
    expect(actor.name).toBe("Íris nova"); expect((await sheet._prepareContext({})).editingName).toBe(false);
    await AllySheet.DEFAULT_OPTIONS.actions.editAllyName.call(sheet, { preventDefault() {}, stopPropagation() {} } as any);
    change(sheet, "name", "  "); await vi.waitFor(() => expect((sheet as any).saving.size).toBe(0));
    expect((await sheet._prepareContext({})).editingName).toBe(true);
  });
  it("uses the native image picker and writes only after a selection, rechecking ownership", async () => {
    const { actor, sheet } = fixture(); const event: any = { preventDefault() {}, stopPropagation() {} };
    await AllySheet.DEFAULT_OPTIONS.actions.editAllyImage.call(sheet, event);
    expect(browse).toHaveBeenCalledOnce(); expect(pickerOptions[0]).toMatchObject({ type: "image", current: "iris.webp", document: actor });
    expect(actor.update).not.toHaveBeenCalled(); // Closing the picker never invokes its callback.
    await pickerOptions[0].callback("new.webp"); expect(actor.update).toHaveBeenCalledExactlyOnceWith({ img: "new.webp" });
    actor.canUserModify.mockReturnValue(false);
    await pickerOptions[0].callback("forged.webp"); expect(actor.update).toHaveBeenCalledOnce();
    await AllySheet.DEFAULT_OPTIONS.actions.editAllyImage.call(sheet, event); expect(browse).toHaveBeenCalledOnce();
  });
  it("detects an external portrait change while the native picker is open", async () => {
    const { actor, sheet } = fixture();
    await AllySheet.DEFAULT_OPTIONS.actions.editAllyImage.call(sheet, { preventDefault() {}, stopPropagation() {} } as any);
    actor.img = "remote.webp"; dialogWait.mockResolvedValueOnce(null);
    await pickerOptions[0].callback("local.webp");
    expect(dialogWait).toHaveBeenCalledOnce(); expect(actor.update).not.toHaveBeenCalled();
    expect((await sheet._prepareContext({})).fields?.img?.value).toBe("local.webp");
  });
  it("saves rich text on native save only, ignores inner changes, and allows retrying the same HTML after failure", async () => {
    const { actor, sheet } = fixture();
    const editor: any = Object.assign(new EventTarget(), { tagName: "PROSE-MIRROR", dataset: { allyField: "system.description" },
      value: "<p><em>Novo</em></p>", open: false, querySelector: () => null, closest() { return this; }, hasAttribute: () => false });
    sheet.element = Object.assign(new EventTarget(), { querySelectorAll: () => [editor], querySelector: () => editor }) as any;
    await sheet._onRender({}, {});
    const toolbar: any = { closest: () => editor };
    sheet._onChangeForm({}, { target: toolbar } as any); expect(actor.update).not.toHaveBeenCalled();
    sheet._onChangeForm({}, { target: editor } as any); expect(actor.update).not.toHaveBeenCalled();
    actor.update.mockRejectedValueOnce(new Error("Falha de gravação")); editor.dispatchEvent(new Event("save"));
    await vi.waitFor(() => expect((sheet as any).saving.size).toBe(0));
    expect((await sheet._prepareContext({})).fields?.["system.description"]).toMatchObject({ value: editor.value, dirty: true, error: "Falha de gravação" });
    expect(editor.open).toBe(true);
    editor.dispatchEvent(new Event("save"));
    await vi.waitFor(() => expect((sheet as any).saving.size).toBe(0));
    expect(actor.update).toHaveBeenCalledTimes(2); expect(actor.update).toHaveBeenLastCalledWith({ "system.description": editor.value });
    expect((await sheet._prepareContext({})).descriptionHTML).toBe(editor.value);
    actor.canUserModify.mockReturnValue(false); editor.value = "forged"; editor.dispatchEvent(new Event("save"));
    expect(actor.update).toHaveBeenCalledTimes(2);
  });
  it("keeps rejection feedback without retrying or optimistically changing the Actor", async () => {
    const { actor, sheet } = fixture(); supportSubmit.mockResolvedValueOnce({ ok: false, error: "Revisão ultrapassada", view: { diagnostic: null } });
    await (sheet as any).requestSupport("setBeneficiary", { beneficiaryId: "mauro" });
    expect(supportSubmit).toHaveBeenCalledOnce(); expect(actor.update).not.toHaveBeenCalled();
    expect((await sheet._prepareContext({})).notice).toContain("Revisão ultrapassada");
  });
  it("requests an explicit combat choice before submitting another authorized selection", async () => {
    const { actor, sheet } = fixture(); supportSubmit.mockResolvedValueOnce({ ok: false, combats: [{ id: "combat", name: "Combate" }], view: {} });
    dialogPrompt.mockResolvedValueOnce("combat");
    await (sheet as any).requestSupport("setBeneficiary", { beneficiaryId: "mauro" });
    expect(dialogPrompt).toHaveBeenCalledOnce();
    expect(supportSubmit).toHaveBeenLastCalledWith(actor, "setBeneficiary", { beneficiaryId: "mauro", combatId: "combat" });
  });
  it("creates a normal ability and opens its passive benefits instead of the native sheet", async () => {
    const { actor, item, sheet } = fixture();
    await action("createAbility", sheet);
    expect(actor.createEmbeddedDocuments).toHaveBeenCalledExactlyOnceWith("Item", [
      { name: "Nova habilidade", type: "ability", system: { abilityType: "ability" } },
    ]);
    expect(benefitWindows).toHaveLength(1);
    expect(benefitWindows[0].item).toBe(item);
    expect(benefitWindows[0].render).toHaveBeenCalledExactlyOnceWith({ force: true });
    expect(item.sheet.render).not.toHaveBeenCalled();
    await action("openAbility", sheet);
    expect(item.sheet.render).toHaveBeenCalledExactlyOnceWith({ force: true });
  });

  it("opens no window when ability creation returns nothing or is not allowed", async () => {
    const { actor, sheet } = fixture();
    actor.createEmbeddedDocuments.mockResolvedValueOnce([]);
    await action("createAbility", sheet);
    expect(benefitWindows).toHaveLength(0);
    const denied = fixture(false);
    await action("createAbility", denied.sheet);
    expect(denied.actor.createEmbeddedDocuments).not.toHaveBeenCalled();
    expect(benefitWindows).toHaveLength(0);
  });

  it("opens the same passive benefits window from the ability menu", async () => {
    const { item, sheet } = fixture();
    await action("configureBenefits", sheet, "missing");
    expect(benefitWindows).toHaveLength(0);
    await action("configureBenefits", sheet);
    expect(benefitWindows.map(window => window.item)).toEqual([item]);
    expect(benefitWindows[0].render).toHaveBeenCalledWith({ force: true });
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
    change(sheet, "name", "Unauthorized");
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

  it("autosaves only the changed profile field and ignores unknown fields", async () => {
    const { actor, sheet } = fixture();
    change(sheet, "name", " Íris nova ");
    await vi.waitFor(() => expect(actor.update).toHaveBeenCalledExactlyOnceWith({ name: "Íris nova" }));
    change(sheet, "ownership", "forged"); change(sheet, "system.PE.value", "999");
    expect(actor.update).toHaveBeenCalledTimes(1);
  });

  it("rejects malformed forms and unknown stored profile versions without writing", async () => {
    const { actor, sheet } = fixture();
    change(sheet, "name", "  ");
    await vi.waitFor(() => expect((sheet as any).saving.size).toBe(0));
    expect((await sheet._prepareContext({})).fields?.name?.error).toContain("nome");
    actor.system.schemaVersion = 2 as 1;
    await action("createAbility", sheet);
    change(sheet, "name", "Other");
    expect(actor.createEmbeddedDocuments).not.toHaveBeenCalled();
    expect(actor.update).not.toHaveBeenCalled();
  });

  it("builds a view model without document mutation and with only abilities", async () => {
    const { actor, sheet } = fixture();
    actor.items.push(ability("ritual", "ritual"));
    const model = await sheet._prepareContext({});
    expect(model.abilities).toEqual([expect.objectContaining({ id: "a", name: "Skill", image: "skill.webp", usable: true })]);
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
    const target = { hasAttribute: (key: string) => key === "data-ally-beneficiary", value: "joao", closest() { return this; } };
    sheet._onChangeForm({}, { target } as any);
    await vi.waitFor(() => expect(supportSubmit).toHaveBeenCalledWith(original, "setBeneficiary", { beneficiaryId: "joao" }));
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
      const target = { hasAttribute: (key: string) => key === "data-ally-pilot", value, closest() { return this; } };
      sheet._onChangeForm({}, { target } as any);
      await vi.waitFor(() => expect((sheet as any).supportBusy).toBe(false));
      expect(supportSubmit).toHaveBeenLastCalledWith(original, "setPilot", { pilotId: value || null });
    }
    sheet.isEditable = false;
    const target = { hasAttribute: (key: string) => key === "data-ally-pilot", value: "rafa", closest() { return this; } };
    sheet._onChangeForm({}, { target } as any);
    expect(supportSubmit).toHaveBeenCalledTimes(2);
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
