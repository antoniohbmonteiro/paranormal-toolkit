import { MODULE_ID } from "../../constants";
import type { AutomationExecutionMode } from "./item-use-execution-mode";
import type { ItemUseContext } from "./item-use-context";

const PROMPT_FLAG_KEY = "itemUsePrompts";
const PROMPT_ID_ATTRIBUTE = "data-paranormal-toolkit-prompt-id";
const PENDING_ID_ATTRIBUTE = "data-paranormal-toolkit-pending-id";
const EXECUTED_LABEL_ATTRIBUTE = "data-paranormal-toolkit-executed-label";
const CHOICE_GROUP_ATTRIBUTE = "data-paranormal-toolkit-choice-group";
const SKIPPED_LABEL_ATTRIBUTE = "data-paranormal-toolkit-skipped-label";
const ACTION_SECTION_ATTRIBUTE = "data-paranormal-toolkit-action-section";
const DETAIL_KEY_ATTRIBUTE = "data-paranormal-toolkit-detail-key";
const ROLL_CARD_ATTRIBUTE = "data-paranormal-toolkit-roll-card";
const ROLL_DETAIL_TOGGLE_ATTRIBUTE = "data-paranormal-toolkit-roll-detail-toggle";
const ROLL_DETAIL_ID_ATTRIBUTE = "data-paranormal-toolkit-roll-detail-id";
const RESISTANCE_ROLL_BUTTON_ATTRIBUTE = "data-paranormal-toolkit-resistance-roll-button";
const RESISTANCE_SKILL_ATTRIBUTE = "data-paranormal-toolkit-resistance-skill";
const RESISTANCE_SKILL_LABEL_ATTRIBUTE = "data-paranormal-toolkit-resistance-skill-label";
const RESISTANCE_TARGET_ACTOR_ID_ATTRIBUTE = "data-paranormal-toolkit-resistance-target-actor-id";
const RESISTANCE_ROLL_RESULT_ATTRIBUTE = "data-paranormal-toolkit-resistance-roll-result";
const BUTTON_SELECTOR = `[${PENDING_ID_ATTRIBUTE}]`;
const ROLL_DETAIL_TOGGLE_SELECTOR = `[${ROLL_DETAIL_TOGGLE_ATTRIBUTE}]`;
const RESISTANCE_ROLL_BUTTON_SELECTOR = `[${RESISTANCE_ROLL_BUTTON_ATTRIBUTE}]`;
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
  choiceGroupId?: string | null;
  skippedLabel?: string | null;
  actionSectionId?: string | null;
  actionSectionTitle?: string | null;
  summaryLines?: string[];
};

export type ItemUseAutomationPromptHandler = (pendingId: string) => Promise<boolean>;

