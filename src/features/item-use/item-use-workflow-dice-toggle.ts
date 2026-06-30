import { MODULE_ID } from "../../constants";

declare const Hooks: {
  on: (event: string, callback: (message: unknown, html: unknown) => void) => void;
  once: (event: string, callback: () => void) => void;
};

const CHAT_CARD_FLAG_KEY = "chatCard";
const PROMPT_ID_ATTRIBUTE = "data-paranormal-toolkit-prompt-id";
const PROMPT_CLASS = `${MODULE_ID}-item-use-prompt`;
const PROMPT_TITLE_SELECTOR = `.${PROMPT_CLASS}__title`;
const PROMPT_HEADER_SELECTOR = `.${PROMPT_CLASS}__header`;
const ROLL_CARD_SELECTOR = `.${PROMPT_CLASS}__roll-card`;
const ROLL_META_SELECTOR = `.${PROMPT_CLASS}__roll-meta`;
const ROLL_META_PILL_SELECTOR = `.${PROMPT_CLASS}__roll-meta-pill`;
const RESISTANCE_SELECTOR = `.${PROMPT_CLASS}__resistance`;
const RESISTANCE_HEADER_SELECTOR = `.${PROMPT_CLASS}__resistance-header`;
const RESISTANCE_DESCRIPTION_SELECTOR = `.${PROMPT_CLASS}__resistance-description`;
const RESISTANCE_ROLL_BUTTON_SELECTOR = `.${PROMPT_CLASS}__resistance-roll-button`;
const RESISTANCE_ROLL_RESULT_SELECTOR = `.${PROMPT_CLASS}__resistance-roll-result`;
const RESISTANCE_CONTENT_CLASS = `${PROMPT_CLASS}__resistance-content`;
const WORKFLOW_SECTION_SELECTOR = `.${PROMPT_CLASS}__workflow-section`;
const WORKFLOW_ROLL_SELECTOR = `.${PROMPT_CLASS}__workflow-roll`;
const WORKFLOW_ROLL_DICE_OPEN_CLASS = `${PROMPT_CLASS}__workflow-roll--dice-open`;
const WORKFLOW_FORMULA_SELECTOR = `.${PROMPT_CLASS}__workflow-roll-formula`;
const WORKFLOW_FORMULA_TOGGLE_CLASS = `${PROMPT_CLASS}__workflow-roll-formula--toggle`;
const WORKFLOW_DICE_TRAY_SELECTOR = `.${PROMPT_CLASS}__workflow-dice-tray`;
const ROLL_DETAIL_TOGGLE_SELECTOR = `.${PROMPT_CLASS}__roll-detail-toggle`;
const ROLL_DETAIL_LIST_SELECTOR = `.${PROMPT_CLASS}__roll-detail-list`;
const RITUAL_BADGE_SELECTOR = `.${PROMPT_CLASS}__ritual-element-badge`;
const RITUAL_META_SELECTOR = `.${PROMPT_CLASS}__ritual-metadata`;
const ENHANCED_ATTRIBUTE = "data-paranormal-toolkit-dice-toggle-enhanced";
const STYLE_ID = `${MODULE_ID}-workflow-dice-toggle-styles`;

const INITIAL_ENHANCEMENT_DELAYS_MS = [0, 100, 500, 1_500, 3_000] as const;

const ELEMENT_TONES = ["blood", "death", "knowledge", "energy", "fear"] as const;
type RitualElementTone = (typeof ELEMENT_TONES)[number];

type CollectionLike<T> = {
  get?: (id: string) => T | undefined;
};

type GameLike = {
  messages?: CollectionLike<ChatMessageLike>;
  actors?: CollectionLike<ActorLike>;
  items?: CollectionLike<ItemLike>;
  i18n?: {
    localize?: (key: string) => string;
  };
};

type ChatMessageLike = {
  getFlag?: (scope: string, key: string) => unknown;
};

type ActorLike = {
  items?: CollectionLike<ItemLike>;
};

type ItemLike = {
  id?: unknown;
  system?: unknown;
};

type PersistedPromptLike = {
  pendingId: string | null;
  actorId: string | null;
  itemId: string | null;
  summaryLines: string[];
};

