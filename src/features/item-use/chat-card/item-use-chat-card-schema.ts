import type { RitualCardAction, RitualChatCardState, RitualSingleTargetChatCardV2 } from "./ritual/ritual-chat-card-state";

export type LegacyItemUseChatCardV1 = { schemaVersion: 1; kind: "item-use"; prompts: unknown[]; [key: string]: unknown };
export type ToolkitChatCard = LegacyItemUseChatCardV1 | RitualSingleTargetChatCardV2;

export function normalizeRitualSingleTargetChatCard(value: unknown): RitualSingleTargetChatCardV2 | null {
  if (!isRecord(value) || value.schemaVersion !== 2 || value.kind !== "ritual" || value.renderer !== "single-target") return null;
  if (!isNonNegativeNumber(value.revision) || !isNonNegativeNumber(value.createdAt) || !(typeof value.messageId === "string" || value.messageId === null)) return null;
  if (!isRitualState(value.state)) return null;
  const card = value as unknown as RitualSingleTargetChatCardV2;
  const hasInterruptedActions = card.state.actions.some((action) => action.state === "executing");
  const interruptedResistance = card.state.resistance?.status === "executing";
  if (!hasInterruptedActions && !interruptedResistance) return card;
  return {
    ...card,
    state: {
      ...card.state,
      actions: card.state.actions.map((action) => action.state === "executing" ? { ...action, state: "uncertain" } : action),
      resistance: interruptedResistance && card.state.resistance ? { ...card.state.resistance, status: "uncertain" } : card.state.resistance,
    },
  };
}

export function isRitualSingleTargetChatCard(value: unknown): value is RitualSingleTargetChatCardV2 {
  return normalizeRitualSingleTargetChatCard(value) !== null;
}

export function readSafeLegacyFallback(value: unknown): { itemName: string; summaryLines: string[] } | null {
  if (!isRecord(value) || !isRecord(value.legacyFallback)) return null;
  const itemName = typeof value.legacyFallback.itemName === "string" ? value.legacyFallback.itemName.trim() : "";
  const summaryLines = Array.isArray(value.legacyFallback.summaryLines)
    ? value.legacyFallback.summaryLines.filter((line): line is string => typeof line === "string")
    : [];
  if (!itemName && summaryLines.length === 0) return null;
  return { itemName: itemName || "Ritual", summaryLines };
}

function isRitualState(value: unknown): value is RitualChatCardState {
  if (!isRecord(value) || value.schemaVersion !== 1 || value.renderer !== "single-target" || typeof value.castId !== "string") return false;
  if (!isDocumentRef(value.source) || !isDocumentRef(value.item) || !isDocumentRef(value.target)) return false;
  if (!isRecord(value.form) || typeof value.form.id !== "string" || typeof value.form.label !== "string") return false;
  if (!(value.ritualIdentity === undefined || value.ritualIdentity === null || isRitualIdentity(value.ritualIdentity))) return false;
  if (!(value.descriptionHtml === undefined || value.descriptionHtml === null || typeof value.descriptionHtml === "string")) return false;
  if (!Array.isArray(value.actions) || !value.actions.every(isCardAction)) return false;
  if (!(value.mainRoll === null || isRecord(value.mainRoll)) || !(value.conjuration === null || isRecord(value.conjuration)) || !(value.resistance === null || isRecord(value.resistance))) return false;
  return isNonNegativeNumber(value.createdAt);
}
function isRitualIdentity(value: unknown): boolean { return isRecord(value) && typeof value.elementKey === "string" && typeof value.elementLabel === "string" && [1, 2, 3, 4].includes(value.circle as number); }
function isCardAction(value: unknown): value is RitualCardAction {
  if (!isRecord(value) || typeof value.id !== "string" || typeof value.label !== "string" || typeof value.executedLabel !== "string" || !isDocumentRef(value.actor)) return false;
  if (!["pending", "available", "executing", "completed", "resolved", "uncertain"].includes(String(value.state))) return false;
  return ["resource-operation", "damage-application", "condition-application"].includes(String(value.kind));
}
function isDocumentRef(value: unknown): boolean { return isRecord(value) && (typeof value.id === "string" || value.id === null) && (typeof value.uuid === "string" || value.uuid === null) && typeof value.name === "string"; }
function isNonNegativeNumber(value: unknown): value is number { return typeof value === "number" && Number.isFinite(value) && value >= 0; }
function isRecord(value: unknown): value is Record<string, unknown> { return Boolean(value && typeof value === "object" && !Array.isArray(value)); }
