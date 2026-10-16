import { FoundryAllyStore } from "../../adapters/foundry/foundry-ally-store";
import { FoundryAllyEnvironment, readChangedProperty, readUpdatedAllyRequest, readAllySupportView, ALLY_PRESENTATION_FLAG, ALLY_RESPONSE_FLAG } from "../../adapters/foundry/foundry-ally-request-adapter";
import { AllyCombatSelectionRequired } from "./ally-operation-authority";
import { OrdemAllyBenefitAdapter } from "../../adapters/ordem/ordem-ally-benefit-adapter";
import { AllyReconciliationService } from "./ally-reconciliation-service";
import { AllySupportService } from "./ally-support-service";
import { ALLY_TYPE } from "./config/ally-ability-config";
import type { ToolkitServices } from "../../toolkit-services";
import { FoundryAllyItemAdapter } from "../../adapters/foundry/foundry-ally-item-adapter";
import { FoundryAllyReceiptAdapter } from "../../adapters/foundry/foundry-ally-receipt-adapter";
import { AllyGrantedAbilityService } from "./ally-granted-ability-service";
import { AllyGrantedAbilityUseService } from "./ally-granted-ability-use-service";
import { AbilityAssistedActionService } from "../abilities/ability-assisted-action-service";
import { ALLY_PILOT_ABILITIES_SETTING_KEY } from "./ally-settings";
import { MODULE_ID } from "../../constants";

