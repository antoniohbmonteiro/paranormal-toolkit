import { escapeHtml } from "../../rendering/escape-html";

export type RollRowResultTone = "section" | "success" | "failure";

export interface RollRowViewModel {
  formula: string;
  total?: number;
  resultTone?: RollRowResultTone;
  diceResults?: readonly number[];
  expanded?: boolean;
}

const RESULT_TONE_CLASSES: Record<RollRowResultTone, string> = {
  section: "paranormal-toolkit-roll-row__result--section",
  success: "paranormal-toolkit-roll-row__result--success",
  failure: "paranormal-toolkit-roll-row__result--failure",
};

function resultToneClass(tone: RollRowResultTone | undefined): string {
  return RESULT_TONE_CLASSES[tone ?? "section"] ?? RESULT_TONE_CLASSES.section;
}

function renderFormula(model: RollRowViewModel): string {
  const formula = `<span class="paranormal-toolkit-roll-row__formula-text">${escapeHtml(model.formula)}</span>`;
  if (!model.diceResults?.length) {
    return `<div class="paranormal-toolkit-roll-row__formula paranormal-toolkit-roll-row__formula--static">${formula}</div>`;
  }
  const dice = model.diceResults
    .map(
      (result) =>
        `<span class="paranormal-toolkit-roll-row__die">${escapeHtml(String(result))}</span>`,
    )
    .join("");
  const open = model.expanded ? " open" : "";
  return `<details class="paranormal-toolkit-roll-row__details"${open}>
  <summary class="paranormal-toolkit-roll-row__formula">${formula}<span class="paranormal-toolkit-roll-row__chevron" aria-hidden="true"></span></summary>
  <div class="paranormal-toolkit-roll-row__breakdown" aria-label="Resultados dos dados">${dice}</div>
</details>`;
}

export function renderRollRow(model: RollRowViewModel): string {
  const hasResult = model.total !== undefined;
  const modifier = hasResult ? "with-result" : "without-result";
  const total = hasResult ? escapeHtml(String(model.total)) : "";
  const result = hasResult
    ? `<output class="paranormal-toolkit-roll-row__result ${resultToneClass(model.resultTone)}" aria-label="Resultado: ${total}">${total}</output>`
    : "";
  return `<div class="paranormal-toolkit-roll-row paranormal-toolkit-roll-row--${modifier}">${renderFormula(model)}${result}</div>`;
}
