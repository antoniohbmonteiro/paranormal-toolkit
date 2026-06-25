import { MODULE_TITLE } from "./constants";
import { OrdemAdapter } from "./adapters/ordem/ordem-adapter";
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

  ModuleLogger.info("Inicializado para o sistema Ordem Paranormal.");
  ui.notifications?.info(`${MODULE_TITLE} inicializado.`);
});

export function getOrdemAdapter(): OrdemAdapter {
  if (!ordemAdapter) {
    throw new Error("Paranormal Toolkit ainda não foi inicializado para Ordem Paranormal.");
  }

  return ordemAdapter;
}
