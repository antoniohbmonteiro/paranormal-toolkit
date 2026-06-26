import { MODULE_ID } from "../constants";
import type { ChatCardStep } from "../core/automation/automation-definition";
import type { WorkflowContext } from "../core/automation/workflow-context";
import type { ResourceTransaction } from "../core/resources/resource-transaction";
import type { DebugOutputService } from "../debug/output/debug-output-service";

export type ResourceOperationChatData = {
  transaction: ResourceTransaction;
};

export class ChatMessageService {
  constructor(private readonly debugOutput: DebugOutputService) {}

  async createResourceOperationMessage(data: ResourceOperationChatData): Promise<void> {
    const content = this.createResourceOperationContent(data.transaction);

    await this.debugOutput.chat({
      speaker: ChatMessage.getSpeaker({ actor: data.transaction.actor }),
      content,
      data: data.transaction,
      flags: {
        [MODULE_ID]: {
          resourceTransaction: serializeResourceTransaction(data.transaction)
        }
      }
    });
  }

  async createWorkflowSummaryMessage(context: WorkflowContext, step: ChatCardStep): Promise<void> {
    const content = this.createWorkflowSummaryContent(context, step);

    await this.debugOutput.chat({
      speaker: ChatMessage.getSpeaker({ actor: context.sourceActor }),
      content,
      data: serializeWorkflowSummary(context),
      flags: {
        [MODULE_ID]: {
          workflowSummary: serializeWorkflowSummary(context)
        }
      }
    });
  }

  private createResourceOperationContent(transaction: ResourceTransaction): string {
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

  private createWorkflowSummaryContent(context: WorkflowContext, step: ChatCardStep): string {
    const title = escapeHtml(step.title ?? "Automação");
    const message = step.message ? `<p>${escapeHtml(step.message)}</p>` : "";
    const sourceName = escapeHtml(context.sourceToken?.name ?? context.sourceActor.name ?? "Origem sem nome");
    const itemName = escapeHtml(context.item.name ?? "Item sem nome");
    const targets = context.targets.length > 0 ? context.targets.map((target) => escapeHtml(target.name)).join(", ") : "Nenhum";
    const rollRows = Object.values(context.rolls).map(
      (roll) => `<li><strong>${escapeHtml(roll.id)}:</strong> ${escapeHtml(roll.formula)} = ${roll.total}</li>`
    );
    const ritualCostRows = context.ritualCosts.map(
      (cost) =>
        `<li><strong>${escapeHtml(cost.itemName)}:</strong> ${cost.circle}º círculo — ${cost.amount} ${escapeHtml(cost.resource)} (${escapeHtml(getRitualCostSourceLabel(cost.source))})</li>`
    );
    const transactionRows = context.resourceTransactions.map(
      (transaction) =>
        `<li><strong>${escapeHtml(transaction.actorName)}:</strong> ${escapeHtml(getOperationTitle(transaction))} — ${transaction.before.value}/${transaction.before.max} &rarr; ${transaction.after.value}/${transaction.after.max}</li>`
    );

    return `
      <section class="${MODULE_ID}-card ${MODULE_ID}-workflow-card">
        <header class="${MODULE_ID}-card__header">
          <strong>${title}</strong>
          <span>${itemName}</span>
        </header>
        <div class="${MODULE_ID}-card__body">
          ${message}
          <p><strong>Origem:</strong> ${sourceName}</p>
          <p><strong>Alvo:</strong> ${targets}</p>
          ${ritualCostRows.length > 0 ? `<p><strong>Custo de ritual:</strong></p><ul>${ritualCostRows.join("")}</ul>` : ""}
          ${rollRows.length > 0 ? `<p><strong>Rolagens:</strong></p><ul>${rollRows.join("")}</ul>` : ""}
          ${transactionRows.length > 0 ? `<p><strong>Recursos:</strong></p><ul>${transactionRows.join("")}</ul>` : ""}
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

function serializeWorkflowSummary(context: WorkflowContext): Record<string, unknown> {
  return {
    sourceActorId: context.sourceActor.id ?? null,
    sourceActorName: context.sourceActor.name ?? "Ator sem nome",
    sourceToken: context.sourceToken,
    itemId: context.item.id ?? null,
    itemName: context.item.name ?? "Item sem nome",
    targets: context.targets.map((target) => ({
      tokenId: target.tokenId,
      actorId: target.actorId,
      sceneId: target.sceneId,
      name: target.name
    })),
    rolls: Object.values(context.rolls).map((roll) => ({
      id: roll.id,
      formula: roll.formula,
      total: roll.total
    })),
    ritualCosts: context.ritualCosts.map((cost) => ({
      itemId: cost.itemId,
      itemName: cost.itemName,
      circle: cost.circle,
      resource: cost.resource,
      amount: cost.amount,
      source: cost.source
    })),
    resourceTransactions: context.resourceTransactions.map(serializeResourceTransaction)
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

function getRitualCostSourceLabel(source: string): string {
  switch (source) {
    case "custom-flag":
      return "customizado";
    case "default-by-circle":
      return "padrão por círculo";
    default:
      return source;
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
