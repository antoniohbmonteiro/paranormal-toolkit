import type { RitualCardAction, RitualResistanceResult } from "./ritual-chat-card-state";
import { mutateRitualChatCard, readRitualChatCard, type ChatCardMessage } from "../item-use-chat-card-storage";
import { renderPersistedRitualCard } from "./ritual-single-target-chat-card-service";

export type RitualCardExecutionResult = { ok: true; resistance?: RitualResistanceResult } | { ok: false; message: string };
export type RitualCardActionExecutor = (input: { message: ChatCardMessage; action: RitualCardAction | null; kind: string; card: NonNullable<ReturnType<typeof readRitualChatCard>> }) => Promise<RitualCardExecutionResult>;
let registered = false;
let executor: RitualCardActionExecutor | null = null;

export function registerRitualSingleTargetCardController(next: RitualCardActionExecutor): void {
  executor = next;
  if (registered) return;
  registered = true;
  document.addEventListener("click", (event) => { void handleClick(event); });
}
async function handleClick(event: Event): Promise<void> {
  const button = event.target instanceof Element ? event.target.closest<HTMLButtonElement>("[data-paranormal-toolkit-card-action]") : null;
  const root = button?.closest<HTMLElement>('[data-paranormal-toolkit-card-renderer="ritual-single-target"]');
  if (!button || !root || !executor) return;
  const messageId = root.dataset.paranormalToolkitMessageId;
  const message = messageId ? asMessage((game.messages as { get?: (id: string) => unknown })?.get?.(messageId)) : null;
  if (!message) return;
  const kind = button.dataset.paranormalToolkitCardAction ?? "";
  if (kind === "toggle-roll-details") return;
  button.disabled = true;
  const actionId = button.dataset.paranormalToolkitActionId ?? null;
  try {
    const claimed = await mutateRitualChatCard(message, (card) => {
      if (kind === "roll-resistance") {
        if (!card.state.resistance || card.state.resistance.status !== "pending") throw new Error("Resistência já rolada.");
        return { ...card, state: { ...card.state, resistance: { ...card.state.resistance, status: "executing" } } };
      }
      const action = card.state.actions.find((entry) => entry.id === actionId);
      if (!action || action.state !== "available") throw new Error("Ação indisponível ou já executada.");
      return { ...card, state: { ...card.state, actions: card.state.actions.map((entry) => entry.id === action.id ? { ...entry, state: "executing" } : entry) } };
    });
    const action = claimed.state.actions.find((entry) => entry.id === actionId) ?? null;
    const result = await executor({ message, action, kind, card: claimed });
    await mutateRitualChatCard(message, (current) => {
      if (kind === "roll-resistance" && current.state.resistance) {
        if (!result.ok || !result.resistance) return { ...current, state: { ...current.state, resistance: { ...current.state.resistance, status: "pending" } } };
        const outcome = result.resistance.outcome;
        return { ...current, state: { ...current.state, resistance: { ...current.state.resistance, status: "completed", result: result.resistance }, actions: current.state.actions.map((entry) => entry.outcome ? { ...entry, state: entry.outcome === outcome ? "available" : "resolved" } : entry) } };
      }
      const actions: RitualCardAction[] = current.state.actions.map((entry): RitualCardAction => entry.id === actionId ? { ...entry, state: result.ok ? "completed" : "available", completedAt: result.ok ? new Date().toISOString() : null, completedByUserId: result.ok ? readUserId() : null } : entry).map((entry): RitualCardAction => result.ok && action?.choiceGroupId && entry.id !== action.id && entry.choiceGroupId === action.choiceGroupId ? { ...entry, state: "resolved" } : entry);
      return { ...current, state: { ...current.state, actions } };
    });
    const current = readRitualChatCard(message);
    if (current) renderPersistedRitualCard(message, root.closest<HTMLElement>(".chat-message") ?? root);
    if (!result.ok) ui.notifications?.warn(`Paranormal Toolkit: ${result.message}`);
  } catch (cause) {
    ui.notifications?.warn(`Paranormal Toolkit: ${cause instanceof Error ? cause.message : "ação não executada"}`);
    button.disabled = false;
  }
}
function asMessage(value: unknown): ChatCardMessage | null { return value && typeof value === "object" ? value as ChatCardMessage : null; }
function readUserId(): string | null { const id = (game.user as { id?: unknown } | null)?.id; return typeof id === "string" ? id : null; }
