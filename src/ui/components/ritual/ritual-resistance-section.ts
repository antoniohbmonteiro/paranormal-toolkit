import { renderDiceActionButton, type DiceActionButtonViewModel } from "../chat/dice-action-button";
import { renderRollRow } from "../chat/roll-row";
import { renderSectionCard } from "../chat/section-card";
import { renderSectionHeader } from "../chat/section-header";
import { renderStatusBadge } from "../chat/status-badge";
import { escapeHtml } from "../../rendering/escape-html";

export interface RitualResistanceSectionViewModel {
  skill: string;
  difficultyLabel: string;
  description?: string;
  status: "pending" | "success" | "failure";
  action: DiceActionButtonViewModel;
  result?: { formula: string; total: number; diceResults?: readonly number[] };
}

export function renderRitualResistanceSection(model: RitualResistanceSectionViewModel): string {
  const resultStatus = model.status === "success" || model.status === "failure" ? model.status : null;
  const header = renderSectionHeader({
    title: "Resistência",
    trailing: resultStatus ? renderStatusBadge({ state: resultStatus }) : undefined,
  });
  const comparison = `<p class="paranormal-toolkit-ritual-resistance-section__summary"><strong class="paranormal-toolkit-ritual-resistance-section__metric">${escapeHtml(model.skill)}</strong> <span>contra</span> <strong class="paranormal-toolkit-ritual-resistance-section__metric">${escapeHtml(model.difficultyLabel)}</strong></p>`;
  const description = model.status === "pending" && model.description?.trim()
    ? `<p class="paranormal-toolkit-ritual-resistance-section__description">${escapeHtml(model.description)}</p>`
    : "";
  const result = model.result ? renderRollRow({ formula: model.result.formula, total: model.result.total, diceResults: model.result.diceResults, resultTone: resultStatus ?? "section" }) : "";
  const content = `<div class="paranormal-toolkit-ritual-resistance-section"><div class="paranormal-toolkit-ritual-resistance-section__text">${header}${comparison}${description}${result}</div>${model.result ? "" : renderDiceActionButton(model.action)}</div>`;
  return renderSectionCard({ tone: resultStatus ?? "resistance", content });
}
