export const AUTOMATION_EXECUTION_MODES = ["disabled", "buttons", "confirm", "automatic"] as const;

export type AutomationExecutionMode = (typeof AUTOMATION_EXECUTION_MODES)[number];

export const DEFAULT_AUTOMATION_EXECUTION_MODE: AutomationExecutionMode = "buttons";

export function isAutomationExecutionMode(value: unknown): value is AutomationExecutionMode {
  return typeof value === "string" && AUTOMATION_EXECUTION_MODES.includes(value as AutomationExecutionMode);
}

export function coerceAutomationExecutionMode(value: unknown): AutomationExecutionMode {
  return isAutomationExecutionMode(value) ? value : DEFAULT_AUTOMATION_EXECUTION_MODE;
}
