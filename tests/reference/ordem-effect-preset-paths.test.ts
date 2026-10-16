import { readFileSync } from "node:fs";
import { join } from "node:path";
import { runInNewContext } from "node:vm";
import ts from "typescript";
import { beforeAll, describe, expect, it } from "vitest";
import { ORDEM_AGENT_SKILLS } from "../../src/adapters/ordem/ordem-agent-skills";
import { ORDEM_AGENT_BONUS_PATHS } from "../../src/adapters/ordem/ordem-paths";

const referenceRoot = process.env.PARANORMAL_TOOLKIT_ORDEM_REFERENCE;

// Same loading strategy as ordem-ally-compatibility: real Ordem methods, Foundry replaced by doubles.
// It proves how the system consumes the preset fields, not the Foundry Active Effect application itself.
function loadReference(relativePath: string, globals: Record<string, unknown>, dependencies = {}): any {
  const filename = join(referenceRoot!, relativePath);
  const compiled = ts.transpileModule(readFileSync(filename, "utf8"), {
    compilerOptions: { module: ts.ModuleKind.CommonJS, target: ts.ScriptTarget.ES2022 }, fileName: filename + ".ts",
  }).outputText;
  const exports = {};
  runInNewContext(compiled, { exports, ...globals, require: (name: string) => {
    if (!(name in dependencies)) throw new Error(`Unexpected reference dependency: ${name}`);
    return (dependencies as Record<string, unknown>)[name];
  } }, { filename, timeout: 1000 });
  return exports;
}

class AgentDouble {
  type = "agent";
  items: unknown[] = [];
  constructor(public system: any, public itemTypes: { class: { system: Record<string, unknown> }[] }) {}
  prepareDerivedData() {}
}

function agentSystem(overrides: Record<string, unknown> = {}) {
  return {
    disableCalculations: false, _progress: 3,
    attributes: { vit: { value: 2 }, pre: { value: 2 }, dex: { value: 2 }, str: { value: 1 } },
    PV: { value: 1, max: 10 }, PE: { value: 1, max: 5 }, PD: { value: 1, max: 5 }, SAN: { value: 1, max: 5 },
    defense: { value: 10 }, desloc: { value: 9 }, spaces: {},
    skills: { reflexes: { degree: { value: 0 }, mod: 0 } },
    ...overrides,
  };
}
const classStats = { system: { hpInitial: 20, hpPerLevel: 4, peInitial: 2, pePerLevel: 2, sanInitial: 12, sanPerLevel: 3 } };

describe.skipIf(!referenceRoot)("Ordem fields targeted by passive benefit presets (real sources, Foundry doubles)", () => {
  let OrdemActor: any;
  let agentDataSource: string;
  beforeAll(() => {
    const globals = { Actor: AgentDouble, game: { release: { generation: 14 }, settings: { get: () => false } }, console,
      ui: { notifications: { warn: () => {} } } };
    const helpers = loadReference("module/helpers/actor-calculations.mjs", globals);
    const unrelatedClass = { default: class {} };
    ({ OrdemActor } = loadReference("module/documents/actor.mjs", globals, {
      "../helpers/actor-calculations.mjs": helpers,
      "../dice/basic-roll.mjs": unrelatedClass,
      "../applications/skill-tool-configuration-dialog.mjs": unrelatedClass,
      "../applications/attribute-configuration-dialog.mjs": unrelatedClass,
    }));
    agentDataSource = readFileSync(join(referenceRoot!, "module/data/actors/agent-data.mjs"), "utf8");
  });

  it("adds PV/PE/PD bonus fields to the derived maxima while class calculations are active", () => {
    const base = new OrdemActor(agentSystem(), { class: [classStats] });
    base._calculateMaxHP();
    const boosted = new OrdemActor(agentSystem({ PV: { value: 1, max: 10, bonus: 5 }, PE: { value: 1, max: 5, bonus: 2 },
      PD: { value: 1, max: 5, bonus: 1 } }), { class: [classStats] });
    boosted._calculateMaxHP();
    expect(boosted.system.PV.max - base.system.PV.max).toBe(5);
    expect(boosted.system.PE.max - base.system.PE.max).toBe(2);
    expect(boosted.system.PD.max - base.system.PD.max).toBe(1);
  });

  it.each([
    ["without a class item", agentSystem({ PV: { value: 1, max: 10, bonus: 5 } }), []],
    ["with calculations disabled", agentSystem({ disableCalculations: true, PV: { value: 1, max: 10, bonus: 5 } }), [classStats]],
  ])("documents that resource bonuses have no effect %s", (_label, system, classes) => {
    const actor = new OrdemActor(system, { class: classes });
    actor._calculateMaxHP();
    expect(actor.system.PV.max).toBe(10);
  });

  it("keeps initial-phase Defense and Deslocamento bonuses through the derived agent calculations", () => {
    const actor = new OrdemActor(agentSystem({ defense: { value: 10 + 5 }, desloc: { value: 9 + 3 } }), { class: [] });
    actor.prepareDerivedData();
    expect(actor.system.defense.value).toBe(10 + 5 + 2);
    expect(actor.system.defense.dodge).toBe(10 + 5 + 2);
    expect(actor.system.desloc.value).toBe(12);
  });

  it("declares every preset skill and the targeted value fields in the AgentData schema", () => {
    for (const skill of ORDEM_AGENT_SKILLS) expect(agentDataSource).toMatch(new RegExp(`\\b${skill.id}: agentSkillField\\(`));
    expect(agentDataSource).toMatch(/function agentSkillField[\s\S]*?value: new fields\.NumberField\(\{ required: true, integer: true/);
    expect(agentDataSource).toMatch(/defense: new fields\.SchemaField\(\{\s*value: new fields\.NumberField/);
    expect(agentDataSource).toMatch(/desloc: new fields\.SchemaField\(\{\s*value: new fields\.NumberField/);
    expect(ORDEM_AGENT_BONUS_PATHS.skill("occultism")).toBe("system.skills.occultism.value");
  });

  it("feeds the skill value field into the native skill roll", () => {
    const actorSource = readFileSync(join(referenceRoot!, "module/documents/actor.mjs"), "utf8");
    expect(actorSource).toMatch(/extraBonus:\s*skill\.value/);
  });
});
