import { type Result, success } from "../result";
import type { ChatCardStep } from "./automation-definition";
import type { WorkflowContext } from "../workflow/workflow-context";
import type { WorkflowMessageService } from "./workflow-message-service";

export type AutomationChatFailure = {
  reason: "chat-card-failed";
  message: string;
  cause?: unknown;
};

export type AutomationChatResult = Result<void, AutomationChatFailure>;

export async function executeAutomationChatStep(
  messages: WorkflowMessageService,
  step: ChatCardStep,
  context: WorkflowContext
): Promise<AutomationChatResult> {
  void messages;
  void step;
  void context;

  return success(undefined);
}
