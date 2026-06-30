import { MODULE_ID } from "../../constants";
import { ModuleLogger } from "../../core/module-logger";
import {
  clearRitualRollConfig,
  getRitualRollConfigForEditing,
  getRitualRollIntentLabel,
  type RitualRollConfig,
  type RitualRollFormId,
  type RitualRollIntent,
  writeRitualRollConfig,
} from "../../features/rituals/config/ritual-roll-config";

const BLOCK_ATTRIBUTE = "data-paranormal-toolkit-ritual-roll-config";
const FIELD_ATTRIBUTE = "data-paranormal-toolkit-ritual-roll-field";
const ACTION_ATTRIBUTE = "data-paranormal-toolkit-ritual-roll-action";
const REGISTERED_FLAG = `__${MODULE_ID}_ritualRollConfigBlockRegistered`;

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

type RitualFormAvailability = Record<RitualRollFormId, boolean>;

type DamageTypeOption = {
  value: string;
  label: string;
};

const DAMAGE_TYPE_OPTIONS: DamageTypeOption[] = [
  { value: "cutting", label: "Corte" },
  { value: "impact", label: "Impacto" },
  { value: "piercing", label: "Perfurante" },
  { value: "ballistic", label: "Balístico" },
  { value: "blood", label: "Sangue" },
  { value: "death", label: "Morte" },
  { value: "knowledge", label: "Conhecimento" },
  { value: "energy", label: "Energia" },
  { value: "fear", label: "Medo" },
  { value: "fire", label: "Fogo" },
  { value: "cold", label: "Frio" },
  { value: "electric", label: "Eletricidade" },
  { value: "chemical", label: "Químico" },
  { value: "mental", label: "Mental" },
];

export function registerItemSheetRitualRollConfigBlock(): void {
  const globalObject = globalThis as typeof globalThis & Record<string, unknown>;
  if (globalObject[REGISTERED_FLAG]) return;

  ensureRitualRollConfigStyles();

  for (const hookName of RENDER_HOOKS) {
    Hooks.on(hookName, (...args: unknown[]) => {
      renderRitualRollConfigBlock(args[0] as ItemSheetLike, args[1]);
    });
  }

  globalObject[REGISTERED_FLAG] = true;
  ModuleLogger.info("Bloco de configuração de fórmula de ritual registrado na ficha de item.");
}


