import type {
  AbilityAssistedActionExecutionResult,
  AbilityAssistedActionService,
} from "./ability-assisted-action-service";
import type { AbilityAssistedAction } from "./ability-use-card-state";
import {
  mutateAbilityUseCard,
  renderPersistedAbilityCard,
  type AbilityChatMessage,
} from "./ability-use-chat-card-service";
import { resolveRootElement } from "../item-use/chat-card/item-use-chat-card-dom";

const BOUND_DATASET_KEY = "paranormalToolkitAbilityActionBound";
let registered = false;

export function registerAbilityAssistedActionController(
  service: AbilityAssistedActionService,
): void {
  if (registered) return;
  registered = true;
  const enhance = (message: unknown, html: unknown): void => {
    bindAbilityAssistedActionButtons(
      message as AbilityChatMessage,
      resolveRootElement(html),
      service,
    );
  };
  Hooks.on("renderChatMessageHTML", enhance);
  Hooks.on("renderChatMessage", enhance);
}

export function bindAbilityAssistedActionButtons(
  message: AbilityChatMessage,
  root: ParentNode | null,
  service: AbilityAssistedActionService,
): number {
  if (!root) return 0;
  const buttons = Array.from(
    root.querySelectorAll<HTMLButtonElement>(
      '[data-paranormal-toolkit-card-renderer="ability-result"] [data-paranormal-toolkit-card-action="apply-ability-action"]',
    ),
  );
  let bound = 0;
  for (const button of buttons) {
    if (button.dataset[BOUND_DATASET_KEY] === "true") continue;
    button.dataset[BOUND_DATASET_KEY] = "true";
    button.addEventListener("click", () => {
      void executeAbilityAssistedActionInteraction({
        message,
        actionId: button.dataset.paranormalToolkitActionId ?? null,
        service,
        button,
      });
    });
    bound += 1;
  }
  return bound;
}

export async function executeAbilityAssistedActionInteraction(input: {
  message: AbilityChatMessage;
  actionId: string | null;
  service: AbilityAssistedActionService;
  button?: HTMLButtonElement;
  root?: HTMLElement;
}): Promise<void> {
  if (!input.actionId) return;
  if (input.button) input.button.disabled = true;
  let claimedAction: AbilityAssistedAction | null = null;
  let sideEffectPossible = false;

  try {
    const claimed = await mutateAbilityUseCard(input.message, (flag) => {
      const action = flag.state.actions.find((entry) => entry.id === input.actionId);
      if (!action || action.state !== "available") {
        throw new Error("Ação indisponível ou já executada.");
      }
      claimedAction = { ...action, state: "executing" };
      return {
        ...flag,
        state: {
          ...flag.state,
          actions: flag.state.actions.map((entry) =>
            entry.id === action.id ? claimedAction as AbilityAssistedAction : entry,
          ),
        },
      };
    });
    if (!claimedAction) throw new Error("Ação persistida não encontrada.");

    const result = await safelyExecute(() =>
      input.service.execute(claimed.state, claimedAction as AbilityAssistedAction),
    );
    sideEffectPossible = result.ok || result.sideEffect === "uncertain";
    await finalizeAction(input.message, input.actionId, result);
    notifyFailure(result);
  } catch (cause) {
    if (claimedAction) {
      await bestEffortRecover(
        input.message,
        input.actionId,
        sideEffectPossible ? "uncertain" : "available",
      );
    }
    ui.notifications?.warn(
      sideEffectPossible
        ? "Paranormal Toolkit: a ação pode ter sido aplicada. Verifique o alvo antes de tentar novamente."
        : `Paranormal Toolkit: ${readErrorMessage(cause, "ação não executada")}`,
    );
  } finally {
    rerender(
      input.message,
      input.root ?? resolveHost(input.button),
      input.service,
    );
  }
}

async function finalizeAction(
  message: AbilityChatMessage,
  actionId: string,
  result: AbilityAssistedActionExecutionResult,
): Promise<void> {
  await mutateAbilityUseCard(message, (flag) => ({
    ...flag,
    state: {
      ...flag.state,
      actions: flag.state.actions.map((action) => {
        if (action.id !== actionId) return action;
        if (!result.ok) {
          return {
            ...action,
            state: result.sideEffect === "none" ? "available" : "uncertain",
          };
        }
        return {
          ...action,
          state: "completed",
          completedAt: new Date().toISOString(),
          completedByUserId: readCurrentUserId(),
        };
      }),
    },
  }));
}

async function safelyExecute(
  run: () => Promise<AbilityAssistedActionExecutionResult>,
): Promise<AbilityAssistedActionExecutionResult> {
  try {
    return await run();
  } catch (cause) {
    return {
      ok: false,
      sideEffect: "uncertain",
      message: readErrorMessage(cause, "falha inesperada durante a execução"),
    };
  }
}

async function bestEffortRecover(
  message: AbilityChatMessage,
  actionId: string,
  state: "available" | "uncertain",
): Promise<void> {
  try {
    await mutateAbilityUseCard(message, (flag) => ({
      ...flag,
      state: {
        ...flag.state,
        actions: flag.state.actions.map((action) =>
          action.id === actionId ? { ...action, state } : action,
        ),
      },
    }));
  } catch (cause) {
    console.warn("Paranormal Toolkit: recovery de ação de habilidade falhou.", {
      messageId: message.id,
      actionId,
      cause,
    });
  }
}

function notifyFailure(result: AbilityAssistedActionExecutionResult): void {
  if (!result.ok) ui.notifications?.warn(`Paranormal Toolkit: ${result.message}`);
}

function rerender(
  message: AbilityChatMessage,
  root: HTMLElement | null,
  service: AbilityAssistedActionService,
): void {
  if (!root || !renderPersistedAbilityCard(message, root)) return;
  bindAbilityAssistedActionButtons(message, root, service);
}

function resolveHost(button: HTMLButtonElement | undefined): HTMLElement | null {
  return button?.closest<HTMLElement>(".message-content") ?? null;
}

function readCurrentUserId(): string | null {
  return typeof game.user?.id === "string" ? game.user.id : null;
}

function readErrorMessage(cause: unknown, fallback: string): string {
  return cause instanceof Error ? cause.message : fallback;
}
