import { OrdemAdapter } from "../adapters/ordem/ordem-adapter";
import { ActorResolver } from "../core/actor-resolver";
import { ChatMessageService } from "../core/chat-message-service";
import { ModuleLogger } from "../core/module-logger";
import type { ResourceOperationResult } from "../core/resources/resource-engine";
import type { ResourceOperationFailure } from "../core/resources/resource-transaction";

export type ActorDebugApi = {
  getSelected(): Actor | null;
  logResources(): void;
  spendPE(amount: number): Promise<void>;
  spendPD(amount: number): Promise<void>;
  damagePV(amount: number): Promise<void>;
  healPV(amount: number): Promise<void>;
  damageSAN(amount: number): Promise<void>;
  recoverSAN(amount: number): Promise<void>;
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
      await runResourceOperation(
        "Gasto de PE",
        getSelectedActorOrNotify("Nenhum ator encontrado para gastar PE."),
        (actor) => adapter.spendPE(actor, amount)
      );
    },

    async spendPD(amount: number): Promise<void> {
      await runResourceOperation(
        "Gasto de PD",
        getSelectedActorOrNotify("Nenhum ator encontrado para gastar PD."),
        (actor) => adapter.spendPD(actor, amount)
      );
    },

    async damagePV(amount: number): Promise<void> {
      await runResourceOperation(
        "Dano em PV",
        getSelectedActorOrNotify("Nenhum ator encontrado para causar dano em PV."),
        (actor) => adapter.damagePV(actor, amount)
      );
    },

    async healPV(amount: number): Promise<void> {
      await runResourceOperation(
        "Cura de PV",
        getSelectedActorOrNotify("Nenhum ator encontrado para curar PV."),
        (actor) => adapter.healPV(actor, amount)
      );
    },

    async damageSAN(amount: number): Promise<void> {
      await runResourceOperation(
        "Dano em SAN",
        getSelectedActorOrNotify("Nenhum ator encontrado para causar dano em SAN."),
        (actor) => adapter.damageSAN(actor, amount)
      );
    },

    async recoverSAN(amount: number): Promise<void> {
      await runResourceOperation(
        "Recuperação de SAN",
        getSelectedActorOrNotify("Nenhum ator encontrado para recuperar SAN."),
        (actor) => adapter.recoverSAN(actor, amount)
      );
    }
  };
}

async function runResourceOperation(
  label: string,
  actor: Actor | null,
  operation: (actor: Actor) => Promise<ResourceOperationResult>
): Promise<void> {
  if (!actor) return;

  const result = await operation(actor);

  if (!result.ok) {
    handleResourceFailure(result.error);
    return;
  }

  const transaction = result.value;

  try {
    await ChatMessageService.createResourceOperationMessage({ transaction });
  } catch (error) {
    ModuleLogger.error(`${label} realizado, mas falhou ao criar o chat card.`, error);
    ui.notifications?.error("Paranormal Toolkit: recurso alterado, mas falhou ao criar mensagem no chat.");
  }

  ModuleLogger.info(`${label} realizado:`, transaction);
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

function handleResourceFailure(failure: ResourceOperationFailure): void {
  if (failure.reason === "update-failed") {
    ModuleLogger.error(failure.message, failure.cause ?? failure);
    ui.notifications?.error(`Paranormal Toolkit: ${failure.message}`);
    return;
  }

  ModuleLogger.warn(`Operação de recurso não realizada: ${failure.message}`, failure);
  ui.notifications?.warn(`Paranormal Toolkit: ${failure.message}`);
}