function ensureRitualRollConfigStyles(): void {
  const styleId = `${MODULE_ID}-ritual-roll-config-inline-style`;
  if (document.getElementById(styleId)) return;

  const style = document.createElement("style");
  style.id = styleId;
  style.textContent = `
.${MODULE_ID}-ritual-roll-config {
  display: flex;
  flex-direction: column;
  gap: 8px;
  margin-top: 12px;
  border: 1px solid rgba(89, 36, 42, 0.28);
  border-left: 4px solid rgba(89, 36, 42, 0.78);
  border-radius: 8px;
  padding: 10px;
  background: linear-gradient(180deg, rgba(248, 244, 237, 0.96), rgba(234, 226, 214, 0.98));
  color: rgba(24, 19, 18, 0.94);
}
.${MODULE_ID}-ritual-roll-config__header {
  display: flex;
  align-items: flex-start;
  justify-content: space-between;
  gap: 8px;
}
.${MODULE_ID}-ritual-roll-config__title {
  display: flex;
  flex-direction: column;
  gap: 2px;
}
.${MODULE_ID}-ritual-roll-config__title strong {
  color: rgba(89, 36, 42, 0.96);
  font-size: 0.78rem;
  font-weight: 900;
  letter-spacing: 0.08em;
  line-height: 1;
  text-transform: uppercase;
}
.${MODULE_ID}-ritual-roll-config__title span {
  font-size: 0.9rem;
  font-weight: 800;
}
.${MODULE_ID}-ritual-roll-config__badge {
  border: 1px solid rgba(89, 36, 42, 0.25);
  border-radius: 999px;
  padding: 2px 8px;
  background: rgba(255, 255, 255, 0.36);
  color: rgba(89, 36, 42, 0.9);
  font-size: 0.7rem;
  font-weight: 800;
  white-space: nowrap;
}
.${MODULE_ID}-ritual-roll-config__hint,
.${MODULE_ID}-ritual-roll-config__status {
  margin: 0;
  font-size: 0.76rem;
  line-height: 1.35;
  opacity: 0.8;
}
.${MODULE_ID}-ritual-roll-config__fields {
  display: grid;
  grid-template-columns: repeat(2, minmax(0, 1fr));
  gap: 8px;
}
.${MODULE_ID}-ritual-roll-config__forms-section {
  display: flex;
  flex-direction: column;
  gap: 6px;
}
.${MODULE_ID}-ritual-roll-config__forms-title {
  color: rgba(24, 19, 18, 0.9);
  font-size: 0.8rem;
  font-weight: 900;
}
.${MODULE_ID}-ritual-roll-config__forms-grid {
  display: grid;
  grid-template-columns: repeat(3, minmax(0, 1fr));
  gap: 8px;
}
.${MODULE_ID}-ritual-roll-config__field {
  display: flex;
  flex-direction: column;
  gap: 4px;
  min-width: 0;
  margin: 0;
  font-size: 0.78rem;
  font-weight: 700;
  text-align: left;
}
.${MODULE_ID}-ritual-roll-config__field input,
.${MODULE_ID}-ritual-roll-config__field select,
.${MODULE_ID}-ritual-roll-config__field textarea {
  width: 100%;
  min-width: 0;
  margin: 0;
  font-size: 0.82rem;
  font-weight: 500;
}
.${MODULE_ID}-ritual-roll-config__field textarea {
  resize: vertical;
}
.${MODULE_ID}-ritual-roll-config__field small {
  color: rgba(89, 36, 42, 0.78);
  font-size: 0.72rem;
  font-weight: 700;
}
.${MODULE_ID}-ritual-roll-config__form-card {
  border: 1px solid rgba(0, 0, 0, 0.12);
  border-radius: 7px;
  padding: 7px;
  background: rgba(255, 255, 255, 0.28);
}
.${MODULE_ID}-ritual-roll-config__form-card:has(input:disabled) {
  opacity: 0.72;
}
.${MODULE_ID}-ritual-roll-config__actions {
  display: flex;
  flex-wrap: wrap;
  gap: 6px;
}
.${MODULE_ID}-ritual-roll-config__actions button {
  width: auto;
  margin: 0;
}
.${MODULE_ID}-ritual-roll-config [hidden] {
  display: none !important;
}
@media (max-width: 620px) {
  .${MODULE_ID}-ritual-roll-config__fields,
  .${MODULE_ID}-ritual-roll-config__forms-grid {
    grid-template-columns: 1fr;
  }
}
`;
  document.head.append(style);
}

function renderRitualRollConfigBlock(sheet: ItemSheetLike, html: unknown): void {
  const item = getSheetItem(sheet);
  if (!item || item.type !== "ritual") return;

  const root = resolveRootElement(html);
  if (!root) return;

  const ritualTab = root.querySelector<HTMLElement>('section[data-tab="ritualAttr"]');
  if (!ritualTab) return;

  removeExistingBlock(ritualTab);

  const availability = getRitualFormAvailability(item);
  const config = getRitualRollConfigForEditing(item);
  const editable = canEditRitualRollConfig(item);
  const block = createRitualRollConfigBlock(item, config, availability, editable);

  wireBlockEvents(block, item, availability, editable);
  insertBlock(ritualTab, block);
  updateConditionalRows(block);
}

function insertBlock(ritualTab: HTMLElement, block: HTMLElement): void {
  const formGrid = ritualTab.querySelector<HTMLInputElement>('input[name="system.studentForm"]')?.closest<HTMLElement>(".resource.grid");

  if (formGrid?.parentElement) {
    formGrid.insertAdjacentElement("afterend", block);
    return;
  }

  const content = ritualTab.querySelector<HTMLElement>(".content-item.scrollable") ?? ritualTab;
  content.append(block);
}

