import { renderRollRow } from "../chat/roll-row";
import { renderSectionCard } from "../chat/section-card";
import { renderSectionHeader } from "../chat/section-header";
import {
  renderStatusBadge,
  type StatusBadgeState,
} from "../chat/status-badge";
import { escapeHtml } from "../../rendering/escape-html";

export interface RitualConjurationSectionViewModel {
  status: StatusBadgeState;
  skillLabel: string;
  total: number;
  difficultyClass: number;
  formula: string;
  diceResults?: readonly number[];
  expanded?: boolean;
  consequence?: string;
}

export function renderRitualConjurationSection(
  model: RitualConjurationSectionViewModel,
): string {
  const difficultyClass = escapeHtml(String(model.difficultyClass));
  const description = `<p class="paranormal-toolkit-ritual-conjuration-section__result-description"><span class="paranormal-toolkit-ritual-conjuration-section__skill">${escapeHtml(model.skillLabel)}</span> <span class="paranormal-toolkit-ritual-conjuration-section__comparison">contra</span> <strong class="paranormal-toolkit-ritual-conjuration-section__metric">DT ${difficultyClass}</strong></p>`;
  const consequenceValue = model.consequence?.trim();
  const consequence = consequenceValue
    ? `<p class="paranormal-toolkit-ritual-conjuration-section__consequence"><span class="paranormal-toolkit-ritual-conjuration-section__consequence-label">Consequência:</span> ${escapeHtml(consequenceValue)}</p>`
    : "";
  const content =
    renderSectionHeader({
      title: "Conjuração",
      trailing: renderStatusBadge({ state: model.status }),
    }) +
    description +
    renderRollRow({
      formula: model.formula,
      total: model.total,
      resultTone: model.status,
      diceResults: model.diceResults,
      expanded: model.expanded,
    }) +
    consequence;

  return renderSectionCard({ tone: "casting", content });
}
