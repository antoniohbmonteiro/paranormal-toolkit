import { PROMPT_CLASS } from "./item-use-chat-card-constants";
import { findWorkflowSectionByTitle } from "./item-use-card-dom";

const MULTI_TARGET_SECTION_ATTRIBUTE = "data-paranormal-toolkit-multi-target-section";
const MULTI_TARGET_EFFECT_INFO_ATTRIBUTE = "data-paranormal-toolkit-multi-target-effect-info";
const MULTI_TARGET_TOGGLE_ATTRIBUTE = "data-paranormal-toolkit-multi-target-toggle";
const MULTI_TARGET_DETAILS_ATTRIBUTE = "data-paranormal-toolkit-multi-target-details";
const MULTI_TARGET_TARGET_ATTRIBUTE = "data-paranormal-toolkit-multi-target-target";
const MULTI_TARGET_STATE_ATTRIBUTE = "data-paranormal-toolkit-multi-target-state";

const PENDING_STATE = "pending";

export type MultiTargetCardLayoutInput = {
  rollCard: HTMLElement;
  damageSection: HTMLElement | null;
  effectSection: HTMLElement | null;
};

type MultiTargetCardViewModel = {
  targets: MultiTargetViewModel[];
  damage: TargetDamageViewModel;
  effect: TargetEffectViewModel | null;
  resistance: TargetResistanceViewModel | null;
};

type MultiTargetViewModel = {
  id: string;
  name: string;
  state: typeof PENDING_STATE;
};

type TargetDamageViewModel = {
  normalLabel: string;
  normalCompactLabel: string;
  halfLabel: string | null;
  halfCompactLabel: string | null;
};

type TargetEffectViewModel = {
  label: string;
};

type TargetResistanceViewModel = {
  description: string;
  formula: string | null;
};

export function enhanceMultiTargetCardLayout(input: MultiTargetCardLayoutInput): boolean {
  const viewModel = createMultiTargetCardViewModel(input);
  if (!viewModel) return false;

  input.rollCard.classList.add(`${PROMPT_CLASS}__roll-card--multi-target`);
  hideSingleTargetSourceSections(input);

  const targetSection = getOrCreateTargetSection(input.rollCard);
  renderTargetSection(targetSection, viewModel);
  placeTargetSection(input.rollCard, targetSection);

  const effectInfo = viewModel.effect ? getOrCreateEffectInfoSection(input.rollCard) : findEffectInfoSection(input.rollCard);
  if (viewModel.effect) {
    renderEffectInfoSection(effectInfo, viewModel.effect);
    placeEffectInfoSection(input.rollCard, effectInfo, targetSection);
  } else {
    effectInfo?.remove();
  }

  return true;
}

function createMultiTargetCardViewModel(input: MultiTargetCardLayoutInput): MultiTargetCardViewModel | null {
  const targets = readTargetNames(input.rollCard).map((name, index) => ({
    id: createTargetId(name, index),
    name,
    state: PENDING_STATE
  }));

  if (targets.length <= 1 || !input.damageSection) return null;

  return {
    targets,
    damage: createDamageViewModel(input.damageSection),
    effect: createEffectViewModel(input.effectSection),
    resistance: createResistanceViewModel(input.damageSection)
  };
}

function readTargetNames(rollCard: HTMLElement): string[] {
  const prompt = rollCard.closest<HTMLElement>(`.${PROMPT_CLASS}`);
  const summary = prompt?.querySelector<HTMLElement>(`.${PROMPT_CLASS}__summary`)?.textContent ?? "";
  const [, targetText] = summary.split("→");
  if (!targetText) return [];

  return targetText
    .split(",")
    .map((target) => target.trim())
    .filter((target) => target.length > 0 && normalizeText(target) !== "nenhum alvo");
}

function createDamageViewModel(damageSection: HTMLElement | null): TargetDamageViewModel {
  const total = readRollTotal(damageSection);
  const halfAmount = total !== null ? Math.floor(total / 2) : null;

  return {
    normalLabel: total !== null ? `Normal: ${total} PV` : "Normal: —",
    normalCompactLabel: total !== null ? `${total} PV` : "—",
    halfLabel: halfAmount !== null ? `Metade: ${halfAmount} PV` : null,
    halfCompactLabel: halfAmount !== null ? `½ ${halfAmount} PV` : null
  };
}

function createEffectViewModel(effectSection: HTMLElement | null): TargetEffectViewModel | null {
  const label = effectSection?.querySelector<HTMLElement>(`.${PROMPT_CLASS}__effect-section-label`)?.textContent?.trim();
  return label && label.length > 0 ? { label } : null;
}

