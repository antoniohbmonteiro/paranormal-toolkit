import type { AllyAbilityDefinition } from "../../core/allies/ally-definition";
import { resolveAllyBenefits } from "../../core/allies/ally-benefit-resolver";
import { createAllySupportState, transitionAllySupport, type AllySupportState, type AllyCombatSnapshot } from "../../core/allies/ally-support-state";
import { authorizeAllyRequest, electAllyExecutor, readAllyRequest, type AllyRequest, type AllyUser } from "./ally-operation-authority";
import { AllyReconciliationService, type AllyManagedEffect } from "./ally-reconciliation-service";
import { buildAllySupportChange, type AllyNoticeSnapshot, type AllySupportChange } from "./ally-support-notifications";
import type { AllyGrant } from "../../core/allies/ally-grant";
import { allyGrantKey } from "../../core/allies/ally-grant";
import type { AllyExecutionReceipt } from "./ally-execution-receipts";
import type { AllyGrantedAbilityService } from "./ally-granted-ability-service";
import { AllyOperationQueue } from "./ally-operation-queue";

export type AllyLink = {
  allyId: string; state: AllySupportState;
  pilotId?: string | null;
  suppressedSources: string[];
  suppressedGrants?: string[];
  notice: AllyNoticeSnapshot | null;
  diagnostic: string | null;
};
export type AllyLedger = {
  version: 4; revision: number; nextSequence: number; links: AllyLink[];
  ledgerInstanceId: string; managedGrants: AllyGrant[]; receipts: AllyExecutionReceipt[];
  nextExecutionSequence: number; retiredExecutionThrough: number; executionGeneration: string;
  orders: { sourceKey: string; activationSequence: number; sequence: number }[];
  managed: AllyManagedEffect[]; diagnostic: string | null;
};
export interface AllyStore {
  load(create?: boolean): Promise<AllyLedger | null>;
  save(ledger: AllyLedger): Promise<void>;
}
export interface AllySupportEnvironment {
  currentUserId(): string | null;
  users(): AllyUser[];
  ownsAlly(allyId: string, userId: string): boolean;
  allyExists(allyId: string): boolean;
  agentExists(actorId: string): boolean;
  abilities(allyId: string): { id: string; definition: AllyAbilityDefinition }[] | null;
  prepareSources?(): Promise<void>;
  describeEffect(effect: AllyManagedEffect): AllyNoticeSnapshot["benefits"][number];
  resolveCombat(allyId: string, beneficiaryId: string, chosenId?: string, previousId?: string): AllyCombatSnapshot | null;
  combat(id: string): AllyCombatSnapshot | null;
  publish(ledger: AllyLedger): Promise<void>;
  notify(change: AllySupportChange): Promise<void>;
}
export function createAllyLedger(): AllyLedger {
  return { version: 4, revision: 0, nextSequence: 1, links: [], managed: [], orders: [], diagnostic: null,
    ledgerInstanceId: crypto.randomUUID(), managedGrants: [], receipts: [], nextExecutionSequence: 1,
    retiredExecutionThrough: 0, executionGeneration: "" };
}

