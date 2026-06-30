import { MODULE_ID, MODULE_TITLE } from "./constants";
import { registerGlobalApi } from "./core/global-api";
import { ModuleLogger } from "./core/module-logger";
import { SystemGuard } from "./core/system-guard";
import { registerDebugOutputSettings } from "./debug/output/debug-output-settings";
import { registerChatEnrichmentRenderer } from "./features/chat/chat-enrichment-renderer";
import { registerChatTargetCapture } from "./features/chat/chat-target-capture";
import { registerConditionLifecycleHooks } from "./features/conditions/condition-lifecycle-hooks";
import { registerDiceAnimationSettings } from "./features/dice/dice-animation-settings";
import { registerItemUseSettings } from "./features/item-use/item-use-settings";
import { registerItemUseWorkflowDiceToggle } from "./features/item-use/item-use-workflow-dice-toggle";
import { registerRitualLogActionCleanup } from "./features/item-use/chat-card/ritual-log-action-cleanup";
import { createToolkitServices, type ToolkitServices } from "./toolkit-services";
import { registerActorSheetRitualPresetAction } from "./ui/actor-sheet-actions/actor-sheet-ritual-preset-action";
import { registerItemSheetRitualRollConfigBlock } from "./ui/item-sheet-actions/item-sheet-ritual-roll-config-block";

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
      `Sistema não suportado: ${SystemGuard.getCurrentSystemId()}. O módulo requer ordemparanormal.`,
    );
    return;
  }

  services = createToolkitServices();
  services.itemUseIntegration.registerStrategies();
  registerConditionLifecycleHooks(services.conditions);
  registerGlobalApi(services);
  registerChatTargetCapture();
  registerChatEnrichmentRenderer();
  registerRitualLogActionCleanup();
  registerActorSheetRitualPresetAction(services);
  registerItemSheetRitualRollConfigBlock();

  ModuleLogger.info("Inicializado para o sistema Ordem Paranormal.");
  ModuleLogger.info(
    `API de debug disponível em globalThis["${MODULE_ID}"] e globalThis.ParanormalToolkit.`,
  );
  ui.notifications?.info(`${MODULE_TITLE} inicializado.`);
});

export function getToolkitServices(): ToolkitServices {
  if (!services) {
    throw new Error("Paranormal Toolkit ainda não foi inicializado para Ordem Paranormal.");
  }

  return services;
}
