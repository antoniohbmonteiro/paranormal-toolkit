import { allyGrantKey, type AllyGrant, type AllyGrantData } from "../../core/allies/ally-grant";
import type { AllyLedger } from "./ally-support-service";

export interface AllyGrantedItemAdapter {
  sources(ledger: AllyLedger): { allyId: string; sourceItemId: string; actorId: string; activationSequence: number;
    data: AllyGrantData; fingerprint: string; diagnostic: string | null }[];
  newId(): string;
  publishIndex(ledger: AllyLedger): Promise<void>;
  exists(grant: AllyGrant): boolean;
  matches(grant: AllyGrant, data: AllyGrantData, ledgerInstanceId: string): boolean;
  assertEffectsAvailable(grant: AllyGrant, data: AllyGrantData): void;
  create(grant: AllyGrant, data: AllyGrantData, ledger: AllyLedger): Promise<void>;
  update(grant: AllyGrant, data: AllyGrantData, ledger: AllyLedger): Promise<void>;
  remove(grant: AllyGrant): Promise<void>;
}
export class AllyGrantedAbilityService {
  constructor(private readonly adapter: AllyGrantedItemAdapter) {}
  async reconcile(ledger: AllyLedger, persist: () => Promise<void>): Promise<void> {
    const desired = this.adapter.sources(ledger);
    for (const grant of [...ledger.managedGrants]) {
      if (desired.some(source => source.allyId === grant.allyId && source.sourceItemId === grant.sourceItemId
        && source.actorId === grant.actorId
        && !ledger.links.find(link => link.allyId === grant.allyId)?.suppressedGrants?.includes(allyGrantKey(grant.allyId, grant.sourceItemId)))) continue;
      if (this.adapter.exists(grant)) await this.adapter.remove(grant);
      ledger.managedGrants = ledger.managedGrants.filter(entry => entry !== grant);
      await persist(); await this.adapter.publishIndex(ledger);
    }
    for (const source of desired) {
      const key = allyGrantKey(source.allyId, source.sourceItemId);
      if (ledger.links.find(link => link.allyId === source.allyId)?.suppressedGrants?.includes(key)) continue;
      let grant = ledger.managedGrants.find(entry => entry.allyId === source.allyId
        && entry.sourceItemId === source.sourceItemId && entry.actorId === source.actorId);
      if (!grant) {
        grant = { allyId: source.allyId, sourceItemId: source.sourceItemId, actorId: source.actorId,
          itemId: this.adapter.newId(), grantId: this.adapter.newId(), activationSequence: source.activationSequence,
          fingerprint: source.fingerprint, diagnostic: source.diagnostic, effectIds: [], provisioned: false };
        let attempts = 0;
        while (this.adapter.exists(grant)) {
          if (++attempts > 10) throw new Error("Não foi possível reservar uma identidade livre para a concessão.");
          grant.itemId = this.adapter.newId();
        }
        ledger.managedGrants.push(grant); await persist();
      }
      if (grant.fingerprint !== source.fingerprint || grant.diagnostic !== source.diagnostic || grant.activationSequence !== source.activationSequence) {
        Object.assign(grant, { fingerprint: source.fingerprint, diagnostic: source.diagnostic, activationSequence: source.activationSequence });
        await persist();
      }
      const ids = source.data.effects.map(effect => String(effect._id));
      this.adapter.assertEffectsAvailable(grant, source.data);
      const union = [...new Set([...grant.effectIds, ...ids])];
      if (JSON.stringify(union) !== JSON.stringify(grant.effectIds)) { grant.effectIds = union; await persist(); }
      await this.adapter.publishIndex(ledger);
      if (!grant.provisioned || !this.adapter.exists(grant)) {
        await this.adapter.create(grant, source.data, ledger);
        if (!grant.provisioned) { grant.provisioned = true; await persist(); }
      }
      else if (!this.adapter.matches(grant, source.data, ledger.ledgerInstanceId)) await this.adapter.update(grant, source.data, ledger);
      if (JSON.stringify(grant.effectIds) !== JSON.stringify(ids)) { grant.effectIds = ids; await persist(); }
    }
    await this.adapter.publishIndex(ledger);
  }
}
