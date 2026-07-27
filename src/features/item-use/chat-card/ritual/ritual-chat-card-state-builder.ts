import { resolveOrdemRitualImage, resolveOrdemRitualPresentation } from "../../../../adapters/ordem/ordem-ritual-presentation";
import type { ItemUseContext } from "../../item-use-context";
import type { AssistedRitualAction, RitualCastSnapshot } from "../../../rituals/ritual-assisted-workflow";
import { resolveSafeRitualDescription } from "../../../rituals/ritual-description-resolver";
import type { RitualCardAction, RitualChatCardState, RitualResistanceOutcome, SerializableDocumentRef } from "./ritual-chat-card-state";

export function buildRitualChatCardState(input: { context: ItemUseContext; snapshot: RitualCastSnapshot; actions: AssistedRitualAction[]; resistanceDifficulty: number | null; now?: number }): RitualChatCardState {
  const { context, snapshot } = input;
  if (!context.actor) throw new Error("Conjurador ausente.");
  const target = context.targets[0];
  if (target && !target.actor) throw new Error("Ator do alvo ausente.");
  const createdAt = input.now ?? Date.now();
  const main = snapshot.rolls.find((roll) => roll.intent !== "ritual") ?? null;
  return {
    schemaVersion: 1,
    castId: snapshot.castId,
    renderer: "single-target",
    source: ref(context.actor),
    item: ref(context.item),
    itemImage: resolveOrdemRitualImage(context.item),
    form: snapshot.form,
    ritualIdentity: resolveOrdemRitualPresentation(context.item),
    descriptionHtml: resolveSafeRitualDescription(context.item),
    cost: snapshot.cost,
    target: target?.actor ? { ...ref(target.actor), tokenId: target.tokenId, tokenUuid: target.sceneId && target.tokenId ? `Scene.${target.sceneId}.Token.${target.tokenId}` : null } : null,
    conjuration: snapshot.castingCheck ? { ...snapshot.castingCheck, diceResults: parseBreakdown(snapshot.castingCheck.diceBreakdown), consequence: snapshot.castingCheck.success ? null : "Falha na conjuração" } : null,
    mainRoll: main ? { id: main.id, label: main.intent === "damage" ? "Dano" : main.intent === "healing" ? "Cura" : "Efeito", intent: main.intent === "damage" || main.intent === "healing" ? main.intent : "utility", formula: main.formula, total: main.total, diceResults: main.diceResults, damageType: main.damageType } : null,
    resistance: snapshot.resistance && input.resistanceDifficulty !== null ? { skill: snapshot.resistance.skill, skillLabel: snapshot.resistance.label, difficulty: input.resistanceDifficulty, effect: snapshot.resistance.summary, status: "pending", result: null } : null,
    actions: input.actions.map((action, index) => serializeAction(snapshot.castId, action, index)),
    createdAt,
  };
}
function ref(document: Actor | Item): SerializableDocumentRef { return { id: document.id ?? null, uuid: document.uuid ?? null, name: document.name ?? "Documento sem nome" }; }
function parseBreakdown(value: string | null): number[] { return value?.match(/-?\d+/gu)?.map(Number).filter(Number.isFinite) ?? []; }
function serializeAction(castId: string, action: AssistedRitualAction, index: number): RitualCardAction {
  const outcome = action.kind === "condition-application" && action.resistanceOutcome !== "always"
    ? action.resistanceOutcome as RitualResistanceOutcome | undefined
    : action.kind === "damage-application" ? action.resistanceOutcome : undefined;
  const base = { id: `${castId}:action:${index + 1}`, state: outcome ? "pending" as const : "available" as const, label: action.label, executedLabel: action.executedLabel, actor: ref(action.actor), choiceGroupId: action.kind !== "condition-application" ? action.choiceGroupId ?? null : null, outcome: outcome ?? null, completedAt: null, completedByUserId: null };
  if (action.kind === "resource-operation") return { ...base, kind: action.kind, resource: action.resource, operation: action.operation, amount: action.amount };
  if (action.kind === "damage-application") return { ...base, kind: action.kind, instances: action.instances.map((entry) => ({ ...entry })), source: action.source, originUuid: action.originUuid, resistanceLabel: action.resistanceLabel ?? null };
  return { ...base, kind: action.kind, conditionId: action.conditionId, duration: action.duration ? structuredClone(action.duration) : null, source: action.source, originUuid: action.originUuid };
}
