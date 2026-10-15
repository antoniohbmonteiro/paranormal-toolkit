import type { AllyAbilityDefinition, AllyBenefit } from "./ally-definition";
import type { AllySupportState } from "./ally-support-state";

export type AllyBenefitSource = {
  allyId: string; state: AllySupportState; sequenceBySource?: Record<string, number>;
  abilities: { id: string; definition: AllyAbilityDefinition }[];
};
export type ResolvedAllyBenefit = AllyBenefit & {
  allyId: string; itemId: string; beneficiaryId: string; sourceKey: string; sequence: number;
};

export function resolveAllyBenefits(sources: AllyBenefitSource[]): ResolvedAllyBenefit[] {
  const candidates: ResolvedAllyBenefit[] = [];
  for (const source of sources) {
    if (source.state.status !== "active" || !source.state.beneficiaryId) continue;
    for (const item of source.abilities) for (const benefit of item.definition.benefits) {
      const candidate = { ...benefit, allyId: source.allyId, itemId: item.id,
        beneficiaryId: source.state.beneficiaryId, sequence: source.state.sequence,
        sourceKey: JSON.stringify([source.allyId, item.id, benefit.id]) };
      candidate.sequence = source.sequenceBySource?.[candidate.sourceKey] ?? candidate.sequence;
      candidates.push(candidate);
    }
  }
  const claimed = new Map<string, string>();
  const resolved: ResolvedAllyBenefit[] = [];
  // Resolve individual changes, preserving independent changes in overlapping multi-change effects.
  for (const candidate of candidates.sort((a, b) => b.sequence - a.sequence || (a.sourceKey < b.sourceKey ? 1 : -1))) {
    const changes = candidate.template.system.changes.filter(change => {
      const key = JSON.stringify([candidate.beneficiaryId, change.key, change.phase, change.type]);
      if (claimed.has(key) && claimed.get(key) !== candidate.sourceKey) return false;
      claimed.set(key, candidate.sourceKey); return true;
    });
    const statuses = candidate.template.statuses.filter(status => {
      const key = JSON.stringify([candidate.beneficiaryId, "status", status]);
      if (claimed.has(key) && claimed.get(key) !== candidate.sourceKey) return false;
      claimed.set(key, candidate.sourceKey); return true;
    });
    if (!changes.length && !statuses.length) continue;
    resolved.push({ ...candidate, template: { ...candidate.template,
      system: { ...candidate.template.system, changes }, statuses } });
  }
  return resolved.sort((a, b) => a.sourceKey.localeCompare(b.sourceKey));
}
