export type RitualCastingCheckResult = {
  skill: string;
  skillLabel: string;
  roll: Roll;
  formula: string;
  total: number;
  difficulty: number;
  success: boolean;
  diceBreakdown: string | null;
};

export type RitualCastingAdapter = {
  rollCastingCheck(actor: Actor): Promise<RitualCastingCheckResult>;
  getDifficulty?(actor: Actor): number | null;
};
