import { MODULE_ID } from "../../constants";
import { ALLY_RECEIPT_FLAG, isAllyExecutionReceipt, type AllyExecutionReceipt } from "../../features/allies/ally-execution-receipts";
import { renderAbilityUseCard } from "../../ui/components/ability/ability-use-card";
import { buildAbilityUseCardViewModel } from "../../features/abilities/ability-use-card-view-model-builder";
import { registerCompletedItemUseAutomationCard, markPersistedPromptAsExecutedById } from "../../features/item-use/item-use-automation-prompt";
import type { ItemUseContext } from "../../features/item-use/item-use-context";
import { stableEffectFingerprint } from "../../core/allies/ally-passive-effect";
import { escapeHtml } from "../../ui/rendering/escape-html";

export type AllyReceiptMessage = {
  id: string; author: FoundryUserLike | null; content: string; speaker?: unknown; whisper?: string[]; blind?: boolean;
  getFlag(scope: string, key: string): unknown;
  update(data: Record<string, unknown>): Promise<unknown>;
  canUserModify(user: FoundryUserLike, action: string): boolean;
};
export function allyMessage(id: string): AllyReceiptMessage | null {
  return game.messages.get?.(id) as unknown as AllyReceiptMessage | null ?? null;
}
export function diagnoseAllyMessageAdmission(message: AllyReceiptMessage | null, requesterId: string) {
  const checks = {
    messageFound: Boolean(message),
    authorMatchesRequester: message?.author?.id === requesterId,
    hasReceipt: Boolean(message?.getFlag(MODULE_ID, ALLY_RECEIPT_FLAG)),
    hasBinding: Boolean(message?.getFlag(MODULE_ID, "allyExecutionBinding")),
  };
  const failures: string[] = [];
  if (!checks.messageFound) failures.push("message-not-found");
  else {
    if (!checks.authorMatchesRequester) failures.push("author-mismatch");
    if (checks.hasReceipt) failures.push("existing-receipt");
    if (checks.hasBinding) failures.push("existing-binding");
  }
  return { ...checks, failures };
}
export class AllyMessageAdmissionError extends Error {
  constructor(readonly diagnosis: ReturnType<typeof diagnoseAllyMessageAdmission>) {
    const labels: Record<string, string> = {
      "message-not-found": "mensagem não encontrada",
      "author-mismatch": "autor diferente do solicitante autenticado",
      "existing-receipt": "recibo de execução preexistente",
      "existing-binding": "vínculo de execução preexistente",
    };
    super(`Mensagem original inválida [${diagnosis.failures.join(", ")}]: ${diagnosis.failures.map(code => labels[code]).join("; ")}.`);
    this.name = "AllyMessageAdmissionError";
  }
}
export function isProtectedAllyMessage(message: AllyReceiptMessage): boolean {
  return Boolean(message.author?.isGM && !game.users.some(user => !user.isGM && message.canUserModify(user, "update")));
}
export function readProtectedAllyReceipt(message: AllyReceiptMessage, ledgerInstanceId: string): AllyExecutionReceipt | null {
  if (!isProtectedAllyMessage(message)) return null;
  const raw = message.getFlag(MODULE_ID, ALLY_RECEIPT_FLAG);
  return isAllyExecutionReceipt(raw) && raw.ledgerInstanceId === ledgerInstanceId
    && (raw.resultMessageId === message.id || raw.messageId === message.id) ? structuredClone(raw) : null;
}
export class FoundryAllyReceiptAdapter {
  constructor(private readonly assertExecutor: () => void) {}
  async claim(receipt: AllyExecutionReceipt, guard: () => Promise<void> = async () => {}): Promise<void> {
    await guard();
    this.assertExecutor();
    const message = allyMessage(receipt.messageId);
    if (!message) throw new Error("Mensagem de origem ausente.");
    await message.update({ author: game.user!.id, [`flags.${MODULE_ID}.${ALLY_RECEIPT_FLAG}`]: receipt });
    if (stableEffectFingerprint(readProtectedAllyReceipt(message, receipt.ledgerInstanceId)) !== stableEffectFingerprint(receipt)) throw new Error("Proteção da mensagem não confirmada.");
  }
  archived(messageId: string, ledgerId: string): AllyExecutionReceipt | null {
    const original = allyMessage(messageId); if (!original || !isProtectedAllyMessage(original)) return null;
    const own = readProtectedAllyReceipt(original, ledgerId);
    if (own && own.status !== "prepared") return own;
    const binding = original.getFlag(MODULE_ID, "allyExecutionBinding") as { ledgerInstanceId?: string; resultMessageId?: string } | undefined;
    if (binding?.ledgerInstanceId !== ledgerId || typeof binding.resultMessageId !== "string") return null;
    const result = allyMessage(binding.resultMessageId);
    const receipt = result && readProtectedAllyReceipt(result, ledgerId);
    return receipt?.messageId === messageId ? receipt : null;
  }
  async publish(receipt: AllyExecutionReceipt, context: ItemUseContext, guard: () => Promise<void> = async () => {}): Promise<void> {
    await guard();
    this.assertExecutor();
    const original = allyMessage(receipt.messageId);
    if (!original || !isProtectedAllyMessage(original)) throw new Error("Mensagem original ausente ou sem proteção de GM.");
    let result = allyMessage(receipt.resultMessageId);
    if (result && result.id !== original.id && !readProtectedAllyReceipt(result, receipt.ledgerInstanceId)) {
      throw new Error("Identidade da mensagem de resultado já está em uso.");
    }
    const completed = { ...structuredClone(receipt), status: receipt.status === "resolved" ? "completed" : receipt.status };
    const flags: Record<string, unknown> = { [ALLY_RECEIPT_FLAG]: completed };
    if (receipt.card) flags.abilityUse = { version: 3, revision: 0, state: receipt.card };
    const baseContent = receipt.card ? renderAbilityUseCard(buildAbilityUseCardViewModel(receipt.card)) : original.content;
    const diagnostic = receipt.diagnostic ? `<p class="notification warning">${escapeHtml(receipt.diagnostic)}</p>` : "";
    const content = diagnostic && !baseContent.endsWith(diagnostic) ? `${baseContent}${diagnostic}` : baseContent;
    const data = { author: game.user!.id, content, speaker: ChatMessage.getSpeaker({ actor: context.actor }),
      whisper: original.whisper ?? [], blind: original.blind ?? false,
      ...Object.fromEntries(Object.entries(flags).map(([key, value]) => [`flags.${MODULE_ID}.${key}`, value])),
    };
    if (!result) {
      await ChatMessage.create({ _id: receipt.resultMessageId, content, author: game.user!.id,
        speaker: data.speaker, whisper: data.whisper, blind: data.blind,
        flags: { [MODULE_ID]: flags } } as Parameters<typeof ChatMessage.create>[0], { keepId: true });
      result = allyMessage(receipt.resultMessageId);
    } else await result.update(data);
    if (!result || !readProtectedAllyReceipt(result, receipt.ledgerInstanceId)) throw new Error("Publicação não confirmada; não execute novamente.");
    await guard(); this.assertExecutor();
    if (receipt.engine === "automation" && receipt.status === "resolved") {
      await registerCompletedItemUseAutomationCard({ pendingId: `ally-result-${receipt.sequence}`, context: { ...context, message: result },
        mode: "ask", title: "Paranormal Toolkit · Automação", buttonLabel: "Automação aplicada",
        executedLabel: "✓ Automação aplicada", summaryLines: receipt.summary });
    }
    await guard(); this.assertExecutor();
    if (receipt.engine === "automation") await markPersistedPromptAsExecutedById(`ally/${receipt.actorId}/${receipt.sequence}`,
      receipt.status === "resolved" || receipt.status === "completed" ? "✓ Automação aplicada" : "Execução encerrada; confira o recibo");
    if (result.id !== original.id) {
      await guard(); this.assertExecutor();
      await original.update({ [`flags.${MODULE_ID}.allyExecutionBinding`]: {
        ledgerInstanceId: receipt.ledgerInstanceId, resultMessageId: receipt.resultMessageId },
        [`flags.${MODULE_ID}.${ALLY_RECEIPT_FLAG}`]: new foundry.data.operators.ForcedDeletion() });
    }
    const verified = readProtectedAllyReceipt(result, receipt.ledgerInstanceId);
    if (stableEffectFingerprint(verified) !== stableEffectFingerprint(completed)) throw new Error("Recibo publicado divergente.");
  }
}
