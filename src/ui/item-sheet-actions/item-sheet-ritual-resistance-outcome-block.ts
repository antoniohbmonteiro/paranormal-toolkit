import { MODULE_ID } from "../../constants";
import { ModuleLogger } from "../../core/module-logger";
import {
  createDefaultRitualResistanceOutcomesConfig,
  getRitualResistanceOutcomesConfigForEditing,
  hasConfiguredRitualResistanceOutcomes,
  normalizeRitualResistanceOutcomesConfig,
  RITUAL_RESISTANCE_OUTCOME_CONFIG_FLAG_KEY,
  type RitualResistanceOutcomesConfig,
} from "../../features/rituals/config/ritual-resistance-outcome-config";
import {
  createDefaultRitualRollConfig,
  createResistanceFromRitualItem,
  normalizeRitualRollConfig,
  RITUAL_ROLL_CONFIG_FLAG_KEY,
  type RitualRollConfig,
  type RitualRollIntent,
} from "../../features/rituals/config/ritual-roll-config";
import {
  applyRitualResistanceOutcomeEditor,
  collectRitualResistanceOutcomeEditor,
  createRitualResistanceOutcomeEditor,
} from "./ritual-resistance-outcome-editor";

const BLOCK_ATTRIBUTE =
  "data-paranormal-toolkit-ritual-resistance-outcomes";
const FORMULA_SECTION_TITLE_ATTRIBUTE =
  "data-paranormal-toolkit-ritual-roll-section-title";
const FORMULA_FIELD_ATTRIBUTE =
  "data-paranormal-toolkit-ritual-roll-field";
const FORMULA_ACTION_ATTRIBUTE =
  "data-paranormal-toolkit-ritual-roll-action";
const UNIFIED_ACTIONS_BOUND_ATTRIBUTE =
  "data-paranormal-toolkit-ritual-unified-actions-bound";
const REGISTERED_FLAG =
  `__${MODULE_ID}_ritualResistanceOutcomeBlockRegistered`;

const RENDER_HOOKS = [
  "renderOrdemItemSheet",
  "renderItemSheet",
  "renderItemSheetV2",
  "renderDocumentSheetV2",
  "renderApplicationV2",
] as const;

type ItemSheetLike = {
  item?: Item;
  document?: unknown;
};

type UpdatableItem = Item & {
  update(changes: Record<string, unknown>): Promise<unknown>;
};

export function registerItemSheetRitualResistanceOutcomeBlock(): void {
  const globalObject = globalThis as typeof globalThis & Record<string, unknown>;
  if (globalObject[REGISTERED_FLAG]) return;

  for (const hookName of RENDER_HOOKS) {
    Hooks.on(hookName, (...args: unknown[]) => {
      renderRitualResistanceOutcomeBlock(
        args[0] as ItemSheetLike,
        args[1],
      );
    });
  }

  globalObject[REGISTERED_FLAG] = true;
  ModuleLogger.info(
    "Seção de efeitos por resistência registrada na configuração genérica de ritual.",
  );
}

function renderRitualResistanceOutcomeBlock(
  sheet: ItemSheetLike,
  html: unknown,
): void {
  const item = getSheetItem(sheet);
  if (!item || item.type !== "ritual") return;

  const root = resolveRootElement(html);
  if (!root) return;

  const ritualTab = root.querySelector<HTMLElement>(
    'section[data-tab="ritualAttr"]',
  );
  if (!ritualTab) return;

  const formulaBlock = ritualTab.querySelector<HTMLElement>(
    "[data-paranormal-toolkit-ritual-roll-config]",
  );
  if (!formulaBlock) return;

  removeExistingSection(formulaBlock);
  prepareUnifiedFormulaBlock(formulaBlock);

  const config = getRitualResistanceOutcomesConfigForEditing(item);
  const editable = canEdit(item);
  const resistance = createResistanceFromRitualItem(item);
  const section = createSection(
    config,
    editable,
    resistance?.summary ?? null,
  );

  insertSection(formulaBlock, section);
  wireUnifiedActions(formulaBlock, item, editable);
  updateUnifiedBadge(formulaBlock, config);
}

