import { resolveRootElement } from "../item-use/chat-card/item-use-chat-card-dom";

export const FULL_WIDTH_CHAT_MESSAGE_CLASS =
  "paranormal-toolkit-chat-message--full-width-card";

const ABILITY_CARD_SELECTOR = ".paranormal-toolkit-ability-card";
const CHAT_MESSAGE_SELECTOR = "li.chat-message";

let registered = false;

type HooksLike = {
  on(
    event: string,
    callback: (message: unknown, html: unknown) => void,
  ): unknown;
};

type ClassListLike = {
  add(token: string): void;
};

type ElementLike = {
  matches?(selector: string): boolean;
  querySelectorAll?(selector: string): Iterable<unknown> | ArrayLike<unknown>;
  closest?(selector: string): unknown;
  classList?: ClassListLike;
};

export function registerAbilityUseChatMessageLayout(): void {
  if (registered) return;
  registered = true;

  const hooks = Hooks as unknown as HooksLike;
  const enhance = (_message: unknown, html: unknown): void => {
    applyAbilityUseChatMessageLayout(resolveRootElement(html));
  };

  hooks.on("renderChatMessageHTML", enhance);
  hooks.on("renderChatMessage", enhance);

  applyAbilityUseChatMessageLayout(document);
}

export function applyAbilityUseChatMessageLayout(
  root: ParentNode | null,
): number {
  if (!root) return 0;

  const rootElement = asElementLike(root);
  const cards = collectAbilityCards(rootElement);
  const messages = new Set<ElementLike>();

  for (const card of cards) {
    const message = resolveChatMessage(rootElement, card);
    if (!message?.classList) continue;
    messages.add(message);
  }

  for (const message of messages) {
    message.classList?.add(FULL_WIDTH_CHAT_MESSAGE_CLASS);
  }

  return messages.size;
}

function collectAbilityCards(root: ElementLike): ElementLike[] {
  const cards: ElementLike[] = [];

  if (root.matches?.(ABILITY_CARD_SELECTOR)) {
    cards.push(root);
  }

  const nestedCards = root.querySelectorAll?.(ABILITY_CARD_SELECTOR);
  if (!nestedCards) return cards;

  for (const card of Array.from(nestedCards)) {
    const element = asElementLike(card);
    if (!cards.includes(element)) cards.push(element);
  }

  return cards;
}

function resolveChatMessage(
  root: ElementLike,
  card: ElementLike,
): ElementLike | null {
  if (root.matches?.(CHAT_MESSAGE_SELECTOR)) return root;

  const closest = card.closest?.(CHAT_MESSAGE_SELECTOR);
  return closest ? asElementLike(closest) : null;
}

function asElementLike(value: unknown): ElementLike {
  return value && typeof value === "object" ? (value as ElementLike) : {};
}
