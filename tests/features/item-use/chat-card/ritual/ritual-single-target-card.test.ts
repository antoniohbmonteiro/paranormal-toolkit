import { describe, expect, it } from "vitest";
import { resolveRitualSingleTargetEligibility } from "../../../../../src/features/item-use/chat-card/ritual/ritual-single-target-card-eligibility";
import { buildRitualChatCardState } from "../../../../../src/features/item-use/chat-card/ritual/ritual-chat-card-state-builder";
import { buildRitualSingleTargetCardViewModel } from "../../../../../src/features/item-use/chat-card/ritual/ritual-single-target-card-view-model-builder";
import { isRitualSingleTargetChatCard } from "../../../../../src/features/item-use/chat-card/item-use-chat-card-schema";
import type { ItemUseContext } from "../../../../../src/features/item-use/item-use-context";
import type { RitualCastSnapshot, AssistedRitualAction } from "../../../../../src/features/rituals/ritual-assisted-workflow";

const actor = { id: "source", uuid: "Actor.source", name: "Conjurador", system: {} } as Actor;
const target = { id: "target", uuid: "Actor.target", name: "Alvo", system: {} } as Actor;
const item = { id: "ritual", uuid: "Actor.source.Item.ritual", name: "RitualCompleto", type: "ritual" } as Item;
const context: ItemUseContext = { source: "ordem-item-used-hook", actor, item, token: null, targets: [{ actor: target, actorId: target.id!, tokenId: "token", sceneId: "scene", name: "Alvo" }] };
const snapshot: RitualCastSnapshot = { castId: "cast", form: { id: "base", label: "Padrão" }, cost: { amount: 2, resource: "PE", spent: true }, castingCheck: { skillLabel: "Ocultismo", formula: "1d20+5", total: 18, difficulty: 15, success: true, diceBreakdown: "(13)" }, resistance: { skill: "will", label: "Vontade", effect: "nullifies", summary: "Anula" }, rolls: [{ id: "damage", formula: "2d6", total: 8, intent: "damage", damageType: "physical", diceResults: [3, 5] }], areaTargeting: false };
const actions: AssistedRitualAction[] = [{ kind: "condition-application", actor: target, actorName: "Alvo", conditionId: "weakened", conditionLabel: "Abalado", duration: { rounds: 1 }, source: "test", originUuid: item.uuid ?? null, label: "Abalado", executedLabel: "Aplicado", actionSectionId: "apply-effects", actionSectionTitle: "Efeitos", resistanceOutcome: "success" }];

describe("ritual single target card v2", () => {
  it("accepts one supported target and rejects legacy, missing and multiple targets", () => {
    expect(resolveRitualSingleTargetEligibility({ mode: "auto", systemId: "ordemparanormal", context, snapshot, actions, resistanceDifficulty: 15 })).toEqual({ eligible: true });
    expect(resolveRitualSingleTargetEligibility({ mode: "legacy", systemId: "ordemparanormal", context, snapshot, actions, resistanceDifficulty: 15 })).toEqual({ eligible: false, reason: "mode-legacy" });
    expect(resolveRitualSingleTargetEligibility({ mode: "auto", systemId: "ordemparanormal", context: { ...context, targets: [] }, snapshot, actions, resistanceDifficulty: 15 })).toEqual({ eligible: false, reason: "no-target" });
    expect(resolveRitualSingleTargetEligibility({ mode: "auto", systemId: "ordemparanormal", context: { ...context, targets: [...context.targets, context.targets[0]!] }, snapshot, actions, resistanceDifficulty: 15 })).toEqual({ eligible: false, reason: "multiple-targets" });
  });
  it("rejects area and unresolved actors", () => {
    expect(resolveRitualSingleTargetEligibility({ mode: "auto", systemId: "ordemparanormal", context, snapshot: { ...snapshot, areaTargeting: true }, actions, resistanceDifficulty: 15 })).toEqual({ eligible: false, reason: "area-targeting" });
    expect(resolveRitualSingleTargetEligibility({ mode: "auto", systemId: "ordemparanormal", context: { ...context, targets: [{ ...context.targets[0]!, actor: null }] }, snapshot, actions, resistanceDifficulty: 15 })).toEqual({ eligible: false, reason: "missing-target-actor" });
  });
  it("builds serializable state without documents and keeps outcome actions pending", () => {
    const state = buildRitualChatCardState({ context, snapshot, actions, resistanceDifficulty: 15, now: 1 });
    expect(state.actions[0]).toMatchObject({ outcome: "success", state: "pending", conditionId: "weakened" });
    expect(state.mainRoll).toMatchObject({ intent: "damage", diceResults: [3, 5] });
    expect(JSON.parse(JSON.stringify(state))).toEqual(state);
    expect(JSON.stringify(state)).not.toContain('"system"');
  });
  it("builds optional conjuration and damage presentation", () => {
    const state = buildRitualChatCardState({ context, snapshot, actions, resistanceDifficulty: 15 });
    const model = buildRitualSingleTargetCardViewModel(state);
    expect(model.conjuration?.status).toBe("success");
    expect(model.effect?.title).toBe("Dano");
    expect(model.resistance?.action.actionId).toBe("cast:resistance");
  });
  it("supports healing, utility and absent conjuration", () => {
    for (const intent of ["healing", "generic"] as const) {
      const state = buildRitualChatCardState({ context, snapshot: { ...snapshot, castingCheck: null, resistance: null, rolls: [{ ...snapshot.rolls[0]!, intent }] }, actions: [], resistanceDifficulty: null });
      const model = buildRitualSingleTargetCardViewModel(state);
      expect(model.conjuration).toBeUndefined();
      expect(model.effect?.title).toBe(intent === "healing" ? "Cura" : "Efeito");
    }
  });
  it("recognizes the discriminated v2 schema", () => {
    const state = buildRitualChatCardState({ context, snapshot, actions, resistanceDifficulty: 15 });
    expect(isRitualSingleTargetChatCard({ schemaVersion: 2, kind: "ritual", renderer: "single-target", revision: 0, createdAt: 1, messageId: "m", state, legacyFallback: { summaryLines: [], actions: [], itemName: item.name, actorId: actor.id, itemId: item.id } })).toBe(true);
    expect(isRitualSingleTargetChatCard({ schemaVersion: 3 })).toBe(false);
  });
});