function createResistanceViewModel(damageSection: HTMLElement | null): TargetResistanceViewModel | null {
  const description = damageSection?.querySelector<HTMLElement>(`.${PROMPT_CLASS}__resistance-description`)?.textContent?.trim();
  if (!description) return null;

  return {
    description,
    formula: damageSection?.querySelector<HTMLElement>(`.${PROMPT_CLASS}__resistance .${PROMPT_CLASS}__workflow-roll-formula`)?.textContent?.trim() ?? null
  };
}

function readRollTotal(section: HTMLElement | null): number | null {
  const totalText = section?.querySelector<HTMLElement>(`.${PROMPT_CLASS}__workflow-roll-total`)?.textContent?.trim();
  if (!totalText) return null;

  const total = Number(totalText.replace(/[^\d-]/gu, ""));
  return Number.isFinite(total) ? Math.trunc(total) : null;
}

function hideSingleTargetSourceSections(input: MultiTargetCardLayoutInput): void {
  input.damageSection?.classList.add(`${PROMPT_CLASS}__workflow-section--multi-target-source`);
  input.effectSection?.classList.add(`${PROMPT_CLASS}__workflow-section--multi-target-effect-source`);
}

function getOrCreateTargetSection(rollCard: HTMLElement): HTMLElement {
  const existing = rollCard.querySelector<HTMLElement>(`[${MULTI_TARGET_SECTION_ATTRIBUTE}="true"]`);
  if (existing) return existing;

  const section = document.createElement("section");
  section.classList.add(
    `${PROMPT_CLASS}__workflow-section`,
    `${PROMPT_CLASS}__workflow-section--targets`
  );
  section.setAttribute(MULTI_TARGET_SECTION_ATTRIBUTE, "true");
  return section;
}

function renderTargetSection(section: HTMLElement, viewModel: MultiTargetCardViewModel): void {
  const expandedTargets = readExpandedTargets(section);
  section.replaceChildren(createTargetSectionHeader(viewModel), createTargetList(viewModel, expandedTargets));
}

function readExpandedTargets(section: HTMLElement): Set<string> {
  return new Set(
    Array.from(section.querySelectorAll<HTMLElement>(`[${MULTI_TARGET_TARGET_ATTRIBUTE}]`))
      .filter((row) => row.getAttribute("aria-expanded") === "true")
      .map((row) => row.getAttribute(MULTI_TARGET_TARGET_ATTRIBUTE))
      .filter(isNonEmptyString)
  );
}

function createTargetSectionHeader(viewModel: MultiTargetCardViewModel): HTMLElement {
  const header = document.createElement("div");
  header.classList.add(`${PROMPT_CLASS}__workflow-section-header`, `${PROMPT_CLASS}__targets-header`);

  const title = document.createElement("strong");
  title.textContent = "Alvos";

  const status = document.createElement("span");
  status.classList.add(`${PROMPT_CLASS}__targets-status`);
  status.textContent = createTargetStatusLabel(viewModel.targets);

  header.append(title, status);
  return header;
}

function createTargetStatusLabel(targets: MultiTargetViewModel[]): string {
  const total = targets.length;
  const pending = targets.filter((target) => target.state === PENDING_STATE).length;
  const parts = [`${total} ${total === 1 ? "alvo" : "alvos"}`];

  if (pending > 0) {
    parts.push(`${pending} ${pending === 1 ? "pendente" : "pendentes"}`);
  }

  return parts.join(" • ");
}

function createTargetList(viewModel: MultiTargetCardViewModel, expandedTargets: Set<string>): HTMLElement {
  const list = document.createElement("div");
  list.classList.add(`${PROMPT_CLASS}__targets-list`);

  for (const target of viewModel.targets) {
    list.append(createTargetRow(target, viewModel, expandedTargets.has(target.id)));
  }

  return list;
}

function createTargetRow(target: MultiTargetViewModel, viewModel: MultiTargetCardViewModel, expanded: boolean): HTMLElement {
  const row = document.createElement("article");
  row.classList.add(`${PROMPT_CLASS}__target-row`, `${PROMPT_CLASS}__target-row--pending`);
  row.setAttribute(MULTI_TARGET_TARGET_ATTRIBUTE, target.id);
  row.setAttribute(MULTI_TARGET_STATE_ATTRIBUTE, target.state);
  row.setAttribute("aria-expanded", expanded ? "true" : "false");
  row.setAttribute("role", "button");
  row.setAttribute("tabindex", "0");
  row.setAttribute("aria-label", `${expanded ? "Fechar" : "Abrir"} detalhes de ${target.name}`);

  const summary = createTargetSummary(target, viewModel, row);
  const details = createTargetDetails(target, viewModel);
  details.hidden = !expanded;

  row.addEventListener("click", (event) => {
    if (isInteractiveTarget(event.target)) return;
    toggleTargetRow(row);
  });

  row.addEventListener("keydown", (event) => {
    if (event.key !== "Enter" && event.key !== " ") return;
    if (isInteractiveTarget(event.target)) return;

    event.preventDefault();
    toggleTargetRow(row);
  });

  row.append(summary, details);
  return row;
}

