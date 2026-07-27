import { getToolkitDamageTypeLabel } from "../../../../core/damage/damage-types";
import type { AssistedActionRowViewModel } from "../../../../ui/components/chat/assisted-action-row";
import type { RitualSingleTargetCardViewModel } from "../../../../ui/components/ritual/ritual-single-target-card";
import type { RitualCardAction, RitualChatCardState, RitualConditionAction, RitualResistanceOutcome } from "./ritual-chat-card-state";

export function buildRitualSingleTargetCardViewModel(state: RitualChatCardState): RitualSingleTargetCardViewModel {
  const roll = state.mainRoll;
  const resistanceOutcome = state.resistance?.result?.outcome ?? null;
  const rows = createActionRows(state.actions, resistanceOutcome, state.target.name);
  return {
    header: { title: state.item.name, subtitle: state.form.label, context: `${state.source.name} → ${state.target.name}`, badges: [{ label: state.ritualIdentity ? `${state.ritualIdentity.elementLabel} ${state.ritualIdentity.circle}` : "Ritual", tone: "wine" }] },
    description: state.descriptionHtml?.trim() ? { html: state.descriptionHtml } : undefined,
    metadata: { items: [state.cost ? `${state.cost.amount} ${state.cost.resource}` : null, state.target.name].filter((text): text is string => Boolean(text)).map((text) => ({ text })) },
    conjuration: state.conjuration ? { status: state.conjuration.success ? "success" : "failure", skillLabel: state.conjuration.skillLabel, total: state.conjuration.total, difficultyClass: state.conjuration.difficulty, formula: state.conjuration.formula, diceResults: state.conjuration.diceResults, consequence: state.conjuration.consequence ?? undefined } : undefined,
    effect: roll ? { title: roll.intent === "damage" ? "Dano" : roll.intent === "healing" ? "Cura" : "Efeito", typeLabel: roll.damageType ? getToolkitDamageTypeLabel(roll.damageType) : undefined, formula: roll.formula, total: roll.total, diceResults: roll.diceResults } : undefined,
    resistance: state.resistance ? {
      skill: state.resistance.skillLabel,
      difficultyLabel: `DT ${state.resistance.difficulty}`,
      description: state.resistance.status === "uncertain" ? "Resultado incerto; verifique o alvo antes de prosseguir." : state.resistance.effect,
      status: resistanceOutcome ?? "pending",
      action: { ariaLabel: `Rolar ${state.resistance.skillLabel}`, actionId: `${state.castId}:resistance`, disabled: state.resistance.status !== "pending" },
      result: state.resistance.result ? { formula: state.resistance.result.formula, total: state.resistance.result.total, diceResults: state.resistance.result.diceResults } : undefined,
    } : undefined,
    assistedActions: rows.length ? { rows } : undefined,
  };
}

export function normalizeExecutedLabel(value: string): string {
  return value.replace(/^(?:\s*[✓✔]\s*)+/u, "").trim();
}

function createActionRows(actions: RitualCardAction[], outcome: RitualResistanceOutcome | null, targetName: string): AssistedActionRowViewModel[] {
  const conditional = actions.filter((action): action is RitualConditionAction => action.kind === "condition-application" && action.outcome !== null);
  const ordinary = actions.filter((action) => !(action.kind === "condition-application" && action.outcome !== null));
  const rows = ordinary.map(actionRow);
  if (conditional.length) rows.push(resistanceConditionsRow(conditional, outcome, targetName));
  return rows;
}

function resistanceConditionsRow(actions: RitualConditionAction[], outcome: RitualResistanceOutcome | null, targetName: string): AssistedActionRowViewModel {
  if (!outcome) {
    return { label: "Efeitos da resistência", description: "Aguardando resistência", control: { state: "disabled", button: { label: "Aplicar", disabled: true, actionId: "resistance-outcome-conditions", actionKind: "apply-resistance-outcome-conditions" } } };
  }
  const selected = actions.filter((action) => action.outcome === outcome);
  const available = selected.filter((action) => action.state === "available");
  const completed = selected.filter((action) => action.state === "completed");
  const effectCount = selected.length;
  const outcomeLabel = outcome === "success" ? "Sucesso" : "Falha";
  const description = `${outcomeLabel} · ${effectCount} ${effectCount === 1 ? "efeito" : "efeitos"}`;
  const details = { items: selected.map(formatConditionDetail) };
  if (selected.length > 0 && completed.length === selected.length) {
    return { label: "Efeitos da resistência", description: `${description} · ${targetName}`, details, control: completedButton() };
  }
  const partial = completed.length > 0;
  return {
    label: "Efeitos da resistência",
    description: partial ? `${description} · aplicação parcial` : description,
    details,
    control: { state: available.length ? "active" : "disabled", button: { label: partial ? "Aplicar pendentes" : "Aplicar", disabled: !available.length, actionId: "resistance-outcome-conditions", actionKind: "apply-resistance-outcome-conditions" } },
  };
}

function formatConditionDetail(action: RitualConditionAction): string {
  const label = action.label.replace(/^(?:Sucesso|Falha)\s*·\s*/iu, "");
  const [name, duration] = label.split(/:\s*/u, 2);
  return `${name ?? "Condição"} · ${duration ?? "duração indefinida"}`;
}

function actionRow(action: RitualCardAction): AssistedActionRowViewModel {
  const terminal = action.state === "completed" || action.state === "resolved" || action.state === "uncertain";
  return {
    label: action.label,
    description: action.state === "resolved" ? "Alternativa não aplicável" : action.state === "uncertain" ? "Verifique no alvo antes de tentar novamente" : action.actor.name,
    control: terminal
      ? action.state === "completed" ? completedButton() : { state: "completed", indicator: { label: action.state === "resolved" ? "Resolvida" : "Aplicação incerta" } }
      : { state: action.state === "available" ? "active" : "disabled", button: { label: isHealing(action) ? "Curar" : "Aplicar", actionId: action.id, actionKind: action.kind === "damage-application" ? "apply-damage" : action.kind === "condition-application" ? "apply-condition" : isHealing(action) ? "apply-healing" : "apply-resource" } },
  };
}
function completedButton(): AssistedActionRowViewModel["control"] { return { state: "disabled", button: { label: "✓ Aplicado", disabled: true } }; }
function isHealing(action: RitualCardAction): boolean { return action.kind === "resource-operation" && (action.operation === "heal" || action.operation === "recover"); }
