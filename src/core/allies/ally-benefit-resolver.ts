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
  const winners = new Map<string, ResolvedAllyBenefit>();
  for (const source of sources) {
    if (source.state.status !== "active" || !source.state.beneficiaryId) continue;
    for (const item of source.abilities) for (const benefit of item.definition.benefits) {
      const candidate = { ...benefit, allyId: source.allyId, itemId: item.id,
        beneficiaryId: source.state.beneficiaryId, sequence: source.state.sequence,
        sourceKey: JSON.stringify([source.allyId, item.id, benefit.id]) };
      candidate.sequence = source.sequenceBySource?.[candidate.sourceKey] ?? candidate.sequence;
      const key = JSON.stringify([candidate.beneficiaryId, benefit.kind]);
      const previous = winners.get(key);
      if (!previous || candidate.sequence > previous.sequence
        || (candidate.sequence === previous.sequence && candidate.sourceKey > previous.sourceKey)) {
        winners.set(key, candidate);
      }
    }
  }
  return [...winners.values()].sort((a, b) => a.sourceKey.localeCompare(b.sourceKey));
}
