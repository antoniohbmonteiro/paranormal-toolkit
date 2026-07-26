import { MODULE_ID } from "../constants";
import {
  renderChatCardHeader,
  type ChatCardHeaderViewModel,
} from "../ui/components/chat/chat-card-header";
import { renderChatCardShell } from "../ui/components/chat/chat-card-shell";
import { renderDiceActionButton } from "../ui/components/chat/dice-action-button";
import { renderMetadataDetailRow } from "../ui/components/chat/metadata-detail-row";
import {
  renderRollRow,
  type RollRowViewModel,
} from "../ui/components/chat/roll-row";
import {
  renderSectionCard,
  type SectionCardTone,
} from "../ui/components/chat/section-card";
import { renderSectionHeader } from "../ui/components/chat/section-header";
import {
  renderStatusBadge,
  type StatusBadgeState,
} from "../ui/components/chat/status-badge";
import {
  renderRitualConjurationSection,
  type RitualConjurationSectionViewModel,
} from "../ui/components/ritual/ritual-conjuration-section";
import {
  renderRitualDamageSection,
  type RitualDamageSectionViewModel,
} from "../ui/components/ritual/ritual-damage-section";
import {
  renderRitualResistanceSection,
  type RitualResistanceSectionViewModel,
} from "../ui/components/ritual/ritual-resistance-section";
import {
  renderRitualSingleTargetCard,
  type RitualSingleTargetCardViewModel,
} from "../ui/components/ritual/ritual-single-target-card";
import {
  renderRitualMetadata,
  type RitualMetadataViewModel,
} from "../ui/components/ritual/ritual-metadata";

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

export type DiceActionButtonExample = "enabled" | "disabled" | "all";

export type RollRowExample =
  | "with-result-success"
  | "with-result-failure"
  | "damage-collapsed"
  | "damage-expanded"
  | "without-result-collapsed"
  | "without-result-expanded"
  | "all";

export type RitualConjurationSectionExample =
  | "success"
  | "failure"
  | "failure-consequence"
  | "expanded"
  | "all";

export type RitualDamageSectionExample =
  | "collapsed"
  | "expanded"
  | "without-result"
  | "long-type"
  | "all";

export type RitualResistanceSectionExample =
  | "enabled"
  | "disabled"
  | "long"
  | "all";

export type RitualMetadataExample = "default" | "partial" | "long" | "all";

export type MetadataDetailRowExample = "short" | "long" | "generic" | "all";

export type RitualSingleTargetCardExample = "success" | "failure" | "long" | "all";

