export type AllyBenefit = { id: string; kind: "defense"; value: number };
export type AllyAbilityDefinition = { version: 1; benefits: AllyBenefit[] };

export function readAllyAbilityDefinition(value: unknown): AllyAbilityDefinition | null {
  if (!value || typeof value !== "object") return null;
  const data = value as Record<string, unknown>;
  if (data.version !== 1 || !Array.isArray(data.benefits)) return null;
  const ids = new Set<string>();
  const benefits: AllyBenefit[] = [];
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

export function allyScopeFingerprint(sources: { id: string; definition: AllyAbilityDefinition }[]): string {
  return JSON.stringify([...sources].filter(source => source.definition.benefits.length > 0).sort((a, b) => a.id.localeCompare(b.id)).map(source => ({
    id: source.id, benefits: [...source.definition.benefits].sort((a, b) => a.id.localeCompare(b.id)),
  })));
}
