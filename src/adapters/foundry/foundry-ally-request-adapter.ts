import { MODULE_ID } from "../../constants";
import { FoundryAllyStore } from "./foundry-ally-store";
import { resolveFoundryAllyActor, reportAllyActorResolution } from "./foundry-ally-actor-resolver";
import type { AllyCombatSnapshot } from "../../core/allies/ally-support-state";
import { getActorItems } from "../../features/automation/actor-item-resolver";
import { ALLY_TYPE, readAllyAbility } from "../../features/allies/config/ally-ability-config";
import { electAllyExecutor, readAllyRequest, type AllyRequest, type AllyUser } from "../../features/allies/ally-operation-authority";
import type { AllyLedger, AllySupportEnvironment } from "../../features/allies/ally-support-service";
import type { AllySupportChange } from "../../features/allies/ally-support-notifications";
import { publishAllySupportChange } from "./foundry-ally-notifications";
import { migrateAllyAbilityEffects } from "../../features/allies/ally-effect-migration-service";
import { describeAllyEffect } from "../ordem/ordem-ally-benefit-adapter";
import type { AllyManagedEffect } from "../../features/allies/ally-reconciliation-service";

export const ALLY_REQUEST_FLAG = "allyRequest";
export const ALLY_PRESENTATION_FLAG = "allySupport";

type ChangedProperty = { found: false } | { found: true; value: unknown };

export function readChangedProperty(value: unknown, path: string[]): ChangedProperty {
  if (!value || typeof value !== "object" || Array.isArray(value)) return { found: false };
  const data = value as Record<string, unknown>;
  for (let length = 1; length <= path.length; length++) {
    const key = path.slice(0, length).join(".");
    if (!Object.hasOwn(data, key)) continue;
    if (length === path.length) return { found: true, value: data[key] };
    const child = readChangedProperty(data[key], path.slice(length));
    if (child.found) return child;
  }
  return { found: false };
}

// Undefined means no new submission; null means the submitted snapshot is invalid.
export function readUpdatedAllyRequest(
  actor: Pick<Actor, "getFlag" | "_stats">, changes: Record<string, unknown>, userId: string,
): AllyRequest | null | undefined {
  const path = ["flags", MODULE_ID, ALLY_REQUEST_FLAG];
  const nonce = readChangedProperty(changes, [...path, "id"]);
  if (!nonce.found) return undefined;
  // A later update in the same batch must not inherit the original caller's authority.
  const lastModifiedBy = actor._stats?.lastModifiedBy;
  if (typeof lastModifiedBy === "string" && lastModifiedBy !== userId) return null;
  const value = actor.getFlag(MODULE_ID, ALLY_REQUEST_FLAG);
  const request = readAllyRequest(value);
  if (!request || request.id !== nonce.value) return null;
  const snapshot = value as Record<string, unknown>;
  for (const key of ["id", "revision", "action", "beneficiaryId", "combatId", "scope"]) {
    const change = readChangedProperty(changes, [...path, key]);
    if (change.found && !Object.is(change.value, snapshot[key])) return null;
  }
  return request;
}

