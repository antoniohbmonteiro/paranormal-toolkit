import { MODULE_ID } from "../../constants";
import { renderAbilityUseCard } from "../../ui/components/ability/ability-use-card";
import type { ItemUseContext } from "../item-use/item-use-context";
import { getItemUseSystemCardMode } from "../item-use/item-use-settings";
import {
  normalizeAbilityUseMessageFlag,
  type AbilityUseMessageFlagV3,
} from "./ability-roll-chat-contract";
import { buildAbilityUseCardViewModel } from "./ability-use-card-view-model-builder";
import type { AbilityUseCardState } from "./ability-use-card-state";

export type AbilityChatMessage = {
  id?: unknown;
  getFlag?: (scope: string, key: string) => unknown;
  setFlag?: (
    scope: string,
    key: string,
    value: unknown,
  ) => Promise<unknown> | unknown;
  update?: (data: Record<string, unknown>) => Promise<unknown>;
};

const mutationQueues = new Map<string, Promise<unknown>>();

export class AbilityUseChatCardService {
  async publish(
    context: ItemUseContext,
    state: AbilityUseCardState,
  ): Promise<void> {
    const content = renderCardState(state);
    const flag: AbilityUseMessageFlagV3 = { version: 3, revision: 0, state };
    const messageData = createMessageData(context, content, flag);
    const message = context.message as AbilityChatMessage | null;

    if (
      getItemUseSystemCardMode() === "replace" &&
      typeof message?.update === "function"
    ) {
      await message.update(messageData);
      return;
    }

    await ChatMessage.create(messageData);
  }
}

export function renderPersistedAbilityCard(
  message: AbilityChatMessage,
  root: HTMLElement,
): boolean {
  const raw = message.getFlag?.(MODULE_ID, "abilityUse");
  if (!isVersion3Candidate(raw)) return false;

  const flag = normalizeAbilityUseMessageFlag(raw);
  if (!flag || flag.version !== 3) {
    console.warn(
      "Paranormal Toolkit: flag v3 de habilidade inválida; conteúdo preservado.",
    );
    return false;
  }

  placeRehydratedCard(resolveMessageHost(root), renderCardState(flag.state));
  return true;
}

export function readAbilityUseCard(
  message: AbilityChatMessage | null,
): AbilityUseMessageFlagV3 | null {
  const raw = message?.getFlag?.(MODULE_ID, "abilityUse");
  const flag = normalizeAbilityUseMessageFlag(raw);
  return flag?.version === 3 ? flag : null;
}

export async function mutateAbilityUseCard(
  message: AbilityChatMessage,
  mutate: (
    flag: AbilityUseMessageFlagV3,
  ) => AbilityUseMessageFlagV3 | Promise<AbilityUseMessageFlagV3>,
): Promise<AbilityUseMessageFlagV3> {
  if (typeof message.setFlag !== "function") {
    throw new Error("ChatMessage não permite persistência de flags.");
  }
  const key = typeof message.id === "string" ? message.id : "unknown";
  const previous = mutationQueues.get(key) ?? Promise.resolve();
  let resolveResult!: (value: AbilityUseMessageFlagV3) => void;
  let rejectResult!: (reason?: unknown) => void;
  const result = new Promise<AbilityUseMessageFlagV3>((resolve, reject) => {
    resolveResult = resolve;
    rejectResult = reject;
  });
  const next = previous
    .catch(() => undefined)
    .then(async () => {
      const current = readAbilityUseCard(message);
      if (!current) throw new Error("Card de habilidade v3 inválido ou ausente.");
      const updated = await mutate(current);
      const versioned = { ...updated, revision: current.revision + 1 };
      await Promise.resolve(message.setFlag?.(MODULE_ID, "abilityUse", versioned));
      resolveResult(versioned);
    })
    .catch(rejectResult)
    .finally(() => {
      if (mutationQueues.get(key) === next) mutationQueues.delete(key);
    });
  mutationQueues.set(key, next);
  return result;
}

function renderCardState(state: AbilityUseCardState): string {
  return renderAbilityUseCard(buildAbilityUseCardViewModel(state));
}

function createMessageData(
  context: ItemUseContext,
  content: string,
  flag: AbilityUseMessageFlagV3,
) {
  return {
    speaker: ChatMessage.getSpeaker({ actor: context.actor ?? undefined }),
    content,
    flags: { [MODULE_ID]: { abilityUse: flag } },
  };
}

function isVersion3Candidate(
  value: unknown,
): value is Record<string, unknown> & { version: 3 } {
  return Boolean(
    value &&
      typeof value === "object" &&
      (value as { version?: unknown }).version === 3,
  );
}

function resolveMessageHost(root: HTMLElement): HTMLElement {
  return root.classList.contains("message-content")
    ? root
    : (root.querySelector<HTMLElement>(".message-content") ?? root);
}

function placeRehydratedCard(host: HTMLElement, html: string): void {
  const existing = host.querySelector<HTMLElement>(
    '[data-paranormal-toolkit-card-renderer="ability-result"]',
  );
  const existingShell = existing?.closest<HTMLElement>(
    ".paranormal-toolkit-chat-card-shell",
  );

  if (existingShell) {
    existingShell.outerHTML = html;
    return;
  }

  const wrapper = document.createElement("div");
  wrapper.innerHTML = html;
  if (getItemUseSystemCardMode() === "replace") host.replaceChildren(wrapper);
  else host.append(wrapper);
}
