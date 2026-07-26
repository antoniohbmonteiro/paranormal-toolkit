import { MODULE_ID } from "../constants";
import {
  renderChatCardHeader,
  type ChatCardHeaderViewModel,
} from "../ui/components/chat/chat-card-header";
import { renderChatCardShell } from "../ui/components/chat/chat-card-shell";
import {
  renderSectionCard,
  type SectionCardTone,
} from "../ui/components/chat/section-card";
import { renderSectionHeader } from "../ui/components/chat/section-header";
import {
  renderStatusBadge,
  type StatusBadgeState,
} from "../ui/components/chat/status-badge";

export type ChatCardHeaderExample =
  | "single"
  | "none"
  | "multi"
  | "long-title"
  | "long-context"
  | "ability"
  | "runtime";

export type SectionCardExample =
  | "casting-title"
  | "casting-badge"
  | "damage-text"
  | "resistance-button"
  | "all";

export type StatusBadgeExample = StatusBadgeState | "both";

export type ChatCardDevelopmentApi = {
  /** @deprecated Temporary visual QA helper; remove after production migration. */
  postChatCardHeaderExample(example: ChatCardHeaderExample): Promise<unknown>;
  /** @deprecated Temporary visual QA helper; remove after production migration. */
  postSectionCardExample(example: SectionCardExample): Promise<unknown>;
  /** @deprecated Temporary visual QA helper; remove after production migration. */
  postStatusBadgeExample(example: StatusBadgeExample): Promise<unknown>;
  clearChatCardExamples(): Promise<void>;
  /** @deprecated Use clearChatCardExamples. */
  clearChatCardHeaderExamples(): Promise<void>;
};

const EXAMPLE_FLAG = "devChatCardExample";
const LEGACY_HEADER_EXAMPLE_FLAG = "devChatCardHeaderExample";

function requireGm(): void {
  if (!game.user?.isGM) {
    throw new Error("Apenas GMs podem gerenciar exemplos de chat card.");
  }
}

function runtimeHeaderModel(): ChatCardHeaderViewModel {
  const source = canvas?.tokens?.controlled?.[0];
  const targets = [...(game.user?.targets ?? [])];
  const sourceName = source?.name || source?.actor?.name || "Mercy";
  const targetContext =
    targets.length > 1
      ? `${targets.length} alvos`
      : targets[0]?.name || targets[0]?.actor?.name || "Nenhum alvo";
  const imageSource =
    foundry.utils.getProperty(source, "document.texture.src") ??
    foundry.utils.getProperty(source, "actor.img");
  return {
    image:
      typeof imageSource === "string"
        ? { src: imageSource, alt: `Imagem de ${sourceName}` }
        : undefined,
    title: sourceName,
    subtitle: "Runtime",
    badges: [{ label: "RUNTIME", tone: "neutral" }],
    context: `${sourceName} → ${targetContext}`,
  };
}

function exampleHeaderModel(example: ChatCardHeaderExample): ChatCardHeaderViewModel {
  if (example === "runtime") return runtimeHeaderModel();
  if (example === "ability") {
    return {
      title: "Habilidade Genérica",
      subtitle: "Habilidade",
      badges: [{ label: "HABILIDADE", tone: "wine" }],
      context: "Mercy → Cultista",
    };
  }
  const contexts = {
    single: "Mercy → Malvadão",
    none: "Mercy → Nenhum alvo",
    multi: "Mercy → 3 alvos",
    "long-title": "Mercy → Malvadão",
    "long-context":
      "Mercy → Criatura paranormal com um nome excepcionalmente longo para validar a quebra natural do contexto",
  } satisfies Record<Exclude<ChatCardHeaderExample, "runtime" | "ability">, string>;
  return {
    title:
      example === "long-title"
        ? "Eletrocussão Extraordinariamente Prolongada para Validar a Quebra Natural do Título"
        : "Eletrocussão",
    subtitle: "Padrão",
    badges: [{ label: "ENERGIA 1" }],
    context: contexts[example],
  };
}

function sectionExample(example: Exclude<SectionCardExample, "all">): {
  tone: SectionCardTone;
  title: string;
  trailing?: string;
} {
  switch (example) {
    case "casting-title":
      return { tone: "casting", title: "Conjuração" };
    case "casting-badge":
      return {
        tone: "casting",
        title: "Conjuração",
        trailing: renderStatusBadge({ state: "success" }),
      };
    case "damage-text":
      return {
        tone: "damage",
        title: "Dano",
        trailing:
          '<span class="paranormal-toolkit-section-header__demo-text">Eletricidade</span>',
      };
    case "resistance-button":
      return {
        tone: "resistance",
        title: "Resistência",
        trailing:
          '<button class="paranormal-toolkit-section-header__demo-button" type="button" aria-label="Botão visual de demonstração">◇</button>',
      };
  }
}

function renderSectionExample(example: Exclude<SectionCardExample, "all">): string {
  const model = sectionExample(example);
  return renderChatCardShell({
    content: renderSectionCard({
      tone: model.tone,
      content: renderSectionHeader({
        title: model.title,
        trailing: model.trailing,
      }),
    }),
  });
}

function renderStatusExample(state: StatusBadgeState): string {
  return renderChatCardShell({
    content: renderSectionCard({
      tone: "casting",
      content: renderSectionHeader({
        title: "Conjuração",
        trailing: renderStatusBadge({ state }),
      }),
    }),
  });
}

function createExampleMessage(
  content: string,
  kind: "header" | "section" | "status",
): Promise<unknown> {
  return ChatMessage.create({
    content,
    flags: { [MODULE_ID]: { [EXAMPLE_FLAG]: kind } },
  });
}

export function createChatCardDevelopmentApi(): ChatCardDevelopmentApi {
  const clearChatCardExamples = async (): Promise<void> => {
    requireGm();
    const messages = game.messages.contents ?? [];
    const examples = messages.filter(
      (message) =>
        typeof message.getFlag?.(MODULE_ID, EXAMPLE_FLAG) === "string" ||
        message.getFlag?.(MODULE_ID, LEGACY_HEADER_EXAMPLE_FLAG) === true,
    );
    await Promise.all(
      examples.map((message) =>
        (message as ChatMessageDocumentLike & { delete?: () => Promise<unknown> }).delete?.(),
      ),
    );
  };

  return {
    async postChatCardHeaderExample(example) {
      requireGm();
      return createExampleMessage(
        renderChatCardShell({
          content: renderChatCardHeader(exampleHeaderModel(example)),
        }),
        "header",
      );
    },
    async postSectionCardExample(example) {
      requireGm();
      const examples =
        example === "all"
          ? ([
              "casting-title",
              "casting-badge",
              "damage-text",
              "resistance-button",
            ] as const)
          : [example];
      return Promise.all(
        examples.map((item) =>
          createExampleMessage(renderSectionExample(item), "section"),
        ),
      );
    },
    async postStatusBadgeExample(example) {
      requireGm();
      const states =
        example === "both" ? (["success", "failure"] as const) : [example];
      return Promise.all(
        states.map((state) =>
          createExampleMessage(renderStatusExample(state), "status"),
        ),
      );
    },
    clearChatCardExamples,
    clearChatCardHeaderExamples: clearChatCardExamples,
  };
}
