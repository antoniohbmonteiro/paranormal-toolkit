import { MODULE_ID } from "../../../constants";
import { CHAT_CARD_FLAG_KEY } from "./item-use-chat-card-constants";

const PROMPT_ID_ATTRIBUTE = "data-paranormal-toolkit-prompt-id";
const MULTI_TARGET_RESISTANCE_RESULTS_KEY = "multiTargetResistanceResults";
const MULTI_TARGET_DAMAGE_APPLICATIONS_KEY = "multiTargetDamageApplications";
const MULTI_TARGET_EFFECT_APPLICATIONS_KEY = "multiTargetEffectApplications";

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

export type MultiTargetDamageMode = "normal" | "half";

export type MultiTargetDamageApplication = {
  targetId: string;
  targetName: string;
  mode: MultiTargetDamageMode;
  inputAmount: number;
  finalDamage: number;
  blocked: number;
  appliedAt: string;
};

export type MultiTargetEffectApplication = {
  targetId: string;
  targetName: string;
  conditionId: string;
  conditionLabel: string;
  effectId: string | null;
  created: boolean;
  refreshed: boolean;
  appliedAt: string;
};

export type MultiTargetPromptContext = {
  actorId: string | null;
  itemId: string | null;
  itemName: string | null;
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
  actorId?: unknown;
  itemId?: unknown;
  itemName?: unknown;
  multiTargetResistanceResults?: unknown;
  multiTargetDamageApplications?: unknown;
  multiTargetEffectApplications?: unknown;
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
  await persistMultiTargetPromptEntry(rollCard, MULTI_TARGET_RESISTANCE_RESULTS_KEY, result.targetId, result);
}

export function readPersistedMultiTargetDamageApplications(rollCard: HTMLElement): Map<string, MultiTargetDamageApplication> {
  const applications = new Map<string, MultiTargetDamageApplication>();
  const prompt = readPersistedPromptForRollCard(rollCard);
  const source = prompt?.[MULTI_TARGET_DAMAGE_APPLICATIONS_KEY];

  if (!isRecord(source)) return applications;

  for (const [targetId, value] of Object.entries(source)) {
    if (isMultiTargetDamageApplication(value) && value.targetId === targetId) {
      applications.set(targetId, value);
    }
  }

  return applications;
}

export async function persistMultiTargetDamageApplication(
  rollCard: HTMLElement,
  application: MultiTargetDamageApplication
): Promise<void> {
  await persistMultiTargetPromptEntry(
    rollCard,
    MULTI_TARGET_DAMAGE_APPLICATIONS_KEY,
    application.targetId,
    application
  );
}

export function readPersistedMultiTargetEffectApplications(rollCard: HTMLElement): Map<string, MultiTargetEffectApplication> {
  const applications = new Map<string, MultiTargetEffectApplication>();
  const prompt = readPersistedPromptForRollCard(rollCard);
  const source = prompt?.[MULTI_TARGET_EFFECT_APPLICATIONS_KEY];

  if (!isRecord(source)) return applications;

  for (const [targetId, value] of Object.entries(source)) {
    if (isMultiTargetEffectApplication(value) && value.targetId === targetId) {
      applications.set(targetId, value);
    }
  }

  return applications;
}

export async function persistMultiTargetEffectApplication(
  rollCard: HTMLElement,
  application: MultiTargetEffectApplication
): Promise<void> {
  await persistMultiTargetPromptEntry(
    rollCard,
    MULTI_TARGET_EFFECT_APPLICATIONS_KEY,
    application.targetId,
    application
  );
}

export function readPersistedMultiTargetPromptContext(rollCard: HTMLElement): MultiTargetPromptContext | null {
  const prompt = readPersistedPromptForRollCard(rollCard);
  if (!prompt) return null;

  return {
    actorId: readNullableString(prompt.actorId),
    itemId: readNullableString(prompt.itemId),
    itemName: readNullableString(prompt.itemName)
  };
}

async function persistMultiTargetPromptEntry(
  rollCard: HTMLElement,
  key:
    | typeof MULTI_TARGET_RESISTANCE_RESULTS_KEY
    | typeof MULTI_TARGET_DAMAGE_APPLICATIONS_KEY
    | typeof MULTI_TARGET_EFFECT_APPLICATIONS_KEY,
  targetId: string,
  value: MultiTargetResistanceResult | MultiTargetDamageApplication | MultiTargetEffectApplication
): Promise<void> {
  const promptId = findPromptId(rollCard);
  if (!promptId) return;

  const message = resolveChatMessageDocumentFromElement(rollCard);
  const card = readToolkitChatCard(message);
  if (!message || !card || !Array.isArray(card.prompts)) return;

  let changed = false;
  const prompts = card.prompts.map((prompt) => {
    if (!isRecord(prompt) || prompt.pendingId !== promptId) return prompt;

    const existingEntries = isRecord(prompt[key])
      ? prompt[key]
      : {};

    changed = true;
    return {
      ...prompt,
      [key]: {
        ...existingEntries,
        [targetId]: value
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

function isMultiTargetDamageApplication(value: unknown): value is MultiTargetDamageApplication {
  if (!isRecord(value)) return false;

  return typeof value.targetId === "string"
    && typeof value.targetName === "string"
    && isDamageMode(value.mode)
    && typeof value.inputAmount === "number"
    && Number.isFinite(value.inputAmount)
    && typeof value.finalDamage === "number"
    && Number.isFinite(value.finalDamage)
    && typeof value.blocked === "number"
    && Number.isFinite(value.blocked)
    && typeof value.appliedAt === "string";
}

function isDamageMode(value: unknown): value is MultiTargetDamageMode {
  return value === "normal" || value === "half";
}

function isMultiTargetEffectApplication(value: unknown): value is MultiTargetEffectApplication {
  if (!isRecord(value)) return false;

  return typeof value.targetId === "string"
    && typeof value.targetName === "string"
    && typeof value.conditionId === "string"
    && typeof value.conditionLabel === "string"
    && (typeof value.effectId === "string" || value.effectId === null)
    && typeof value.created === "boolean"
    && typeof value.refreshed === "boolean"
    && typeof value.appliedAt === "string";
}

function readNullableString(value: unknown): string | null {
  return typeof value === "string" && value.length > 0 ? value : null;
}

function isChatMessageFlagDocument(value: unknown): value is ChatMessageFlagDocument {
  return Boolean(value && typeof value === "object" && typeof (value as ChatMessageFlagDocument).getFlag === "function");
}

function isRecord(value: unknown): value is Record<string, unknown> {
  return Boolean(value && typeof value === "object");
}