type RitualMetadataViewModel = {
  elementLabel: string | null;
  elementTone: RitualElementTone | null;
  circle: string | null;
  cost: string | null;
  target: string | null;
  duration: string | null;
  resistance: string | null;
};

let registered = false;
let observer: MutationObserver | null = null;

export function registerItemUseWorkflowDiceToggle(): void {
  if (registered) return;
  registered = true;

  ensureWorkflowDiceToggleStyles();

  Hooks.on("renderChatMessageHTML", (_message: unknown, html: unknown) => {
    enhanceRoot(resolveRootElement(html));
  });

  Hooks.on("renderChatMessage", (_message: unknown, html: unknown) => {
    enhanceRoot(resolveRootElement(html));
  });

  Hooks.once("ready", () => {
    enhanceRoot(document);
    observeRenderedChatCards();
  });

  document.addEventListener("click", handleDocumentClick);
  document.addEventListener("keydown", handleDocumentKeydown);

  for (const delayMs of INITIAL_ENHANCEMENT_DELAYS_MS) {
    globalThis.setTimeout(() => enhanceRoot(document), delayMs);
  }
}

function ensureWorkflowDiceToggleStyles(): void {
  if (document.getElementById(STYLE_ID)) return;

  const style = document.createElement("style");
  style.id = STYLE_ID;
  style.textContent = `
.${PROMPT_CLASS}__workflow-section .${PROMPT_CLASS}__roll-detail-toggle,
.${PROMPT_CLASS}__workflow-section .${PROMPT_CLASS}__roll-detail-list {
  display: none !important;
}

.${PROMPT_CLASS}__workflow-roll:not(.${PROMPT_CLASS}__workflow-roll--dice-open) .${PROMPT_CLASS}__workflow-dice-tray,
.${PROMPT_CLASS}__workflow-dice-tray[hidden] {
  display: none !important;
}

.${PROMPT_CLASS}__workflow-roll-formula--toggle {
  width: auto;
  margin: 0;
  gap: 0.34rem;
  cursor: pointer;
  user-select: none;
}

.${PROMPT_CLASS}__workflow-roll-formula--toggle:hover,
.${PROMPT_CLASS}__workflow-roll-formula--toggle:focus {
  border-color: rgba(89, 36, 42, 0.28);
  background: rgba(255, 255, 255, 0.86);
  box-shadow: inset 0 0 0 1px rgba(89, 36, 42, 0.08);
  outline: none;
}

.${PROMPT_CLASS}__workflow-roll-formula--toggle i {
  flex: 0 0 auto;
  margin-left: 0.34rem;
  font-size: 0.62rem;
  opacity: 0.72;
}

.${PROMPT_CLASS}__header .${PROMPT_CLASS}__ritual-element-badge {
  align-self: flex-start;
  width: fit-content;
  margin-top: 1px;
}

.${PROMPT_CLASS}__ritual-element-badge {
  display: inline-flex;
  align-items: center;
  min-height: 1.08rem;
  border: 1px solid rgba(36, 27, 24, 0.14);
  border-radius: 2px;
  padding: 0.06rem 0.3rem 0.07rem;
  background: rgba(74, 64, 54, 0.86);
  color: rgba(255, 255, 255, 0.96);
  font-size: 0.66rem;
  font-weight: 950;
  letter-spacing: 0.025em;
  line-height: 1;
  text-transform: uppercase;
  box-shadow: inset 0 1px 0 rgba(255, 255, 255, 0.16);
}

.${PROMPT_CLASS}__ritual-element-badge--energy {
  border-color: rgba(103, 61, 164, 0.54);
  background: #7b3fc6;
  color: #fff7ff;
}

.${PROMPT_CLASS}__ritual-element-badge--blood {
  border-color: rgba(143, 29, 39, 0.58);
  background: #b72635;
  color: #fff5f5;
}

.${PROMPT_CLASS}__ritual-element-badge--death {
  border-color: rgba(0, 0, 0, 0.62);
  background: #171717;
  color: #f3f0ea;
}

.${PROMPT_CLASS}__ritual-element-badge--knowledge {
  border-color: rgba(149, 119, 0, 0.56);
  background: #c9a900;
  color: #281f00;
}

.${PROMPT_CLASS}__ritual-element-badge--fear {
  border-color: rgba(132, 137, 146, 0.58);
  background: #b8bec7;
  color: #252933;
}

.${PROMPT_CLASS}__header .${PROMPT_CLASS}__ritual-metadata {
  display: flex;
  flex-wrap: wrap;
  align-items: center;
  gap: 0.24rem;
  margin-top: 0.16rem;
}

.${PROMPT_CLASS}__roll-card > .${PROMPT_CLASS}__ritual-metadata {
  display: none !important;
}

.${PROMPT_CLASS}__ritual-metadata-chip {
  display: inline-flex;
  align-items: center;
  max-width: 100%;
  border: 1px solid rgba(66, 47, 34, 0.14);
  border-radius: 999px;
  padding: 0.12rem 0.42rem;
  background: rgba(255, 255, 255, 0.42);
  color: rgba(36, 27, 24, 0.82);
  font-size: 0.72rem;
  font-weight: 800;
  line-height: 1.2;
  overflow-wrap: anywhere;
}


.${PROMPT_CLASS}__resistance {
  display: grid !important;
  grid-template-columns: minmax(0, 1fr) 34px;
  grid-template-areas: "content button";
  align-items: center !important;
  column-gap: 0.62rem;
  row-gap: 0;
  padding: 0.56rem 0.58rem !important;
}

.${PROMPT_CLASS}__resistance-content {
  grid-area: content;
  display: flex;
  min-width: 0;
  flex-direction: column;
  gap: 0.34rem;
}

.${PROMPT_CLASS}__resistance-content .${PROMPT_CLASS}__resistance-header {
  display: block !important;
  width: auto !important;
  min-width: 0;
}

.${PROMPT_CLASS}__resistance-content .${PROMPT_CLASS}__resistance-header strong {
  display: block;
  margin: 0;
  line-height: 1;
}

.${PROMPT_CLASS}__resistance-content .${PROMPT_CLASS}__resistance-description {
  display: block;
  min-width: 0;
  margin: 0;
  line-height: 1.32;
  overflow-wrap: break-word;
}

.${PROMPT_CLASS}__resistance > .${PROMPT_CLASS}__resistance-roll-button {
  grid-area: button;
  justify-self: end;
  align-self: center;
}

.${PROMPT_CLASS}__resistance-content .${PROMPT_CLASS}__resistance-roll-result {
  margin-top: 0;
}
`;

  document.head.append(style);
}

