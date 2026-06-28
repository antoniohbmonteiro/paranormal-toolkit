import { MODULE_ID } from "../../constants";
import type { AutomationExecutionMode } from "./item-use-execution-mode";
import type { ItemUseContext } from "./item-use-context";

const PROMPT_FLAG_KEY = "itemUsePrompts";
const PROMPT_ID_ATTRIBUTE = "data-paranormal-toolkit-prompt-id";
const PENDING_ID_ATTRIBUTE = "data-paranormal-toolkit-pending-id";
const EXECUTED_LABEL_ATTRIBUTE = "data-paranormal-toolkit-executed-label";
const DETAIL_KEY_ATTRIBUTE = "data-paranormal-toolkit-detail-key";
const ROLL_CARD_ATTRIBUTE = "data-paranormal-toolkit-roll-card";
const ROLL_DETAIL_TOGGLE_ATTRIBUTE = "data-paranormal-toolkit-roll-detail-toggle";
const ROLL_DETAIL_ID_ATTRIBUTE = "data-paranormal-toolkit-roll-detail-id";
const BUTTON_SELECTOR = `[${PENDING_ID_ATTRIBUTE}]`;
const ROLL_DETAIL_TOGGLE_SELECTOR = `[${ROLL_DETAIL_TOGGLE_ATTRIBUTE}]`;
const ENRICHMENT_CLASS = `${MODULE_ID}-chat-enrichment`;
const PROMPT_CLASS = `${MODULE_ID}-item-use-prompt`;
const PROMPT_ACTIONS_CLASS = `${PROMPT_CLASS}__actions`;
const PROMPT_DETAILS_CLASS = `${PROMPT_CLASS}__details`;
const PROMPT_SUMMARY_CLASS = `${PROMPT_CLASS}__summary`;
const PROMPT_TITLE_CLASS = `${PROMPT_CLASS}__title`;
const PROMPT_EXECUTED_BUTTON_CLASS = `${PROMPT_CLASS}__button--executed`;
const PROMPT_ROLL_CARD_CLASS = `${PROMPT_CLASS}__roll-card`;

export type ItemUseAutomationPromptInput = {
  pendingId: string;
  context: ItemUseContext;
  mode: Extract<AutomationExecutionMode, "ask">;
  title?: string;
  buttonLabel?: string;
  executedLabel?: string;
  summaryLines?: string[];
};

export type ItemUseAutomationPromptHandler = (pendingId: string) => Promise<boolean>;

type RenderableItemUseAutomationPrompt = {
  pendingId: string;
  mode: Extract<AutomationExecutionMode, "ask">;
  title?: string;
  buttonLabel?: string;
  executedLabel?: string;
  summaryLines?: string[];
  createdAt: number;
  messageId: string | null;
  itemId: string | null;
  actorId: string | null;
  itemName: string | null;
  summary: string;
  executed: boolean;
};

type PendingItemUseAutomationPrompt = ItemUseAutomationPromptInput & RenderableItemUseAutomationPrompt;

type PersistedItemUseAutomationPrompt = RenderableItemUseAutomationPrompt & {
  schemaVersion: 1;
};

type ChatMessageFlagDocument = {
  id?: unknown;
  getFlag?: (scope: string, key: string) => unknown;
  setFlag?: (scope: string, key: string, value: unknown) => Promise<unknown> | unknown;
};

type ParsedRollLine = {
  label: string;
  formula: string;
  total: number;
  intent: "healing" | "damage" | "generic";
};

type ParsedRollCard = ParsedRollLine & {
  itemName: string;
  form: string | null;
  cost: string | null;
  diceBreakdown: string | null;
  damageType: string | null;
  notes: string[];
  details: string[];
};

let promptRendererRegistered = false;
let promptHandler: ItemUseAutomationPromptHandler | null = null;

const pendingPrompts = new Map<string, PendingItemUseAutomationPrompt>();

export function registerItemUseAutomationPromptRenderer(handler: ItemUseAutomationPromptHandler): void {
  promptHandler = handler;

  if (promptRendererRegistered) return;

  Hooks.on("renderChatMessageHTML", (message: unknown, html: unknown) => {
    renderPendingPromptsIntoChatMessage(message, html, handler);
  });

  promptRendererRegistered = true;
}

