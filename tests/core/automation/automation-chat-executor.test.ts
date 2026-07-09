import { describe, expect, it, vi } from "vitest";
import { executeAutomationChatStep } from "../../../src/core/automation/automation-chat-executor";

describe("executeAutomationChatStep", () => {
  it("ignora o card legado de resumo do workflow", async () => {
    const messages = {
      createWorkflowSummaryMessage: vi.fn(async () => undefined),
    };

    const result = await executeAutomationChatStep(
      messages,
      { type: "chatCard", title: "Resumo legado" },
      {} as never,
    );

    expect(result.ok).toBe(true);
    expect(messages.createWorkflowSummaryMessage).not.toHaveBeenCalled();
  });
});
