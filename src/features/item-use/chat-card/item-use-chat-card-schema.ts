import type { RitualSingleTargetChatCardV2 } from "./ritual/ritual-chat-card-state";

export type LegacyItemUseChatCardV1 = { schemaVersion: 1; kind: "item-use"; prompts: unknown[]; [key: string]: unknown };
export type ToolkitChatCard = LegacyItemUseChatCardV1 | RitualSingleTargetChatCardV2;

export function isRitualSingleTargetChatCard(value: unknown): value is RitualSingleTargetChatCardV2 {
  if (!value || typeof value !== "object") return false;
  const card = value as Partial<RitualSingleTargetChatCardV2>;
  return card.schemaVersion === 2 && card.kind === "ritual" && card.renderer === "single-target" &&
    typeof card.revision === "number" && Boolean(card.state && card.state.renderer === "single-target" && Array.isArray(card.state.actions));
}
