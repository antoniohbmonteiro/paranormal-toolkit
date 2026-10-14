import { readFileSync } from "node:fs";
import { join } from "node:path";
import { createContext, runInContext, type Context } from "node:vm";
import ts from "typescript";
import { describe, expect, it } from "vitest";
import { readAllyRequest } from "../../src/features/allies/ally-operation-authority";
import { readUpdatedAllyRequest } from "../../src/adapters/foundry/foundry-ally-request-adapter";

const root = process.env.PARANORMAL_TOOLKIT_FOUNDRY_REFERENCE;
const contexts = new WeakMap<object, Context>();
function context(globals: Record<string, unknown>): Context {
  let vm = contexts.get(globals);
  if (!vm) { vm = createContext({ structuredClone }); contexts.set(globals, vm); }
  Object.assign(vm, globals);
  return vm;
}

// Executes installed core methods; schema validation, document collection and socket/server are doubled.
function load(relative: string, globals: Record<string, unknown>, dependencies: Record<string, unknown>): any {
  const filename = join(root!, relative);
  const code = ts.transpileModule(readFileSync(filename, "utf8"), {
    fileName: filename + ".ts",
    compilerOptions: { module: ts.ModuleKind.CommonJS, target: ts.ScriptTarget.ES2022, esModuleInterop: false },
  }).outputText;
  const exports = {};
  const vm = context(globals);
  vm.nativeExports = exports;
  vm.nativeRequire = (name: string) => {
    if (!(name in dependencies)) throw new Error("Unexpected Foundry dependency: " + name);
    return dependencies[name];
  };
  runInContext(`(function(exports, require) { ${code}\n})(nativeExports, nativeRequire);`, vm, { filename, timeout: 2000 });
  return exports;
}
function nativeFlow(initial?: unknown) {
  class Operator {}
  class Deletion extends Operator {}
  class Replacement extends Operator {}
  const operators = { DataFieldOperator: Operator, ForcedDeletion: Deletion, ForcedReplacement: Replacement };
  const logging = { logCompatibilityWarning: () => {} };
  const globals: Record<string, any> = { console, CONFIG: { debug: { documents: false } },
    CONST: { vtt: "Foundry" }, ui: { notifications: { error: (message: string) => { throw new Error(message); } } } };
  const toNative = (value: unknown) => runInContext(`JSON.parse(${JSON.stringify(JSON.stringify(value))})`, context(globals));
  const helpers = load("common/utils/helpers.mjs", globals, {
    "./color.mjs": { default: class {} }, "../data/operators.mjs": operators, "./logging.mjs": logging,
  });
  globals.foundry = { utils: helpers, documents: { collections: { CompendiumCollection: class {} } },
    abstract: { DocumentSocketResponse: class { constructor(data: object) { Object.assign(this, data); } } } };
  const fields = load("common/data/fields.mjs", globals, {
    "../constants.mjs": { ALL_DOCUMENT_TYPES: [], BASE_DOCUMENT_TYPE: "base", DOCUMENT_OWNERSHIP_LEVELS: {}, FILE_CATEGORIES: {} },
    "./validators.mjs": {}, "../utils/helpers.mjs": helpers,
    "../abstract/singleton-collection.mjs": { default: class {} },
    "../abstract/embedded-collection.mjs": { default: class {} },
    "../abstract/embedded-collection-delta.mjs": { default: class {} },
    "../utils/_module.mjs": { AsyncFunction: Object.getPrototypeOf(async function () {}).constructor, Color: class {} },
    "./operators.mjs": operators, "./validation-failure.mjs": {},
  });
  const Document = load("common/abstract/document.mjs", globals, {
    "./data.mjs": { default: class {} }, "../utils/helpers.mjs": helpers,
    "../constants.mjs": { BASE_DOCUMENT_TYPE: "base" }, "../utils/logging.mjs": logging,
    "../data/fields.mjs": fields, "../data/operators.mjs": operators,
  }).default;
  const updates: Record<string, unknown>[] = [], events: { changes: any; full: unknown; userId: string }[] = [];
  const flagField = Object.create(fields.ObjectField.prototype);
  flagField.validate = () => undefined;
  const actor: any = { id: "iris", flags: toNative({ "paranormal-toolkit": initial === undefined ? {} : { allyRequest: initial } }),
    _preUpdate: async () => true, _onUpdate: () => {}, getFlag: Document.prototype.getFlag,
    setFlag: Document.prototype.setFlag, update: Document.prototype.update,
    updateSource: (changes: any, options: any) => {
      const state = { source: { flags: helpers.deepClone(actor.flags) }, diff: toNative({}), model: actor, failure: { fields: {} } };
      if (changes.flags) flagField._updateDiff("flags", changes.flags, options, state);
      if (!options.dryRun) actor.flags = state.source.flags;
      return state.diff;
    } };
  const collection = { get: () => actor, set: () => {}, _onModifyContents: () => {} };
  const origin = { id: "authenticated-player" };
  globals.game = { user: origin, users: { get: () => origin }, collections: new Map([["Actor", collection]]) };
  const hooks = { call: () => true, onError: (name: string, error: Error) => { throw new Error(name, { cause: error }); },
    callAll: (name: string, doc: any, changes: any, _options: unknown, userId: string) => {
      if (name === "updateActor") events.push({ changes: structuredClone(changes),
        full: structuredClone(doc.getFlag("paranormal-toolkit", "allyRequest")), userId });
    } };
  const documentClass: any = { documentName: "Actor", cleanData: (data: any) => toNative(data),
    shimData: (data: any) => data, _preUpdateOperation: async () => true, _onUpdateOperation: async () => {} };
  const Backend = load("client/data/client-backend.mjs", globals, {
    "@common/abstract/backend.mjs": { default: class { async _getParent() { return null; } } },
    "../helpers/socket-interface.mjs": { default: { dispatch: async (_name: string, data: any) => ({
      ...data, result: structuredClone(data.operation.updates), userId: origin.id,
    }) } },
    "../helpers/hooks.mjs": { default: hooks },
    "../utils/helpers.mjs": { getDocumentClass: () => documentClass },
    "../documents/token.mjs": { default: class {} }, "../documents/actor.mjs": { default: class {} },
  }).default;
  const backend = new Backend();
  backend.getFlagScopes = () => ["paranormal-toolkit"];
  documentClass.database = backend;
  documentClass.updateDocuments = async (data: any[], operation: any) => {
    updates.push(structuredClone(data[0]));
    return backend._updateDocuments(documentClass, { diff: true, recursive: true, ...operation, updates: data }, origin);
  };
  actor.constructor = documentClass;
  return { actor, updates, events, toNative };
}
describe.skipIf(!root)("native Foundry request diff and post-update hook (server doubled)", () => {
  const first = { id: "request-01", revision: 0, action: "assign", beneficiaryId: "joao" };
  it("shows a full setFlag update becoming an id-only hook delta when other fields are unchanged", async () => {
    const flow = nativeFlow(first);
    const next = { ...first, id: "request-02" };
    await flow.actor.setFlag("paranormal-toolkit", "allyRequest", flow.toNative(next));
    expect(flow.updates[0]).toEqual({ _id: "iris", flags: { "paranormal-toolkit": { allyRequest: next } } });
    const event = flow.events[0], delta = event.changes.flags["paranormal-toolkit"].allyRequest;
    expect(delta).toEqual({ id: "request-02" });
    expect(delta).not.toHaveProperty("revision");
    expect(readAllyRequest(delta)).toBeNull();
    expect(event.full).toEqual(next);
    expect(event.userId).toBe("authenticated-player");
    expect(readUpdatedAllyRequest(flow.actor, event.changes, event.userId)).toEqual({ ...first, id: "request-02" });
  });
  it("also reads the full first submission and gets no new event for an identical setFlag", async () => {
    const flow = nativeFlow();
    await flow.actor.setFlag("paranormal-toolkit", "allyRequest", flow.toNative(first));
    expect(flow.events[0].changes.flags["paranormal-toolkit"].allyRequest).toEqual(first);
    expect(readUpdatedAllyRequest(flow.actor, flow.events[0].changes, flow.events[0].userId)).toEqual(first);
    await flow.actor.setFlag("paranormal-toolkit", "allyRequest", flow.toNative(first));
    expect(flow.events).toHaveLength(1);
  });
});
