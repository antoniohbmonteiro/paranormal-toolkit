import { animateRollWithDiceSoNice } from "../../features/dice/dice-animation-service";
import type {
  RitualCastingAdapter,
  RitualCastingCheckResult,
} from "../../core/rituals/ritual-casting-adapter";

export type OrdemRitualCastingCheckResult = RitualCastingCheckResult & {
  skill: "occultism";
  skillLabel: "Ocultismo";
};

type SkillRollerActor = Actor & {
  rollSkill?: (
    config?: Record<string, unknown>,
    dialog?: Record<string, unknown>,
    message?: Record<string, unknown>
  ) => Promise<unknown> | unknown;
};

type ActorWithRitualDifficulty = Actor & {
  system?: {
    ritual?: {
      DT?: unknown;
    };
  };
};

type RollLike = Roll & {
  dice?: unknown;
  formula?: string;
  total?: number | null;
};

const OCCULTISM_SKILL = "occultism";

export class OrdemRitualCastingAdapter implements RitualCastingAdapter {
  getDifficulty(actor: Actor): number | null {
    return getOrdemRitualDifficulty(actor);
  }

  async rollCastingCheck(actor: Actor): Promise<OrdemRitualCastingCheckResult> {
    const difficulty = this.getDifficulty(actor);

    if (difficulty === null) {
      throw new Error("Não foi possível ler a DT de ritual do conjurador.");
    }

    const roll = await rollNativeSkill(actor, OCCULTISM_SKILL);

    if (!roll) {
      throw new Error("Não foi possível rolar Ocultismo pelo sistema Ordem.");
    }

    await animateRollWithDiceSoNice(roll);

    const total = getRollTotal(roll);

    return {
      skill: OCCULTISM_SKILL,
      skillLabel: "Ocultismo",
      roll,
      formula: getRollFormula(roll),
      total,
      difficulty,
      success: total >= difficulty,
      diceBreakdown: describeD20Results(roll)
    };
  }
}

export function getOrdemRitualDifficulty(actor: Actor): number | null {
  const difficulty = (actor as ActorWithRitualDifficulty).system?.ritual?.DT;
  return typeof difficulty === "number" && Number.isFinite(difficulty) ? Math.trunc(difficulty) : null;
}

export async function rollOrdemRitualCastingCheck(actor: Actor): Promise<OrdemRitualCastingCheckResult> {
  return new OrdemRitualCastingAdapter().rollCastingCheck(actor);
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
