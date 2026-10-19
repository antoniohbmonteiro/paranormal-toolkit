export type AttackDicePool = { number: number; faces: number; modifiers: string[] };

export function resolveWeaponDamageFaces(formula: unknown): number | null {
  if (typeof formula !== "string") return null;
  const match = /^\s*([1-9]\d*)d([1-9]\d*)\s*$/.exec(formula);
  if (!match) return null;
  const number = Number(match[1]), faces = Number(match[2]);
  return Number.isSafeInteger(number) && Number.isSafeInteger(faces) ? faces : null;
}
export function applyAttackDiceModifier(pool: AttackDicePool, modifier: number): AttackDicePool {
  if (!Number.isSafeInteger(modifier) || !Number.isSafeInteger(pool.number) || pool.number < 1
    || pool.faces !== 20 || pool.modifiers.length !== 1 || !["kh", "kh1", "kl", "kl1"].includes(pool.modifiers[0])) {
    throw new Error("A fórmula nativa de ataque não permite aplicar os modificadores de dados com segurança.");
  }
  if (modifier === 0) return { ...pool, modifiers: [...pool.modifiers] };
  const rank = (pool.modifiers[0].startsWith("kh") ? pool.number : 2 - pool.number) + modifier;
  const number = rank >= 1 ? rank : 2 - rank;
  if (!Number.isSafeInteger(rank) || !Number.isSafeInteger(number)) throw new Error("A quantidade de dados de ataque excede os limites numéricos.");
  return { number, faces: 20, modifiers: [rank >= 1 ? "kh" : "kl"] };
}
