import type { AllyProfile } from "../../../core/allies/ally-profile";
import { escapeHtml } from "../../rendering/escape-html";

export type AllySheetViewModel = {
  name: string;
  image: string;
  profile: AllyProfile | null;
  editable: boolean;
  abilities: { id: string; name: string }[];
  support?: {
    revision: number; beneficiaryId: string | null; status: string; waitRound: number | null;
    diagnostic: string | null; isGM: boolean; available?: boolean;
    pilotId?: string | null; abilityRecipientId?: string | null; pilotAbilitiesEnabled?: boolean;
    beneficiaries: { id: string; name: string }[]; combats: { id: string; name: string }[];
  };
};

export function renderAllySheet(model: AllySheetViewModel): string {
  const editable = model.editable && model.profile !== null;
  const disabled = editable ? "" : " disabled";
  const abilities = model.abilities.map((item) => `
    <li data-item-id="${escapeHtml(item.id)}">
      <span>${escapeHtml(item.name)}</span>
      <button type="button" data-action="openAbility" data-item-id="${escapeHtml(item.id)}">Abrir</button>
      ${editable ? `<button type="button" data-action="configureBenefits" data-item-id="${escapeHtml(item.id)}">Benefícios</button><button type="button" data-action="removeAbility" data-item-id="${escapeHtml(item.id)}">Remover</button>` : ""}
    </li>`).join("");
  return `
    <p class="ally-poc-notice">Benefícios passivos e habilidades concedidas pelo suporte de Aliados.</p>
    ${model.profile === null ? '<p role="alert">Dados do Aliado inválidos ou de versão não suportada. A edição foi bloqueada para preservar os dados.</p>' : ""}
    <fieldset${disabled}>
      <legend>Identificação</legend>
      <label>Nome <input name="name" value="${escapeHtml(model.name)}" required></label>
      <label>Caminho da imagem <input name="img" value="${escapeHtml(model.image)}"></label>
      <label><input type="checkbox" name="system.isDrone"${model.profile?.isDrone ? " checked" : ""}> É um Drone</label>
      <label>Descrição <textarea name="system.description" rows="6">${escapeHtml(model.profile?.description ?? "")}</textarea></label>
      <button type="submit">Salvar</button>
    </fieldset>
    ${renderSupport(model)}
    <section aria-label="Habilidades">
      <h2>Habilidades</h2>
      ${editable ? '<button type="button" data-action="createAbility">Criar habilidade</button>' : ""}
      <p>Arraste Items do tipo habilidade para esta ficha.</p>
      ${abilities ? `<ul>${abilities}</ul>` : "<p>Nenhuma habilidade adicionada.</p>"}
    </section>`;
}

function renderSupport(model: AllySheetViewModel): string {
  const support = model.support;
  if (!support) return "";
  const enabled = model.editable && support.available !== false;
  const names: Record<string, string> = { inactive: "Inativo", active: "Ativo", pending: "Aguardando rodada" };
  const pilotMode = support.pilotAbilitiesEnabled && model.profile?.isDrone;
  const recipient = support.beneficiaries.find(actor => actor.id === support.abilityRecipientId);
  return `<section aria-label="Suporte">
    <h2>Suporte</h2>
    <p>Estado: ${escapeHtml(names[support.status] ?? "Desconhecido")}${support.waitRound !== null ? ` — rodada ${escapeHtml(String(support.waitRound))}` : ""}</p>
    ${support.diagnostic ? `<p role="status">${escapeHtml(support.diagnostic)}</p>` : ""}
    <p>Destino das habilidades: ${recipient ? escapeHtml(recipient.name) : "Nenhum Agente válido"}${support.status !== "active" ? " (suporte não está ativo)" : ""}</p>
    ${pilotMode && enabled ? `<label>Piloto <select data-ally-pilot><option value="">Sem piloto</option>
      ${support.pilotId && !support.beneficiaries.some(actor => actor.id === support.pilotId) ? `<option value="${escapeHtml(support.pilotId)}" selected>Piloto ausente ou inválido</option>` : ""}
      ${support.beneficiaries.map(actor => `<option value="${escapeHtml(actor.id)}"${actor.id === support.pilotId ? " selected" : ""}>${escapeHtml(actor.name)}</option>`).join("")}
    </select></label><button type="button" data-action="savePilot">Salvar piloto</button>` : ""}
    ${enabled ? `<label>Beneficiário <select data-ally-beneficiary>
      <option value="">Selecione um Agente</option>
      ${support.beneficiaries.map(actor => `<option value="${escapeHtml(actor.id)}"${actor.id === support.beneficiaryId ? " selected" : ""}>${escapeHtml(actor.name)}</option>`).join("")}
    </select></label>
    <label>Combate para troca <select data-ally-combat><option value="">Resolver automaticamente</option>
      ${support.combats.map(combat => `<option value="${escapeHtml(combat.id)}">${escapeHtml(combat.name)}</option>`).join("")}
    </select></label>
    <button type="button" data-action="assignSupport">Atribuir / trocar</button>
    <button type="button" data-action="activateSupport">Ativar</button>
    <button type="button" data-action="deactivateSupport">Desativar</button>
    ${support.isGM ? '<button type="button" data-action="reconcileSupport">Reconciliar</button>' : ""}` : ""}
  </section>`;
}
