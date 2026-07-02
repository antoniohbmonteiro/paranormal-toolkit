import type {
  ResistanceRollAdapter,
  ResistanceRollInput,
  ResistanceRollResult,
} from "../../core/resistance/resistance-roll-adapter";

export type OrdemResistanceRollResult = ResistanceRollResult;

type SkillRollerActor = Actor & {
  rollSkill?: (
    config?: Record<string, unknown>,
    dialog?: Record<string, unknown>,
    message?: Record<string, unknown>
  ) => Promise<unknown> | unknown;
};

type RollLike = Roll & {
  dice?: unknown;
  formula?: string;
  total?: number | null;
};

export class OrdemResistanceAdapter implements ResistanceRollAdapter {
  async rollResistance(input: ResistanceRollInput): Promise<OrdemResistanceRollResult> {
    const roll = await rollNativeSkill(input.actor, input.skill);

    if (!roll) {
      throw new Error(`Não foi possível rolar a resistência ${input.skill} pelo sistema Ordem.`);
    }

    return {
      skill: input.skill,
      skillLabel: input.skillLabel ?? getResistanceSkillLabel(input.skill),
      roll,
      formula: getRollFormula(roll),
      total: getRollTotal(roll),
      diceBreakdown: describeD20Results(roll)
    };
  }

  getSkillLabel(skill: string): string {
    return getResistanceSkillLabel(skill);
  }
}

export async function rollOrdemResistance(actor: Actor, skill: string): Promise<OrdemResistanceRollResult> {
  return new OrdemResistanceAdapter().rollResistance({ actor, skill });
}

export function getResistanceSkillLabel(skill: string): string {
  switch (skill) {
    case "resilience":
      return "Fortitude";
    case "reflexes":
      return "Reflexos";
    case "will":
      return "Vontade";
    default:
      return skill;
  }
}

async function rollNativeSkill(actor: Actor, skill: string): Promise<Roll | null> {
  const skillRoller = actor as SkillRollerActor;

  if (typeof skillRoller.rollSkill !== "function") {
    return null;
  }

  const result = await Promise.resolve(
    skillRoller.rollSkill(
      { skill },
      { configure: false },
      {
        create: false,
        rollMode: game.settings.get("core", "rollMode")
      }
    )
  );

  return extractFirstRoll(result);
}

function extractFirstRoll(value: unknown): Roll | null {
  if (isRoll(value)) return value;

  if (!Array.isArray(value)) return null;

  return value.find(isRoll) ?? null;
}

function isRoll(value: unknown): value is Roll {
  return Boolean(value && typeof value === "object" && "evaluate" in value && "total" in value);
}

function getRollFormula(roll: RollLike): string {
  const formula = roll.formula;
  return typeof formula === "string" && formula.trim().length > 0 ? formula : "rolagem";
}

function getRollTotal(roll: RollLike): number {
  const total = roll.total;
  return typeof total === "number" && Number.isFinite(total) ? Math.trunc(total) : 0;
}

function describeD20Results(roll: RollLike): string | null {
  const dice = roll.dice;

  if (!Array.isArray(dice)) return null;

  const d20 = dice.find(isD20DieLike);
  if (!d20) return null;

  const results = Array.isArray(d20.results) ? d20.results : [];
  const values = results.flatMap((result) => {
    if (!result || typeof result !== "object") return [];

    const value = (result as { result?: unknown }).result;
    return typeof value === "number" && Number.isFinite(value) ? [Math.trunc(value)] : [];
  });

  return values.length > 0 ? `(${values.join(", ")})` : null;
}

function isD20DieLike(value: unknown): value is { faces?: unknown; results?: unknown[] } {
  return Boolean(value && typeof value === "object" && (value as { faces?: unknown }).faces === 20);
}
