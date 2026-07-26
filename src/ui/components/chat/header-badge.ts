export type HeaderBadgeTone = "accent" | "neutral" | "wine";

export interface HeaderBadgeViewModel {
  label: string;
  tone?: HeaderBadgeTone;
}

export function renderHeaderBadge(model: HeaderBadgeViewModel): string {
  const tone = model.tone ?? "accent";
  return `<span class="paranormal-toolkit-header-badge paranormal-toolkit-header-badge--${tone}">${escapeHtml(model.label)}</span>`;
}
import { escapeHtml } from "../../rendering/escape-html";
