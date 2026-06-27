import { MODULE_ID } from "../../constants";
import type { AutomationExecutionMode } from "./item-use-execution-mode";
import type { ItemUseContext } from "./item-use-context";

const PENDING_ID_ATTRIBUTE = "data-paranormal-toolkit-pending-id";
const BUTTON_SELECTOR = `[${PENDING_ID_ATTRIBUTE}]`;
const ENRICHMENT_CLASS = `${MODULE_ID}-chat-enrichment`;
const PROMPT_CLASS = `${MODULE_ID}-item-use-prompt`;

export type ItemUseAutomationPromptInput = {
  pendingId: string;
  context: ItemUseContext;
  mode: Extract<AutomationExecutionMode, "buttons">;
};

export type ItemUseAutomationPromptHandler = (pendingId: string) => Promise<boolean>;

type PendingItemUseAutomationPrompt = ItemUseAutomationPromptInput & {
  createdAt: number;
};

let promptRendererRegistered = false;
let promptHandler: ItemUseAutomationPromptHandler | null = null;

const pendingPrompts = new Map<string, PendingItemUseAutomationPrompt>();

export function registerItemUseAutomationPromptRenderer(handler: ItemUseAutomationPromptHandler): void {
  promptHandler = handler;

  if (promptRendererRegistered) return;

  Hooks.on("renderChatMessageHTML", (message: unknown, html: unknown) => {
    renderPendingPromptIntoChatMessage(message, html, handler);
  });

  promptRendererRegistered = true;
}

export function registerPendingItemUseAutomationPrompt(input: ItemUseAutomationPromptInput): void {
  pendingPrompts.set(input.pendingId, {
    ...input,
    createdAt: Date.now()
  });

  renderPromptIntoExistingChatLog(input.pendingId);
}

export function unregisterPendingItemUseAutomationPrompt(pendingId: string): void {
  pendingPrompts.delete(pendingId);
}

function renderPendingPromptIntoChatMessage(
  message: unknown,
  html: unknown,
  handler: ItemUseAutomationPromptHandler
): void {
  pruneExpiredPrompts();

  const root = resolveRootElement(html);
  if (!root) return;

  const prompt = findPromptForMessage(message, root);
  if (!prompt) {
    bindPromptButtons(root, handler);
    return;
  }

  appendPromptToRoot(root, prompt);
  bindPromptButtons(root, handler);
}

function renderPromptIntoExistingChatLog(pendingId: string): void {
  const prompt = pendingPrompts.get(pendingId);
  if (!prompt) return;

  const messageId = getDocumentId(prompt.context.message);
  const messageElement = messageId ? findRenderedChatMessageById(messageId) : null;

  if (messageElement) {
    appendPromptToRoot(messageElement, prompt);
    bindPromptButtonsIfPossible(messageElement);
    return;
  }

  const matchedElement = findRenderedChatMessageByItem(prompt.context);

  if (matchedElement) {
    appendPromptToRoot(matchedElement, prompt);
    bindPromptButtonsIfPossible(matchedElement);
  }
}

function bindPromptButtonsIfPossible(root: HTMLElement): void {
  if (!promptHandler) return;
  bindPromptButtons(root, promptHandler);
}

function appendPromptToRoot(root: HTMLElement, prompt: PendingItemUseAutomationPrompt): void {
  if (root.querySelector(`[${PENDING_ID_ATTRIBUTE}="${escapeAttribute(prompt.pendingId)}"]`)) return;

  const section = getOrCreateToolkitSection(root, prompt.context);
  section.append(createPromptButton(prompt.pendingId));
}

function getOrCreateToolkitSection(root: HTMLElement, context: ItemUseContext): HTMLElement {
  const existing = root.querySelector<HTMLElement>(`.${ENRICHMENT_CLASS}`);

  if (existing) {
    return existing;
  }

  const section = document.createElement("section");
  section.classList.add(ENRICHMENT_CLASS, PROMPT_CLASS);

  const title = document.createElement("strong");
  title.textContent = "Paranormal Toolkit";
  section.append(title);

  section.append(createRow("Origem", context.actor?.name ?? "Origem não resolvida"));
  section.append(createRow("Alvo", createTargetText(context)));

  const messageContent = root.querySelector(".message-content") ?? root;
  messageContent.append(section);

  return section;
}

function createPromptButton(pendingId: string): HTMLButtonElement {
  const button = document.createElement("button");
  button.type = "button";
  button.textContent = "Executar automação";
  button.setAttribute(PENDING_ID_ATTRIBUTE, pendingId);
  return button;
}

