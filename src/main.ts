import { MODULE_ID, MODULE_TITLE } from "./constants";
import { registerGlobalApi } from "./core/global-api";
import { ModuleLogger } from "./core/module-logger";
import { SystemGuard } from "./core/system-guard";
import { registerDebugOutputSettings } from "./debug/output/debug-output-settings";
import { registerChatEnrichmentRenderer } from "./features/chat/chat-enrichment-renderer";
import { registerChatTargetCapture } from "./features/chat/chat-target-capture";
import { registerDiceAnimationSettings } from "./features/dice/dice-animation-settings";
import { registerItemUseSettings } from "./features/item-use/item-use-settings";
import { registerItemUseWorkflowDiceToggle } from "./features/item-use/item-use-workflow-dice-toggle";
import { createToolkitServices, type ToolkitServices } from "./toolkit-services";
import { registerActorSheetRitualPresetAction } from "./ui/actor-sheet-actions/actor-sheet-ritual-preset-action";

let services: ToolkitServices | null = null;

Hooks.once("init", () => {
  registerDebugOutputSettings();
  registerItemUseSettings();
  registerDiceAnimationSettings();
  registerItemUseWorkflowDiceToggle();
  ModuleLogger.info("Inicializando módulo.");
});

Hooks.once("ready", () => {
  if (!SystemGuard.isSupportedSystem()) {
    ModuleLogger.warn(
      `Sistema não suportado: ${SystemGuard.getCurrentSystemId()}. O módulo requer ordemparanormal.`
    );
    return;
  }

  services = createToolkitServices();
  services.itemUseIntegration.registerStrategies();
  registerGlobalApi(services);
  registerChatTargetCapture();
  registerChatEnrichmentRenderer();
  registerActorSheetRitualPresetAction(services);

  ModuleLogger.info("Inicializado para o sistema Ordem Paranormal.");
  ModuleLogger.info(`API de debug disponível em globalThis["${MODULE_ID}"] e globalThis.ParanormalToolkit.`);
  ui.notifications?.info(`${MODULE_TITLE} inicializado.`);
});

export function getToolkitServices(): ToolkitServices {
  if (!services) {
    throw new Error("Paranormal Toolkit ainda não foi inicializado para Ordem Paranormal.");
  }

  return services;
}
