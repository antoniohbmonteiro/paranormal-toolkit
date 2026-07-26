import { renderRollRow } from "../chat/roll-row";
import { renderSectionCard } from "../chat/section-card";
import { renderSectionHeader } from "../chat/section-header";
import { escapeHtml } from "../../rendering/escape-html";

export interface RitualDamageSectionViewModel {
  damageType: string;
  formula: string;
  total?: number;
  diceResults?: readonly number[];
  expanded?: boolean;
}

export function renderRitualDamageSection(
  model: RitualDamageSectionViewModel,
): string {
  const damageType = model.damageType.trim();
  const trailing = damageType
    ? `<span class="paranormal-toolkit-ritual-damage-section__damage-type">${escapeHtml(damageType)}</span>`
    : undefined;
  const content =
    renderSectionHeader({ title: "Dano", trailing }) +
    renderRollRow({
      formula: model.formula,
      total: model.total,
      resultTone: "section",
      diceResults: model.diceResults,
      expanded: model.expanded,
    });

  return renderSectionCard({ tone: "damage", content });
}
