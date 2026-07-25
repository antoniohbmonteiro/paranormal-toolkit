export const CHAT_CARD_HEADER_BADGE_TONES = [
  "neutral",
  "blood",
  "death",
  "knowledge",
  "energy",
  "fear",
] as const;

export type ChatCardHeaderBadgeTone =
  (typeof CHAT_CARD_HEADER_BADGE_TONES)[number];

export type ChatCardHeaderBadgeViewModel = {
  label: string;
  tone?: ChatCardHeaderBadgeTone;
};

export type ChatCardHeaderViewModel = {
  imageUrl: string;
  imageAlt?: string;
  eyebrow: string;
  title: string;
  context?: string;
  badges?: readonly ChatCardHeaderBadgeViewModel[];
};

export function renderChatCardHeader(model: ChatCardHeaderViewModel): string {
  const badges = model.badges ?? [];
  const badgeMarkup = badges.length > 0
    ? `<div class="paranormal-toolkit-chat-card-header__badges">${badges
        .map(renderBadge)
        .join("")}</div>`
    : "";
  const context = model.context
    ? `<p class="paranormal-toolkit-chat-card-header__context">${escapeHtml(model.context)}</p>`
    : "";

  return `<header class="paranormal-toolkit-chat-card-header">
    <img class="paranormal-toolkit-chat-card-header__image" src="${escapeHtml(model.imageUrl)}" alt="${escapeHtml(model.imageAlt ?? "")}">
    <div class="paranormal-toolkit-chat-card-header__content">
      <div class="paranormal-toolkit-chat-card-header__topline">
        <span class="paranormal-toolkit-chat-card-header__eyebrow">${escapeHtml(model.eyebrow)}</span>
        ${badgeMarkup}
      </div>
      <h3 class="paranormal-toolkit-chat-card-header__title">${escapeHtml(model.title)}</h3>
      ${context}
    </div>
  </header>`;
}

function renderBadge(badge: ChatCardHeaderBadgeViewModel): string {
  const tone = badge.tone ?? "neutral";
  return `<span class="paranormal-toolkit-chat-card-header__badge paranormal-toolkit-chat-card-header__badge--${tone}">${escapeHtml(badge.label)}</span>`;
}

function escapeHtml(value: string): string {
  return value
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;")
    .replaceAll('"', "&quot;")
    .replaceAll("'", "&#039;");
}
