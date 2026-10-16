import { describe, expect, it, vi } from "vitest";
import { ALLY_PILOT_ABILITIES_SETTING, getAllyPilotAbilitiesEnabled, registerAllySettings } from "../../../../src/features/allies/ally-settings";

describe("drone pilot homebrew setting", () => {
  it("registers a disabled world Boolean with the native settings permissions", () => {
    const register = vi.fn(); vi.stubGlobal("game", { settings: { register } });
    registerAllySettings();
    expect(register).toHaveBeenCalledExactlyOnceWith("paranormal-toolkit", ALLY_PILOT_ABILITIES_SETTING, {
      name: "Homebrew: piloto utiliza habilidades do drone", hint: expect.any(String), scope: "world", config: true, type: Boolean, default: false,
    });
  });
  it.each([true, false, undefined, "true"])("only enables an actual true value (%s)", raw => {
    vi.stubGlobal("game", { settings: { get: vi.fn(() => raw) } });
    expect(getAllyPilotAbilitiesEnabled()).toBe(raw === true);
  });
});
