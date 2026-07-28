import { renderRollRow } from "../chat/roll-row";
import { renderSectionCard } from "../chat/section-card";
import { renderSectionHeader } from "../chat/section-header";
import {
  renderDamageTypeBadge,
  type DamageTypeBadgeViewModel,
} from "../chat/damage-type-badge";

export interface RitualDamageSectionViewModel {
  damageTypeBadge?: DamageTypeBadgeViewModel;
  formula: string;
  total?: number;
  diceResults?: readonly number[];
  expanded?: boolean;
}

export function renderRitualDamageSection(
  model: RitualDamageSectionViewModel,
): string {
  const trailing = model.damageTypeBadge
    ? renderDamageTypeBadge(model.damageTypeBadge)
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
