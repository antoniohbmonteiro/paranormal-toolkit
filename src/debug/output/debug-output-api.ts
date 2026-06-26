import { getDebugOutputSettings, setDebugOutputSetting, type DebugOutputSettingsSnapshot } from "./debug-output-settings";

export type DebugOutputApi = {
  status(): DebugOutputSettingsSnapshot;
  enable(): Promise<void>;
  disable(): Promise<void>;
  enableConsole(): Promise<void>;
  disableConsole(): Promise<void>;
  enableUi(): Promise<void>;
  disableUi(): Promise<void>;
  enableChat(): Promise<void>;
  disableChat(): Promise<void>;
};

export function createDebugOutputApi(): DebugOutputApi {
  return {
    status(): DebugOutputSettingsSnapshot {
      return getDebugOutputSettings();
    },

    async enable(): Promise<void> {
      await setDebugOutputSetting("enabled", true);
    },

    async disable(): Promise<void> {
      await setDebugOutputSetting("enabled", false);
    },

    async enableConsole(): Promise<void> {
      await setDebugOutputSetting("console", true);
    },

    async disableConsole(): Promise<void> {
      await setDebugOutputSetting("console", false);
    },

    async enableUi(): Promise<void> {
      await setDebugOutputSetting("ui", true);
    },

    async disableUi(): Promise<void> {
      await setDebugOutputSetting("ui", false);
    },

    async enableChat(): Promise<void> {
      await setDebugOutputSetting("chat", true);
    },

    async disableChat(): Promise<void> {
      await setDebugOutputSetting("chat", false);
    }
  };
}
