import { ModuleLogger } from "../../core/module-logger";
import {
  buildChatWorkflowFlag,
  getCurrentChatTargets,
  getCurrentWorkflowSource,
  getWorkflowSourcePath,
  hasSpeakerActor,
  hasToolkitFlags
} from "./chat-workflow-flags";

export function registerChatTargetCapture(): void {
  Hooks.on("preCreateChatMessage", (message: unknown, data: unknown, _options: unknown, userId: unknown) => {
    if (!isCurrentUser(userId)) return;
    if (!hasUpdateSource(message)) return;
    if (hasToolkitFlags(message) || hasToolkitFlags(data)) return;

    const targets = getCurrentChatTargets();

    if (targets.length === 0) return;
    if (!hasSpeakerActor(message) && !hasSpeakerActor(data)) return;

    const source = getCurrentWorkflowSource();

    message.updateSource({
      [getWorkflowSourcePath()]: buildChatWorkflowFlag(targets, source)
    });

    ModuleLogger.info("Targets capturados para ChatMessage.", { source, targets });
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
