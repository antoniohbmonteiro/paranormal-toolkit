import type { ResistanceEngine } from "../../../core/resistance/resistance-engine";
import type { ResistanceRollResult } from "../../../core/resistance/resistance-roll-adapter";

export type RollTargetResistanceUseCaseInput = {
  actor: Actor;
  skill: string;
  skillLabel: string;
};

export class RollTargetResistanceUseCase {
  constructor(private readonly resistance: ResistanceEngine) {}

  async execute(input: RollTargetResistanceUseCaseInput): Promise<ResistanceRollResult> {
    return this.resistance.rollResistance({
      actor: input.actor,
      skill: input.skill,
      skillLabel: input.skillLabel,
    });
  }
}
