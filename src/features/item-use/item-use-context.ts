import type { WorkflowTarget, WorkflowTokenRef } from "../../core/workflow/workflow-context";

export type ItemUseSource = "ordem-item-used-hook" | "ordem-item-roll-wrapper";

export type ItemUseContext = {
  source: ItemUseSource;
  actor: Actor | null;
  item: Item;
  token: WorkflowTokenRef | null;
  targets: WorkflowTarget[];
  message?: unknown;
  chatMessageData?: unknown;
  originalResult?: unknown;
};

export type ItemUseIntegrationAttemptStatus = "ignored" | "skipped" | "pending" | "running" | "completed" | "failed";

export type ItemUseIntegrationAttempt = {
  source: ItemUseSource;
  status: ItemUseIntegrationAttemptStatus;
  reason?: string;
  pendingId?: string;
  itemId: string | null;
  itemName: string;
  itemType: string;
  itemUuid: string | null;
  actorId: string | null;
  actorName: string | null;
  targetCount: number;
  timestamp: number;
};

export type ItemUseSourceStrategyStatus = {
  id: ItemUseSource;
  registered: boolean;
};

export type ItemUseSourceStrategy = {
  readonly id: ItemUseSource;
  register(): void;
  status(): ItemUseSourceStrategyStatus;
};
