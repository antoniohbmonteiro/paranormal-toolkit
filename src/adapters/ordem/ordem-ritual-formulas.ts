export function calculateParanormalCostDifficulty(peCost: number): number {
  return 20 + Math.max(0, Math.trunc(peCost));
}
