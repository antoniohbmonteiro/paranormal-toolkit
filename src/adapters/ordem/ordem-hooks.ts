export const ORDEM_HOOKS = {
  ITEM_USED: "ordemparanormal.itemUsed"
} as const;

export type OrdemHookName = (typeof ORDEM_HOOKS)[keyof typeof ORDEM_HOOKS];
