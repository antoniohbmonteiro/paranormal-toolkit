import { describe, expect, it } from "vitest";
import { createAllyProfile, readAllyProfile } from "../../../src/core/allies/ally-profile";

describe("ally profile", () => {
  it("creates independent profiles without agent fields", () => {
    const profile = createAllyProfile();
    expect(profile).toEqual({ schemaVersion: 1, description: "", isDrone: false });
    profile.description = "Changed";
    expect(createAllyProfile().description).toBe("");
  });

  it("reads a profile without retaining unrelated state", () => {
    expect(readAllyProfile({ schemaVersion: 1, description: "<p>Aliado</p>", isDrone: true, PV: {} }))
      .toEqual({ schemaVersion: 1, description: "<p>Aliado</p>", isDrone: true });
  });

  it.each([null, {}, { schemaVersion: 2, description: "", isDrone: false },
    { schemaVersion: 1, description: 1, isDrone: false },
    { schemaVersion: 1, description: "", isDrone: "false" }])("rejects malformed or unknown data: %j", (data) => {
    expect(readAllyProfile(data)).toBeNull();
  });
});