function removeExistingBlock(root: HTMLElement): void {
  for (const existing of Array.from(root.querySelectorAll<HTMLElement>(`[${BLOCK_ATTRIBUTE}]`))) {
    existing.remove();
  }
}

function createRitualRollConfigBlock(
  item: Item,
  config: RitualRollConfig,
  availability: RitualFormAvailability,
  editable: boolean,
): HTMLElement {
  const block = document.createElement("section");
  block.classList.add(`${MODULE_ID}-ritual-roll-config`);
  block.setAttribute(BLOCK_ATTRIBUTE, item.uuid ?? item.id ?? "ritual");

  const header = document.createElement("header");
  header.classList.add(`${MODULE_ID}-ritual-roll-config__header`);

  const title = document.createElement("div");
  title.classList.add(`${MODULE_ID}-ritual-roll-config__title`);
  title.append(createElement("strong", "Paranormal Toolkit"));
  title.append(createElement("span", "Fórmula de rolagem"));

  const badge = document.createElement("span");
  badge.classList.add(`${MODULE_ID}-ritual-roll-config__badge`);
  badge.textContent = hasConfiguredFormula(config) ? "Configurada" : "Rascunho";

  header.append(title, badge);
  block.append(header);

  const hint = document.createElement("p");
  hint.classList.add(`${MODULE_ID}-ritual-roll-config__hint`);
  hint.textContent = "Configure a fórmula usada pelo Toolkit quando este ritual não tiver um preset específico. Círculo, resistência, alvo e duração continuam vindo da ficha original.";
  block.append(hint);

  const fields = document.createElement("div");
  fields.classList.add(`${MODULE_ID}-ritual-roll-config__fields`);

  fields.append(createIntentField(config, editable));
  fields.append(createDamageTypeField(config, editable));
  fields.append(createUtilityLabelField(config, editable));

  block.append(fields);
  block.append(createFormsSection(config, availability, editable));
  block.append(createActions(editable));

  const status = document.createElement("p");
  status.classList.add(`${MODULE_ID}-ritual-roll-config__status`);
  status.textContent = editable ? "Salvo em flags do módulo; não altera os campos do sistema." : "Somente leitura nesta ficha.";
  block.append(status);

  return block;
}

function createIntentField(config: RitualRollConfig, editable: boolean): HTMLElement {
  const wrapper = createFieldWrapper("Tipo da rolagem");
  const select = document.createElement("select");
  select.setAttribute(FIELD_ATTRIBUTE, "intent");
  select.disabled = !editable;

  for (const intent of ["damage", "healing", "utility"] satisfies RitualRollIntent[]) {
    const option = document.createElement("option");
    option.value = intent;
    option.textContent = getRitualRollIntentLabel(intent);
    option.selected = config.intent === intent;
    select.append(option);
  }

  wrapper.append(select);
  return wrapper;
}

function createDamageTypeField(config: RitualRollConfig, editable: boolean): HTMLElement {
  const wrapper = createFieldWrapper("Tipo de dano");
  wrapper.setAttribute("data-paranormal-toolkit-ritual-roll-damage-row", "true");

  const select = document.createElement("select");
  select.setAttribute(FIELD_ATTRIBUTE, "damageType");
  select.disabled = !editable;

  const blank = document.createElement("option");
  blank.value = "";
  blank.textContent = "—";
  blank.selected = !config.damageType;
  select.append(blank);

  for (const damageType of DAMAGE_TYPE_OPTIONS) {
    const option = document.createElement("option");
    option.value = damageType.value;
    option.textContent = damageType.label;
    option.selected = config.damageType === damageType.value;
    select.append(option);
  }

  wrapper.append(select);
  return wrapper;
}

function createUtilityLabelField(config: RitualRollConfig, editable: boolean): HTMLElement {
  const wrapper = createFieldWrapper("Rótulo de utilidade");
  wrapper.setAttribute("data-paranormal-toolkit-ritual-roll-utility-row", "true");

  const input = document.createElement("input");
  input.type = "text";
  input.placeholder = "Resultado";
  input.value = config.utilityLabel ?? "Resultado";
  input.disabled = !editable;
  input.setAttribute(FIELD_ATTRIBUTE, "utilityLabel");

  wrapper.append(input);
  return wrapper;
}

