import type { AutomationRunFailure, AutomationRunSuccess } from "../automation/automation-runner";
import type { Result } from "../result";

export type WorkflowRunSuccess = AutomationRunSuccess;
export type WorkflowRunFailure = AutomationRunFailure;
export type WorkflowRunResult = Result<WorkflowRunSuccess, WorkflowRunFailure>;
