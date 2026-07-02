export type ResistanceRollInput = {
  actor: Actor;
  skill: string;
  skillLabel?: string | null;
};

export type ResistanceRollResult = {
  skill: string;
  skillLabel: string;
  roll: Roll;
  formula: string;
  total: number;
  diceBreakdown: string | null;
};

export type ResistanceRollAdapter = {
  rollResistance(input: ResistanceRollInput): Promise<ResistanceRollResult>;
  getSkillLabel?(skill: string): string;
};
