import { animateRollWithDiceSoNice } from "../dice/dice-animation-service";
import type { AbilityRollIntent, ResolvedAbilityRoll } from "./config/ability-roll-config";

export type ExecutedAbilityRoll = {
  id: string; sourceRollId: string; label: string; intent: AbilityRollIntent;
  damageType: string | null; formula: string; total: number;
  diceResults: number[]; nexThreshold: number | null;
};

export async function executeAbilityRolls(rolls: readonly ResolvedAbilityRoll[], actor: Actor): Promise<ExecutedAbilityRoll[]> {
  const results: ExecutedAbilityRoll[] = [];
  const data = resolveActorRollData(actor);
  for (const input of rolls) {
    const evaluated = await Promise.resolve(new Roll(input.formula, data).evaluate());
    if (typeof evaluated.total !== "number" || !Number.isFinite(evaluated.total)) throw new Error(`A rolagem ${input.label} não retornou um total válido.`);
    await animateRollWithDiceSoNice(evaluated);
    results.push({ ...input, total: evaluated.total, diceResults: readDiceResults(evaluated) });
  }
  return results;
}
function resolveActorRollData(actor: Actor): Record<string, unknown> {
  const value = (actor as { getRollData?: () => unknown }).getRollData?.();
  return value && typeof value === "object" ? value as Record<string, unknown> : {};
}
function readDiceResults(roll: Roll): number[] {
  const dice = (roll as { dice?: unknown }).dice;
  if (!Array.isArray(dice)) return [];
  return dice.flatMap((die) => {
    const results = (die as { results?: unknown }).results;
    return Array.isArray(results) ? results.flatMap((result) => {
      const value = (result as { result?: unknown }).result;
      return typeof value === "number" && Number.isFinite(value) ? [value] : [];
    }) : [];
  });
}
