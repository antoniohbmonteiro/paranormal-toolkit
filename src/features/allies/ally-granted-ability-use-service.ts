import { MODULE_ID } from "../../constants";
import type { AllyGrant } from "../../core/allies/ally-grant";
import { allyGrantKey } from "../../core/allies/ally-grant";
import { stableEffectFingerprint } from "../../core/allies/ally-passive-effect";
import { createWorkflowExecutionControl } from "../../core/workflow/workflow-execution-control";
import type { WorkflowEngine } from "../../core/workflow/workflow-engine";
import { resolveWorkflowTargetActor, type WorkflowTargetReference } from "../../core/workflow/workflow-target-reference";
import type { ItemUseContext } from "../item-use/item-use-context";
import { getItemUseSettings, getItemUseSystemCardMode } from "../item-use/item-use-settings";
import { registerPendingItemUseAutomationPrompt } from "../item-use/item-use-automation-prompt";
import { resolveGrantedItemEngine } from "../item-use/item-use-route";
import { resolveAbilityUseData } from "../abilities/ability-item-resolver";
import type { AbilityUseWorkflow } from "../abilities/ability-use-workflow";
import type { AbilityUseOptions } from "../abilities/ability-use-options";
import type { AbilityUseDialogModelInput } from "../abilities/ability-use-dialog-model";
import { AbilityAssistedActionService } from "../abilities/ability-assisted-action-service";
import { readAutomationFlagValue } from "../automation/automation-flag-reader";
import type { ResourceAdapter } from "../../core/resources/actor-resource";
import { getActorItems } from "../automation/actor-item-resolver";
import { FoundryAllyItemAdapter, grantItem, grantSourceData } from "../../adapters/foundry/foundry-ally-item-adapter";
import { allyMessage, AllyMessageAdmissionError, diagnoseAllyMessageAdmission, FoundryAllyReceiptAdapter, readProtectedAllyReceipt } from "../../adapters/foundry/foundry-ally-receipt-adapter";
import { ALLY_RECEIPT_FLAG, MAX_ALLY_RECEIPTS, recoverAllyReceipts, retireAllyReceipt, type AllyExecutionReceipt } from "./ally-execution-receipts";
import type { AllyLedger, AllySupportService } from "./ally-support-service";

