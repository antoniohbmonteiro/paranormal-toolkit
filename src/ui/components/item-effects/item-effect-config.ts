import { escapeHtml } from "../../rendering/escape-html";
import type { ItemEffectConfigView, ItemEffectFieldView, ItemEffectRowView } from "../../../features/item-effects/item-effect-config-view";

const ICONS: Record<string, string> = { defense: "fa-shield", skill: "fa-book-open", movement: "fa-person-running", maxPV: "fa-heart",
  maxPE: "fa-bolt", maxPD: "fa-fire", maxSAN: "fa-brain", capacity: "fa-weight-hanging", attribute: "fa-user", ritualDT: "fa-circle-nodes",
  perRound: "fa-hourglass-half", damageResistance: "fa-shield-halved", diceBonus: "fa-dice-d20", custom: "fa-file-lines" };
const LABELS = { skill: "Perícia", attribute: "Atributo", resource: "Recurso", damageType: "Tipo de dano" };
function option(id: string, label: string, selected: boolean): string {
  return `<option value="${escapeHtml(id)}"${selected ? " selected" : ""}>${escapeHtml(label)}</option>`;
}
function field(view: ItemEffectFieldView, disabled: string, editing = false): string {
  const name = (value: string) => editing ? `edit${value[0].toUpperCase()}${value.slice(1)}` : value;
  if (view.kind === "value") return `<label class="ally-benefits-field"><span>Valor</span><input type="number" name="${name("value")}" step="1" inputmode="numeric" value="${escapeHtml(view.value)}"${disabled}></label>`;
  return `<label class="ally-benefits-field"><span>${LABELS[view.kind]}</span><select name="${name(`${view.kind}Id`)}"${disabled}>${view.options.map(entry => option(entry.id, entry.label, entry.selected)).join("")}</select></label>`;
}
function row(view: ItemEffectRowView, config: ItemEffectConfigView): string {
  const id = escapeHtml(view.id), name = escapeHtml(view.name);
  const disabled = config.editable ? "" : " disabled";
  const edit = config.editing?.id === view.id ? `<div class="ally-benefits-quick-edit">${config.editing.fields.map(entry => field(entry, disabled, true)).join("")}
    <div class="ally-benefits-buttons"><button type="button" data-action="saveEffect" data-effect-id="${id}"${disabled}>Salvar</button><button type="button" data-action="cancelEdit"${config.working ? " disabled" : ""}>Cancelar</button></div></div>` : "";
  return `<li class="ally-benefit${view.disabled ? " is-disabled" : ""}" data-benefit-kind="${escapeHtml(view.kind)}">
    <span class="ally-benefit-icon" aria-hidden="true"><i class="fa-solid ${ICONS[view.kind] ?? ICONS.custom}"></i></span>
    <div class="ally-benefit-text"><strong class="ally-benefit-name">${name}</strong><span class="ally-benefit-summary">${escapeHtml(view.summary)}${view.disabled ? ' <span class="ally-benefit-badge">Desativado</span>' : ""}</span>
    ${view.transferLabel ? `<span class="ally-benefit-summary">${escapeHtml(view.transferLabel)}</span>` : ""}
    ${view.diagnostic ? `<p class="ally-benefit-diagnostic" role="alert">${escapeHtml(view.diagnostic)}</p>` : ""}
    ${view.details?.length ? `<details class="ally-benefit-details"><summary>Detalhes reais</summary><ul>${view.details.map(detail => `<li>${escapeHtml(detail)}</li>`).join("")}</ul></details>` : ""}${edit}</div>
    <div class="ally-benefit-actions">
      <button type="button" data-action="editEffect" data-effect-id="${id}" aria-label="Editar ${name}" title="${view.canQuickEdit ? "Edição rápida" : "Editar no editor nativo"}"${view.canOpen === false ? " disabled" : disabled}><i class="fa-solid fa-pen-to-square"></i></button>
      ${view.canOpen !== false ? `<button type="button" data-action="advancedEffect" data-effect-id="${id}" aria-label="Edição avançada de ${name}" title="Edição avançada no Foundry"${config.working ? " disabled" : ""}><i class="fa-solid fa-sliders"></i></button>` : ""}
      <button type="button" data-action="removeEffect" data-effect-id="${id}" aria-label="Excluir ${name}" title="Excluir efeito"${view.canRemove === false ? " disabled" : disabled}><i class="fa-solid fa-trash-can"></i></button>
    </div></li>`;
}
export function renderItemEffectConfig(view: ItemEffectConfigView): string {
  const disabled = view.editable ? "" : " disabled";
  const own = view.effects.filter(effect => !effect.benefit), benefits = view.effects.filter(effect => effect.benefit);
  const list = (entries: ItemEffectRowView[]) => `<ul class="ally-benefits-list">${entries.map(entry => row(entry, view)).join("")}</ul>`;
  const effects = view.benefits ? list(view.effects) : `${own.length ? list(own) : ""}${benefits.length ? `<h3>Benefícios passivos existentes</h3>${list(benefits)}` : ""}`;
  return `<div class="ally-benefits">
    <section class="ally-benefits-section"><h2 class="ally-benefits-heading">${escapeHtml(view.title ?? "Benefícios passivos")}</h2>
      <p class="ally-benefits-intro">${escapeHtml(view.intro ?? "Configure os benefícios passivos deste aliado. Os efeitos são projetados automaticamente no beneficiário do suporte.")}</p>
      ${view.notice ? `<p class="ally-benefit-diagnostic" role="status">${escapeHtml(view.notice)}</p>` : ""}
      ${view.legacy ? `<p>Benefícios em formato legado continuam funcionando. A importação criará ${view.legacy.missing} efeitos faltantes e gravará o marcador de conclusão, preservando os efeitos existentes.</p><button type="button" data-action="importLegacy"${view.legacy.canImport ? "" : " disabled"}>Importar benefícios legados</button>` : ""}
    </section>
    <section class="ally-benefits-section"><h2 class="ally-benefits-heading">Adicionar ${view.benefits ? "benefício" : "efeito"}</h2>
      <label class="ally-benefits-field"><span>Tipo de ${view.benefits ? "benefício" : "efeito"}</span><select name="presetId"${disabled}>${view.presets.map(entry => option(entry.id, entry.label, entry.selected)).join("")}</select></label>
      ${view.fields.map(entry => field(entry, disabled)).join("")}
      ${view.transfer ? `<label class="ally-benefits-field"><span>Aplicação do novo efeito</span><select name="transfer"${disabled}>
        ${option("true", view.transfer.independent ? "Aplicar ao Actor quando o Item estiver incorporado" : "Aplicar automaticamente ao Agente", view.transfer.value === "true")}
        ${option("false", "Manter somente na habilidade", view.transfer.value !== "true")}</select></label>
        <p class="ally-benefits-intro">A escolha vale para este novo efeito, independentemente da Execução da habilidade. Usa a transferência nativa; usar a habilidade não ativa nem aplica efeitos automaticamente.</p>` : ""}
      ${view.unavailableMessage ? `<p class="ally-benefits-unavailable" role="status">${escapeHtml(view.unavailableMessage)}</p>` : ""}
      <div class="ally-benefits-buttons"><button type="button" class="ally-benefits-primary" data-action="addBenefit"${view.canAdd ? "" : " disabled"}><i class="fa-solid fa-plus" aria-hidden="true"></i> Adicionar ${view.benefits ? "benefício" : "efeito"}</button>
      <button type="button" class="ally-benefits-secondary" data-action="createCustom" title="Cria um efeito vazio e abre o editor nativo do Foundry"${view.editable && !view.notice && !view.legacy ? "" : " disabled"}><i class="fa-solid fa-file-lines" aria-hidden="true"></i> Criar personalizado</button></div>
    </section>
    <section class="ally-benefits-section"><h2 class="ally-benefits-heading">${view.benefits ? "Benefícios" : "Efeitos"} configurados</h2>
      ${view.effects.length ? effects : `<p class="ally-benefits-empty">Nenhum ${view.benefits ? "benefício" : "efeito"} configurado.</p>`}
    </section></div>`;
}
export function renderItemEffectConfigEntry(view: { benefits: boolean; readOnly: boolean; independent: boolean }): string {
  return `<header><strong>Paranormal Toolkit</strong><span>${view.benefits ? "Benefícios passivos" : "Efeitos da habilidade"}</span></header>
    <p>${view.benefits ? "Configure os benefícios projetados no beneficiário pelo suporte deste Aliado."
      : view.independent ? "Configure efeitos próprios deste Item. A transferência nativa define o comportamento ao incorporá-lo em um Actor."
      : "Configure presets e efeitos próprios da habilidade, respeitando a transferência nativa."}</p>
    ${view.readOnly ? "<p>Somente leitura. Confira as permissões, o compêndio ou a origem da concessão.</p>" : ""}
    <button type="button" data-paranormal-toolkit-effect-config-open>${view.benefits ? "Configurar benefícios passivos" : "Configurar efeitos da habilidade"}</button>`;
}
