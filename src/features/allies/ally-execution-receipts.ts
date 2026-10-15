import type { WorkflowTargetReference } from "../../core/workflow/workflow-target-reference";
import type { AbilityUseCardState } from "../abilities/ability-use-card-state";
import type { AbilityUseDialogModelInput } from "../abilities/ability-use-dialog-model";
import type { AllyLedger } from "./ally-support-service";
import { isJsonData } from "../../core/serialization/json-data";
import { normalizeAbilityUseMessageFlag } from "../abilities/ability-roll-chat-contract";

export const ALLY_RECEIPT_FLAG = "allyExecutionReceipt";
export const MAX_ALLY_RECEIPTS = 256;
export type AllyExecutionStatus = "prepared" | "running" | "resolved" | "completed" | "cancelled" | "failed" | "uncertain";
export type AllyExecutionReceipt = {
  version: 1; ledgerInstanceId: string; sequence: number; generation: string;
  status: AllyExecutionStatus; requesterId: string; grantId: string; actorId: string;
  allyId: string; sourceItemId: string; activationSequence: number; fingerprint: string;
  messageId: string; resultMessageId: string; preparedAt: number;
  engine: "generic" | "automation"; targets: WorkflowTargetReference[];
  sourceName: string; actorName: string; executionFingerprint: string;
  dialog: AbilityUseDialogModelInput | null; checkpoint: string | null;
  card: AbilityUseCardState | null; summary: string[]; diagnostic: string | null;
  operations: { checkpoint: string; result: unknown }[];
};
const states = new Set(["prepared", "running", "resolved", "completed", "cancelled", "failed", "uncertain"]);
export function isAllyExecutionReceipt(value: unknown): value is AllyExecutionReceipt {
  if (!value || typeof value !== "object" || !isJsonData(value)) return false;
  const r = value as AllyExecutionReceipt;
  return r.version === 1 && states.has(r.status) && Number.isSafeInteger(r.sequence) && r.sequence > 0
    && [r.ledgerInstanceId, r.generation, r.requesterId, r.grantId, r.actorId, r.allyId,
      r.sourceItemId, r.messageId, r.resultMessageId, r.fingerprint, r.sourceName, r.actorName, r.executionFingerprint].every(id => typeof id === "string" && id.length > 0)
    && Number.isSafeInteger(r.activationSequence) && r.activationSequence >= 0
    && Number.isFinite(r.preparedAt) && ["generic", "automation"].includes(r.engine)
    && Array.isArray(r.targets) && r.targets.every(target => target && typeof target.id === "string" && typeof target.name === "string"
      && [target.actorId, target.actorUuid, target.sceneId, target.tokenId, target.tokenUuid].every(id => id === null || typeof id === "string"))
    && Array.isArray(r.operations) && r.operations.every(op => op && typeof op.checkpoint === "string") && Array.isArray(r.summary)
    && r.summary.every(line => typeof line === "string")
    && (r.diagnostic === null || typeof r.diagnostic === "string")
    && (r.checkpoint === null || typeof r.checkpoint === "string")
    && (r.card === null || Boolean(normalizeAbilityUseMessageFlag({ version: 3, revision: 0, state: r.card })))
    && (r.dialog === null || (r.dialog && typeof r.dialog.abilityName === "string" && typeof r.dialog.actorName === "string"
      && ["PE", "PD"].includes(r.dialog.resource) && Number.isFinite(r.dialog.cost) && Number.isFinite(r.dialog.currentResource)
      && typeof r.dialog.passive === "boolean" && Array.isArray(r.dialog.rollChoices)));
}
export function retireAllyReceipt(ledger: AllyLedger, receipt: AllyExecutionReceipt): void {
  ledger.receipts = ledger.receipts.filter(entry => entry.sequence !== receipt.sequence);
  ledger.retiredExecutionThrough = Math.max(ledger.retiredExecutionThrough, receipt.sequence);
}
export function recoverAllyReceipts(ledger: AllyLedger, generation: string, now: number): boolean {
  let changed = ledger.executionGeneration !== generation;
  ledger.executionGeneration = generation;
  for (const receipt of ledger.receipts) {
    if (receipt.status === "running" && receipt.generation !== generation) {
      receipt.status = "uncertain"; receipt.diagnostic = "Execução interrompida. Confira os recursos e resultados antes de qualquer novo uso."; changed = true;
    }
    if (receipt.status === "prepared" && (receipt.generation !== generation || now - receipt.preparedAt > 900_000)) {
      receipt.status = "cancelled"; receipt.diagnostic = "Preparação expirada ou executor alterado."; changed = true;
    }
  }
  return changed;
}
