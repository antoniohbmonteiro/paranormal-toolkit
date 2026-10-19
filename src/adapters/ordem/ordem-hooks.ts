export const ORDEM_HOOKS = {
  ITEM_USED: "ordemparanormal.itemUsed",
  RENDER_CHAT_MESSAGE: "ordemparanormal.renderChatMessage"
} as const;

export type OrdemHookName = (typeof ORDEM_HOOKS)[keyof typeof ORDEM_HOOKS];
