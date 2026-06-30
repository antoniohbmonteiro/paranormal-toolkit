import { MODULE_ID } from "../../../constants";
import {
  CHAT_CARD_FLAG_KEY,
  PROMPT_CLASS,
  PROMPT_HEADER_SELECTOR,
  PROMPT_ID_ATTRIBUTE,
  PROMPT_TITLE_SELECTOR,
  RESISTANCE_DESCRIPTION_SELECTOR,
  RITUAL_BADGE_SELECTOR,
  RITUAL_META_SELECTOR,
  ROLL_CARD_SELECTOR,
  ROLL_META_PILL_SELECTOR,
  ROLL_META_SELECTOR,
  WORKFLOW_SECTION_SELECTOR,
  type RitualElementTone
} from "./item-use-chat-card-constants";
import {
  asStringOrNull,
  getGame,
  isNonEmptyString,
  isRecord,
  isString,
  lowercaseFirst,
  normalizeText,
  normalizeWhitespace,
  readPrefixedValue,
  readStringPath,
  titleCase,
  trimTrailingPeriod,
  type ChatMessageLike,
  type ItemLike
} from "./item-use-chat-card-dom";

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

export function enhanceRitualMetadata(root: ParentNode): void {
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
  return Boolean(metadata.elementLabel || metadata.cost || metadata.target || metadata.duration || metadata.resistance);
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
