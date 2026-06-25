import { MODULE_ID } from "../constants";

export type ResourceSpendChatData = {
  actor: Actor;
  resourceLabel: string;
  amount: number;
  before: number;
  after: number;
};

export class ChatMessageService {
  static async createResourceSpendMessage(data: ResourceSpendChatData): Promise<void> {
    const content = this.createResourceSpendContent(data);

    await ChatMessage.create({
      speaker: ChatMessage.getSpeaker({ actor: data.actor }),
      content
    });
  }

  private static createResourceSpendContent(data: ResourceSpendChatData): string {
    const actorName = escapeHtml(data.actor.name ?? "Ator sem nome");
    const resourceLabel = escapeHtml(data.resourceLabel);

    return `
      <section class="${MODULE_ID}-card ${MODULE_ID}-resource-card">
        <header class="${MODULE_ID}-card__header">
          <strong>Gasto de ${resourceLabel}</strong>
          <span>${actorName}</span>
        </header>
        <div class="${MODULE_ID}-card__body">
          <p><strong>${resourceLabel} gasto:</strong> ${data.amount}</p>
          <p><strong>Antes:</strong> ${data.before} &rarr; <strong>Depois:</strong> ${data.after}</p>
        </div>
      </section>
    `;
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
