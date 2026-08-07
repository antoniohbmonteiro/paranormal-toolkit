import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";
import {
  AbilityUseChatCardService,
  renderPersistedAbilityCard,
} from "../../../../src/features/abilities/ability-use-chat-card-service";
import type { AbilityUseCardState } from "../../../../src/features/abilities/ability-use-card-state";
import type { ItemUseContext } from "../../../../src/features/item-use/item-use-context";

function state(): AbilityUseCardState {
  return {
    schemaVersion: 2,
    ability: {
      name: "Premonição",
      image: null,
      descriptionHtml: "<p>Visão segura</p>",
      activationLabel: "Livre",
    },
    actor: { id: "a", uuid: "Actor.a", name: "Agente" },
    item: { id: "i", uuid: "Actor.a.Item.i", name: "Premonição" },
    resource: {
      type: "PE",
      cost: 2,
      passive: false,
      spent: true,
      before: 5,
      after: 3,
    },
    rolls: [
      {
        id: "damage",
        sourceRollId: "damage",
        label: "Ataque psíquico",
        intent: "damage",
        damageType: "fear",
        formula: "2d6",
        total: 7,
        diceResults: [3, 4],
        nexThreshold: 40,
      },
    ],
    targets: [],
    actions: [],
    createdAt: 1,
  };
}

function context(message?: unknown): ItemUseContext {
  return {
    source: "ordem-item-used-hook",
    actor: { id: "a", name: "Agente" } as Actor,
    item: { id: "i", name: "Premonição" } as Item,
    token: null,
    targets: [],
    message,
  };
}

function setCardMode(mode: "keep" | "replace"): void {
  vi.stubGlobal("game", { settings: { get: () => mode } });
}

beforeEach(() => {
  vi.stubGlobal("ChatMessage", {
    getSpeaker: vi.fn(() => ({ alias: "Agente" })),
    create: vi.fn().mockResolvedValue({}),
  });
  vi.stubGlobal("document", {
    createElement: () => ({ innerHTML: "", outerHTML: "" }),
  });
});

afterEach(() => {
  vi.unstubAllGlobals();
  vi.restoreAllMocks();
});

describe("AbilityUseChatCardService", () => {
  it("updates content and v3 flag together in replace mode", async () => {
    setCardMode("replace");
    const update = vi.fn().mockResolvedValue(undefined);

    await new AbilityUseChatCardService().publish(context({ update }), state());

    expect(update).toHaveBeenCalledOnce();
    expect(update).toHaveBeenCalledWith(
      expect.objectContaining({
        content: expect.stringContaining("Visão segura"),
        flags: {
          "paranormal-toolkit": {
            abilityUse: { version: 3, revision: 0, state: state() },
          },
        },
      }),
    );
    expect(ChatMessage.create).not.toHaveBeenCalled();
  });

  it("creates one new message with content and flag together", async () => {
    setCardMode("keep");

    await new AbilityUseChatCardService().publish(context(), state());

    expect(ChatMessage.create).toHaveBeenCalledOnce();
    expect(ChatMessage.create).toHaveBeenCalledWith(
      expect.objectContaining({
        content: expect.stringContaining("Premonição"),
        flags: {
          "paranormal-toolkit": {
            abilityUse: { version: 3, revision: 0, state: state() },
          },
        },
      }),
    );
  });

  it("rehydrates exclusively from a valid v3 flag", () => {
    setCardMode("replace");
    const replaceChildren = vi.fn();
    const host = {
      classList: { contains: () => true },
      querySelector: () => null,
      replaceChildren,
      append: vi.fn(),
    } as unknown as HTMLElement;
    const message = {
      getFlag: vi.fn(() => ({ version: 3, revision: 0, state: state() })),
    };

    expect(renderPersistedAbilityCard(message, host)).toBe(true);
    expect(message.getFlag).toHaveBeenCalledWith(
      "paranormal-toolkit",
      "abilityUse",
    );
    expect(replaceChildren).toHaveBeenCalledOnce();
    const wrapper = replaceChildren.mock.calls[0]?.[0] as { innerHTML: string };
    expect(wrapper.innerHTML).toContain("Premonição");
    expect(wrapper.innerHTML).toContain("Visão segura");
    expect(wrapper.innerHTML).toContain(
      'section-header__title">Ataque psíquico',
    );
    expect(wrapper.innerHTML).toContain("damage-type-badge--fear");
    expect(wrapper.innerHTML).not.toContain("5 → 3");
  });

  it("preserves existing content when a v3 flag is invalid", () => {
    setCardMode("replace");
    const replaceChildren = vi.fn();
    const host = {
      classList: { contains: () => true },
      querySelector: () => null,
      replaceChildren,
      append: vi.fn(),
    } as unknown as HTMLElement;
    const warn = vi.spyOn(console, "warn").mockImplementation(() => undefined);

    const rendered = renderPersistedAbilityCard(
      { getFlag: () => ({ version: 3, state: { schemaVersion: 1 } }) },
      host,
    );

    expect(rendered).toBe(false);
    expect(replaceChildren).not.toHaveBeenCalled();
    expect(warn).toHaveBeenCalled();
  });

  it("rehydrates schema 1 in memory without rewriting the message", () => {
    setCardMode("replace");
    const legacyState = state() as unknown as Record<string, unknown>;
    legacyState.schemaVersion = 1;
    delete legacyState.targets;
    delete legacyState.actions;
    const setFlag = vi.fn();
    const update = vi.fn();
    const replaceChildren = vi.fn();
    const host = {
      classList: { contains: () => true },
      querySelector: () => null,
      replaceChildren,
      append: vi.fn(),
    } as unknown as HTMLElement;

    expect(renderPersistedAbilityCard({
      getFlag: () => ({ version: 3, state: legacyState }),
      setFlag,
      update,
    }, host)).toBe(true);
    expect(replaceChildren).toHaveBeenCalledOnce();
    expect(setFlag).not.toHaveBeenCalled();
    expect(update).not.toHaveBeenCalled();
  });
});
