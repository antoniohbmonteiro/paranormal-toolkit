import { failure, type Result, success } from "../result";
import type { ChatCardStep } from "./automation-definition";
import type { WorkflowContext } from "../workflow/workflow-context";
import type { WorkflowMessageService } from "./workflow-message-service";

export type AutomationChatFailure = {
  reason: "chat-card-failed";
  message: string;
  cause?: unknown;
};

export type AutomationChatResult = Result<void, AutomationChatFailure>;

export async function executeAutomationChatCard(
  messages: WorkflowMessageService,
  context: WorkflowContext,
  step: ChatCardStep
): Promise<AutomationChatResult> {
  try {
    await messages.createWorkflowSummaryMessage(context, step);
    return success(undefined);
  } catch (cause) {
    return failure({
      reason: "chat-card-failed",
      message: "Workflow executado, mas falhou ao criar chat card de resumo.",
      cause
    });
  }
}
