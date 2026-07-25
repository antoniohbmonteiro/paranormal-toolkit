import { MODULE_ID } from "../constants";
import { createDebugApi, DebugApi } from "../debug/debug-api";
import { PARANORMAL_TOOLKIT_HOOKS } from "./public-api/paranormal-toolkit-hooks";
import {
  createConditionApi,
  type ToolkitConditionApi,
} from "../features/conditions/condition-api";
import type { ToolkitServices } from "../toolkit-services";
import { renderChatCardHeader } from "../ui/components/chat/chat-card-header";
import { renderChatCardShell } from "../ui/components/chat/chat-card-shell";

type RitualHeaderExample = "single" | "none" | "multi";

type DevelopmentApi = {
  /** @deprecated Temporary visual-validation helper; remove after header migration. */
  postRitualHeaderExample(example: RitualHeaderExample): Promise<unknown>;
};

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
  /** Internal development helpers. Not a stable public API. */
  dev: DevelopmentApi;
  hooks: typeof PARANORMAL_TOOLKIT_HOOKS;
};

function createDevelopmentApi(): DevelopmentApi {
  return {
    async postRitualHeaderExample(example) {
      if (!game.user?.isGM) {
        throw new Error("Apenas GMs podem publicar o exemplo de cabeçalho de ritual.");
      }

      const targets: Record<RitualHeaderExample, string> = {
        single: "Malvadão",
        none: "Nenhum alvo",
        multi: "3 alvos",
      };
      const target = targets[example];
      if (!target) {
        throw new Error('Exemplo inválido. Use "single", "none" ou "multi".');
      }

      return ChatMessage.create({
        content: renderChatCardShell({
          content: renderChatCardHeader({
            imageUrl: "icons/sundries/books/book-symbol-reverse-blue.webp",
            imageAlt: "Ícone do ritual Eletrocussão",
            eyebrow: "Ritual",
            title: "Eletrocussão",
            target,
            badge: { label: "Energia 1", tone: "energy" },
          }),
        }),
      });
    },
  };
}

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
  if (module) {
    module.api = api;
  }

  return api;
}