function createTargetSummary(target: MultiTargetViewModel, viewModel: MultiTargetCardViewModel, row: HTMLElement): HTMLElement {
  const summary = document.createElement("div");
  summary.classList.add(`${PROMPT_CLASS}__target-summary`);

  const main = document.createElement("div");
  main.classList.add(`${PROMPT_CLASS}__target-summary-main`);

  const avatar = createTargetAvatar(target);

  const name = document.createElement("strong");
  name.classList.add(`${PROMPT_CLASS}__target-name`);
  name.textContent = target.name;

  const resistance = createResistanceButton();
  const toggle = createTargetToggleIndicator(row);

  main.append(avatar, name, resistance, toggle);

  const actions = document.createElement("div");
  actions.classList.add(`${PROMPT_CLASS}__target-summary-actions`);
  actions.append(
    createTargetActionButton("⚡", viewModel.damage.normalCompactLabel, `${PROMPT_CLASS}__target-action--damage`),
    createTargetActionButton("✦", "Efeito", `${PROMPT_CLASS}__target-action--effect`)
  );

  summary.append(main, actions);
  return summary;
}

function createTargetAvatar(target: MultiTargetViewModel): HTMLElement {
  const avatar = document.createElement("span");
  avatar.classList.add(`${PROMPT_CLASS}__target-avatar`);
  avatar.setAttribute("aria-hidden", "true");
  avatar.textContent = target.name.trim().charAt(0).toLocaleUpperCase() || "?";
  return avatar;
}

function createResistanceButton(): HTMLButtonElement {
  const button = document.createElement("button");
  button.type = "button";
  button.classList.add(`${PROMPT_CLASS}__target-resistance-button`, `${PROMPT_CLASS}__target-resistance-button--pending`);
  button.setAttribute("aria-label", "Rolar resistência do alvo");
  button.setAttribute("aria-disabled", "true");

  const icon = document.createElement("i");
  icon.classList.add("fa-solid", "fa-dice-d20");
  icon.setAttribute("aria-hidden", "true");

  const fallback = document.createElement("span");
  fallback.classList.add(`${PROMPT_CLASS}__target-resistance-fallback`);
  fallback.textContent = "d20";

  button.append(icon, fallback);
  return button;
}

function createTargetActionButton(iconText: string, labelText: string, stateClass: string): HTMLButtonElement {
  const button = document.createElement("button");
  button.type = "button";
  button.classList.add(`${PROMPT_CLASS}__target-action`, stateClass, `${PROMPT_CLASS}__target-action--pending`);
  button.disabled = true;

  const icon = document.createElement("span");
  icon.classList.add(`${PROMPT_CLASS}__target-action-icon`);
  icon.setAttribute("aria-hidden", "true");
  icon.textContent = iconText;

  const label = document.createElement("span");
  label.classList.add(`${PROMPT_CLASS}__target-action-label`);
  label.textContent = labelText;

  button.append(icon, label);
  return button;
}

function createTargetToggleIndicator(row: HTMLElement): HTMLElement {
  const indicator = document.createElement("span");
  indicator.classList.add(`${PROMPT_CLASS}__target-toggle`);
  indicator.setAttribute(MULTI_TARGET_TOGGLE_ATTRIBUTE, "true");
  indicator.setAttribute("aria-hidden", "true");
  updateToggleIcon(row, indicator);
  return indicator;
}

function toggleTargetRow(row: HTMLElement): void {
  const details = row.querySelector<HTMLElement>(`[${MULTI_TARGET_DETAILS_ATTRIBUTE}="true"]`);
  if (!details) return;

  const willExpand = details.hidden;
  details.hidden = !willExpand;
  row.setAttribute("aria-expanded", willExpand ? "true" : "false");
  row.setAttribute("aria-label", `${willExpand ? "Fechar" : "Abrir"} detalhes do alvo`);

  const indicator = row.querySelector<HTMLElement>(`[${MULTI_TARGET_TOGGLE_ATTRIBUTE}="true"]`);
  if (indicator) updateToggleIcon(row, indicator);
}

function updateToggleIcon(row: HTMLElement, indicator: HTMLElement): void {
  const expanded = row.getAttribute("aria-expanded") === "true";
  indicator.textContent = expanded ? "⌃" : "⌄";
}

