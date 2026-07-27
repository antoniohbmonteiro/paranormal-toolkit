import { describe, expect, it } from "vitest";
import { mutateRitualChatCard, readRitualChatCard } from "../../../../../src/features/item-use/chat-card/item-use-chat-card-storage";
import type { RitualSingleTargetChatCardV2 } from "../../../../../src/features/item-use/chat-card/ritual/ritual-chat-card-state";

function card(): RitualSingleTargetChatCardV2 { return { schemaVersion: 2, kind: "ritual", renderer: "single-target", revision: 0, createdAt: 1, messageId: "m", state: { schemaVersion: 1, castId: "c", renderer: "single-target", source: { id: "a", uuid: null, name: "A" }, item: { id: "i", uuid: null, name: "I" }, form: { id: "base", label: "Padrão" }, cost: null, target: { id: "t", uuid: null, name: "T", tokenId: null, tokenUuid: null }, conjuration: null, mainRoll: null, resistance: null, actions: [], createdAt: 1 }, legacyFallback: { summaryLines: [], actions: [], itemName: "I", actorId: "a", itemId: "i" } }; }

describe("ritual chat card storage", () => {
  it("serializes concurrent mutations and increments revisions", async () => {
    let value: unknown = card();
    const message = { id: "m", getFlag: () => value, setFlag: async (_scope: string, _key: string, next: unknown) => { await Promise.resolve(); value = next; } };
    await Promise.all([mutateRitualChatCard(message, (current) => ({ ...current })), mutateRitualChatCard(message, (current) => ({ ...current }))]);
    expect(readRitualChatCard(message)?.revision).toBe(2);
  });
});
