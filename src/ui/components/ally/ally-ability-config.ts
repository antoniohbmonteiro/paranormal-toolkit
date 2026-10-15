import { escapeHtml } from "../../rendering/escape-html";

export type AllyEffectConfigView = { name: string; editable: boolean; effects: {
  id: string; name: string; disabled: boolean; diagnostic: string | null;
}[] };
export function renderAllyAbilityConfig(view: AllyEffectConfigView): string {
  const disabled = view.editable ? "" : " disabled";
  return `<p>Benefícios passivos de ${escapeHtml(view.name)}. Efeitos criados aqui participam automaticamente do suporte e são projetados somente no beneficiário.</p>
    <details><summary>Adicionar efeito</summary>
      <label>Nome <input data-effect-name value="Bônus de Defesa"${disabled}></label>
      <label>Bônus de Defesa <input data-effect-value type="number" step="any" value="5"${disabled}></label>
      <button type="button" data-action="createDefense"${disabled}>Criar Bônus de Defesa</button>
      <button type="button" data-action="createCustom"${disabled}>Criar Personalizado e abrir editor nativo</button>
    </details>
    <p>Edite mudanças, fases e valores no editor nativo. Desabilitar um efeito suspende seu benefício sem excluí-lo. Efeitos antigos não identificados como suporte permanecem na ficha nativa da habilidade.</p>
    <p>Chaves desconhecidas podem não produzir resultado mecânico no sistema.</p>
    <ul>${view.effects.map(effect => `<li>
      <strong>${escapeHtml(effect.name)}</strong>${effect.disabled ? " (desativado)" : ""}
      ${effect.diagnostic ? `<p role="alert">${escapeHtml(effect.diagnostic)}</p>` : ""}
      <button type="button" data-action="editEffect" data-effect-id="${escapeHtml(effect.id)}"${disabled}>Editar efeito nativo</button>
      <button type="button" data-action="removeEffect" data-effect-id="${escapeHtml(effect.id)}"${disabled}>Excluir efeito</button>
    </li>`).join("")}</ul>`;
}