function createFormsSection(
  config: RitualRollConfig,
  availability: RitualFormAvailability,
  editable: boolean,
): HTMLElement {
  const section = document.createElement("section");
  section.classList.add(`${MODULE_ID}-ritual-roll-config__forms-section`);

  const title = document.createElement("strong");
  title.classList.add(`${MODULE_ID}-ritual-roll-config__forms-title`);
  title.textContent = "Fórmulas por forma";
  section.append(title);

  const grid = document.createElement("div");
  grid.classList.add(`${MODULE_ID}-ritual-roll-config__forms-grid`);

  grid.append(createFormField("base", "Padrão", config.forms.base.formula, true, editable));
  grid.append(createFormField("discente", "Discente", config.forms.discente.formula, availability.discente, editable));
  grid.append(createFormField("verdadeiro", "Verdadeiro", config.forms.verdadeiro.formula, availability.verdadeiro, editable));

  section.append(grid);
  return section;
}

function createFormField(
  formId: RitualRollFormId,
  labelText: string,
  formula: string,
  available: boolean,
  editable: boolean,
): HTMLElement {
  const wrapper = createFieldWrapper(labelText);
  wrapper.classList.add(`${MODULE_ID}-ritual-roll-config__form-card`);
  wrapper.dataset.ritualRollForm = formId;

  const input = document.createElement("input");
  input.type = "text";
  input.placeholder = formId === "base" ? "Ex.: 3d6" : "Ex.: 6d6";
  input.value = formula;
  input.disabled = !editable || !available;
  input.setAttribute(FIELD_ATTRIBUTE, `formula.${formId}`);

  wrapper.append(input);

  if (!available) {
    const message = document.createElement("small");
    message.textContent = "Indisponível neste ritual.";
    wrapper.append(message);
  }

  return wrapper;
}

function createActions(editable: boolean): HTMLElement {
  const actions = document.createElement("div");
  actions.classList.add(`${MODULE_ID}-ritual-roll-config__actions`);

  const save = document.createElement("button");
  save.type = "button";
  save.textContent = "Salvar fórmula";
  save.disabled = !editable;
  save.setAttribute(ACTION_ATTRIBUTE, "save");

  const clear = document.createElement("button");
  clear.type = "button";
  clear.textContent = "Limpar";
  clear.disabled = !editable;
  clear.setAttribute(ACTION_ATTRIBUTE, "clear");

  actions.append(save, clear);
  return actions;
}

function createFieldWrapper(labelText: string): HTMLElement {
  const label = document.createElement("label");
  label.classList.add(`${MODULE_ID}-ritual-roll-config__field`);

  const title = document.createElement("span");
  title.textContent = labelText;
  label.append(title);

  return label;
}

function createElement(tagName: "strong" | "span", text: string): HTMLElement {
  const element = document.createElement(tagName);
  element.textContent = text;
  return element;
}

function wireBlockEvents(
  block: HTMLElement,
  item: Item,
  availability: RitualFormAvailability,
  editable: boolean,
): void {
  const intent = getField<HTMLSelectElement>(block, "intent");
  intent?.addEventListener("change", () => updateConditionalRows(block));

  const originalStudentCheckbox = findOriginalFormCheckbox(block, "system.studentForm");
  originalStudentCheckbox?.addEventListener("change", () => updateFormAvailability(block, item));

  const originalTrueCheckbox = findOriginalFormCheckbox(block, "system.trueForm");
  originalTrueCheckbox?.addEventListener("change", () => updateFormAvailability(block, item));

  const save = block.querySelector<HTMLButtonElement>(`[${ACTION_ATTRIBUTE}="save"]`);
  save?.addEventListener("click", () => {
    if (!editable) return;
    void saveConfig(block, item, availability);
  });

  const clear = block.querySelector<HTMLButtonElement>(`[${ACTION_ATTRIBUTE}="clear"]`);
  clear?.addEventListener("click", () => {
    if (!editable) return;
    void clearConfig(block, item);
  });
}

