import { renderHeaderBadge, type HeaderBadgeViewModel } from "./header-badge";
import { escapeHtml } from "../../rendering/escape-html";

export interface ChatCardHeaderImageViewModel {
  src?: string;
  alt?: string;
}

export interface ChatCardHeaderViewModel {
  image?: ChatCardHeaderImageViewModel;
  eyebrow?: string;
  title: string;
  subtitle?: string;
  badges?: readonly HeaderBadgeViewModel[];
  context?: string;
}

const IMAGE_PLACEHOLDER = `<svg class="paranormal-toolkit-chat-card-header__placeholder-icon" viewBox="0 0 24 24" aria-hidden="true"><path d="M5 4.5h10.5A2.5 2.5 0 0 1 18 7v13H7a2 2 0 0 1-2-2V4.5Zm2 0V17a3 3 0 0 0-1 .17M9 8h6M9 11h6" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"/></svg>`;

function renderImage(image: ChatCardHeaderImageViewModel | undefined): string {
  const src = image?.src?.trim();
  if (!src) return IMAGE_PLACEHOLDER;
  return `<img class="paranormal-toolkit-chat-card-header__image-content" src="${escapeHtml(src)}" alt="${escapeHtml(image?.alt ?? "")}">`;
}

export function renderChatCardHeader(model: ChatCardHeaderViewModel): string {
  const subtitle = model.subtitle
    ? `<span class="paranormal-toolkit-chat-card-header__subtitle">· ${escapeHtml(model.subtitle)}</span>`
    : "";
  const badges = model.badges?.length
    ? `<div class="paranormal-toolkit-chat-card-header__badges">${model.badges.map(renderHeaderBadge).join("")}</div>`
    : "";
  const eyebrow = model.eyebrow?.trim()
    ? `<span class="paranormal-toolkit-chat-card-header__eyebrow">${escapeHtml(model.eyebrow.trim())}</span>`
    : "";
  const eyebrowRow = eyebrow
    ? `<div class="paranormal-toolkit-chat-card-header__eyebrow-row">${eyebrow}${badges}</div>`
    : "";
  const headingBadges = eyebrow ? "" : badges;
  const context = model.context
    ? `<div class="paranormal-toolkit-chat-card-header__context">${escapeHtml(model.context)}</div>`
    : "";

  return `<header class="paranormal-toolkit-chat-card-header">
  <div class="paranormal-toolkit-chat-card-header__image">${renderImage(model.image)}</div>
  <div class="paranormal-toolkit-chat-card-header__content">
    ${eyebrowRow}
    <div class="paranormal-toolkit-chat-card-header__heading">
      <div class="paranormal-toolkit-chat-card-header__title-group">
        <span class="paranormal-toolkit-chat-card-header__title">${escapeHtml(model.title)}</span>${subtitle}
      </div>${headingBadges}
    </div>${context}
  </div>
</header>`;
}
