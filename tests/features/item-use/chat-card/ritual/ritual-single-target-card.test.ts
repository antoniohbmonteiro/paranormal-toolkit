import { describe, expect, it } from "vitest";
import { resolveRitualSingleTargetEligibility } from "../../../../../src/features/item-use/chat-card/ritual/ritual-single-target-card-eligibility";
import { buildRitualChatCardState } from "../../../../../src/features/item-use/chat-card/ritual/ritual-chat-card-state-builder";
import { buildRitualSingleTargetCardViewModel, normalizeExecutedLabel } from "../../../../../src/features/item-use/chat-card/ritual/ritual-single-target-card-view-model-builder";
import { isRitualSingleTargetChatCard } from "../../../../../src/features/item-use/chat-card/item-use-chat-card-schema";
import type { ItemUseContext } from "../../../../../src/features/item-use/item-use-context";
import type { RitualCastSnapshot, AssistedRitualAction } from "../../../../../src/features/rituals/ritual-assisted-workflow";
import { renderRitualSingleTargetCard } from "../../../../../src/ui/components/ritual/ritual-single-target-card";

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
  it("falls back instead of silently discarding multiple effect rolls", () => {
    const twoEffects = { ...snapshot, rolls: [...snapshot.rolls, { ...snapshot.rolls[0]!, id: "second" }] };
    expect(resolveRitualSingleTargetEligibility({ mode: "auto", systemId: "ordemparanormal", context, snapshot: twoEffects, actions, resistanceDifficulty: 15 })).toEqual({ eligible: false, reason: "multiple-effect-rolls" });
    const ritualAndEffect = { ...snapshot, rolls: [{ ...snapshot.rolls[0]!, id: "ritual", intent: "ritual" as const }, snapshot.rolls[0]!] };
    expect(resolveRitualSingleTargetEligibility({ mode: "auto", systemId: "ordemparanormal", context, snapshot: ritualAndEffect, actions, resistanceDifficulty: 15 })).toEqual({ eligible: true });
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
  it("renders element and real circle in the header badge with legacy fallback", () => {
    const state = buildRitualChatCardState({ context, snapshot, actions, resistanceDifficulty: 15 });
    state.ritualIdentity = { elementKey: "energy", elementLabel: "Energia", circle: 2 };
    expect(buildRitualSingleTargetCardViewModel(state).header.badges?.[0]?.label).toBe("Energia 2");
    delete state.ritualIdentity;
    expect(buildRitualSingleTargetCardViewModel(state).header.badges?.[0]?.label).toBe("Ritual");
  });
  it("supports healing, utility and absent conjuration", () => {
    for (const intent of ["healing", "generic"] as const) {
      const state = buildRitualChatCardState({ context, snapshot: { ...snapshot, castingCheck: null, resistance: null, rolls: [{ ...snapshot.rolls[0]!, intent }] }, actions: [], resistanceDifficulty: null });
      const model = buildRitualSingleTargetCardViewModel(state);
      expect(model.conjuration).toBeUndefined();
      expect(model.effect?.title).toBe(intent === "healing" ? "Cura" : "Efeito");
    }
  });
  it.each([["cold", "Frio"], ["fire", "Fogo"], ["electric", "Eletricidade"], ["customType", "CustomType"]])("localizes damage type %s", (damageType, label) => {
    const state = buildRitualChatCardState({ context, snapshot: { ...snapshot, rolls: [{ ...snapshot.rolls[0]!, damageType }] }, actions: [], resistanceDifficulty: 15 });
    expect(buildRitualSingleTargetCardViewModel(state).effect?.typeLabel).toBe(label);
  });
  it("groups outcome conditions into one row while preserving individual state", () => {
    const state = buildRitualChatCardState({ context, snapshot, actions: [...actions, { ...actions[0]!, conditionId: "weak", label: "Fraco", resistanceOutcome: "success" }], resistanceDifficulty: 15 });
    expect(state.actions).toHaveLength(2);
    const pending = buildRitualSingleTargetCardViewModel(state).assistedActions?.rows;
    expect(pending).toHaveLength(1);
    expect(pending?.[0]).toMatchObject({ label: "Efeitos da resistência", control: { state: "disabled" } });
    state.resistance!.result = { skill: "will", skillLabel: "Vontade", formula: "1d20", total: 20, diceResults: [20], difficulty: 15, outcome: "success", targetActorId: "target", targetActorUuid: null, targetName: "Alvo", rolledAt: "now", userId: "gm", usedFallbackBonus: false };
    state.actions = state.actions.map((action) => ({ ...action, state: "available" }));
    const resolved = buildRitualSingleTargetCardViewModel(state).assistedActions?.rows;
    expect(resolved).toHaveLength(1);
    expect(resolved?.[0].description).toBe("Sucesso · 2 efeitos");
    expect(resolved?.[0].details?.items).toEqual(["Abalado · duração indefinida", "Fraco · duração indefinida"]);
    expect(resolved?.[0].control).toMatchObject({ state: "active", button: { actionKind: "apply-resistance-outcome-conditions" } });
    const html = renderRitualSingleTargetCard(buildRitualSingleTargetCardViewModel(state));
    expect(html).toContain("<details");
    expect(html).not.toContain("<details open");
    expect(html).toContain("Ver efeitos");
    expect(html).toContain("Ocultar efeitos");
  });
  it("uses compact disabled completed buttons", () => {
    for (const prefix of ["✓", "✔", "✓ ✓", "✔ ✔"]) expect(normalizeExecutedLabel(`${prefix} Aplicado`)).toBe("Aplicado");
    const resource: AssistedRitualAction = { kind: "resource-operation", actor: target, actorName: "Alvo", resource: "PV", operation: "heal", amount: 2, label: "Curar", executedLabel: "✓ ✔ ✓ Cura aplicada", actionSectionId: "healing", actionSectionTitle: "Cura" };
    const state = buildRitualChatCardState({ context, snapshot: { ...snapshot, resistance: null }, actions: [resource], resistanceDifficulty: null });
    state.actions[0]!.state = "completed";
    const html = renderRitualSingleTargetCard(buildRitualSingleTargetCardViewModel(state));
    expect(html).toContain("✓ Aplicado");
    expect(html).toMatch(/<button[^>]*disabled[^>]*>✓ Aplicado<\/button>/u);
    expect(html).not.toContain("completion-indicator__check");
  });
  it("uses singular effect summary and the same completed button for grouped conditions", () => {
    const state = buildRitualChatCardState({ context, snapshot, actions, resistanceDifficulty: 15 });
    state.resistance!.result = { skill: "will", skillLabel: "Vontade", formula: "1d20", total: 20, diceResults: [20], difficulty: 15, outcome: "success", targetActorId: "target", targetActorUuid: null, targetName: "Alvo", rolledAt: "now", userId: "gm", usedFallbackBonus: false };
    state.actions[0]!.state = "completed";
    const model = buildRitualSingleTargetCardViewModel(state);
    expect(model.assistedActions?.rows[0]?.description).toContain("Sucesso · 1 efeito");
    expect(model.assistedActions?.rows[0]?.control).toMatchObject({ state: "disabled", button: { label: "✓ Aplicado", disabled: true } });
  });
  it("recognizes the discriminated v2 schema", () => {
    const state = buildRitualChatCardState({ context, snapshot, actions, resistanceDifficulty: 15 });
    expect(isRitualSingleTargetChatCard({ schemaVersion: 2, kind: "ritual", renderer: "single-target", revision: 0, createdAt: 1, messageId: "m", state, legacyFallback: { summaryLines: [], itemName: item.name, actorId: actor.id, itemId: item.id } })).toBe(true);
    expect(isRitualSingleTargetChatCard({ schemaVersion: 3 })).toBe(false);
  });
});
