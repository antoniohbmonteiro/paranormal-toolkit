import { escapeHtml } from "../../rendering/escape-html";

export type AllyBenefitFieldView =
  | { kind: "skill"; options: { id: string; label: string; selected: boolean }[] }
  | { kind: "value"; value: string };
export type AllyBenefitRowView = {
  id: string; name: string; kind: string; summary: string; disabled: boolean; diagnostic: string | null;
};
export type AllyBenefitConfigView = {
  editable: boolean;
  presets: { id: string; label: string; selected: boolean }[];
  fields: AllyBenefitFieldView[];
  unavailableMessage: string | null;
  canAdd: boolean;
  effects: AllyBenefitRowView[];
};

const ROW_ICONS: Record<string, string> = {
  defense: "fa-shield", skill: "fa-book-open", movement: "fa-person-running",
  maxPV: "fa-heart", maxPE: "fa-bolt", maxPD: "fa-fire", diceBonus: "fa-dice-d20", custom: "fa-file-lines",
};

function option(id: string, label: string, selected: boolean): string {
  return `<option value="${escapeHtml(id)}"${selected ? " selected" : ""}>${escapeHtml(label)}</option>`;
}
function renderField(field: AllyBenefitFieldView, disabled: string): string {
  if (field.kind === "skill") {
    return `<label class="ally-benefits-field"><span>Perícia</span>
      <select name="skillId"${disabled}>${field.options.map(entry => option(entry.id, entry.label, entry.selected)).join("")}</select></label>`;
  }
  return `<label class="ally-benefits-field"><span>Valor</span>
    <input type="number" name="value" step="1" inputmode="numeric" value="${escapeHtml(field.value)}"${disabled}></label>`;
}
function renderRow(row: AllyBenefitRowView, disabled: string): string {
  const name = escapeHtml(row.name);
  const id = escapeHtml(row.id);
  return `<li class="ally-benefit${row.disabled ? " is-disabled" : ""}" data-benefit-kind="${escapeHtml(row.kind)}">
    <span class="ally-benefit-icon" aria-hidden="true"><i class="fa-solid ${ROW_ICONS[row.kind] ?? ROW_ICONS.custom}"></i></span>
    <div class="ally-benefit-text">
      <strong class="ally-benefit-name">${name}</strong>
      <span class="ally-benefit-summary">${escapeHtml(row.summary)}${row.disabled ? ` <span class="ally-benefit-badge">Desativado</span>` : ""}</span>
      ${row.diagnostic ? `<p class="ally-benefit-diagnostic" role="alert">${escapeHtml(row.diagnostic)}</p>` : ""}
    </div>
    <div class="ally-benefit-actions">
      <button type="button" data-action="editEffect" data-effect-id="${id}" aria-label="Editar ${name}" title="Editar no editor nativo"${disabled}><i class="fa-solid fa-pen-to-square"></i></button>
      <button type="button" data-action="removeEffect" data-effect-id="${id}" aria-label="Excluir ${name}" title="Excluir benefício"${disabled}><i class="fa-solid fa-trash-can"></i></button>
    </div>
  </li>`;
}

export function renderAllyAbilityConfig(view: AllyBenefitConfigView): string {
  const disabled = view.editable ? "" : " disabled";
  return `<div class="ally-benefits">
    <section class="ally-benefits-section">
      <h2 class="ally-benefits-heading">Benefícios passivos</h2>
      <p class="ally-benefits-intro">Configure os benefícios passivos deste aliado. Os efeitos criados aqui são projetados automaticamente no beneficiário do suporte.</p>
    </section>
    <section class="ally-benefits-section">
      <h2 class="ally-benefits-heading">Adicionar benefício</h2>
      <label class="ally-benefits-field"><span>Tipo de benefício</span>
        <select name="presetId"${disabled}>${view.presets.map(entry => option(entry.id, entry.label, entry.selected)).join("")}</select></label>
      ${view.fields.map(field => renderField(field, disabled)).join("")}
      ${view.unavailableMessage ? `<p class="ally-benefits-unavailable" role="status"><i class="fa-solid fa-triangle-exclamation" aria-hidden="true"></i> ${escapeHtml(view.unavailableMessage)}</p>` : ""}
      <div class="ally-benefits-buttons">
        <button type="button" class="ally-benefits-primary" data-action="addBenefit"${view.canAdd ? "" : " disabled"}><i class="fa-solid fa-plus" aria-hidden="true"></i> Adicionar benefício</button>
        <button type="button" class="ally-benefits-secondary" data-action="createCustom" title="Cria um efeito vazio e abre o editor nativo do Foundry"${disabled}><i class="fa-solid fa-file-lines" aria-hidden="true"></i> Criar personalizado</button>
      </div>
    </section>
    <section class="ally-benefits-section">
      <h2 class="ally-benefits-heading">Benefícios configurados</h2>
      ${view.effects.length
        ? `<ul class="ally-benefits-list">${view.effects.map(row => renderRow(row, disabled)).join("")}</ul>`
        : `<p class="ally-benefits-empty">Nenhum benefício configurado.</p>`}
    </section>
  </div>`;
}
