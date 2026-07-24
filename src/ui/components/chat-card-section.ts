import { escapeHtml, markTrustedHtml, type HtmlString } from "./component-html";
export type ChatCardSectionTone = "generic" | "test" | "damage" | "healing" | "resistance";
export type ChatCardSectionModel = { title: string; description?: string | null; tone?: ChatCardSectionTone; content: HtmlString };
export function renderChatCardSection(model: ChatCardSectionModel): HtmlString {
  return markTrustedHtml(`<section class="paranormal-toolkit-chat-card-section paranormal-toolkit-chat-card-section--${model.tone ?? "generic"}"><h3 class="paranormal-toolkit-chat-card-section__title">${escapeHtml(model.title)}</h3>${model.description ? `<p class="paranormal-toolkit-chat-card-section__description">${escapeHtml(model.description)}</p>` : ""}<div class="paranormal-toolkit-chat-card-section__content">${model.content}</div></section>`);
}
