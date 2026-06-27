export const AUTOMATION_EXECUTION_MODES = ["disabled", "ask", "automatic"] as const;
export const LEGACY_AUTOMATION_EXECUTION_MODES = ["buttons", "confirm"] as const;

export type AutomationExecutionMode = (typeof AUTOMATION_EXECUTION_MODES)[number];
export type LegacyAutomationExecutionMode = (typeof LEGACY_AUTOMATION_EXECUTION_MODES)[number];
export type StoredAutomationExecutionMode = AutomationExecutionMode | LegacyAutomationExecutionMode;

export const DEFAULT_AUTOMATION_EXECUTION_MODE: AutomationExecutionMode = "ask";

export function isAutomationExecutionMode(value: unknown): value is AutomationExecutionMode {
  return typeof value === "string" && AUTOMATION_EXECUTION_MODES.includes(value as AutomationExecutionMode);
}

export function isLegacyAutomationExecutionMode(value: unknown): value is LegacyAutomationExecutionMode {
  return typeof value === "string" && LEGACY_AUTOMATION_EXECUTION_MODES.includes(value as LegacyAutomationExecutionMode);
}

export function coerceAutomationExecutionMode(value: unknown): AutomationExecutionMode {
  if (isAutomationExecutionMode(value)) return value;
  if (isLegacyAutomationExecutionMode(value)) return "ask";
  return DEFAULT_AUTOMATION_EXECUTION_MODE;
}
