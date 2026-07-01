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
  it("usa ask como modo padrão", () => {
    expect(DEFAULT_AUTOMATION_EXECUTION_MODE).toBe("ask");
    expect(coerceAutomationExecutionMode(undefined)).toBe("ask");
    expect(coerceAutomationExecutionMode("modo-quebrado")).toBe("ask");
    expect(coerceAutomationExecutionMode("buttons")).toBe("ask");
    expect(coerceAutomationExecutionMode("confirm")).toBe("ask");
  });

  it("registra os settings de uso de item e mantém autoRun legado escondido", () => {
    registerItemUseSettings();

    expect(game.settings.register).toHaveBeenCalledWith(
      MODULE_ID,
      ITEM_USE_SETTING_KEYS.executionMode,
      expect.objectContaining({
        scope: "world",
        config: true,
        type: String,
        default: "ask"
      })
    );
    expect(game.settings.register).toHaveBeenCalledWith(
      MODULE_ID,
      ITEM_USE_SETTING_KEYS.systemCardMode,
      expect.objectContaining({
        scope: "world",
        config: true,
        type: String,
        default: "keep"
      })
    );
    expect(game.settings.register).toHaveBeenCalledWith(
      MODULE_ID,
      ITEM_USE_SETTING_KEYS.ritualCastingCheckEnabled,
      expect.objectContaining({
        scope: "world",
        config: true,
        type: Boolean,
        default: true
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

  it("lê executionMode e settings relacionados", () => {
    registerItemUseSettings();
    settingsStore.set(ITEM_USE_SETTING_KEYS.executionMode, "automatic");

    expect(getItemUseSettings()).toEqual({
      executionMode: "automatic",
      systemCardMode: "keep",
      ritualCastingCheckEnabled: true
    });

    settingsStore.set(ITEM_USE_SETTING_KEYS.executionMode, "ask");
    settingsStore.set(ITEM_USE_SETTING_KEYS.systemCardMode, "replace");
    settingsStore.set(ITEM_USE_SETTING_KEYS.ritualCastingCheckEnabled, false);

    expect(getItemUseSettings()).toEqual({
      executionMode: "ask",
      systemCardMode: "replace",
      ritualCastingCheckEnabled: false
    });
  });

  it("permite setar o modo explicitamente", async () => {
    await setItemUseExecutionMode("automatic");

    expect(game.settings.set).toHaveBeenCalledWith(MODULE_ID, ITEM_USE_SETTING_KEYS.executionMode, "automatic");
    expect(settingsStore.get(ITEM_USE_SETTING_KEYS.executionMode)).toBe("automatic");
  });

  it("mantém enable/disable legado mapeando para automatic/disabled", async () => {
    await setItemUseAutoRunEnabled(true);
    expect(settingsStore.get(ITEM_USE_SETTING_KEYS.executionMode)).toBe("automatic");

    await setItemUseAutoRunEnabled(false);
    expect(settingsStore.get(ITEM_USE_SETTING_KEYS.executionMode)).toBe("disabled");
  });
});
