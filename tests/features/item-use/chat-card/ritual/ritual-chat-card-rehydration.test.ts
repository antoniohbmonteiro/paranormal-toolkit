import { beforeEach, describe, expect, it, vi } from "vitest";
import { rehydrateRenderedToolkitChatCards } from "../../../../../src/features/item-use/item-use-automation-prompt";

function card(castId: string) { return { schemaVersion: 2, kind: "ritual", renderer: "single-target", revision: 0, createdAt: 1, messageId: `message-${castId}`, state: { schemaVersion: 1, castId, renderer: "single-target", source: { id: "s", uuid: null, name: "S" }, item: { id: "i", uuid: null, name: "I" }, target: { id: "t", uuid: null, name: "T", tokenId: null, tokenUuid: null }, form: { id: "base", label: "Padrão" }, descriptionHtml: null, cost: null, conjuration: null, mainRoll: null, resistance: null, actions: [], createdAt: 1 }, legacyFallback: { itemName: "I", summaryLines: [], actorId: "s", itemId: "i" } }; }
function root(messageId: string) { const value = { dataset: { messageId }, closest: () => value }; return value as unknown as HTMLElement; }

beforeEach(() => vi.stubGlobal("game", { messages: new Map() }));

describe("initial v2 chat-card rehydration", () => {
  it("rehydrates every rendered message independently without target interaction", () => {
    const first = { id: "message-one", getFlag: () => card("one") };
    const second = { id: "message-two", getFlag: () => card("two") };
    game.messages.set(first.id, first); game.messages.set(second.id, second);
    const render = vi.fn();
    rehydrateRenderedToolkitChatCards(async () => true, [root(first.id), root(second.id)], render);
    expect(render).toHaveBeenCalledTimes(2);
    expect(render.mock.calls.map(([message]) => message.id)).toEqual([first.id, second.id]);
    expect(first.getFlag().state.castId).toBe("one");
    expect(second.getFlag().state.castId).toBe("two");
  });
  it("continues to skip roots without a persisted toolkit card", () => {
    const empty = { id: "message-empty", getFlag: () => null };
    game.messages.set(empty.id, empty);
    const render = vi.fn();
    rehydrateRenderedToolkitChatCards(async () => true, [root(empty.id)], render);
    expect(render).not.toHaveBeenCalled();
  });
});
