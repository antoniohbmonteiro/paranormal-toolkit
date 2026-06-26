import { MODULE_ID } from "../../constants";
import { getChatWorkflowFlag } from "./chat-workflow-flags";

export function registerChatEnrichmentRenderer(): void {
  const render = (message: unknown, html: unknown): void => {
    enrichChatMessage(message, html);
  };

  Hooks.on("renderChatMessageHTML", render);
  Hooks.on("renderChatMessage", render);
}

function enrichChatMessage(message: unknown, html: unknown): void {
  const workflow = getChatWorkflowFlag(message);

  if (!workflow || workflow.targets.length === 0) return;

  const root = resolveRootElement(html);
  if (!root) return;

  if (root.querySelector(`.${MODULE_ID}-chat-enrichment`)) return;

  const messageContent = root.querySelector(".message-content") ?? root;
  messageContent.append(createEnrichmentElement(workflow.targets.map((target) => target.name)));
}

function createEnrichmentElement(targetNames: string[]): HTMLElement {
  const section = document.createElement("section");
  section.classList.add(`${MODULE_ID}-chat-enrichment`);

  const title = document.createElement("strong");
  title.textContent = "Paranormal Toolkit";

  const row = document.createElement("p");
  row.classList.add(`${MODULE_ID}-chat-enrichment__row`);

  const label = document.createElement("span");
  label.textContent = "Alvo: ";

  const value = document.createElement("span");
  value.textContent = targetNames.join(", ");

  row.append(label, value);
  section.append(title, row);

  return section;
}

function resolveRootElement(html: unknown): HTMLElement | null {
  if (html instanceof HTMLElement) {
    return html;
  }

  if (html && typeof html === "object") {
    const maybeArrayLike = html as { 0?: unknown };

    if (maybeArrayLike[0] instanceof HTMLElement) {
      return maybeArrayLike[0];
    }
  }

  return null;
}
