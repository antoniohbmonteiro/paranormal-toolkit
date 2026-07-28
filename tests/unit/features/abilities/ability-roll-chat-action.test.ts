import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";
import { bindAbilityRollButtons } from "../../../../src/features/abilities/ability-roll-chat-action";

class FakeButton {
  dataset: Record<string, string> = {};
  disabled = false;
  listener: (() => void) | null = null;
  classList = { toggle: vi.fn() };

  matches(): boolean {
    return true;
  }

  getAttribute(): string {
    return "roll";
  }

  addEventListener(_event: string, listener: () => void): void {
    this.listener = listener;
  }

  querySelector(): null {
    return null;
  }
}

function version2Flag() {
  return {
    version: 2,
    actorUuid: "Actor.a",
    itemUuid: "Actor.a.Item.i",
    abilityName: "Habilidade",
    resource: "PE",
    cost: 1,
    spentResource: true,
    resourceBefore: 4,
    resourceAfter: 3,
    rolls: [
      {
        id: "roll",
        sourceRollId: "roll",
        label: "Rolagem",
        intent: "generic",
        damageType: null,
        formula: "1d20",
        nexThreshold: null,
      },
    ],
  };
}

beforeEach(() => {
  vi.stubGlobal("HTMLButtonElement", FakeButton);
  vi.stubGlobal("game", { user: { isGM: true }, actors: { get: () => null } });
  vi.stubGlobal("ui", { notifications: { warn: vi.fn() } });
  vi.stubGlobal("ChatMessage", { getSpeaker: vi.fn(() => ({})) });
});

afterEach(() => {
  vi.unstubAllGlobals();
  vi.restoreAllMocks();
});

describe("legacy ability roll chat handler", () => {
  it("keeps executing a roll for a version 2 card", async () => {
    const toMessage = vi.fn().mockResolvedValue(undefined);
    class FakeRoll {
      async evaluate(): Promise<this> {
        return this;
      }
      toMessage = toMessage;
    }
    vi.stubGlobal("Roll", FakeRoll);
    vi.stubGlobal("fromUuid", vi.fn().mockResolvedValue({
      id: "a",
      uuid: "Actor.a",
      system: {},
    }));
    const button = new FakeButton();
    const message = { getFlag: () => version2Flag() };

    expect(bindAbilityRollButtons(message, button as unknown as ParentNode)).toBe(1);
    button.listener?.();
    await vi.waitFor(() => expect(toMessage).toHaveBeenCalledOnce());
  });

  it("never executes the legacy handler for a version 3 card", async () => {
    const RollConstructor = vi.fn();
    vi.stubGlobal("Roll", RollConstructor);
    const button = new FakeButton();
    const message = {
      getFlag: () => ({ version: 3, state: { schemaVersion: 1 } }),
    };

    bindAbilityRollButtons(message, button as unknown as ParentNode);
    button.listener?.();
    await Promise.resolve();

    expect(RollConstructor).not.toHaveBeenCalled();
  });
});