function isInteractiveTarget(target: EventTarget | null): boolean {
  return target instanceof HTMLElement && Boolean(target.closest("button, a, input, select, textarea"));
}

function createTargetDetails(target: MultiTargetViewModel, viewModel: MultiTargetCardViewModel): HTMLElement {
  const details = document.createElement("div");
  details.classList.add(`${PROMPT_CLASS}__target-details`);
  details.setAttribute(MULTI_TARGET_DETAILS_ATTRIBUTE, "true");

  const resistance = document.createElement("div");
  resistance.classList.add(`${PROMPT_CLASS}__target-resistance-details`);

  const title = document.createElement("strong");
  title.textContent = "Resistência";

  const description = document.createElement("span");
  description.textContent = viewModel.resistance?.description ?? "Resistência pendente.";

  resistance.append(title, description);

  const formula = createTargetFormula(viewModel.resistance?.formula ?? "—");
  const actions = createTargetDetailsActions(viewModel);

  details.append(resistance, formula, actions);
  details.setAttribute("aria-label", `Detalhes de ${target.name}`);
  return details;
}

function createTargetFormula(formulaText: string): HTMLElement {
  const formula = document.createElement("div");
  formula.classList.add(`${PROMPT_CLASS}__target-formula`);

  const text = document.createElement("span");
  text.textContent = formulaText;

  const icon = document.createElement("i");
  icon.classList.add("fa-solid", "fa-chevron-down");
  icon.setAttribute("aria-hidden", "true");

  formula.append(text, icon);
  return formula;
}

function createTargetDetailsActions(viewModel: MultiTargetCardViewModel): HTMLElement {
  const actions = document.createElement("div");
  actions.classList.add(`${PROMPT_CLASS}__target-details-actions`);
  actions.append(
    createTargetActionButton("⚡", viewModel.damage.normalLabel, `${PROMPT_CLASS}__target-action--damage`),
    createTargetActionButton("✦", "Aplicar efeito", `${PROMPT_CLASS}__target-action--effect`)
  );
  return actions;
}

function placeTargetSection(rollCard: HTMLElement, section: HTMLElement): void {
  const castingSection = findWorkflowSectionByTitle(rollCard, "Conjuração");
  if (!castingSection) {
    rollCard.prepend(section);
    return;
  }

  if (section.parentElement === rollCard && section.previousElementSibling === castingSection) return;
  rollCard.insertBefore(section, castingSection.nextElementSibling);
}

function getOrCreateEffectInfoSection(rollCard: HTMLElement): HTMLElement {
  const existing = findEffectInfoSection(rollCard);
  if (existing) return existing;

  const section = document.createElement("section");
  section.classList.add(
    `${PROMPT_CLASS}__workflow-section`,
    `${PROMPT_CLASS}__workflow-section--effect-info`
  );
  section.setAttribute(MULTI_TARGET_EFFECT_INFO_ATTRIBUTE, "true");
  return section;
}

function findEffectInfoSection(rollCard: HTMLElement): HTMLElement | null {
  return rollCard.querySelector<HTMLElement>(`[${MULTI_TARGET_EFFECT_INFO_ATTRIBUTE}="true"]`);
}

function renderEffectInfoSection(section: HTMLElement, effect: TargetEffectViewModel): void {
  section.replaceChildren();

  const header = document.createElement("div");
  header.classList.add(`${PROMPT_CLASS}__workflow-section-header`);

  const title = document.createElement("strong");
  title.textContent = "Efeito";

  header.append(title);

  const body = document.createElement("div");
  body.classList.add(`${PROMPT_CLASS}__effect-info-body`);

  const label = document.createElement("span");
  label.classList.add(`${PROMPT_CLASS}__effect-info-label`);
  label.textContent = effect.label;

  const hint = document.createElement("span");
  hint.classList.add(`${PROMPT_CLASS}__effect-info-hint`);
  hint.textContent = "Aplicação por alvo";

  body.append(label, hint);
  section.append(header, body);
}

function placeEffectInfoSection(rollCard: HTMLElement, section: HTMLElement, targetSection: HTMLElement): void {
  if (section.parentElement === rollCard && section.previousElementSibling === targetSection) return;
  rollCard.insertBefore(section, targetSection.nextElementSibling);
}

function createTargetId(name: string, index: number): string {
  return `${index}-${normalizeText(name).replace(/[^a-z0-9]+/gu, "-")}`;
}

function normalizeText(value: string | null | undefined): string {
  return value?.trim().toLocaleLowerCase() ?? "";
}

function isNonEmptyString(value: string | null): value is string {
  return typeof value === "string" && value.length > 0;
}
