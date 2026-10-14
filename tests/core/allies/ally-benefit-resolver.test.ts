import { describe, expect, it } from "vitest";
import { readAllyAbilityDefinition, allyScopeFingerprint } from "../../../src/core/allies/ally-definition";
import { resolveAllyBenefits, type AllyBenefitSource } from "../../../src/core/allies/ally-benefit-resolver";
function source(id: string, sequence: number, value = 5): AllyBenefitSource {
  return { allyId: id, state: { beneficiaryId: "joao", status: "active", wait: null, sequence },
    abilities: [{ id: "item", definition: { version: 1, benefits: [{ id: "defense", kind: "defense", value }] } }] };
}
describe("ally benefit definitions and precedence", () => {
  it.each([{}, { version: 2, benefits: [] }, { version: 1, benefits: [{ id: "a", kind: "skill", value: 5 }] },
    { version: 1, benefits: [{ id: "a", kind: "defense", value: Infinity }] },
    { version: 1, benefits: [{ id: "a", kind: "defense", value: 5 }, { id: "a", kind: "defense", value: 10 }] }])
    ("rejects malformed or unsupported definitions (%j)", value => expect(readAllyAbilityDefinition(value)).toBeNull());
  it("supports arbitrary entries and strips extraneous fields", () => {
    const benefits = Array.from({ length: 50 }, (_, index) => ({ id: String(index), kind: "defense", value: 5, userId: "spoof" }));
    expect(readAllyAbilityDefinition({ version: 1, benefits })?.benefits).toHaveLength(50);
    expect(readAllyAbilityDefinition({ version: 1, benefits })?.benefits[0]).not.toHaveProperty("userId");
  });
  it("selects the last applied source and restores its predecessor", () => {
    const sources = [source("iris", 1), source("guardian", 2, 10)];
    expect(resolveAllyBenefits(sources)).toHaveLength(1);
    expect(resolveAllyBenefits(sources)[0].value).toBe(10);
    sources[1].state.status = "inactive";
    expect(resolveAllyBenefits(sources)[0].value).toBe(5);
  });
  it("keeps priority independent of value edits and array ordering", () => {
    const sources = [source("iris", 3), source("guardian", 2, 100)];
    expect(resolveAllyBenefits(sources)[0].allyId).toBe("iris");
    expect(resolveAllyBenefits([...sources].reverse())).toEqual(resolveAllyBenefits(sources));
  });
  it("uses persisted per-benefit entry order within one ally", () => {
    const ally = source("iris", 1);
    ally.abilities[0].definition.benefits.push({ id: "later", kind: "defense", value: 10 });
    ally.sequenceBySource = { [JSON.stringify(["iris", "item", "defense"])]: 3, [JSON.stringify(["iris", "item", "later"])]: 4 };
    expect(resolveAllyBenefits([ally])[0].value).toBe(10);
  });
  it("does not apply pending support or combine different beneficiaries", () => {
    const first = source("iris", 1);
    const second = source("guardian", 2);
    second.state.beneficiaryId = "rafa";
    expect(resolveAllyBenefits([first, second])).toHaveLength(2);
    first.state.status = "pending";
    expect(resolveAllyBenefits([first, second])).toHaveLength(1);
  });
  it("canonicalizes mechanical scope independently of presentation and item order", () => {
    const sources = [source("iris", 1).abilities[0], { ...source("guardian", 1).abilities[0], id: "other" }];
    expect(allyScopeFingerprint(sources)).toBe(allyScopeFingerprint([...sources].reverse()));
  });
});
