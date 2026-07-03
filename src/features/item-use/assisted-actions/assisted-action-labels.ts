export type AssistedDamageMode = "normal" | "half";

export type PublicDamageAppliedLabelInput = {
  inputAmount: number;
  mode?: AssistedDamageMode | null;
  compact?: boolean;
};

export function createPublicDamageAppliedLabel(input: PublicDamageAppliedLabelInput): string {
  void input.mode;
  return `✓ ${normalizeDamageAmount(input.inputAmount)} PV`;
}

export function createPublicDamageActionLabel(input: { inputAmount: number; mode: AssistedDamageMode; compact?: boolean }): string {
  const amount = normalizeDamageAmount(input.inputAmount);
  if (input.compact) return input.mode === "half" ? `½ ${amount} PV` : `${amount} PV`;
  return input.mode === "half" ? `Metade: ${amount} PV` : `Normal: ${amount} PV`;
}

function normalizeDamageAmount(amount: number): number {
  return Number.isFinite(amount) ? Math.max(0, Math.trunc(amount)) : 0;
}
