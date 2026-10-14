import type { ResolvedAllyBenefit } from "../../core/allies/ally-benefit-resolver";

export type AllyManagedEffect = {
  actorId: string; effectId: string; sourceKey: string; value: number; allyId: string;
};
export interface AllyEffectAdapter {
  matches(effect: AllyManagedEffect): boolean;
  exists(effect: AllyManagedEffect): boolean;
  remove(effect: AllyManagedEffect): Promise<void>;
  create(effect: AllyManagedEffect): Promise<void>;
  newId(): string;
}
export class AllyReconciliationService {
  constructor(private readonly effects: AllyEffectAdapter) {}
  async reconcile(
    desired: ResolvedAllyBenefit[], managed: AllyManagedEffect[],
    persist: (effects: AllyManagedEffect[]) => Promise<void>,
  ): Promise<AllyManagedEffect[]> {
    let inventory = [...managed];
    const expected = desired.map(benefit => ({
      actorId: benefit.beneficiaryId, allyId: benefit.allyId,
      sourceKey: benefit.sourceKey, value: benefit.value,
    }));
    for (const effect of [...inventory]) {
      const wanted = expected.find(entry => entry.actorId === effect.actorId && entry.sourceKey === effect.sourceKey
        && entry.value === effect.value);
      if (wanted && (this.effects.matches(effect) || !this.effects.exists(effect))) continue;
      if (this.effects.exists(effect)) await this.effects.remove(effect);
      inventory = inventory.filter(entry => entry.effectId !== effect.effectId || entry.actorId !== effect.actorId);
      await persist(inventory);
    }
    for (const effect of expected) {
      const existing = inventory.find(entry => entry.actorId === effect.actorId && entry.sourceKey === effect.sourceKey);
      if (existing) {
        if (!this.effects.exists(existing)) await this.effects.create(existing);
        continue;
      }
      const tracked = { ...effect, effectId: this.effects.newId() };
      inventory = [...inventory, tracked];
      // Persist the identity before creation so a lost response remains recoverable.
      await persist(inventory);
      await this.effects.create(tracked);
    }
    return inventory;
  }
}