export function registerAllyLifecycleHooks(dependencies?: ToolkitServices, refreshSheets: (allyId?: string) => void | Promise<void> = () => {}): AllySupportService {
  const environment = new FoundryAllyEnvironment();
  let service: AllySupportService;
  const assertExecutor = () => { if (!service.isExecutor()) throw new Error("O GM executor mudou."); };
  const items = new FoundryAllyItemAdapter(assertExecutor);
  const effects = new OrdemAllyBenefitAdapter(() => {
    if (!service.isExecutor()) throw new Error("O GM executor mudou.");
  });
  service = new AllySupportService(new FoundryAllyStore(() => {
    if (!service.isExecutor()) throw new Error("O GM executor mudou.");
  }), environment, new AllyReconciliationService(effects), dependencies ? new AllyGrantedAbilityService(items) : undefined);
  if (dependencies) dependencies.allyUses.register(new AllyGrantedAbilityUseService(service, items,
    new FoundryAllyReceiptAdapter(assertExecutor), dependencies.abilityWorkflow,
    dependencies.resourceAdapter, dependencies.workflow, new AbilityAssistedActionService(dependencies.damage, dependencies.resources)), service);
  const report = (error: unknown): void => {
    console.error("Paranormal Toolkit | Allies", error);
    ui.notifications?.warn(error instanceof Error ? error.message : "Falha ao reconciliar Aliados.");
  };
  const reconcile = (): void => { void service.reconcile().catch(report); };
  const refresh = (allyId?: string): void => { void Promise.resolve().then(() => refreshSheets(allyId)).catch(report); };
  for (const event of ["createSetting", "updateSetting"]) Hooks.on(event, (setting: { key?: string }) => {
    if (setting.key !== ALLY_PILOT_ABILITIES_SETTING_KEY) return;
    reconcile(); refresh();
  });
  const seenRequests = new WeakMap<Actor, Set<string>>();
  Hooks.on("updateActor", (actor: Actor, changes: Record<string, unknown>, _options: unknown, userId: string) => {
    const droneChanged = readChangedProperty(changes, ["system", "isDrone"]).found;
    if (readChangedProperty(changes, ["type"]).found) { reconcile(); refresh(); }
    else if (actor.type === ALLY_TYPE && !actor.isToken && droneChanged) reconcile();
    if (actor.type === "agent" && readChangedProperty(changes, ["name"]).found) refresh();
    if (actor.type === ALLY_TYPE && (droneChanged || ["name", "img", "system.description"].some(key => readChangedProperty(changes, key.split(".")).found)
      || ["revision", "pilotId", "abilityRecipientId", "diagnostic", "beneficiaryId", "status"]
      .some(key => readChangedProperty(changes, ["flags", MODULE_ID, ALLY_PRESENTATION_FLAG, key]).found))) {
      refresh((actor.isToken ? actor.token?.baseActor?.id : actor.id) ?? undefined);
    }
    // Synthetic flags cannot authorize writes to the original world Actor.
    if (actor.type !== ALLY_TYPE || actor.isToken || game.actors.get?.(actor.id!) !== actor || !service.isExecutor()) return;
    const request = readUpdatedAllyRequest(actor, changes, userId);
    if (request === undefined) return;
    if (!request) { report(new Error("Solicitação de suporte inválida.")); return; }
    const seen = seenRequests.get(actor) ?? new Set<string>();
    if (seen.has(request.id)) return;
    seen.add(request.id);
    seenRequests.set(actor, seen);
    return service.process(actor.id!, request, userId).then(async () => {
      if (!service.isExecutor()) return;
      await actor.setFlag(MODULE_ID, ALLY_RESPONSE_FLAG, { id: request.id, userId, ok: true, view: await readAllySupportView(actor) });
    }).catch(async error => {
      report(error);
      if (!service.isExecutor()) return;
      await actor.setFlag(MODULE_ID, ALLY_RESPONSE_FLAG, { id: request.id, userId, ok: false, view: await readAllySupportView(actor),
        error: error instanceof Error ? error.message : "Solicitação recusada.",
        combats: error instanceof AllyCombatSelectionRequired ? error.combats : [] });
    }).catch(report);
  });
  for (const name of ["createItem", "updateItem", "deleteItem"]) {
    Hooks.on(name, (item: Item, changesOrOptions: Record<string, unknown>, optionsOrUser: unknown, nativeUserId?: string) => {
      const options = name === "updateItem" ? optionsOrUser : changesOrOptions;
      if ((options as { allyGrantReconciliation?: boolean })?.allyGrantReconciliation) return;
      if (item.parent?.type === ALLY_TYPE) { reconcile(); refresh(item.parent.id ?? undefined); return; }
      if (item.parent?.type !== "agent" || item.parent.isToken) return;
      if (name === "deleteItem" && item.id && item.parent.id) {
        const userId = typeof optionsOrUser === "string" ? optionsOrUser : nativeUserId;
        if (userId) return service.suppressGrant(item.parent.id, item.id, userId).catch(report);
      }
      reconcile();
    });
  }
  Hooks.on("deleteActor", () => { reconcile(); refresh(); });
  Hooks.on("updateCombat", reconcile);
  Hooks.on("deleteCombat", reconcile);
  Hooks.on("createActor", (actor: Actor) => { if (!actor.isToken && ["agent", ALLY_TYPE].includes(actor.type)) refresh(); });
  Hooks.on("userConnected", () => { reconcile(); refresh(); });
  Hooks.on("updateUser", () => { reconcile(); refresh(); });
  // Own projection writes carry this option; external edits still trigger recovery.
  for (const name of ["createActiveEffect", "updateActiveEffect"]) {
    Hooks.on(name, (_effect: unknown, _changesOrOptions: unknown, optionsOrUser: unknown) => {
      const options = name === "updateActiveEffect" ? optionsOrUser : _changesOrOptions;
      const ownWrite = options as { allyReconciliation?: boolean; allyGrantReconciliation?: boolean } | undefined;
      if (!ownWrite?.allyReconciliation && !ownWrite?.allyGrantReconciliation) reconcile();
    });
  }
  Hooks.on("deleteActiveEffect", (effect: { id?: string; parent?: Actor | Item }, options: { allyReconciliation?: boolean; allyGrantReconciliation?: boolean }, userId: string) => {
    if (options?.allyReconciliation || options?.allyGrantReconciliation || !service.isExecutor()) return;
    if (effect.parent?.documentName === "Item") { reconcile(); return; }
    if (effect.id && effect.parent?.documentName === "Actor" && effect.parent.id && !effect.parent.isToken) {
      return service.suppressEffect(effect.parent.id, effect.id, userId).catch(report);
    }
    reconcile();
  });
  reconcile();
  return service;
}
