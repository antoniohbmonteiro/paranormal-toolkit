import {
  renderDiceActionButton,
  type DiceActionButtonViewModel,
} from "../chat/dice-action-button";
import { renderSectionCard } from "../chat/section-card";
import { renderRollRow } from "../chat/roll-row";
import { escapeHtml } from "../../rendering/escape-html";

export interface RitualResistanceSectionViewModel {
  skill: string;
  difficultyLabel: string;
  outcome: string;
  action: DiceActionButtonViewModel;
  result?: { formula: string; total: number; diceResults?: readonly number[] };
}

export function renderRitualResistanceSection(
  model: RitualResistanceSectionViewModel,
): string {
  const summary = `<p class="paranormal-toolkit-ritual-resistance-section__summary"><strong class="paranormal-toolkit-ritual-resistance-section__metric">${escapeHtml(model.skill)}</strong><span class="paranormal-toolkit-ritual-resistance-section__separator" aria-hidden="true"> · </span><strong class="paranormal-toolkit-ritual-resistance-section__metric">${escapeHtml(model.difficultyLabel)}</strong><span class="paranormal-toolkit-ritual-resistance-section__separator" aria-hidden="true"> · </span><span class="paranormal-toolkit-ritual-resistance-section__outcome">${escapeHtml(model.outcome)}</span></p>`;
  const result = model.result ? renderRollRow({ formula: model.result.formula, total: model.result.total, diceResults: model.result.diceResults }) : "";
  const content = `<div class="paranormal-toolkit-ritual-resistance-section"><div class="paranormal-toolkit-ritual-resistance-section__text"><div class="paranormal-toolkit-ritual-resistance-section__title">Resistência</div>${summary}${result}</div>${model.result ? "" : renderDiceActionButton(model.action)}</div>`;

  return renderSectionCard({ tone: "resistance", content });
}
