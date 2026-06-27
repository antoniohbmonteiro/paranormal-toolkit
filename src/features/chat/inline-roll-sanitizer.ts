import { MODULE_ID } from "../../constants";
import { ModuleLogger } from "../../core/module-logger";
import type { ItemUseContext } from "../item-use/item-use-context";

const INLINE_ROLL_SELECTOR = ".inline-roll, .inline-result, a[data-roll], span[data-roll]";
const NEUTRALIZED_CLASS = `${MODULE_ID}-inline-roll-neutralized`;
const NOTICE_CLASS = `${MODULE_ID}-inline-roll-notice`;
const NEUTRALIZED_ATTRIBUTE = `data-${MODULE_ID}-inline-roll-neutralized`;
const NOTICE_ATTRIBUTE = `data-${MODULE_ID}-inline-roll-notice`;
const NOTICE_TEXT = "Rolagens inline da descrição ignoradas; resultado oficial gerado pelo Paranormal Toolkit.";

export type InlineRollSanitizerResult = {
  messageId: string | null;
  contentUpdated: boolean;
  contentReplacementCount: number;
  renderedReplacementCount: number;
};

export async function neutralizeAutomatedItemInlineRolls(context: ItemUseContext): Promise<InlineRollSanitizerResult> {
  const messageId = getDocumentId(context.message);
  const contentResult = await neutralizeMessageContent(context.message);
  const renderedResult = neutralizeRenderedMessage(messageId);
  const replacementCount = contentResult.replacementCount + renderedResult.replacementCount;

  if (replacementCount > 0) {
    ModuleLogger.info("Rolagens inline neutralizadas para item automatizado.", {
      itemId: context.item.id ?? null,
      itemName: context.item.name ?? "Item sem nome",
      messageId,
      contentReplacementCount: contentResult.replacementCount,
      renderedReplacementCount: renderedResult.replacementCount
    });
  }

  return {
    messageId,
    contentUpdated: contentResult.updated,
    contentReplacementCount: contentResult.replacementCount,
    renderedReplacementCount: renderedResult.replacementCount
  };
}

type MessageContentResult = {
  updated: boolean;
  replacementCount: number;
};

type RenderedContentResult = {
  replacementCount: number;
};

async function neutralizeMessageContent(message: unknown): Promise<MessageContentResult> {
  const messageLike = asChatMessageLike(message);

  if (!messageLike || typeof messageLike.content !== "string") {
    return { updated: false, replacementCount: 0 };
  }

  const sanitized = sanitizeInlineRollContent(messageLike.content);

  if (sanitized.replacementCount === 0 || sanitized.content === messageLike.content) {
    return { updated: false, replacementCount: sanitized.replacementCount };
  }

  const updated = await updateMessageContent(messageLike, sanitized.content);
  return { updated, replacementCount: sanitized.replacementCount };
}

function neutralizeRenderedMessage(messageId: string | null): RenderedContentResult {
  const root = messageId ? findRenderedChatMessageById(messageId) : null;

  if (!root) {
    return { replacementCount: 0 };
  }

  const replacementCount = neutralizeInlineRollElements(root);

  if (replacementCount > 0) {
    appendInlineRollNotice(findMessageContentHost(root));
  }

  return { replacementCount };
}

function sanitizeInlineRollContent(content: string): { content: string; replacementCount: number } {
  const rawSyntax = replaceRawInlineRollSyntax(content);
  const template = document.createElement("template");
  template.innerHTML = rawSyntax.content;

  const elementReplacementCount = neutralizeInlineRollElements(template.content);
  const replacementCount = rawSyntax.replacementCount + elementReplacementCount;

  if (replacementCount === 0) {
    return { content, replacementCount: 0 };
  }

  appendInlineRollNotice(template.content);
  return { content: template.innerHTML, replacementCount };
}

function replaceRawInlineRollSyntax(content: string): { content: string; replacementCount: number } {
  let replacementCount = 0;
  const replacedContent = content.replace(/\[\[([^\[\]]+)\]\]/g, (_match, formula: string) => {
    replacementCount += 1;
    return createNeutralizedInlineRollMarkup(formula.trim());
  });

  return { content: replacedContent, replacementCount };
}