async function saveConfig(block: HTMLElement, item: Item, availability: RitualFormAvailability): Promise<void> {
  const save = block.querySelector<HTMLButtonElement>(`[${ACTION_ATTRIBUTE}="save"]`);
  save?.setAttribute("disabled", "true");
  setStatus(block, "Salvando configuração...");

  try {
    const config = collectConfig(block, availability);
    await writeRitualRollConfig(item, config);
    updateBadge(block, config);
    setStatus(block, "Configuração salva.");
    ui.notifications?.info("Paranormal Toolkit: configuração de rolagem do ritual salva.");
  } catch (cause) {
    console.warn("Paranormal Toolkit: não foi possível salvar a configuração de rolagem do ritual.", cause);
    setStatus(block, "Não foi possível salvar a configuração.");
    ui.notifications?.warn("Paranormal Toolkit: não foi possível salvar a configuração de rolagem do ritual.");
  } finally {
    save?.removeAttribute("disabled");
  }
}

async function clearConfig(block: HTMLElement, item: Item): Promise<void> {
  const clear = block.querySelector<HTMLButtonElement>(`[${ACTION_ATTRIBUTE}="clear"]`);
  clear?.setAttribute("disabled", "true");
  setStatus(block, "Limpando configuração...");

  try {
    await clearRitualRollConfig(item);
    const config = getRitualRollConfigForEditing(item);
    applyConfigToBlock(block, config);
    updateBadge(block, config);
    setStatus(block, "Configuração removida.");
    ui.notifications?.info("Paranormal Toolkit: configuração de rolagem do ritual removida.");
  } catch (cause) {
    console.warn("Paranormal Toolkit: não foi possível limpar a configuração de rolagem do ritual.", cause);
    setStatus(block, "Não foi possível limpar a configuração.");
    ui.notifications?.warn("Paranormal Toolkit: não foi possível limpar a configuração de rolagem do ritual.");
  } finally {
    clear?.removeAttribute("disabled");
  }
}


function updateBadge(block: HTMLElement, config: RitualRollConfig): void {
  const badge = block.querySelector<HTMLElement>(`.${MODULE_ID}-ritual-roll-config__badge`);
  if (badge) badge.textContent = hasConfiguredFormula(config) ? "Configurada" : "Rascunho";
}

function collectConfig(block: HTMLElement, availability: RitualFormAvailability): RitualRollConfig {
  void availability;

  const intent = normalizeIntent(getField<HTMLSelectElement>(block, "intent")?.value);

  return {
    schemaVersion: 1,
    intent,
    damageType: getOptionalFieldValue(block, "damageType"),
    utilityLabel: getOptionalFieldValue(block, "utilityLabel") ?? "Resultado",
    note: "",
    forms: {
      base: { formula: getFieldValue(block, "formula.base") },
      discente: { formula: getFieldValue(block, "formula.discente") },
      verdadeiro: { formula: getFieldValue(block, "formula.verdadeiro") },
    },
  };
}

function applyConfigToBlock(block: HTMLElement, config: RitualRollConfig): void {
  setFieldValue(block, "intent", config.intent);
  setFieldValue(block, "damageType", config.damageType ?? "");
  setFieldValue(block, "utilityLabel", config.utilityLabel ?? "Resultado");
  setFieldValue(block, "formula.base", config.forms.base.formula);
  setFieldValue(block, "formula.discente", config.forms.discente.formula);
  setFieldValue(block, "formula.verdadeiro", config.forms.verdadeiro.formula);
  updateConditionalRows(block);
}

