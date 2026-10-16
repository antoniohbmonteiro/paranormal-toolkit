import { defenseBenefit } from "../../helpers/ally-effects";
import { describe, expect, it } from "vitest";
import { readAllyAbilityDefinition, allyScopeFingerprint } from "../../../src/core/allies/ally-definition";
import { resolveAllyBenefits, type AllyBenefitSource } from "../../../src/core/allies/ally-benefit-resolver";
function source(id: string, sequence: number, value = 5): AllyBenefitSource {
  return { allyId: id, state: { beneficiaryId: "joao", status: "active", wait: null, sequence },
    abilities: [{ id: "item", definition: { version: 2, benefits: [defenseBenefit("defense", value)] } }] };
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
    expect(resolveAllyBenefits(sources)[0].template.system.changes[0].value).toBe(10);
    sources[1].state.status = "inactive";
    expect(resolveAllyBenefits(sources)[0].template.system.changes[0].value).toBe(5);
  });
  it("keeps priority independent of value edits and array ordering", () => {
    const sources = [source("iris", 3), source("guardian", 2, 100)];
    expect(resolveAllyBenefits(sources)[0].allyId).toBe("iris");
    expect(resolveAllyBenefits([...sources].reverse())).toEqual(resolveAllyBenefits(sources));
  });
  it("uses persisted per-benefit entry order within one ally", () => {
    const ally = source("iris", 1);
    ally.abilities[0].definition.benefits.push(defenseBenefit("later", 10));
    ally.sequenceBySource = { [JSON.stringify(["iris", "item", "defense"])]: 3, [JSON.stringify(["iris", "item", "later"])]: 4 };
    expect(resolveAllyBenefits([ally])[0].template.system.changes[0].value).toBe(10);
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
  it("preserves independent custom changes when a newer effect replaces only an overlapping change", () => {
    const older = source("iris", 1), newer = source("other", 2, 10);
    older.abilities[0].definition.benefits[0].template.system.changes.push({
      key: "system.movement.land", value: 3, type: "add", phase: "initial", priority: 20,
    });
    const resolved = resolveAllyBenefits([older, newer]);
    expect(resolved).toHaveLength(2);
    expect(resolved.find(entry => entry.allyId === "iris")!.template.system.changes.map(change => change.key)).toEqual(["system.movement.land"]);
    expect(resolved.find(entry => entry.allyId === "other")!.template.system.changes[0].value).toBe(10);
    expect(older.abilities[0].definition.benefits[0].template.system.changes).toHaveLength(2);
  });
  it("does not conflate different phases, modes, or independent effect paths", () => {
    const first = source("iris", 1), second = source("other", 2);
    second.abilities[0].definition.benefits[0].template.system.changes[0].phase = "derived";
    expect(resolveAllyBenefits([first, second])).toHaveLength(2);
    second.abilities[0].definition.benefits[0].template.system.changes[0].phase = "initial";
    second.abilities[0].definition.benefits[0].template.system.changes[0].type = "upgrade";
    expect(resolveAllyBenefits([first, second])).toHaveLength(2);
  });
  it("preserves repeated changes within the winning native effect", () => {
    const first = source("iris", 1);
    first.abilities[0].definition.benefits[0].template.system.changes.push({
      key: "system.defense.value", value: 2, type: "add", phase: "initial", priority: 30,
    });
    expect(resolveAllyBenefits([first])[0].template.system.changes).toHaveLength(2);
  });
});