function createRow(labelText: string, valueText: string): HTMLElement {
  const row = document.createElement("p");
  row.classList.add(`${MODULE_ID}-chat-enrichment__row`);

  const label = document.createElement("span");
  label.textContent = `${labelText}: `;

  const value = document.createElement("span");
  value.textContent = valueText;

  row.append(label, value);
  return row;
}

function createTargetText(context: ItemUseContext): string {
  return context.targets.length > 0
    ? context.targets.map((target) => target.name).join(", ")
    : "Nenhum alvo selecionado";
}

function bindPromptButtons(html: unknown, handler: ItemUseAutomationPromptHandler): void {
  const root = resolveRootElement(html);
  if (!root) return;

  const buttons = root.querySelectorAll<HTMLButtonElement>(BUTTON_SELECTOR);

  for (const button of buttons) {
    if (button.dataset.paranormalToolkitBound === "true") continue;

    button.dataset.paranormalToolkitBound = "true";
    button.addEventListener("click", () => {
      void handleButtonClick(button, handler);
    });
  }
}

async function handleButtonClick(button: HTMLButtonElement, handler: ItemUseAutomationPromptHandler): Promise<void> {
  const pendingId = button.getAttribute(PENDING_ID_ATTRIBUTE);

  if (!pendingId) return;

  button.disabled = true;
  const originalText = button.textContent;
  button.textContent = "Executando...";

  const executed = await handler(pendingId);

  if (executed) {
    button.textContent = "Executado";
    return;
  }

  button.disabled = false;
  button.textContent = originalText;
}

function findPromptForMessage(message: unknown, root: HTMLElement): PendingItemUseAutomationPrompt | null {
  for (const prompt of pendingPrompts.values()) {
    if (doesPromptMatchMessage(prompt, message, root)) {
      return prompt;
    }
  }

  return null;
}

function doesPromptMatchMessage(prompt: PendingItemUseAutomationPrompt, message: unknown, root: HTMLElement): boolean {
  const promptMessageId = getDocumentId(prompt.context.message);
  const currentMessageId = getDocumentId(message) ?? root.dataset.messageId ?? null;

  if (promptMessageId && currentMessageId) {
    return promptMessageId === currentMessageId;
  }

  const itemId = prompt.context.item.id;
  const actorId = prompt.context.actor?.id ?? null;

  if (!itemId || !hasDataAttribute(root, "itemId", itemId)) {
    return false;
  }

  return !actorId || hasDataAttribute(root, "actorId", actorId);
}

function hasDataAttribute(root: HTMLElement, key: string, expectedValue: string): boolean {
  if (root.dataset[key] === expectedValue) {
    return true;
  }

  const dataAttribute = `data-${toKebabCase(key)}`;

  for (const element of root.querySelectorAll(`[${dataAttribute}]`)) {
    if (element.getAttribute(dataAttribute) === expectedValue) {
      return true;
    }
  }

  return false;
}

function findRenderedChatMessageById(messageId: string): HTMLElement | null {
  return document.querySelector<HTMLElement>(`.chat-message[data-message-id="${escapeAttribute(messageId)}"], [data-message-id="${escapeAttribute(messageId)}"]`);
}

function findRenderedChatMessageByItem(context: ItemUseContext): HTMLElement | null {
  const itemId = context.item.id;

  if (!itemId) return null;

  for (const message of document.querySelectorAll<HTMLElement>(".chat-message, [data-message-id]")) {
    if (doesPromptMatchMessage({ pendingId: "probe", context, mode: "buttons", createdAt: Date.now() }, null, message)) {
      return message;
    }
  }

  return null;
}

function pruneExpiredPrompts(): void {
  const now = Date.now();
  const maxAgeMs = 5 * 60 * 1_000;

  for (const [pendingId, prompt] of pendingPrompts.entries()) {
    if (now - prompt.createdAt > maxAgeMs) {
      pendingPrompts.delete(pendingId);
    }
  }
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

function getDocumentId(value: unknown): string | null {
  if (!value || typeof value !== "object") return null;

  const documentLike = value as { id?: unknown; uuid?: unknown };

  if (typeof documentLike.id === "string" && documentLike.id.length > 0) {
    return documentLike.id;
  }

  if (typeof documentLike.uuid === "string" && documentLike.uuid.length > 0) {
    return documentLike.uuid;
  }

  return null;
}

function toKebabCase(value: string): string {
  return value.replace(/[A-Z]/g, (letter) => `-${letter.toLowerCase()}`);
}

function escapeAttribute(value: string): string {
  const element = document.createElement("span");
  element.textContent = value;
  return element.innerHTML.replaceAll('"', "&quot;");
}
