import { MODULE_ID } from "../constants";
import type { ResourceTransaction } from "./resources/resource-transaction";

export type ResourceSpendChatData = {
  actor: Actor;
  resourceLabel: string;
  amount: number;
  before: number;
  after: number;
};

export type ResourceOperationChatData = {
  transaction: ResourceTransaction;
};

export class ChatMessageService {
  static async createResourceSpendMessage(data: ResourceSpendChatData): Promise<void> {
    await this.createResourceOperationMessage({
      transaction: {
        actor: data.actor,
        actorId: data.actor.id ?? null,
        actorName: data.actor.name ?? "Ator sem nome",
        resource: data.resourceLabel === "PD" ? "PD" : "PE",
        operation: "spend",
        requestedAmount: data.amount,
        appliedAmount: data.amount,
        before: { value: data.before, max: data.before },
        after: { value: data.after, max: data.before }
      }
    });
  }

  static async createResourceOperationMessage(data: ResourceOperationChatData): Promise<void> {
    const content = this.createResourceOperationContent(data.transaction);

    await ChatMessage.create({
      speaker: ChatMessage.getSpeaker({ actor: data.transaction.actor }),
      content,
      flags: {
        [MODULE_ID]: {
          resourceTransaction: serializeResourceTransaction(data.transaction)
        }
      }
    });
  }

  private static createResourceOperationContent(transaction: ResourceTransaction): string {
    const actorName = escapeHtml(transaction.actorName);
    const resourceLabel = escapeHtml(transaction.resource);
    const title = escapeHtml(getOperationTitle(transaction));
    const appliedLabel = escapeHtml(getAppliedAmountLabel(transaction));

    return `
      <section class="${MODULE_ID}-card ${MODULE_ID}-resource-card">
        <header class="${MODULE_ID}-card__header">
          <strong>${title}</strong>
          <span>${actorName}</span>
        </header>
        <div class="${MODULE_ID}-card__body">
          <p><strong>${appliedLabel}:</strong> ${transaction.appliedAmount}</p>
          <p><strong>${resourceLabel}:</strong> ${transaction.before.value}/${transaction.before.max} &rarr; ${transaction.after.value}/${transaction.after.max}</p>
        </div>
      </section>
    `;
  }
}

function serializeResourceTransaction(transaction: ResourceTransaction): Record<string, unknown> {
  return {
    actorId: transaction.actorId,
    actorName: transaction.actorName,
    resource: transaction.resource,
    operation: transaction.operation,
    requestedAmount: transaction.requestedAmount,
    appliedAmount: transaction.appliedAmount,
    before: transaction.before,
    after: transaction.after
  };
}

function getOperationTitle(transaction: ResourceTransaction): string {
  switch (transaction.operation) {
    case "spend":
      return `Gasto de ${transaction.resource}`;
    case "damage":
      return `Dano em ${transaction.resource}`;
    case "heal":
      return `Cura de ${transaction.resource}`;
    case "recover":
      return `Recuperação de ${transaction.resource}`;
  }
}

function getAppliedAmountLabel(transaction: ResourceTransaction): string {
  switch (transaction.operation) {
    case "spend":
      return `${transaction.resource} gasto`;
    case "damage":
      return "Dano aplicado";
    case "heal":
      return "Cura aplicada";
    case "recover":
      return "Recuperação aplicada";
  }
}

function escapeHtml(value: string): string {
  return value
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;")
    .replaceAll('"', "&quot;")
    .replaceAll("'", "&#039;");
}
