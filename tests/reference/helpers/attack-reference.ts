import { readFileSync } from "node:fs";
import { join } from "node:path";
import { runInNewContext } from "node:vm";
import ts from "typescript";
import { vi } from "vitest";
import { MODULE_ID } from "../../../src/constants";
import { OrdemAttackAdapter } from "../../../src/adapters/ordem/attacks/ordem-attack-adapter";
import { OrdemAttackIntegration } from "../../../src/adapters/ordem/attacks/ordem-attack-integration";
import { FoundryAttackRollMessageBridge } from "../../../src/adapters/foundry/foundry-attack-roll-message-bridge";
import { OrdemResourceAdapter } from "../../../src/adapters/ordem/ordem-resource-adapter";
import { OrdemDamageAdapter } from "../../../src/adapters/ordem/ordem-damage-adapter";
import { ResourceEngine } from "../../../src/core/resources/resource-engine";
import { DamageEngine } from "../../../src/core/damage/damage-engine";
import { AttackModifierRegistry } from "../../../src/features/attack-modifiers/attack-modifier-registry";
import { AttackChatCardService } from "../../../src/features/attack-modifiers/attack-chat-card-service";
import { AttackResourceService } from "../../../src/features/attack-modifiers/attack-resource-service";
import { AttackModifierWorkflow } from "../../../src/features/attack-modifiers/attack-modifier-workflow";
import { AttackDamageResolver } from "../../../src/features/attack-modifiers/attack-damage-resolver";
import { AttackDamageWorkflow } from "../../../src/features/attack-modifiers/attack-damage-workflow";
import { AttackAssistedDamageService } from "../../../src/features/attack-modifiers/attack-assisted-damage-service";

