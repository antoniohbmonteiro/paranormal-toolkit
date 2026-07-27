import { MODULE_ID } from "../../constants";
import {
  listRitualResistanceConditionOptions,
  type RitualResistanceConditionConfig,
  type RitualResistanceOutcomeId,
  type RitualResistanceOutcomesConfig,
} from "../../features/rituals/config/ritual-resistance-outcome-config";

const EDITOR_ATTRIBUTE =
  "data-paranormal-toolkit-ritual-resistance-outcome-editor";
const OUTCOME_ATTRIBUTE =
  "data-paranormal-toolkit-ritual-resistance-outcome";
const ROW_ATTRIBUTE =
  "data-paranormal-toolkit-ritual-resistance-outcome-row";
const FIELD_ATTRIBUTE =
  "data-paranormal-toolkit-ritual-resistance-outcome-field";
const ACTION_ATTRIBUTE =
  "data-paranormal-toolkit-ritual-resistance-outcome-editor-action";

const OUTCOME_LABELS: Record<RitualResistanceOutcomeId, string> = {
  success: "Sucesso na resistência",
  failure: "Falha na resistência",
};

const CONDITION_OPTIONS = listRitualResistanceConditionOptions();

export function createRitualResistanceOutcomeEditor(
  config: RitualResistanceOutcomesConfig,
  editable: boolean,
): HTMLElement {
  const editor = document.createElement("div");
  editor.classList.add(`${MODULE_ID}-ritual-resistance-outcomes__grid`);
  editor.setAttribute(EDITOR_ATTRIBUTE, "true");
  editor.append(
    createOutcomeCard(
      "success",
      config.outcomes.success.conditions,
      editable,
    ),
    createOutcomeCard(
      "failure",
      config.outcomes.failure.conditions,
      editable,
    ),
  );

  editor.addEventListener("click", (event) => {
    const target = event.target;
    if (!(target instanceof Element)) return;

    const button = target.closest<HTMLButtonElement>(
      `button[${ACTION_ATTRIBUTE}]`,
    );
    if (!button || !editor.contains(button) || !editable) return;

    switch (button.getAttribute(ACTION_ATTRIBUTE)) {
      case "add":
        addConditionRow(editor, button);
        return;
      case "remove":
        removeConditionRow(button);
        return;
    }
  });

  return editor;
}

export function collectRitualResistanceOutcomeEditor(
  root: HTMLElement,
): RitualResistanceOutcomesConfig {
  return {
    schemaVersion: 1,
    outcomes: {
      success: { conditions: collectConditions(root, "success") },
      failure: { conditions: collectConditions(root, "failure") },
    },
  };
}

export function applyRitualResistanceOutcomeEditor(
  root: HTMLElement,
  config: RitualResistanceOutcomesConfig,
  editable: boolean,
): void {
  for (const outcome of ["success", "failure"] as const) {
    const rows = findRowsContainer(root, outcome);
    if (!rows) continue;

    rows.replaceChildren(
      ...ensureVisibleRows(config.outcomes[outcome].conditions).map(
        (condition) => createConditionRow(outcome, condition, editable),
      ),
    );
  }
}

function createOutcomeCard(
  outcome: RitualResistanceOutcomeId,
  conditions: readonly RitualResistanceConditionConfig[],
  editable: boolean,
): HTMLElement {
  const card = document.createElement("section");
  card.classList.add(`${MODULE_ID}-ritual-resistance-outcomes__card`);
  card.setAttribute(OUTCOME_ATTRIBUTE, outcome);

  const title = document.createElement("strong");
  title.classList.add(`${MODULE_ID}-ritual-resistance-outcomes__card-title`);
  title.textContent = OUTCOME_LABELS[outcome];
  card.append(title);

  const rows = document.createElement("div");
  rows.classList.add(`${MODULE_ID}-ritual-resistance-outcomes__rows`);
  rows.append(
    ...ensureVisibleRows(conditions).map((condition) =>
      createConditionRow(outcome, condition, editable),
    ),
  );
  card.append(rows);

  const add = document.createElement("button");
  add.type = "button";
  add.textContent = "+ Adicionar condição";
  add.disabled = !editable;
  add.classList.add(`${MODULE_ID}-ritual-resistance-outcomes__add`);
  add.setAttribute(ACTION_ATTRIBUTE, "add");
  add.setAttribute(OUTCOME_ATTRIBUTE, outcome);
  card.append(add);

  return card;
}

