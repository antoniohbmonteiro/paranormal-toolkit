import { registerItemUseChatCardEnhancements } from "./chat-card/item-use-chat-card-enhancements";

/**
 * @deprecated Mantido como ponto de entrada compatível com as versões 0.15.x.
 * O código real do card foi movido para `features/item-use/chat-card` na 0.16.0.
 */
export function registerItemUseWorkflowDiceToggle(): void {
  registerItemUseChatCardEnhancements();
}
