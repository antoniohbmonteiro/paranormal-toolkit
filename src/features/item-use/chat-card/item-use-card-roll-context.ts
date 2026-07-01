import { MODULE_ID } from "../../../constants";
import {
  CHAT_CARD_FLAG_KEY,
  PROMPT_CLASS,
  RESISTANCE_ROLL_BUTTON_SELECTOR,
  RESISTANCE_ROLL_RESULT_SELECTOR
} from "./item-use-chat-card-constants";

const PROMPT_ID_ATTRIBUTE = "data-paranormal-toolkit-prompt-id";
const RESISTANCE_ROLL_RESULT_ATTRIBUTE = "data-paranormal-toolkit-resistance-roll-result";
const SUMMARY_KEY_CASTING_DIFFICULTY = "Conjuração DT";

type PersistedToolkitChatCard = {
  prompts?: unknown[];
};

type PersistedPromptLike = {
  pendingId?: unknown;
  actorId?: unknown;
  buttonLabel?: unknown;
  summaryLines?: unknown;
};

type ChatMessageFlagDocument = {
  id?: unknown;
  getFlag?: (scope: string, key: string) => unknown;
};

export function readResistanceTotal(rollCard: HTMLElement): number | null {
  const buttonTotal = rollCard.querySelector<HTMLElement>(RESISTANCE_ROLL_BUTTON_SELECTOR)
    ?.getAttribute(RESISTANCE_ROLL_RESULT_ATTRIBUTE);
  const parsedButtonTotal = parseInteger(buttonTotal);
  if (parsedButtonTotal !== null) return parsedButtonTotal;

  const resultText = rollCard.querySelector<HTMLElement>(RESISTANCE_ROLL_RESULT_SELECTOR)?.textContent ?? null;
  const match = resultText ? /=\s*(-?\d+)\s*$/u.exec(resultText) : null;
  return parseInteger(match?.[1] ?? null);
}

export function readCastingDifficulty(rollCard: HTMLElement): number | null {
  const prompt = readPersistedPromptForRollCard(rollCard);
  const persistedDifficulty = readDifficultyFromPersistedPrompt(prompt);
  if (persistedDifficulty !== null) return persistedDifficulty;

  const actorDifficulty = readDifficultyFromPromptActor(prompt);
  if (actorDifficulty !== null) return actorDifficulty;

  return readLegacyDifficultyFromRenderedCard(rollCard);
}

export function readPersistedButtonLabelForButton(button: HTMLButtonElement): string | null {
  const promptId = button.getAttribute(PROMPT_ID_ATTRIBUTE);
  if (!promptId) return null;

  const message = resolveChatMessageDocumentFromElement(button);
  const card = readToolkitChatCard(message);
  const prompts = Array.isArray(card?.prompts) ? card.prompts : [];
  const prompt = prompts.find((candidate): candidate is PersistedPromptLike => {
    if (!isRecord(candidate)) return false;
    return candidate.pendingId === promptId;
  });

  const buttonLabel = prompt?.buttonLabel;
  return typeof buttonLabel === "string" && buttonLabel.trim().length > 0 ? buttonLabel.trim() : null;
}

export function normalizeText(value: string | null | undefined): string {
  return value?.trim().toLocaleLowerCase() ?? "";
}

export function normalizeLookupText(value: string | null | undefined): string {
  return normalizeText(value)
    .normalize("NFD")
    .replace(/\p{Diacritic}/gu, "");
}

function readDifficultyFromPersistedPrompt(prompt: PersistedPromptLike | null): number | null {
  const summaryLines = getPromptSummaryLines(prompt);
  if (summaryLines.length === 0) return null;

  return parseInteger(findSummaryValue(summaryLines, SUMMARY_KEY_CASTING_DIFFICULTY));
}

function readDifficultyFromPromptActor(prompt: PersistedPromptLike | null): number | null {
  const actorId = typeof prompt?.actorId === "string" ? prompt.actorId : null;
  if (!actorId) return null;

  const actors = game.actors as { get?: (id: string) => unknown } | undefined;
  const actor = actors?.get?.(actorId);
  if (!actor || typeof actor !== "object") return null;

  return readNestedInteger(actor, ["system", "ritual", "DT"])
    ?? readNestedInteger(actor, ["system", "ritual", "dt"]);
}

function readLegacyDifficultyFromRenderedCard(rollCard: HTMLElement): number | null {
  const castingDescription = Array.from(rollCard.querySelectorAll<HTMLElement>(`.${PROMPT_CLASS}__workflow-section--casting .${PROMPT_CLASS}__workflow-section-description`))
    .map((element) => element.textContent)
    .find((text) => typeof text === "string" && text.includes("DT"));

  if (!castingDescription) return null;

  const match = /\bDT\s*(-?\d+)\b/iu.exec(castingDescription);
  return parseInteger(match?.[1] ?? null);
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

function getPromptSummaryLines(prompt: PersistedPromptLike | null): string[] {
  if (!Array.isArray(prompt?.summaryLines)) return [];

  return prompt.summaryLines.filter((line): line is string => typeof line === "string");
}

function findSummaryValue(summaryLines: string[], key: string): string | null {
  const prefix = `${key}:`;

  for (const line of summaryLines) {
    if (!line.startsWith(prefix)) continue;

    const value = line.slice(prefix.length).trim();
    if (value.length > 0) return value;
  }

  return null;
}

function readNestedInteger(source: unknown, path: string[]): number | null {
  let current = source;

  for (const segment of path) {
    if (!isRecord(current)) return null;
    current = current[segment];
  }

  return typeof current === "number" ? Math.trunc(current) : parseInteger(typeof current === "string" ? current : null);
}

function parseInteger(value: string | null | undefined): number | null {
  if (!value) return null;
  const parsed = Number(value);
  return Number.isFinite(parsed) ? Math.trunc(parsed) : null;
}

function isChatMessageFlagDocument(value: unknown): value is ChatMessageFlagDocument {
  return Boolean(value && typeof value === "object" && typeof (value as ChatMessageFlagDocument).getFlag === "function");
}

function isRecord(value: unknown): value is Record<string, unknown> {
  return Boolean(value && typeof value === "object");
}
