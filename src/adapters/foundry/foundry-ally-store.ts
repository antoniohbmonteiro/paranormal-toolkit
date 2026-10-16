import { MODULE_ID } from "../../constants";
import { createAllyLedger, type AllyLedger, type AllyStore } from "../../features/allies/ally-support-service";
import { readAllyRequest } from "../../features/allies/ally-operation-authority";
import { isAllyNoticeSnapshot } from "../../features/allies/ally-support-notifications";
import { readEffectTemplate } from "../../core/allies/ally-passive-effect";
import { isAllyExecutionReceipt } from "../../features/allies/ally-execution-receipts";

export const ALLY_STORE_FLAG = "allyStore";
export const ALLY_LEDGER_FLAG = "allyLedger";

export function readAllyLedger(value: unknown, migrationId = "legacy"): AllyLedger {
  const fail = (): never => { throw new Error("Registro Allies corrompido ou incompatível; nenhuma normalização foi aplicada."); };
  if (!value || typeof value !== "object") return fail();
  const raw = value as Record<string, unknown>;
  const legacy = raw.version === 1;
  const ledger = value as AllyLedger;
  if ((!legacy && raw.version !== 2 && raw.version !== 3 && raw.version !== 4) || !Number.isSafeInteger(ledger.revision) || ledger.revision < 0
    || !Number.isSafeInteger(ledger.nextSequence) || ledger.nextSequence < 1
    || !Array.isArray(ledger.links) || !Array.isArray(ledger.managed) || !Array.isArray(ledger.orders)
    || (legacy && !(raw.validatedRuntime === null || typeof raw.validatedRuntime === "string"))
    || !(ledger.diagnostic === null || typeof ledger.diagnostic === "string")) return fail();
  const allyIds = new Set<string>();
  for (const link of ledger.links) {
    if (!link || typeof link.allyId !== "string" || allyIds.has(link.allyId) || !link.state
      || !["inactive", "active", "pending"].includes(link.state.status)
      || !(link.state.beneficiaryId === null || typeof link.state.beneficiaryId === "string")
      || !Number.isSafeInteger(link.state.sequence) || link.state.sequence < 0
      || link.state.sequence >= ledger.nextSequence
      || !(link.diagnostic === null || typeof link.diagnostic === "string")) return fail();
    allyIds.add(link.allyId);
    if (link.pilotId !== undefined && link.pilotId !== null && (typeof link.pilotId !== "string" || !link.pilotId.trim())) return fail();
    if (link.state.wait === undefined) return fail();
    if (link.state.status !== "inactive" && !link.state.beneficiaryId) return fail();
    if (link.state.status === "pending" && !link.state.wait) return fail();
    if (link.state.wait !== null && (!link.state.wait || typeof link.state.wait !== "object")) return fail();
    if (link.state.wait && (typeof link.state.wait.combatId !== "string"
      || !Number.isSafeInteger(link.state.wait.round) || link.state.wait.round < 1)) return fail();
    if (legacy) {
      const old = link as unknown as { approval: { beneficiaryId: string; scope: string } | null;
        pending: { userId: string; request: Record<string, unknown> } | null };
      if (old.approval !== null && (!old.approval || typeof old.approval.beneficiaryId !== "string"
        || typeof old.approval.scope !== "string")) return fail();
      if (old.pending !== null) {
        const request = old.pending?.request;
        if (!old.pending || typeof old.pending.userId !== "string" || !request
          || !["assign", "activate", "deactivate", "approve", "validate", "reconcile"].includes(String(request.action))
          || (request.scope !== undefined && typeof request.scope !== "string")
          || !readAllyRequest({ ...request, action: ["approve", "validate"].includes(String(request.action)) ? "reconcile" : request.action })) return fail();
      }
    } else if (!Array.isArray(link.suppressedSources) || !link.suppressedSources.every(key => typeof key === "string")
      || new Set(link.suppressedSources).size !== link.suppressedSources.length
      || !(link.notice === null || isAllyNoticeSnapshot(link.notice))) return fail();
  }
  const orderKeys = new Set<string>();
  const orderSequences = new Set<number>();
  for (const order of ledger.orders) {
    if (!order || typeof order.sourceKey !== "string" || !Number.isSafeInteger(order.activationSequence)
      || order.activationSequence < 0 || !Number.isSafeInteger(order.sequence) || order.sequence < 1
      || order.sequence >= ledger.nextSequence) return fail();
    const key = JSON.stringify([order.sourceKey, order.activationSequence]);
    if (orderKeys.has(key) || orderSequences.has(order.sequence)) return fail();
    orderKeys.add(key);
    orderSequences.add(order.sequence);
  }
  const effects = new Set<string>();
  for (const effect of ledger.managed) {
    if (!effect || typeof effect.actorId !== "string" || typeof effect.effectId !== "string"
      || typeof effect.allyId !== "string" || typeof effect.sourceKey !== "string"
      || (effect.template ? !readEffectTemplate(effect.template) : typeof effect.value !== "number" || !Number.isFinite(effect.value))
      || (effect.itemId !== undefined && typeof effect.itemId !== "string")
      || (effect.sourceEffectId !== undefined && typeof effect.sourceEffectId !== "string")) return fail();
    const key = JSON.stringify([effect.actorId, effect.effectId]);
    if (effects.has(key)) return fail();
    effects.add(key);
  }
  if (raw.version === 4) {
    if (typeof ledger.ledgerInstanceId !== "string" || !ledger.ledgerInstanceId
      || typeof ledger.executionGeneration !== "string" || !Array.isArray(ledger.managedGrants)
      || !Array.isArray(ledger.receipts) || ledger.receipts.length > 256 || !ledger.receipts.every(isAllyExecutionReceipt)
      || !Number.isSafeInteger(ledger.nextExecutionSequence) || ledger.nextExecutionSequence < 1
      || !Number.isSafeInteger(ledger.retiredExecutionThrough) || ledger.retiredExecutionThrough < 0
      || ledger.retiredExecutionThrough >= ledger.nextExecutionSequence) return fail();
    const ids = new Set<string>(); const grantIds = new Set<string>(); const sources = new Set<string>();
    for (const grant of ledger.managedGrants) {
      if (!grant || ![grant.grantId, grant.allyId, grant.sourceItemId, grant.actorId, grant.itemId, grant.fingerprint]
        .every(id => typeof id === "string" && id.length > 0) || !Number.isSafeInteger(grant.activationSequence)
        || grant.activationSequence < 0 || !Array.isArray(grant.effectIds) || !grant.effectIds.every(id => typeof id === "string" && id.length)
        || new Set(grant.effectIds).size !== grant.effectIds.length
        || typeof grant.provisioned !== "boolean"
        || !(grant.diagnostic === null || typeof grant.diagnostic === "string") || ids.has(`${grant.actorId}/${grant.itemId}`)
        || grantIds.has(grant.grantId) || sources.has(`${grant.allyId}/${grant.sourceItemId}`)) return fail();
      ids.add(`${grant.actorId}/${grant.itemId}`);
      grantIds.add(grant.grantId); sources.add(`${grant.allyId}/${grant.sourceItemId}`);
    }
    const sequences = new Set<number>(); const messages = new Set<string>();
    for (const receipt of ledger.receipts) {
      if (receipt.ledgerInstanceId !== ledger.ledgerInstanceId || receipt.sequence >= ledger.nextExecutionSequence
        || sequences.has(receipt.sequence) || messages.has(receipt.messageId)) return fail();
      sequences.add(receipt.sequence); messages.add(receipt.messageId);
    }
    for (const link of ledger.links) if (!Array.isArray(link.suppressedGrants)
      || !link.suppressedGrants.every(id => typeof id === "string") || new Set(link.suppressedGrants).size !== link.suppressedGrants.length) return fail();
  }
  const copy = structuredClone(ledger);
  return { version: 4, revision: copy.revision, nextSequence: copy.nextSequence,
    ledgerInstanceId: raw.version === 4 ? copy.ledgerInstanceId : migrationId,
    managedGrants: raw.version === 4 ? copy.managedGrants : [], receipts: raw.version === 4 ? copy.receipts : [],
    nextExecutionSequence: raw.version === 4 ? copy.nextExecutionSequence : 1,
    retiredExecutionThrough: raw.version === 4 ? copy.retiredExecutionThrough : 0,
    executionGeneration: raw.version === 4 ? copy.executionGeneration : "",
    managed: copy.managed, orders: copy.orders, diagnostic: legacy ? null : copy.diagnostic,
    links: copy.links.map(link => ({ allyId: link.allyId, state: link.state, pilotId: link.pilotId ?? null,
      diagnostic: legacy ? null : link.diagnostic, suppressedSources: legacy ? [] : link.suppressedSources,
      suppressedGrants: raw.version === 4 ? link.suppressedGrants : [],
      notice: legacy ? null : link.notice })) };
}

