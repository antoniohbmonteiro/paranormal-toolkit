import { renderChatCardHeader, renderChatCardSection, renderChatRollDisplay, renderChatStatusBanner, escapeHtml, type HtmlString, type ChatRollDisplayModel } from "../components";
import { markTrustedHtml } from "../components/component-html";
import { componentHeaderExamples } from "./component-example-fixtures";

export type ComponentExampleCard = { kind: "ability" | "ritual" | "weapon" | "stress"; html: HtmlString };
function card(kind: ComponentExampleCard["kind"], header: HtmlString, body: readonly HtmlString[]): ComponentExampleCard {
  return { kind, html: markTrustedHtml(`<article class="paranormal-toolkit-chat-card paranormal-toolkit-chat-card--demo"><div class="paranormal-toolkit-chat-card__demo">DEMONSTRAÇÃO</div>${header}${body.join("")}</article>`) };
}
function textContent(text: string): HtmlString { return markTrustedHtml(`<p>${escapeHtml(text)}</p>`); }
function disabledRoll(model: ChatRollDisplayModel): HtmlString { return renderChatRollDisplay({ ...model, action: model.action ? { label: model.action.label, disabled: true } : undefined }); }

export function renderComponentExampleCards(forChat = false): readonly ComponentExampleCard[] {
  const ability = card("ability", renderChatCardHeader(componentHeaderExamples[0]!), [
    renderChatCardSection({ title: "Execução e custo", description: "1 ação ilustrativa · 2 pontos imaginários", content: textContent("Metadados sem vínculo com regras reais.") }),
    (forChat ? disabledRoll : renderChatRollDisplay)({ label: "Teste pendente", formula: "2d8 + 3", tone: "test", action: { label: "Ação visual" } }),
    renderChatStatusBanner({ tone: "resource", title: "Recurso fictício", message: "Nenhum recurso será consumido." }),
  ]);
  const ritual = card("ritual", renderChatCardHeader(componentHeaderExamples[2]!), [renderChatCardSection({ title: "Conjuração simulada", content: textContent("Uma geometria luminosa aparece apenas nesta narrativa.") }), renderChatCardSection({ title: "Resultado ilustrativo", tone: "damage", content: renderChatRollDisplay({ formula: "3d6 + 2", total: 14, tone: "damage", dice: [{ value: "6", state: "active" }, { value: "3", state: "neutral" }] }) }), renderChatStatusBanner({ tone: "manual", message: "Preview sem conjuração real." })]);
  const weapon = card("weapon", renderChatCardHeader(componentHeaderExamples[3]!), [renderChatCardSection({ title: "Ataque pendente", tone: "test", content: disabledRoll({ formula: "1d20 + 4", tone: "test", action: { label: "Ação visual" } }) }), renderChatCardSection({ title: "Impacto resolvido", tone: "damage", content: renderChatRollDisplay({ formula: "2d5 + 1", total: 8, tone: "damage" }) })]);
  const stress = card("stress", renderChatCardHeader(componentHeaderExamples[4]!), [renderChatCardSection({ title: "Descrição extensa", description: "Este bloco deliberadamente longo examina limites visuais em um container estreito sem representar qualquer habilidade, equipamento ou procedimento existente.", content: textContent("Conteúdo de teste original para conferir legibilidade e comportamento responsivo.") }), renderChatRollDisplay({ formula: "12d12 + 8d8 + 12345", total: 987654, dice: [{ value: "12", state: "active" }, { value: "1", state: "discarded" }, { value: "8", state: "neutral" }, { value: "11", state: "active" }, { value: "3", state: "discarded" }], tone: "resistance" })]);
  return [ability, ritual, weapon, stress];
}