function handleDocumentClick(event: MouseEvent): void {
  const formula = resolveFormulaElement(event.target);
  if (!formula) return;

  const roll = resolveRollElement(formula);
  if (!roll) return;

  event.preventDefault();
  toggleDiceTray(roll, formula);
}

function handleDocumentKeydown(event: KeyboardEvent): void {
  if (event.key !== "Enter" && event.key !== " ") return;

  const formula = resolveFormulaElement(event.target);
  if (!formula) return;

  const roll = resolveRollElement(formula);
  if (!roll) return;

  event.preventDefault();
  toggleDiceTray(roll, formula);
}

function observeRenderedChatCards(): void {
  if (observer || !document.body) return;

  observer = new MutationObserver((mutations) => {
    for (const mutation of mutations) {
      for (const node of Array.from(mutation.addedNodes)) {
        if (node instanceof HTMLElement || node instanceof DocumentFragment) {
          enhanceRoot(node);
        }
      }
    }
  });

  observer.observe(document.body, { childList: true, subtree: true });
}

function enhanceRoot(root: ParentNode | null): void {
  if (!root) return;

  removeWorkflowRollDetails(root);
  enhanceRitualMetadata(root);
  enhanceResistanceLayout(root);

  for (const roll of Array.from(root.querySelectorAll<HTMLElement>(WORKFLOW_ROLL_SELECTOR))) {
    enhanceRoll(roll);
  }
}


