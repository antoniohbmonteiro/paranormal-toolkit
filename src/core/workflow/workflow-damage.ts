export type WorkflowDamageInstance = {
  id: string;
  source: "weapon" | "ritual" | "effect" | "modification" | "automation";
  sourceId: string | null;
  sourceName: string;
  targetActorId: string | null;
  targetActorName: string;
  rollId?: string;
  damageType?: string;
  rawAmount: number;
  resistance?: number;
  vulnerability?: number;
  reduction?: number;
  immune?: boolean;
  finalAmount: number;
  appliedAmount: number;
  tags: string[];
};