type RenderableItemUseAutomationPrompt = {
  pendingId: string;
  mode: Extract<AutomationExecutionMode, "ask">;
  title?: string;
  buttonLabel?: string;
  executedLabel?: string;
  choiceGroupId?: string | null;
  skippedLabel?: string | null;
  actionSectionId?: string | null;
  actionSectionTitle?: string | null;
  summaryLines?: string[];
  createdAt: number;
  messageId: string | null;
  itemId: string | null;
  actorId: string | null;
  itemName: string | null;
  resistanceTargetActorId: string | null;
  resistanceTargetName: string | null;
  resistanceRollResult?: ResistanceRollResultViewModel | null;
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

type ResistanceRollResultViewModel = {
  skill: string;
  skillLabel: string;
  formula: string;
  total: number;
  targetName: string;
  usedFallbackBonus: boolean;
  rolledAt: string;
};

type ParsedRollCard = ParsedRollLine & {
  itemName: string;
  form: string | null;
  cost: string | null;
  diceBreakdown: string | null;
  damageType: string | null;
  resistance: string | null;
  resistanceSkill: string | null;
  resistanceSkillLabel: string | null;
  notes: string[];
  details: string[];
  resistanceRollResult: ResistanceRollResultViewModel | null;
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

export async function unregisterPendingItemUseAutomationPrompt(pendingId: string, executedLabelOverride?: string): Promise<void> {
  const prompt = pendingPrompts.get(pendingId);
  pendingPrompts.delete(pendingId);

  if (!prompt) return;

  await markPersistedPromptAsExecuted(prompt, executedLabelOverride);
}

function createPendingPrompt(input: ItemUseAutomationPromptInput): PendingItemUseAutomationPrompt {
  const messageId = getDocumentId(input.context.message);
  const resistanceTarget = input.context.targets.find((target) => target.actor);

  return {
    ...input,
    createdAt: Date.now(),
    messageId,
    itemId: input.context.item.id ?? null,
    actorId: input.context.actor?.id ?? null,
    itemName: input.context.item.name ?? null,
    resistanceTargetActorId: resistanceTarget?.actor?.id ?? null,
    resistanceTargetName: resistanceTarget?.name ?? resistanceTarget?.actor?.name ?? null,
    resistanceRollResult: null,
    choiceGroupId: input.choiceGroupId ?? null,
    skippedLabel: input.skippedLabel ?? null,
    actionSectionId: input.actionSectionId ?? null,
    actionSectionTitle: input.actionSectionTitle ?? null,
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
  bindResistanceRollButtons(root);
}

function renderPromptIntoExistingChatLog(pendingId: string): void {
  const prompt = pendingPrompts.get(pendingId);
  if (!prompt) return;

  const messageElement = prompt.messageId ? findRenderedChatMessageById(prompt.messageId) : null;

  if (messageElement) {
    appendPromptToRoot(messageElement, prompt);
    bindPromptButtonsIfPossible(messageElement);
    bindRollDetailToggles(messageElement);
    bindResistanceRollButtons(messageElement);
    return;
  }

  if (prompt.messageId) return;

  const matchedElement = findRenderedChatMessageByItem(prompt);

  if (matchedElement) {
    appendPromptToRoot(matchedElement, prompt);
    bindPromptButtonsIfPossible(matchedElement);
    bindRollDetailToggles(matchedElement);
    bindResistanceRollButtons(matchedElement);
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

  const actions = getOrCreateActionsContainer(section, createActionSection(prompt));
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
  appendResistanceHint(article, rollCard, prompt);
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

function appendResistanceHint(article: HTMLElement, rollCard: ParsedRollCard, prompt: RenderableItemUseAutomationPrompt): void {
  if (!rollCard.resistance) return;

  const resistance = document.createElement("div");
  resistance.classList.add(`${PROMPT_CLASS}__resistance`);

  const header = document.createElement("div");
  header.classList.add(`${PROMPT_CLASS}__resistance-header`);

  const title = document.createElement("strong");
  title.textContent = "Resistência";

  const rollButton = createResistanceRollButton(rollCard, prompt);

  header.append(title);
  if (rollButton) header.append(rollButton);

  const description = document.createElement("span");
  description.classList.add(`${PROMPT_CLASS}__resistance-description`);
  description.textContent = rollCard.resistance;

  resistance.append(header, description);

  if (rollCard.resistanceRollResult) {
    resistance.append(createResistanceRollResultLine(rollCard.resistanceRollResult));
  }

  article.append(resistance);
}

function createResistanceRollButton(
  rollCard: ParsedRollCard,
  prompt: RenderableItemUseAutomationPrompt
): HTMLButtonElement | null {
  if (!rollCard.resistanceSkill) return null;

  const button = document.createElement("button");
  button.type = "button";
  button.classList.add(`${PROMPT_CLASS}__resistance-roll-button`);
  button.setAttribute(PROMPT_ID_ATTRIBUTE, prompt.pendingId);
  button.setAttribute(RESISTANCE_ROLL_BUTTON_ATTRIBUTE, "true");
  button.setAttribute(RESISTANCE_SKILL_ATTRIBUTE, rollCard.resistanceSkill);
  button.setAttribute(RESISTANCE_SKILL_LABEL_ATTRIBUTE, rollCard.resistanceSkillLabel ?? rollCard.resistanceSkill);

  if (prompt.resistanceTargetActorId) {
    button.setAttribute(RESISTANCE_TARGET_ACTOR_ID_ATTRIBUTE, prompt.resistanceTargetActorId);
  }

  if (rollCard.resistanceRollResult) {
    button.classList.add(`${PROMPT_CLASS}__resistance-roll-button--rolled`);
    button.setAttribute(RESISTANCE_ROLL_RESULT_ATTRIBUTE, String(rollCard.resistanceRollResult.total));
    button.textContent = String(rollCard.resistanceRollResult.total);
    button.title = `Rolar ${rollCard.resistanceRollResult.skillLabel} novamente`;
    button.setAttribute("aria-label", button.title);
    return button;
  }

  const icon = document.createElement("i");
  icon.classList.add("fa-solid", "fa-dice-d20");
  icon.setAttribute("aria-hidden", "true");

  const fallback = document.createElement("span");
  fallback.classList.add(`${PROMPT_CLASS}__resistance-roll-fallback`);
  fallback.textContent = "d20";

  button.append(icon, fallback);
  button.title = `Rolar ${rollCard.resistanceSkillLabel ?? rollCard.resistanceSkill} do alvo`;
  button.setAttribute("aria-label", button.title);

  return button;
}

function createResistanceRollResultLine(result: ResistanceRollResultViewModel): HTMLElement {
  const line = document.createElement("span");
  line.classList.add(`${PROMPT_CLASS}__resistance-roll-result`);

  const fallbackText = result.usedFallbackBonus ? " · bônus não encontrado" : "";
  line.textContent = `${result.skillLabel}: ${result.formula} = ${result.total}${fallbackText}`;

  return line;
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
  if (rollCard.resistance) rows.push({ label: "Resistência", value: rollCard.resistance });
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

type PromptActionSection = {
  id: string;
  title: string;
};

function getOrCreateActionsContainer(section: HTMLElement, actionSection: PromptActionSection): HTMLElement {
  const selector = `[${ACTION_SECTION_ATTRIBUTE}="${escapeCssAttributeValue(actionSection.id)}"]`;
  const existing = section.querySelector<HTMLElement>(selector);

  if (existing) {
    return existing;
  }

  const actions = document.createElement("div");
  actions.classList.add(PROMPT_ACTIONS_CLASS);
  actions.setAttribute(ACTION_SECTION_ATTRIBUTE, actionSection.id);

  const title = document.createElement("strong");
  title.classList.add(`${PROMPT_CLASS}__actions-title`);
  title.textContent = actionSection.title;
  actions.append(title);

  section.append(actions);

  return actions;
}

function createActionSection(prompt: RenderableItemUseAutomationPrompt): PromptActionSection {
  const explicitId = prompt.actionSectionId?.trim();
  const explicitTitle = prompt.actionSectionTitle?.trim();

  if (explicitId && explicitTitle) {
    return { id: explicitId, title: explicitTitle };
  }

  const rollCard = createRollCard(prompt.summaryLines ?? [], prompt);

  if (rollCard?.intent === "damage") {
    return { id: "apply-damage", title: "Aplicar danos" };
  }

  if (rollCard?.intent === "healing") {
    return { id: "apply-healing", title: "Aplicar cura" };
  }

  return { id: "actions", title: "Ações" };
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

  if (prompt.choiceGroupId) {
    button.setAttribute(CHOICE_GROUP_ATTRIBUTE, prompt.choiceGroupId);
    button.setAttribute(SKIPPED_LABEL_ATTRIBUTE, prompt.skippedLabel ?? "✓ Outra opção escolhida");
  }

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

function bindResistanceRollButtons(html: unknown): void {
  const root = resolveRootElement(html);
  if (!root) return;

  const buttons = root.querySelectorAll<HTMLButtonElement>(RESISTANCE_ROLL_BUTTON_SELECTOR);

  for (const button of buttons) {
    if (button.dataset.paranormalToolkitResistanceRollBound === "true") continue;

    button.dataset.paranormalToolkitResistanceRollBound = "true";
    button.addEventListener("click", () => {
      void handleResistanceRollClick(root, button);
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

async function handleResistanceRollClick(root: HTMLElement, button: HTMLButtonElement): Promise<void> {
  const promptId = button.getAttribute(PROMPT_ID_ATTRIBUTE);
  const skill = button.getAttribute(RESISTANCE_SKILL_ATTRIBUTE);
  const skillLabel = button.getAttribute(RESISTANCE_SKILL_LABEL_ATTRIBUTE) ?? (skill ? getResistanceSkillLabel(skill) : "Resistência");

  if (!promptId || !skill) return;

  const prompt = resolveRenderablePromptForButton(root, promptId);
  const actor = resolveResistanceTargetActor(prompt, button);

  if (!actor) {
    ui.notifications?.warn("Paranormal Toolkit: não consegui encontrar o alvo para rolar a resistência.");
    return;
  }

  button.disabled = true;
  const originalContent = button.innerHTML;
  button.textContent = "...";

  try {
    const rollPlan = createResistanceRollPlan(actor, skill, skillLabel);
    const roll = new Roll(rollPlan.formula);
    await Promise.resolve(roll.evaluate());
    await showDiceAnimationIfAvailable(roll);

    const total = typeof roll.total === "number" && Number.isFinite(roll.total) ? Math.trunc(roll.total) : 0;
    const result: ResistanceRollResultViewModel = {
      skill,
      skillLabel,
      formula: roll.formula,
      total,
      targetName: actor.name ?? prompt?.resistanceTargetName ?? "alvo",
      usedFallbackBonus: rollPlan.usedFallbackBonus,
      rolledAt: new Date().toISOString()
    };

    updateResistanceRollButton(button, result);
    updateResistanceRollResultLine(button, result);
    setPromptResistanceRollResult(promptId, result);
    await persistResistanceRollResult(root, promptId, result);

    if (rollPlan.usedFallbackBonus) {
      ui.notifications?.info(`Paranormal Toolkit: bônus de ${skillLabel} não encontrado; rolando 1d20 puro.`);
    }
  } catch (cause) {
    console.warn("Paranormal Toolkit: não foi possível rolar resistência assistida.", cause);
    ui.notifications?.warn(`Paranormal Toolkit: não foi possível rolar ${skillLabel}.`);
    button.innerHTML = originalContent;
  } finally {
    button.disabled = false;
  }
}

function updateResistanceRollButton(button: HTMLButtonElement, result: ResistanceRollResultViewModel): void {
  button.classList.add(`${PROMPT_CLASS}__resistance-roll-button--rolled`);
  button.setAttribute(RESISTANCE_ROLL_RESULT_ATTRIBUTE, String(result.total));
  button.textContent = String(result.total);
  button.title = `Rolar ${result.skillLabel} novamente`;
  button.setAttribute("aria-label", button.title);
}

function updateResistanceRollResultLine(button: HTMLButtonElement, result: ResistanceRollResultViewModel): void {
  const resistance = button.closest<HTMLElement>(`.${PROMPT_CLASS}__resistance`);
  if (!resistance) return;

  const existing = resistance.querySelector<HTMLElement>(`.${PROMPT_CLASS}__resistance-roll-result`);
  const line = existing ?? createResistanceRollResultLine(result);

  if (existing) {
    const fallbackText = result.usedFallbackBonus ? " · bônus não encontrado" : "";
    existing.textContent = `${result.skillLabel}: ${result.formula} = ${result.total}${fallbackText}`;
    return;
  }

  resistance.append(line);
}

function resolveRenderablePromptForButton(root: HTMLElement, promptId: string): RenderableItemUseAutomationPrompt | null {
  const pending = pendingPrompts.get(promptId);
  if (pending) return pending;

  const message = resolveChatMessageDocumentFromRoot(root);
  return readPersistedPromptMap(message)[promptId] ?? null;
}

function resolveResistanceTargetActor(prompt: RenderableItemUseAutomationPrompt | null, button: HTMLButtonElement): Actor | null {
  const liveContext = (prompt as { context?: ItemUseContext } | null)?.context;
  const liveTarget = liveContext?.targets.find((target) => target.actor)?.actor;

  if (liveTarget) return liveTarget;

  const actorId =
    button.getAttribute(RESISTANCE_TARGET_ACTOR_ID_ATTRIBUTE) ??
    prompt?.resistanceTargetActorId ??
    null;

  if (!actorId) return null;

  const actors = game.actors as { get?: (id: string) => unknown } | undefined;
  const actor = actors?.get?.(actorId);

  return isActorLike(actor) ? actor : null;
}

function isActorLike(value: unknown): value is Actor {
  return Boolean(value && typeof value === "object" && "system" in value);
}

type ResistanceRollPlan = {
  formula: string;
  usedFallbackBonus: boolean;
};

function createResistanceRollPlan(actor: Actor, skill: string, skillLabel: string): ResistanceRollPlan {
  void skillLabel;

  const bonus = resolveResistanceBonus(actor, skill);

  if (bonus === null) {
    return { formula: "1d20", usedFallbackBonus: true };
  }

  return { formula: createD20Formula(bonus), usedFallbackBonus: false };
}

function createD20Formula(bonus: number): string {
  const normalizedBonus = Math.trunc(bonus);

  if (normalizedBonus === 0) return "1d20";

  return normalizedBonus > 0 ? `1d20 + ${normalizedBonus}` : `1d20 - ${Math.abs(normalizedBonus)}`;
}

function resolveResistanceBonus(actor: Actor, skill: string): number | null {
  const system = (actor as { system?: unknown }).system;
  const rollData = getActorRollData(actor);
  const keys = getResistanceSkillPathKeys(skill);

  for (const source of [system, rollData]) {
    if (!source || typeof source !== "object") continue;

    for (const key of keys) {
      const direct = toFiniteNumber(getPropertyByPath(source, key));
      if (direct !== null) return direct;

      for (const suffix of ["total", "value", "bonus", "mod", "modifier", "modificador", "valor"] as const) {
        const nested = toFiniteNumber(getPropertyByPath(source, `${key}.${suffix}`));
        if (nested !== null) return nested;
      }
    }
  }

  return null;
}

function getActorRollData(actor: Actor): unknown {
  const rollDataFactory = (actor as { getRollData?: () => unknown }).getRollData;

  if (typeof rollDataFactory !== "function") return null;

  try {
    return rollDataFactory.call(actor);
  } catch {
    return null;
  }
}

function getResistanceSkillPathKeys(skill: string): string[] {
  const aliases = getResistanceSkillAliases(skill);
  const prefixes = ["skills", "pericias", "perícias", "skill", "pericia", "perícia"];
  const paths = new Set<string>();

  for (const alias of aliases) {
    paths.add(alias);

    for (const prefix of prefixes) {
      paths.add(`${prefix}.${alias}`);
    }
  }

  return Array.from(paths);
}

function getResistanceSkillAliases(skill: string): string[] {
  switch (skill) {
    case "resilience":
      return ["resilience", "fortitude"];
    case "reflexes":
      return ["reflexes", "reflexos"];
    case "will":
      return ["will", "vontade"];
    default:
      return [skill];
  }
}

function getResistanceSkillLabel(skill: string): string {
  switch (skill) {
    case "resilience":
      return "Fortitude";
    case "reflexes":
      return "Reflexos";
    case "will":
      return "Vontade";
    default:
      return skill;
  }
}

function getPropertyByPath(source: unknown, path: string): unknown {
  if (!source || typeof source !== "object") return undefined;

  let current: unknown = source;

  for (const part of path.split(".")) {
    if (!current || typeof current !== "object") return undefined;
    current = (current as Record<string, unknown>)[part];
  }

  return current;
}

function toFiniteNumber(value: unknown): number | null {
  if (typeof value === "number" && Number.isFinite(value)) return value;

  if (typeof value === "string" && value.trim().length > 0) {
    const numeric = Number(value);
    return Number.isFinite(numeric) ? numeric : null;
  }

  return null;
}

async function showDiceAnimationIfAvailable(roll: Roll): Promise<void> {
  const dice3d = (game as { dice3d?: { showForRoll?: (roll: Roll, user: unknown, synchronize?: boolean) => unknown } }).dice3d;

  if (typeof dice3d?.showForRoll !== "function") return;

  await Promise.resolve(dice3d.showForRoll(roll, game.user, true));
}

function setPromptResistanceRollResult(promptId: string, result: ResistanceRollResultViewModel): void {
  const prompt = pendingPrompts.get(promptId);

  if (prompt) {
    prompt.resistanceRollResult = result;
  }
}

async function persistResistanceRollResult(
  root: HTMLElement,
  promptId: string,
  result: ResistanceRollResultViewModel
): Promise<void> {
  const message = resolveChatMessageDocumentFromRoot(root);
  if (!message) return;

  try {
    const prompts = readPersistedPromptMap(message);
    const persisted = prompts[promptId];
    if (!persisted) return;

    prompts[promptId] = {
      ...persisted,
      resistanceRollResult: result
    };

    await writePersistedPromptMap(message, prompts);
  } catch (cause) {
    console.warn("Paranormal Toolkit: não foi possível persistir rolagem de resistência.", cause);
  }
}

function resolveChatMessageDocumentFromRoot(root: HTMLElement): ChatMessageFlagDocument | null {
  const messageElement = root.closest<HTMLElement>("[data-message-id]") ?? root;
  const messageId = messageElement.dataset.messageId ?? null;

  if (!messageId) return null;

  const messages = game.messages as { get?: (messageId: string) => unknown } | undefined;
  return asChatMessageFlagDocument(messages?.get?.(messageId));
}

async function handleButtonClick(button: HTMLButtonElement, handler: ItemUseAutomationPromptHandler): Promise<void> {
  const pendingId = button.getAttribute(PENDING_ID_ATTRIBUTE);

  if (!pendingId) return;

  button.disabled = true;
  const originalText = button.textContent;
  button.textContent = "Aplicando...";

  const executed = await handler(pendingId);

  if (executed) {
    markButtonAsResolved(button, button.getAttribute(EXECUTED_LABEL_ATTRIBUTE) ?? "✓ Automação aplicada");
    markChoiceGroupButtonsAsResolved(button);
    return;
  }

  button.disabled = false;
  button.textContent = originalText;
}

function markButtonAsResolved(button: HTMLButtonElement, label: string): void {
  button.disabled = true;
  button.textContent = label;
  button.classList.add(PROMPT_EXECUTED_BUTTON_CLASS);
  button.removeAttribute(PENDING_ID_ATTRIBUTE);
  button.removeAttribute(EXECUTED_LABEL_ATTRIBUTE);
}

function markChoiceGroupButtonsAsResolved(selectedButton: HTMLButtonElement): void {
  const choiceGroupId = selectedButton.getAttribute(CHOICE_GROUP_ATTRIBUTE);
  if (!choiceGroupId) return;

  const root = selectedButton.closest<HTMLElement>(`.${PROMPT_CLASS}`) ?? selectedButton.parentElement;
  if (!root) return;

  const selector = `[${CHOICE_GROUP_ATTRIBUTE}="${escapeCssAttributeValue(choiceGroupId)}"]`;

  for (const button of root.querySelectorAll<HTMLButtonElement>(selector)) {
    if (button === selectedButton) continue;

    const skippedLabel = button.getAttribute(SKIPPED_LABEL_ATTRIBUTE) ?? "✓ Outra opção escolhida";
    markButtonAsResolved(button, skippedLabel);
  }
}

function createRollCard(summaryLines: string[], prompt: RenderableItemUseAutomationPrompt): ParsedRollCard | null {
  const rollLine = summaryLines.map(parseRollLine).find(isParsedRollLine);
  if (!rollLine) return null;

  const form = findSummaryValue(summaryLines, "Forma");
  const cost = findSummaryValue(summaryLines, "Custo");
  const diceBreakdown = findSummaryValue(summaryLines, "Dados") ?? findSummaryValue(summaryLines, `Dados (${rollLine.label})`);
  const damageType = findSummaryValue(summaryLines, "Tipo");
  const resistance = findSummaryValue(summaryLines, "Resistência");
  const resistanceSkill = findSummaryValue(summaryLines, "Resistência Perícia");
  const resistanceSkillLabel = findSummaryValue(summaryLines, "Resistência Rótulo") ?? (resistanceSkill ? getResistanceSkillLabel(resistanceSkill) : null);
  const notes = findSummaryValues(summaryLines, "Observação");
  const details = summaryLines.filter((line) => isExtraDetailLine(line, rollLine));

  return {
    ...rollLine,
    itemName: prompt.itemName ?? prompt.title ?? "Automação assistida",
    form,
    cost,
    diceBreakdown,
    damageType,
    resistance,
    resistanceSkill,
    resistanceSkillLabel,
    notes,
    details,
    resistanceRollResult: prompt.resistanceRollResult ?? null
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
  if (line.startsWith("Resistência:")) return false;
  if (line.startsWith("Resistência Perícia:")) return false;
  if (line.startsWith("Resistência Rótulo:")) return false;
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

async function markPersistedPromptAsExecuted(prompt: PendingItemUseAutomationPrompt, executedLabelOverride?: string): Promise<void> {
  const message = resolveChatMessageDocument(prompt.context.message);
  if (!message) return;

  try {
    const prompts = readPersistedPromptMap(message);
    const persisted = prompts[prompt.pendingId] ?? toPersistedPrompt(prompt);

    prompts[prompt.pendingId] = {
      ...persisted,
      executedLabel: executedLabelOverride ?? persisted.executedLabel,
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
    resistanceTargetActorId: prompt.resistanceTargetActorId,
    resistanceTargetName: prompt.resistanceTargetName,
    resistanceRollResult: prompt.resistanceRollResult ?? null,
    choiceGroupId: prompt.choiceGroupId ?? null,
    skippedLabel: prompt.skippedLabel ?? null,
    actionSectionId: prompt.actionSectionId ?? null,
    actionSectionTitle: prompt.actionSectionTitle ?? null,
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
    isOptionalNullableString(value.resistanceTargetActorId) &&
    isOptionalNullableString(value.resistanceTargetName) &&
    isOptionalResistanceRollResult(value.resistanceRollResult) &&
    isOptionalString(value.title) &&
    isOptionalString(value.buttonLabel) &&
    isOptionalString(value.executedLabel) &&
    isOptionalNullableString(value.choiceGroupId) &&
    isOptionalNullableString(value.skippedLabel) &&
    isOptionalNullableString(value.actionSectionId) &&
    isOptionalNullableString(value.actionSectionTitle) &&
    isOptionalStringArray(value.summaryLines)
  );
}

function isOptionalResistanceRollResult(value: unknown): value is ResistanceRollResultViewModel | null | undefined {
  if (value === undefined || value === null) return true;
  if (!isRecord(value)) return false;

  return (
    typeof value.skill === "string" &&
    typeof value.skillLabel === "string" &&
    typeof value.formula === "string" &&
    typeof value.total === "number" &&
    Number.isFinite(value.total) &&
    typeof value.targetName === "string" &&
    typeof value.usedFallbackBonus === "boolean" &&
    typeof value.rolledAt === "string"
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

function isOptionalNullableString(value: unknown): value is string | null | undefined {
  return value === undefined || value === null || typeof value === "string";
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
