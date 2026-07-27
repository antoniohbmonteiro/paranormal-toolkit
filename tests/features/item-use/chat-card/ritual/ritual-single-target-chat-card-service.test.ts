import { beforeEach, describe, expect, it, vi } from "vitest";
import { renderPersistedRitualCard } from "../../../../../src/features/item-use/chat-card/ritual/ritual-single-target-chat-card-service";

class FakeElement {
  dataset: Record<string, string> = {}; innerHTML = ""; parentElement: FakeElement | null = null; children: FakeElement[] = [];
  classList = { contains: (name: string) => name === "message-content", add: vi.fn() };
  querySelector(selector: string): FakeElement | null { return selector.includes("card-renderer") ? this.children.find((child) => child.dataset.paranormalToolkitCardRenderer === "ritual-single-target") ?? null : null; }
  append(child: FakeElement) { child.parentElement = this; this.children.push(child); }
  replaceChildren(child: FakeElement) { child.parentElement = this; this.children = [child]; }
}
function validCard() { return { schemaVersion: 2, kind: "ritual", renderer: "single-target", revision: 0, createdAt: 1, messageId: "m", state: { schemaVersion: 1, castId: "c", renderer: "single-target", source: { id: "s", uuid: null, name: "S" }, item: { id: "i", uuid: null, name: "I" }, target: { id: "t", uuid: null, name: "T", tokenId: null, tokenUuid: null }, form: { id: "base", label: "Padrão" }, descriptionHtml: null, cost: null, conjuration: null, mainRoll: null, resistance: null, actions: [], createdAt: 1 }, legacyFallback: { itemName: "I", summaryLines: [], actorId: "s", itemId: "i" } }; }

beforeEach(() => {
  vi.stubGlobal("document", { createElement: () => new FakeElement() });
  vi.stubGlobal("game", { settings: { get: vi.fn((_scope: string, key: string) => key === "itemUse.systemCardMode" ? "keep" : "legacy") } });
});

describe("persisted ritual card renderer", () => {
  it("keeps persisted v2 rendering deterministic after the global ritual setting becomes legacy", () => {
    const root = new FakeElement(); const value = validCard(); const message = { id: "m", getFlag: () => value };
    expect(renderPersistedRitualCard(message, root as unknown as HTMLElement)).toBe(true);
    expect(root.children).toHaveLength(1);
    expect(root.children[0]?.innerHTML).toContain("paranormal-toolkit-ritual-single-target-card");
  });
  it("does not duplicate its section in keep mode", () => {
    const root = new FakeElement(); const message = { id: "m", getFlag: () => validCard() };
    renderPersistedRitualCard(message, root as unknown as HTMLElement);
    renderPersistedRitualCard(message, root as unknown as HTMLElement);
    expect(root.children).toHaveLength(1);
  });
  it("replaces existing visual content only in replace mode", () => {
    vi.mocked(game.settings.get).mockImplementation((_scope: string, key: string) => key === "itemUse.systemCardMode" ? "replace" : "legacy");
    const root = new FakeElement(); root.append(new FakeElement());
    renderPersistedRitualCard({ id: "m", getFlag: () => validCard() }, root as unknown as HTMLElement);
    expect(root.children).toHaveLength(1);
    expect(root.children[0]?.dataset.paranormalToolkitCardRenderer).toBe("ritual-single-target");
  });
  it("preserves original content for corrupt v2 without safe fallback", () => {
    const root = new FakeElement(); root.innerHTML = "original";
    expect(renderPersistedRitualCard({ id: "m", getFlag: () => ({ schemaVersion: 2, kind: "ritual", renderer: "single-target" }) }, root as unknown as HTMLElement)).toBe(false);
    expect(root.innerHTML).toBe("original"); expect(root.children).toHaveLength(0);
  });
  it("renders a non-executable partial fallback safely", () => {
    const root = new FakeElement();
    const raw = { schemaVersion: 2, kind: "ritual", renderer: "single-target", legacyFallback: { itemName: "I", summaryLines: ["Linha"] } };
    expect(renderPersistedRitualCard({ id: "m", getFlag: () => raw }, root as unknown as HTMLElement)).toBe(true);
    expect(root.children[0]?.innerHTML).toContain("Linha");
    expect(root.children[0]?.innerHTML).not.toContain("data-paranormal-toolkit-card-action");
  });
});
