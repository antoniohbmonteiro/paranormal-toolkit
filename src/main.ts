import { MODULE_ID, MODULE_TITLE } from "./constants";
import { OrdemAdapter } from "./adapters/ordem/ordem-adapter";
import { registerGlobalApi } from "./core/global-api";
import { ModuleLogger } from "./core/module-logger";
import { SystemGuard } from "./core/system-guard";

let ordemAdapter: OrdemAdapter | null = null;

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

  ordemAdapter = new OrdemAdapter();
  registerGlobalApi(ordemAdapter);

  ModuleLogger.info("Inicializado para o sistema Ordem Paranormal.");
  ModuleLogger.info(`API de debug disponível em globalThis["${MODULE_ID}"] e globalThis.ParanormalToolkit.`);
  ui.notifications?.info(`${MODULE_TITLE} inicializado.`);
});

export function getOrdemAdapter(): OrdemAdapter {
  if (!ordemAdapter) {
    throw new Error("Paranormal Toolkit ainda não foi inicializado para Ordem Paranormal.");
  }

  return ordemAdapter;
}
