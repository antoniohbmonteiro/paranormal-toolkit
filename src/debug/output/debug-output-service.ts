import { MODULE_ID } from "../../constants";
import { ModuleLogger } from "../../core/module-logger";
import { getDebugOutputSettings } from "./debug-output-settings";

export type DebugOutputLevel = "info" | "warn" | "error";

export type DebugOutputMessage = {
  title: string;
  message?: string;
  data?: unknown;
  notification?: string;
};

export type DebugChatMessage = {
  content: string;
  speaker?: ChatSpeakerData;
  flags?: Record<string, unknown>;
  data?: unknown;
};

export class DebugOutputService {
  info(message: DebugOutputMessage): void {
    this.emit("info", message);
  }

  warn(message: DebugOutputMessage): void {
    this.emit("warn", message);
  }

  error(message: DebugOutputMessage): void {
    this.emit("error", message);
  }

  async chat(message: DebugChatMessage): Promise<boolean> {
    const settings = getDebugOutputSettings();

    if (!settings.enabled || !settings.chat) {
      return false;
    }

    await ChatMessage.create({
      speaker: message.speaker,
      content: message.content,
      whisper: getGmUserIds(),
      flags: {
        ...message.flags,
        [MODULE_ID]: {
          ...getModuleFlags(message.flags),
          debugOutput: true
        }
      }
    });

    if (settings.console && message.data !== undefined) {
      ModuleLogger.info("Debug chat criado.", message.data);
    }

    return true;
  }

  private emit(level: DebugOutputLevel, message: DebugOutputMessage): void {
    const settings = getDebugOutputSettings();

    if (!settings.enabled) {
      return;
    }

    const text = message.notification ?? formatDebugText(message);

    if (settings.console) {
      this.emitConsole(level, message);
    }

    if (settings.ui) {
      this.emitUi(level, text);
    }
  }

  private emitConsole(level: DebugOutputLevel, message: DebugOutputMessage): void {
    const text = formatDebugText(message);

    switch (level) {
      case "info":
        ModuleLogger.info(text, message.data ?? "");
        return;
      case "warn":
        ModuleLogger.warn(text, message.data ?? "");
        return;
      case "error":
        ModuleLogger.error(text, message.data ?? "");
        return;
    }
  }

  private emitUi(level: DebugOutputLevel, text: string): void {
    switch (level) {
      case "info":
        ui.notifications?.info(`Paranormal Toolkit: ${text}`);
        return;
      case "warn":
        ui.notifications?.warn(`Paranormal Toolkit: ${text}`);
        return;
      case "error":
        ui.notifications?.error(`Paranormal Toolkit: ${text}`);
        return;
    }
  }
}

function formatDebugText(message: DebugOutputMessage): string {
  return message.message ? `${message.title}: ${message.message}` : message.title;
}

function getGmUserIds(): string[] {
  const gmUserIds = game.users
    ?.filter((user) => user.isGM === true && user.id)
    .map((user) => user.id as string) ?? [];

  if (gmUserIds.length > 0) {
    return gmUserIds;
  }

  return game.user?.id ? [game.user.id] : [];
}

function getModuleFlags(flags: Record<string, unknown> | undefined): Record<string, unknown> {
  const moduleFlags = flags?.[MODULE_ID];
  return moduleFlags && typeof moduleFlags === "object" && !Array.isArray(moduleFlags) ? (moduleFlags as Record<string, unknown>) : {};
}
