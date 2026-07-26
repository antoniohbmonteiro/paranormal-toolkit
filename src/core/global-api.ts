import { MODULE_ID } from "../constants";
import { createDebugApi, DebugApi } from "../debug/debug-api";
import { PARANORMAL_TOOLKIT_HOOKS } from "./public-api/paranormal-toolkit-hooks";
import {
  createConditionApi,
  type ToolkitConditionApi,
} from "../features/conditions/condition-api";
import type { ToolkitServices } from "../toolkit-services";
import {
  renderChatCardHeader,
  type ChatCardHeaderViewModel,
} from "../ui/components/chat/chat-card-header";
import { renderChatCardShell } from "../ui/components/chat/chat-card-shell";

type ChatCardHeaderExample =
  | "single"
  | "none"
  | "multi"
  | "long-title"
  | "long-context"
  | "ability"
  | "runtime";

type DevelopmentApi = {
  /** @deprecated Temporary visual QA helper; remove after production migration. */
  postChatCardHeaderExample(example: ChatCardHeaderExample): Promise<unknown>;
  /** @deprecated Removes only messages created by postChatCardHeaderExample. */
  clearChatCardHeaderExamples(): Promise<void>;
};

const CHAT_CARD_HEADER_EXAMPLE_FLAG = "devChatCardHeaderExample";

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

  const contexts: Record<Exclude<ChatCardHeaderExample, "runtime" | "ability">, string> = {
    single: "Mercy → Malvadão",
    none: "Mercy → Nenhum alvo",
    multi: "Mercy → 3 alvos",
    "long-title": "Mercy → Malvadão",
    "long-context":
      "Mercy → Criatura paranormal com um nome excepcionalmente longo para validar a quebra natural do contexto",
  };
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

function createDevelopmentApi(): DevelopmentApi {
  return {
    async postChatCardHeaderExample(example) {
      requireGm();
      const content = renderChatCardShell({
        content: renderChatCardHeader(exampleHeaderModel(example)),
      });
      return ChatMessage.create({
        content,
        flags: { [MODULE_ID]: { [CHAT_CARD_HEADER_EXAMPLE_FLAG]: true } },
      });
    },
    async clearChatCardHeaderExamples() {
      requireGm();
      const messages = game.messages.contents ?? [];
      const examples = messages.filter(
        (message) => message.getFlag?.(MODULE_ID, CHAT_CARD_HEADER_EXAMPLE_FLAG) === true,
      );
      await Promise.all(
        examples.map((message) =>
          (message as ChatMessageDocumentLike & { delete?: () => Promise<unknown> }).delete?.(),
        ),
      );
    },
  };
}

export type ParanormalToolkitApi = {
  services: ToolkitServices;
  ordem: ToolkitServices["ordem"];
  resources: ToolkitServices["resources"];
  damage: ToolkitServices["damage"];
  ritualCosts: ToolkitServices["ritualCosts"];
  automation: ToolkitServices["automation"];
  automationRegistry: ToolkitServices["automationRegistry"];
  automationBinder: ToolkitServices["automationBinder"];
  workflow: ToolkitServices["workflow"];
  itemUseIntegration: ToolkitServices["itemUseIntegration"];
  conditions: ToolkitConditionApi;
  debug: DebugApi;
  /** Internal development helpers; not a stable public API. */
  dev: DevelopmentApi;
  hooks: typeof PARANORMAL_TOOLKIT_HOOKS;
};

export function registerGlobalApi(
  services: ToolkitServices,
): ParanormalToolkitApi {
  const api: ParanormalToolkitApi = {
    services,
    ordem: services.ordem,
    resources: services.resources,
    damage: services.damage,
    ritualCosts: services.ritualCosts,
    automation: services.automation,
    automationRegistry: services.automationRegistry,
    automationBinder: services.automationBinder,
    workflow: services.workflow,
    itemUseIntegration: services.itemUseIntegration,
    conditions: createConditionApi(services.conditions),
    debug: createDebugApi(services),
    dev: createDevelopmentApi(),
    hooks: PARANORMAL_TOOLKIT_HOOKS,
  };

  const globalObject = globalThis as typeof globalThis &
    Record<string, unknown> & {
      ParanormalToolkit?: ParanormalToolkitApi;
    };

  globalObject[MODULE_ID] = api;
  globalObject.ParanormalToolkit = api;
  const module = game.modules.get(MODULE_ID) as
    | { api?: ParanormalToolkitApi }
    | undefined;
  if (module) module.api = api;

  return api;
}
