import { vi } from "vitest";
import { createAllyLedger, AllySupportService, type AllyLedger } from "../../src/features/allies/ally-support-service";
import { AllyGrantedAbilityService } from "../../src/features/allies/ally-granted-ability-service";
import { AllyReconciliationService } from "../../src/features/allies/ally-reconciliation-service";
import { FoundryAllyItemAdapter } from "../../src/adapters/foundry/foundry-ally-item-adapter";
import { FoundryAllyReceiptAdapter } from "../../src/adapters/foundry/foundry-ally-receipt-adapter";
import { AllyGrantedAbilityUseService } from "../../src/features/allies/ally-granted-ability-use-service";
import { ResourceEngine } from "../../src/core/resources/resource-engine";
import { OrdemResourceAdapter } from "../../src/adapters/ordem/ordem-resource-adapter";
import { WorkflowEngine } from "../../src/core/workflow/workflow-engine";
import { WorkflowHookEmitter } from "../../src/core/workflow/workflow-hook-emitter";
import { AutomationRunner } from "../../src/core/automation/automation-runner";
import { AbilityAssistedActionService } from "../../src/features/abilities/ability-assisted-action-service";
import { readAllyAbility } from "../../src/features/allies/config/ally-ability-config";
import { describeAllyEffect } from "../../src/adapters/ordem/ordem-ally-benefit-adapter";
import type { AllyManagedEffect } from "../../src/features/allies/ally-reconciliation-service";

