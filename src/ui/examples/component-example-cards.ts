import {
  escapeHtml,
  renderChatCardHeader,
  renderChatCardMetadata,
  renderChatCardSection,
  renderChatRollDisplay,
  renderChatStatusBanner,
  type ChatRollDisplayModel,
  type HtmlString,
} from "../components";
import { markTrustedHtml } from "../components/component-html";
import { componentHeaderExamples } from "./component-example-fixtures";

export type ComponentExampleCard = {
  kind: "ability" | "ritual" | "weapon" | "stress";
  html: HtmlString;
};

function renderCard(
  kind: ComponentExampleCard["kind"],
  header: HtmlString,
  body: readonly HtmlString[],
  narrow = false,
): ComponentExampleCard {
  return {
    kind,
    html: markTrustedHtml(`
      <article class="paranormal-toolkit-chat-card paranormal-toolkit-chat-card--demo${narrow ? " paranormal-toolkit-chat-card--narrow" : ""}">
        <div class="paranormal-toolkit-chat-card__demo">Demonstração</div>
        ${header}
        <div class="paranormal-toolkit-chat-card__body">${body.join("")}</div>
      </article>
    `),
  };
}

function textContent(text: string): HtmlString {
  return markTrustedHtml(`<p class="paranormal-toolkit-chat-card__copy">${escapeHtml(text)}</p>`);
}

function chatSafeRoll(model: ChatRollDisplayModel): HtmlString {
  return renderChatRollDisplay({
    ...model,
    action: model.action ? { label: model.action.label, disabled: true } : undefined,
  });
}

export function renderComponentExampleCards(forChat = false): readonly ComponentExampleCard[] {
  const pendingRoll = forChat ? chatSafeRoll : renderChatRollDisplay;

  const ability = renderCard("ability", renderChatCardHeader(componentHeaderExamples[0]!), [
    renderChatCardMetadata({
      entries: [
        { label: "Execução", value: "Ação breve" },
        { label: "Custo", value: "2 cargas" },
      ],
    }),
    renderChatCardSection({
      title: "Descrição",
      content: textContent("Você concentra o impulso ao redor do corpo e avança com precisão por uma curta distância."),
    }),
    pendingRoll({
      label: "Impulso",
      formula: "2d8 + 3",
      tone: "test",
      action: { label: "Realizar teste" },
    }),
    renderChatStatusBanner({
      tone: "resource",
      title: "Cargas",
      message: "2 cargas reservadas para esta demonstração.",
    }),
  ]);

  const ritual = renderCard("ritual", renderChatCardHeader(componentHeaderExamples[2]!), [
    renderChatCardMetadata({
      entries: [
        { label: "Execução", value: "Ação completa" },
        { label: "Alcance", value: "Médio" },
        { label: "Duração", value: "2 rodadas" },
      ],
    }),
    renderChatCardSection({
      title: "Conjuração",
      description: "Órbita estável",
      tone: "test",
      content: textContent("Fragmentos prismáticos orbitam o ponto escolhido e iluminam os contornos próximos."),
    }),
    renderChatCardSection({
      title: "Impacto prismático",
      tone: "damage",
      content: renderChatRollDisplay({
        label: "Resultado",
        formula: "3d6 + 2",
        total: 14,
        tone: "damage",
        dice: [
          { value: "6", state: "active" },
          { value: "3", state: "neutral" },
          { value: "3", state: "neutral" },
        ],
      }),
    }),
    renderChatStatusBanner({
      tone: "manual",
      title: "Duração",
      message: "A órbita permanece estável até o fim da segunda rodada.",
    }),
  ]);

  const weapon = renderCard("weapon", renderChatCardHeader(componentHeaderExamples[3]!), [
    renderChatCardMetadata({
      entries: [
        { label: "Categoria", value: "Z" },
        { label: "Alcance", value: "Curto" },
      ],
    }),
    renderChatCardSection({
      title: "Disparo",
      tone: "test",
      content: pendingRoll({
        label: "Ataque",
        formula: "1d20 + 4",
        tone: "test",
        action: { label: "Realizar ataque" },
      }),
    }),
    renderChatCardSection({
      title: "Impacto",
      tone: "damage",
      content: renderChatRollDisplay({
        label: "Dano",
        formula: "2d5 + 1",
        total: 8,
        tone: "damage",
      }),
    }),
  ]);

  const stress = renderCard("stress", renderChatCardHeader(componentHeaderExamples[4]!), [
    renderChatCardMetadata({
      entries: [
        { label: "Execução prolongada", value: "Duas ações consecutivas" },
        { label: "Alcance variável", value: "Extremamente distante" },
        { label: "Custo acumulado", value: "12 cargas prismáticas" },
      ],
    }),
    renderChatCardSection({
      title: "Cascata de reflexos",
      description: "Uma descrição extensa para conferir a leitura em espaços muito estreitos.",
      content: textContent("Reflexos sucessivos atravessam a névoa, contornam cada obstáculo visível e convergem lentamente sobre o marco escolhido."),
    }),
    renderChatRollDisplay({
      label: "Resultado acumulado",
      formula: "12d12 + 8d8 + 12345 + 4d6",
      total: 987654,
      dice: [
        { value: "12", state: "active" },
        { value: "1", state: "discarded" },
        { value: "8", state: "neutral" },
        { value: "11", state: "active" },
        { value: "3", state: "discarded" },
        { value: "7", state: "neutral" },
        { value: "10", state: "active" },
      ],
      tone: "resistance",
    }),
  ], true);

  return [ability, ritual, weapon, stress];
}
