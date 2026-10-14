import type { AllyAbilityDefinition } from "../../../core/allies/ally-definition";
import { escapeHtml } from "../../rendering/escape-html";

export function renderAllyAbilityConfig(config: AllyAbilityDefinition): string {
  return `<p>Benefícios passivos desta habilidade. Alterações exigem aprovação do GM.</p>
    ${config.benefits.map(benefit => `<div>
      <label>Bônus de Defesa <input type="number" step="any" required data-benefit-value="${escapeHtml(benefit.id)}" value="${escapeHtml(String(benefit.value))}"></label>
      <button type="button" data-action="removeBenefit" data-benefit-id="${escapeHtml(benefit.id)}">Remover</button>
    </div>`).join("")}
    <button type="button" data-action="addBenefit">Adicionar bônus de Defesa</button>
    <button type="submit">Salvar benefícios</button>`;
}
