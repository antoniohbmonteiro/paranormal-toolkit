import { allyScopeFingerprint, type AllyAbilityDefinition } from "../../core/allies/ally-definition";
import { resolveAllyBenefits } from "../../core/allies/ally-benefit-resolver";
import { createAllySupportState, transitionAllySupport, type AllySupportState, type AllyCombatSnapshot } from "../../core/allies/ally-support-state";
import { authorizeAllyRequest, electAllyExecutor, type AllyRequest, type AllyUser } from "./ally-operation-authority";
import { AllyReconciliationService, type AllyManagedEffect } from "./ally-reconciliation-service";

export type AllyLink = {
  allyId: string; state: AllySupportState;
  approval: { beneficiaryId: string; scope: string } | null;
  pending: { request: AllyRequest; userId: string } | null;
  diagnostic: string | null;
};
export type AllyLedger = {
  version: 1; revision: number; nextSequence: number; links: AllyLink[];
  orders: { sourceKey: string; activationSequence: number; sequence: number }[];
  managed: AllyManagedEffect[]; validatedRuntime: string | null; diagnostic: string | null;
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
  resolveCombat(allyId: string, beneficiaryId: string, chosenId?: string, previousId?: string): AllyCombatSnapshot | null;
  combat(id: string): AllyCombatSnapshot | null;
  runtimeIdentity(): string;
  publish(ledger: AllyLedger): Promise<void>;
}
export function createAllyLedger(): AllyLedger {
  return { version: 1, revision: 0, nextSequence: 1, links: [], managed: [], orders: [],
    validatedRuntime: null, diagnostic: null };
}

