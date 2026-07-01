import { getResistanceSkillLabel, rollOrdemResistance } from "../../../adapters/ordem/ordem-resistance-roll-adapter";
import { PROMPT_CLASS, RESISTANCE_ROLL_BUTTON_SELECTOR } from "./item-use-chat-card-constants";
import { findWorkflowSectionByTitle } from "./item-use-card-dom";
import { readCastingDifficulty } from "./item-use-card-roll-context";
import {
  persistMultiTargetResistanceResult,
  readPersistedMultiTargetResistanceResults,
  type MultiTargetResistanceResult
} from "./item-use-card-multi-target-state";

const RESISTANCE_SKILL_ATTRIBUTE = "data-paranormal-toolkit-resistance-skill";
const RESISTANCE_SKILL_LABEL_ATTRIBUTE = "data-paranormal-toolkit-resistance-skill-label";

const MULTI_TARGET_SECTION_ATTRIBUTE = "data-paranormal-toolkit-multi-target-section";
const MULTI_TARGET_EFFECT_INFO_ATTRIBUTE = "data-paranormal-toolkit-multi-target-effect-info";
const MULTI_TARGET_TOGGLE_ATTRIBUTE = "data-paranormal-toolkit-multi-target-toggle";
const MULTI_TARGET_DETAILS_ATTRIBUTE = "data-paranormal-toolkit-multi-target-details";
const MULTI_TARGET_TARGET_ATTRIBUTE = "data-paranormal-toolkit-multi-target-target";
const MULTI_TARGET_STATE_ATTRIBUTE = "data-paranormal-toolkit-multi-target-state";
const MULTI_TARGET_ROLL_TOTAL_ATTRIBUTE = "data-paranormal-toolkit-multi-target-roll-total";
const MULTI_TARGET_ROLL_FORMULA_ATTRIBUTE = "data-paranormal-toolkit-multi-target-roll-formula";
const MULTI_TARGET_ROLL_DICE_ATTRIBUTE = "data-paranormal-toolkit-multi-target-roll-dice";
const MULTI_TARGET_ROLL_SKILL_ATTRIBUTE = "data-paranormal-toolkit-multi-target-roll-skill";
const MULTI_TARGET_ROLL_SKILL_LABEL_ATTRIBUTE = "data-paranormal-toolkit-multi-target-roll-skill-label";
const MULTI_TARGET_ROLL_TARGET_NAME_ATTRIBUTE = "data-paranormal-toolkit-multi-target-roll-target-name";
const MULTI_TARGET_ROLL_ROLLED_AT_ATTRIBUTE = "data-paranormal-toolkit-multi-target-roll-rolled-at";

const PENDING_STATE = "pending";
const SUCCESS_STATE = "success";
const FAILURE_STATE = "failure";
const ROLLED_STATE = "rolled";

type MultiTargetState = typeof PENDING_STATE | typeof SUCCESS_STATE | typeof FAILURE_STATE | typeof ROLLED_STATE;

export type MultiTargetCardLayoutInput = {
  rollCard: HTMLElement;
  damageSection: HTMLElement | null;
  effectSection: HTMLElement | null;
};

type MultiTargetCardViewModel = {
  rollCard: HTMLElement;
  targets: MultiTargetViewModel[];
  damage: TargetDamageViewModel;
  effect: TargetEffectViewModel | null;
  resistance: TargetResistanceViewModel | null;
};

type MultiTargetViewModel = {
  id: string;
  name: string;
  state: MultiTargetState;
  resistanceResult: MultiTargetResistanceResult | null;
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
  skill: string | null;
  skillLabel: string | null;
  difficulty: number | null;
};

export function enhanceMultiTargetCardLayout(input: MultiTargetCardLayoutInput): boolean {
  const viewModel = createMultiTargetCardViewModel(input);
  if (!viewModel) return false;

  input.rollCard.classList.add(`${PROMPT_CLASS}__roll-card--multi-target`);
  hideSingleTargetSourceSections(input);

  const targetSection = getOrCreateTargetSection(input.rollCard);
  renderTargetSection(targetSection, viewModel);
  placeTargetSection(input.rollCard, targetSection);

  if (viewModel.effect) {
    const effectInfo = getOrCreateEffectInfoSection(input.rollCard);
    renderEffectInfoSection(effectInfo, viewModel.effect);
    placeEffectInfoSection(input.rollCard, effectInfo, targetSection);
  } else {
    findEffectInfoSection(input.rollCard)?.remove();
  }

  return true;
}

