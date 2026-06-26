export type WorkflowHealingInstance = {
  id: string;
  source: "ritual" | "effect" | "automation";
  sourceId: string | null;
  sourceName: string;
  targetActorId: string | null;
  targetActorName: string;
  rollId?: string;
  rawAmount: number;
  finalAmount: number;
  appliedAmount: number;
  tags: string[];
};
