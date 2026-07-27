import type { RitualSingleTargetCardViewModel } from "../../../../ui/components/ritual/ritual-single-target-card";
import type { RitualCardAction, RitualChatCardState } from "./ritual-chat-card-state";

export function buildRitualSingleTargetCardViewModel(state: RitualChatCardState): RitualSingleTargetCardViewModel {
  const roll = state.mainRoll;
  return {
    header: { title: state.item.name, subtitle: state.form.label, context: `${state.source.name} → ${state.target.name}`, badges: [{ label: "Ritual", tone: "wine" }] },
    metadata: { items: [state.cost ? `${state.cost.amount} ${state.cost.resource}` : null, state.target.name].filter((text): text is string => Boolean(text)).map((text) => ({ text })) },
    conjuration: state.conjuration ? { status: state.conjuration.success ? "success" : "failure", skillLabel: state.conjuration.skillLabel, total: state.conjuration.total, difficultyClass: state.conjuration.difficulty, formula: state.conjuration.formula, diceResults: state.conjuration.diceResults, consequence: state.conjuration.consequence ?? undefined } : undefined,
    effect: roll ? { title: roll.intent === "damage" ? "Dano" : roll.intent === "healing" ? "Cura" : "Efeito", typeLabel: roll.damageType ?? undefined, formula: roll.formula, total: roll.total, diceResults: roll.diceResults } : undefined,
    resistance: state.resistance ? { skill: state.resistance.skillLabel, difficultyLabel: `DT ${state.resistance.difficulty}`, outcome: state.resistance.result ? (state.resistance.result.outcome === "success" ? "Sucesso" : "Falha") : state.resistance.effect, action: { ariaLabel: `Rolar ${state.resistance.skillLabel}`, actionId: `${state.castId}:resistance`, disabled: Boolean(state.resistance.result) }, result: state.resistance.result ? { formula: state.resistance.result.formula, total: state.resistance.result.total, diceResults: state.resistance.result.diceResults } : undefined } : undefined,
    assistedActions: state.actions.length ? { rows: state.actions.map(actionRow) } : undefined,
  };
}
function actionRow(action: RitualCardAction) {
  const completed = action.state === "completed" || action.state === "resolved";
  return {
    label: action.label,
    description: action.state === "resolved" ? "Alternativa não aplicável" : action.actor.name,
    control: completed
      ? { state: "completed" as const, indicator: { label: action.state === "resolved" ? "Resolvida" : action.executedLabel } }
      : { state: action.state === "available" ? "active" as const : "disabled" as const, button: { label: isHealing(action) ? "Curar" : "Aplicar", actionId: action.id, actionKind: action.kind === "damage-application" ? "apply-damage" : action.kind === "condition-application" ? "apply-condition" : isHealing(action) ? "apply-healing" : "apply-resource" } },
  };
}
function isHealing(action: RitualCardAction): boolean { return action.kind === "resource-operation" && (action.operation === "heal" || action.operation === "recover"); }