function createMultiTargetCardViewModel(input: MultiTargetCardLayoutInput): MultiTargetCardViewModel | null {
  const resistance = createResistanceViewModel(input.rollCard, input.damageSection);
  const resistanceResults = readMultiTargetResistanceResults(input.rollCard);
  const targets: MultiTargetViewModel[] = readTargetNames(input.rollCard).map((name, index) => {
    const id = createTargetId(name, index);
    const resistanceResult = resistanceResults.get(id) ?? null;

    return {
      id,
      name,
      state: resolveTargetState(resistanceResult, resistance?.difficulty ?? null),
      resistanceResult
    };
  });

  if (targets.length <= 1 || !input.damageSection) return null;

  return {
    rollCard: input.rollCard,
    targets,
    damage: createDamageViewModel(input.damageSection),
    effect: createEffectViewModel(input.effectSection),
    resistance
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

function createResistanceViewModel(rollCard: HTMLElement, damageSection: HTMLElement | null): TargetResistanceViewModel | null {
  const description = damageSection?.querySelector<HTMLElement>(`.${PROMPT_CLASS}__resistance-description`)?.textContent?.trim();
  const sourceButton = damageSection?.querySelector<HTMLButtonElement>(RESISTANCE_ROLL_BUTTON_SELECTOR) ?? null;
  const skill = sourceButton?.getAttribute(RESISTANCE_SKILL_ATTRIBUTE) ?? null;
  const skillLabel = sourceButton?.getAttribute(RESISTANCE_SKILL_LABEL_ATTRIBUTE) ?? (skill ? getResistanceSkillLabel(skill) : null);

  if (!description && !skill) return null;

  return {
    description: description ?? "Resistência do alvo.",
    formula: damageSection?.querySelector<HTMLElement>(`.${PROMPT_CLASS}__resistance .${PROMPT_CLASS}__workflow-roll-formula`)?.textContent?.trim() ?? null,
    skill,
    skillLabel,
    difficulty: readCastingDifficulty(rollCard)
  };
}

function readMultiTargetResistanceResults(rollCard: HTMLElement): Map<string, MultiTargetResistanceResult> {
  const results = readPersistedMultiTargetResistanceResults(rollCard);

  for (const [targetId, result] of readRenderedMultiTargetResistanceResults(rollCard)) {
    results.set(targetId, result);
  }

  return results;
}

function readRenderedMultiTargetResistanceResults(rollCard: HTMLElement): Map<string, MultiTargetResistanceResult> {
  const results = new Map<string, MultiTargetResistanceResult>();

  for (const row of rollCard.querySelectorAll<HTMLElement>(`[${MULTI_TARGET_TARGET_ATTRIBUTE}]`)) {
    const targetId = row.getAttribute(MULTI_TARGET_TARGET_ATTRIBUTE);
    const total = parseInteger(row.getAttribute(MULTI_TARGET_ROLL_TOTAL_ATTRIBUTE));
    const formula = row.getAttribute(MULTI_TARGET_ROLL_FORMULA_ATTRIBUTE);
    const skill = row.getAttribute(MULTI_TARGET_ROLL_SKILL_ATTRIBUTE);
    const skillLabel = row.getAttribute(MULTI_TARGET_ROLL_SKILL_LABEL_ATTRIBUTE);
    const targetName = row.getAttribute(MULTI_TARGET_ROLL_TARGET_NAME_ATTRIBUTE);
    const rolledAt = row.getAttribute(MULTI_TARGET_ROLL_ROLLED_AT_ATTRIBUTE);

    if (!targetId || total === null || !formula || !skill || !skillLabel || !targetName || !rolledAt) continue;

    results.set(targetId, {
      targetId,
      targetName,
      skill,
      skillLabel,
      formula,
      total,
      diceBreakdown: row.getAttribute(MULTI_TARGET_ROLL_DICE_ATTRIBUTE),
      rolledAt
    });
  }

  return results;
}

function resolveTargetState(result: MultiTargetResistanceResult | null, difficulty: number | null): MultiTargetState {
  if (!result) return PENDING_STATE;
  if (difficulty === null) return ROLLED_STATE;
  return result.total >= difficulty ? SUCCESS_STATE : FAILURE_STATE;
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
  const failures = targets.filter((target) => target.state === FAILURE_STATE).length;
  const successes = targets.filter((target) => target.state === SUCCESS_STATE).length;
  const pending = targets.filter((target) => target.state === PENDING_STATE).length;
  const rolled = targets.filter((target) => target.state === ROLLED_STATE).length;
  const parts = [`${total} ${total === 1 ? "alvo" : "alvos"}`];

  if (failures > 0) parts.push(`${failures} ${failures === 1 ? "falha" : "falhas"}`);
  if (successes > 0) parts.push(`${successes} ${successes === 1 ? "sucesso" : "sucessos"}`);
  if (pending > 0) parts.push(`${pending} ${pending === 1 ? "pendente" : "pendentes"}`);
  if (rolled > 0) parts.push(`${rolled} ${rolled === 1 ? "rolado" : "rolados"}`);

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
  row.classList.add(`${PROMPT_CLASS}__target-row`, `${PROMPT_CLASS}__target-row--${target.state}`);
  row.setAttribute(MULTI_TARGET_TARGET_ATTRIBUTE, target.id);
  row.setAttribute(MULTI_TARGET_STATE_ATTRIBUTE, target.state);
  row.setAttribute("aria-expanded", expanded ? "true" : "false");
  row.setAttribute("role", "button");
  row.setAttribute("tabindex", "0");
  row.setAttribute("aria-label", `${expanded ? "Fechar" : "Abrir"} detalhes de ${target.name}`);
  setTargetResistanceResultAttributes(row, target.resistanceResult);

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

function setTargetResistanceResultAttributes(row: HTMLElement, result: MultiTargetResistanceResult | null): void {
  if (!result) {
    row.removeAttribute(MULTI_TARGET_ROLL_TOTAL_ATTRIBUTE);
    row.removeAttribute(MULTI_TARGET_ROLL_FORMULA_ATTRIBUTE);
    row.removeAttribute(MULTI_TARGET_ROLL_DICE_ATTRIBUTE);
    row.removeAttribute(MULTI_TARGET_ROLL_SKILL_ATTRIBUTE);
    row.removeAttribute(MULTI_TARGET_ROLL_SKILL_LABEL_ATTRIBUTE);
    row.removeAttribute(MULTI_TARGET_ROLL_TARGET_NAME_ATTRIBUTE);
    row.removeAttribute(MULTI_TARGET_ROLL_ROLLED_AT_ATTRIBUTE);
    return;
  }

  row.setAttribute(MULTI_TARGET_ROLL_TOTAL_ATTRIBUTE, String(result.total));
  row.setAttribute(MULTI_TARGET_ROLL_FORMULA_ATTRIBUTE, result.formula);
  row.setAttribute(MULTI_TARGET_ROLL_SKILL_ATTRIBUTE, result.skill);
  row.setAttribute(MULTI_TARGET_ROLL_SKILL_LABEL_ATTRIBUTE, result.skillLabel);
  row.setAttribute(MULTI_TARGET_ROLL_TARGET_NAME_ATTRIBUTE, result.targetName);
  row.setAttribute(MULTI_TARGET_ROLL_ROLLED_AT_ATTRIBUTE, result.rolledAt);

  if (result.diceBreakdown) {
    row.setAttribute(MULTI_TARGET_ROLL_DICE_ATTRIBUTE, result.diceBreakdown);
  } else {
    row.removeAttribute(MULTI_TARGET_ROLL_DICE_ATTRIBUTE);
  }
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

  const resistance = createResistanceButton(target, viewModel.resistance);
  bindTargetResistanceButton(resistance, row, target, viewModel);
  const toggle = createTargetToggleIndicator(row);

  main.append(avatar, name, resistance, toggle);

  const actions = document.createElement("div");
  actions.classList.add(`${PROMPT_CLASS}__target-summary-actions`);
  actions.append(
    createTargetDamageActionButton(target, viewModel, "compact"),
    createTargetEffectActionButton(target, viewModel, "compact")
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

function createResistanceButton(target: MultiTargetViewModel, resistance: TargetResistanceViewModel | null): HTMLButtonElement {
  const button = document.createElement("button");
  button.type = "button";
  button.classList.add(`${PROMPT_CLASS}__target-resistance-button`, `${PROMPT_CLASS}__target-resistance-button--${target.state}`);
  button.setAttribute("aria-label", createResistanceButtonAriaLabel(target, resistance));

  if (resistance?.skill) {
    button.setAttribute(RESISTANCE_SKILL_ATTRIBUTE, resistance.skill);
    button.setAttribute(RESISTANCE_SKILL_LABEL_ATTRIBUTE, resistance.skillLabel ?? getResistanceSkillLabel(resistance.skill));
  }

  if (!resistance?.skill) {
    button.disabled = true;
    button.title = "Resistência não configurada";
    button.textContent = "—";
    return button;
  }

  button.title = target.resistanceResult
    ? `Rolar ${resistance.skillLabel ?? resistance.skill} novamente`
    : `Rolar ${resistance.skillLabel ?? resistance.skill} de ${target.name}`;

  if (!target.resistanceResult) {
    const icon = document.createElement("i");
    icon.classList.add("fa-solid", "fa-dice-d20");
    icon.setAttribute("aria-hidden", "true");

    const fallback = document.createElement("span");
    fallback.classList.add(`${PROMPT_CLASS}__target-resistance-fallback`);
    fallback.textContent = "d20";

    button.append(icon, fallback);
    return button;
  }

  const total = document.createElement("span");
  total.classList.add(`${PROMPT_CLASS}__target-resistance-total`);
  total.textContent = String(target.resistanceResult.total);

  const mark = document.createElement("span");
  mark.classList.add(`${PROMPT_CLASS}__target-resistance-mark`);
  mark.setAttribute("aria-hidden", "true");
  mark.textContent = target.state === SUCCESS_STATE ? "✓" : target.state === FAILURE_STATE ? "✕" : "";

  button.append(total, mark);
  return button;
}

function createResistanceButtonAriaLabel(target: MultiTargetViewModel, resistance: TargetResistanceViewModel | null): string {
  const skillLabel = resistance?.skillLabel ?? resistance?.skill ?? "resistência";

  if (!target.resistanceResult) return `Rolar ${skillLabel} de ${target.name}`;

  const outcome = target.state === SUCCESS_STATE ? "sucesso" : target.state === FAILURE_STATE ? "falha" : "resultado";
  return `${skillLabel} de ${target.name}: ${target.resistanceResult.total}, ${outcome}. Rolar novamente`;
}

function bindTargetResistanceButton(
  button: HTMLButtonElement,
  row: HTMLElement,
  target: MultiTargetViewModel,
  viewModel: MultiTargetCardViewModel
): void {
  button.addEventListener("click", (event) => {
    event.stopPropagation();
    void handleTargetResistanceRoll(row, button, target, viewModel);
  });
}

async function handleTargetResistanceRoll(
  row: HTMLElement,
  button: HTMLButtonElement,
  target: MultiTargetViewModel,
  viewModel: MultiTargetCardViewModel
): Promise<void> {
  const resistance = viewModel.resistance;
  const skill = resistance?.skill;
  const skillLabel = resistance?.skillLabel ?? (skill ? getResistanceSkillLabel(skill) : "Resistência");

  if (!skill) {
    ui.notifications?.warn?.("Paranormal Toolkit: este card não tem perícia de resistência configurada.");
    return;
  }

  const actor = resolveTargetActorByName(target.name);
  if (!actor) {
    ui.notifications?.warn?.(`Paranormal Toolkit: não consegui encontrar o alvo ${target.name} para rolar resistência.`);
    return;
  }

  button.disabled = true;
  button.classList.add(`${PROMPT_CLASS}__target-resistance-button--rolling`);
  const originalContent = button.innerHTML;
  button.textContent = "...";

  try {
    const resistanceRoll = await rollOrdemResistance(actor, skill);
    await showDiceAnimationIfAvailable(resistanceRoll.roll);

    const result: MultiTargetResistanceResult = {
      targetId: target.id,
      targetName: actor.name ?? target.name,
      skill,
      skillLabel,
      formula: resistanceRoll.formula,
      total: resistanceRoll.total,
      diceBreakdown: resistanceRoll.diceBreakdown,
      rolledAt: new Date().toISOString()
    };

    setTargetResistanceResultAttributes(row, result);

    try {
      await persistMultiTargetResistanceResult(viewModel.rollCard, result);
    } catch (cause) {
      console.warn("Paranormal Toolkit: não foi possível persistir resistência multi-target.", cause);
    }

    refreshTargetSection(row);
  } catch (cause) {
    console.warn("Paranormal Toolkit: não foi possível rolar resistência multi-target.", cause);
    ui.notifications?.warn?.(`Paranormal Toolkit: não foi possível rolar ${skillLabel} de ${target.name}.`);
    button.innerHTML = originalContent;
  } finally {
    button.disabled = false;
    button.classList.remove(`${PROMPT_CLASS}__target-resistance-button--rolling`);
  }
}

function refreshTargetSection(row: HTMLElement): void {
  const targetSection = row.closest<HTMLElement>(`[${MULTI_TARGET_SECTION_ATTRIBUTE}="true"]`);
  const rollCard = row.closest<HTMLElement>(`.${PROMPT_CLASS}__roll-card`);
  if (!targetSection || !rollCard) return;

  const viewModel = createMultiTargetCardViewModel({
    rollCard,
    damageSection: findWorkflowSectionByTitle(rollCard, "Dano"),
    effectSection: findMultiTargetEffectSourceSection(rollCard)
  });

  if (!viewModel) return;
  renderTargetSection(targetSection, viewModel);
}

function findMultiTargetEffectSourceSection(rollCard: HTMLElement): HTMLElement | null {
  return rollCard.querySelector<HTMLElement>(`.${PROMPT_CLASS}__workflow-section--multi-target-effect-source`);
}

function createTargetDamageActionButton(
  target: MultiTargetViewModel,
  viewModel: MultiTargetCardViewModel,
  density: "compact" | "full"
): HTMLButtonElement {
  const shouldUseHalfDamage = target.state === SUCCESS_STATE && viewModel.damage.halfLabel && viewModel.damage.halfCompactLabel;
  const label = shouldUseHalfDamage
    ? density === "full" ? viewModel.damage.halfLabel ?? "Metade: —" : viewModel.damage.halfCompactLabel ?? "½ —"
    : density === "full" ? viewModel.damage.normalLabel : viewModel.damage.normalCompactLabel;
  const icon = shouldUseHalfDamage ? "🛡" : "⚡";
  const stateClass = shouldUseHalfDamage ? `${PROMPT_CLASS}__target-action--half-damage` : `${PROMPT_CLASS}__target-action--normal-damage`;

  return createTargetActionButton(icon, label, `${PROMPT_CLASS}__target-action--damage`, stateClass);
}

function createTargetEffectActionButton(
  target: MultiTargetViewModel,
  viewModel: MultiTargetCardViewModel,
  density: "compact" | "full"
): HTMLButtonElement {
  if (!viewModel.effect) {
    return createTargetActionButton("✦", "Sem efeito", `${PROMPT_CLASS}__target-action--effect`, `${PROMPT_CLASS}__target-action--disabled`);
  }

  if (target.state === SUCCESS_STATE) {
    return createTargetActionButton(
      "✓",
      density === "full" ? "Resistiu ao efeito" : "Resistiu",
      `${PROMPT_CLASS}__target-action--effect`,
      `${PROMPT_CLASS}__target-action--resisted`
    );
  }

  return createTargetActionButton(
    "✦",
    density === "full" ? "Aplicar efeito" : "Efeito",
    `${PROMPT_CLASS}__target-action--effect`,
    `${PROMPT_CLASS}__target-action--pending-effect`
  );
}

function createTargetActionButton(iconText: string, labelText: string, ...stateClasses: string[]): HTMLButtonElement {
  const button = document.createElement("button");
  button.type = "button";
  button.classList.add(`${PROMPT_CLASS}__target-action`, `${PROMPT_CLASS}__target-action--pending`, ...stateClasses);
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

  const outcome = createTargetOutcomeLine(target, viewModel.resistance);
  if (outcome) resistance.append(outcome);

  const formula = createTargetFormula(createTargetFormulaText(target, viewModel.resistance));
  const actions = createTargetDetailsActions(target, viewModel);

  details.append(resistance, formula, actions);
  details.setAttribute("aria-label", `Detalhes de ${target.name}`);
  return details;
}

function createTargetOutcomeLine(target: MultiTargetViewModel, resistance: TargetResistanceViewModel | null): HTMLElement | null {
  if (!target.resistanceResult) return null;

  const line = document.createElement("span");
  line.classList.add(`${PROMPT_CLASS}__target-resistance-outcome`);

  if (resistance?.difficulty === null || resistance?.difficulty === undefined) {
    line.textContent = `${target.resistanceResult.skillLabel}: ${target.resistanceResult.total}`;
    return line;
  }

  const status = target.state === SUCCESS_STATE ? "sucesso" : "falha";
  line.textContent = `${target.resistanceResult.skillLabel}: ${target.resistanceResult.total} vs DT ${resistance.difficulty} — ${status}`;
  return line;
}

function createTargetFormulaText(target: MultiTargetViewModel, resistance: TargetResistanceViewModel | null): string {
  if (target.resistanceResult) {
    const diceBreakdown = target.resistanceResult.diceBreakdown ? ` ${target.resistanceResult.diceBreakdown}` : "";
    return `${target.resistanceResult.formula}${diceBreakdown} = ${target.resistanceResult.total}`;
  }

  if (resistance?.skillLabel) return `Clique no d20 para rolar ${resistance.skillLabel}`;
  return resistance?.formula ?? "—";
}

function createTargetFormula(formulaText: string): HTMLElement {
  const formula = document.createElement("div");
  formula.classList.add(`${PROMPT_CLASS}__target-formula`);

  const text = document.createElement("span");
  text.textContent = formulaText;

  const icon = document.createElement("i");
  icon.classList.add("fa-solid", "fa-dice-d20");
  icon.setAttribute("aria-hidden", "true");

  formula.append(text, icon);
  return formula;
}

function createTargetDetailsActions(target: MultiTargetViewModel, viewModel: MultiTargetCardViewModel): HTMLElement {
  const actions = document.createElement("div");
  actions.classList.add(`${PROMPT_CLASS}__target-details-actions`);
  actions.append(
    createTargetDamageActionButton(target, viewModel, "full"),
    createTargetEffectActionButton(target, viewModel, "full")
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

function resolveTargetActorByName(targetName: string): Actor | null {
  const normalizedTargetName = normalizeLookupName(targetName);
  if (!normalizedTargetName) return null;

  const tokenActor = getCanvasTokens()
    .filter((token) => normalizeLookupName(getTokenName(token)) === normalizedTargetName)
    .map((token) => resolveTokenActor(token))
    .find(isActorLike) ?? null;

  if (tokenActor) return tokenActor;

  const actors = game.actors as { find?: (predicate: (actor: unknown) => boolean) => unknown } | undefined;
  const actor = actors?.find?.((candidate) => isActorLike(candidate) && normalizeLookupName(candidate.name) === normalizedTargetName);

  return isActorLike(actor) ? actor : null;
}

function getCanvasTokens(): unknown[] {
  const foundryCanvas = (globalThis as { canvas?: { tokens?: { placeables?: unknown[] } } }).canvas;
  const placeables = foundryCanvas?.tokens?.placeables;
  return Array.isArray(placeables) ? placeables : [];
}

function getTokenName(token: unknown): string | null {
  if (!token || typeof token !== "object") return null;

  const directName = (token as { name?: unknown }).name;
  if (typeof directName === "string") return directName;

  const documentName = (token as { document?: { name?: unknown } }).document?.name;
  if (typeof documentName === "string") return documentName;

  const actor = resolveTokenActor(token);
  return actor?.name ?? null;
}

function resolveTokenActor(value: unknown): Actor | null {
  if (!value || typeof value !== "object") return null;

  const actor = (value as { actor?: unknown }).actor;
  if (isActorLike(actor)) return actor;

  const documentActor = (value as { document?: { actor?: unknown } }).document?.actor;
  return isActorLike(documentActor) ? documentActor : null;
}

function isActorLike(value: unknown): value is Actor {
  return Boolean(value && typeof value === "object" && "system" in value);
}

function normalizeLookupName(value: string | null | undefined): string | null {
  const normalized = value?.trim().toLocaleLowerCase();
  return normalized && normalized.length > 0 ? normalized : null;
}

async function showDiceAnimationIfAvailable(roll: Roll): Promise<void> {
  const dice3d = (game as { dice3d?: { showForRoll?: (roll: Roll, user: unknown, synchronize?: boolean) => unknown } }).dice3d;

  if (typeof dice3d?.showForRoll !== "function") return;

  await Promise.resolve(dice3d.showForRoll(roll, game.user, true));
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

function parseInteger(value: string | null | undefined): number | null {
  if (!value) return null;
  const parsed = Number(value);
  return Number.isFinite(parsed) ? Math.trunc(parsed) : null;
}
