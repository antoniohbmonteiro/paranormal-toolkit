import type { DamageTypeBadgeTone } from "../../../core/damage/damage-types";
import { escapeHtml } from "../../rendering/escape-html";

export interface DamageTypeBadgeViewModel {
  label: string;
  tone: DamageTypeBadgeTone;
}

export function renderDamageTypeBadge(
  model: DamageTypeBadgeViewModel,
): string {
  const label = model.label.trim();
  if (!label) return "";
  const classes = [
    "paranormal-toolkit-damage-type-badge",
    `paranormal-toolkit-damage-type-badge--${model.tone}`,
  ].join(" ");
  return `<span class="${classes}">${escapeHtml(label)}</span>`;
}
