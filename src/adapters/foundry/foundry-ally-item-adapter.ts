import { MODULE_ID } from "../../constants";
import { allyGrantKey, type AllyGrant, type AllyGrantData } from "../../core/allies/ally-grant";
import { stableEffectFingerprint, readEffectTemplate } from "../../core/allies/ally-passive-effect";
import { getActorItems } from "../../features/automation/actor-item-resolver";
import type { AllyLedger } from "../../features/allies/ally-support-service";
import type { AllyGrantedItemAdapter } from "../../features/allies/ally-granted-ability-service";
import { readGrantedItemEffects } from "./foundry-ally-item-effects";
import { ALLY_TYPE } from "../../features/allies/config/ally-ability-config";

export const ALLY_GRANT_FLAG = "allyGrantedAbility";
export const ALLY_ROUTE_INDEX = "allyGrantRouteIndex";
export const ALLY_ROUTE_PROTOCOL = "allyGrantProtocol";
export type AllyRouteIndex = { version: 1; ledgerInstanceId: string; anchor: string; revision: number;
  entries: { actorId: string; itemId: string; grantId: string }[] };
export function readAllyRouteIndex(value: unknown): AllyRouteIndex | null {
  const v = value as AllyRouteIndex | null;
  if (!v || v.version !== 1 || typeof v.ledgerInstanceId !== "string" || !v.ledgerInstanceId
    || typeof v.anchor !== "string" || !Number.isSafeInteger(v.revision) || v.revision < 0 || !Array.isArray(v.entries)
    || !v.entries.every(entry => entry && [entry.actorId, entry.itemId, entry.grantId].every(id => typeof id === "string" && id.length))) return null;
  return v;
}
export function grantSourceData(item: Item): { data: AllyGrantData; fingerprint: string; diagnostic: string | null } {
  const raw = item.toObject(true);
  const flags: Record<string, unknown> = {};
  for (const key of ["abilityRollConfig", "automation"]) {
    const value = item.getFlag(MODULE_ID, key);
    if (value !== undefined) flags[key] = structuredClone(value);
  }
  const policy = readGrantedItemEffects(item);
  const data: AllyGrantData = { type: "ability", name: item.name, img: String(raw.img ?? "icons/svg/item-bag.svg"),
    system: structuredClone(raw.system as Record<string, unknown>), flags: { [MODULE_ID]: flags }, effects: policy.effects };
  return { data, fingerprint: stableEffectFingerprint(data), diagnostic: policy.diagnostic };
}
function actor(id: string): Actor {
  const found = game.actors.get?.(id);
  if (!found || found.type !== "agent" || found.isToken) throw new Error("Destinatário persistente ausente.");
  return found;
}
export function grantItem(grant: AllyGrant): Item | undefined {
  return getActorItems(actor(grant.actorId)).find(item => item.id === grant.itemId);
}
function marker(grant: AllyGrant, ledgerId: string) {
  return { version: 1, ledgerInstanceId: ledgerId, grantId: grant.grantId, allyId: grant.allyId,
    sourceItemId: grant.sourceItemId, diagnostic: grant.diagnostic };
}
function comparableEffect(effect: Record<string, unknown>) {
  return { template: readEffectTemplate(effect), transfer: effect.transfer, disabled: effect.disabled, origin: effect.origin };
}
export class FoundryAllyItemAdapter implements AllyGrantedItemAdapter {
  constructor(private readonly assertExecutor: () => void) {}
  sources(ledger: AllyLedger) {
    return ledger.links.flatMap(link => {
      const source = game.actors.get?.(link.allyId);
      const target = link.state.beneficiaryId && game.actors.get?.(link.state.beneficiaryId);
      if (!source || source.type !== ALLY_TYPE || source.isToken || link.state.status !== "active"
        || !target || target.type !== "agent" || target.isToken) return [];
      return getActorItems(source).filter(item => item.type === "ability" && item.id).map(item => ({
        allyId: link.allyId, sourceItemId: item.id!, actorId: target.id!, activationSequence: link.state.sequence, ...grantSourceData(item),
      }));
    });
  }
  newId(): string { return foundry.utils.randomID(); }
  async publishIndex(ledger: AllyLedger): Promise<void> {
    this.assertExecutor();
    const users = game.users.filter(user => user.isGM);
    const anchors = new Set(users.map(user => user.getFlag?.(MODULE_ID, "allyStore")).filter(value => typeof value === "string"));
    if (anchors.size !== 1) throw new Error("Âncoras do índice de concessões ausentes ou divergentes.");
    const establishedAnchor = [...anchors][0];
    for (const user of users) {
      let anchor = user.getFlag?.(MODULE_ID, "allyStore");
      if (anchor === undefined && user.setFlag) {
        this.assertExecutor();
        await user.setFlag(MODULE_ID, "allyStore", establishedAnchor);
        anchor = user.getFlag?.(MODULE_ID, "allyStore");
      }
      if (typeof anchor !== "string") throw new Error("Âncora do índice de concessões ausente.");
      const protocol = { version: 1, ledgerInstanceId: ledger.ledgerInstanceId, anchor };
      if (stableEffectFingerprint(user.getFlag?.(MODULE_ID, ALLY_ROUTE_PROTOCOL)) !== stableEffectFingerprint(protocol)) {
        this.assertExecutor();
        if (!user.setFlag) throw new Error("Não foi possível publicar o protocolo de concessões.");
        await user.setFlag(MODULE_ID, ALLY_ROUTE_PROTOCOL, protocol);
      }
      const index: AllyRouteIndex = { version: 1, ledgerInstanceId: ledger.ledgerInstanceId, anchor, revision: ledger.revision,
        entries: ledger.managedGrants.map(grant => ({ actorId: grant.actorId, itemId: grant.itemId, grantId: grant.grantId })) };
      // Revision changes unrelated to grants must not cause writes on every turn.
      const old = readAllyRouteIndex(user.getFlag?.(MODULE_ID, ALLY_ROUTE_INDEX));
      if (old?.anchor === anchor && old.ledgerInstanceId === index.ledgerInstanceId
        && stableEffectFingerprint(old.entries) === stableEffectFingerprint(index.entries)) continue;
      this.assertExecutor();
      if (!user.setFlag) throw new Error("Não foi possível publicar o índice protegido.");
      await user.setFlag(MODULE_ID, ALLY_ROUTE_INDEX, index);
    }
  }
  exists(grant: AllyGrant): boolean {
    const target = game.actors.get?.(grant.actorId);
    return Boolean(target && getActorItems(target).some(item => item.id === grant.itemId));
  }
  matches(grant: AllyGrant, data: AllyGrantData, ledgerInstanceId: string): boolean {
    const item = grantItem(grant); if (!item) return false;
    const raw = item.toObject(true);
    for (const key of ["name", "img", "system"]) if (stableEffectFingerprint(raw[key]) !== stableEffectFingerprint(data[key as keyof AllyGrantData])) return false;
    for (const key of ["abilityRollConfig", "automation"]) {
      if (stableEffectFingerprint(item.getFlag(MODULE_ID, key) ?? null)
        !== stableEffectFingerprint((data.flags[MODULE_ID] as Record<string, unknown>)[key] ?? null)) return false;
    }
    const m = item.getFlag(MODULE_ID, ALLY_GRANT_FLAG) as { version?: unknown; ledgerInstanceId?: unknown; allyId?: unknown; sourceItemId?: unknown; grantId?: string; diagnostic?: unknown } | undefined;
    if (m?.version !== 1 || m.ledgerInstanceId !== ledgerInstanceId || m.grantId !== grant.grantId
      || m.allyId !== grant.allyId || m.sourceItemId !== grant.sourceItemId || m.diagnostic !== grant.diagnostic) return false;
    return grant.effectIds.every(id => {
      const expected = data.effects.find(effect => effect._id === id);
      const actual = item.effects?.get(id);
      return expected ? Boolean(actual && stableEffectFingerprint(comparableEffect(actual.toObject(true)))
        === stableEffectFingerprint(comparableEffect(expected))) : !actual;
    });
  }
  assertEffectsAvailable(grant: AllyGrant, data: AllyGrantData): void {
    if (!this.exists(grant)) return;
    const item = grantItem(grant)!;
    if (data.effects.some(effect => !grant.effectIds.includes(String(effect._id)) && item.effects?.get(String(effect._id)))) {
      throw new Error("Identidade de efeito ocupada por efeito não gerenciado; dados preservados.");
    }
  }
  assertExecutionIntegrity(grant: AllyGrant): void {
    const item = grantItem(grant);
    if (!item || item.effects?.contents.some(effect => !grant.effectIds.includes(effect.id))) {
      throw new Error("A concessão contém efeitos não gerenciados. Confira a cópia antes de usar.");
    }
  }
  async create(grant: AllyGrant, data: AllyGrantData, ledger: AllyLedger): Promise<void> {
    this.assertExecutor();
    if (this.exists(grant)) {
      this.assertReservedItem(grant);
      if (!this.matches(grant, data, ledger.ledgerInstanceId)) await this.update(grant, data, ledger);
      return;
    }
    await actor(grant.actorId).createEmbeddedDocuments("Item", [{ ...data, _id: grant.itemId,
      flags: { [MODULE_ID]: { ...(data.flags[MODULE_ID] as object), [ALLY_GRANT_FLAG]: marker(grant, ledger.ledgerInstanceId) } } }],
    { keepId: true, allyGrantReconciliation: true });
    if (!this.exists(grant)) throw new Error("Criação da concessão não confirmada.");
  }
  async update(grant: AllyGrant, data: AllyGrantData, ledger: AllyLedger): Promise<void> {
    this.assertExecutor();
    const item = grantItem(grant); if (!item) throw new Error("Concessão ausente.");
    const flags = data.flags[MODULE_ID] as Record<string, unknown>;
    await item.update({ name: data.name, img: data.img, system: new foundry.data.operators.ForcedReplacement(data.system),
      [`flags.${MODULE_ID}.${ALLY_GRANT_FLAG}`]: marker(grant, ledger.ledgerInstanceId),
      ...Object.fromEntries(["abilityRollConfig", "automation"].map(key => [`flags.${MODULE_ID}.${key}`,
        flags[key] === undefined ? new foundry.data.operators.ForcedDeletion() : new foundry.data.operators.ForcedReplacement(flags[key])])),
    }, { allyGrantReconciliation: true });
    for (const id of grant.effectIds) {
      this.assertExecutor();
      const expected = data.effects.find(effect => effect._id === id);
      const actual = item.effects?.get(id);
      if (!expected) { if (actual) await item.deleteEmbeddedDocuments("ActiveEffect", [id], { allyGrantReconciliation: true }); }
      else if (!actual) await item.createEmbeddedDocuments("ActiveEffect", [expected], { keepId: true, allyGrantReconciliation: true });
      else if (stableEffectFingerprint(comparableEffect(actual.toObject(true))) !== stableEffectFingerprint(comparableEffect(expected))) {
        await item.updateEmbeddedDocuments("ActiveEffect", [{ ...expected, system: new foundry.data.operators.ForcedReplacement(expected.system) }], { allyGrantReconciliation: true });
      }
    }
  }
  async remove(grant: AllyGrant): Promise<void> {
    this.assertExecutor(); const target = game.actors.get?.(grant.actorId);
    if (!grant.provisioned && this.exists(grant)) this.assertReservedItem(grant);
    if (target && this.exists(grant)) await target.deleteEmbeddedDocuments("Item", [grant.itemId], { allyGrantReconciliation: true });
    if (this.exists(grant)) throw new Error("Exclusão da concessão não confirmada.");
  }
  private assertReservedItem(grant: AllyGrant): void {
    const item = grantItem(grant);
    const flag = item?.getFlag(MODULE_ID, ALLY_GRANT_FLAG) as { grantId?: string } | undefined;
    const stats = item?.toObject(true)._stats as { lastModifiedBy?: string } | undefined;
    if (flag?.grantId !== grant.grantId || !game.users.some(user => user.isGM && user.id === stats?.lastModifiedBy)) {
      throw new Error("Identidade reservada ocupada por Item não confirmado; dados preservados.");
    }
  }
}
