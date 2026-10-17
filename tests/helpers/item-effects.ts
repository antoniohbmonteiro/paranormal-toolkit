import { vi } from "vitest";

function apply(data: any, changes: any) {
  for (const [key, value] of Object.entries(changes)) {
    const parts = key.split("."); let target = data;
    for (const part of parts.slice(0, -1)) target = target[part] ??= {};
    target[parts.at(-1)!] = structuredClone(value);
  }
}
export function effect(data: any, parent?: any): any {
  let source = structuredClone(data);
  return { id: source._id, get name() { return source.name; }, get disabled() { return source.disabled ?? false; },
    get transfer() { return source.transfer ?? false; }, parent, get system() { return structuredClone(source.system); },
    toObject: () => structuredClone(source), getFlag: (_scope: string, key: string) => source.flags?.[_scope]?.[key],
    update: vi.fn(async changes => { apply(source, changes); }),
    updateSource: vi.fn(changes => apply(source, changes)),
    unsetFlag: vi.fn(async (_scope: string, key: string) => { delete source.flags?.[_scope]?.[key]; }),
    sheet: { render: vi.fn(async () => {}) },
    replace: (data: any) => { source = structuredClone(data); },
  };
}
export function itemFixture(data: any = {}, parent: any = null): any {
  let count = 0;
  const source = { _id: "ability", name: "Habilidade", type: "ability", ...structuredClone(data) };
  const effects: any[] = [];
  const item: any = { documentName: "Item", get system() { return source.system ?? {}; }, pack: data.pack, limited: false, testUserPermission: vi.fn(() => true), update: vi.fn(async (patch: any) => { apply(source, patch); return item; }), id: source._id, name: source.name, type: source.type, parent,
    uuid: parent ? `Actor.${parent.id}.Item.${source._id}` : `Item.${source._id}`,
    effects: { contents: effects, get: (id: string) => effects.find(entry => entry.id === id) },
    canUserModify: vi.fn(() => true),
    getFlag: (_scope: string, key: string) => source.flags?.[_scope]?.[key],
    setFlag: vi.fn(async (_scope: string, key: string, value: any) => { ((source.flags ??= {})[_scope] ??= {})[key] = structuredClone(value); }),
    toObject: () => ({ ...structuredClone(source), effects: effects.map(entry => entry.toObject(true)) }),
    createEmbeddedDocuments: vi.fn(async (_type: string, entries: any[]) => {
      const created = entries.map(entry => effect({ ...entry, _id: entry._id ?? `native-effect-${++count}` }, item));
      effects.push(...created); return created;
    }),
    deleteEmbeddedDocuments: vi.fn(async (_type: string, ids: string[]) => {
      for (const id of ids) { const index = effects.findIndex(entry => entry.id === id); if (index >= 0) effects.splice(index, 1); }
    }),
  };
  for (const entry of source.effects ?? []) effects.push(effect(entry, item));
  return item;
}
