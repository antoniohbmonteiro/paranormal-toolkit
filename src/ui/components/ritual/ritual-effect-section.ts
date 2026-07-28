import { escapeHtml } from "../../rendering/escape-html";
import {
  renderDamageTypeBadge,
  type DamageTypeBadgeViewModel,
} from "../chat/damage-type-badge";
import { renderRollRow } from "../chat/roll-row";
import { renderSectionCard } from "../chat/section-card";
import { renderSectionHeader } from "../chat/section-header";

export interface RitualEffectSectionViewModel {
  title: "Dano" | "Cura" | "Efeito";
  damageTypeBadge?: DamageTypeBadgeViewModel;
  resultLabel?: string;
  formula: string;
  total?: number;
  diceResults?: readonly number[];
}

export function renderRitualEffectSection(
  model: RitualEffectSectionViewModel,
): string {
  const trailing = model.damageTypeBadge
    ? renderDamageTypeBadge(model.damageTypeBadge)
    : undefined;
  const resultLabel =
    typeof model.resultLabel === "string" ? model.resultLabel.trim() : "";
  const tone =
    model.title === "Dano"
      ? "damage"
      : model.title === "Cura"
        ? "healing"
        : "effect";
  const result =
    model.title === "Efeito" && resultLabel
      ? `<strong class="paranormal-toolkit-ritual-effect-section__result-label">${escapeHtml(resultLabel)}</strong>`
      : "";
  return renderSectionCard({
    tone,
    content:
      renderSectionHeader({ title: model.title, trailing }) +
      result +
      renderRollRow(model),
  });
}
