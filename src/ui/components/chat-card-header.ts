import { escapeHtml, markTrustedHtml, type HtmlString } from "./component-html";

export type ChatCardBadgeTone = "neutral" | "info" | "success" | "warning" | "danger" | "resource" | "accent";
export type ChatCardBadgeModel = { label: string; tone?: ChatCardBadgeTone };
export type ChatCardHeaderModel = {
  image?: { src?: string | null; alt?: string; fallbackSrc?: string };
  eyebrow: string; title: string; subtitle?: string | null;
  badges?: readonly ChatCardBadgeModel[];
};
const DEFAULT_IMAGE = "icons/svg/mystery-man.svg";

export function renderChatCardHeader(model: ChatCardHeaderModel): HtmlString {
  const image = model.image;
  const src = image?.src || image?.fallbackSrc || DEFAULT_IMAGE;
  const badges = model.badges?.length ? `<div class="paranormal-toolkit-chat-card-header__badges">${model.badges.map((badge) => `<span class="paranormal-toolkit-chat-card-header__badge paranormal-toolkit-chat-card-header__badge--${badge.tone ?? "neutral"}">${escapeHtml(badge.label)}</span>`).join("")}</div>` : "";
  return markTrustedHtml(`<header class="paranormal-toolkit-chat-card-header"><img class="paranormal-toolkit-chat-card-header__image" src="${escapeHtml(src)}" alt="${escapeHtml(image?.alt ?? "")}"><div class="paranormal-toolkit-chat-card-header__body"><p class="paranormal-toolkit-chat-card-header__eyebrow">${escapeHtml(model.eyebrow)}</p><h2 class="paranormal-toolkit-chat-card-header__title">${escapeHtml(model.title)}</h2>${model.subtitle ? `<p class="paranormal-toolkit-chat-card-header__subtitle">${escapeHtml(model.subtitle)}</p>` : ""}${badges}</div></header>`);
}
