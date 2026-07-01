import { MODULE_ID } from "../../../constants";
import { CHAT_CARD_FLAG_KEY } from "./item-use-chat-card-constants";

const PROMPT_ID_ATTRIBUTE = "data-paranormal-toolkit-prompt-id";
const MULTI_TARGET_RESISTANCE_RESULTS_KEY = "multiTargetResistanceResults";

export type MultiTargetResistanceResult = {
  targetId: string;
  targetName: string;
  skill: string;
  skillLabel: string;
  formula: string;
  total: number;
  diceBreakdown: string | null;
  rolledAt: string;
};

type ChatMessageFlagDocument = {
  id?: unknown;
  getFlag?: (scope: string, key: string) => unknown;
  setFlag?: (scope: string, key: string, value: unknown) => Promise<unknown> | unknown;
};

type PersistedToolkitChatCard = Record<string, unknown> & {
  prompts?: unknown[];
};

type PersistedPromptLike = Record<string, unknown> & {
  pendingId?: unknown;
  multiTargetResistanceResults?: unknown;
};

export function readPersistedMultiTargetResistanceResults(rollCard: HTMLElement): Map<string, MultiTargetResistanceResult> {
  const results = new Map<string, MultiTargetResistanceResult>();
  const prompt = readPersistedPromptForRollCard(rollCard);
  const source = prompt?.[MULTI_TARGET_RESISTANCE_RESULTS_KEY];

  if (!isRecord(source)) return results;

  for (const [targetId, value] of Object.entries(source)) {
    if (isMultiTargetResistanceResult(value) && value.targetId === targetId) {
      results.set(targetId, value);
    }
  }

  return results;
}

export async function persistMultiTargetResistanceResult(
  rollCard: HTMLElement,
  result: MultiTargetResistanceResult
): Promise<void> {
  const promptId = findPromptId(rollCard);
  if (!promptId) return;

  const message = resolveChatMessageDocumentFromElement(rollCard);
  const card = readToolkitChatCard(message);
  if (!message || !card || !Array.isArray(card.prompts)) return;

  let changed = false;
  const prompts = card.prompts.map((prompt) => {
    if (!isRecord(prompt) || prompt.pendingId !== promptId) return prompt;

    const existingResults = isRecord(prompt[MULTI_TARGET_RESISTANCE_RESULTS_KEY])
      ? prompt[MULTI_TARGET_RESISTANCE_RESULTS_KEY]
      : {};

    changed = true;
    return {
      ...prompt,
      [MULTI_TARGET_RESISTANCE_RESULTS_KEY]: {
        ...existingResults,
        [result.targetId]: result
      }
    } satisfies PersistedPromptLike;
  });

  if (!changed) return;

  await Promise.resolve(message.setFlag?.(MODULE_ID, CHAT_CARD_FLAG_KEY, {
    ...card,
    prompts
  }));
}

function readPersistedPromptForRollCard(rollCard: HTMLElement): PersistedPromptLike | null {
  const promptId = findPromptId(rollCard);
  if (!promptId) return null;

  const message = resolveChatMessageDocumentFromElement(rollCard);
  const card = readToolkitChatCard(message);
  const prompts = Array.isArray(card?.prompts) ? card.prompts : [];

  return prompts.find((prompt): prompt is PersistedPromptLike => {
    if (!isRecord(prompt)) return false;
    return prompt.pendingId === promptId;
  }) ?? null;
}

function findPromptId(rollCard: HTMLElement): string | null {
  const promptElement = rollCard.closest<HTMLElement>(`[${PROMPT_ID_ATTRIBUTE}]`)
    ?? rollCard.querySelector<HTMLElement>(`[${PROMPT_ID_ATTRIBUTE}]`)
    ?? rollCard.parentElement?.querySelector<HTMLElement>(`[${PROMPT_ID_ATTRIBUTE}]`)
    ?? null;

  return promptElement?.getAttribute(PROMPT_ID_ATTRIBUTE) ?? null;
}

function resolveChatMessageDocumentFromElement(element: HTMLElement): ChatMessageFlagDocument | null {
  const messageElement = element.closest<HTMLElement>("[data-message-id]");
  const messageId = messageElement?.dataset.messageId ?? null;
  if (!messageId) return null;

  const messages = game.messages as { get?: (messageId: string) => unknown } | undefined;
  const message = messages?.get?.(messageId);
  return isChatMessageFlagDocument(message) ? message : null;
}

function readToolkitChatCard(message: ChatMessageFlagDocument | null): PersistedToolkitChatCard | null {
  const value = message?.getFlag?.(MODULE_ID, CHAT_CARD_FLAG_KEY);
  return isRecord(value) ? (value as PersistedToolkitChatCard) : null;
}

function isMultiTargetResistanceResult(value: unknown): value is MultiTargetResistanceResult {
  if (!isRecord(value)) return false;

  return typeof value.targetId === "string"
    && typeof value.targetName === "string"
    && typeof value.skill === "string"
    && typeof value.skillLabel === "string"
    && typeof value.formula === "string"
    && typeof value.total === "number"
    && Number.isFinite(value.total)
    && (typeof value.diceBreakdown === "string" || value.diceBreakdown === null)
    && typeof value.rolledAt === "string";
}

function isChatMessageFlagDocument(value: unknown): value is ChatMessageFlagDocument {
  return Boolean(value && typeof value === "object" && typeof (value as ChatMessageFlagDocument).getFlag === "function");
}

function isRecord(value: unknown): value is Record<string, unknown> {
  return Boolean(value && typeof value === "object");
}
