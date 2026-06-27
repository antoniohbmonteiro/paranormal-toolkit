import { MODULE_ID } from "../../constants";
import type { AutomationExecutionMode } from "./item-use-execution-mode";
import type { ItemUseContext } from "./item-use-context";

const PENDING_ID_ATTRIBUTE = "data-paranormal-toolkit-pending-id";
const BUTTON_SELECTOR = `[${PENDING_ID_ATTRIBUTE}]`;
const ENRICHMENT_CLASS = `${MODULE_ID}-chat-enrichment`;
const PROMPT_CLASS = `${MODULE_ID}-item-use-prompt`;
const PROMPT_ACTIONS_CLASS = `${PROMPT_CLASS}__actions`;
const PROMPT_SUMMARY_CLASS = `${PROMPT_CLASS}__summary`;
const PROMPT_TITLE_CLASS = `${PROMPT_CLASS}__title`;
const PROMPT_EXECUTED_BUTTON_CLASS = `${PROMPT_CLASS}__button--executed`;

export type ItemUseAutomationPromptInput = {
  pendingId: string;
  context: ItemUseContext;
  mode: Extract<AutomationExecutionMode, "ask">;
};

export type ItemUseAutomationPromptHandler = (pendingId: string) => Promise<boolean>;

type PendingItemUseAutomationPrompt = ItemUseAutomationPromptInput & {
  createdAt: number;
  messageId: string | null;
  itemId: string | null;
  actorId: string | null;
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
  const prompt = createPendingPrompt(input);
  pendingPrompts.set(input.pendingId, prompt);

  renderPromptIntoExistingChatLog(input.pendingId);
}

export function unregisterPendingItemUseAutomationPrompt(pendingId: string): void {
  pendingPrompts.delete(pendingId);
}

function createPendingPrompt(input: ItemUseAutomationPromptInput): PendingItemUseAutomationPrompt {
  return {
    ...input,
    createdAt: Date.now(),
    messageId: getDocumentId(input.context.message),
    itemId: input.context.item.id ?? null,
    actorId: input.context.actor?.id ?? null
  };
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

  const messageElement = prompt.messageId ? findRenderedChatMessageById(prompt.messageId) : null;

  if (messageElement) {
    appendPromptToRoot(messageElement, prompt);
    bindPromptButtonsIfPossible(messageElement);
    return;
  }

  if (prompt.messageId) return;

  const matchedElement = findRenderedChatMessageByItem(prompt);

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
  if (root.querySelector(`[${PENDING_ID_ATTRIBUTE}="${escapeCssAttributeValue(prompt.pendingId)}"]`)) return;

  const section = getOrCreateToolkitSection(root, prompt.context);
  const actions = getOrCreateActionsContainer(section);
  actions.append(createPromptButton(prompt.pendingId));
}

function getOrCreateToolkitSection(root: HTMLElement, context: ItemUseContext): HTMLElement {
  const existing = root.querySelector<HTMLElement>(`.${ENRICHMENT_CLASS}`);

  if (existing) {
    return existing;
  }

  const section = document.createElement("section");
  section.classList.add(ENRICHMENT_CLASS, PROMPT_CLASS);

  const header = document.createElement("header");
  header.classList.add(`${PROMPT_CLASS}__header`);

  const title = document.createElement("strong");
  title.classList.add(PROMPT_TITLE_CLASS);
  title.textContent = "Paranormal Toolkit";

  const summary = document.createElement("span");
  summary.classList.add(PROMPT_SUMMARY_CLASS);
  summary.textContent = createPromptSummary(context);

  header.append(title, summary);
  section.append(header);

  const host = findPromptHost(root);
  host.append(section);

  return section;
}

function getOrCreateActionsContainer(section: HTMLElement): HTMLElement {
  const existing = section.querySelector<HTMLElement>(`.${PROMPT_ACTIONS_CLASS}`);

  if (existing) {
    return existing;
  }

  const actions = document.createElement("div");
  actions.classList.add(PROMPT_ACTIONS_CLASS);
  section.append(actions);

  return actions;
}

function createPromptButton(pendingId: string): HTMLButtonElement {
  const button = document.createElement("button");
  button.type = "button";
  button.classList.add(`${PROMPT_CLASS}__button`);
  button.textContent = "Aplicar automação";
  button.setAttribute(PENDING_ID_ATTRIBUTE, pendingId);
  return button;
}

function createPromptSummary(context: ItemUseContext): string {
  const source = context.actor?.name ?? context.token?.name ?? "Origem não resolvida";
  const targets = createTargetText(context);
  return `${source} → ${targets}`;
}

function createTargetText(context: ItemUseContext): string {
  return context.targets.length > 0
    ? context.targets.map((target) => target.name).join(", ")
    : "nenhum alvo";
}

function findPromptHost(root: HTMLElement): HTMLElement {
  return root.querySelector<HTMLElement>(".message-content") ?? root;
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
  button.textContent = "Aplicando...";

  const executed = await handler(pendingId);

  if (executed) {
    button.textContent = "✓ Automação aplicada";
    button.classList.add(PROMPT_EXECUTED_BUTTON_CLASS);
    button.removeAttribute(PENDING_ID_ATTRIBUTE);
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
  const currentMessageId = getDocumentId(message) ?? root.dataset.messageId ?? null;

  if (prompt.messageId) {
    return prompt.messageId === currentMessageId;
  }

  if (!prompt.itemId || !hasDataAttribute(root, "itemId", prompt.itemId)) {
    return false;
  }

  return !prompt.actorId || hasDataAttribute(root, "actorId", prompt.actorId);
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
  const escapedMessageId = escapeCssAttributeValue(messageId);
  return document.querySelector<HTMLElement>(
    `.chat-message[data-message-id="${escapedMessageId}"], [data-message-id="${escapedMessageId}"]`
  );
}

function findRenderedChatMessageByItem(prompt: PendingItemUseAutomationPrompt): HTMLElement | null {
  for (const message of document.querySelectorAll<HTMLElement>(".chat-message, [data-message-id]")) {
    if (doesPromptMatchMessage(prompt, null, message)) {
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

  const documentLike = value as { id?: unknown };

  if (typeof documentLike.id === "string" && documentLike.id.length > 0) {
    return documentLike.id;
  }

  return null;
}

function toKebabCase(value: string): string {
  return value.replace(/[A-Z]/g, (letter) => `-${letter.toLowerCase()}`);
}

function escapeCssAttributeValue(value: string): string {
  return value.replace(/\\/g, "\\\\").replace(/"/g, '\\"');
}
