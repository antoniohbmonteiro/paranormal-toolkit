import { OrdemAdapter, ResourceSpendFailure } from "../adapters/ordem/ordem-adapter";
import { ActorResolver } from "../core/actor-resolver";
import { ChatMessageService } from "../core/chat-message-service";
import { ModuleLogger } from "../core/module-logger";

export type ActorDebugApi = {
  getSelected(): Actor | null;
  logResources(): void;
  spendPE(amount: number): Promise<void>;
};

export function createActorDebugApi(adapter: OrdemAdapter): ActorDebugApi {
  return {
    getSelected(): Actor | null {
      return ActorResolver.getSelectedActor();
    },

    logResources(): void {
      const actor = getSelectedActorOrNotify(
        "Nenhum ator encontrado. Selecione um token ou defina um personagem para o usuário."
      );

      if (!actor) return;

      const snapshot = adapter.getActorSnapshot(actor);
      ModuleLogger.info("Recursos do ator selecionado:", snapshot);
    },

    async spendPE(amount: number): Promise<void> {
      const actor = getSelectedActorOrNotify("Nenhum ator encontrado para gastar PE.");

      if (!actor) return;

      const result = await adapter.spendPE(actor, amount);

      if (!result.ok) {
        handleSpendPEFailure(result.error);
        return;
      }

      const spend = result.value;

      try {
        await ChatMessageService.createResourceSpendMessage({
          actor,
          resourceLabel: spend.resource,
          amount: spend.amount,
          before: spend.before,
          after: spend.after
        });
      } catch (error) {
        ModuleLogger.error("PE foi gasto, mas falhou ao criar o chat card.", error);
        ui.notifications?.error("Paranormal Toolkit: PE gasto, mas falhou ao criar mensagem no chat.");
      }

      ModuleLogger.info(`PE gasto: ${amount}. Recursos atualizados:`, spend.snapshot);
    }
  };
}

function getSelectedActorOrNotify(warningMessage: string): Actor | null {
  const actor = ActorResolver.getSelectedActor();

  if (!actor) {
    ModuleLogger.warn(warningMessage);
    ui.notifications?.warn("Paranormal Toolkit: nenhum ator selecionado.");
    return null;
  }

  return actor;
}

function handleSpendPEFailure(failure: ResourceSpendFailure): void {
  if (failure.reason === "update-failed") {
    ModuleLogger.error(failure.message, failure.cause ?? failure);
    ui.notifications?.error(`Paranormal Toolkit: ${failure.message}`);
    return;
  }

  ModuleLogger.warn(`Gasto de PE não realizado: ${failure.message}`, failure);
  ui.notifications?.warn(`Paranormal Toolkit: ${failure.message}`);
}
