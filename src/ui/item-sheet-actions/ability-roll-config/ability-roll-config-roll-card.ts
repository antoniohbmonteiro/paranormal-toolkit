import { MODULE_ID } from "../../../constants";
import {
  ABILITY_DAMAGE_TYPE_OPTIONS,
  createDefaultAbilityRollNexSteps,
  getAbilityRollIntentLabel,
  MAX_ABILITY_NEX_STEPS,
  type AbilityRollEntry,
  type AbilityRollIntent,
  type AbilityRollNexResolution,
  type AbilityRollNexStep,
} from "../../../features/abilities/config/ability-roll-config";
import {
  createButton,
  createField,
  createIconButton,
  createOption,
  createTextInput,
} from "./ability-roll-config-dom";

export type AbilityRollCardOptions = {
  roll: AbilityRollEntry;
  index: number;
  editable: boolean;
  onChange(): void;
  onRemove(): void;
};

export function createAbilityRollCard(
  options: AbilityRollCardOptions,
): HTMLElement {
  const { roll, index, editable, onChange, onRemove } = options;
  const card = document.createElement("article");
  card.classList.add(`${MODULE_ID}-ability-roll-config__card`);
  card.dataset.abilityRollId = roll.id;

  const header = document.createElement("header");
  header.classList.add(`${MODULE_ID}-ability-roll-config__card-header`);

  const heading = document.createElement("div");
  heading.classList.add(`${MODULE_ID}-ability-roll-config__card-title`);
  const title = document.createElement("strong");
  title.textContent = `Rolagem ${index + 1}`;
  const mode = document.createElement("span");
  heading.append(title, mode);

  const remove = createIconButton("Remover rolagem", "fa-solid fa-trash");
  remove.disabled = !editable;
  remove.addEventListener("click", onRemove);
  header.append(heading, remove);

  const fields = document.createElement("div");
  fields.classList.add(`${MODULE_ID}-ability-roll-config__fields`);

  const labelInput = createTextInput(
    roll.label,
    "Ex.: Dano adicional",
    editable,
  );
  labelInput.addEventListener("input", () => {
    roll.label = labelInput.value;
    onChange();
  });
  fields.append(createField("Nome da rolagem", labelInput));

  const intentSelect = document.createElement("select");
  intentSelect.disabled = !editable;
  for (const intent of [
    "generic",
    "damage",
    "healing",
  ] satisfies AbilityRollIntent[]) {
    intentSelect.append(
      createOption(
        intent,
        getAbilityRollIntentLabel(intent),
        roll.intent === intent,
      ),
    );
  }
  intentSelect.addEventListener("change", () => {
    roll.intent = normalizeIntent(intentSelect.value);
    renderDamageType();
    onChange();
  });
  fields.append(createField("Tipo da rolagem", intentSelect));

  const damageField = document.createElement("div");
  damageField.classList.add(
    `${MODULE_ID}-ability-roll-config__damage-field`,
  );
  fields.append(damageField);

  const formulaSection = document.createElement("section");
  formulaSection.classList.add(
    `${MODULE_ID}-ability-roll-config__formula-section`,
  );

  const formulaHeader = document.createElement("div");
  formulaHeader.classList.add(
    `${MODULE_ID}-ability-roll-config__formula-header`,
  );
  const formulaTitle = document.createElement("strong");
  formulaTitle.textContent = "Fórmula";

  const scalingRow = document.createElement("label");
  scalingRow.classList.add(`${MODULE_ID}-ability-roll-config__scaling-toggle`);
  const scalingCheckbox = document.createElement("input");
  scalingCheckbox.type = "checkbox";
  scalingCheckbox.checked = roll.formula.mode === "nex";
  scalingCheckbox.disabled = !editable;
  const scalingText = document.createElement("span");
  scalingText.textContent = "Varia conforme o NEX";
  scalingRow.append(scalingCheckbox, scalingText);
  formulaHeader.append(formulaTitle, scalingRow);

  const formulaContainer = document.createElement("div");
  formulaContainer.classList.add(`${MODULE_ID}-ability-roll-config__formula`);
  formulaSection.append(formulaHeader, formulaContainer);

  scalingCheckbox.addEventListener("change", () => {
    roll.formula = scalingCheckbox.checked
      ? {
          mode: "nex",
          resolution: "highest-unlocked",
          steps: createNexStepsFromFixedFormula(
            roll.formula.mode === "fixed" ? roll.formula.formula : "",
          ),
        }
      : {
          mode: "fixed",
          formula:
            roll.formula.mode === "nex"
              ? (roll.formula.steps.find((step) => step.formula.trim())
                  ?.formula ?? "")
              : roll.formula.formula,
        };
    renderMode();
    renderFormulaEditor();
    onChange();
  });

  card.append(header, fields, formulaSection);
  renderMode();
  renderDamageType();
  renderFormulaEditor();
  return card;

  function renderMode(): void {
    mode.textContent =
      roll.formula.mode === "nex" ? "Progressão por NEX" : "Fórmula fixa";
  }

  function renderDamageType(): void {
    damageField.replaceChildren();
    const hasDamageType = roll.intent === "damage";
    fields.classList.toggle(
      `${MODULE_ID}-ability-roll-config__fields--without-damage`,
      !hasDamageType,
    );
    damageField.hidden = !hasDamageType;
    if (!hasDamageType) return;

    const select = document.createElement("select");
    select.disabled = !editable;
    select.append(createOption("", "—", !roll.damageType));
    for (const { value, label } of ABILITY_DAMAGE_TYPE_OPTIONS) {
      select.append(createOption(value, label, roll.damageType === value));
    }
    select.addEventListener("change", () => {
      roll.damageType = select.value || null;
      onChange();
    });
    damageField.append(createField("Tipo de dano", select));
  }

  function renderFormulaEditor(): void {
    formulaContainer.replaceChildren();

    if (roll.formula.mode === "fixed") {
      const formulaInput = createTextInput(
        roll.formula.formula,
        "Ex.: 2d6 + @attributes.str.value",
        editable,
      );
      formulaInput.addEventListener("input", () => {
        if (roll.formula.mode !== "fixed") return;
        roll.formula.formula = formulaInput.value;
        onChange();
      });
      formulaContainer.append(createField("Expressão", formulaInput));
      return;
    }

    const nexConfig = roll.formula;
    const resolutionSelect = document.createElement("select");
    resolutionSelect.disabled = !editable;
    resolutionSelect.append(
      createOption(
        "highest-unlocked",
        "Usar a maior fórmula liberada",
        nexConfig.resolution === "highest-unlocked",
      ),
      createOption(
        "choose-unlocked",
        "Escolher entre as fórmulas liberadas",
        nexConfig.resolution === "choose-unlocked",
      ),
    );
    resolutionSelect.addEventListener("change", () => {
      nexConfig.resolution = normalizeResolution(resolutionSelect.value);
      onChange();
    });
    formulaContainer.append(createField("Comportamento", resolutionSelect));

    const steps = document.createElement("div");
    steps.classList.add(`${MODULE_ID}-ability-roll-config__steps`);

    nexConfig.steps.forEach((step, stepIndex) => {
      steps.append(
        createNexStepRow({
          step,
          editable,
          onChange,
          onRemove: () => {
            nexConfig.steps.splice(stepIndex, 1);
            renderFormulaEditor();
            onChange();
          },
        }),
      );
    });

    formulaContainer.append(steps);

    const addStep = createButton(
      "Adicionar etapa de NEX",
      "fa-solid fa-plus",
      `${MODULE_ID}-ability-roll-config__add-step`,
    );
    addStep.disabled =
      !editable || nexConfig.steps.length >= MAX_ABILITY_NEX_STEPS;
    addStep.addEventListener("click", () => {
      if (nexConfig.steps.length >= MAX_ABILITY_NEX_STEPS) return;
      nexConfig.steps.push({
        minNex: findNextNexThreshold(
          nexConfig.steps.map((step) => step.minNex),
        ),
        formula: "",
      });
      renderFormulaEditor();
      onChange();
    });
    formulaContainer.append(addStep);
  }
}