function enhanceResistanceLayout(root: ParentNode): void {
  for (const resistance of Array.from(root.querySelectorAll<HTMLElement>(RESISTANCE_SELECTOR))) {
    const header = resistance.querySelector<HTMLElement>(RESISTANCE_HEADER_SELECTOR);
    const description = resistance.querySelector<HTMLElement>(RESISTANCE_DESCRIPTION_SELECTOR);
    const button = resistance.querySelector<HTMLElement>(RESISTANCE_ROLL_BUTTON_SELECTOR);
    const result = resistance.querySelector<HTMLElement>(RESISTANCE_ROLL_RESULT_SELECTOR);

    if (!button || (!header && !description && !result)) continue;

    const content = getOrCreateResistanceContent(resistance, button);

    if (header && header.parentElement !== content) {
      content.append(header);
    }

    if (description && description.parentElement !== content) {
      content.append(description);
    }

    if (result && result.parentElement !== content && !button.contains(result)) {
      content.append(result);
    }

    if (button.parentElement !== resistance) {
      resistance.append(button);
    }
  }
}

function getOrCreateResistanceContent(resistance: HTMLElement, button: HTMLElement): HTMLElement {
  const existing = resistance.querySelector<HTMLElement>(`.${RESISTANCE_CONTENT_CLASS}`);
  if (existing) return existing;

  const content = document.createElement("div");
  content.classList.add(RESISTANCE_CONTENT_CLASS);
  resistance.insertBefore(content, button.parentElement === resistance ? button : resistance.firstChild);
  return content;
}

function removeWorkflowRollDetails(root: ParentNode): void {
  for (const section of Array.from(root.querySelectorAll<HTMLElement>(WORKFLOW_SECTION_SELECTOR))) {
    for (const element of Array.from(section.querySelectorAll<HTMLElement>(`${ROLL_DETAIL_TOGGLE_SELECTOR}, ${ROLL_DETAIL_LIST_SELECTOR}`))) {
      element.remove();
    }
  }
}

function enhanceRitualMetadata(root: ParentNode): void {
  for (const card of Array.from(root.querySelectorAll<HTMLElement>(ROLL_CARD_SELECTOR))) {
    const metadata = createRitualMetadataViewModel(card);

    removeLegacyRollMetadata(card);

    if (!metadata) continue;

    renderRitualElementBadge(card, metadata);
    renderRitualMetadataChips(card, metadata);
  }
}

function removeLegacyRollMetadata(card: HTMLElement): void {
  for (const meta of Array.from(card.querySelectorAll<HTMLElement>(ROLL_META_SELECTOR))) {
    meta.remove();
  }
}

function renderRitualElementBadge(card: HTMLElement, metadata: RitualMetadataViewModel): void {
  const section = card.closest<HTMLElement>(`.${PROMPT_CLASS}`);
  const header = section?.querySelector<HTMLElement>(PROMPT_HEADER_SELECTOR) ?? null;
  const title = header?.querySelector<HTMLElement>(PROMPT_TITLE_SELECTOR) ?? null;
  const host = header ?? card;

  const existing = host.querySelector<HTMLElement>(RITUAL_BADGE_SELECTOR);

  if (!metadata.elementLabel) {
    existing?.remove();
    return;
  }

  const badge = existing ?? document.createElement("span");
  badge.className = createElementBadgeClassName(metadata.elementTone);
  badge.textContent = formatElementBadgeLabel(metadata);

  if (existing) return;

  if (title?.parentElement === host) {
    title.insertAdjacentElement("afterend", badge);
    return;
  }

  host.prepend(badge);
}

function renderRitualMetadataChips(card: HTMLElement, metadata: RitualMetadataViewModel): void {
  const host = resolveRitualMetadataHost(card);
  removeExistingRitualMetadata(card, host);

  const chips = createMetadataChipInputs(metadata);
  if (chips.length === 0) return;

  const container = document.createElement("div");
  container.classList.add(`${PROMPT_CLASS}__ritual-metadata`);

  for (const chip of chips) {
    const element = document.createElement("span");
    element.classList.add(`${PROMPT_CLASS}__ritual-metadata-chip`);
    element.textContent = chip;
    container.append(element);
  }

  if (host) {
    const summary = host.querySelector<HTMLElement>(`.${PROMPT_CLASS}__summary`);

    if (summary?.parentElement === host) {
      summary.insertAdjacentElement("afterend", container);
      return;
    }

    host.append(container);
    return;
  }

  const firstWorkflowSection = card.querySelector<HTMLElement>(WORKFLOW_SECTION_SELECTOR);

  if (firstWorkflowSection) {
    card.insertBefore(container, firstWorkflowSection);
    return;
  }

  card.prepend(container);
}