export class AllySupportService {
  private queue: Promise<void> = Promise.resolve();
  private persistedSnapshot: string | null = null;
  constructor(
    private readonly store: AllyStore, private readonly environment: AllySupportEnvironment,
    private readonly reconciliation: AllyReconciliationService,
  ) {}
  isExecutor(): boolean {
    return this.environment.currentUserId() === electAllyExecutor(this.environment.users())
      && this.environment.currentUserId() !== null;
  }
  private enqueue(work: () => Promise<void>): Promise<void> {
    const next = this.queue.then(async () => { if (this.isExecutor()) await work(); });
    this.queue = next.catch(() => {});
    return next;
  }
  process(allyId: string, request: AllyRequest, userId: string): Promise<void> {
    return this.enqueue(async () => {
      const user = this.environment.users().find(entry => entry.id === userId);
      authorizeAllyRequest(request, user, this.environment.ownsAlly(allyId, userId));
      if (!this.environment.allyExists(allyId)) throw new Error("Aliado ausente ou inválido.");
      const ledger = await this.store.load(true);
      if (!ledger) throw new Error("Registro operacional indisponível.");
      this.persistedSnapshot = JSON.stringify({ ...ledger, revision: 0 });
      if (request.revision !== ledger.revision) throw new Error("O suporte mudou. Atualize a ficha e solicite novamente.");
      let link = ledger.links.find(entry => entry.allyId === allyId);
      if (!link) {
        link = { allyId, state: createAllySupportState(), approval: null, pending: null, diagnostic: null };
        ledger.links.push(link);
      }
      if (user!.isGM && ["assign", "activate", "approve"].includes(request.action)
        && request.scope !== this.scope(allyId)) {
        throw new Error("Os benefícios mudaram desde a revisão do GM. Revise antes de aprovar.");
      }
      if (request.action === "validate") ledger.validatedRuntime = this.environment.runtimeIdentity();
      else if (request.action === "approve") {
        const pending = link.pending;
        const beneficiary = pending?.request.beneficiaryId ?? link.state.beneficiaryId;
        if (!beneficiary || request.beneficiaryId !== beneficiary) {
          throw new Error("O beneficiário mudou desde a revisão do GM.");
        }
        if (pending) {
          const owner = this.environment.users().find(entry => entry.id === pending.userId);
          authorizeAllyRequest(pending.request, owner, this.environment.ownsAlly(allyId, pending.userId));
          this.apply(ledger, link, pending.request, true);
        } else if (link.state.beneficiaryId) {
          this.approve(link, link.state.beneficiaryId);
        }
        link.pending = null;
      } else if (request.action !== "reconcile") {
        const beneficiaryId = request.action === "assign" ? request.beneficiaryId! : link.state.beneficiaryId;
        if (request.action === "activate" && !link.state.beneficiaryId) {
          throw new Error("Atribua e aprove um beneficiário antes de ativar.");
        }
        const scope = request.action === "deactivate" ? "" : this.scope(allyId);
        const authorized = request.action === "deactivate" || (beneficiaryId
          && link.approval?.beneficiaryId === beneficiaryId && link.approval.scope === scope);
        if (!user!.isGM && !authorized) {
          if (beneficiaryId && !this.environment.agentExists(beneficiaryId)) throw new Error("Selecione um Agente persistente do mundo.");
          link.pending = { request, userId };
          link.diagnostic = "Aguardando aprovação do vínculo e benefícios pelo GM.";
        } else {
          this.apply(ledger, link, request, user!.isGM);
          link.pending = null;
        }
      }
      await this.persist(ledger, true);
      await this.reconcileLedger(ledger);
    });
  }
  reconcile(): Promise<void> {
    return this.enqueue(async () => {
      const ledger = await this.store.load();
      if (ledger) {
        this.persistedSnapshot = JSON.stringify({ ...ledger, revision: 0 });
        await this.reconcileLedger(ledger);
      }
    });
  }
  private scope(allyId: string): string {
    const abilities = this.environment.abilities(allyId);
    if (!abilities) throw new Error("Configuração de habilidade inválida. Os dados foram preservados.");
    return allyScopeFingerprint(abilities);
  }
  private approve(link: AllyLink, beneficiaryId: string): void {
    if (!this.environment.agentExists(beneficiaryId)) throw new Error("Beneficiário ausente ou inválido.");
    link.approval = { beneficiaryId, scope: this.scope(link.allyId) };
    link.diagnostic = null;
  }
  private apply(ledger: AllyLedger, link: AllyLink, request: AllyRequest, approve: boolean): void {
    let action;
    if (request.action === "assign") {
      if (!this.environment.agentExists(request.beneficiaryId!)) throw new Error("Selecione um Agente persistente do mundo.");
      const combat = !link.state.beneficiaryId || link.state.beneficiaryId === request.beneficiaryId ? null
        : this.environment.resolveCombat(link.allyId, request.beneficiaryId!, request.combatId, link.state.beneficiaryId ?? undefined);
      action = { type: "assign" as const, beneficiaryId: request.beneficiaryId!, combat };
    } else if (request.action === "activate" || request.action === "deactivate") action = { type: request.action };
    else return;
    if (approve && request.action !== "deactivate") {
      const beneficiary = request.beneficiaryId ?? link.state.beneficiaryId;
      if (!beneficiary) throw new Error("Atribua um beneficiário antes de ativar.");
      this.approve(link, beneficiary);
    }
    const previous = link.state;
    link.state = transitionAllySupport(previous, action, ledger.nextSequence);
    if (link.state.sequence !== previous.sequence) ledger.nextSequence++;
  }
  private async persist(ledger: AllyLedger, force = false): Promise<void> {
    const snapshot = JSON.stringify({ ...ledger, revision: 0 });
    if (!force && snapshot === this.persistedSnapshot) return;
    if (!this.isExecutor()) throw new Error("O GM executor mudou. Reconcilie antes de continuar.");
    ledger.revision++;
    await this.store.save(ledger);
    this.persistedSnapshot = snapshot;
  }
  private async reconcileLedger(ledger: AllyLedger): Promise<void> {
    const sources = [];
    for (const link of ledger.links) {
      if (!this.environment.allyExists(link.allyId)) {
        link.state = { ...link.state, status: "inactive" };
        link.approval = null;
        link.pending = null;
        link.diagnostic = "Aliado ausente ou perfil inválido. Novo vínculo exige aprovação.";
        continue;
      }
      if (link.state.wait) {
        link.state = transitionAllySupport(link.state, {
          type: "combat", combat: this.environment.combat(link.state.wait.combatId),
        }, ledger.nextSequence);
      }
      const abilities = this.environment.abilities(link.allyId);
      const valid = abilities && link.state.beneficiaryId && this.environment.agentExists(link.state.beneficiaryId)
        && link.approval?.beneficiaryId === link.state.beneficiaryId
        && link.approval.scope === allyScopeFingerprint(abilities);
      if (!valid) {
        link.diagnostic = link.pending ? "Aguardando aprovação do GM." : "Vínculo ou benefícios precisam de aprovação do GM.";
        continue;
      }
      if (!link.pending) link.diagnostic = null;
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
    const orderedSources = sources.map(source => ({ ...source, sequenceBySource: Object.fromEntries(
      ledger.orders.filter(entry => entry.activationSequence === source.state.sequence).map(entry => [entry.sourceKey, entry.sequence]),
    ) }));
    ledger.orders = ledger.orders.filter(entry => ledger.links.some(link => link.state.sequence === entry.activationSequence));
    const validated = ledger.validatedRuntime === this.environment.runtimeIdentity();
    ledger.diagnostic = validated ? null : "GM: valide Defesa/esquiva e permissões multiplayer neste ambiente antes de aplicar efeitos.";
    try {
      // Removal also runs with an invalidated gate, so old projections cannot remain active.
      await this.reconciliation.reconcile(validated ? resolveAllyBenefits(orderedSources) : [], ledger.managed,
        async managed => { ledger.managed = managed; await this.persist(ledger); });
    } catch (error) {
      ledger.diagnostic = `Reconciliação interrompida: ${error instanceof Error ? error.message : "falha desconhecida"}`;
    }
    await this.persist(ledger);
    await this.environment.publish(ledger);
  }
}