export class FoundryAllyStore implements AllyStore {
  private journal: AllyJournalLike | null = null;
  constructor(private readonly assertWriter: () => void = () => {}) {}
  private assertGM(): void {
    if (!game.user?.isGM) throw new Error("O registro operacional exige um GM.");
  }
  private assertProtected(document: AllyJournalLike): void {
    if (document.documentName !== "JournalEntry") throw new Error("Referência operacional inválida.");
    for (const user of game.users) {
      if (!user.isGM && document.testUserPermission(user, "LIMITED")) {
        throw new Error("O registro operacional não está restrito aos GMs.");
      }
    }
  }
  private async resolve(create: boolean): Promise<AllyJournalLike | null> {
    this.assertGM();
    const gmUsers = Array.from(game.users).filter(user => user.isGM);
    if (gmUsers.some(user => {
      const anchor = user.getFlag?.(MODULE_ID, ALLY_STORE_FLAG);
      return anchor !== undefined && typeof anchor !== "string";
    })) throw new Error("Referência operacional de GM inválida.");
    const anchors = new Set(gmUsers
      .map(user => user.getFlag?.(MODULE_ID, ALLY_STORE_FLAG)).filter(value => typeof value === "string"));
    if (anchors.size > 1) throw new Error("Referências operacionais dos GMs divergem. Revise o registro.");
    const reference = [...anchors][0];
    if (reference) {
      const document = await fromUuid(reference);
      if (!document || typeof document !== "object") throw new Error("Registro operacional ancorado não encontrado.");
      const journal = document as AllyJournalLike;
      this.assertProtected(journal);
      return journal;
    }
    if (!create) return null;
    this.assertWriter();
    const journal = await foundry.documents.JournalEntry.create({
      name: "Paranormal Toolkit — Allies (registro operacional)",
      ownership: { default: 0 }, pages: [],
      flags: { [MODULE_ID]: { [ALLY_LEDGER_FLAG]: createAllyLedger() } },
    });
    if (!journal) throw new Error("Não foi possível criar o registro operacional.");
    this.assertProtected(journal);
    if (!game.user?.setFlag) throw new Error("A referência do GM não pode ser persistida.");
    for (const user of gmUsers) {
      this.assertWriter();
      if (!user.setFlag) throw new Error("A referência de um GM não pode ser persistida.");
      await user.setFlag(MODULE_ID, ALLY_STORE_FLAG, journal.uuid);
    }
    return journal;
  }
  async load(create = false): Promise<AllyLedger | null> {
    this.journal = await this.resolve(create);
    return this.journal ? readAllyLedger(this.journal.getFlag(MODULE_ID, ALLY_LEDGER_FLAG), this.journal.uuid) : null;
  }
  async save(ledger: AllyLedger): Promise<void> {
    this.assertGM();
    this.assertWriter();
    if (!this.journal) throw new Error("O registro operacional não foi carregado.");
    this.assertProtected(this.journal);
    const previous = this.journal.getFlag(MODULE_ID, ALLY_LEDGER_FLAG);
    const removeLegacyGate = previous && typeof previous === "object" && Object.hasOwn(previous, "validatedRuntime");
    await this.journal.setFlag(MODULE_ID, ALLY_LEDGER_FLAG, {
      ...readAllyLedger(ledger), ...(removeLegacyGate ? { validatedRuntime: new foundry.data.operators.ForcedDeletion() } : {}),
    });
  }
}