function resolveRitualMetadataHost(card: HTMLElement): HTMLElement | null {
  const section = card.closest<HTMLElement>(`.${PROMPT_CLASS}`);
  return section?.querySelector<HTMLElement>(PROMPT_HEADER_SELECTOR) ?? null;
}

function removeExistingRitualMetadata(card: HTMLElement, host: HTMLElement | null): void {
  const roots = [card, host].filter((element): element is HTMLElement => element !== null);

  for (const root of roots) {
    for (const existing of Array.from(root.querySelectorAll<HTMLElement>(RITUAL_META_SELECTOR))) {
      existing.remove();
    }
  }
}

function createMetadataChipInputs(metadata: RitualMetadataViewModel): string[] {
  return [
    metadata.cost,
    metadata.target ? `Alvo: ${lowercaseFirst(metadata.target)}` : null,
    metadata.duration ? `Duração: ${lowercaseFirst(metadata.duration)}` : null,
    metadata.resistance ? `Resistência: ${trimTrailingPeriod(metadata.resistance)}` : null
  ].filter(isNonEmptyString);
}

function createRitualMetadataViewModel(card: HTMLElement): RitualMetadataViewModel | null {
  const prompt = findPersistedPromptForCard(card);
  const legacyMeta = readLegacyRollMeta(card);
  const item = prompt ? resolvePromptItem(prompt) : null;
  const system = item?.system ?? null;
  const summaryLines = prompt?.summaryLines ?? [];

  const elementKey = normalizeElementKey(readStringPath(system, "element"));
  const elementLabel =
    localizeChoice("op.elementChoices", elementKey) ??
    normalizeElementLabel(findSummaryValue(summaryLines, "Elemento")) ??
    normalizeElementLabel(legacyMeta.damageType);
  const elementTone = elementKey ?? normalizeElementTone(elementLabel);
  const circle = readStringPath(system, "circle") ?? findSummaryValue(summaryLines, "Círculo");
  const target = formatRitualTarget(system) ?? findSummaryValue(summaryLines, "Alvo");
  const duration = formatLocalizedChoice(system, "duration", "op.durationChoices") ?? findSummaryValue(summaryLines, "Duração");
  const resistance =
    readRenderedResistance(card) ??
    formatRitualResistance(system) ??
    findSummaryValue(summaryLines, "Resistência");
  const cost = findCostText(summaryLines) ?? legacyMeta.cost;

  const metadata: RitualMetadataViewModel = {
    elementLabel,
    elementTone,
    circle,
    cost,
    target,
    duration,
    resistance
  };

  return hasAnyRitualMetadata(metadata) ? metadata : null;
}

function findPersistedPromptForCard(card: HTMLElement): PersistedPromptLike | null {
  const message = resolveChatMessageForCard(card);
  if (!message) return null;

  const flag = message.getFlag?.(MODULE_ID, CHAT_CARD_FLAG_KEY);
  const prompts = readPersistedPrompts(flag);
  if (prompts.length === 0) return null;

  const promptIds = readRenderedPromptIds(card);

  if (promptIds.size > 0) {
    const prompt = prompts.find((candidate) => candidate.pendingId && promptIds.has(candidate.pendingId));
    if (prompt) return prompt;
  }

  return prompts.find((candidate) => candidate.itemId || candidate.summaryLines.length > 0) ?? null;
}

function resolveChatMessageForCard(card: HTMLElement): ChatMessageLike | null {
  const messageRoot = card.closest<HTMLElement>(".chat-message[data-message-id], [data-message-id]");
  const messageId = messageRoot?.dataset.messageId;
  if (!messageId) return null;

  return getGame()?.messages?.get?.(messageId) ?? null;
}

function readRenderedPromptIds(card: HTMLElement): Set<string> {
  const section = card.closest<HTMLElement>(`.${PROMPT_CLASS}`) ?? card;
  const ids = new Set<string>();

  for (const element of Array.from(section.querySelectorAll<HTMLElement>(`[${PROMPT_ID_ATTRIBUTE}]`))) {
    const id = element.getAttribute(PROMPT_ID_ATTRIBUTE)?.trim();
    if (id) ids.add(id);
  }

  return ids;
}

