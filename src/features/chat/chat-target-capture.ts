import { ModuleLogger } from "../../core/module-logger";
import { buildChatWorkflowFlag, getCurrentChatTargets, getWorkflowSourcePath } from "./chat-workflow-flags";

export function registerChatTargetCapture(): void {
  Hooks.on("preCreateChatMessage", (message: unknown, _data: unknown, _options: unknown, userId: unknown) => {
    if (!isCurrentUser(userId)) return;
    if (!hasUpdateSource(message)) return;

    const targets = getCurrentChatTargets();

    if (targets.length === 0) return;

    message.updateSource({
      [getWorkflowSourcePath()]: buildChatWorkflowFlag(targets)
    });

    ModuleLogger.info("Targets capturados para ChatMessage.", targets);
  });
}

function isCurrentUser(userId: unknown): boolean {
  const currentUserId = game.user?.id;

  if (!currentUserId || typeof userId !== "string") {
    return true;
  }

  return userId === currentUserId;
}

function hasUpdateSource(value: unknown): value is { updateSource(data: Record<string, unknown>): void } {
  return Boolean(value && typeof value === "object" && "updateSource" in value);
}
