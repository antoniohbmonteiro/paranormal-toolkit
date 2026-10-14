import { MODULE_ID } from "../../constants";
import { FoundryAllyStore } from "../../adapters/foundry/foundry-ally-store";
import { FoundryAllyEnvironment, ALLY_REQUEST_FLAG } from "../../adapters/foundry/foundry-ally-request-adapter";
import { OrdemAllyBenefitAdapter } from "../../adapters/ordem/ordem-ally-benefit-adapter";
import { readAllyRequest } from "./ally-operation-authority";
import { AllyReconciliationService } from "./ally-reconciliation-service";
import { AllySupportService } from "./ally-support-service";
import { ALLY_TYPE } from "./config/ally-ability-config";

export function registerAllyLifecycleHooks(): AllySupportService {
  const environment = new FoundryAllyEnvironment();
  let service: AllySupportService;
  const effects = new OrdemAllyBenefitAdapter(() => {
    if (!service.isExecutor()) throw new Error("O GM executor mudou.");
  });
  service = new AllySupportService(new FoundryAllyStore(() => {
    if (!service.isExecutor()) throw new Error("O GM executor mudou.");
  }), environment, new AllyReconciliationService(effects));
  const report = (error: unknown): void => {
    console.error("Paranormal Toolkit | Allies", error);
    ui.notifications?.warn(error instanceof Error ? error.message : "Falha ao reconciliar Aliados.");
  };
  const reconcile = (): void => { void service.reconcile().catch(report); };
  Hooks.on("updateActor", (actor: Actor, changes: Record<string, unknown>, _options: unknown, userId: string) => {
    if (actor.type !== ALLY_TYPE) return;
    const nested = (changes.flags as Record<string, Record<string, unknown>> | undefined)?.[MODULE_ID]?.[ALLY_REQUEST_FLAG];
    const value = nested ?? changes[`flags.${MODULE_ID}.${ALLY_REQUEST_FLAG}`];
    if (value !== undefined) {
      const request = readAllyRequest(value);
      if (!request) { if (service.isExecutor()) report(new Error("Solicitação de suporte inválida.")); return; }
      void service.process(actor.id!, request, userId).catch(report);
    }
  });
  for (const name of ["createItem", "updateItem", "deleteItem"]) {
    Hooks.on(name, (item: Item) => { if (item.parent?.type === ALLY_TYPE) reconcile(); });
  }
  Hooks.on("deleteActor", reconcile);
  Hooks.on("updateCombat", reconcile);
  Hooks.on("deleteCombat", reconcile);
  Hooks.on("userConnected", reconcile);
  Hooks.on("updateUser", reconcile);
  // Own projection writes carry this option; external edits still trigger recovery.
  for (const name of ["createActiveEffect", "updateActiveEffect", "deleteActiveEffect"]) {
    Hooks.on(name, (_effect: unknown, _changesOrOptions: unknown, optionsOrUser: unknown) => {
      const options = name === "updateActiveEffect" ? optionsOrUser : _changesOrOptions;
      if (!(options as { allyReconciliation?: boolean } | undefined)?.allyReconciliation) reconcile();
    });
  }
  reconcile();
  return service;
}