function readPersistedPrompts(value: unknown): PersistedPromptLike[] {
  if (!isRecord(value)) return [];

  const prompts = value.prompts;
  if (!Array.isArray(prompts)) return [];

  return prompts.map(readPersistedPrompt).filter((prompt): prompt is PersistedPromptLike => prompt !== null);
}

function readPersistedPrompt(value: unknown): PersistedPromptLike | null {
  if (!isRecord(value)) return null;

  return {
    pendingId: asStringOrNull(value.pendingId),
    actorId: asStringOrNull(value.actorId),
    itemId: asStringOrNull(value.itemId),
    summaryLines: Array.isArray(value.summaryLines) ? value.summaryLines.filter(isString) : []
  };
}

function resolvePromptItem(prompt: PersistedPromptLike): ItemLike | null {
  if (!prompt.itemId) return null;

  const game = getGame();
  const actor = prompt.actorId ? game?.actors?.get?.(prompt.actorId) : null;
  const actorItem = actor?.items?.get?.(prompt.itemId);
  if (actorItem) return actorItem;

  return game?.items?.get?.(prompt.itemId) ?? null;
}

function readLegacyRollMeta(card: HTMLElement): { cost: string | null; damageType: string | null } {
  let cost: string | null = null;
  let damageType: string | null = null;

  for (const pill of Array.from(card.querySelectorAll<HTMLElement>(ROLL_META_PILL_SELECTOR))) {
    const text = normalizeWhitespace(pill.textContent);
    if (!text) continue;

    const type = readPrefixedValue(text, "Tipo");
    if (type) damageType = type;

    if (!cost && /\b(P[ED]|PE|PD)\b/iu.test(text)) {
      cost = text;
    }
  }

  return { cost, damageType };
}

function readRenderedResistance(card: HTMLElement): string | null {
  const text = normalizeWhitespace(card.querySelector<HTMLElement>(RESISTANCE_DESCRIPTION_SELECTOR)?.textContent);
  return text ? trimTrailingPeriod(text) : null;
}

function findSummaryValue(lines: string[], label: string): string | null {
  const normalizedLabel = normalizeText(label);

  for (const line of lines) {
    const separatorIndex = line.indexOf(":");
    if (separatorIndex < 0) continue;

    const key = normalizeText(line.slice(0, separatorIndex));
    if (key !== normalizedLabel) continue;

    return normalizeWhitespace(line.slice(separatorIndex + 1));
  }

  return null;
}

function findCostText(lines: string[]): string | null {
  const labeledCost = findSummaryValue(lines, "Custo") ?? findSummaryValue(lines, "PE");
  if (labeledCost) return labeledCost;

  return lines.map(normalizeWhitespace).find((line): line is string => typeof line === "string" && /\b(P[ED]|PE|PD)\b/iu.test(line)) ?? null;
}

function formatRitualTarget(system: unknown): string | null {
  const target = readStringPath(system, "target");
  if (!target) return null;

  if (target === "area") {
    return formatRitualArea(system) ?? localizeChoice("op.targetChoices", target) ?? "Área";
  }

  const label = localizeChoice("op.targetChoices", target) ?? titleCase(target);
  const quantity = target === "people" || target === "creatures" ? readStringPath(system, "targetQtd") : null;

  return [quantity, label].filter(isNonEmptyString).join(" ");
}

function formatRitualArea(system: unknown): string | null {
  const name = readStringPath(system, "area.name");
  const size = readStringPath(system, "area.size");
  const type = readStringPath(system, "area.type");
  const nameLabel = name ? localizeChoice("op.areaChoices", name) ?? titleCase(name) : null;
  const typeLabel = type ? localizeChoice("op.areaTypeChoices", type) ?? titleCase(type) : null;

  if (!nameLabel) return null;
  if (!size) return nameLabel;
  if (!typeLabel) return `${nameLabel} ${size}m`;

  return `${nameLabel} ${size}m ${lowercaseFirst(typeLabel)}`;
}

function formatRitualResistance(system: unknown): string | null {
  const skill = readStringPath(system, "skillResis");
  const resistance = readStringPath(system, "resistance");
  if (!skill || !resistance) return null;

  const skillLabel = localizeChoice("op.skill", skill) ?? titleCase(skill);
  const resistanceLabel = formatResistanceMode(resistance);

  return [skillLabel, resistanceLabel].filter(isNonEmptyString).join(" ");
}