function createConditionRow(
  outcome: RitualResistanceOutcomeId,
  condition: RitualResistanceConditionConfig,
  editable: boolean,
): HTMLElement {
  const row = document.createElement("div");
  row.classList.add(`${MODULE_ID}-ritual-resistance-outcomes__row`);
  row.setAttribute(ROW_ATTRIBUTE, outcome);

  const conditionField = createField("Condição");
  conditionField.classList.add(
    `${MODULE_ID}-ritual-resistance-outcomes__condition-field`,
  );

  const select = document.createElement("select");
  select.disabled = !editable;
  select.setAttribute(FIELD_ATTRIBUTE, "conditionId");

  const blank = document.createElement("option");
  blank.value = "";
  blank.textContent = "Nenhuma condição";
  blank.selected = condition.conditionId.length === 0;
  select.append(blank);

  for (const optionData of CONDITION_OPTIONS) {
    const option = document.createElement("option");
    option.value = optionData.value;
    option.textContent = optionData.label;
    option.selected = condition.conditionId === optionData.value;
    select.append(option);
  }
  conditionField.append(select);

  const roundsField = createField("Rodadas");
  roundsField.classList.add(
    `${MODULE_ID}-ritual-resistance-outcomes__rounds-field`,
  );

  const rounds = document.createElement("input");
  rounds.type = "number";
  rounds.min = "1";
  rounds.step = "1";
  rounds.placeholder = "Sem limite";
  rounds.value = condition.rounds === null ? "" : String(condition.rounds);
  rounds.disabled = !editable;
  rounds.setAttribute(FIELD_ATTRIBUTE, "rounds");
  roundsField.append(rounds);

  const remove = document.createElement("button");
  remove.type = "button";
  remove.textContent = "×";
  remove.title = "Remover condição";
  remove.setAttribute("aria-label", remove.title);
  remove.disabled = !editable;
  remove.classList.add(`${MODULE_ID}-ritual-resistance-outcomes__remove`);
  remove.setAttribute(ACTION_ATTRIBUTE, "remove");

  row.append(conditionField, roundsField, remove);
  return row;
}

function collectConditions(
  root: HTMLElement,
  outcome: RitualResistanceOutcomeId,
): RitualResistanceConditionConfig[] {
  const rows = findRowsContainer(root, outcome);
  if (!rows) return [];

  return Array.from(
    rows.querySelectorAll<HTMLElement>(`[${ROW_ATTRIBUTE}]`),
  ).flatMap((row): RitualResistanceConditionConfig[] => {
    const conditionId = row
      .querySelector<HTMLSelectElement>(
        `[${FIELD_ATTRIBUTE}="conditionId"]`,
      )
      ?.value.trim();
    if (!conditionId) return [];

    const rounds = row
      .querySelector<HTMLInputElement>(`[${FIELD_ATTRIBUTE}="rounds"]`)
      ?.value.trim();

    return [{ conditionId, rounds: normalizePositiveInteger(rounds) }];
  });
}

function addConditionRow(
  editor: HTMLElement,
  button: HTMLButtonElement,
): void {
  const outcome = normalizeOutcome(
    button.getAttribute(OUTCOME_ATTRIBUTE),
  );
  if (!outcome) return;

  const rows = findRowsContainer(editor, outcome);
  rows?.append(createConditionRow(outcome, createBlankCondition(), true));
}

function removeConditionRow(button: HTMLButtonElement): void {
  const row = button.closest<HTMLElement>(`[${ROW_ATTRIBUTE}]`);
  const outcome = normalizeOutcome(row?.getAttribute(ROW_ATTRIBUTE));
  const rows = row?.parentElement;
  if (!row || !outcome || !rows) return;

  row.remove();
  if (rows.childElementCount === 0) {
    rows.append(createConditionRow(outcome, createBlankCondition(), true));
  }
}

function findRowsContainer(
  root: HTMLElement,
  outcome: RitualResistanceOutcomeId,
): HTMLElement | null {
  const editor = root.matches(`[${EDITOR_ATTRIBUTE}]`)
    ? root
    : root.querySelector<HTMLElement>(`[${EDITOR_ATTRIBUTE}]`);

  return (
    editor
      ?.querySelector<HTMLElement>(
        `.${MODULE_ID}-ritual-resistance-outcomes__card[${OUTCOME_ATTRIBUTE}="${outcome}"]`,
      )
      ?.querySelector<HTMLElement>(
        `.${MODULE_ID}-ritual-resistance-outcomes__rows`,
      ) ?? null
  );
}

function ensureVisibleRows(
  conditions: readonly RitualResistanceConditionConfig[],
): readonly RitualResistanceConditionConfig[] {
  return conditions.length > 0 ? conditions : [createBlankCondition()];
}

function createBlankCondition(): RitualResistanceConditionConfig {
  return { conditionId: "", rounds: null };
}

function createField(labelText: string): HTMLLabelElement {
  const label = document.createElement("label");
  label.classList.add(`${MODULE_ID}-ritual-resistance-outcomes__field`);

  const title = document.createElement("span");
  title.textContent = labelText;
  label.append(title);

  return label;
}

function normalizePositiveInteger(value: unknown): number | null {
  if (typeof value !== "string" || value.trim().length === 0) return null;

  const parsed = Number(value);
  if (!Number.isFinite(parsed)) return null;

  const result = Math.trunc(parsed);
  return result > 0 ? result : null;
}

function normalizeOutcome(
  value: unknown,
): RitualResistanceOutcomeId | null {
  return value === "success" || value === "failure" ? value : null;
}
