import { mountItemEffectConfigBlock, disposeItemEffectConfigBlock } from "../../src/ui/item-sheet-actions/item-sheet-ability-effect-config-block";
import { buildDefenseTemplate } from "../../src/adapters/ordem/ordem-ally-effect-presets";

// Browser-only DOM fixture. Native sheet controls, persistence and ApplicationV2 are test doubles.
export async function checkItemEffectConfigBlock(): Promise<string[]> {
  const checks: string[] = [], pending = new Set<Promise<unknown>>(), listeners = new Map<string, Set<Function>>();
  const assert = (value: unknown, label: string) => { if (!value) throw new Error(label); checks.push(label); };
  const emit = (name: string, value: unknown) => { for (const listener of listeners.get(name) ?? []) listener(value); };
  const track = (promise: Promise<unknown>) => { pending.add(promise); void promise.finally(() => pending.delete(promise)); };
  const settle = async () => {
    await new Promise(requestAnimationFrame);
    while (pending.size) await Promise.all([...pending]);
    await new Promise(requestAnimationFrame);
  };
  let confirmations = 0, confirmed = false, nativeClicks = 0, writes = 0, nextEffectId = 0;
  const opened: MockApplication[] = [];
  class MockApplication {
    element!: HTMLElement;
    constructor(readonly options: any = {}) { opened.push(this); }
    async render() {
      if (!this.element) {
        this.element = document.createElement("form"); this.element.className = "application paranormal-toolkit-ally-benefits";
        this.element.innerHTML = `<header class="window-header"><strong>${this.options.window?.title ?? "Toolkit"}</strong></header><div class="window-content"></div>`;
        this.element.addEventListener("click", event => {
          const button = (event.target as Element)?.closest<HTMLElement>("[data-action]");
          if (!button || button.hasAttribute("disabled")) return;
          event.preventDefault();
          const handler = (this.constructor as any).DEFAULT_OPTIONS.actions[button.dataset.action!];
          if (handler) track(Promise.resolve(handler.call(this, event, button)));
        });
        document.querySelector("#preview")!.append(this.element);
      }
      const result = await (this as any)._renderHTML();
      (this as any)._replaceHTML(result, this.element.querySelector(".window-content"));
      return this;
    }
    async close() { this.element?.remove(); return this; }
    bringToFront() {}
  }
  const user = { id: "gm", isGM: true };
  const packs = new Map<string, { locked: boolean }>();
  Object.assign(globalThis, {
    game: { system: { id: "ordemparanormal" }, user, packs }, CONFIG: {},
    ui: { notifications: { warn: (message: string) => { document.querySelector("#notice")!.textContent = message; } } },
    Hooks: { on: (name: string, callback: Function) => { if (!listeners.has(name)) listeners.set(name, new Set()); listeners.get(name)!.add(callback); },
      off: (name: string, callback: Function) => listeners.get(name)?.delete(callback) },
    foundry: { applications: { api: { ApplicationV2: MockApplication, DialogV2: { confirm: async () => { confirmations++; return confirmed; } } } } },
  });
  const item: any = { id: "preview", uuid: "Item.preview", name: "Proteção especializada", type: "ability", system: { activation: "passive" },
    parent: null, pack: null, limited: false, canUserModify: () => true, testUserPermission: () => true, getFlag: () => undefined };
  const effects: any[] = [];
  const createEffect = (data: any) => {
    let source = structuredClone(data);
    const effect: any = { id: source._id, parent: item,
      get name() { return source.name; }, get disabled() { return source.disabled; }, get transfer() { return source.transfer; },
      toObject: () => structuredClone(source), getFlag: (scope: string, key: string) => source.flags?.[scope]?.[key], canUserModify: () => true,
      update: async (patch: any) => { writes++; if (patch["system.changes"]) source.system.changes = structuredClone(patch["system.changes"]); emit("updateActiveEffect", effect); },
      sheet: { render: async () => { document.querySelector("#notice")!.textContent = `Editor nativo: ${source.name}`; } } };
    return effect;
  };
  effects.push(createEffect({ ...buildDefenseTemplate("Defesa da habilidade", 5), _id: "defense", disabled: false, transfer: true }));
  item.effects = { contents: effects, get: (id: string) => effects.find(effect => effect.id === id) };
  item.toObject = () => ({ type: item.type, system: structuredClone(item.system), effects: effects.map(effect => effect.toObject()) });
  item.createEmbeddedDocuments = async (_kind: string, data: any[]) => data.map(entry => {
    const effect = createEffect({ ...entry, _id: `new-${++nextEffectId}` }); effects.push(effect); writes++; emit("createActiveEffect", effect); return effect;
  });
  item.deleteEmbeddedDocuments = async (_kind: string, ids: string[]) => {
    for (const id of ids) { const index = effects.findIndex(effect => effect.id === id); if (index >= 0) { const [effect] = effects.splice(index, 1); writes++; emit("deleteActiveEffect", effect); } }
  };
  class Sheet {
    static PARTS = { effects: { scrollable: [".scrollable"] } };
    item = item; document = item; element = document.createElement("form"); parts: Record<string, HTMLElement> = {};
    isVisible = true; isEditable = true;
    constructor() {
      this.element.className = "test-native-sheet";
      this.element.innerHTML = '<header><strong>Habilidade — Efeitos</strong></header><nav>Atributos · Efeitos</nav>';
      this.element.addEventListener("click", event => { if ((event.target as Element).closest("[data-native-control]")) nativeClicks++; });
      this.replaceEffects(); document.querySelector("#preview")!.append(this.element);
    }
    replaceEffects() {
      const part = document.createElement("section"); part.className = "tab effects active"; part.dataset.applicationPart = "effects";
      part.dataset.group = "primary"; part.dataset.tab = "effects";
      part.innerHTML = `<div class="content-item effects-management scrollable">${["Temporários", "Passivos", "Inativos"].map(label =>
        `<div class="effects-section"><h3>${label}</h3><button type="button" data-native-control data-action="viewDoc">Editar efeito nativo</button><ol class="effect-list"><li>Lista nativa preservada</li></ol></div>`).join("")}</div>`;
      if (this.parts.effects) this.parts.effects.replaceWith(part); else this.element.append(part);
      this.parts.effects = part;
    }
  }
  const sheet = new Sheet();
  const nativeLists = [...sheet.element.querySelectorAll(".effect-list")];
  const sourceBefore = JSON.stringify(item.toObject());
  mountItemEffectConfigBlock(sheet as any);
  const block = () => sheet.element.querySelector<HTMLElement>("[data-paranormal-toolkit-item-effect-config]")!;
  const button = () => block().querySelector<HTMLButtonElement>("button")!;
  assert(block() && block().parentElement?.lastElementChild === block(), "one entry below the native categories");
  assert(nativeLists.every(list => sheet.element.contains(list)), "native lists keep their node identities");
  button().focus(); const firstButton = button();
  for (let i = 0; i < 5; i++) mountItemEffectConfigBlock(sheet as any);
  assert(sheet.element.querySelectorAll("[data-paranormal-toolkit-item-effect-config]").length === 1, "rerenders do not duplicate the entry");
  assert(button() === firstButton && document.activeElement === firstButton, "unchanged partial renders preserve keyboard focus");
  sheet.parts.effects.style.display = "none"; mountItemEffectConfigBlock(sheet as any);
  sheet.parts.effects.style.display = "";
  assert(button() === firstButton, "tab changes keep the existing entry");
  sheet.element.querySelector<HTMLButtonElement>("[data-native-control]")!.click();
  assert(nativeClicks === 1, "native controls remain independently usable");
  const { openItemEffectConfig } = await import("../../src/applications/item-effect-config-application");
  button().click(); button().click();
  const app = await openItemEffectConfig(item); await settle();
  assert(opened.length === 1, "multiple entry clicks reuse a single specialized window");
  assert(nativeClicks === 1, "Toolkit entry does not dispatch a native action");
  assert(JSON.stringify(item.toObject()) === sourceBefore && writes === 0, "opening and mounting never write source data");
  assert(app.element.textContent?.includes("Transferência automática ao Actor"), "independent Item explains future native transfer");
  const click = async (action: string) => { app.element.querySelector<HTMLButtonElement>(`[data-action="${action}"]`)!.click(); await settle(); };
  await click("editEffect");
  const editValue = app.element.querySelector<HTMLInputElement>('[name="editValue"]')!; editValue.value = "9";
  await click("cancelEdit"); assert(writes === 0, "canceling a quick edit writes nothing");
  await click("editEffect"); app.element.querySelector<HTMLInputElement>('[name="editValue"]')!.value = "7";
  await click("saveEffect"); assert(effects[0].toObject().system.changes[0].value === 7 && writes === 1, "explicit quick save changes one source value");
  const select = app.element.querySelector<HTMLSelectElement>('[name="presetId"]')!; select.value = "damageResistance";
  app._onChangeForm({}, { target: select } as any); await settle();
  assert(app.element.querySelectorAll('[name="damageTypeId"] option').length === 15, "RD offers the 15 canonical types");
  await click("addBenefit"); assert(effects.length === 2 && effects[1].transfer === true, "passive own preset uses native transfer");
  assert(effects[1].getFlag("paranormal-toolkit", "allyPassive") === undefined, "independent creation never infers ally projection");
  await click("removeEffect"); assert(effects.length === 2 && confirmations === 1, "deletion cancellation preserves source");
  confirmed = true; await click("removeEffect"); assert(effects.length === 1 && confirmations === 2, "source deletion requires explicit confirmation");
  item.system.activation = "free"; item.parent = { type: "agent" }; await app.render({ force: false });
  assert(app.element.textContent?.includes("Aplicar automaticamente ao Agente"), "active abilities can choose a passive effect independently");
  const previousWrites = writes, previousSource = JSON.stringify(effects[0].toObject());
  app.element.querySelector<HTMLSelectElement>('[name="transfer"]')!.value = "false";
  await app.render({ force: false });
  assert(writes === previousWrites && JSON.stringify(effects[0].toObject()) === previousSource, "changing the creation choice never edits an existing effect");
  await click("addBenefit");
  assert(effects[1].transfer === false && effects[0].transfer === true, "each preset keeps its own explicit transfer choice");
  app.element.querySelector<HTMLSelectElement>('[name="transfer"]')!.value = "true";
  await click("createCustom");
  assert(effects[2].transfer === true, "custom creation honors native transfer even on an active ability");
  item.system.activation = "reaction"; await app.render({ force: false });
  assert(app.element.querySelector<HTMLSelectElement>('[name="transfer"]')!.value === "true", "activation updates preserve the explicit creation draft");
  sheet.isEditable = false; item.canUserModify = () => false; mountItemEffectConfigBlock(sheet as any);
  assert(block().textContent?.includes("Somente leitura"), "permission changes update the entry");
  await app.render({ force: false });
  assert(app.element.querySelector<HTMLButtonElement>('[data-action="addBenefit"]')!.disabled, "permission loss disables specialized mutation");
  assert(app.element.querySelector<HTMLSelectElement>('[name="transfer"]')!.disabled, "read-only users cannot change the creation choice");
  item.canUserModify = () => true; sheet.isEditable = true; item.pack = "locked"; packs.set("locked", { locked: true });
  mountItemEffectConfigBlock(sheet as any); assert(block().textContent?.includes("Somente leitura"), "locked compendia stay read-only");
  packs.get("locked")!.locked = false; mountItemEffectConfigBlock(sheet as any);
  assert(!block().textContent?.includes("Somente leitura"), "editable packs retain native permission checks"); item.pack = null;
  const oldRoot = block(); sheet.replaceEffects(); mountItemEffectConfigBlock(sheet as any);
  assert(!oldRoot.isConnected && block() !== oldRoot, "replacement effects parts receive a fresh mount");
  const duplicate = block().cloneNode(true); block().parentElement!.append(duplicate); mountItemEffectConfigBlock(sheet as any);
  assert(sheet.element.querySelectorAll("[data-paranormal-toolkit-item-effect-config]").length === 1, "only Toolkit duplicates are removed");
  item.parent = { type: "paranormal-toolkit.ally" }; mountItemEffectConfigBlock(sheet as any);
  assert(block().textContent?.includes("Configurar benefícios passivos"), "actual ally ownership selects passive benefits wording");
  item.parent = { type: "threat" }; mountItemEffectConfigBlock(sheet as any);
  assert(!block(), "unsupported actor contexts keep only native controls");
  item.parent = null; mountItemEffectConfigBlock(sheet as any); disposeItemEffectConfigBlock(sheet);
  assert(!block() && sheet.element.querySelectorAll(".effect-list").length === 3, "sheet disposal leaves native lists intact");
  mountItemEffectConfigBlock(sheet as any); button().click(); await settle(); assert(opened.length === 1, "reopening a sheet reuses the existing editor");
  assert(!sheet.element.querySelector('[data-action="paranormal-toolkit.passiveBenefits"]'), "no competing header control exists");
  await app.render({ force: false });
  return checks;
}
