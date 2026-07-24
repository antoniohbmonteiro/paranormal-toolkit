import { escapeHtml, markTrustedHtml, type HtmlString } from "./component-html";
export type ChatRollDisplayTone = "generic" | "test" | "damage" | "healing" | "resistance";
export type ChatRollDieState = "active" | "discarded" | "neutral";
export type ChatRollDieModel = { value: string; state: ChatRollDieState; label?: string };
export type ChatRollDisplayActionModel = { label: string; disabled?: boolean };
export type ChatRollDisplayModel = { label?: string | null; formula: string; total?: string | number | null; dice?: readonly ChatRollDieModel[]; tone?: ChatRollDisplayTone; action?: ChatRollDisplayActionModel | null };
export function renderChatRollDisplay(model: ChatRollDisplayModel): HtmlString {
  const dice = model.dice?.length ? `<div class="paranormal-toolkit-chat-roll__dice">${model.dice.map((die) => `<span class="paranormal-toolkit-chat-roll__die paranormal-toolkit-chat-roll__die--${die.state}"${die.label ? ` title="${escapeHtml(die.label)}"` : ""}>${escapeHtml(die.value)}</span>`).join("")}</div>` : "";
  const total = model.total == null ? `<span class="paranormal-toolkit-chat-roll__pending">Pendente</span>` : `<strong class="paranormal-toolkit-chat-roll__total">${escapeHtml(model.total)}</strong>`;
  const action = model.action ? `<button type="button" class="paranormal-toolkit-chat-roll__action"${model.action.disabled ? " disabled" : ""}>${escapeHtml(model.action.label)}</button>` : "";
  return markTrustedHtml(`<div class="paranormal-toolkit-chat-roll paranormal-toolkit-chat-roll--${model.tone ?? "generic"}">${model.label ? `<span class="paranormal-toolkit-chat-roll__label">${escapeHtml(model.label)}</span>` : ""}<code class="paranormal-toolkit-chat-roll__formula">${escapeHtml(model.formula)}</code>${total}${dice}${action}</div>`);
}
