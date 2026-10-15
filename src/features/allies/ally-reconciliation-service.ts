import type { ResolvedAllyBenefit } from "../../core/allies/ally-benefit-resolver";
import type { AllyEffectTemplate } from "../../core/allies/ally-passive-effect";
import { stableEffectFingerprint } from "../../core/allies/ally-passive-effect";

export type AllyManagedEffect = {
  actorId: string; effectId: string; sourceKey: string; allyId: string;
  value?: number; template?: AllyEffectTemplate; itemId?: string; sourceEffectId?: string;
};
export interface AllyEffectAdapter {
  matches(effect: AllyManagedEffect): boolean;
  exists(effect: AllyManagedEffect): boolean;
  remove(effect: AllyManagedEffect): Promise<void>;
  create(effect: AllyManagedEffect): Promise<void>;
  update(effect: AllyManagedEffect): Promise<void>;
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
      sourceKey: benefit.sourceKey, template: benefit.template, itemId: benefit.itemId, sourceEffectId: benefit.effectId,
    }));
    for (const effect of [...inventory]) {
      const wanted = expected.find(entry => entry.actorId === effect.actorId && entry.sourceKey === effect.sourceKey);
      if (wanted) continue;
      if (this.effects.exists(effect)) await this.effects.remove(effect);
      inventory = inventory.filter(entry => entry.effectId !== effect.effectId || entry.actorId !== effect.actorId);
      await persist(inventory);
    }
    for (const effect of expected) {
      const existing = inventory.find(entry => entry.actorId === effect.actorId && entry.sourceKey === effect.sourceKey);
      const tracked = { ...effect, effectId: existing?.effectId ?? this.effects.newId() };
      if (!existing || stableEffectFingerprint(existing) !== stableEffectFingerprint(tracked)) {
        inventory = [...inventory.filter(entry => entry !== existing), tracked];
        // Persist the identity and desired snapshot before a write, including in-place upgrades.
        await persist(inventory);
      }
      if (!this.effects.exists(tracked)) await this.effects.create(tracked);
      else if (!this.effects.matches(tracked)) await this.effects.update(tracked);
    }
    return inventory;
  }
}