function prepareUnifiedFormulaBlock(formulaBlock: HTMLElement): void {
  const title = formulaBlock.querySelector<HTMLElement>(
    `.${MODULE_ID}-ritual-roll-config__title span`,
  );
  if (title) title.textContent = "Configuração genérica do ritual";

  const hint = formulaBlock.querySelector<HTMLElement>(
    `.${MODULE_ID}-ritual-roll-config__hint`,
  );
  if (hint) {
    hint.textContent =
      "Configure as rolagens e os efeitos de resistência usados pelo Toolkit quando este ritual não tiver um preset específico. Círculo, resistência, alvo e duração continuam vindo da ficha original.";
  }

  const fields = formulaBlock.querySelector<HTMLElement>(
    `.${MODULE_ID}-ritual-roll-config__fields`,
  );
  if (!fields) return;

  formulaBlock
    .querySelector<HTMLElement>(`[${FORMULA_SECTION_TITLE_ATTRIBUTE}]`)
    ?.remove();

  const sectionTitle = document.createElement("strong");
  sectionTitle.classList.add(
    `${MODULE_ID}-ritual-resistance-outcomes__formula-title`,
  );
  sectionTitle.setAttribute(FORMULA_SECTION_TITLE_ATTRIBUTE, "true");
  sectionTitle.textContent = "Fórmula de rolagem";
  fields.insertAdjacentElement("beforebegin", sectionTitle);
}

function insertSection(
  formulaBlock: HTMLElement,
  section: HTMLElement,
): void {
  const actions = formulaBlock.querySelector<HTMLElement>(
    `.${MODULE_ID}-ritual-roll-config__actions`,
  );

  if (actions) {
    actions.insertAdjacentElement("beforebegin", section);
    return;
  }

  formulaBlock.append(section);
}

function removeExistingSection(root: HTMLElement): void {
  for (const existing of Array.from(
    root.querySelectorAll<HTMLElement>(`[${BLOCK_ATTRIBUTE}]`),
  )) {
    existing.remove();
  }
}

function createSection(
  config: RitualResistanceOutcomesConfig,
  editable: boolean,
  resistanceSummary: string | null,
): HTMLElement {
  const section = document.createElement("section");
  section.classList.add(`${MODULE_ID}-ritual-resistance-outcomes`);
  section.setAttribute(BLOCK_ATTRIBUTE, "true");

  const title = document.createElement("strong");
  title.classList.add(`${MODULE_ID}-ritual-resistance-outcomes__section-title`);
  title.textContent = "Efeitos da resistência";
  section.append(title);

  const hint = document.createElement("p");
  hint.classList.add(`${MODULE_ID}-ritual-resistance-outcomes__hint`);
  hint.textContent = resistanceSummary
    ? `${resistanceSummary}. Configure quais condições ficam disponíveis em cada resultado.`
    : "Configure uma perícia e um resultado de resistência nos campos do sistema antes de usar estes efeitos.";
  section.append(hint);
  section.append(createRitualResistanceOutcomeEditor(config, editable));

  return section;
}

function wireUnifiedActions(
  formulaBlock: HTMLElement,
  item: Item,
  editable: boolean,
): void {
  const save = formulaBlock.querySelector<HTMLButtonElement>(
    `button[${FORMULA_ACTION_ATTRIBUTE}="save"]`,
  );
  const clear = formulaBlock.querySelector<HTMLButtonElement>(
    `button[${FORMULA_ACTION_ATTRIBUTE}="clear"]`,
  );

  if (save) save.textContent = "Salvar configuração";
  if (clear) clear.textContent = "Limpar configuração";

  if (formulaBlock.hasAttribute(UNIFIED_ACTIONS_BOUND_ATTRIBUTE)) return;
  formulaBlock.setAttribute(UNIFIED_ACTIONS_BOUND_ATTRIBUTE, "true");

  save?.addEventListener(
    "click",
    (event) => {
      event.preventDefault();
      event.stopImmediatePropagation();
      if (!editable) return;

      const outcomeSection = findOutcomeSection(formulaBlock);
      if (!outcomeSection) return;

      void saveUnifiedConfig(formulaBlock, outcomeSection, item, save, clear);
    },
    { capture: true },
  );

  clear?.addEventListener(
    "click",
    (event) => {
      event.preventDefault();
      event.stopImmediatePropagation();
      if (!editable) return;

      const outcomeSection = findOutcomeSection(formulaBlock);
      if (!outcomeSection) return;

      void clearUnifiedConfig(formulaBlock, outcomeSection, item, save, clear);
    },
    { capture: true },
  );
}

function findOutcomeSection(formulaBlock: HTMLElement): HTMLElement | null {
  return formulaBlock.querySelector<HTMLElement>(`[${BLOCK_ATTRIBUTE}]`);
}