export type AllyUseRequest = {
  id: string; action: "prepare" | "execute" | "cancel" | "apply";
  itemId?: string; messageId: string; sequence?: number; targets?: WorkflowTargetReference[];
  options?: AbilityUseOptions; actionId?: string;
};
// Foundry v14 serverTime is activity uptime; receipts and persisted deadlines use Unix milliseconds.
export function allyUnixTime(): number { return Date.now(); }
export class AllyGrantedAbilityUseService {
  private generation = crypto.randomUUID();
  private wasExecutor = false;
  constructor(private readonly support: AllySupportService, private readonly items: FoundryAllyItemAdapter,
    private readonly receipts: FoundryAllyReceiptAdapter, private readonly generic: AbilityUseWorkflow,
    private readonly resources: ResourceAdapter, private readonly automation: WorkflowEngine,
    private readonly assisted: AbilityAssistedActionService) {}
  observeExecutor(): void {
    const current = this.support.isExecutor() && Boolean(game.user?.isGM);
    if (current !== this.wasExecutor) { this.generation = crypto.randomUUID(); this.wasExecutor = current; }
  }
  assertExecutor(): void {
    this.observeExecutor();
    if (!this.wasExecutor) throw new Error("O GM executor mudou.");
  }
  private executionGuard(generation = this.generation): () => Promise<void> {
    return async () => {
      this.assertExecutor();
      if (generation !== this.generation) throw new Error("A execução pertence a uma geração operacional encerrada.");
      await this.support.assertExecutionGeneration(generation);
      this.assertExecutor();
      if (generation !== this.generation) throw new Error("A geração operacional mudou.");
    };
  }
  private async recover(ledger: AllyLedger, persist: () => Promise<void>): Promise<void> {
    this.assertExecutor();
    const changedExecutor = ledger.executionGeneration !== this.generation;
    if (recoverAllyReceipts(ledger, this.generation, allyUnixTime())) await persist();
    if (changedExecutor) for (const candidate of game.messages.contents ?? []) {
      const message = candidate as unknown as import("../../adapters/foundry/foundry-ally-receipt-adapter").AllyReceiptMessage;
      const receipt = readProtectedAllyReceipt(message, ledger.ledgerInstanceId);
      if (!receipt?.card?.actions.some(action => action.state === "executing")) continue;
      for (const action of receipt.card.actions) if (action.state === "executing") action.state = "uncertain";
      await this.executionGuard()();
      await message.update({ [`flags.${MODULE_ID}.${ALLY_RECEIPT_FLAG}`]: receipt,
        [`flags.${MODULE_ID}.abilityUse`]: { version: 3, revision: 0, state: receipt.card } });
    }
    for (const receipt of [...ledger.receipts]) {
      if (!["resolved", "completed", "cancelled", "failed", "uncertain"].includes(receipt.status)) continue;
      try { await this.finish(ledger, receipt, persist); }
      catch (error) { console.warn("Paranormal Toolkit | Allies: recibo preservado para recuperação de publicação.", error); }
    }
  }
  async recoverPending(): Promise<void> {
    try { await this.support.runAuthorized((ledger, persist) => this.recover(ledger, persist)); }
    catch (error) {
      if (!(error instanceof Error) || error.message !== "Registro operacional indisponível.") throw error;
    }
  }
  private source(ledger: AllyLedger, grant: AllyGrant) {
    const actor = game.actors.get?.(grant.actorId);
    const ally = game.actors.get?.(grant.allyId);
    const item = ally && getActorItems(ally).find(entry => entry.id === grant.sourceItemId && entry.type === "ability");
    const link = ledger.links.find(entry => entry.allyId === grant.allyId);
    if (!actor || actor.isToken || actor.type !== "agent" || !item || !link || link.state.status !== "active"
      || this.items.recipient(link).actorId !== grant.actorId || link.state.sequence !== grant.activationSequence
      || link.suppressedGrants?.includes(allyGrantKey(grant.allyId, grant.sourceItemId))) throw new Error("Concessão sem suporte ativo válido.");
    const source = grantSourceData(item);
    if (source.diagnostic) throw new Error(source.diagnostic);
    if (grant.fingerprint !== source.fingerprint) throw new Error("A habilidade mudou. Reconcilie o suporte e tente novamente.");
    return { actor, item, ...source };
  }
  private prepareGeneric(actor: Actor, item: Item): { dialog: AbilityUseDialogModelInput; fingerprint: string } {
    const ability = resolveAbilityUseData(actor, item);
    const resource = ability.cost > 0 ? this.resources.getResource(actor, ability.resource) : null;
    if (resource && !resource.ok) throw new Error(resource.error.message);
    const dialog = { abilityName: ability.name, abilityImage: ability.image, actorName: actor.name,
      activationLabel: ability.activationLabel, resource: ability.resource, cost: ability.cost,
      passive: ability.passive, rollChoices: ability.rollPreparation.choices,
      currentResource: resource?.ok ? resource.value.value : 0 };
    return { dialog, fingerprint: stableEffectFingerprint({ resource: ability.resource, cost: ability.cost, rolls: ability.rollPreparation }) };
  }
  async handle(actorId: string, request: AllyUseRequest, userId: string): Promise<unknown> {
    return this.support.runAuthorized(async (ledger, persist) => {
      await this.recover(ledger, persist);
      this.assertExecutor();
      const user = game.users.find(entry => entry.id === userId);
      const actor = game.actors.get?.(actorId);
      if (!user?.active || !actor || actor.isToken || actor.type !== "agent" || !actor.canUserModify(user, "update")) throw new Error("Solicitante sem permissão para usar esta concessão.");
      if (request.action === "apply") {
        if (!user.isGM) throw new Error("Ações assistidas exigem um GM.");
        return this.applyAction(ledger, request, actorId, userId);
      }
      const prior = ledger.receipts.find(entry => entry.messageId === request.messageId);
      const archived = this.receipts.archived(request.messageId, ledger.ledgerInstanceId);
      if (archived) {
        if (archived.actorId !== actorId || (archived.requesterId !== userId && !user.isGM)) throw new Error("Recibo de outro solicitante.");
        return { status: archived.status, diagnostic: archived.diagnostic };
      }
      let receipt = prior;
      if (request.action === "prepare") {
        if (prior) {
          if (prior.actorId !== actorId || prior.requesterId !== userId) throw new Error("Preparação de outro solicitante.");
          return this.reply(prior);
        }
        if (getItemUseSettings().executionMode === "disabled") throw new Error("Execução de habilidades desativada nas configurações do Toolkit.");
        const message = allyMessage(request.messageId); const now = allyUnixTime();
        const admission = diagnoseAllyMessageAdmission(message, userId);
        if (admission.failures.length) throw new AllyMessageAdmissionError(admission);
        if (!message) throw new Error("Mensagem original não encontrada.");
        if (ledger.receipts.length >= MAX_ALLY_RECEIPTS) throw new Error("Há 256 recibos aguardando recuperação. O GM deve conferir os casos pendentes.");
        if (ledger.nextExecutionSequence >= Number.MAX_SAFE_INTEGER) throw new Error("Contador de execuções esgotado; dados preservados.");
        const grant = ledger.managedGrants.find(entry => entry.actorId === actorId && entry.itemId === request.itemId);
        if (!grant) throw new Error("Concessão não registrada.");
        const source = this.source(ledger, grant);
        if (!this.items.exists(grant)) throw new Error("Concessão ausente.");
        if (!this.items.matches(grant, source.data, ledger.ledgerInstanceId)) await this.items.update(grant, source.data, ledger);
        const projected = grantItem(grant)!;
        this.items.assertExecutionIntegrity(grant);
        const engine = resolveGrantedItemEngine(source.item);
        const prepared = engine === "generic" ? this.prepareGeneric(source.actor, projected) : null;
        receipt = { version: 1, ledgerInstanceId: ledger.ledgerInstanceId, sequence: ledger.nextExecutionSequence++,
          generation: this.generation, requesterId: userId, grantId: grant.grantId, actorId, allyId: grant.allyId,
          sourceItemId: grant.sourceItemId, activationSequence: grant.activationSequence, fingerprint: source.fingerprint,
          messageId: message.id, resultMessageId: getItemUseSystemCardMode() === "replace" ? message.id : foundry.utils.randomID(),
          preparedAt: now, status: "prepared", engine, targets: request.targets ?? [], dialog: prepared?.dialog ?? null,
          executionFingerprint: prepared?.fingerprint ?? source.fingerprint, sourceName: source.item.name, actorName: source.actor.name,
          checkpoint: null, card: null, summary: [], operations: [], diagnostic: null };
        ledger.receipts.push(receipt); await persist();
        await this.receipts.claim(receipt, this.executionGuard());
        if (engine === "automation" && getItemUseSettings().executionMode === "ask") {
          await this.executionGuard()();
          await registerPendingItemUseAutomationPrompt({ pendingId: `ally/${actorId}/${receipt.sequence}`, mode: "ask",
            context: await this.context(receipt), buttonLabel: "Aplicar automação", executedLabel: "✓ Automação aplicada" });
        }
        return this.reply(receipt);
      }
      if (!receipt || request.sequence !== receipt.sequence || receipt.actorId !== actorId
        || (receipt.requesterId !== userId && !user.isGM)) throw new Error("Identidade de execução ausente, aposentada ou de outro solicitante.");
      if (receipt.status !== "prepared") return this.reply(receipt);
      if (request.action === "cancel") { receipt.status = "cancelled"; await persist(); await this.finish(ledger, receipt, persist); return { status: "cancelled" }; }
      if (receipt.engine === "automation" && getItemUseSettings().executionMode === "ask" && !user.isGM) throw new Error("Aplicar automação no modo de confirmação exige um GM.");
      return this.execute(ledger, receipt, request.options, persist);
    });
  }
  private reply(receipt: AllyExecutionReceipt) {
    return { status: receipt.status, sequence: receipt.sequence, engine: receipt.engine,
      dialog: receipt.dialog, diagnostic: receipt.diagnostic, mode: getItemUseSettings().executionMode };
  }
  private async context(receipt: AllyExecutionReceipt, requireTargets = false): Promise<ItemUseContext> {
    const actor = game.actors.get?.(receipt.actorId) ?? null;
    const ally = game.actors.get?.(receipt.allyId);
    const item = (ally && getActorItems(ally).find(entry => entry.id === receipt.sourceItemId))
      ?? ({ id: receipt.sourceItemId, name: receipt.sourceName, type: "ability" } as Item);
    const targets = [];
    for (const reference of receipt.targets) {
      const targetActor = await resolveWorkflowTargetActor(reference);
      if ((!targetActor || targetActor.documentName !== "Actor") && requireTargets) throw new Error(`Alvo original não encontrado: ${reference.name}`);
      targets.push({ actor: targetActor, actorId: reference.actorId, tokenId: reference.tokenId, sceneId: reference.sceneId, name: reference.name });
    }
    return { source: "ordem-item-used-hook", actor, item, token: null, targets, message: allyMessage(receipt.messageId) };
  }
  private async execute(ledger: AllyLedger, receipt: AllyExecutionReceipt, options: AbilityUseOptions | undefined, persist: () => Promise<void>) {
    try {
      const grant = ledger.managedGrants.find(entry => entry.grantId === receipt.grantId);
      if (!grant) throw new Error("Concessão removida.");
      const source = this.source(ledger, grant);
      if (source.fingerprint !== receipt.fingerprint || grant.activationSequence !== receipt.activationSequence) throw new Error("Origem ou suporte alterado após a preparação.");
      const projected = grantItem(grant);
      if (!projected || !this.items.matches(grant, source.data, ledger.ledgerInstanceId)) throw new Error("Cópia modificada após a preparação. Solicite novo uso.");
      this.items.assertExecutionIntegrity(grant);
      if (getItemUseSettings().executionMode === "disabled" || resolveGrantedItemEngine(source.item) !== receipt.engine) throw new Error("Configuração de execução alterada.");
      const context = { ...await this.context(receipt, true), item: projected };
      const prepared = receipt.engine === "generic" ? this.prepareGeneric(source.actor, projected) : null;
      if (prepared && receipt.executionFingerprint !== prepared.fingerprint) throw new Error("Custo, moeda ou progressão alterada. Abra novamente a habilidade.");
      if (receipt.engine === "generic" && (!options || typeof options.spendResource !== "boolean"
        || !options.selectedNexThresholds || typeof options.selectedNexThresholds !== "object")) throw new Error("Confirmação de habilidade inválida.");
      receipt.status = "running"; await persist();
      const assertGeneration = () => {
        this.assertExecutor();
        if (receipt.generation !== this.generation) throw new Error("A geração operacional mudou.");
      };
      const control = createWorkflowExecutionControl(assertGeneration, async checkpoint => {
        this.source(ledger, grant);
        const requester = game.users.find(user => user.id === receipt.requesterId);
        if (!requester?.active || !source.actor.canUserModify(requester, "update")) throw new Error("Permissão do solicitante mudou durante a execução.");
        receipt.checkpoint = checkpoint; await persist();
      }, async (checkpoint, result) => { receipt.operations.push({ checkpoint, result: JSON.parse(JSON.stringify(result)) }); receipt.checkpoint = null; await persist(); });
      if (receipt.engine === "generic") {
        const ability = resolveAbilityUseData(source.actor, projected);
        const result = await this.generic.executePrepared(ability, options!, context, prepared!.dialog.currentResource, control,
          async card => { receipt.card = card; receipt.status = "resolved"; await persist(); });
        if (result.status !== "completed") { receipt.status = "failed"; receipt.diagnostic = result.status === "failed" ? result.message : "Uso cancelado."; await persist(); }
      } else {
        const automation = readAutomationFlagValue(source.item);
        if (!automation.ok) throw new Error(automation.error.message);
        const rollData = (source.actor as Actor & { getRollData?(): Record<string, unknown> }).getRollData?.() ?? {};
        const result = await this.automation.runAutomation(structuredClone(automation.value.definition), {
          sourceActor: source.actor, sourceToken: context.token, item: projected, targets: context.targets, rollData, executionControl: control,
        });
        if (!result.ok) throw new Error(result.error.message);
        receipt.summary = [receipt.sourceName, ...automation.value.definition.steps.flatMap(step => step.type === "chatCard" ? [step.title ?? "", step.message ?? ""].filter(Boolean) : []),
          ...Object.values(result.value.context.rolls).map(roll => `${roll.id}: ${roll.formula} = ${roll.total}`),
          ...result.value.context.resourceTransactions.map(tx => `${tx.operation}: ${tx.appliedAmount} ${tx.resource} (${tx.actorName})`)];
        receipt.status = "resolved"; await persist();
      }
    } catch (error) {
      if (receipt.status === "resolved") throw error;
      receipt.status = receipt.status === "running" ? "uncertain" : "failed";
      receipt.diagnostic = error instanceof Error ? error.message : "Falha na execução."; await persist();
    }
    await this.finish(ledger, receipt, persist);
    return { status: receipt.status, diagnostic: receipt.diagnostic };
  }
  private async finish(ledger: AllyLedger, receipt: AllyExecutionReceipt, persist: () => Promise<void>): Promise<void> {
    const context = await this.context(receipt);
    await this.receipts.publish(receipt, context, this.executionGuard());
    if (receipt.status === "resolved") receipt.status = "completed";
    await persist();
    const archived = this.receipts.archived(receipt.messageId, ledger.ledgerInstanceId);
    if (!archived || archived.sequence !== receipt.sequence || archived.status !== receipt.status) throw new Error("Recibo não foi confirmado no card.");
    retireAllyReceipt(ledger, receipt); await persist();
  }
  private async applyAction(ledger: AllyLedger, request: AllyUseRequest, actorId: string, userId: string): Promise<unknown> {
    const message = allyMessage(request.messageId);
    const receipt = message && readProtectedAllyReceipt(message, ledger.ledgerInstanceId);
    if (!message || !receipt || receipt.status !== "completed" || !receipt.card
      || receipt.actorId !== actorId || receipt.sequence !== request.sequence) throw new Error("Card protegido não encontrado.");
    if (ledger.receipts.some(entry => entry.sequence === receipt.sequence)) throw new Error("Publicação ainda não confirmada no registro. Confira a recuperação antes de aplicar ações.");
    const action = receipt.card.actions.find(entry => entry.id === request.actionId);
    if (!action || action.state !== "available") throw new Error("Ação indisponível, incerta ou já executada.");
    action.state = "executing";
    const guard = this.executionGuard();
    const write = async () => {
      await guard();
      await message.update({ [`flags.${MODULE_ID}.${ALLY_RECEIPT_FLAG}`]: receipt,
        [`flags.${MODULE_ID}.abilityUse`]: { version: 3, revision: 0, state: receipt.card } });
    };
    await write();
    try {
      await guard();
      const result = await this.assisted.execute(receipt.card, action);
      action.state = result.ok ? "completed" : result.sideEffect === "none" ? "available" : "uncertain";
      if (result.ok) { action.completedByUserId = userId; action.completedAt = new Date().toISOString(); }
      await write();
      if (!result.ok) throw new Error(result.message);
    } catch (error) {
      if (action.state === "executing") { action.state = "uncertain"; await write(); }
      throw error;
    }
    return { status: "completed" };
  }
}
