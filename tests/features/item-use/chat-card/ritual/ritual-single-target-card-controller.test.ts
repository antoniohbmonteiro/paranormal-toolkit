import { beforeEach, describe, expect, it, vi } from "vitest";
import { executeRitualCardInteraction, type RitualCardActionExecutor } from "../../../../../src/features/item-use/chat-card/ritual/ritual-single-target-card-controller";
import type { ChatCardMessage } from "../../../../../src/features/item-use/chat-card/item-use-chat-card-storage";
import type { RitualCardAction, RitualSingleTargetChatCardV2 } from "../../../../../src/features/item-use/chat-card/ritual/ritual-chat-card-state";

function condition(id: string, outcome: "success" | "failure", state: RitualCardAction["state"] = "available"): RitualCardAction { return { id, kind: "condition-application", state, label: id, executedLabel: `✓ ${id}`, actor: { id: "target", uuid: null, name: "Alvo" }, choiceGroupId: null, outcome, completedAt: null, completedByUserId: null, conditionId: id, duration: null, source: null, originUuid: null }; }
function card(actions: RitualCardAction[] = []): RitualSingleTargetChatCardV2 { return { schemaVersion: 2, kind: "ritual", renderer: "single-target", revision: 0, createdAt: 1, messageId: "m", state: { schemaVersion: 1, castId: "c", renderer: "single-target", source: { id: "a", uuid: null, name: "A" }, item: { id: "i", uuid: null, name: "I" }, form: { id: "base", label: "Padrão" }, descriptionHtml: null, cost: null, target: { id: "t", uuid: null, name: "T", tokenId: null, tokenUuid: null }, conjuration: null, mainRoll: null, resistance: { skill: "will", skillLabel: "Vontade", difficulty: 15, effect: "Anula", status: "completed", result: { skill: "will", skillLabel: "Vontade", formula: "1d20", total: 20, diceResults: [20], difficulty: 15, outcome: "success", targetActorId: "t", targetActorUuid: null, targetName: "T", rolledAt: "now", userId: "gm", usedFallbackBonus: false } }, actions, createdAt: 1 }, legacyFallback: { summaryLines: [], itemName: "I", actorId: "a", itemId: "i" } }; }
function message(initial: RitualSingleTargetChatCardV2) { let value = initial; const document: ChatCardMessage = { id: "m", getFlag: () => value, setFlag: async (_scope, _key, next) => { value = next as RitualSingleTargetChatCardV2; } }; return { document, read: () => value }; }

beforeEach(() => { vi.stubGlobal("game", { user: { id: "gm" } }); vi.stubGlobal("ui", { notifications: { warn: vi.fn() } }); });

describe("single target ritual controller", () => {
  it("claims all available outcome conditions and applies them once", async () => {
    const store = message(card([condition("one", "success"), condition("two", "success"), condition("other", "failure", "resolved")]));
    const calls: string[] = [];
    const executor: RitualCardActionExecutor = async ({ action }) => { calls.push(action!.id); return { ok: true }; };
    await executeRitualCardInteraction({ message: store.document, actionId: "resistance-outcome-conditions", kind: "apply-resistance-outcome-conditions", executor });
    expect(calls).toEqual(["one", "two"]);
    expect(store.read().state.actions.map((action) => action.state)).toEqual(["completed", "completed", "resolved"]);
    await executeRitualCardInteraction({ message: store.document, actionId: "resistance-outcome-conditions", kind: "apply-resistance-outcome-conditions", executor });
    expect(calls).toEqual(["one", "two"]);
  });
  it("persists partial success and retries only available conditions", async () => {
    const store = message(card([condition("one", "success"), condition("two", "success")]));
    const calls: string[] = [];
    let failTwo = true;
    const executor: RitualCardActionExecutor = async ({ action }) => { calls.push(action!.id); return action!.id === "two" && failTwo ? { ok: false, sideEffect: "none", message: "falhou" } : { ok: true }; };
    await executeRitualCardInteraction({ message: store.document, actionId: "resistance-outcome-conditions", kind: "apply-resistance-outcome-conditions", executor });
    expect(store.read().state.actions.map((action) => action.state)).toEqual(["completed", "available"]);
    failTwo = false;
    await executeRitualCardInteraction({ message: store.document, actionId: "resistance-outcome-conditions", kind: "apply-resistance-outcome-conditions", executor });
    expect(calls).toEqual(["one", "two", "two"]);
    expect(store.read().state.actions.map((action) => action.state)).toEqual(["completed", "completed"]);
  });
  it("rolls resistance once and resolves the opposite branch", async () => {
    const initial = card([condition("success", "success", "pending"), condition("failure", "failure", "pending")]);
    initial.state.resistance!.status = "pending"; initial.state.resistance!.result = null;
    const store = message(initial); const executor = vi.fn(async () => ({ ok: true as const, resistance: { skill: "will", skillLabel: "Vontade", formula: "1d20", total: 18, diceResults: [18], difficulty: 15, outcome: "success" as const, targetActorId: "t", targetActorUuid: null, targetName: "T", rolledAt: "now", userId: "gm", usedFallbackBonus: false } }));
    await executeRitualCardInteraction({ message: store.document, actionId: "c:resistance", kind: "roll-resistance", executor });
    await executeRitualCardInteraction({ message: store.document, actionId: "c:resistance", kind: "roll-resistance", executor });
    expect(executor).toHaveBeenCalledTimes(1);
    expect(store.read().state.actions.map((action) => action.state)).toEqual(["available", "resolved"]);
  });
  it("returns failures before side effects to available and marks thrown execution uncertain", async () => {
    const safe = message(card([condition("safe", "success")]));
    await executeRitualCardInteraction({ message: safe.document, actionId: "safe", kind: "apply-condition", executor: async () => ({ ok: false, sideEffect: "none", message: "não aplicado" }) });
    expect(safe.read().state.actions[0]?.state).toBe("available");
    const uncertain = message(card([condition("uncertain", "success")]));
    await executeRitualCardInteraction({ message: uncertain.document, actionId: "uncertain", kind: "apply-condition", executor: async () => { throw new Error("serviço interrompido"); } });
    expect(uncertain.read().state.actions[0]?.state).toBe("uncertain");
  });
  it("prevents duplicate execution after the persisted claim", async () => {
    const store = message(card([condition("one", "success")])); let release!: () => void; const gate = new Promise<void>((resolve) => { release = resolve; });
    const executor = vi.fn(async () => { await gate; return { ok: true as const }; });
    const first = executeRitualCardInteraction({ message: store.document, actionId: "one", kind: "apply-condition", executor });
    await Promise.resolve(); await Promise.resolve();
    const second = executeRitualCardInteraction({ message: store.document, actionId: "one", kind: "apply-condition", executor });
    release(); await Promise.all([first, second]);
    expect(executor).toHaveBeenCalledTimes(1);
  });
});
