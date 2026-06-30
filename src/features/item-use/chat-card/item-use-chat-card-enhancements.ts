import { removeWorkflowRollDetails } from "./item-use-card-details";
import { enhanceResistanceLayout } from "./item-use-card-resistance";
import { enhanceRitualMetadata } from "./item-use-card-ritual-metadata";
import { enhanceWorkflowRolls, handleWorkflowRollClick, handleWorkflowRollKeydown } from "./item-use-card-rolls";
import { resolveRootElement } from "./item-use-chat-card-dom";
import { ensureItemUseChatCardStyles } from "./item-use-chat-card-styles";

declare const Hooks: {
  on: (event: string, callback: (message: unknown, html: unknown) => void) => void;
  once: (event: string, callback: () => void) => void;
};

const INITIAL_ENHANCEMENT_DELAYS_MS = [0, 100, 500, 1_500, 3_000] as const;

let registered = false;
let observer: MutationObserver | null = null;

export function registerItemUseChatCardEnhancements(): void {
  if (registered) return;
  registered = true;

  ensureItemUseChatCardStyles();

  Hooks.on("renderChatMessageHTML", (_message: unknown, html: unknown) => {
    enhanceItemUseChatCards(resolveRootElement(html));
  });

  Hooks.on("renderChatMessage", (_message: unknown, html: unknown) => {
    enhanceItemUseChatCards(resolveRootElement(html));
  });

  Hooks.once("ready", () => {
    enhanceItemUseChatCards(document);
    observeRenderedChatCards();
  });

  document.addEventListener("click", handleWorkflowRollClick);
  document.addEventListener("keydown", handleWorkflowRollKeydown);

  for (const delayMs of INITIAL_ENHANCEMENT_DELAYS_MS) {
    globalThis.setTimeout(() => enhanceItemUseChatCards(document), delayMs);
  }
}

function observeRenderedChatCards(): void {
  if (observer || !document.body) return;

  observer = new MutationObserver((mutations) => {
    for (const mutation of mutations) {
      for (const node of Array.from(mutation.addedNodes)) {
        if (node instanceof HTMLElement || node instanceof DocumentFragment) {
          enhanceItemUseChatCards(node);
        }
      }
    }
  });

  observer.observe(document.body, { childList: true, subtree: true });
}

function enhanceItemUseChatCards(root: ParentNode | null): void {
  if (!root) return;

  removeWorkflowRollDetails(root);
  enhanceRitualMetadata(root);
  enhanceResistanceLayout(root);
  enhanceWorkflowRolls(root);
}
