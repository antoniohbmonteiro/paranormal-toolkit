import { afterEach, describe, expect, it, vi } from "vitest";
import { readCastingDifficulty } from "../../../../src/features/item-use/chat-card/item-use-card-roll-context";

const PROMPT_ID_ATTRIBUTE = "data-paranormal-toolkit-prompt-id";

function createRollCardStub(): HTMLElement {
  const promptElement = {
    getAttribute: (name: string) => name === PROMPT_ID_ATTRIBUTE ? "prompt-a" : null,
  };
  const messageElement = {
    dataset: { messageId: "message-a" },
  };

  return {
    closest: vi.fn((selector: string) => {
      if (selector.includes(PROMPT_ID_ATTRIBUTE)) return promptElement;
      if (selector === "[data-message-id]") return messageElement;
      return null;
    }),
    querySelector: vi.fn(() => null),
    querySelectorAll: vi.fn(() => []),
    parentElement: null,
  } as unknown as HTMLElement;
}

function stubGame(actorSystem: unknown): void {
  vi.stubGlobal("game", {
    actors: {
      get: vi.fn((id: string) => id === "actor-a" ? { system: actorSystem } : undefined),
    },
    messages: {
      get: vi.fn((id: string) => id === "message-a"
        ? {
            getFlag: vi.fn(() => ({
              prompts: [
                {
                  pendingId: "prompt-a",
                  actorId: "actor-a",
                  summaryLines: ["Conjuração DT: 23"],
                },
              ],
            })),
          }
        : undefined),
    },
  });
}

describe("readCastingDifficulty", () => {
  afterEach(() => {
    vi.unstubAllGlobals();
  });

  it("prefere a DT do Ritual do ator à DT de conjuração persistida", () => {
    stubGame({ ritual: { DT: 26 } });

    expect(readCastingDifficulty(createRollCardStub())).toBe(26);
  });

  it("mantém fallback para Conjuração DT quando a DT do Ritual não está disponível", () => {
    stubGame({ ritual: {} });

    expect(readCastingDifficulty(createRollCardStub())).toBe(23);
  });
});