export const scope = "paranormal-toolkit";
class Replacement { constructor(public value: unknown) {} }
class Deletion {}
export function applyGrantUpdate(source: any, changes: any) {
  for (const [path, value] of Object.entries(changes)) {
    const parts = path.split("."); let target = source;
    for (const key of parts.slice(0, -1)) target = target[key] ??= {};
    const key = parts.at(-1)!;
    if (value instanceof Deletion) delete target[key];
    else target[key] = structuredClone(value instanceof Replacement ? value.value : value);
  }
}
function collection<T extends { id: string }>(values: T[]) { return { contents: values, get: (id: string) => values.find(value => value.id === id), find: (predicate: (v: T) => boolean) => values.find(predicate) }; }
export function grantEffect(data: any, parent: any): any {
  const source = structuredClone(data);
  return { id: source._id, parent, get name() { return source.name; }, get transfer() { return source.transfer; },
    get disabled() { return source.disabled; }, getFlag: (s: string, k: string) => source.flags?.[s]?.[k],
    toObject: () => structuredClone(source), update: vi.fn(async changes => applyGrantUpdate(source, changes)),
  };
}
export function grantAbility(data: any, parent: any): any {
  const source = { name: "Habilidade", img: "icons/svg/aura.svg", type: "ability", system: { activation: "default", cost: 2 }, ...structuredClone(data) };
  const effects = (source.effects ?? []).map((entry: any) => grantEffect(entry, null));
  const item: any = { id: source._id, documentName: "Item", parent, actor: parent,
    uuid: `Actor.${parent.id}.Item.${source._id}`, get name() { return source.name; }, type: "ability",
    get system() { return source.system; }, effects: collection(effects),
    getFlag: (s: string, k: string) => source.flags?.[s]?.[k],
    setFlag: vi.fn(async (s, k, v) => { ((source.flags ??= {})[s] ??= {})[k] = structuredClone(v); }),
    toObject: () => ({ ...structuredClone(source), effects: effects.map((effect: any) => effect.toObject(true)) }),
    update: vi.fn(async changes => { applyGrantUpdate(source, changes); return item; }),
    createEmbeddedDocuments: vi.fn(async (_type, entries) => {
      const created = entries.map((entry: any) => grantEffect(entry, item)); effects.push(...created); return created;
    }),
    updateEmbeddedDocuments: vi.fn(async (_type, entries) => { for (const entry of entries) await effects.find((effect: any) => effect.id === entry._id).update(entry); }),
    deleteEmbeddedDocuments: vi.fn(async (_type, ids) => { for (const id of ids) { const i = effects.findIndex((effect: any) => effect.id === id); if (i >= 0) effects.splice(i, 1); } }),
  };
  for (const effect of effects) effect.parent = item;
  return item;
}
export async function grantWorld() {
  const hooks = new Map<string, Function[]>();
  vi.stubGlobal("Hooks", { on: (name: string, cb: Function) => hooks.set(name, [...hooks.get(name) ?? [], cb]), off: vi.fn(), callAll: vi.fn() });
  let nextId = 0;
  vi.stubGlobal("foundry", { utils: { randomID: () => `id${String(++nextId).padStart(14, "0")}`,
    getProperty: (object: any, path: string) => path.split(".").reduce((v, k) => v?.[k], object) },
    documents: {}, data: { operators: { ForcedReplacement: Replacement, ForcedDeletion: Deletion } },
    applications: { api: { ApplicationV2: class {} } } });
  vi.stubGlobal("CONFIG", { Actor: {}, ActiveEffect: { changeTypes: {} } });
  const gmFlags: any = { [scope]: { allyStore: "JournalEntry.ledger" } };
  const gm = { id: "gm", isGM: true, active: true, getFlag: (s: string, k: string) => gmFlags[s]?.[k],
    setFlag: vi.fn(async (s, k, value) => { (gmFlags[s] ??= {})[k] = structuredClone(value); }) };
  const player = { id: "player", isGM: false, active: true };
  const allyPlayer = { id: "ally-player", isGM: false, active: true };
  const pilotPlayer = { id: "pilot-player", isGM: false, active: true };
  const settings: Record<string, unknown> = { "itemUse.executionMode": "automatic", "itemUse.systemCardMode": "replace", globalPlayingWithoutSanity: false };
  const messages: any[] = [], actors: any[] = [];
  vi.stubGlobal("game", { user: gm, users: [gm, player, allyPlayer, pilotPlayer], time: { serverTime: 60_000 }, actors: collection(actors), messages: collection(messages),
    modules: new Map(), settings: { get: (_s: string, k: string) => settings[k] }, system: { id: "ordemparanormal", version: "8.0.2" } });
  vi.stubGlobal("ui", { notifications: { warn: vi.fn(), info: vi.fn(), error: vi.fn() } });
  vi.stubGlobal("document", { querySelector: () => null });
  const rolls: any[] = [];
  vi.stubGlobal("Roll", class {
    total = 6; dice = [{ results: [{ result: 6 }] }];
    constructor(public formula: string, public data?: unknown) { rolls.push(this); }
    async evaluate() { return this; }
  });
  function actor(id: string, type: string): any {
    const data: any = { name: id, system: { ...(type === `${scope}.ally` ? { schemaVersion: 1, description: "", isDrone: false } : {}),
      NEX: { value: 50 }, PE: { value: 20, max: 20 }, PD: { value: 20, max: 20 }, PV: { value: 10, max: 30 } }, flags: {} };
    const items: any[] = [];
    const target: any = { id, uuid: `Actor.${id}`, documentName: "Actor", isToken: false, type,
      name: id, get system() { return data.system; }, items: collection(items),
      getRollData: () => structuredClone(data.system), canUserModify: (user: any) => user.isGM || user.id === (type === "agent" ? "player" : "ally-player"),
      getFlag: (s: string, k: string) => data.flags[s]?.[k], setFlag: vi.fn(async (s, k, v) => { (data.flags[s] ??= {})[k] = structuredClone(v); }),
      update: vi.fn(async changes => { applyGrantUpdate(data, changes); return target; }),
      createEmbeddedDocuments: vi.fn(async (_type, entries) => { const created = entries.map((entry: any) => grantAbility({ ...entry, _stats: { lastModifiedBy: game.user!.id } }, target)); items.push(...created); return created; }),
      deleteEmbeddedDocuments: vi.fn(async (_type, ids) => { for (const id of ids) { const i = items.findIndex(item => item.id === id); if (i >= 0) items.splice(i, 1); } }),
    };
    actors.push(target); return target;
  }
  const iris = actor("iris", `${scope}.ally`), mauro = actor("mauro", "agent"), rafa = actor("rafa", "agent");
  function message(id: string, author: any = player): any {
    const source: any = { content: "<p>Mensagem nativa</p>", author: author.id, flags: {}, whisper: [], blind: false };
    const m: any = { id, _stats: { createdTime: Date.now() }, get author() { return game.users.find(user => user.id === source.author); },
      get content() { return source.content; }, get whisper() { return source.whisper; }, get blind() { return source.blind; },
      getFlag: (s: string, k: string) => source.flags[s]?.[k], canUserModify: (user: any) => user.isGM || source.author === user.id,
      update: vi.fn(async data => { applyGrantUpdate(source, data); return m; }), setFlag: vi.fn(async (s, k, v) => { (source.flags[s] ??= {})[k] = structuredClone(v); }) };
    messages.push(m); return m;
  }
  vi.stubGlobal("ChatMessage", { getSpeaker: ({ actor }: any) => ({ actor: actor?.id }), create: vi.fn(async (data: any) => {
    const m = message(data._id, gm); await m.update(data); return m;
  }) });
  vi.stubGlobal("fromUuid", vi.fn(async (uuid: string) => actors.find(actor => actor.uuid === uuid) ?? null));
  let ledger = createAllyLedger(); ledger.nextSequence = 2;
  ledger.links.push({ allyId: "iris", state: { beneficiaryId: "mauro", status: "active", sequence: 1, wait: null },
    suppressedSources: [], suppressedGrants: [], notice: null, diagnostic: null });
  const store = { load: vi.fn(async () => structuredClone(ledger)), save: vi.fn(async (next: AllyLedger) => { ledger = structuredClone(next); }) };
  const environment: any = { currentUserId: () => game.user?.id ?? null, users: () => game.users,
    ownsAlly: (id: string, userId: string) => { const user = game.users.find(user => user.id === userId); return Boolean(user && actors.find(actor => actor.id === id)?.canUserModify(user)); },
    allyExists: (id: string) => Boolean(actors.find(actor => actor.id === id)), agentExists: (id: string) => actors.some(actor => actor.id === id && actor.type === "agent" && !actor.isToken),
    abilities: (id: string) => {
      const definitions = actors.find(actor => actor.id === id)?.items.contents.map((item: any) => ({ id: item.id, definition: readAllyAbility(item) })) ?? [];
      return definitions.some((entry: any) => !entry.definition) ? null : definitions;
    }, describeEffect: describeAllyEffect, resolveCombat: () => null, combat: () => null, publish: vi.fn(async () => {}), notify: vi.fn(async () => {}) };
  let support: AllySupportService;
  const assertExecutor = () => { if (!support.isExecutor()) throw new Error("Executor mudou"); };
  const adapter = new FoundryAllyItemAdapter(assertExecutor);
  const effects = new Map<string, AllyManagedEffect>();
  const effectAdapter = {
    newId: () => foundry.utils.randomID(), exists: (effect: AllyManagedEffect) => effects.has(effect.effectId),
    matches: (effect: AllyManagedEffect) => JSON.stringify(effects.get(effect.effectId)) === JSON.stringify(effect),
    create: vi.fn(async (effect: AllyManagedEffect) => { effects.set(effect.effectId, structuredClone(effect)); }),
    update: vi.fn(async (effect: AllyManagedEffect) => { effects.set(effect.effectId, structuredClone(effect)); }),
    remove: vi.fn(async (effect: AllyManagedEffect) => { effects.delete(effect.effectId); }),
  };
  support = new AllySupportService(store, environment, new AllyReconciliationService(effectAdapter), new AllyGrantedAbilityService(adapter));
  const resources = new ResourceEngine(new OrdemResourceAdapter());
  const workflow = new WorkflowEngine(new AutomationRunner(resources, {} as any, {} as any, new WorkflowHookEmitter()), new WorkflowHookEmitter());
  const { AbilityUseWorkflow } = await import("../../src/features/abilities/ability-use-workflow");
  const generic = new AbilityUseWorkflow(resources, new OrdemResourceAdapter());
  const receiptAdapter = new FoundryAllyReceiptAdapter(assertExecutor);
  const assisted = new AbilityAssistedActionService({ applyDamage: vi.fn(async () => ({ ok: true, value: {} })) } as any, resources, async () => {});
  const makeUseService = () => new AllyGrantedAbilityUseService(support, adapter, receiptAdapter, generic, new OrdemResourceAdapter(), workflow, assisted);
  const use = makeUseService();
  function addAbility(data: any = {}) { const item = grantAbility({ _id: `source${iris.items.contents.length}`, ...data }, iris); iris.items.contents.push(item); return item; }
  return { iris, mauro, rafa, gm, player, allyPlayer, pilotPlayer, makeActor: actor, effects, effectAdapter, settings, messages, rolls, message, addAbility, support, use, makeUseService,
    store, adapter, receiptAdapter, environment, hooks, ledger: () => structuredClone(ledger), setLedger: (next: AllyLedger) => { ledger = structuredClone(next); } };
}
