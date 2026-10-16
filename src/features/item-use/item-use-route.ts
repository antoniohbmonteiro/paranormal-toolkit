import type { ItemUseContext } from "./item-use-context";
import { readAutomationFlagValue } from "../automation/automation-flag-reader";
import { readAbilityRollConfig } from "../abilities/config/ability-roll-config";
import { MODULE_ID } from "../../constants";

export type ManagedItemClassification = "ordinary" | "managed" | "blocked";
export interface ManagedItemUseInterceptor {
  intercept(context: ItemUseContext): Promise<boolean>;
  interceptAction?(message: { id?: unknown; getFlag?: (scope: string, key: string) => unknown }, actionId: string): Promise<boolean>;
  executePending?(pendingId: string): Promise<boolean | undefined>;
}
export function resolveGrantedItemEngine(item: Item): "generic" | "automation" {
  const automation = readAutomationFlagValue(item);
  if (automation.ok) {
    const definition = automation.value.definition;
    if (definition.resistance !== undefined || definition.conditionApplications?.length || Object.keys(definition.ritualForms ?? {}).length
      || Object.keys(definition).some(key => !["version", "label", "steps", "resistance", "conditionApplications", "ritualForms"].includes(key))
      || definition.steps.some(step => step.type === "spendRitualCost") || !definition.steps.length) {
      throw new Error("Esta automação depende de recursos não disponíveis para habilidades. Configuração original preservada.");
    }
    return "automation";
  }
  if (automation.error.reason !== "missing-automation") throw new Error(automation.error.message);
  const raw = item.getFlag(MODULE_ID, "abilityRollConfig");
  const normalized = readAbilityRollConfig(item);
  if (raw != null && (!normalized || (raw as { schemaVersion?: unknown }).schemaVersion !== 1
    || !Array.isArray((raw as { rolls?: unknown }).rolls)
    || (raw as { rolls: unknown[] }).rolls.length !== normalized.rolls.length)) {
    throw new Error("Configuração de rolagens da habilidade inválida.");
  }
  return "generic";
}
export class AllyItemUseGateway implements ManagedItemUseInterceptor {
  private readonly submissions = new Map<string, Promise<void>>();
  private readonly nativeUses = new Map<string, { promise: Promise<void>; resolve(): void; reject(error: unknown): void;
    claimed: boolean; cancelled: boolean; invokeDone: boolean }>();
  constructor(private readonly classify: (context: ItemUseContext) => ManagedItemClassification,
    private readonly submit: (context: ItemUseContext) => Promise<void>,
    private readonly report: (error: unknown) => void,
    readonly interceptAction?: ManagedItemUseInterceptor["interceptAction"],
    readonly executePending?: ManagedItemUseInterceptor["executePending"]) {}
  isNativeUsePending(actorId: string, itemId: string): boolean { return this.nativeUses.has(`${actorId}/${itemId}`); }
  async useNative(actorId: string, itemId: string, invoke: () => Promise<void>): Promise<void> {
    const key = `${actorId}/${itemId}`;
    const existing = this.nativeUses.get(key);
    if (existing) return existing.promise;
    let resolve!: () => void, reject!: (error: unknown) => void;
    const promise = new Promise<void>((done, fail) => { resolve = done; reject = fail; });
    const entry = { promise, resolve, reject, claimed: false, cancelled: false, invokeDone: false };
    this.nativeUses.set(key, entry);
    const timeout = setTimeout(() => {
      if (!entry.claimed) { entry.cancelled = true; reject(new Error("O uso não foi confirmado pelo gateway. Confira o chat antes de tentar novamente.")); }
    }, 120_000);
    void Promise.resolve().then(invoke).then(() => {
      entry.invokeDone = true; if (entry.cancelled) this.nativeUses.delete(key);
    }, error => {
      entry.invokeDone = true;
      if (!entry.claimed) { entry.cancelled = true; reject(error); }
      else this.report(error);
      if (entry.cancelled) this.nativeUses.delete(key);
    });
    try { await promise; }
    finally {
      clearTimeout(timeout);
      if (entry.invokeDone) this.nativeUses.delete(key); else entry.cancelled = true;
    }
  }
  async intercept(context: ItemUseContext): Promise<boolean> {
    const id = (context.message as { id?: string } | undefined)?.id;
    const previous = id && this.submissions.get(id);
    if (previous) { await previous; return true; }
    const native = this.nativeUses.get(`${context.actor?.id}/${context.item.id}`);
    if (native?.cancelled) {
      if (id) this.remember(id, Promise.resolve());
      this.report(new Error("O uso nativo perdeu a confirmação. O evento tardio foi bloqueado; confira o chat.")); return true;
    }
    const classification = this.classify(context);
    if (classification === "ordinary" && !native) return false;
    if (classification !== "managed") {
      const error = new Error(classification === "blocked" ? "Concessão ou índice de roteamento inválido. Solicite reconciliação ao GM."
        : "A concessão mudou antes do uso nativo. A habilidade não foi executada.");
      if (id) this.remember(id, Promise.resolve());
      native?.reject(error);
      this.report(error); return true;
    }
    if (!id) {
      const error = new Error("Uso gerenciado exige a mensagem nativa original.");
      native?.reject(error);
      this.report(error); return true;
    }
    // Claim synchronously; retirement of the index must not reroute the other listener to an ordinary workflow.
    const pending = Promise.resolve().then(() => this.submit(context)).catch(this.report);
    this.remember(id, pending);
    if (native && !native.claimed) {
      native.claimed = true;
      void pending.then(native.resolve, native.reject);
    }
    await pending;
    return true;
  }
  private remember(id: string, pending: Promise<void>): void {
    this.submissions.set(id, pending);
    if (this.submissions.size > 512) this.submissions.delete(this.submissions.keys().next().value!);
  }
}
