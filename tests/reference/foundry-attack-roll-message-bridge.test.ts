import { afterEach, describe, expect, it, vi } from "vitest";
import { FoundryAttackRollMessageBridge, ATTACK_ROLL_CONTEXT_KEY } from "../../src/adapters/foundry/foundry-attack-roll-message-bridge";
import { loadAttackReference } from "./helpers/attack-reference";
import { OrdemAttackAdapter } from "../../src/adapters/ordem/attacks/ordem-attack-adapter";

const root = process.env.PARANORMAL_TOOLKIT_FOUNDRY_REFERENCE;
afterEach(() => vi.unstubAllGlobals());
describe.skipIf(!root)("native Foundry v14 Roll.toMessage attack publication", () => {
  it.each([[3, "kh", -1, [20, 5], 30, 2, "kh"], [1, "kh", -1, [20, 5], 15, 2, "kl"],
    [2, "kl", -1, [20, 5, 2], 12, 3, "kl"], [2, "kl", 2, [20, 5], 30, 2, "kh"],
    [2, "kl", 1, [8], 18, 1, "kh"], [3, "kl", 1, [20, 5], 15, 2, "kl"],
    [1, "kh", 1, [20, 5], 30, 2, "kh"]])("prepares native %i d20 %s once before real evaluation", async (number, mode, modifier, results, total, count, keep) => {
    const queue = [...results as number[]], draws = vi.fn(() => queue.shift());
    const math = Object.assign(Object.create(Math), { clamp: (n: number, min: number, max: number) => Math.min(max, Math.max(min, n)) });
    const CONFIG: any = { debug: { dice: false }, Dice: { fulfillment: { defaultMethod: "digital", methods: { digital: { handler: draws } } },
      parser: { toAST: ([die, , bonus]: any[]) => ({ class: "Node", operator: "+", operands: [die, bonus] }) } } };
    const globals: any = { CONFIG, Math: math, game: { settings: { get: () => ({}) } }, foundry: { dice: { terms: {} } } };
    const moduleOf = (value: any) => ({ __esModule: true, default: value });
    const NativeRoll = loadAttackReference(root!, "client/dice/roll.mjs", globals).default;
    const RollTerm = loadAttackReference(root!, "client/dice/terms/term.mjs", globals, {
      "../roll.mjs": moduleOf(NativeRoll), "@common/utils/_module.mjs": { deepClone: structuredClone },
    }).default;
    const DiceTerm = loadAttackReference(root!, "client/dice/terms/dice.mjs", globals, {
      "../roll.mjs": moduleOf(NativeRoll), "./term.mjs": moduleOf(RollTerm),
    }).default;
    const Die = loadAttackReference(root!, "client/dice/terms/die.mjs", globals, { "./dice.mjs": moduleOf(DiceTerm) }).default;
    const dependencies = { "./term.mjs": moduleOf(RollTerm) };
    const NumericTerm = loadAttackReference(root!, "client/dice/terms/numeric.mjs", globals, dependencies).default;
    const OperatorTerm = loadAttackReference(root!, "client/dice/terms/operator.mjs", globals, dependencies).default;
    Object.assign(globals.foundry.dice.terms, { Die, DiceTerm, RollTerm, NumericTerm, OperatorTerm });
    vi.stubGlobal("Roll", NativeRoll);
    const bridge = new FoundryAttackRollMessageBridge(); bridge.install();
    const adapter = new OrdemAttackAdapter(), prepare = vi.fn((roll: any) => adapter.prepareAttackRoll(roll, Number(modifier)));
    const release = bridge.register("native", { prepare, publish: vi.fn() });
    // Parsing is supplied as terms; evaluation, dice, keep rules and formula rebuilding are native v14.
    const roll = Object.assign(Object.create(NativeRoll.prototype), { _evaluated: false, data: { [ATTACK_ROLL_CONTEXT_KEY]: "native" }, options: {},
      terms: [new Die({ number, faces: 20, modifiers: [mode] }), new OperatorTerm({ operator: "+" }), new NumericTerm({ number: 10 })] });
    roll.resetFormula();
    expect(await roll.evaluate({ allowInteractive: false })).toBe(roll);
    expect(roll.total).toBe(total); expect(roll.formula.replaceAll(" ", "")).toBe(count + "d20" + keep + "+10");
    expect(draws).toHaveBeenCalledTimes(Number(count)); expect(prepare).toHaveBeenCalledOnce();
    await expect(roll.evaluate()).rejects.toThrow("already"); expect(prepare).toHaveBeenCalledOnce();
    release();
  });
  it("isolates registrations, releases callbacks and fails before evaluating an unsupported pool", async () => {
    class TestRoll {
      _evaluated = false; formula = ""; total = 0;
      async evaluate() { this._evaluated = true; return this; }
      async toMessage() {}
    }
    const evaluate = vi.spyOn(TestRoll.prototype, "evaluate");
    vi.stubGlobal("Roll", TestRoll);
    const bridge = new FoundryAttackRollMessageBridge(); bridge.install();
    const first = vi.fn(), second = vi.fn();
    const release = bridge.register("first", { prepare: first, publish: vi.fn() });
    bridge.register("second", { prepare: second, publish: vi.fn() });
    const invoke = (id: string) => (TestRoll.prototype as any).evaluate.call({ data: { [ATTACK_ROLL_CONTEXT_KEY]: id } });
    await Promise.all([invoke("first"), invoke("second"), invoke("external")]);
    expect(first).toHaveBeenCalledOnce(); expect(second).toHaveBeenCalledOnce();
    release(); await invoke("first"); expect(first).toHaveBeenCalledOnce();
    bridge.register("invalid", { prepare: () => { throw new Error("Unsupported pool"); }, publish: vi.fn() });
    const count = evaluate.mock.calls.length;
    expect(() => invoke("invalid")).toThrow("Unsupported pool"); expect(evaluate).toHaveBeenCalledTimes(count);
  });
  it("injects flags into the same native message and preserves identity and mode without reevaluation", async () => {
    const created: any[] = [];
    class Message {
      id = "native-message"; mode = "";
      constructor(public data: any) {}
      applyMode(mode: string) { this.mode = mode; }
      static async create(message: Message) { created.push(message); return message; }
    }
    const globals = { game: { user: { id: "player" }, settings: { get: () => "public" } },
      CONFIG: { sounds: { dice: "dice" } },
      foundry: { utils: { getDocumentClass: () => Message, mergeObject: (a: any, b: any) => ({ ...a, ...b }) } } };
    const { default: NativeRoll } = loadAttackReference(root!, "client/dice/roll.mjs", globals);
    vi.stubGlobal("Roll", NativeRoll);
    const bridge = new FoundryAttackRollMessageBridge(); bridge.install();
    const roll = { _evaluated: true, total: 18, data: { [ATTACK_ROLL_CONTEXT_KEY]: "execution" }, evaluate: vi.fn() };
    const release = bridge.register("execution", { publish: async (_roll, data, send) => send({
      ...data, flags: { "paranormal-toolkit": { attackExecution: { executionId: "execution" } } },
    }) });
    const result = await NativeRoll.prototype.toMessage.call(roll, { speaker: { actor: "actor" } }, { messageMode: "blind" });
    expect(result.id).toBe("native-message"); expect(result.mode).toBe("blind");
    expect(result.data.rolls[0]).toBe(roll);
    expect(result.data.speaker).toEqual({ actor: "actor" });
    expect(result.data.author).toBe("player");
    expect(result.data.flags["paranormal-toolkit"].attackExecution.executionId).toBe("execution");
    expect(roll.evaluate).not.toHaveBeenCalled(); expect(created).toHaveLength(1);
    release();
    const ordinary = await NativeRoll.prototype.toMessage.call(roll, {}, { messageMode: "self" });
    expect(ordinary.data.flags).toBeUndefined(); expect(ordinary.mode).toBe("self");
  });
});
