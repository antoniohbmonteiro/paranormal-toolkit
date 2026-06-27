import { describe, expect, it, vi } from "vitest";
import { executeAutomationChatCard } from "../../../src/core/automation/automation-chat-executor";
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

function createStep(): ChatCardStep {
  return {
    type: "chatCard",
    title: "Resumo",
    message: "Workflow executado."
  };
}

describe("executeAutomationChatCard", () => {
  it("cria o resumo de workflow", async () => {
    const context = createContext();
    const step = createStep();
    const createWorkflowSummaryMessage = vi.fn<WorkflowMessageService["createWorkflowSummaryMessage"]>().mockResolvedValue(undefined);
    const messages: WorkflowMessageService = { createWorkflowSummaryMessage };

    const result = await executeAutomationChatCard(messages, context, step);

    expect(result.ok).toBe(true);
    expect(createWorkflowSummaryMessage).toHaveBeenCalledWith(context, step);
  });

  it("retorna falha quando a criação do chat card falha", async () => {
    const context = createContext();
    const step = createStep();
    const cause = new Error("chat indisponível");
    const createWorkflowSummaryMessage = vi.fn<WorkflowMessageService["createWorkflowSummaryMessage"]>().mockRejectedValue(cause);
    const messages: WorkflowMessageService = { createWorkflowSummaryMessage };

    const result = await executeAutomationChatCard(messages, context, step);

    expect(result.ok).toBe(false);
    if (!result.ok) {
      expect(result.error).toEqual({
        reason: "chat-card-failed",
        message: "Workflow executado, mas falhou ao criar chat card de resumo.",
        cause
      });
    }
  });
});