export function loadAttackReference(root: string, file: string, globals: Record<string, unknown>, dependencies: Record<string, unknown> = {}): any {
  const filename = join(root, file);
  const code = ts.transpileModule(readFileSync(filename, "utf8"), {
    compilerOptions: { module: ts.ModuleKind.CommonJS, target: ts.ScriptTarget.ES2022 }, fileName: filename + ".ts",
  }).outputText;
  const exports = {};
  runInNewContext(code, { exports, ...globals, require: (id: string) => {
    if (!(id in dependencies)) throw new Error("Unexpected reference dependency: " + id);
    return dependencies[id];
  } }, { filename, timeout: 2000 });
  return exports;
}
export function referenceGet(object: any, path: string): any {
  if (object && path in object) return object[path];
  return path.split(".").reduce((value, key) => value?.[key], object);
}
function set(object: any, path: string, value: unknown) {
  const keys = path.split("."); let cursor = object;
  for (const key of keys.slice(0, -1)) cursor = cursor[key] ??= {};
  cursor[keys.at(-1)!] = structuredClone(value);
}
function merge(target: any, changes: any) {
  for (const [key, value] of Object.entries(changes)) {
    if (key.includes(".")) set(target, key, value);
    else if (value && typeof value === "object" && !Array.isArray(value)) merge(target[key] ??= {}, value);
    else target[key] = structuredClone(value);
  }
  return target;
}
class Collection<T extends { id: string }> extends Map<string, T> {
  get contents() { return [...this.values()]; }
  [Symbol.iterator](): any { return this.values(); }
}
export async function createAttackReference(root: string, settings: { attacks?: number; targeted?: number; bound?: boolean; pd?: boolean; choices?: any[]; rolls?: number[] } = {}) {
  let serial = 0;
  const randomID = () => "reference" + String(++serial).padStart(8, "0");
  const hooks = new Map<string, Array<(...args: any[]) => unknown>>();
  const Hooks = {
    on(name: string, fn: (...args: any[]) => unknown) { const list = hooks.get(name) ?? []; list.push(fn); hooks.set(name, list); },
    once() {}, off() {}, callAll(name: string, ...args: any[]) { for (const fn of hooks.get(name) ?? []) fn(...args); },
  };
  const documents = new Map<string, any>();
  const messages = new Collection<any>();
  const actors = new Collection<any>();
  const users = [{ id: "gm", isGM: true, active: true }, { id: "player", isGM: false, active: true }];
  const game: any = { user: { ...users[1], targets: new Set() }, userId: "player", users, messages, actors,
    system: { id: "ordemparanormal", version: "8.0.2" }, combat: null, modules: new Map(), packs: new Map(),
    settings: { get: (_scope: string, key: string) => key === "globalPlayingWithoutSanity" ? settings.pd === true
      : key === "itemUse.executionMode" ? "automatic" : key === "core.rollMode" ? "publicroll" : undefined },
    i18n: { has: () => true, localize: (key: string) => key, format: (key: string) => key },
    socket: { emit: vi.fn() } };
  class MemoryMessage {
    id: string; flags: any = {}; rolls: any[]; content: string; author: any = { id: game.user.id };
    constructor(data: any = {}) {
      this.id = randomID(); this.rolls = data.rolls ?? []; this.content = data.content ?? "";
      merge(this.flags, data.flags ?? {});
      messages.set(this.id, this); documents.set("ChatMessage." + this.id, this);
    }
    getFlag(scope: string, key: string) { return this.flags[scope]?.[key]; }
    async setFlag(scope: string, key: string, value: unknown) { return this.update({ flags: { [scope]: { [key]: value } } }); }
    async unsetFlag(scope: string, key: string) { delete this.flags[scope]?.[key]; return this; }
    async update(changes: any) {
      for (const hook of hooks.get("preUpdateChatMessage") ?? []) if (hook(this, changes, {}, game.user.id) === false) return this;
      merge(this, changes);
      Hooks.callAll("updateChatMessage", this, changes, {}, game.user.id);
      return this;
    }
  }
  const publication = { veto: false, failAttack: false, failDamage: false };
  const ChatMessage = {
    create: vi.fn(async (data: any) => {
      if (publication.veto) return undefined;
      if (publication.failAttack && data.flags?.[MODULE_ID]?.attackExecution) throw new Error("Connection lost");
      if (publication.failDamage && data.flags?.[MODULE_ID]?.attackDamage) throw new Error("Connection lost");
      return new MemoryMessage(data);
    }),
    getSpeaker: ({ actor }: any) => ({ actor: actor?.id }), getWhisperRecipients: () => ["gm"],
  };
  const rollQueue = [...(settings.rolls ?? [20, 20, 12])];
  class ReferenceRoll {
    data: any; options = {}; total = 0; result = ""; _evaluated = false;
    constructor(public formula: string, data: any = {}) { this.data = data; }
    async evaluate() {
      if (this._evaluated) throw new Error("Already evaluated");
      this._evaluated = true;
      if (this.formula.includes("d20")) { const die = rollQueue.shift() ?? 12; this.total = die + 10; this.result = die + " + 10"; }
      else {
        if (this.formula === "invalid") throw new Error("Invalid damage");
        this.total = Number(this.formula.split("d")[0]) * 4; this.result = String(this.total);
      }
      return this;
    }
    async toMessage(data: any = {}, _options: any = {}) { return ChatMessage.create({ ...data, rolls: [this] }); }
    static validate() { return true; }
  }
  class ActorBase {
    flags: any = {}; items = new Collection<any>(); isOwner = true; prototypeToken = { actorLink: true };
    img = ""; token = null;
    constructor(public id: string, public type: string, public system: any) { actors.set(id, this); documents.set(this.uuid, this); }
    get uuid() { return "Actor." + this.id; } get name() { return this.id; }
    getRollData() { return structuredClone(this.system); }
    getActiveTokens() { return []; } canUserModify() { return true; } testUserPermission() { return true; }
    getFlag(scope: string, key: string) { return this.flags[scope]?.[key]; }
    async setFlag(scope: string, key: string, value: unknown) { set(this.flags, scope + "." + key, value); }
    async update(changes: any) { merge(this, changes); return this; }
    prepareDerivedData() {}
  }
  class ItemBase {
    id: string; type: string; name: string; img = "icons/svg/sword.svg"; system: any; flags: any;
    constructor(data: any, public context: any) {
      this.id = data._id ?? randomID(); this.type = data.type; this.name = data.name; this.system = structuredClone(data.system); this.flags = structuredClone(data.flags ?? {});
    }
    get parent() { return this.context.parent; } get actor() { return this.parent; }
    get uuid() { return this.parent.uuid + ".Item." + this.id; }
    getRollData() { return {}; }
    toObject() { return { _id: this.id, type: this.type, name: this.name, system: structuredClone(this.system), flags: structuredClone(this.flags) }; }
    clone(data: any, _options: any) { return new (this.constructor as any)({ ...this.toObject(), ...data }, { parent: this.parent }); }
    getFlag(scope: string, key: string) { return this.flags[scope]?.[key]; }
    async setFlag(scope: string, key: string, value: unknown) { set(this.flags, scope + "." + key, value); }
    async unsetFlag(scope: string, key: string) { delete this.flags[scope]?.[key]; }
    canUserModify() { return true; }
  }
  const foundry = { utils: { getProperty: referenceGet, deepClone: structuredClone, randomID, getType: (value: unknown) => typeof value,
    mergeObject: (a: any, b: any) => merge(a, b), escapeHTML: (value: string) => value } };
  const notifications = { warn: vi.fn(), info: vi.fn(), error: vi.fn() };
  const globals: any = { console, game, Hooks, ChatMessage, foundry, Item: ItemBase, Actor: ActorBase, Roll: ReferenceRoll,
    ui: { notifications }, fromUuid: async (uuid: string) => documents.get(uuid), fromUuidSync: (uuid: string) => documents.get(uuid) };
  const reactionHelpers = loadAttackReference(root, "module/helpers/reaction-helpers.mjs", globals);
  const visibility = loadAttackReference(root, "module/helpers/visibility.mjs", globals);
  const { OrdemItem } = loadAttackReference(root, "module/documents/item.mjs", globals, {
    "../helpers/reaction-helpers.mjs": reactionHelpers, "../helpers/visibility.mjs": visibility,
  });
  const dummy = { default: class {} };
  const calculations = loadAttackReference(root, "module/helpers/actor-calculations.mjs", globals);
  const { OrdemActor } = loadAttackReference(root, "module/documents/actor.mjs", globals, {
    "../helpers/actor-calculations.mjs": calculations, "../dice/basic-roll.mjs": dummy,
    "../applications/skill-tool-configuration-dialog.mjs": dummy, "../applications/attribute-configuration-dialog.mjs": dummy,
  });
  const CONFIG: any = { Item: { documentClass: OrdemItem }, Dice: { BasicRoll: {
    constructParts: () => ({ parts: ["10"], data: {} }),
  } } };
  globals.CONFIG = CONFIG;
  // The module globals object is copied by the VM; CONFIG must be injected before methods run.
  const { OrdemItem: ConfiguredItem } = loadAttackReference(root, "module/documents/item.mjs", globals, {
    "../helpers/reaction-helpers.mjs": reactionHelpers, "../helpers/visibility.mjs": visibility,
  });
  CONFIG.Item.documentClass = ConfiguredItem;
  const reactions = loadAttackReference(root, "module/helpers/reactions.mjs", globals, { "./reaction-helpers.mjs": reactionHelpers });
  const head = { querySelectorAll: () => [], append() {} };
  class ElementDouble {}
  const documentDouble = { head, baseURI: "http://localhost/", createElement: () => ({ setAttribute() {} }) };
  for (const [key, value] of Object.entries({ ...globals, CONFIG, document: documentDouble, HTMLElement: ElementDouble })) vi.stubGlobal(key, value);
  const actor = new OrdemActor("attacker", "agent", {
    attributes: { dex: { value: 2 }, str: { value: 1 } }, skills: { aim: { degree: { value: 10 }, value: 0, mod: 0 } },
    PE: { value: 20, max: 20 }, PD: { value: 20, max: 20 }, PV: { value: 100, max: 100 }, defense: { value: 10 },
  });
  const targets = [0, 1, 2].map(index => {
    const target = new OrdemActor("target" + index, "threat", { attributes: { hp: { value: 100, max: 100 } },
      defense: { value: 10 }, resistances: { ballisticDamage: { value: index === 2 ? 8 : 15 } } });
    const token = { id: "token" + index, name: target.name, actor: target, scene: { id: "scene" } };
    documents.set("Scene.scene.Token." + token.id, { actor: target }); return token;
  });
  for (const token of targets.slice(0, settings.targeted ?? 1)) game.user.targets.add(token);
  const weapon = new ConfiguredItem({ _id: "weapon", name: "Fuzil", type: "armament",
    system: { critical: "19/x3", numberOfAttacks: settings.attacks ?? 1, types: { rangeType: { name: "ranged" } },
      formulas: { attack: { attr: "dex", skill: "aim", bonus: "" }, damage: { formula: "2d6", parts: [], type: "ballisticDamage", attr: "" } } },
  }, { parent: actor });
  actor.items.set(weapon.id, weapon); documents.set(weapon.uuid, weapon);
  if (settings.bound !== false) {
    const ability = new ConfiguredItem({ _id: "ability", name: "Habilidade renomeada", type: "ability", system: {},
      flags: { [MODULE_ID]: { attackModifier: { schemaVersion: 1, presetId: "attack.tiroIntuitivo", presetVersion: "1.0.0" } } } }, { parent: actor });
    actor.items.set(ability.id, ability);
  }
  const resourceAdapter = new OrdemResourceAdapter(), resourceEngine = new ResourceEngine(resourceAdapter);
  const bridge = new FoundryAttackRollMessageBridge(), adapter = new OrdemAttackAdapter(), cards = new AttackChatCardService();
  const choices = [...(settings.choices ?? [{ "attack.tiroIntuitivo": ["use", "empower"] }])];
  const request = vi.fn(async () => choices.length ? choices.shift() : {});
  const attacks = new AttackModifierWorkflow(new AttackModifierRegistry(), adapter, cards,
    new AttackResourceService(resourceEngine, resourceAdapter), bridge, request);
  const resolver = new AttackDamageResolver(cards, adapter), damage = new AttackDamageWorkflow(cards, resolver, adapter, bridge);
  const assisted = new AttackAssistedDamageService(new DamageEngine(new OrdemDamageAdapter()), cards, resolver);
  const integration = new OrdemAttackIntegration(attacks, damage, assisted, adapter, bridge);
  integration.register();
  const source = new MemoryMessage({ content: '<div class="chat-card item-card" data-item-id="weapon"></div>' });
  const invoke = async (action: string, message = source, useId = cards.readBinding(message)?.activeUseId ?? "") => {
    const wrapper = { dataset: { messageId: message.id } };
    const card = { dataset: { actorId: actor.id, itemId: weapon.id }, closest: () => wrapper };
    const button = { dataset: { action, toolkitAttackUseId: useId }, disabled: false, closest: (selector: string) => selector === ".chat-card" ? card : button };
    await ConfiguredItem._onChatCardAction({ target: button, preventDefault() {} });
  };
  return { actor, weapon, targets, source, invoke, request, cards, attacks, resolver, damage, assisted, integration,
    game, documents, messages, publication, notifications, reactions, users, rollQueue, ChatMessage,
    attackMessages: () => messages.contents.filter(message => message.getFlag(MODULE_ID, "attackExecution")),
    damageMessages: () => messages.contents.filter(message => message.getFlag(MODULE_ID, "attackDamage")) };
}
