import { MODULE_ID, MODULE_TITLE } from "./constants";
import { registerGlobalApi } from "./core/global-api";
import { ModuleLogger } from "./core/module-logger";
import { SystemGuard } from "./core/system-guard";
import { registerChatEnrichmentRenderer } from "./features/chat/chat-enrichment-renderer";
import { registerChatTargetCapture } from "./features/chat/chat-target-capture";
import { createToolkitServices, type ToolkitServices } from "./toolkit-services";

let services: ToolkitServices | null = null;

Hooks.once("init", () => {
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
  registerGlobalApi(services);
  registerChatTargetCapture();
  registerChatEnrichmentRenderer();

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
