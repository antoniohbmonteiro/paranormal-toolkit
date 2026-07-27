import { MODULE_ID } from "../../../../constants";
import { getItemUseSystemCardMode } from "../../item-use-settings";
import { renderRitualSingleTargetCard } from "../../../../ui/components/ritual/ritual-single-target-card";
import { buildRitualSingleTargetCardViewModel } from "./ritual-single-target-card-view-model-builder";
import { writeRitualChatCard, type ChatCardMessage } from "../item-use-chat-card-storage";
import type { RitualSingleTargetChatCardV2 } from "./ritual-chat-card-state";
import { escapeHtml } from "../../../../ui/rendering/escape-html";

export function renderRitualCardHtml(card: RitualSingleTargetChatCardV2): string {
  return renderRitualSingleTargetCard(buildRitualSingleTargetCardViewModel(card.state));
}
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
  const card = raw as RitualSingleTargetChatCardV2;
  try {
    const html = renderRitualCardHtml(card);
    const host = root.classList.contains("message-content") ? root : root.querySelector<HTMLElement>(".message-content") ?? root;
    let section = host.querySelector<HTMLElement>('[data-paranormal-toolkit-card-renderer="ritual-single-target"]');
    if (!section) { section = document.createElement("section"); section.dataset.paranormalToolkitCardRenderer = "ritual-single-target"; }
    section.dataset.paranormalToolkitMessageId = typeof message.id === "string" ? message.id : "";
    section.innerHTML = html;
    if (getItemUseSystemCardMode() === "replace") host.replaceChildren(section); else if (!section.parentElement) host.append(section);
    return true;
  } catch (cause) {
    console.warn("Paranormal Toolkit: falha ao reidratar card ritual v2; mantendo conteúdo disponível.", cause);
    const host = root.classList.contains("message-content") ? root : root.querySelector<HTMLElement>(".message-content") ?? root;
    const section = document.createElement("section");
    section.dataset.paranormalToolkitCardRenderer = "ritual-single-target";
    section.dataset.paranormalToolkitMessageId = typeof message.id === "string" ? message.id : "";
    section.classList.add("paranormal-toolkit-item-use-prompt");
    section.innerHTML = renderLegacyFallback(card);
    if (getItemUseSystemCardMode() === "replace") host.replaceChildren(section); else host.append(section);
    return true;
  }
}
function escapeSelector(value: string): string {
  return globalThis.CSS?.escape ? globalThis.CSS.escape(value) : value.replace(/["\\]/gu, "\\$&");
}
function renderLegacyFallback(card: RitualSingleTargetChatCardV2): string {
  const details = card.legacyFallback.summaryLines.map((line) => `<li>${escapeHtml(line)}</li>`).join("");
  const actions = card.legacyFallback.actions.map((action) => {
    if (action.state === "completed" || action.state === "resolved") return `<p>✓ ${escapeHtml(action.state === "completed" ? action.executedLabel : "Alternativa resolvida")}</p>`;
    const disabled = action.state !== "available" ? " disabled" : "";
    const kind = action.kind === "damage-application" ? "apply-damage" : action.kind === "condition-application" ? "apply-condition" : action.operation === "heal" || action.operation === "recover" ? "apply-healing" : "apply-resource";
    return `<button type="button" data-paranormal-toolkit-card-action="${kind}" data-paranormal-toolkit-action-id="${escapeHtml(action.id)}"${disabled}>${escapeHtml(action.label)}</button>`;
  }).join("");
  return `<header><strong>${escapeHtml(card.legacyFallback.itemName)}</strong></header><ul>${details}</ul><div>${actions}</div>`;
}