async function saveUnifiedConfig(
  formulaBlock: HTMLElement,
  outcomeSection: HTMLElement,
  item: Item,
  saveButton: HTMLButtonElement,
  clearButton: HTMLButtonElement | null,
): Promise<void> {
  setButtonsDisabled(saveButton, clearButton, true);
  setStatus(formulaBlock, "Salvando configuração...");

  try {
    const rollConfig = collectRitualRollConfig(formulaBlock);
    const outcomeConfig = normalizeRitualResistanceOutcomesConfig(
      collectRitualResistanceOutcomeEditor(outcomeSection),
    );

    if (!rollConfig || !outcomeConfig) {
      throw new Error("Configuração genérica do ritual inválida.");
    }

    await asUpdatableItem(item).update({
      [`flags.${MODULE_ID}.${RITUAL_ROLL_CONFIG_FLAG_KEY}`]: rollConfig,
      [`flags.${MODULE_ID}.${RITUAL_RESISTANCE_OUTCOME_CONFIG_FLAG_KEY}`]:
        outcomeConfig,
    });

    applyRitualRollConfig(formulaBlock, rollConfig);
    applyRitualResistanceOutcomeEditor(
      outcomeSection,
      outcomeConfig,
      true,
    );
    updateUnifiedBadge(formulaBlock, outcomeConfig);
    setStatus(formulaBlock, "Configuração salva.");
    ui.notifications?.info(
      "Paranormal Toolkit: configuração genérica do ritual salva.",
    );
  } catch (cause) {
    console.warn(
      "Paranormal Toolkit: não foi possível salvar a configuração genérica do ritual.",
      cause,
    );
    setStatus(formulaBlock, "Não foi possível salvar a configuração.");
    ui.notifications?.warn(
      "Paranormal Toolkit: não foi possível salvar a configuração genérica do ritual.",
    );
  } finally {
    setButtonsDisabled(saveButton, clearButton, false);
  }
}

async function clearUnifiedConfig(
  formulaBlock: HTMLElement,
  outcomeSection: HTMLElement,
  item: Item,
  saveButton: HTMLButtonElement | null,
  clearButton: HTMLButtonElement,
): Promise<void> {
  setButtonsDisabled(saveButton, clearButton, true);
  setStatus(formulaBlock, "Limpando configuração...");

  try {
    await asUpdatableItem(item).update({
      [`flags.${MODULE_ID}.-=${RITUAL_ROLL_CONFIG_FLAG_KEY}`]: null,
      [`flags.${MODULE_ID}.-=${RITUAL_RESISTANCE_OUTCOME_CONFIG_FLAG_KEY}`]:
        null,
    });

    const rollConfig = createDefaultRitualRollConfig();
    const outcomeConfig = createDefaultRitualResistanceOutcomesConfig();
    applyRitualRollConfig(formulaBlock, rollConfig);
    applyRitualResistanceOutcomeEditor(
      outcomeSection,
      outcomeConfig,
      true,
    );
    updateUnifiedBadge(formulaBlock, outcomeConfig);
    setStatus(formulaBlock, "Configuração removida.");
    ui.notifications?.info(
      "Paranormal Toolkit: configuração genérica do ritual removida.",
    );
  } catch (cause) {
    console.warn(
      "Paranormal Toolkit: não foi possível limpar a configuração genérica do ritual.",
      cause,
    );
    setStatus(formulaBlock, "Não foi possível limpar a configuração.");
    ui.notifications?.warn(
      "Paranormal Toolkit: não foi possível limpar a configuração genérica do ritual.",
    );
  } finally {
    setButtonsDisabled(saveButton, clearButton, false);
  }
}

function collectRitualRollConfig(
  formulaBlock: HTMLElement,
): RitualRollConfig | null {
  const intent = normalizeIntent(
    getFormulaField<HTMLSelectElement>(formulaBlock, "intent")?.value,
  );
  if (!intent) return null;

  return normalizeRitualRollConfig({
    schemaVersion: 1,
    intent,
    damageType: getOptionalFormulaFieldValue(formulaBlock, "damageType"),
    utilityLabel:
      getOptionalFormulaFieldValue(formulaBlock, "utilityLabel") ?? "",
    note: "",
    forms: {
      base: {
        formula: getFormulaFieldValue(formulaBlock, "formula.base"),
      },
      discente: {
        formula: getFormulaFieldValue(formulaBlock, "formula.discente"),
      },
      verdadeiro: {
        formula: getFormulaFieldValue(formulaBlock, "formula.verdadeiro"),
      },
    },
  });
}

function applyRitualRollConfig(
  formulaBlock: HTMLElement,
  config: RitualRollConfig,
): void {
  setFormulaFieldValue(formulaBlock, "intent", config.intent);
  setFormulaFieldValue(
    formulaBlock,
    "damageType",
    config.damageType ?? "",
  );
  setFormulaFieldValue(
    formulaBlock,
    "utilityLabel",
    config.utilityLabel ?? "",
  );
  setFormulaFieldValue(
    formulaBlock,
    "formula.base",
    config.forms.base.formula,
  );
  setFormulaFieldValue(
    formulaBlock,
    "formula.discente",
    config.forms.discente.formula,
  );
  setFormulaFieldValue(
    formulaBlock,
    "formula.verdadeiro",
    config.forms.verdadeiro.formula,
  );

  updateConditionalFormulaRows(formulaBlock, config.intent);
}

