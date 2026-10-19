import { afterEach, describe, expect, it, vi } from "vitest";
import { FoundryAttackRollMessageBridge, ATTACK_ROLL_CONTEXT_KEY } from "../../src/adapters/foundry/foundry-attack-roll-message-bridge";
import { loadAttackReference } from "./helpers/attack-reference";

const root = process.env.PARANORMAL_TOOLKIT_FOUNDRY_REFERENCE;
afterEach(() => vi.unstubAllGlobals());
describe.skipIf(!root)("native Foundry v14 Roll.toMessage attack publication", () => {
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
