export type RitualPreviewState = "pending" | "success" | "failure";

export type RitualFormulaOptionViewModel = {
  id: string;
  label: string;
  formula: string;
  total: number | null;
  status?: RitualPreviewState;
};

export type RitualContextViewModel = {
  casterName: string;
  targetName: string;
  pills: readonly string[];
  resistanceLabel: string;
};

export type RitualConjurationViewModel = {
  skillLabel: string;
  difficulty: number;
  options: readonly RitualFormulaOptionViewModel[];
  selectedFormulaId: string;
  status: RitualPreviewState;
};

export type RitualResistanceViewModel = {
  label: string;
  difficulty: number;
  consequence: string;
  state: RitualPreviewState;
  total: number | null;
};

export type RitualDamageViewModel = {
  damageType: string;
  options: readonly RitualFormulaOptionViewModel[];
  selectedFormulaId: string;
  resistance: RitualResistanceViewModel;
  damageApplied: boolean;
};

export type RitualEffectViewModel = {
  name: string;
  duration: string;
  resistanceState: RitualPreviewState;
  resistanceTotal: number | null;
};
