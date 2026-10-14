import { FoundryAllyStore } from "../../adapters/foundry/foundry-ally-store";
import { FoundryAllyEnvironment, readUpdatedAllyRequest } from "../../adapters/foundry/foundry-ally-request-adapter";
import { OrdemAllyBenefitAdapter } from "../../adapters/ordem/ordem-ally-benefit-adapter";
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
  const seenRequests = new WeakMap<Actor, Set<string>>();
  Hooks.on("updateActor", (actor: Actor, changes: Record<string, unknown>, _options: unknown, userId: string) => {
    // Synthetic flags cannot authorize writes to the original world Actor.
    if (actor.type !== ALLY_TYPE || actor.isToken || game.actors.get?.(actor.id!) !== actor || !service.isExecutor()) return;
    const request = readUpdatedAllyRequest(actor, changes, userId);
    if (request === undefined) return;
    if (!request) { report(new Error("Solicitação de suporte inválida.")); return; }
    const seen = seenRequests.get(actor) ?? new Set<string>();
    if (seen.has(request.id)) return;
    seen.add(request.id);
    seenRequests.set(actor, seen);
    return service.process(actor.id!, request, userId).catch(report);
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
  for (const name of ["createActiveEffect", "updateActiveEffect"]) {
    Hooks.on(name, (_effect: unknown, _changesOrOptions: unknown, optionsOrUser: unknown) => {
      const options = name === "updateActiveEffect" ? optionsOrUser : _changesOrOptions;
      if (!(options as { allyReconciliation?: boolean } | undefined)?.allyReconciliation) reconcile();
    });
  }
  Hooks.on("deleteActiveEffect", (effect: { id?: string; parent?: Actor }, options: { allyReconciliation?: boolean }, userId: string) => {
    if (options?.allyReconciliation || !service.isExecutor()) return;
    if (effect.id && effect.parent?.id && !effect.parent.isToken) {
      return service.suppressEffect(effect.parent.id, effect.id, userId).catch(report);
    }
    reconcile();
  });
  reconcile();
  return service;
}
