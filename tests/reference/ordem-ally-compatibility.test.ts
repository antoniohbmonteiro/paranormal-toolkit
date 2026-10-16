import { readFileSync } from "node:fs";
import { join } from "node:path";
import { runInNewContext } from "node:vm";
import ts from "typescript";
import { beforeAll, describe, expect, it } from "vitest";
import { createAllyProfile } from "../../src/core/allies/ally-profile";

const referenceRoot = process.env.PARANORMAL_TOOLKIT_ORDEM_REFERENCE;

// Uses the real reference methods, but substitutes Foundry and unrelated roll/dialog dependencies.
// It checks source compatibility, not the Foundry preparation cycle or server persistence.
function loadReference(relativePath: string, globals: Record<string, unknown>, dependencies = {}): any {
  const filename = join(referenceRoot!, relativePath);
  const source = readFileSync(filename, "utf8");
  const compiled = ts.transpileModule(source, {
    compilerOptions: { module: ts.ModuleKind.CommonJS, target: ts.ScriptTarget.ES2022 },
    fileName: filename + ".ts",
  }).outputText;
  const exports = {};
  runInNewContext(compiled, {
    exports, ...globals,
    require: (name: string) => {
      if (!(name in dependencies)) throw new Error(`Unexpected reference dependency: ${name}`);
      return (dependencies as Record<string, unknown>)[name];
    },
  }, { filename, timeout: 1000 });
  return exports;
}

class NativeActorDouble {
  type = "paranormal-toolkit.ally";
  system: Record<string, unknown> = createAllyProfile();
  items: unknown[] = [];
  phases: string[] = [];
  basePreparations = 0;
  derivedPreparations = 0;
  prepareData() {
    this.prepareBaseData();
    this.applyActiveEffects("initial");
    this.prepareDerivedData();
    this.applyActiveEffects("final");
  }
  prepareBaseData() { this.basePreparations++; }
  prepareDerivedData() { this.derivedPreparations++; }
  applyActiveEffects(phase: string) { this.phases.push(phase); }
  getRollData() { return structuredClone(this.system); }
  *allApplicableEffects() {}
}

describe.skipIf(!referenceRoot)("ally compatibility with real Ordem sources (Foundry doubles)", () => {
  let OrdemActor: any;
  let migrateActorData: any;
  let systemVersion: string;
  beforeAll(() => {
    systemVersion = JSON.parse(readFileSync(join(referenceRoot!, "system.json"), "utf8")).version;
    const utils = {
      isNewerVersion: (left: string, right: string | undefined) => {
        const a = left.split(".").map(Number);
        const b = (right ?? "0").split(".").map(Number);
        for (let i = 0; i < Math.max(a.length, b.length); i++) {
          if ((a[i] ?? 0) !== (b[i] ?? 0)) return (a[i] ?? 0) > (b[i] ?? 0);
        }
        return false;
      },
      isEmpty: (value: object) => Object.keys(value).length === 0,
    };
    const globals = {
      Actor: NativeActorDouble, structuredClone,
      game: { release: { generation: 14 }, settings: { get: () => false } },
      foundry: { utils, dice: { terms: { Die: class {
        number: number; faces: number; options = {};
        modifiers = Object.assign([] as string[], { findSplice(predicate: (value: string) => boolean) {
          const index = this.findIndex(predicate); if (index >= 0) this.splice(index, 1);
        } });
        constructor({ number, faces }: { number: number; faces: number }) { this.number = number; this.faces = faces; }
      } } } }, console,
    };
    const helpers = loadReference("module/helpers/actor-calculations.mjs", globals);
    const unrelatedClass = { default: class {} };
    ({ OrdemActor } = loadReference("module/documents/actor.mjs", globals, {
      "../helpers/actor-calculations.mjs": helpers,
      "../dice/basic-roll.mjs": unrelatedClass,
      "../applications/skill-tool-configuration-dialog.mjs": unrelatedClass,
      "../applications/attribute-configuration-dialog.mjs": unrelatedClass,
    }));
    ({ migrateActorData } = loadReference("module/migrations.mjs", globals));
  });

  it("prepares an ally repeatedly without calling agent inventory, defense or HP calculations", () => {
    const actor = new OrdemActor();
    for (const method of ["_prepareItemsDerivedData", "_prepareActorSpaces", "_calculateMaxHP"]) {
      actor[method] = () => { throw new Error(`Unexpected agent preparation: ${method}`); };
    }
    actor.prepareData();
    actor.prepareData();
    expect(actor.system).toEqual(createAllyProfile());
    expect(actor.basePreparations).toBe(2);
    expect(actor.derivedPreparations).toBe(2);
    expect(actor.phases).toEqual(["initial", "final", "initial", "final"]);
  });

  it("obtains roll data without requiring agent fields or changing the profile", () => {
    const actor = new OrdemActor();
    expect(actor.getRollData().rollInitiative).toBe("2d20kl + 0");
    expect(actor.getRollData().PE).toBeUndefined();
    expect(actor.system).toEqual(createAllyProfile());
  });

  it("does not patch current-version ally snapshots in the real migration function", async () => {
    const source = { type: "paranormal-toolkit.ally", system: createAllyProfile(), _stats: { systemVersion } };
    const before = structuredClone(source);
    expect(await migrateActorData({ items: [] }, source, {}, {})).toEqual({});
    expect(source).toEqual(before);
  });

  it("documents the legacy migration failure for an ally snapshot older than 6.9.2", async () => {
    const source = { system: createAllyProfile(), _stats: { systemVersion: "6.8.0" } };
    await expect(migrateActorData({ items: [] }, source, {}, {}))
      .rejects.toThrow(/Cannot convert undefined or null to object/);
    expect(source.system).toEqual(createAllyProfile());
  });

  it("documents that forcing legacy migrations also fails without skills", async () => {
    const source = { system: createAllyProfile(), _stats: { systemVersion } };
    await expect(migrateActorData({ items: [] }, source, {}, { bypassVersionCheck: true }))
      .rejects.toThrow(/Cannot convert undefined or null to object/);
  });
});
