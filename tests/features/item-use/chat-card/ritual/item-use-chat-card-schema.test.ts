import { describe, expect, it } from "vitest";
import { normalizeRitualSingleTargetChatCard, readSafeLegacyFallback } from "../../../../../src/features/item-use/chat-card/item-use-chat-card-schema";

describe("ritual card schema normalization", () => {
  it("rejects superficially v2 but corrupted state", () => {
    expect(normalizeRitualSingleTargetChatCard({ schemaVersion: 2, kind: "ritual", renderer: "single-target", revision: 0, createdAt: 1, messageId: "m", state: { renderer: "single-target", actions: [] } })).toBeNull();
  });
  it("tolerates absent and partial legacy fallback", () => {
    expect(readSafeLegacyFallback({ schemaVersion: 2 })).toBeNull();
    expect(readSafeLegacyFallback({ legacyFallback: { itemName: "Ritual" } })).toEqual({ itemName: "Ritual", summaryLines: [] });
    expect(readSafeLegacyFallback({ legacyFallback: { summaryLines: ["linha", 3] } })).toEqual({ itemName: "Ritual", summaryLines: ["linha"] });
  });
  it("recovers interrupted executing markers as uncertain instead of leaving permanent locks", () => {
    const action = { id: "a", kind: "condition-application", state: "executing", label: "A", executedLabel: "A", actor: { id: "t", uuid: null, name: "T" }, choiceGroupId: null, outcome: null, completedAt: null, completedByUserId: null, conditionId: "a", duration: null, source: null, originUuid: null };
    const raw = { schemaVersion: 2, kind: "ritual", renderer: "single-target", revision: 1, createdAt: 1, messageId: "m", state: { schemaVersion: 1, castId: "c", renderer: "single-target", source: { id: "s", uuid: null, name: "S" }, item: { id: "i", uuid: null, name: "I" }, target: { id: "t", uuid: null, name: "T" }, form: { id: "base", label: "Padrão" }, descriptionHtml: null, cost: null, conjuration: null, mainRoll: null, resistance: null, actions: [action], createdAt: 1 }, legacyFallback: { itemName: "I", summaryLines: [] } };
    expect(normalizeRitualSingleTargetChatCard(raw)?.state.actions[0]?.state).toBe("uncertain");
  });
  it("accepts a persisted targetless utility state", () => {
    const raw = { schemaVersion: 2, kind: "ritual", renderer: "single-target", revision: 0, createdAt: 1, messageId: "m", state: { schemaVersion: 1, castId: "utility", renderer: "single-target", source: { id: "s", uuid: null, name: "S" }, item: { id: "i", uuid: null, name: "I" }, target: null, form: { id: "base", label: "Padrão" }, ritualIdentity: { elementKey: "energy", elementLabel: "Energia", circle: 1 }, descriptionHtml: null, cost: null, conjuration: null, mainRoll: { id: "r", label: "Efeito", intent: "utility", formula: "1d20", total: 10, diceResults: [10], damageType: null }, resistance: null, actions: [], createdAt: 1 }, legacyFallback: { itemName: "I", summaryLines: [] } };
    expect(normalizeRitualSingleTargetChatCard(raw)?.state).toMatchObject({ target: null, ritualIdentity: { elementLabel: "Energia", circle: 1 } });
  });
});
