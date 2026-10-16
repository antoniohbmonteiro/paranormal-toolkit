import { MODULE_ID } from "../../constants";
import { AllyItemUseGateway, type ManagedItemClassification } from "../../features/item-use/item-use-route";
import type { ItemUseContext } from "../../features/item-use/item-use-context";
import type { AbilityUseDialogModelInput } from "../../features/abilities/ability-use-dialog-model";
import { createWorkflowTargetReferences } from "../../core/workflow/workflow-target-reference";
import { ALLY_ROUTE_INDEX, ALLY_ROUTE_PROTOCOL, ALLY_GRANT_FLAG, readAllyRouteIndex } from "./foundry-ally-item-adapter";
import { electAllyExecutor } from "../../features/allies/ally-operation-authority";
import { allyUsers, readChangedProperty } from "./foundry-ally-request-adapter";
import { ALLY_RECEIPT_FLAG, isAllyExecutionReceipt } from "../../features/allies/ally-execution-receipts";
import type { AllyGrantedAbilityUseService, AllyUseRequest } from "../../features/allies/ally-granted-ability-use-service";
import type { AllySupportService } from "../../features/allies/ally-support-service";

const REQUEST = "allyAbilityRequest";
const RESPONSE = "allyAbilityResponse";
type Reply = { status: string; sequence: number; engine?: string; mode?: string; dialog?: AbilityUseDialogModelInput; diagnostic?: string | null };
export function classifyAllyUse(context: ItemUseContext): ManagedItemClassification {
  if (context.item.type !== "ability") return "ordinary";
  const actorId = context.actor?.id;
  let invalid = false;
  let installation = false;
  for (const gm of game.users.filter(user => user.isGM)) {
    const raw = gm.getFlag?.(MODULE_ID, ALLY_ROUTE_INDEX);
    const protocol = gm.getFlag?.(MODULE_ID, ALLY_ROUTE_PROTOCOL) as { version?: number; ledgerInstanceId?: string; anchor?: string } | undefined;
    if (protocol && (protocol.version !== 1 || protocol.anchor !== gm.getFlag?.(MODULE_ID, "allyStore") || raw === undefined)) invalid = true;
    if (raw === undefined) continue;
    installation = true;
    const index = readAllyRouteIndex(raw);
    if (!index || index.anchor !== gm.getFlag?.(MODULE_ID, "allyStore")
      || (protocol && protocol.ledgerInstanceId !== index.ledgerInstanceId)) { invalid = true; continue; }
    if (index.entries.some(entry => entry.actorId === actorId && entry.itemId === context.item.id)) return "managed";
  }
  if (invalid || (installation && !actorId) || context.item.getFlag(MODULE_ID, ALLY_GRANT_FLAG) !== undefined) return "blocked";
  return "ordinary";
}
export function readAllyUseRequest(actor: Actor, changes: Record<string, unknown>, userId: string): AllyUseRequest | undefined {
  const path = ["flags", MODULE_ID, REQUEST];
  const delta = readChangedProperty(changes, [...path, "id"]);
  if (!delta.found) return undefined;
  const raw = actor.getFlag(MODULE_ID, REQUEST) as AllyUseRequest | undefined;
  if (!raw || raw.id !== delta.value || typeof raw.id !== "string" || !/^[a-zA-Z0-9_-]{8,80}$/.test(raw.id)
    || !["prepare", "execute", "cancel", "apply"].includes(raw.action) || typeof raw.messageId !== "string"
    || (actor._stats?.lastModifiedBy && actor._stats.lastModifiedBy !== userId)
    || (raw.sequence !== undefined && (!Number.isSafeInteger(raw.sequence) || raw.sequence < 1))
    || (raw.action === "prepare" && typeof raw.itemId !== "string")
    || (raw.action === "apply" && typeof raw.actionId !== "string")) throw new Error("Solicitação de habilidade inválida.");
  if (raw.targets !== undefined && (!Array.isArray(raw.targets) || raw.targets.length > 100 || !raw.targets.every(target => target
    && typeof target.id === "string" && typeof target.name === "string"
    && [target.actorId, target.actorUuid, target.tokenId, target.tokenUuid, target.sceneId].every(value => value === null || typeof value === "string")))) throw new Error("Referências de alvos inválidas.");
  for (const key of Object.keys(raw)) {
    const change = readChangedProperty(changes, [...path, key]);
    if (change.found && JSON.stringify(change.value) !== JSON.stringify((raw as unknown as Record<string, unknown>)[key])) throw new Error("Solicitação diferencial divergente.");
  }
  return structuredClone(raw);
}
export class FoundryAllyAbilityRequests {
  private readonly waiting = new Map<string, { userId: string; actorId: string; resolve(value: Reply): void; reject(error: Error): void }>();
  private clientQueue: Promise<unknown> = Promise.resolve();
  private readonly busy = new Set<string>();
  readonly gateway: AllyItemUseGateway;
  constructor() {
    const report = (error: unknown) => ui.notifications?.warn(error instanceof Error ? error.message : "Falha no uso de habilidade concedida.");
    this.gateway = new AllyItemUseGateway(classifyAllyUse, context => this.submit(context), report,
      async (message, actionId) => {
        const receipt = message.getFlag?.(MODULE_ID, ALLY_RECEIPT_FLAG);
        if (receipt === undefined) return false;
        try {
          if (!isAllyExecutionReceipt(receipt) || typeof message.id !== "string") throw new Error("Recibo do card inválido.");
          await this.send(receipt.actorId, { action: "apply", messageId: message.id, sequence: receipt.sequence, actionId });
        } catch (error) { report(error); }
        return true;
      },
      async pendingId => {
        if (!pendingId.startsWith("ally/")) return undefined;
        const [, actorId, sequence] = pendingId.split("/");
        const message = (game.messages.contents ?? []).find(entry => {
          const raw = entry.getFlag?.(MODULE_ID, ALLY_RECEIPT_FLAG);
          return isAllyExecutionReceipt(raw) && raw.actorId === actorId && raw.sequence === Number(sequence);
        });
        if (!message?.id) { report(new Error("Preparação de automação ausente.")); return false; }
        try { await this.send(actorId, { action: "execute", messageId: message.id, sequence: Number(sequence) }); return true; }
        catch (error) { report(error); return false; }
      });
  }
  private async submit(context: ItemUseContext): Promise<void> {
    const actor = context.actor;
    const messageId = (context.message as { id?: string })?.id;
    if (!actor?.id || actor.isToken || !messageId) throw new Error("Use a concessão no Agente persistente original.");
    if ((context.message as { getFlag?: (scope: string, key: string) => unknown })?.getFlag?.(MODULE_ID, ALLY_RECEIPT_FLAG)
      || (context.message as { getFlag?: (scope: string, key: string) => unknown })?.getFlag?.(MODULE_ID, "allyExecutionBinding")) return;
    const key = `${actor.id}/${context.item.id}`;
    if (this.busy.has(key)) return;
    this.busy.add(key);
    try {
      const prepared = await this.send(actor.id, { action: "prepare", messageId, itemId: context.item.id!, targets: createWorkflowTargetReferences(context.targets) });
      if (prepared.status !== "prepared") return;
      if (prepared.engine === "generic") {
        if (!prepared.dialog) throw new Error("Preparação de habilidade sem diálogo.");
        const { AbilityUseApplication } = await import("../../applications/ability-use-application");
        const options = await AbilityUseApplication.request(prepared.dialog);
        await this.send(actor.id, { action: options ? "execute" : "cancel", messageId, sequence: prepared.sequence, ...(options ? { options } : {}) });
      } else if (prepared.mode === "automatic") await this.send(actor.id, { action: "execute", messageId, sequence: prepared.sequence });
    } finally { this.busy.delete(key); }
  }
  send(actorId: string, request: Omit<AllyUseRequest, "id">): Promise<Reply> {
    const work = () => new Promise<Reply>((resolve, reject) => {
      const actor = game.actors.get?.(actorId); const user = game.user;
      if (!user?.id || !actor || !actor.canUserModify(user, "update") || !electAllyExecutor(allyUsers())) { reject(new Error("Solicitante sem permissão ou nenhum GM executor conectado.")); return; }
      const id = foundry.utils.randomID();
      const timeout = setTimeout(() => { this.waiting.delete(id); reject(new Error("Sem confirmação do GM. Não repita uma execução possivelmente iniciada; confira o card.")); }, 120_000);
      this.waiting.set(id, { userId: user.id, actorId, resolve: value => { clearTimeout(timeout); resolve(value); }, reject: error => { clearTimeout(timeout); reject(error); } });
      void actor.setFlag(MODULE_ID, REQUEST, { ...request, id }).catch(error => { this.waiting.delete(id); clearTimeout(timeout); reject(error); });
    });
    const next = this.clientQueue.then(work).then(reply => {
      if (reply.status === "failed" || reply.status === "uncertain") throw new Error(reply.diagnostic
        ?? "Execução não confirmada. Confira o recibo; não repita uma operação incerta.");
      if (reply.status === "cancelled" && request.action === "execute") throw new Error("Preparação encerrada. Inicie um novo uso intencional.");
      return reply;
    });
    this.clientQueue = next.catch(() => undefined); return next;
  }
  register(service: AllyGrantedAbilityUseService, support: AllySupportService): void {
    const report = (error: unknown) => console.error("Paranormal Toolkit | Allies: habilidade concedida", error);
    Hooks.on("updateActor", (actor: Actor, changes: Record<string, unknown>, _options: unknown, userId: string) => {
      if (actor.type !== "agent" || actor.isToken || game.actors.get?.(actor.id!) !== actor) return;
      const responseId = readChangedProperty(changes, ["flags", MODULE_ID, RESPONSE, "id"]);
      if (responseId.found && typeof responseId.value === "string" && userId === electAllyExecutor(allyUsers())) {
        const waiter = this.waiting.get(responseId.value);
        const response = actor.getFlag(MODULE_ID, RESPONSE) as { id?: string; userId?: string; ok?: boolean; data?: Reply; error?: string } | undefined;
        if (waiter && response?.id === responseId.value && response.userId === waiter.userId && waiter.actorId === actor.id) {
          this.waiting.delete(responseId.value);
          if (response.ok && response.data) waiter.resolve(response.data); else waiter.reject(new Error(response?.error ?? "Uso recusado."));
        }
      }
      if (!support.isExecutor()) return;
      let request: AllyUseRequest | undefined;
      try { request = readAllyUseRequest(actor, changes, userId); } catch (error) { report(error); return; }
      if (!request) return;
      const received = request;
      void service.handle(actor.id!, received, userId).then(async data => {
        service.assertExecutor(); await actor.setFlag(MODULE_ID, RESPONSE, { id: received.id, userId, ok: true, data });
      }).catch(async error => {
        report(error);
        if (support.isExecutor()) await actor.setFlag(MODULE_ID, RESPONSE, { id: received.id, userId, ok: false, error: error instanceof Error ? error.message : "Uso recusado." });
      }).catch(report);
    });
    const recover = () => { service.observeExecutor(); if (support.isExecutor()) void service.recoverPending().catch(report); };
    Hooks.on("userConnected", recover); Hooks.on("updateUser", recover); recover();
  }
}
