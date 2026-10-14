import { describe, expect, it } from "vitest";
import { createAllySupportState, transitionAllySupport } from "../../../src/core/allies/ally-support-state";
const combat = { id: "combat", round: 3, started: true };
const initial = () => transitionAllySupport(createAllySupportState(), { type: "assign", beneficiaryId: "joao", combat }, 1);
const active = () => transitionAllySupport(initial(), { type: "activate" }, 2);
describe("ally support transitions", () => {
  it("assigns and activates immediately even when the first beneficiary is in combat", () => {
    expect(initial()).toMatchObject({ beneficiaryId: "joao", status: "inactive", wait: null });
    expect(active()).toMatchObject({ status: "active", wait: null });
  });
  it("keeps existing active support and same-beneficiary assignment unchanged", () => {
    const state = active();
    expect(transitionAllySupport(state, { type: "assign", beneficiaryId: "joao", combat }, 99)).toBe(state);
    expect(transitionAllySupport(state, { type: "combat", combat }, 99)).toBe(state);
    expect(transitionAllySupport(state, { type: "activate" }, 99)).toBe(state);
  });
  it("switches immediately outside combat", () => {
    expect(transitionAllySupport(active(), { type: "assign", beneficiaryId: "rafa", combat: null }, 3))
      .toMatchObject({ beneficiaryId: "rafa", status: "active", wait: null, sequence: 3 });
  });
  it("waits until the next round and ignores unrelated combat or rewinds", () => {
    const state = transitionAllySupport(active(), { type: "assign", beneficiaryId: "rafa", combat }, 3);
    expect(state).toMatchObject({ status: "pending", wait: { combatId: "combat", round: 4 } });
    expect(transitionAllySupport(state, { type: "combat", combat }, 4)).toBe(state);
    expect(transitionAllySupport(state, { type: "combat", combat: { ...combat, id: "other", round: 99 } }, 4)).toBe(state);
    const completed = transitionAllySupport(state, { type: "combat", combat: { ...combat, round: 4 } }, 4);
    expect(completed).toMatchObject({ status: "active", wait: null });
    expect(transitionAllySupport(completed, { type: "combat", combat: { ...combat, round: 1 } }, 4)).toBe(completed);
  });
  it("preserves the round wait through deactivation, activation and another switch", () => {
    const pending = transitionAllySupport(active(), { type: "assign", beneficiaryId: "rafa", combat }, 3);
    const stopped = transitionAllySupport(pending, { type: "deactivate" }, 4);
    expect(stopped).toMatchObject({ status: "inactive", beneficiaryId: "rafa", wait: pending.wait });
    expect(transitionAllySupport(stopped, { type: "activate" }, 4).status).toBe("pending");
    expect(transitionAllySupport(stopped, { type: "assign", beneficiaryId: "maria", combat: null }, 4).wait).toEqual(pending.wait);
  });
  it.each([null, { ...combat, started: false }])("releases pending support when combat ends/deletes (%j)", snapshot => {
    const state = transitionAllySupport(active(), { type: "assign", beneficiaryId: "rafa", combat }, 3);
    expect(transitionAllySupport(state, { type: "combat", combat: snapshot }, 4)).toMatchObject({ status: "active", wait: null });
  });
  it("does not reactivate a stopped support when its wait ends", () => {
    const pending = transitionAllySupport(active(), { type: "assign", beneficiaryId: "rafa", combat }, 3);
    const stopped = transitionAllySupport(pending, { type: "deactivate" }, 4);
    expect(transitionAllySupport(stopped, { type: "combat", combat: null }, 4)).toMatchObject({ status: "inactive", wait: null });
  });
  it("retains the selected combat and established round wait on another switch", () => {
    const pending = transitionAllySupport(active(), { type: "assign", beneficiaryId: "rafa", combat }, 3);
    const otherCombat = { id: "other", started: true, round: 10 };
    expect(transitionAllySupport(pending, { type: "assign", beneficiaryId: "maria", combat: otherCombat }, 4).wait)
      .toEqual(pending.wait);
  });
  it("does not activate without a beneficiary", () => {
    const state = createAllySupportState();
    expect(transitionAllySupport(state, { type: "activate" }, 1)).toBe(state);
  });
});