export type AllySupportPresentation = {
  revision: number; beneficiaryId: string | null; status: string; waitRound: number | null;
  diagnostic: string | null; available?: boolean;
};
export function allyUsers(): AllyUser[] {
  return Array.from(game.users ?? []).flatMap(user => user.id
    ? [{ id: user.id, isGM: Boolean(user.isGM), active: Boolean(user.active) }] : []);
}
export function readAllyPresentation(actor: Actor): AllySupportPresentation {
  const value = actor.getFlag?.(MODULE_ID, ALLY_PRESENTATION_FLAG) as Partial<AllySupportPresentation> | undefined;
  return {
    revision: Number.isSafeInteger(value?.revision) ? value!.revision! : 0,
    beneficiaryId: typeof value?.beneficiaryId === "string" ? value.beneficiaryId : null,
    status: typeof value?.status === "string" ? value.status : "inactive",
    waitRound: typeof value?.waitRound === "number" ? value.waitRound : null,
    diagnostic: typeof value?.diagnostic === "string" ? value.diagnostic : null,
  };
}
function presentationFromLedger(actor: Actor, ledger: AllyLedger): AllySupportPresentation {
  const link = ledger.links.find(entry => entry.allyId === actor.id);
  return {
    revision: ledger.revision, beneficiaryId: link?.state.beneficiaryId ?? null,
    status: link?.state.status ?? "inactive", waitRound: link?.state.wait?.round ?? null,
    diagnostic: ledger.diagnostic ?? link?.diagnostic ?? null,
  };
}
export async function readAllySupportView(actor: Actor): Promise<AllySupportPresentation> {
  const resolved = resolveFoundryAllyActor(actor);
  if (!resolved) return { revision: 0, beneficiaryId: null, status: "unknown", waitRound: null,
    diagnostic: "Aliado original ausente ou perfil inválido.", available: false };
  actor = resolved;
  if (!game.user?.isGM) return readAllyPresentation(actor);
  try {
    const ledger = await new FoundryAllyStore().load();
    return ledger ? presentationFromLedger(actor, ledger)
      : { revision: 0, beneficiaryId: null, status: "inactive", waitRound: null,
        diagnostic: null };
  } catch (error) {
    return { revision: 0, beneficiaryId: null, status: "unknown", waitRound: null,
      diagnostic: error instanceof Error ? error.message : "Registro operacional indisponível.",
      available: false };
  }
}
export async function submitAllyRequest(
  actor: Actor, action: AllyRequest["action"], fields: { beneficiaryId?: string; combatId?: string } = {},
): Promise<void> {
  const resolved = resolveFoundryAllyActor(actor);
  if (!resolved) { reportAllyActorResolution(actor); throw new Error("Aliado inválido."); }
  if (!game.user || !actor.canUserModify(game.user, "update") || !resolved.canUserModify(game.user, "update")) {
    throw new Error("Sem permissão para solicitar suporte.");
  }
  actor = resolved;
  if (!electAllyExecutor(allyUsers())) throw new Error("Nenhum GM executor conectado. O suporte não foi alterado.");
  const view = await readAllySupportView(actor);
  if (view.available === false) throw new Error(view.diagnostic ?? "Registro operacional indisponível.");
  if (!readAllyRequest({ id: "request-validation", revision: view.revision, action, ...fields })) {
    throw new Error("Solicitação de suporte inválida.");
  }
  await actor.setFlag(MODULE_ID, ALLY_REQUEST_FLAG, {
    id: foundry.utils.randomID(), revision: view.revision, action, ...fields,
  });
}
function snapshot(combat: AllyCombatLike): AllyCombatSnapshot {
  return { id: combat.id, started: combat.started, round: combat.round ?? 0 };
}
export class FoundryAllyEnvironment implements AllySupportEnvironment {
  private migrationFailures = new Set<string>();
  describeEffect(effect: AllyManagedEffect) { return describeAllyEffect(effect); }
  async prepareSources(): Promise<void> {
    const items = [...game.items?.contents ?? [], ...(game.actors.contents ?? []).filter(actor => actor.type === ALLY_TYPE)
      .flatMap(actor => getActorItems(actor))];
    for (const item of items) {
      try { await migrateAllyAbilityEffects(item); }
      catch (error) {
        if (!this.migrationFailures.has(item.uuid)) {
          this.migrationFailures.add(item.uuid); console.error("Paranormal Toolkit | Allies: migração interrompida.", error);
          ui.notifications?.warn(error instanceof Error ? error.message : "Falha ao migrar benefícios antigos.");
        }
      }
    }
  }
  currentUserId(): string | null { return game.user?.id ?? null; }
  users(): AllyUser[] { return allyUsers(); }
  ownsAlly(allyId: string, userId: string): boolean {
    const user = Array.from(game.users).find(entry => entry.id === userId);
    return Boolean(user && game.actors.get?.(allyId)?.canUserModify(user, "update"));
  }
  allyExists(allyId: string): boolean {
    const actor = game.actors.get?.(allyId);
    return Boolean(actor && !actor.isToken && resolveFoundryAllyActor(actor));
  }
  agentExists(id: string): boolean {
    const actor = game.actors.get?.(id);
    return Boolean(actor && actor.type === "agent" && !actor.isToken);
  }
  abilities(allyId: string) {
    const actor = game.actors.get?.(allyId);
    if (!actor) return null;
    const sources = [];
    for (const item of getActorItems(actor).filter(entry => entry.type === "ability" && entry.id)) {
      const definition = readAllyAbility(item);
      if (!definition) return null;
      sources.push({ id: item.id!, definition });
    }
    return sources;
  }
  resolveCombat(allyId: string, beneficiaryId: string, chosenId?: string, previousId?: string): AllyCombatSnapshot | null {
    const actorIds = new Set([allyId, beneficiaryId, previousId]);
    const combats = (game.combats?.contents ?? []).filter(combat => combat.started
      && (combat.combatants.contents ?? []).some(entry => actorIds.has(entry.actorId ?? entry.actor?.id ?? "")));
    if (chosenId) {
      const selected = combats.find(combat => combat.id === chosenId);
      if (!selected) throw new Error("O combate escolhido não envolve o suporte.");
      return snapshot(selected);
    }
    if (combats.length > 1) throw new Error("Há mais de um combate envolvido. Selecione o combate para a troca.");
    return combats[0] ? snapshot(combats[0]) : null;
  }
  combat(id: string): AllyCombatSnapshot | null {
    const combat = game.combats?.get?.(id);
    return combat ? snapshot(combat) : null;
  }
  async notify(change: AllySupportChange): Promise<void> {
    if (!game.user?.isGM || this.currentUserId() !== electAllyExecutor(this.users())) return;
    await publishAllySupportChange(change);
  }
  async publish(ledger: AllyLedger): Promise<void> {
    for (const actor of game.actors.contents ?? []) {
      if (actor.type !== ALLY_TYPE) continue;
      const mirror = presentationFromLedger(actor, ledger);
      const previous = actor.getFlag(MODULE_ID, ALLY_PRESENTATION_FLAG);
      const removals = Object.fromEntries(["pending", "validated", "pendingBeneficiaryId", "pendingAction"]
        .filter(key => previous && typeof previous === "object" && Object.hasOwn(previous, key))
        .map(key => [key, new foundry.data.operators.ForcedDeletion()]));
      if (JSON.stringify(readAllyPresentation(actor)) !== JSON.stringify(mirror) || Object.keys(removals).length) {
        await actor.setFlag(MODULE_ID, ALLY_PRESENTATION_FLAG, { ...mirror, ...removals });
      }
    }
  }
}
