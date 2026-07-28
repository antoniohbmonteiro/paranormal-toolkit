import { animateRollWithDiceSoNice } from "../dice/dice-animation-service";
import type {
  AbilityRollIntent,
  ResolvedAbilityRoll,
} from "./config/ability-roll-config";

export type ExecutedAbilityRoll = {
  id: string;
  sourceRollId: string;
  label: string;
  intent: AbilityRollIntent;
  damageType: string | null;
  formula: string;
  total: number;
  diceResults: number[];
  nexThreshold: number | null;
};

export async function executeAbilityRolls(
  rolls: readonly ResolvedAbilityRoll[],
  actor: Actor,
): Promise<ExecutedAbilityRoll[]> {
  const results: ExecutedAbilityRoll[] = [];
  const rollData = resolveActorRollData(actor);

  for (const input of rolls) {
    const evaluated = await evaluateAbilityRoll(input, rollData);
    await animateRollWithDiceSoNice(evaluated);
    results.push(createExecutedAbilityRoll(input, evaluated));
  }

  return results;
}

async function evaluateAbilityRoll(
  input: ResolvedAbilityRoll,
  rollData: Record<string, unknown>,
): Promise<Roll> {
  const evaluated = await Promise.resolve(
    new Roll(input.formula, rollData).evaluate(),
  );

  if (typeof evaluated.total !== "number" || !Number.isFinite(evaluated.total)) {
    throw new Error(`A rolagem ${input.label} não retornou um total válido.`);
  }

  return evaluated;
}

function createExecutedAbilityRoll(
  input: ResolvedAbilityRoll,
  evaluated: Roll,
): ExecutedAbilityRoll {
  return {
    ...input,
    total: evaluated.total as number,
    diceResults: readDiceResults(evaluated),
  };
}

function resolveActorRollData(actor: Actor): Record<string, unknown> {
  const value = (actor as { getRollData?: () => unknown }).getRollData?.();
  return value && typeof value === "object"
    ? (value as Record<string, unknown>)
    : {};
}

function readDiceResults(roll: Roll): number[] {
  const dice = (roll as { dice?: unknown }).dice;
  if (!Array.isArray(dice)) return [];

  return dice.flatMap((die) => readDieResults(die));
}

function readDieResults(die: unknown): number[] {
  const results = (die as { results?: unknown }).results;
  if (!Array.isArray(results)) return [];

  return results.flatMap((result) => {
    const value = (result as { result?: unknown }).result;
    return typeof value === "number" && Number.isFinite(value) ? [value] : [];
  });
}
