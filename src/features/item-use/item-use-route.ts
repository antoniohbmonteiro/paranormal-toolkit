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
  constructor(private readonly classify: (context: ItemUseContext) => ManagedItemClassification,
    private readonly submit: (context: ItemUseContext) => Promise<void>,
    private readonly report: (error: unknown) => void,
    readonly interceptAction?: ManagedItemUseInterceptor["interceptAction"],
    readonly executePending?: ManagedItemUseInterceptor["executePending"]) {}
  async intercept(context: ItemUseContext): Promise<boolean> {
    const classification = this.classify(context);
    if (classification === "ordinary") return false;
    if (classification === "blocked") { this.report(new Error("Concessão ou índice de roteamento inválido. Solicite reconciliação ao GM.")); return true; }
    const id = (context.message as { id?: string } | undefined)?.id;
    if (!id) { this.report(new Error("Uso gerenciado exige a mensagem nativa original.")); return true; }
    if (!this.submissions.has(id)) {
      // Claim synchronously before either listener can submit an asynchronous request.
      const pending = Promise.resolve().then(() => this.submit(context)).catch(this.report);
      this.submissions.set(id, pending);
      if (this.submissions.size > 512) this.submissions.delete(this.submissions.keys().next().value!);
    }
    await this.submissions.get(id);
    return true;
  }
}