export class AllySupportService {
  private persistedSnapshot: string | null = null;
  constructor(
    private readonly store: AllyStore, private readonly environment: AllySupportEnvironment,
    private readonly reconciliation: AllyReconciliationService,
    private readonly grants?: AllyGrantedAbilityService,
    private readonly queue = new AllyOperationQueue(),
  ) {}
  isExecutor(): boolean {
    return this.environment.currentUserId() === electAllyExecutor(this.environment.users())
      && this.environment.currentUserId() !== null;
  }
  private enqueue(work: () => Promise<void>): Promise<void> {
    return this.queue.run(async () => { if (this.isExecutor()) await work(); });
  }
  runAuthorized<T>(work: (ledger: AllyLedger, persist: () => Promise<void>) => Promise<T>): Promise<T> {
    return this.queue.run(async () => {
      if (!this.isExecutor()) throw new Error("Nenhum GM executor disponível.");
      const ledger = await this.store.load();
      if (!ledger) throw new Error("Registro operacional indisponível.");
      this.persistedSnapshot = JSON.stringify({ ...ledger, revision: 0 });
      let generation = ledger.executionGeneration;
      // Receipts use their own sequence. They must not invalidate the support revision shown to owners.
      return work(ledger, async () => {
        await this.assertExecutionGeneration(generation);
        await this.persist(ledger, false, false);
        generation = ledger.executionGeneration;
      });
    });
  }
  async assertExecutionGeneration(generation: string): Promise<void> {
    if (!this.isExecutor()) throw new Error("O GM executor mudou.");
    const current = await this.store.load();
    if (!this.isExecutor() || !current || current.executionGeneration !== generation) throw new Error("A geração operacional mudou; a execução anterior foi interrompida.");
  }
  suppressGrant(actorId: string, itemId: string, userId: string): Promise<void> {
    return this.enqueue(async () => {
      const ledger = await this.store.load(); if (!ledger) return;
      this.persistedSnapshot = JSON.stringify({ ...ledger, revision: 0 });
      const grant = ledger.managedGrants.find(entry => entry.actorId === actorId && entry.itemId === itemId);
      const user = this.environment.users().find(entry => entry.id === userId);
      const link = grant && ledger.links.find(entry => entry.allyId === grant.allyId);
      if (grant && link && user?.isGM && user.active) {
        const key = allyGrantKey(grant.allyId, grant.sourceItemId);
        if (!(link.suppressedGrants ??= []).includes(key)) link.suppressedGrants.push(key);
        await this.persist(ledger);
      }
      await this.reconcileLedger(ledger);
    });
  }
  process(allyId: string, request: AllyRequest, userId: string): Promise<void> {
    return this.enqueue(async () => {
      const parsed = readAllyRequest(request);
      if (!parsed) throw new Error("Solicitação de suporte inválida.");
      request = parsed;
      const user = this.environment.users().find(entry => entry.id === userId);
      authorizeAllyRequest(request, user, this.environment.ownsAlly(allyId, userId));
      if (!this.environment.allyExists(allyId)) throw new Error("Aliado ausente ou inválido.");
      await this.environment.prepareSources?.();
      const ledger = await this.store.load(true);
      if (!ledger) throw new Error("Registro operacional indisponível.");
      this.persistedSnapshot = JSON.stringify({ ...ledger, revision: 0 });
      if (request.revision !== ledger.revision) throw new Error("O suporte mudou. Atualize a ficha e solicite novamente.");
      let link = ledger.links.find(entry => entry.allyId === allyId);
      if (!link) {
        link = { allyId, state: createAllySupportState(), pilotId: null, suppressedSources: [], suppressedGrants: [], diagnostic: null,
          notice: { beneficiaryId: null, status: "inactive", benefits: [] } };
        ledger.links.push(link);
      }
      if (request.action === "setPilot") {
        if (request.pilotId !== null && !this.environment.agentExists(request.pilotId!)) throw new Error("Selecione um piloto Agente persistente do mundo.");
        if ((link.pilotId ?? null) === request.pilotId) { await this.reconcileLedger(ledger); return; }
        link.pilotId = request.pilotId;
      } else if (request.action !== "reconcile") {
        if (request.action === "activate" && !link.state.beneficiaryId) {
          throw new Error("Atribua um beneficiário antes de ativar.");
        }
        if (request.action === "activate" && !this.environment.agentExists(link.state.beneficiaryId!)) {
          throw new Error("Selecione um Agente persistente do mundo.");
        }
        if (request.action !== "deactivate" && !(request.action === "setBeneficiary" && request.beneficiaryId === null)
          && !this.environment.abilities(allyId)) {
          throw new Error("Configuração de habilidade inválida. Os dados foram preservados.");
        }
        this.apply(ledger, link, request);
      }
      await this.persist(ledger, true);
      await this.reconcileLedger(ledger);
    });
  }
  reconcile(): Promise<void> {
    return this.enqueue(() => this.reconcileLoaded());
  }
  suppressEffect(actorId: string, effectId: string, userId: string): Promise<void> {
    return this.enqueue(async () => {
      const user = this.environment.users().find(entry => entry.id === userId);
      if (!user?.isGM || !user.active) { await this.reconcileLoaded(); return; }
      const ledger = await this.store.load();
      if (!ledger) return;
      this.persistedSnapshot = JSON.stringify({ ...ledger, revision: 0 });
      const tracked = ledger.managed.find(effect => effect.actorId === actorId && effect.effectId === effectId);
      const link = tracked && ledger.links.find(entry => entry.allyId === tracked.allyId);
      if (!link || !tracked) return;
      if (!link.suppressedSources.includes(tracked.sourceKey)) link.suppressedSources.push(tracked.sourceKey);
      await this.persist(ledger);
      await this.reconcileLedger(ledger);
    });
  }
  private async reconcileLoaded(): Promise<void> {
    await this.environment.prepareSources?.();
    const ledger = await this.store.load();
    if (!ledger) return;
    this.persistedSnapshot = JSON.stringify({ ...ledger, revision: 0 });
    await this.reconcileLedger(ledger);
  }
  private apply(ledger: AllyLedger, link: AllyLink, request: AllyRequest): void {
    let action;
    if (request.action === "setBeneficiary") {
      const beneficiaryId = request.beneficiaryId ?? null;
      if (beneficiaryId !== null && !this.environment.agentExists(beneficiaryId)) throw new Error("Selecione um Agente persistente do mundo.");
      const previousId = link.state.beneficiaryId;
      const combat = !previousId || link.state.wait || link.state.status === "inactive" || previousId === beneficiaryId ? null
        : this.environment.resolveCombat(link.allyId, beneficiaryId ?? previousId, request.combatId, previousId);
      action = { type: "setBeneficiary" as const, beneficiaryId, combat };
    } else if (request.action === "assign") {
      if (!this.environment.agentExists(request.beneficiaryId!)) throw new Error("Selecione um Agente persistente do mundo.");
      const combat = !link.state.beneficiaryId || link.state.beneficiaryId === request.beneficiaryId ? null
        : this.environment.resolveCombat(link.allyId, request.beneficiaryId!, request.combatId, link.state.beneficiaryId ?? undefined);
      action = { type: "assign" as const, beneficiaryId: request.beneficiaryId!, combat };
    } else if (request.action === "activate" || request.action === "deactivate") action = { type: request.action };
    else return;
    const previous = link.state;
    link.state = transitionAllySupport(previous, action, ledger.nextSequence);
    if (link.state.sequence !== previous.sequence) {
      ledger.nextSequence++;
      link.suppressedSources = [];
      link.suppressedGrants = [];
    }
  }
  private async persist(ledger: AllyLedger, force = false, advanceSupportRevision = true): Promise<void> {
    const snapshot = JSON.stringify({ ...ledger, revision: 0 });
    if (!force && snapshot === this.persistedSnapshot) return;
    if (!this.isExecutor()) throw new Error("O GM executor mudou. Reconcilie antes de continuar.");
    if (advanceSupportRevision) ledger.revision++;
    await this.store.save(ledger);
    this.persistedSnapshot = snapshot;
  }
  private async reconcileLedger(ledger: AllyLedger): Promise<void> {
    const sources = [];
    for (const link of ledger.links) {
      if (!this.environment.allyExists(link.allyId)) {
        link.state = { ...link.state, status: "inactive" };
        link.diagnostic = "Aliado ausente ou perfil inválido.";
        continue;
      }
      if (link.state.wait) {
        link.state = transitionAllySupport(link.state, {
          type: "combat", combat: this.environment.combat(link.state.wait.combatId),
        }, ledger.nextSequence);
      }
      const abilities = this.environment.abilities(link.allyId);
      if (!abilities && link.state.status !== "inactive") {
        ledger.diagnostic = "Habilidade com efeitos inválidos ou migração pendente. Projeções existentes preservadas; revise a origem ou desative o suporte.";
        await this.persist(ledger); await this.environment.publish(ledger); return;
      }
      const valid = abilities && link.state.beneficiaryId && this.environment.agentExists(link.state.beneficiaryId);
      if (!valid) {
        link.diagnostic = !abilities ? "Configuração de habilidade inválida." : link.state.beneficiaryId ? "Beneficiário ausente ou inválido." : null;
        continue;
      }
      link.diagnostic = null;
      sources.push({ allyId: link.allyId, state: link.state, abilities: abilities! });
    }
    for (const source of [...sources].sort((a, b) => a.state.sequence - b.state.sequence)) {
      if (source.state.status !== "active") continue;
      for (const item of source.abilities) for (const benefit of item.definition.benefits) {
        const sourceKey = JSON.stringify([source.allyId, item.id, benefit.id]);
        if (!ledger.orders.some(entry => entry.sourceKey === sourceKey && entry.activationSequence === source.state.sequence)) {
          ledger.orders.push({ sourceKey, activationSequence: source.state.sequence, sequence: ledger.nextSequence++ });
        }
      }
    }
    const orderedSources = sources.map(source => {
      const suppressed = new Set(ledger.links.find(link => link.allyId === source.allyId)?.suppressedSources);
      return { ...source,
        abilities: source.abilities.map(item => ({ ...item, definition: { ...item.definition,
          benefits: item.definition.benefits.filter(benefit => !suppressed.has(JSON.stringify([source.allyId, item.id, benefit.id]))) } })),
        sequenceBySource: Object.fromEntries(ledger.orders.filter(entry => entry.activationSequence === source.state.sequence)
          .map(entry => [entry.sourceKey, entry.sequence])),
      };
    });
    ledger.orders = ledger.orders.filter(entry => ledger.links.some(link => link.state.sequence === entry.activationSequence));
    ledger.diagnostic = null;
    try {
      await this.reconciliation.reconcile(resolveAllyBenefits(orderedSources), ledger.managed,
        async managed => { ledger.managed = managed; await this.persist(ledger); });
      const recipientDiagnostics = await this.grants?.reconcile(ledger, () => this.persist(ledger));
      if (this.grants) for (const link of ledger.links) {
        const diagnostics = ledger.managedGrants.filter(grant => grant.allyId === link.allyId && grant.diagnostic).map(grant => grant.diagnostic);
        if (recipientDiagnostics?.[link.allyId]) diagnostics.unshift(recipientDiagnostics[link.allyId]);
        if (diagnostics.length) link.diagnostic = diagnostics.join(" ");
      }
    } catch (error) {
      ledger.diagnostic = `Reconciliação interrompida: ${error instanceof Error ? error.message : "falha desconhecida"}`;
    }
    const changes: AllySupportChange[] = [];
    if (!ledger.diagnostic) for (const link of ledger.links) {
      const next: AllyNoticeSnapshot = { beneficiaryId: link.state.beneficiaryId, status: link.state.status,
        benefits: ledger.managed.filter(effect => effect.allyId === link.allyId)
          .map(effect => this.environment.describeEffect(effect))
          .sort((a, b) => a.sourceKey < b.sourceKey ? -1 : a.sourceKey > b.sourceKey ? 1 : 0) };
      const change = buildAllySupportChange(link.allyId, link.notice, next);
      if (change) changes.push(change);
      link.notice = next;
    }
    // Commit notification baselines before best-effort publication; never replay on reload.
    await this.persist(ledger);
    for (const change of changes) {
      try { await this.environment.notify(change); }
      catch (error) { console.warn("Paranormal Toolkit | Allies: falha ao informar mudança no chat.", error); }
    }
    await this.environment.publish(ledger);
  }
}
