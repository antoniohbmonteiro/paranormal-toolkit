import { MODULE_ID } from "../../../../constants";
import { escapeHtml } from "../../../../ui/rendering/escape-html";
import { renderRitualSingleTargetCard } from "../../../../ui/components/ritual/ritual-single-target-card";
import { getItemUseSystemCardMode } from "../../item-use-settings";
import { normalizeRitualSingleTargetChatCard, readSafeLegacyFallback } from "../item-use-chat-card-schema";
import { writeRitualChatCard, type ChatCardMessage } from "../item-use-chat-card-storage";
import type { RitualSingleTargetChatCardV2 } from "./ritual-chat-card-state";
import { buildRitualSingleTargetCardViewModel } from "./ritual-single-target-card-view-model-builder";

const RENDERER_SELECTOR = '[data-paranormal-toolkit-card-renderer="ritual-single-target"]';
export function renderRitualCardHtml(card: RitualSingleTargetChatCardV2): string { return renderRitualSingleTargetCard(buildRitualSingleTargetCardViewModel(card.state)); }
export async function persistRitualCard(message: ChatCardMessage, card: RitualSingleTargetChatCardV2): Promise<void> {
  renderRitualCardHtml(card);
  await writeRitualChatCard(message, card);
  if (card.messageId) {
    const root = document.querySelector<HTMLElement>(`[data-message-id="${escapeSelector(card.messageId)}"]`);
    if (root) renderPersistedRitualCard(message, root);
  }
}
export function renderPersistedRitualCard(message: ChatCardMessage, root: HTMLElement): boolean {
  const raw = message.getFlag?.(MODULE_ID, "chatCard");
  if (!raw || typeof raw !== "object" || (raw as { schemaVersion?: unknown }).schemaVersion !== 2) return false;
  const host = resolveHost(root);
  const card = normalizeRitualSingleTargetChatCard(raw);
  if (!card) return renderSafeFallback(raw, message, host, "invalid-state");
  try {
    const section = getOrCreateSection(host);
    section.dataset.paranormalToolkitMessageId = typeof message.id === "string" ? message.id : "";
    section.innerHTML = renderRitualCardHtml(card);
    placeSection(host, section);
    return true;
  } catch (cause) {
    console.warn("Paranormal Toolkit: falha ao reidratar card ritual v2.", { messageId: message.id, stage: "renderer", cause });
    return renderSafeFallback(raw, message, host, "renderer");
  }
}
function renderSafeFallback(raw: unknown, message: ChatCardMessage, host: HTMLElement, stage: string): boolean {
  try {
    const fallback = readSafeLegacyFallback(raw);
    if (!fallback) {
      console.warn("Paranormal Toolkit: card ritual v2 inválido e sem fallback seguro; conteúdo original preservado.", { messageId: message.id, stage });
      return false;
    }
    const section = getOrCreateSection(host);
    section.dataset.paranormalToolkitMessageId = typeof message.id === "string" ? message.id : "";
    section.classList.add("paranormal-toolkit-item-use-prompt");
    section.innerHTML = renderLegacyFallback(fallback);
    placeSection(host, section);
    return true;
  } catch (cause) {
    console.warn("Paranormal Toolkit: o fallback seguro também falhou; conteúdo original preservado.", { messageId: message.id, stage: `${stage}:fallback`, cause });
    return false;
  }
}
function resolveHost(root: HTMLElement): HTMLElement { return root.classList.contains("message-content") ? root : root.querySelector<HTMLElement>(".message-content") ?? root; }
function getOrCreateSection(host: HTMLElement): HTMLElement {
  const existing = host.querySelector<HTMLElement>(RENDERER_SELECTOR);
  if (existing) return existing;
  const section = document.createElement("section");
  section.dataset.paranormalToolkitCardRenderer = "ritual-single-target";
  return section;
}
function placeSection(host: HTMLElement, section: HTMLElement): void {
  if (getItemUseSystemCardMode() === "replace") host.replaceChildren(section);
  else if (!section.parentElement) host.append(section);
}
function escapeSelector(value: string): string { return globalThis.CSS?.escape ? globalThis.CSS.escape(value) : value.replace(/["\\]/gu, "\\$&"); }
function renderLegacyFallback(fallback: { itemName: string; summaryLines: string[] }): string {
  const details = fallback.summaryLines.map((line) => `<li>${escapeHtml(line)}</li>`).join("");
  return `<header><strong>${escapeHtml(fallback.itemName)}</strong></header>${details ? `<ul>${details}</ul>` : ""}<p>O card interativo não pôde ser reidratado com segurança. Use o conteúdo original da mensagem.</p>`;
}