export async function registerPendingItemUseAutomationPrompt(input: ItemUseAutomationPromptInput): Promise<void> {
  const prompt = createPendingPrompt(input);
  pendingPrompts.set(input.pendingId, prompt);

  await persistPromptInChatMessage(prompt);
  renderPromptIntoExistingChatLog(input.pendingId);
}

export async function unregisterPendingItemUseAutomationPrompt(pendingId: string): Promise<void> {
  const prompt = pendingPrompts.get(pendingId);
  pendingPrompts.delete(pendingId);

  if (!prompt) return;

  await markPersistedPromptAsExecuted(prompt);
}

function createPendingPrompt(input: ItemUseAutomationPromptInput): PendingItemUseAutomationPrompt {
  const messageId = getDocumentId(input.context.message);

  return {
    ...input,
    createdAt: Date.now(),
    messageId,
    itemId: input.context.item.id ?? null,
    actorId: input.context.actor?.id ?? null,
    itemName: input.context.item.name ?? null,
    summary: createPromptSummary(input.context),
    executed: false
  };
}

function renderPendingPromptsIntoChatMessage(
  message: unknown,
  html: unknown,
  handler: ItemUseAutomationPromptHandler
): void {
  pruneExpiredPrompts();

  const root = resolveRootElement(html);
  if (!root) return;

  const prompts = findPromptsForMessage(message, root);

  for (const prompt of prompts) {
    appendPromptToRoot(root, prompt);
  }

  bindPromptButtons(root, handler);
  bindRollDetailToggles(root);
}

function renderPromptIntoExistingChatLog(pendingId: string): void {
  const prompt = pendingPrompts.get(pendingId);
  if (!prompt) return;

  const messageElement = prompt.messageId ? findRenderedChatMessageById(prompt.messageId) : null;

  if (messageElement) {
    appendPromptToRoot(messageElement, prompt);
    bindPromptButtonsIfPossible(messageElement);
    bindRollDetailToggles(messageElement);
    return;
  }

  if (prompt.messageId) return;

  const matchedElement = findRenderedChatMessageByItem(prompt);

  if (matchedElement) {
    appendPromptToRoot(matchedElement, prompt);
    bindPromptButtonsIfPossible(matchedElement);
    bindRollDetailToggles(matchedElement);
  }
}

function bindPromptButtonsIfPossible(root: HTMLElement): void {
  if (!promptHandler) return;
  bindPromptButtons(root, promptHandler);
}

function appendPromptToRoot(root: HTMLElement, prompt: RenderableItemUseAutomationPrompt): void {
  if (root.querySelector(`[${PROMPT_ID_ATTRIBUTE}="${escapeCssAttributeValue(prompt.pendingId)}"]`)) return;

  const section = getOrCreateToolkitSection(root, prompt);
  appendPromptContent(section, prompt);

  const actions = getOrCreateActionsContainer(section);
  actions.append(createPromptButton(prompt));
}

function getOrCreateToolkitSection(root: HTMLElement, prompt: RenderableItemUseAutomationPrompt): HTMLElement {
  const existing = root.querySelector<HTMLElement>(`.${ENRICHMENT_CLASS}`);

  if (existing) {
    return existing;
  }

  const section = document.createElement("section");
  section.classList.add(ENRICHMENT_CLASS, PROMPT_CLASS);

  const header = document.createElement("header");
  header.classList.add(`${PROMPT_CLASS}__header`);

  const kicker = document.createElement("span");
  kicker.classList.add(`${PROMPT_CLASS}__kicker`);
  kicker.textContent = "Paranormal Toolkit";

  const title = document.createElement("strong");
  title.classList.add(PROMPT_TITLE_CLASS);
  title.textContent = createHeaderTitle(prompt);

  const summary = document.createElement("span");
  summary.classList.add(PROMPT_SUMMARY_CLASS);
  summary.textContent = prompt.summary;

  header.append(kicker, title, summary);
  section.append(header);

  const host = findPromptHost(root);
  host.append(section);

  return section;
}

function createHeaderTitle(prompt: RenderableItemUseAutomationPrompt): string {
  const form = findSummaryValue(prompt.summaryLines ?? [], "Forma");
  const itemName = prompt.itemName ?? prompt.title ?? "Automação assistida";

  if (form) {
    return `${itemName} • ${form}`;
  }

  return itemName;
}