export type ChatCardDevelopmentApi = {
  /** @deprecated Temporary visual QA helper; remove after production migration. */
  postChatCardHeaderExample(example: ChatCardHeaderExample): Promise<unknown>;
  /** @deprecated Temporary visual QA helper; remove after production migration. */
  postSectionCardExample(example: SectionCardExample): Promise<unknown>;
  /** @deprecated Temporary visual QA helper; remove after production migration. */
  postStatusBadgeExample(example: StatusBadgeExample): Promise<unknown>;
  /** @deprecated Temporary visual QA helper; remove after production migration. */
  postDiceActionButtonExample(example: DiceActionButtonExample): Promise<unknown>;
  /** @deprecated Temporary visual QA helper; remove after production migration. */
  postRollRowExample(example: RollRowExample): Promise<unknown>;
  /** @deprecated Temporary visual QA helper; remove after production migration. */
  postRitualConjurationSectionExample(
    example: RitualConjurationSectionExample,
  ): Promise<unknown>;
  /** @deprecated Temporary visual QA helper; remove after production migration. */
  postRitualDamageSectionExample(
    example: RitualDamageSectionExample,
  ): Promise<unknown>;
  /** @deprecated Temporary visual QA helper; remove after production migration. */
  postRitualResistanceSectionExample(
    example: RitualResistanceSectionExample,
  ): Promise<unknown>;
  /** @deprecated Temporary visual QA helper; remove after production migration. */
  postRitualMetadataExample(example: RitualMetadataExample): Promise<unknown>;
  /** @deprecated Temporary visual QA helper; remove after production migration. */
  postMetadataDetailRowExample(example: MetadataDetailRowExample): Promise<unknown>;
  /** @deprecated Temporary visual QA helper; remove after production migration. */
  postRitualSingleTargetCardExample(
    example: RitualSingleTargetCardExample,
  ): Promise<unknown>;
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

function renderDiceActionButtonExample(
  example: Exclude<DiceActionButtonExample, "all">,
): string {
  const disabled = example === "disabled";
  return renderChatCardShell({
    content: renderSectionCard({
      tone: "resistance",
      content: renderSectionHeader({
        title: "Resistência",
        trailing: renderDiceActionButton({
          ariaLabel: disabled ? "Resistência indisponível" : "Rolar resistência",
          disabled,
        }),
      }),
    }),
  });
}

function renderRollRowExample(example: Exclude<RollRowExample, "all">): string {
  const isCasting = example.startsWith("with-result");
  const isDamage = example.startsWith("damage");
  const failure = example === "with-result-failure";
  const model: RollRowViewModel = isCasting
    ? {
        formula: "1d20 + 10 + 5",
        total: failure ? 17 : 23,
        resultTone: failure ? "failure" : "success",
        diceResults: [failure ? 2 : 8],
      }
    : isDamage
      ? {
          formula: "3d6",
          total: 9,
          resultTone: "section",
          diceResults: [2, 3, 4],
          expanded: example === "damage-expanded",
        }
      : {
          formula: "1d20 + 4",
          diceResults: [17],
          expanded: example === "without-result-expanded",
        };
  const tone: SectionCardTone = isDamage
    ? "damage"
    : isCasting
      ? "casting"
      : "resistance";
  const title = isDamage ? "Dano" : isCasting ? "Conjuração" : "Resistência";
  const trailing = isDamage
    ? '<span class="paranormal-toolkit-section-header__demo-text">Eletricidade</span>'
    : isCasting
      ? renderStatusBadge({ state: failure ? "failure" : "success" })
      : undefined;
  return renderChatCardShell({
    content: renderSectionCard({
      tone,
      content:
        renderSectionHeader({ title, trailing }) + renderRollRow(model),
    }),
  });
}

function ritualConjurationExample(
  example: Exclude<RitualConjurationSectionExample, "all">,
): RitualConjurationSectionViewModel {
  const failure = example === "failure" || example === "failure-consequence";
  return {
    status: failure ? "failure" : "success",
    skillLabel: "Ocultismo",
    total: failure ? 17 : 23,
    difficultyClass: 21,
    formula: "1d20 + 10 + 5",
    diceResults: [failure ? 2 : 8],
    expanded: example === "expanded",
    consequence:
      example === "failure-consequence" ? "Dano de Sanidade" : undefined,
  };
}

function renderRitualConjurationExample(
  example: Exclude<RitualConjurationSectionExample, "all">,
): string {
  return renderChatCardShell({
    content: renderRitualConjurationSection(ritualConjurationExample(example)),
  });
}

function ritualDamageExample(
  example: Exclude<RitualDamageSectionExample, "all">,
): RitualDamageSectionViewModel {
  if (example === "long-type") {
    return {
      damageType: "Eletricidade paranormal prolongada",
      formula: "3d6 + 2d8 + 5",
      total: 21,
      diceResults: [2, 3, 4, 5, 2],
    };
  }
  return {
    damageType: "Eletricidade",
    formula: "3d6",
    total: example === "without-result" ? undefined : 9,
    diceResults: [2, 3, 4],
    expanded: example === "expanded",
  };
}

function renderRitualDamageExample(
  example: Exclude<RitualDamageSectionExample, "all">,
): string {
  return renderChatCardShell({
    content: renderRitualDamageSection(ritualDamageExample(example)),
  });
}

function ritualResistanceExample(
  example: Exclude<RitualResistanceSectionExample, "all">,
): RitualResistanceSectionViewModel {
  if (example === "disabled") {
    return {
      skill: "Reflexos",
      difficultyLabel: "DT 18",
      outcome: "evita o efeito",
      action: { ariaLabel: "Resistência indisponível", disabled: true },
    };
  }
  return {
    skill: "Fortitude",
    difficultyLabel: "DT 22",
    outcome:
      example === "long"
        ? "reduz o dano paranormal recebido à metade e evita efeitos adicionais prolongados"
        : "reduz dano à metade",
    action: { ariaLabel: "Rolar resistência de Fortitude" },
  };
}

function renderRitualResistanceExample(
  example: Exclude<RitualResistanceSectionExample, "all">,
): string {
  return renderChatCardShell({
    content: renderRitualResistanceSection(ritualResistanceExample(example)),
  });
}

function ritualMetadataExample(
  example: Exclude<RitualMetadataExample, "all">,
): RitualMetadataViewModel {
  if (example === "partial") {
    return {
      items: [
        { text: "Alcance: Pessoal" },
        { text: "Duração: Cena" },
      ],
    };
  }
  if (example === "long") {
    return {
      items: [
        { text: "Execução: Uma ação completa cuidadosamente preparada" },
        { text: "Alcance: Uma distância paranormal excepcionalmente longa" },
        { text: "Duração: Enquanto a concentração do conjurador for mantida" },
      ],
    };
  }
  return {
    items: [
      { text: "1 PE gasto" },
      { text: "Alvo: 1 Ser" },
      { text: "Duração: Instantânea" },
    ],
  };
}

function renderRitualMetadataExample(
  example: Exclude<RitualMetadataExample, "all">,
): string {
  return renderChatCardShell({
    content: renderRitualMetadata(ritualMetadataExample(example)),
  });
}

function renderMetadataDetailRowExample(
  example: Exclude<MetadataDetailRowExample, "all">,
): string {
  const model =
    example === "generic"
      ? { label: "Alcance:", detailHtml: "Médio · até 15 metros" }
      : example === "long"
        ? {
            label: "Resistência:",
            detailHtml: "Reflexos · <strong>DT 24</strong> · evita completamente os efeitos do ritual",
          }
        : {
            label: "Resistência:",
            detailHtml: "Fortitude · <strong>DT 22</strong> · reduz dano à metade",
          };

  return renderChatCardShell({ content: renderMetadataDetailRow(model) });
}

function ritualSingleTargetCardExample(
  example: Exclude<RitualSingleTargetCardExample, "all">,
): RitualSingleTargetCardViewModel {
  const failure = example === "failure";
  const long = example === "long";
  const header: ChatCardHeaderViewModel = {
    title: long
      ? "Eletrocussão Extraordinariamente Prolongada para Validar Quebras Naturais"
      : "Eletrocussão",
    subtitle: "Padrão",
    badges: [{ label: "ENERGIA 1" }],
    context: long
      ? "Mercy → Criatura paranormal com um nome excepcionalmente longo para validar o contexto"
      : "Mercy → Malvadão",
  };
  const metadata: RitualMetadataViewModel = {
    items: long
      ? [
          { text: "1 PE gasto em uma conjuração cuidadosamente preparada" },
          { text: "Alvo: Uma criatura paranormal excepcionalmente distante" },
          { text: "Duração: Enquanto a concentração do conjurador for mantida" },
        ]
      : [
          { text: "1 PE gasto" },
          { text: "Alvo: 1 Ser" },
          { text: "Duração: Instantânea" },
        ],
  };
  const conjuration: RitualConjurationSectionViewModel = {
    status: failure ? "failure" : "success",
    skillLabel: "Ocultismo",
    total: failure ? 17 : 23,
    difficultyClass: 21,
    formula: "1d20 + 10 + 5",
    diceResults: [failure ? 2 : 8],
    consequence: failure ? "Dano de Sanidade" : undefined,
  };

  return {
    header,
    metadata,
    detailRows: [
      {
        label: "Alcance:",
        detailHtml: long
          ? "Extremamente longo · até uma distância paranormal que exige quebra defensiva"
          : "Curto · até 9 metros",
      },
    ],
    conjuration,
    damage: failure
      ? undefined
      : {
          damageType: long
            ? "Eletricidade paranormal prolongada e intensamente concentrada"
            : "Eletricidade",
          formula: long ? "3d6 + 2d8 + 5" : "3d6",
          total: long ? 21 : 9,
          diceResults: long ? [2, 3, 4, 5, 2] : [2, 3, 4],
        },
    resistance: failure
      ? undefined
      : {
          skill: "Fortitude",
          difficultyLabel: "DT 22",
          outcome: long
            ? "reduz o dano paranormal recebido à metade e evita efeitos adicionais prolongados"
            : "reduz dano à metade",
          action: { ariaLabel: "Rolar resistência de Fortitude" },
        },
  };
}

function createExampleMessage(
  content: string,
  kind:
    | "header"
    | "section"
    | "status"
    | "dice-action-button"
    | "roll-row"
    | "ritual-conjuration"
    | "ritual-damage"
    | "ritual-resistance"
    | "ritual-metadata"
    | "metadata-detail-row"
    | "ritual-single-target-card",
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
    async postDiceActionButtonExample(example) {
      requireGm();
      const examples =
        example === "all" ? (["enabled", "disabled"] as const) : [example];
      return Promise.all(
        examples.map((item) =>
          createExampleMessage(
            renderDiceActionButtonExample(item),
            "dice-action-button",
          ),
        ),
      );
    },
    async postRollRowExample(example) {
      requireGm();
      const examples =
        example === "all"
          ? ([
              "with-result-success",
              "with-result-failure",
              "damage-collapsed",
              "damage-expanded",
              "without-result-collapsed",
              "without-result-expanded",
            ] as const)
          : [example];
      return Promise.all(
        examples.map((item) =>
          createExampleMessage(renderRollRowExample(item), "roll-row"),
        ),
      );
    },
    async postRitualConjurationSectionExample(example) {
      requireGm();
      const examples =
        example === "all"
          ? (["success", "failure", "failure-consequence", "expanded"] as const)
          : [example];
      return Promise.all(
        examples.map((item) =>
          createExampleMessage(
            renderRitualConjurationExample(item),
            "ritual-conjuration",
          ),
        ),
      );
    },
    async postRitualDamageSectionExample(example) {
      requireGm();
      const examples =
        example === "all"
          ? (["collapsed", "expanded", "without-result", "long-type"] as const)
          : [example];
      return Promise.all(
        examples.map((item) =>
          createExampleMessage(
            renderRitualDamageExample(item),
            "ritual-damage",
          ),
        ),
      );
    },
    async postRitualResistanceSectionExample(example) {
      requireGm();
      const examples =
        example === "all" ? (["enabled", "disabled", "long"] as const) : [example];
      return Promise.all(
        examples.map((item) =>
          createExampleMessage(
            renderRitualResistanceExample(item),
            "ritual-resistance",
          ),
        ),
      );
    },
    async postRitualMetadataExample(example) {
      requireGm();
      const examples =
        example === "all" ? (["default", "partial", "long"] as const) : [example];
      return Promise.all(
        examples.map((item) =>
          createExampleMessage(
            renderRitualMetadataExample(item),
            "ritual-metadata",
          ),
        ),
      );
    },
    async postMetadataDetailRowExample(example) {
      requireGm();
      const examples =
        example === "all" ? (["short", "long", "generic"] as const) : [example];
      return Promise.all(
        examples.map((item) =>
          createExampleMessage(
            renderMetadataDetailRowExample(item),
            "metadata-detail-row",
          ),
        ),
      );
    },
    async postRitualSingleTargetCardExample(example) {
      requireGm();
      const examples =
        example === "all" ? (["success", "failure", "long"] as const) : [example];
      return Promise.all(
        examples.map((item) =>
          createExampleMessage(
            renderRitualSingleTargetCard(ritualSingleTargetCardExample(item)),
            "ritual-single-target-card",
          ),
        ),
      );
    },
    clearChatCardExamples,
    clearChatCardHeaderExamples: clearChatCardExamples,
  };
}
