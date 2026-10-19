import { describe, expect, it, vi } from "vitest";
import { OrdemDamageAdapter, resolveOrdemDamageResistance } from "../../../src/adapters/ordem/ordem-damage-adapter";
import { ORDEM_DAMAGE_TYPE_IDS } from "../../../src/adapters/ordem/ordem-damage-types";

describe("partial attack resistance penetration", () => {
  it.each(ORDEM_DAMAGE_TYPE_IDS)("supports native resistance type %s without adding damage", async type => {
    const applyDamage = vi.fn(async (amount, options) => ({ finalDamage: Math.max(0, amount - options.extraRD), blocked: options.extraRD, newPV: 90 }));
    const actor = { id: "target", name: "Alvo", system: { resistances: { [type]: { value: 15 } } }, applyDamage } as unknown as Actor;
    const result = await new OrdemDamageAdapter().applyDamage({ actor, instances: [{ amount: 8, damageType: type, resistancePenetration: 10 }] });
    expect(result.ok).toBe(true);
    expect(applyDamage).toHaveBeenCalledWith(8, { damageType: type, ignoreRD: true, extraRD: 5, nonLethal: false });
  });
  it.each([[0, 10, 0], [5, 10, 0], [10, 10, 0], [15, 10, 5], [15, 0, 15]])("resolves RD %i with penetration %i", (rd, penetration, residual) => {
    const actor = { system: { resistances: { ballisticDamage: { value: rd } } } } as unknown as Actor;
    const options = resolveOrdemDamageResistance(actor, "ballisticDamage", { resistancePenetration: penetration, extraResistance: 0 });
    expect(options).toEqual(penetration ? { ignoreRD: true, extraRD: residual } : { ignoreRD: false });
  });
  it("uses the combined resistance budget while preserving legacy ignoreResistance", () => {
    const actor = { system: { resistances: { ballisticDamage: { value: 15 } } } } as unknown as Actor;
    expect(resolveOrdemDamageResistance(actor, "ballisticDamage", { resistancePenetration: 10, extraResistance: 5 })).toEqual({ ignoreRD: true, extraRD: 10 });
    expect(resolveOrdemDamageResistance(actor, "ballisticDamage", { ignoreResistance: true, extraResistance: 5 })).toEqual({ ignoreRD: true, extraRD: 5 });
  });
  it.each([-1, 0.5, NaN, Infinity])("rejects invalid penetration %s before mutation", async penetration => {
    const applyDamage = vi.fn(), actor = { id: "a", name: "A", applyDamage } as unknown as Actor;
    const result = await new OrdemDamageAdapter().applyDamage({ actor, instances: [{ amount: 5, resistancePenetration: penetration }] });
    expect(result.ok).toBe(false); expect(applyDamage).not.toHaveBeenCalled();
  });
});