type NexStepRowOptions = {
  step: AbilityRollNexStep;
  editable: boolean;
  onChange(): void;
  onRemove(): void;
};

function createNexStepRow(options: NexStepRowOptions): HTMLElement {
  const { step, editable, onChange, onRemove } = options;
  const row = document.createElement("div");
  row.classList.add(`${MODULE_ID}-ability-roll-config__step`);

  const nexInput = document.createElement("input");
  nexInput.type = "number";
  nexInput.min = "0";
  nexInput.max = "99";
  nexInput.step = "1";
  nexInput.value = String(step.minNex);
  nexInput.disabled = !editable;
  nexInput.setAttribute("aria-label", "NEX mínimo");
  nexInput.addEventListener("change", () => {
    step.minNex = clampNex(Number(nexInput.value));
    nexInput.value = String(step.minNex);
    onChange();
  });

  const nexControl = document.createElement("div");
  nexControl.classList.add(`${MODULE_ID}-ability-roll-config__nex-control`);
  const percent = document.createElement("span");
  percent.textContent = "%";
  nexControl.append(nexInput, percent);

  const formulaInput = createTextInput(step.formula, "Ex.: 2d6", editable);
  formulaInput.setAttribute("aria-label", "Fórmula da etapa");
  formulaInput.addEventListener("input", () => {
    step.formula = formulaInput.value;
    onChange();
  });

  const removeStep = createIconButton("Remover etapa", "fa-solid fa-xmark");
  removeStep.disabled = !editable;
  removeStep.addEventListener("click", onRemove);

  row.append(
    createField("NEX mínimo", nexControl),
    createField("Fórmula", formulaInput),
    removeStep,
  );
  return row;
}

function createNexStepsFromFixedFormula(
  formula: string,
): AbilityRollNexStep[] {
  const steps = createDefaultAbilityRollNexSteps();
  const firstStep = steps[0];
  if (formula.trim() && firstStep) firstStep.formula = formula;
  return steps;
}

function findNextNexThreshold(existing: number[]): number {
  for (const preferred of [10, 40, 65, 99]) {
    if (!existing.includes(preferred)) return preferred;
  }

  for (let candidate = 0; candidate <= 99; candidate += 1) {
    if (!existing.includes(candidate)) return candidate;
  }

  return 99;
}

function normalizeIntent(value: string): AbilityRollIntent {
  return value === "damage" || value === "healing" ? value : "generic";
}

function normalizeResolution(value: string): AbilityRollNexResolution {
  return value === "choose-unlocked"
    ? "choose-unlocked"
    : "highest-unlocked";
}

function clampNex(value: number): number {
  return Number.isFinite(value)
    ? Math.min(99, Math.max(0, Math.trunc(value)))
    : 0;
}