function updateConditionalFormulaRows(
  formulaBlock: HTMLElement,
  intent: RitualRollIntent,
): void {
  for (const row of Array.from(
    formulaBlock.querySelectorAll<HTMLElement>(
      '[data-paranormal-toolkit-ritual-roll-damage-row="true"]',
    ),
  )) {
    row.hidden = intent !== "damage";
  }

  for (const row of Array.from(
    formulaBlock.querySelectorAll<HTMLElement>(
      '[data-paranormal-toolkit-ritual-roll-utility-row="true"]',
    ),
  )) {
    row.hidden = intent !== "utility";
  }
}

function updateUnifiedBadge(
  formulaBlock: HTMLElement,
  outcomeConfig: RitualResistanceOutcomesConfig,
): void {
  const badge = formulaBlock.querySelector<HTMLElement>(
    `.${MODULE_ID}-ritual-roll-config__badge`,
  );
  if (!badge) return;

  const rollConfig = collectRitualRollConfig(formulaBlock);
  badge.textContent =
    (rollConfig && hasConfiguredFormula(rollConfig)) ||
    hasConfiguredRitualResistanceOutcomes(outcomeConfig)
      ? "Configurada"
      : "Rascunho";
}

function hasConfiguredFormula(config: RitualRollConfig): boolean {
  return Object.values(config.forms).some(
    (form) => form.formula.trim().length > 0,
  );
}

function getFormulaField<T extends HTMLInputElement | HTMLSelectElement>(
  formulaBlock: HTMLElement,
  field: string,
): T | null {
  return formulaBlock.querySelector<T>(
    `[${FORMULA_FIELD_ATTRIBUTE}="${field}"]`,
  );
}

function getFormulaFieldValue(
  formulaBlock: HTMLElement,
  field: string,
): string {
  return getFormulaField<HTMLInputElement | HTMLSelectElement>(
    formulaBlock,
    field,
  )?.value.trim() ?? "";
}

function getOptionalFormulaFieldValue(
  formulaBlock: HTMLElement,
  field: string,
): string | null {
  const value = getFormulaFieldValue(formulaBlock, field);
  return value.length > 0 ? value : null;
}

function setFormulaFieldValue(
  formulaBlock: HTMLElement,
  field: string,
  value: string,
): void {
  const input = getFormulaField<HTMLInputElement | HTMLSelectElement>(
    formulaBlock,
    field,
  );
  if (input) input.value = value;
}

function normalizeIntent(value: unknown): RitualRollIntent | null {
  return value === "damage" || value === "healing" || value === "utility"
    ? value
    : null;
}

function setButtonsDisabled(
  save: HTMLButtonElement | null,
  clear: HTMLButtonElement | null,
  disabled: boolean,
): void {
  if (save) save.disabled = disabled;
  if (clear) clear.disabled = disabled;
}

function setStatus(formulaBlock: HTMLElement, message: string): void {
  const status = formulaBlock.querySelector<HTMLElement>(
    `.${MODULE_ID}-ritual-roll-config__status`,
  );
  if (status) status.textContent = message;
}

function asUpdatableItem(item: Item): UpdatableItem {
  if (typeof (item as { update?: unknown }).update !== "function") {
    throw new Error("O item não suporta atualização de configuração.");
  }
  return item as UpdatableItem;
}

function getSheetItem(sheet: ItemSheetLike): Item | null {
  if (isItem(sheet.item)) return sheet.item;
  if (isItem(sheet.document)) return sheet.document;
  return null;
}

function canEdit(item: Item): boolean {
  return Boolean(game.user?.isGM || (item as { isOwner?: unknown }).isOwner);
}

function resolveRootElement(html: unknown): HTMLElement | null {
  if (html instanceof HTMLElement) return html;

  if (html && typeof html === "object") {
    const arrayLike = html as { 0?: unknown; element?: unknown };
    if (arrayLike[0] instanceof HTMLElement) return arrayLike[0];
    if (arrayLike.element instanceof HTMLElement) return arrayLike.element;
  }

  return null;
}

function isItem(value: unknown): value is Item {
  return Boolean(
    value &&
      typeof value === "object" &&
      "type" in value &&
      "system" in value &&
      "getFlag" in value &&
      "setFlag" in value,
  );
}