function neutralizeInlineRollElements(root: ParentNode): number {
  const elements = collectInlineRollElements(root);

  for (const element of elements) {
    element.replaceWith(createNeutralizedInlineRollElement(extractInlineRollText(element)));
  }

  return elements.length;
}

function collectInlineRollElements(root: ParentNode): Element[] {
  const elements = new Set<Element>();

  for (const element of root.querySelectorAll(INLINE_ROLL_SELECTOR)) {
    if (element.getAttribute(NEUTRALIZED_ATTRIBUTE) === "true") continue;
    elements.add(element);
  }

  return Array.from(elements);
}

function createNeutralizedInlineRollMarkup(label: string): string {
  return `<span class="${NEUTRALIZED_CLASS}" ${NEUTRALIZED_ATTRIBUTE}="true" title="Rolagem inline ignorada pelo Paranormal Toolkit">${escapeHtml(label)}</span>`;
}

function createNeutralizedInlineRollElement(label: string): HTMLSpanElement {
  const span = document.createElement("span");
  span.classList.add(NEUTRALIZED_CLASS);
  span.setAttribute(NEUTRALIZED_ATTRIBUTE, "true");
  span.title = "Rolagem inline ignorada pelo Paranormal Toolkit";
  span.textContent = label;
  return span;
}

function appendInlineRollNotice(root: ParentNode): void {
  if (root.querySelector?.(`[${NOTICE_ATTRIBUTE}="true"]`)) return;

  const notice = document.createElement("p");
  notice.classList.add(NOTICE_CLASS);
  notice.setAttribute(NOTICE_ATTRIBUTE, "true");
  notice.textContent = NOTICE_TEXT;

  (root as Element | DocumentFragment).append(notice);
}

function findMessageContentHost(root: HTMLElement): HTMLElement {
  return root.querySelector<HTMLElement>(".message-content") ?? root;
}

function extractInlineRollText(element: Element): string {
  const formula = element.getAttribute("data-formula") ?? extractFormulaFromDataRoll(element.getAttribute("data-roll"));
  const text = formula ?? element.textContent?.trim().replace(/\s+/g, " ");
  return text && text.length > 0 ? text : "rolagem inline";
}

function extractFormulaFromDataRoll(dataRoll: string | null): string | null {
  if (!dataRoll) return null;

  try {
    const parsed = JSON.parse(dataRoll) as { formula?: unknown };
    return typeof parsed.formula === "string" && parsed.formula.length > 0 ? parsed.formula : null;
  } catch {
    return null;
  }
}

type ChatMessageLike = {
  id?: unknown;
  content?: unknown;
  update?: (data: { content: string }) => Promise<unknown> | unknown;
};

function asChatMessageLike(value: unknown): ChatMessageLike | null {
  return value && typeof value === "object" ? (value as ChatMessageLike) : null;
}

async function updateMessageContent(message: ChatMessageLike, content: string): Promise<boolean> {
  if (typeof message.update !== "function") {
    return false;
  }

  try {
    await Promise.resolve(message.update({ content }));
    return true;
  } catch (cause) {
    ModuleLogger.warn("Não foi possível atualizar o conteúdo da mensagem para neutralizar rolagens inline.", cause);
    return false;
  }
}

function findRenderedChatMessageById(messageId: string): HTMLElement | null {
  const escapedMessageId = escapeCssAttributeValue(messageId);
  return document.querySelector<HTMLElement>(
    `.chat-message[data-message-id="${escapedMessageId}"], [data-message-id="${escapedMessageId}"]`
  );
}

function getDocumentId(value: unknown): string | null {
  if (!value || typeof value !== "object") return null;

  const documentLike = value as { id?: unknown };

  if (typeof documentLike.id === "string" && documentLike.id.length > 0) {
    return documentLike.id;
  }

  return null;
}

function escapeHtml(value: string): string {
  return value
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#039;");
}

function escapeCssAttributeValue(value: string): string {
  return value.replace(/\\/g, "\\\\").replace(/"/g, '\\"');
}