function formatResistanceMode(value: string): string {
  switch (value) {
    case "reducesByHalf":
      return "reduz à metade";
    case "nullifies":
      return "anula";
    case "discredits":
      return "desacredita";
    case "partial":
      return "parcial";
    default:
      return localizeChoice("op.resistanceChoices", value) ?? titleCase(value);
  }
}

function formatLocalizedChoice(system: unknown, path: string, localizationPrefix: string): string | null {
  const value = readStringPath(system, path);
  if (!value) return null;

  return localizeChoice(localizationPrefix, value) ?? titleCase(value);
}

function hasAnyRitualMetadata(metadata: RitualMetadataViewModel): boolean {
  return Boolean(
    metadata.elementLabel || metadata.cost || metadata.target || metadata.duration || metadata.resistance
  );
}

function formatElementBadgeLabel(metadata: RitualMetadataViewModel): string {
  const label = metadata.elementLabel?.toLocaleUpperCase("pt-BR") ?? "RITUAL";
  return metadata.circle ? `${label} ${metadata.circle}` : label;
}

function createElementBadgeClassName(tone: RitualElementTone | null): string {
  return [
    `${PROMPT_CLASS}__ritual-element-badge`,
    tone ? `${PROMPT_CLASS}__ritual-element-badge--${tone}` : null
  ].filter(isNonEmptyString).join(" ");
}

function normalizeElementKey(value: string | null): RitualElementTone | null {
  const normalized = normalizeText(value);

  if (normalized === "sangue" || normalized === "blood" || normalized === "blooddamage") return "blood";
  if (normalized === "morte" || normalized === "death" || normalized === "deathdamage") return "death";
  if (normalized === "conhecimento" || normalized === "knowledge" || normalized === "knowledgedamage") return "knowledge";
  if (normalized === "energia" || normalized === "energy" || normalized === "energydamage") return "energy";
  if (normalized === "medo" || normalized === "fear" || normalized === "feardamage") return "fear";

  return null;
}

function normalizeElementLabel(value: string | null): string | null {
  const tone = normalizeElementKey(value);
  if (tone) return localizeChoice("op.elementChoices", tone) ?? titleCase(tone);

  return value ? titleCase(value) : null;
}

function normalizeElementTone(value: string | null): RitualElementTone | null {
  return normalizeElementKey(value);
}

function localizeChoice(prefix: string, value: string | null): string | null {
  if (!value) return null;

  const key = `${prefix}.${value}`;
  const localized = getGame()?.i18n?.localize?.(key);

  if (!localized || localized === key) return null;
  return localized;
}

function enhanceRoll(roll: HTMLElement): void {
  const diceTray = roll.querySelector<HTMLElement>(WORKFLOW_DICE_TRAY_SELECTOR);
  if (!diceTray) return;

  const formula = roll.querySelector<HTMLElement>(WORKFLOW_FORMULA_SELECTOR);
  if (!formula) return;

  if (formula.getAttribute(ENHANCED_ATTRIBUTE) === "true") return;

  formula.setAttribute(ENHANCED_ATTRIBUTE, "true");
  formula.classList.add(WORKFLOW_FORMULA_TOGGLE_CLASS);
  formula.setAttribute("role", "button");
  formula.setAttribute("tabindex", "0");
  formula.setAttribute("aria-expanded", "false");
  formula.title = "Mostrar dados da rolagem";
  formula.setAttribute("aria-label", formula.title);

  diceTray.hidden = true;

  if (!formula.querySelector("i")) {
    const icon = document.createElement("i");
    icon.classList.add("fa-solid", "fa-chevron-down");
    icon.setAttribute("aria-hidden", "true");
    formula.append(icon);
  }
}

function toggleDiceTray(roll: HTMLElement, formula: HTMLElement): void {
  const diceTray = roll.querySelector<HTMLElement>(WORKFLOW_DICE_TRAY_SELECTOR);
  if (!diceTray) return;

  const willOpen = !roll.classList.contains(WORKFLOW_ROLL_DICE_OPEN_CLASS);
  setDiceTrayOpen(roll, formula, diceTray, willOpen);
}

