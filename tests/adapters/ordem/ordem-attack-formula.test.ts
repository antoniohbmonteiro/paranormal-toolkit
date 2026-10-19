import { describe, expect, it } from "vitest";
import { applyAttackDiceModifier, resolveWeaponDamageFaces } from "../../../src/adapters/ordem/attacks/ordem-attack-formula";

describe("native attack formula rules", () => {
  it.each([[3, "kh", 2, "kh"], [2, "kh", 1, "kh"], [1, "kh", 2, "kl"], [2, "kl", 3, "kl"],
    [3, "kl1", 4, "kl"], [1, "kh1", 2, "kl"]])("reduces %i d20 %s", (number, keep, expected, mode) => {
    expect(applyAttackDiceModifier({ number: Number(number), faces: 20, modifiers: [String(keep)] }, -1))
      .toEqual({ number: expected, faces: 20, modifiers: [mode] });
  });
  it.each([0, -1, 1.5, NaN, Infinity])("rejects malformed quantities: %s", number => {
    expect(() => applyAttackDiceModifier({ number, faces: 20, modifiers: ["kh"] }, -1)).toThrow("segurança");
  });
  it("rejects unexpected native dice and modifiers without mutating them", () => {
    for (const pool of [{ number: 2, faces: 6, modifiers: ["kh"] }, { number: 2, faces: 20, modifiers: ["kh", "r1"] },
      { number: 2, faces: 20, modifiers: [] }, { number: 2, faces: 20, modifiers: ["kh2"] }]) {
      const before = structuredClone(pool);
      expect(() => applyAttackDiceModifier(pool, -1)).toThrow(); expect(pool).toEqual(before);
    }
  });
  it.each([[3, "kh", 2, 5, "kh"], [2, "kl", 1, 1, "kh"], [2, "kl", 2, 2, "kh"],
    [3, "kl", 1, 2, "kl"], [3, "kl", 3, 2, "kh"], [1, "kh", -3, 4, "kl"]])
    ("applies a signed modifier to %i d20 %s", (number, mode, modifier, expected, keep) => {
      const pool = { number: Number(number), faces: 20, modifiers: [String(mode)] }, before = structuredClone(pool);
      expect(applyAttackDiceModifier(pool, Number(modifier))).toEqual({ number: expected, faces: 20, modifiers: [keep] });
      expect(pool).toEqual(before);
    });
  it("leaves a cancelled modifier unchanged and rejects unsafe arithmetic", () => {
    const pool = { number: 2, faces: 20, modifiers: ["kl1"] };
    expect(applyAttackDiceModifier(pool, 0)).toEqual(pool);
    for (const modifier of [NaN, Infinity, 0.5, Number.MAX_SAFE_INTEGER + 1]) {
      expect(() => applyAttackDiceModifier(pool, modifier)).toThrow();
    }
    expect(() => applyAttackDiceModifier({ ...pool, number: Number.MAX_SAFE_INTEGER, modifiers: ["kh"] }, 1)).toThrow("limites");
  });
  it.each([["2d6", 6], ["2d10", 10], ["2d12", 12], [" 1d8 ", 8]])("identifies %s", (formula, faces) => {
    expect(resolveWeaponDamageFaces(formula)).toBe(faces);
  });
  it.each(["2d6+1", "2d6+1d4", "(2d6)", "d6", "0d6", "2d0", "2d6kh", "@damage", null, "99999999999999999d6"])("rejects ambiguous damage %s", formula => {
    expect(resolveWeaponDamageFaces(formula)).toBeNull();
  });
});
