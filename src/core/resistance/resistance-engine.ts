import type {
  ResistanceRollAdapter,
  ResistanceRollInput,
  ResistanceRollResult,
} from "./resistance-roll-adapter";

export class ResistanceEngine {
  constructor(private readonly adapter: ResistanceRollAdapter) {}

  async rollResistance(input: ResistanceRollInput): Promise<ResistanceRollResult> {
    const skillLabel =
      input.skillLabel ?? this.adapter.getSkillLabel?.(input.skill) ?? input.skill;
    const result = await this.adapter.rollResistance({ ...input, skillLabel });

    return {
      ...result,
      skill: result.skill || input.skill,
      skillLabel: result.skillLabel || skillLabel,
    };
  }

  getSkillLabel(skill: string): string {
    return this.adapter.getSkillLabel?.(skill) ?? skill;
  }
}