function appendPromptContent(section: HTMLElement, prompt: RenderableItemUseAutomationPrompt): void {
  const summaryLines = prompt.summaryLines ?? [];
  const rollCard = createRollCard(summaryLines, prompt);

  if (rollCard) {
    appendRollCard(section, rollCard, prompt.pendingId);
    return;
  }

  appendSummaryLines(section, summaryLines);
}

function appendRollCard(section: HTMLElement, rollCard: ParsedRollCard, promptId: string): void {
  if (section.querySelector(`[${ROLL_CARD_ATTRIBUTE}="true"]`)) return;

  const article = document.createElement("article");
  article.classList.add(PROMPT_ROLL_CARD_CLASS, `${PROMPT_ROLL_CARD_CLASS}--${rollCard.intent}`);
  article.setAttribute(ROLL_CARD_ATTRIBUTE, "true");

  const summary = document.createElement("div");
  summary.classList.add(`${PROMPT_CLASS}__roll-summary`);

  const chip = document.createElement("span");
  chip.classList.add(`${PROMPT_CLASS}__roll-chip`, `${PROMPT_CLASS}__roll-chip--${rollCard.intent}`);
  chip.textContent = rollCard.label.toUpperCase();

  const total = document.createElement("strong");
  total.classList.add(`${PROMPT_CLASS}__roll-total`);
  total.textContent = String(rollCard.total);

  const formula = document.createElement("span");
  formula.classList.add(`${PROMPT_CLASS}__roll-formula`);
  formula.textContent = rollCard.formula;

  summary.append(chip, total, formula);
  article.append(summary);
  appendRollMeta(article, rollCard);
  appendRollDetails(article, rollCard, promptId);

  section.append(article);
}

function appendRollMeta(article: HTMLElement, rollCard: ParsedRollCard): void {
  const metaItems = [
    rollCard.form ? `Forma: ${rollCard.form}` : null,
    rollCard.cost,
    rollCard.damageType ? `Tipo: ${rollCard.damageType}` : null
  ].filter(isNonEmptyString);

  if (metaItems.length === 0) return;

  const meta = document.createElement("div");
  meta.classList.add(`${PROMPT_CLASS}__roll-meta`);

  for (const item of metaItems) {
    const pill = document.createElement("span");
    pill.classList.add(`${PROMPT_CLASS}__roll-meta-pill`);
    pill.textContent = item;
    meta.append(pill);
  }

  article.append(meta);
}

function appendRollDetails(article: HTMLElement, rollCard: ParsedRollCard, promptId: string): void {
  const detailRows = createRollDetailRows(rollCard);
  if (detailRows.length === 0) return;

  const detailId = `${promptId}-roll-details`;

  const toggle = document.createElement("button");
  toggle.type = "button";
  toggle.classList.add(`${PROMPT_CLASS}__roll-detail-toggle`);
  toggle.setAttribute(ROLL_DETAIL_TOGGLE_ATTRIBUTE, detailId);
  toggle.setAttribute("aria-expanded", "false");
  toggle.textContent = "▸ Ver detalhes";

  const details = document.createElement("dl");
  details.classList.add(`${PROMPT_CLASS}__roll-detail-list`);
  details.setAttribute(ROLL_DETAIL_ID_ATTRIBUTE, detailId);
  details.hidden = true;

  for (const row of detailRows) {
    const term = document.createElement("dt");
    term.textContent = row.label;

    const description = document.createElement("dd");
    description.textContent = row.value;

    details.append(term, description);
  }

  article.append(toggle, details);
}

