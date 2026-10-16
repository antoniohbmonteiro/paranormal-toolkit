import type { AllyProfile } from "../../../core/allies/ally-profile";
import type { AllyEditField, AllyFieldDraft } from "../../../features/allies/ally-sheet-edit-state";
import { escapeHtml as esc } from "../../rendering/escape-html";
import { renderAllyAbilityList, type AllyAbilityRow } from "./ally-ability-list";

export type AllyTab = "support" | "abilities" | "details";
export type AllySheetViewModel = {
  name: string; image: string; profile: AllyProfile | null; editable: boolean;
  idPrefix?: string;
  activeTab?: AllyTab;
  editingName?: boolean;
  documentUUID?: string;
  descriptionHTML?: string;
  fields?: Partial<Record<AllyEditField, AllyFieldDraft>>;
  notice?: string | null;
  abilities: AllyAbilityRow[];
  support?: {
    revision: number; beneficiaryId: string | null; status: string; waitRound: number | null;
    diagnostic: string | null; isGM: boolean; available?: boolean; busy?: boolean;
    pilotId?: string | null; abilityRecipientId?: string | null; pilotAbilitiesEnabled?: boolean;
    beneficiaries: { id: string; name: string }[]; combats?: { id: string; name: string }[];
  };
};

function supportLabel(model: AllySheetViewModel): string {
  const support = model.support;
  if (!support || !support.beneficiaryId || support.status === "inactive") return "Sem suporte";
  const name = support.beneficiaries.find(actor => actor.id === support.beneficiaryId)?.name ?? "Agente indisponível";
  if (support.diagnostic?.startsWith("Reconciliação interrompida")) return `Suporte com pendência — ${name}`;
  return support.status === "pending" ? `Aguardando rodada ${support.waitRound ?? "—"} — ${name}` : `Ajudando ${name}`;
}
function image(path: string | undefined, name: string, className = ""): string {
  return `<img class="${className}" src="${esc(path || "icons/svg/mystery-man.svg")}" alt="${esc(name)}" loading="lazy">`;
}
function abilities(model: AllySheetViewModel, tab: AllyTab): string {
  return renderAllyAbilityList(model.abilities, { prefix: `${model.idPrefix ?? "ally"}-${tab}`, editable: model.editable && model.profile !== null });
}
function fieldFeedback(model: AllySheetViewModel, field: AllyEditField): string {
  return `<small class="ally-field-feedback" data-field-feedback="${field}" role="status">${esc(model.fields?.[field]?.error ?? (model.fields?.[field]?.saving ? "Salvando…" : ""))}</small>`;
}
function agentOptions(model: AllySheetViewModel, selected: string | null | undefined, empty: string): string {
  const agents = model.support?.beneficiaries ?? [];
  return `<option value="">${empty}</option>${selected && !agents.some(actor => actor.id === selected)
    ? `<option value="${esc(selected)}" selected>Agente ausente ou inválido</option>` : ""}${agents.map(actor =>
    `<option value="${esc(actor.id)}"${actor.id === selected ? " selected" : ""}>${esc(actor.name)}</option>`).join("")}`;
}
function renderSupport(model: AllySheetViewModel): string {
  const support = model.support;
  const disabled = !model.editable || !model.profile || support?.available === false || support?.busy ? " disabled" : "";
  return `<section class="ally-section" aria-label="Dados de suporte">
    <h2>Dados de suporte</h2><div class="ally-support-fields" data-ally-region="support-fields">
      <label>Beneficiário<select data-ally-beneficiary aria-label="Beneficiário"${disabled}>${agentOptions(model, support?.beneficiaryId, "Nenhum")}</select></label>
      ${support?.pilotAbilitiesEnabled && model.profile?.isDrone ? `<label>Piloto<select data-ally-pilot aria-label="Piloto"${disabled}>${agentOptions(model, support.pilotId, "Sem piloto")}</select></label>` : ""}
    </div>
    <p class="ally-feedback" role="status" aria-live="polite" data-ally-region="feedback">${esc(support?.busy ? "Atualizando suporte…" : model.notice ?? support?.diagnostic ?? "")}</p>
    <div class="ally-summary-section"><h2>Resumo das habilidades</h2>${abilities(model, "support")}</div>
  </section>`;
}
function renderAbilities(model: AllySheetViewModel): string {
  const editable = model.editable && model.profile !== null;
  return `<section class="ally-section" aria-label="Habilidades do Aliado">
    <div class="ally-section-heading"><h2>Habilidades</h2>${editable ? '<button type="button" class="ally-add" data-action="createAbility"><i class="fa-solid fa-plus" aria-hidden="true"></i> Criar habilidade</button>' : ""}</div>
    ${abilities(model, "abilities")}
    ${editable ? '<p class="ally-hint">Arraste habilidades para esta ficha para adicioná-las.</p>' : ""}
  </section>`;
}
function renderDetails(model: AllySheetViewModel): string {
  const disabled = model.editable && model.profile !== null ? "" : " disabled";
  const value = (field: AllyEditField, fallback: string | boolean) => model.fields?.[field]?.value ?? fallback;
  return `<section class="ally-section ally-details" aria-label="Detalhes do Aliado">
    <label class="ally-drone"><input type="checkbox" name="system.isDrone" data-ally-field="system.isDrone"${value("system.isDrone", model.profile?.isDrone ?? false) ? " checked" : ""}${disabled}> É um Drone${fieldFeedback(model, "system.isDrone")}</label>
    <div class="ally-description" data-ally-region="description"><h2>Descrição</h2>
      <div class="ally-description-card" data-ally-region="description-card">
        <prose-mirror class="content-sized" name="system.description" data-ally-field="system.description" data-document-uuid="${esc(model.documentUUID ?? "")}" value="${esc(String(value("system.description", model.profile?.description ?? "")))}" aria-label="Descrição do Aliado" toggled${disabled}>${model.descriptionHTML ?? ""}</prose-mirror>
      </div>
      ${fieldFeedback(model, "system.description")}
    </div>
  </section>`;
}
export function renderAllySheet(model: AllySheetViewModel): string {
  const active = model.activeTab ?? "support";
  const prefix = esc(model.idPrefix ?? "ally");
  const label = supportLabel(model);
  const status = model.support?.status === "active" && !model.support.diagnostic ? "active" : model.support?.status === "pending" ? "pending" : "inactive";
  const editable = model.editable && model.profile !== null;
  const editingName = editable && model.editingName;
  return `<div class="ally-sheet-shell">
    <header class="ally-header" data-ally-region="header"><div class="ally-portrait-container"><button type="button" class="ally-portrait-button" data-action="editAllyImage" aria-label="Alterar retrato do Aliado" title="Alterar retrato"${editable ? "" : " disabled"}>${image(model.image, model.name, "ally-portrait")}</button>${fieldFeedback(model, "img")}</div>
      <div><p class="ally-eyebrow">Aliado</p><h1><button type="button" class="ally-name-display" data-action="editAllyName" title="Editar nome"${editingName ? " hidden" : ""}${editable ? "" : " disabled"}>${esc(model.name)}</button><input class="ally-name-input" aria-label="Nome do Aliado" name="name" data-ally-field="name" value="${esc(String(model.fields?.name?.value ?? model.name))}" required${editingName ? "" : " hidden"}${editable ? "" : " disabled"}></h1>${fieldFeedback(model, "name")}<p class="ally-kind">Aliado${model.profile?.isDrone ? " • Drone" : ""}</p>
        <p class="ally-support-context" data-status="${status}"><span aria-hidden="true"></span>${esc(label)}</p></div>
    </header>
    <nav class="tabs ally-tabs" role="tablist" aria-label="Ficha do Aliado">${([
      ["support", "Suporte", "fa-shield-halved"], ["abilities", "Habilidades", "fa-bolt"], ["details", "Detalhes", "fa-file-lines"],
    ] as const).map(([tab, text, icon]) => `<button type="button" class="${active === tab ? "active" : ""}" data-action="changeAllyTab" data-group="ally" data-tab="${tab}" role="tab" aria-selected="${active === tab}" tabindex="${active === tab ? "0" : "-1"}" aria-controls="${prefix}-${tab}"><i class="fa-solid ${icon}" aria-hidden="true"></i> ${text}</button>`).join("")}</nav>
    ${model.profile === null ? '<p class="ally-invalid" role="alert" data-ally-region="invalid">Perfil inválido. A edição foi bloqueada para preservar os dados.</p>' : ""}
    <div class="ally-content">${(["support", "abilities", "details"] as const).map(tab => `<div class="tab ally-tab ${active === tab ? "active" : ""}" data-tab="${tab}" data-group="ally" id="${prefix}-${tab}" role="tabpanel" aria-label="${tab === "support" ? "Suporte" : tab === "abilities" ? "Habilidades" : "Detalhes"}">${tab === "support" ? renderSupport(model) : tab === "abilities" ? renderAbilities(model) : renderDetails(model)}</div>`).join("")}</div>
  </div>`;
}
