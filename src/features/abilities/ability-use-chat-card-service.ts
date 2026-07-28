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

type AbilityChatMessage = {
  id?: unknown;
  getFlag?: (scope: string, key: string) => unknown;
  update?: (data: Record<string, unknown>) => Promise<unknown>;
};

export class AbilityUseChatCardService {
  async publish(
    context: ItemUseContext,
    state: AbilityUseCardState,
  ): Promise<void> {
    const content = renderCardState(state);
    const flag: AbilityUseMessageFlagV3 = { version: 3, state };
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