function setDiceTrayOpen(roll: HTMLElement, formula: HTMLElement, diceTray: HTMLElement, isOpen: boolean): void {
  roll.classList.toggle(WORKFLOW_ROLL_DICE_OPEN_CLASS, isOpen);
  diceTray.hidden = !isOpen;
  formula.setAttribute("aria-expanded", isOpen ? "true" : "false");
  formula.title = isOpen ? "Ocultar dados da rolagem" : "Mostrar dados da rolagem";
  formula.setAttribute("aria-label", formula.title);

  const icon = formula.querySelector("i");
  if (!icon) return;

  icon.classList.toggle("fa-chevron-down", !isOpen);
  icon.classList.toggle("fa-chevron-up", isOpen);
}

function resolveFormulaElement(target: EventTarget | null): HTMLElement | null {
  if (!(target instanceof Element)) return null;

  const formula = target.closest<HTMLElement>(WORKFLOW_FORMULA_SELECTOR);
  if (!formula) return null;

  const roll = resolveRollElement(formula);
  if (!roll) return null;

  enhanceRoll(roll);
  return formula.classList.contains(WORKFLOW_FORMULA_TOGGLE_CLASS) ? formula : null;
}

function resolveRollElement(formula: HTMLElement): HTMLElement | null {
  const roll = formula.closest<HTMLElement>(WORKFLOW_ROLL_SELECTOR);
  if (!roll) return null;

  return roll.querySelector(WORKFLOW_DICE_TRAY_SELECTOR) ? roll : null;
}

function readStringPath(source: unknown, path: string): string | null {
  const value = readPath(source, path);
  return asStringOrNull(value);
}

function readPath(source: unknown, path: string): unknown {
  return path.split(".").reduce<unknown>((current, key) => {
    if (!isRecord(current)) return null;
    return current[key];
  }, source);
}

function readPrefixedValue(source: string, label: string): string | null {
  const separatorIndex = source.indexOf(":");
  if (separatorIndex < 0) return null;

  const key = normalizeText(source.slice(0, separatorIndex));
  if (key !== normalizeText(label)) return null;

  return normalizeWhitespace(source.slice(separatorIndex + 1));
}

function getGame(): GameLike | null {
  const value = (globalThis as { game?: unknown }).game;
  return isRecord(value) ? (value as GameLike) : null;
}

function resolveRootElement(value: unknown): ParentNode | null {
  if (value instanceof Document || value instanceof HTMLElement || value instanceof DocumentFragment) {
    return value;
  }

  if (!value || typeof value !== "object") return null;

  const maybeIndexed = value as { 0?: unknown };
  return maybeIndexed[0] instanceof HTMLElement ? maybeIndexed[0] : null;
}

function asStringOrNull(value: unknown): string | null {
  if (typeof value === "string") return normalizeWhitespace(value);
  if (typeof value === "number" && Number.isFinite(value)) return String(value);
  return null;
}

function isRecord(value: unknown): value is Record<string, unknown> {
  return Boolean(value) && typeof value === "object";
}

function isString(value: unknown): value is string {
  return typeof value === "string";
}

function isNonEmptyString(value: string | null | undefined): value is string {
  return typeof value === "string" && value.trim().length > 0;
}

function normalizeWhitespace(value: string | null | undefined): string | null {
  if (!value) return null;

  const normalized = value.replace(/\s+/gu, " ").trim();
  return normalized.length > 0 ? normalized : null;
}

function normalizeText(value: string | null | undefined): string {
  return (value ?? "")
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/gu, "")
    .replace(/[^a-z0-9]+/giu, "")
    .toLowerCase();
}

function lowercaseFirst(value: string): string {
  if (value.length === 0) return value;
  return value[0].toLocaleLowerCase("pt-BR") + value.slice(1);
}

function titleCase(value: string): string {
  return value
    .replace(/([a-z])([A-Z])/gu, "$1 $2")
    .replace(/[_-]+/gu, " ")
    .trim()
    .replace(/\S+/gu, (part) => part[0].toLocaleUpperCase("pt-BR") + part.slice(1).toLocaleLowerCase("pt-BR"));
}

function trimTrailingPeriod(value: string): string {
  return value.replace(/[.。]+$/u, "").trim();
}
