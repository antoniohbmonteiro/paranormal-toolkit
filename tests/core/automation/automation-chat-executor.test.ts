import { describe, expect, it, vi } from "vitest";
import { executeAutomationChatStep } from "../../../src/core/automation/automation-chat-executor";
import type { ChatCardStep } from "../../../src/core/automation/automation-definition";
import type { WorkflowContext } from "../../../src/core/workflow/workflow-context";
import type { WorkflowMessageService } from "../../../src/core/automation/workflow-message-service";

function createContext(): WorkflowContext {
  return {
    id: "workflow-1",
    sourceActor: { id: "actor-1", name: "Mercy" } as Actor,
    sourceToken: null,
    item: { id: "item-1", name: "Cicatrização", type: "ritual" } as Item,
    targets: [],
    phases: [],
    lifecycleEvents: [],
    rollRequests: {},
    rolls: {},
    ritualCosts: [],
    damageInstances: [],
    healingInstances: [],
    resourceTransactions: [],
    flags: {}
  };
}

describe("executeAutomationChatStep", () => {
  it("cria mensagem de resumo do workflow", async () => {
    const messages: WorkflowMessageService = {
      createWorkflowSummaryMessage: vi.fn().mockResolvedValue(undefined)
    };
    const step: ChatCardStep = { type: "chatCard", title: "Resumo" };
    const context = createContext();

    const result = await executeAutomationChatStep(messages, step, context);

    expect(result.ok).toBe(true);
    expect(messages.createWorkflowSummaryMessage).toHaveBeenCalledWith(context, step);
  });

  it("falha quando a criação do chat card lança erro", async () => {
    const cause = new Error("chat falhou");
    const messages: WorkflowMessageService = {
      createWorkflowSummaryMessage: vi.fn().mockRejectedValue(cause)
    };

    const result = await executeAutomationChatStep(messages, { type: "chatCard" }, createContext());

    expect(result.ok).toBe(false);
    if (!result.ok) {
      expect(result.error.reason).toBe("chat-card-failed");
      expect(result.error.cause).toBe(cause);
    }
  });
});
