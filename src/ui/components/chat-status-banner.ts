import { escapeHtml, markTrustedHtml, type HtmlString } from "./component-html";

export type ChatStatusBannerTone =
  | "success"
  | "failure"
  | "info"
  | "resource"
  | "warning"
  | "manual";

export type ChatStatusBannerModel = {
  tone: ChatStatusBannerTone;
  title?: string | null;
  message: string;
};

export function renderChatStatusBanner(model: ChatStatusBannerModel): HtmlString {
  return markTrustedHtml(`
    <aside class="paranormal-toolkit-chat-status paranormal-toolkit-chat-status--${model.tone}">
      ${model.title ? `<strong class="paranormal-toolkit-chat-status__title">${escapeHtml(model.title)}</strong>` : ""}
      <p class="paranormal-toolkit-chat-status__message">${escapeHtml(model.message)}</p>
    </aside>
  `);
}
