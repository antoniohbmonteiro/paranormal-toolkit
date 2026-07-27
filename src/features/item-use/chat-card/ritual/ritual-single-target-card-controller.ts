import { mutateRitualChatCard, readRitualChatCard, type ChatCardMessage } from "../item-use-chat-card-storage";
import type { RitualCardAction, RitualResistanceResult } from "./ritual-chat-card-state";
import { renderPersistedRitualCard } from "./ritual-single-target-chat-card-service";

export type RitualCardExecutionResult =
  | { ok: true; resistance?: RitualResistanceResult }
  | { ok: false; message: string; sideEffect: "none" | "uncertain" };
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
  button.disabled = true;
  await executeRitualCardInteraction({ message, messageId, actionId: button.dataset.paranormalToolkitActionId ?? null, kind: button.dataset.paranormalToolkitCardAction ?? "", executor, root });
}

export async function executeRitualCardInteraction(input: { message: ChatCardMessage; messageId?: string; actionId: string | null; kind: string; executor: RitualCardActionExecutor; root?: HTMLElement }): Promise<void> {
  if (input.kind === "toggle-roll-details") return;
  let claimedIds: string[] = [];
  let sideEffectPossible = false;
  try {
    const claimed = await mutateRitualChatCard(input.message, (card) => {
      if (input.kind === "roll-resistance") {
        if (!card.state.resistance || card.state.resistance.status !== "pending") throw new Error("Resistência já rolada.");
        return { ...card, state: { ...card.state, resistance: { ...card.state.resistance, status: "executing" } } };
      }
      if (input.kind === "apply-resistance-outcome-conditions") {
        const outcome = card.state.resistance?.result?.outcome;
        if (!outcome) throw new Error("A resistência ainda não foi resolvida.");
        claimedIds = card.state.actions.filter((action) => action.kind === "condition-application" && action.outcome === outcome && action.state === "available").map((action) => action.id);
        if (!claimedIds.length) throw new Error("Não há condições pendentes para aplicar.");
        return { ...card, state: { ...card.state, actions: setActionStates(card.state.actions, claimedIds, "executing") } };
      }
      const action = card.state.actions.find((entry) => entry.id === input.actionId);
      if (!action || action.state !== "available") throw new Error("Ação indisponível ou já executada.");
      claimedIds = [action.id];
      return { ...card, state: { ...card.state, actions: setActionStates(card.state.actions, claimedIds, "executing") } };
    });

    if (input.kind === "roll-resistance") {
      const result = await safelyExecute(() => input.executor({ message: input.message, action: null, kind: input.kind, card: claimed }));
      sideEffectPossible = result.ok || result.sideEffect === "uncertain";
      await finalizeResistance(input.message, result);
      notifyFailure(result);
    } else {
      const results = new Map<string, RitualCardExecutionResult>();
      for (const id of claimedIds) {
        const current = readRitualChatCard(input.message) ?? claimed;
        const action = current.state.actions.find((entry) => entry.id === id) ?? null;
        const result = await safelyExecute(() => input.executor({ message: input.message, action, kind: input.kind, card: current }));
        if (result.ok || result.sideEffect === "uncertain") sideEffectPossible = true;
        results.set(id, result);
      }
      await finalizeActions(input.message, claimedIds, results);
      for (const result of results.values()) notifyFailure(result);
    }
    rerender(input.message, input.root);
  } catch (cause) {
    const stage = sideEffectPossible ? "finalize-after-side-effect" : "claim-or-execute";
    console.warn("Paranormal Toolkit: falha ao concluir interação do card ritual.", { messageId: input.messageId ?? input.message.id, actionId: input.actionId, stage, cause });
    if (claimedIds.length) await bestEffortRecover(input.message, claimedIds, sideEffectPossible ? "uncertain" : "available");
    if (input.kind === "roll-resistance" && !sideEffectPossible) await bestEffortResetResistance(input.message);
    ui.notifications?.warn(sideEffectPossible
      ? "Paranormal Toolkit: a ação pode ter sido aplicada, mas não foi possível confirmar. Verifique o alvo antes de tentar novamente."
      : `Paranormal Toolkit: ${cause instanceof Error ? cause.message : "ação não executada"}`);
    rerender(input.message, input.root);
  }
}

