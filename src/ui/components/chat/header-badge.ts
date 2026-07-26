export type HeaderBadgeTone = "accent" | "neutral" | "wine";

export interface HeaderBadgeViewModel {
  label: string;
  tone?: HeaderBadgeTone;
}

function escapeHtml(value: string): string {
  return value.replace(
    /[&<>"']/g,
    (character) =>
      ({
        "&": "&amp;",
        "<": "&lt;",
        ">": "&gt;",
        '"': "&quot;",
        "'": "&#039;",
      })[character] ?? character,
  );
}

export function renderHeaderBadge(model: HeaderBadgeViewModel): string {
  const tone = model.tone ?? "accent";
  return `<span class="paranormal-toolkit-header-badge paranormal-toolkit-header-badge--${tone}">${escapeHtml(model.label)}</span>`;
}
