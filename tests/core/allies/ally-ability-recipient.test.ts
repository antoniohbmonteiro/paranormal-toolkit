import { describe, expect, it } from "vitest";
import { resolveAllyAbilityRecipient } from "../../../src/core/allies/ally-ability-recipient";

describe("Ally ability recipient policy", () => {
  it.each([
    [false, false, "pilot", "beneficiary", null], [false, true, "pilot", "beneficiary", null],
    [true, false, "pilot", "beneficiary", null], [true, true, "pilot", "pilot", null],
    [true, true, "beneficiary", "beneficiary", null], [true, true, null, null, "pilot-required"],
    [false, true, null, "beneficiary", null], [true, false, null, "beneficiary", null],
  ])("resolves homebrew=%s drone=%s pilot=%s", (pilotAbilitiesEnabled, isDrone, pilotId, actorId, reason) => {
    const input = { beneficiaryId: "beneficiary", pilotAbilitiesEnabled, isDrone, pilotId } as const;
    const before = structuredClone(input);
    expect(resolveAllyAbilityRecipient(Object.freeze(input))).toEqual({ actorId, reason });
    expect(input).toEqual(before);
  });
  it("requires a beneficiary even when a pilot is configured", () => {
    expect(resolveAllyAbilityRecipient({ beneficiaryId: null, pilotId: "pilot", isDrone: true, pilotAbilitiesEnabled: true }))
      .toEqual({ actorId: null, reason: null });
  });
});