function createRollDetailRows(rollCard: ParsedRollCard): { label: string; value: string }[] {
  const rows: { label: string; value: string }[] = [
    { label: "Fórmula", value: rollCard.formula }
  ];

  if (rollCard.diceBreakdown) rows.push({ label: "Dados", value: rollCard.diceBreakdown });
  if (rollCard.damageType) rows.push({ label: "Tipo", value: rollCard.damageType });
  if (rollCard.form) rows.push({ label: "Forma", value: rollCard.form });
  if (rollCard.cost) rows.push({ label: "Custo", value: rollCard.cost });

  for (const note of rollCard.notes) {
    rows.push({ label: "Observação", value: note });
  }

  for (const detail of rollCard.details) {
    rows.push({ label: "Detalhe", value: detail });
  }

  return rows;
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

function appendSummaryLines(section: HTMLElement, summaryLines: string[]): void {
  if (summaryLines.length === 0) return;

  const details = getOrCreateDetailsContainer(section);

  for (const line of summaryLines) {
    const key = createDetailKey(line);

    if (details.querySelector(`[${DETAIL_KEY_ATTRIBUTE}="${escapeCssAttributeValue(key)}"]`)) continue;

    const item = document.createElement("li");
    item.textContent = line;
    item.setAttribute(DETAIL_KEY_ATTRIBUTE, key);
    details.append(item);
  }
}

function getOrCreateDetailsContainer(section: HTMLElement): HTMLUListElement {
  const existing = section.querySelector<HTMLUListElement>(`.${PROMPT_DETAILS_CLASS}`);

  if (existing) {
    return existing;
  }

  const details = document.createElement("ul");
  details.classList.add(PROMPT_DETAILS_CLASS);
  section.append(details);

  return details;
}

function createPromptButton(prompt: RenderableItemUseAutomationPrompt): HTMLButtonElement {
  const button = document.createElement("button");
  button.type = "button";
  button.classList.add(`${PROMPT_CLASS}__button`);
  button.setAttribute(PROMPT_ID_ATTRIBUTE, prompt.pendingId);

  if (prompt.executed) {
    button.disabled = true;
    button.textContent = prompt.executedLabel ?? "✓ Automação aplicada";
    button.classList.add(PROMPT_EXECUTED_BUTTON_CLASS);
    return button;
  }

  button.textContent = prompt.buttonLabel ?? "Aplicar automação";
  button.setAttribute(PENDING_ID_ATTRIBUTE, prompt.pendingId);
  button.setAttribute(EXECUTED_LABEL_ATTRIBUTE, prompt.executedLabel ?? "✓ Automação aplicada");
  return button;
}

function createPromptSummary(context: ItemUseContext): string {
  const source = context.actor?.name ?? context.token?.name ?? "Origem não resolvida";
  const targets = createTargetText(context);
  return `${source} → ${targets}`;
}

function createTargetText(context: ItemUseContext): string {
  return context.targets.length > 0 ? context.targets.map((target) => target.name).join(", ") : "nenhum alvo";
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

function bindRollDetailToggles(html: unknown): void {
  const root = resolveRootElement(html);
  if (!root) return;

  const toggles = root.querySelectorAll<HTMLButtonElement>(ROLL_DETAIL_TOGGLE_SELECTOR);

  for (const toggle of toggles) {
    if (toggle.dataset.paranormalToolkitRollDetailsBound === "true") continue;

    toggle.dataset.paranormalToolkitRollDetailsBound = "true";
    toggle.addEventListener("click", () => {
      toggleRollDetails(root, toggle);
    });
  }
}

function toggleRollDetails(root: HTMLElement, toggle: HTMLButtonElement): void {
  const detailId = toggle.getAttribute(ROLL_DETAIL_TOGGLE_ATTRIBUTE);
  if (!detailId) return;

  const details = root.querySelector<HTMLElement>(`[${ROLL_DETAIL_ID_ATTRIBUTE}="${escapeCssAttributeValue(detailId)}"]`);
  if (!details) return;

  const willOpen = details.hidden;
  details.hidden = !willOpen;
  toggle.setAttribute("aria-expanded", willOpen ? "true" : "false");
  toggle.textContent = willOpen ? "▾ Ocultar detalhes" : "▸ Ver detalhes";
}

async function handleButtonClick(button: HTMLButtonElement, handler: ItemUseAutomationPromptHandler): Promise<void> {
  const pendingId = button.getAttribute(PENDING_ID_ATTRIBUTE);

  if (!pendingId) return;

  button.disabled = true;
  const originalText = button.textContent;
  button.textContent = "Aplicando...";

  const executed = await handler(pendingId);

  if (executed) {
    button.textContent = button.getAttribute(EXECUTED_LABEL_ATTRIBUTE) ?? "✓ Automação aplicada";
    button.classList.add(PROMPT_EXECUTED_BUTTON_CLASS);
    button.removeAttribute(PENDING_ID_ATTRIBUTE);
    button.removeAttribute(EXECUTED_LABEL_ATTRIBUTE);
    return;
  }

  button.disabled = false;
  button.textContent = originalText;
}

function createRollCard(summaryLines: string[], prompt: RenderableItemUseAutomationPrompt): ParsedRollCard | null {
  const rollLine = summaryLines.map(parseRollLine).find(isParsedRollLine);
  if (!rollLine) return null;

  const form = findSummaryValue(summaryLines, "Forma");
  const cost = findSummaryValue(summaryLines, "Custo");
  const diceBreakdown = findSummaryValue(summaryLines, "Dados") ?? findSummaryValue(summaryLines, `Dados (${rollLine.label})`);
  const damageType = findSummaryValue(summaryLines, "Tipo");
  const notes = findSummaryValues(summaryLines, "Observação");
  const details = summaryLines.filter((line) => isExtraDetailLine(line, rollLine));

  return {
    ...rollLine,
    itemName: prompt.itemName ?? prompt.title ?? "Automação assistida",
    form,
    cost,
    diceBreakdown,
    damageType,
    notes,
    details
  };
}

function parseRollLine(line: string): ParsedRollLine | null {
  const match = /^(Cura|Dano|Ataque|Resistência|Ritual|Perícia|Rolagem):\s*(.+?)\s*=\s*(-?\d+)/u.exec(line.trim());
  if (!match) return null;

  const [, label, formula, totalText] = match;
  const total = Number(totalText);

  if (!Number.isFinite(total)) return null;

  return {
    label,
    formula,
    total,
    intent: getRollIntent(label)
  };
}

function getRollIntent(label: string): ParsedRollLine["intent"] {
  if (label === "Cura") return "healing";
  if (label === "Dano") return "damage";
  return "generic";
}

function findSummaryValue(summaryLines: string[], key: string): string | null {
  return findSummaryValues(summaryLines, key)[0] ?? null;
}

function findSummaryValues(summaryLines: string[], key: string): string[] {
  const prefix = `${key}:`;

  return summaryLines.flatMap((line) => {
    if (!line.startsWith(prefix)) return [];

    const value = line.slice(prefix.length).trim();
    return value.length > 0 ? [value] : [];
  });
}

function isExtraDetailLine(line: string, rollLine: ParsedRollLine): boolean {
  if (line.startsWith("Forma:")) return false;
  if (line.startsWith("Custo:")) return false;
  if (line.startsWith("Dados:")) return false;
  if (line.startsWith(`Dados (${rollLine.label}):`)) return false;
  if (line.startsWith("Tipo:")) return false;
  if (line.startsWith("Observação:")) return false;
  if (parseRollLine(line)) return false;
  return line.trim().length > 0;
}

function findPromptsForMessage(message: unknown, root: HTMLElement): RenderableItemUseAutomationPrompt[] {
  const prompts = new Map<string, RenderableItemUseAutomationPrompt>();

  for (const prompt of pendingPrompts.values()) {
    if (doesPromptMatchMessage(prompt, message, root)) {
      prompts.set(prompt.pendingId, prompt);
    }
  }

  for (const prompt of readPersistedPromptsFromMessage(message)) {
    if (doesPromptMatchMessage(prompt, message, root) && !prompts.has(prompt.pendingId)) {
      prompts.set(prompt.pendingId, prompt);
    }
  }

  return Array.from(prompts.values()).sort((left, right) => left.createdAt - right.createdAt);
}

function doesPromptMatchMessage(prompt: RenderableItemUseAutomationPrompt, message: unknown, root: HTMLElement): boolean {
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

function findRenderedChatMessageByItem(prompt: RenderableItemUseAutomationPrompt): HTMLElement | null {
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

async function persistPromptInChatMessage(prompt: PendingItemUseAutomationPrompt): Promise<void> {
  const message = resolveChatMessageDocument(prompt.context.message);
  if (!message) return;

  try {
    const prompts = readPersistedPromptMap(message);
    prompts[prompt.pendingId] = toPersistedPrompt(prompt);

    await writePersistedPromptMap(message, prompts);
  } catch (cause) {
    console.warn("Paranormal Toolkit: não foi possível persistir ação assistida no chat.", cause);
  }
}

async function markPersistedPromptAsExecuted(prompt: PendingItemUseAutomationPrompt): Promise<void> {
  const message = resolveChatMessageDocument(prompt.context.message);
  if (!message) return;

  try {
    const prompts = readPersistedPromptMap(message);
    const persisted = prompts[prompt.pendingId] ?? toPersistedPrompt(prompt);

    prompts[prompt.pendingId] = {
      ...persisted,
      executed: true
    };

    await writePersistedPromptMap(message, prompts);
  } catch (cause) {
    console.warn("Paranormal Toolkit: não foi possível marcar ação assistida como executada no chat.", cause);
  }
}

function readPersistedPromptsFromMessage(message: unknown): PersistedItemUseAutomationPrompt[] {
  return Object.values(readPersistedPromptMap(asChatMessageFlagDocument(message))).filter(isPersistedPrompt);
}

function readPersistedPromptMap(message: ChatMessageFlagDocument | null): Record<string, PersistedItemUseAutomationPrompt> {
  if (!message) return {};

  const value = message.getFlag?.(MODULE_ID, PROMPT_FLAG_KEY);

  if (!isRecord(value)) {
    return {};
  }

  const prompts: Record<string, PersistedItemUseAutomationPrompt> = {};

  for (const [key, prompt] of Object.entries(value)) {
    if (isPersistedPrompt(prompt)) {
      prompts[key] = prompt;
    }
  }

  return prompts;
}

async function writePersistedPromptMap(
  message: ChatMessageFlagDocument,
  prompts: Record<string, PersistedItemUseAutomationPrompt>
): Promise<void> {
  if (typeof message.setFlag !== "function") return;

  await Promise.resolve(message.setFlag(MODULE_ID, PROMPT_FLAG_KEY, prompts));
}

function toPersistedPrompt(prompt: PendingItemUseAutomationPrompt): PersistedItemUseAutomationPrompt {
  return {
    schemaVersion: 1,
    pendingId: prompt.pendingId,
    mode: prompt.mode,
    title: prompt.title,
    buttonLabel: prompt.buttonLabel,
    executedLabel: prompt.executedLabel,
    summaryLines: prompt.summaryLines ? [...prompt.summaryLines] : undefined,
    createdAt: prompt.createdAt,
    messageId: prompt.messageId,
    itemId: prompt.itemId,
    actorId: prompt.actorId,
    itemName: prompt.itemName,
    summary: prompt.summary,
    executed: prompt.executed
  };
}

function resolveChatMessageDocument(value: unknown): ChatMessageFlagDocument | null {
  const direct = asChatMessageFlagDocument(value);

  if (direct?.setFlag) {
    return direct;
  }

  const id = getDocumentId(value);
  if (!id) return null;

  const messages = game.messages as { get?: (messageId: string) => unknown } | undefined;
  return asChatMessageFlagDocument(messages?.get?.(id));
}

function asChatMessageFlagDocument(value: unknown): ChatMessageFlagDocument | null {
  return value && typeof value === "object" ? (value as ChatMessageFlagDocument) : null;
}

function isPersistedPrompt(value: unknown): value is PersistedItemUseAutomationPrompt {
  if (!isRecord(value)) return false;

  return (
    value.schemaVersion === 1 &&
    typeof value.pendingId === "string" &&
    value.mode === "ask" &&
    typeof value.createdAt === "number" &&
    typeof value.summary === "string" &&
    typeof value.executed === "boolean" &&
    isNullableString(value.messageId) &&
    isNullableString(value.itemId) &&
    isNullableString(value.actorId) &&
    isNullableString(value.itemName) &&
    isOptionalString(value.title) &&
    isOptionalString(value.buttonLabel) &&
    isOptionalString(value.executedLabel) &&
    isOptionalStringArray(value.summaryLines)
  );
}

function isParsedRollLine(value: ParsedRollLine | null): value is ParsedRollLine {
  return value !== null;
}

function isRecord(value: unknown): value is Record<string, unknown> {
  return value !== null && typeof value === "object" && !Array.isArray(value);
}

function isNullableString(value: unknown): value is string | null {
  return value === null || typeof value === "string";
}

function isOptionalString(value: unknown): value is string | undefined {
  return value === undefined || typeof value === "string";
}

function isOptionalStringArray(value: unknown): value is string[] | undefined {
  return value === undefined || (Array.isArray(value) && value.every((entry) => typeof entry === "string"));
}

function isNonEmptyString(value: string | null): value is string {
  return typeof value === "string" && value.length > 0;
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

function createDetailKey(value: string): string {
  return value.trim().toLowerCase();
}

function toKebabCase(value: string): string {
  return value.replace(/[A-Z]/g, (letter) => `-${letter.toLowerCase()}`);
}

function escapeCssAttributeValue(value: string): string {
  return value.replace(/\\/g, "\\\\").replace(/"/g, '\\"');
}
