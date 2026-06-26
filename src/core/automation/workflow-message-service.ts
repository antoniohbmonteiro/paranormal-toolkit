import type { ChatCardStep } from "./automation-definition";
import type { WorkflowContext } from "./workflow-context";

export type WorkflowMessageService = {
  createWorkflowSummaryMessage(context: WorkflowContext, step: ChatCardStep): Promise<void>;
};