async function finalizeResistance(message: ChatCardMessage, result: RitualCardExecutionResult): Promise<void> {
  await mutateRitualChatCard(message, (current) => {
    if (!current.state.resistance) return current;
    if (!result.ok || !result.resistance) return { ...current, state: { ...current.state, resistance: { ...current.state.resistance, status: "pending" } } };
    const outcome = result.resistance.outcome;
    return { ...current, state: { ...current.state, resistance: { ...current.state.resistance, status: "completed", result: result.resistance }, actions: current.state.actions.map((entry) => entry.outcome ? { ...entry, state: entry.outcome === outcome ? "available" : "resolved" } : entry) } };
  });
}
async function finalizeActions(message: ChatCardMessage, ids: string[], results: Map<string, RitualCardExecutionResult>): Promise<void> {
  await mutateRitualChatCard(message, (current) => {
    let actions: RitualCardAction[] = current.state.actions.map((entry): RitualCardAction => {
      if (!ids.includes(entry.id)) return entry;
      const result = results.get(entry.id);
      if (!result) return { ...entry, state: "available" };
      if (!result.ok) return { ...entry, state: result.sideEffect === "none" ? "available" : "uncertain" };
      return { ...entry, state: "completed", completedAt: new Date().toISOString(), completedByUserId: readUserId() };
    });
    for (const id of ids) {
      const selected = actions.find((entry) => entry.id === id);
      if (selected?.state === "completed" && selected.choiceGroupId) actions = actions.map((entry) => entry.id !== id && entry.choiceGroupId === selected.choiceGroupId ? { ...entry, state: "resolved" } : entry);
    }
    return { ...current, state: { ...current.state, actions } };
  });
}
async function safelyExecute(run: () => Promise<RitualCardExecutionResult>): Promise<RitualCardExecutionResult> {
  try { return await run(); }
  catch (cause) { return { ok: false, sideEffect: "uncertain", message: cause instanceof Error ? cause.message : "falha inesperada durante a execução" }; }
}
async function bestEffortRecover(message: ChatCardMessage, ids: string[], state: "available" | "uncertain"): Promise<void> { try { await mutateRitualChatCard(message, (card) => ({ ...card, state: { ...card.state, actions: setActionStates(card.state.actions, ids, state) } })); } catch (cause) { console.warn("Paranormal Toolkit: recovery de ações falhou.", { messageId: message.id, actionIds: ids, stage: "recovery", cause }); } }
async function bestEffortResetResistance(message: ChatCardMessage): Promise<void> { try { await mutateRitualChatCard(message, (card) => card.state.resistance ? { ...card, state: { ...card.state, resistance: { ...card.state.resistance, status: "pending" } } } : card); } catch (cause) { console.warn("Paranormal Toolkit: recovery da resistência falhou.", { messageId: message.id, stage: "resistance-recovery", cause }); } }
function setActionStates(actions: RitualCardAction[], ids: string[], state: RitualCardAction["state"]): RitualCardAction[] { return actions.map((entry) => ids.includes(entry.id) ? { ...entry, state } : entry); }
function notifyFailure(result: RitualCardExecutionResult): void { if (!result.ok) ui.notifications?.warn(`Paranormal Toolkit: ${result.message}`); }
function rerender(message: ChatCardMessage, root?: HTMLElement): void { if (root && readRitualChatCard(message)) renderPersistedRitualCard(message, root.closest<HTMLElement>(".chat-message") ?? root); }
function asMessage(value: unknown): ChatCardMessage | null { return value && typeof value === "object" ? value as ChatCardMessage : null; }
function readUserId(): string | null { const id = (game.user as { id?: unknown } | null)?.id; return typeof id === "string" ? id : null; }
