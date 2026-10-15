import type { AllyEffectTemplate } from "./ally-passive-effect";
export type LegacyAllyBenefit = { id: string; kind: "defense"; value: number };
export type LegacyAllyAbilityDefinition = { version: 1; benefits: LegacyAllyBenefit[] };
export type AllyBenefit = { id: string; effectId: string; template: AllyEffectTemplate };
export type AllyAbilityDefinition = { version: 2; benefits: AllyBenefit[] };

export function readAllyAbilityDefinition(value: unknown): LegacyAllyAbilityDefinition | null {
  if (!value || typeof value !== "object") return null;
  const data = value as Record<string, unknown>;
  if (data.version !== 1 || !Array.isArray(data.benefits)) return null;
  const ids = new Set<string>();
  const benefits: LegacyAllyBenefit[] = [];
  for (const entry of data.benefits) {
    if (!entry || typeof entry !== "object") return null;
    const benefit = entry as Record<string, unknown>;
    if (typeof benefit.id !== "string" || !benefit.id || ids.has(benefit.id)
      || benefit.kind !== "defense" || typeof benefit.value !== "number"
      || !Number.isFinite(benefit.value)) return null;
    ids.add(benefit.id);
    benefits.push({ id: benefit.id, kind: "defense", value: benefit.value });
  }
  return { version: 1, benefits };
}

export function allyScopeFingerprint(sources: { id: string; definition: LegacyAllyAbilityDefinition }[]): string {
  return JSON.stringify([...sources].filter(source => source.definition.benefits.length > 0).sort((a, b) => a.id.localeCompare(b.id)).map(source => ({
    id: source.id, benefits: [...source.definition.benefits].sort((a, b) => a.id.localeCompare(b.id)),
  })));
}
