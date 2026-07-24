import { escapeHtml, markTrustedHtml, type HtmlString } from "./component-html";

export type ChatCardMetadataEntry = {
  label: string;
  value: string;
};

export type ChatCardMetadataModel = {
  entries: readonly ChatCardMetadataEntry[];
};

export function renderChatCardMetadata(model: ChatCardMetadataModel): HtmlString {
  const entries = model.entries
    .map(
      (entry) => `
        <div class="paranormal-toolkit-chat-card-metadata__entry">
          <dt class="paranormal-toolkit-chat-card-metadata__label">${escapeHtml(entry.label)}</dt>
          <dd class="paranormal-toolkit-chat-card-metadata__value">${escapeHtml(entry.value)}</dd>
        </div>`,
    )
    .join("");

  return markTrustedHtml(`
    <dl class="paranormal-toolkit-chat-card-metadata">
      ${entries}
    </dl>
  `);
}
