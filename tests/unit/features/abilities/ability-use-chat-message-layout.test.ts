import { describe, expect, it } from "vitest";
import {
  applyAbilityUseChatMessageLayout,
  FULL_WIDTH_CHAT_MESSAGE_CLASS,
} from "../../../../src/features/abilities/ability-use-chat-message-layout";

describe("applyAbilityUseChatMessageLayout", () => {
  it("marks the outer chat message containing an ability card", () => {
    const addedClasses: string[] = [];
    const message = {
      classList: {
        add: (token: string) => addedClasses.push(token),
      },
    };
    const card = {
      closest: (selector: string) =>
        selector === "li.chat-message" ? message : null,
    };
    const root = {
      querySelectorAll: (selector: string) =>
        selector === ".paranormal-toolkit-ability-card" ? [card] : [],
    };

    const count = applyAbilityUseChatMessageLayout(
      root as unknown as ParentNode,
    );

    expect(count).toBe(1);
    expect(addedClasses).toEqual([FULL_WIDTH_CHAT_MESSAGE_CLASS]);
  });

  it("does not mark unrelated chat messages", () => {
    const root = {
      querySelectorAll: () => [],
    };

    expect(
      applyAbilityUseChatMessageLayout(root as unknown as ParentNode),
    ).toBe(0);
  });
});