function updateConditionalRows(block: HTMLElement): void {
  const intent = normalizeIntent(getField<HTMLSelectElement>(block, "intent")?.value);
  const damageRows = block.querySelectorAll<HTMLElement>('[data-paranormal-toolkit-ritual-roll-damage-row="true"]');
  const utilityRows = block.querySelectorAll<HTMLElement>('[data-paranormal-toolkit-ritual-roll-utility-row="true"]');

  for (const row of Array.from(damageRows)) {
    row.hidden = intent !== "damage";
  }

  for (const row of Array.from(utilityRows)) {
    row.hidden = intent !== "utility";
  }
}

function updateFormAvailability(block: HTMLElement, item: Item): void {
  const availability = getRitualFormAvailability(item);
  setFormInputAvailability(block, "discente", availability.discente);
  setFormInputAvailability(block, "verdadeiro", availability.verdadeiro);
}

function setFormInputAvailability(block: HTMLElement, formId: Exclude<RitualRollFormId, "base">, available: boolean): void {
  const input = getField<HTMLInputElement>(block, `formula.${formId}`);
  if (!input) return;

  const editable = !block.querySelector<HTMLButtonElement>(`[${ACTION_ATTRIBUTE}="save"]`)?.disabled;
  input.disabled = !editable || !available;

  const field = input.closest<HTMLElement>(`.${MODULE_ID}-ritual-roll-config__field`);
  const existing = field?.querySelector<HTMLElement>("small");

  if (!field) return;

  if (available) {
    existing?.remove();
    return;
  }

  if (!existing) {
    const message = document.createElement("small");
    message.textContent = "Indisponível neste ritual.";
    field.append(message);
  }
}

function setStatus(block: HTMLElement, message: string): void {
  const status = block.querySelector<HTMLElement>(`.${MODULE_ID}-ritual-roll-config__status`);
  if (status) status.textContent = message;
}

function getRitualFormAvailability(item: Item): RitualFormAvailability {
  const system = readSystemRecord(item);

  return {
    base: true,
    discente: system.studentForm === true,
    verdadeiro: system.trueForm === true,
  };
}

function getSheetItem(sheet: ItemSheetLike): Item | null {
  if (isItem(sheet.item)) return sheet.item;
  if (isItem(sheet.document)) return sheet.document;
  return null;
}

function canEditRitualRollConfig(item: Item): boolean {
  return Boolean(game.user?.isGM || (item as { isOwner?: unknown }).isOwner === true);
}

function readSystemRecord(item: Item): Record<string, unknown> {
  const system = item.system as unknown;
  return isRecord(system) ? system : {};
}

function findOriginalFormCheckbox(block: HTMLElement, name: "system.studentForm" | "system.trueForm"): HTMLInputElement | null {
  const ritualTab = block.closest<HTMLElement>('[data-tab="ritualAttr"]');
  return ritualTab?.querySelector<HTMLInputElement>(`input[name="${name}"]`) ?? null;
}

function getField<TElement extends HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>(
  block: HTMLElement,
  field: string,
): TElement | null {
  return block.querySelector<TElement>(`[${FIELD_ATTRIBUTE}="${escapeCssAttributeValue(field)}"]`);
}

function getFieldValue(block: HTMLElement, field: string): string {
  return getField<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>(block, field)?.value.trim() ?? "";
}

function getOptionalFieldValue(block: HTMLElement, field: string): string | null {
  const value = getFieldValue(block, field);
  return value.length > 0 ? value : null;
}

function setFieldValue(block: HTMLElement, field: string, value: string): void {
  const input = getField<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>(block, field);
  if (input) input.value = value;
}

function normalizeIntent(value: unknown): RitualRollIntent {
  return value === "healing" || value === "utility" ? value : "damage";
}

function hasConfiguredFormula(config: RitualRollConfig): boolean {
  return Object.values(config.forms).some((form) => form.formula.trim().length > 0);
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
  return Boolean(value && typeof value === "object" && "type" in value && "system" in value && "getFlag" in value && "setFlag" in value);
}

function isRecord(value: unknown): value is Record<string, unknown> {
  return value !== null && typeof value === "object" && !Array.isArray(value);
}

function escapeCssAttributeValue(value: string): string {
  return value.replace(/\\/g, "\\\\").replace(/"/g, '\\"');
}
