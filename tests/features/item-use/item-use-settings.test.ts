import { beforeEach, describe, expect, it, vi } from "vitest";
import { MODULE_ID } from "../../../src/constants";
import {
  DEFAULT_AUTOMATION_EXECUTION_MODE,
  coerceAutomationExecutionMode
} from "../../../src/features/item-use/item-use-execution-mode";
import {
  ITEM_USE_SETTING_KEYS,
  getItemUseSettings,
  registerItemUseSettings,
  setItemUseAutoRunEnabled,
  setItemUseExecutionMode
} from "../../../src/features/item-use/item-use-settings";

const settingsStore = new Map<string, unknown>();

beforeEach(() => {
  settingsStore.clear();

  vi.stubGlobal("game", {
    settings: {
      register: vi.fn((_moduleId: string, key: string, config: { default?: unknown }) => {
        settingsStore.set(key, config.default);
      }),
      get: vi.fn((_moduleId: string, key: string) => settingsStore.get(key)),
      set: vi.fn(async (_moduleId: string, key: string, value: unknown) => {
        settingsStore.set(key, value);
        return value;
      })
    }
  });
});

describe("AutomationExecutionMode", () => {
  it("usa buttons como modo padrão", () => {
    expect(DEFAULT_AUTOMATION_EXECUTION_MODE).toBe("buttons");
    expect(coerceAutomationExecutionMode(undefined)).toBe("buttons");
    expect(coerceAutomationExecutionMode("modo-quebrado")).toBe("buttons");
  });

  it("registra o setting de modo de execução e mantém autoRun legado escondido", () => {
    registerItemUseSettings();

    expect(game.settings.register).toHaveBeenCalledWith(
      MODULE_ID,
      ITEM_USE_SETTING_KEYS.executionMode,
      expect.objectContaining({
        scope: "world",
        config: true,
        type: String,
        default: "buttons"
      })
    );
    expect(game.settings.register).toHaveBeenCalledWith(
      MODULE_ID,
      ITEM_USE_SETTING_KEYS.autoRun,
      expect.objectContaining({
        scope: "world",
        config: false,
        type: Boolean,
        default: false
      })
    );
  });

  it("lê executionMode e deriva autoRun apenas do modo automático", () => {
    settingsStore.set(ITEM_USE_SETTING_KEYS.executionMode, "automatic");

    expect(getItemUseSettings()).toEqual({
      executionMode: "automatic",
      autoRun: true
    });

    settingsStore.set(ITEM_USE_SETTING_KEYS.executionMode, "buttons");

    expect(getItemUseSettings()).toEqual({
      executionMode: "buttons",
      autoRun: false
    });
  });

  it("permite setar o modo explicitamente", async () => {
    await setItemUseExecutionMode("confirm");

    expect(game.settings.set).toHaveBeenCalledWith(MODULE_ID, ITEM_USE_SETTING_KEYS.executionMode, "confirm");
    expect(settingsStore.get(ITEM_USE_SETTING_KEYS.executionMode)).toBe("confirm");
  });

  it("mantém enable/disable legado mapeando para automatic/disabled", async () => {
    await setItemUseAutoRunEnabled(true);
    expect(settingsStore.get(ITEM_USE_SETTING_KEYS.executionMode)).toBe("automatic");

    await setItemUseAutoRunEnabled(false);
    expect(settingsStore.get(ITEM_USE_SETTING_KEYS.executionMode)).toBe("disabled");
  });
});
