import { MODULE_ID } from "../constants";
import { ActorResolver } from "../core/actor-resolver";
import type { AutomationRunFailure } from "../core/automation/automation-runner";
import { ModuleLogger } from "../core/module-logger";
import type { RitualCostResource } from "../core/rituals/ritual-types";
import {
  getTestRitualCostAutomationDefinition,
  getTestRitualDamageAutomationDefinition,
  getTestRitualHealingAutomationDefinition,
  readAutomationDefinition,
  setAutomationDefinition
} from "../features/automation/automation-flag-reader";
import { getCurrentSourceTokenRef, getCurrentWorkflowTargets } from "../features/automation/workflow-target-resolver";
import { getFirstActorRitual } from "../features/rituals/ritual-item-resolver";
import type { ToolkitServices } from "../toolkit-services";

export type RitualDebugApi = {
  logFirstRitualCost(): void;
  setCustomCostOnFirstRitual(amount: number, resource?: RitualCostResource): Promise<void>;
  clearCustomCostOnFirstRitual(): Promise<void>;
  setTestCostAutomationOnFirstRitual(): Promise<void>;
  setTestHealingAutomationOnFirstRitual(formula?: string): Promise<void>;
  setTestDamageAutomationOnFirstRitual(formula?: string): Promise<void>;
  runFirstRitualAutomation(): Promise<void>;
};

export function createRitualDebugApi(services: ToolkitServices): RitualDebugApi {
  return {
    logFirstRitualCost(): void {
      const actor = getSelectedActorOrNotify("Nenhum ator encontrado para consultar custo de ritual.");
      if (!actor) return;

      const ritual = getFirstRitualOrNotify(actor);
      if (!ritual) return;

      const cost = services.ritualCosts.getCost({ actor, ritual });

      if (!cost.ok) {
        ModuleLogger.warn(cost.error.message, cost.error);
        ui.notifications?.warn(`Paranormal Toolkit: ${cost.error.message}`);
        return;
      }

      ModuleLogger.info("Custo do primeiro ritual:", {
        actor: actor.name,
        ritual: ritual.name,
        cost: cost.value
      });

      ui.notifications?.info(
        `Paranormal Toolkit: ${ritual.name} custa ${cost.value.amount} ${cost.value.resource} (${cost.value.circle}º círculo).`
      );
    },

    async setCustomCostOnFirstRitual(amount: number, resource: RitualCostResource = "PE"): Promise<void> {
      const actor = getSelectedActorOrNotify("Nenhum ator encontrado para configurar custo customizado.");
      if (!actor) return;

      const ritual = getFirstRitualOrNotify(actor);
      if (!ritual) return;

      if (!isValidCustomCost(amount, resource)) {
        ui.notifications?.warn("Paranormal Toolkit: custo customizado precisa ser inteiro positivo e recurso PE ou PD.");
        return;
      }

      await ritual.setFlag(MODULE_ID, "ritual.cost", {
        resource,
        amount
      });

      ModuleLogger.info(`Custo customizado aplicado em ${ritual.name}.`, { resource, amount });
      ui.notifications?.info(`Paranormal Toolkit: ${ritual.name} agora custa ${amount} ${resource}.`);
    },

    async clearCustomCostOnFirstRitual(): Promise<void> {
      const actor = getSelectedActorOrNotify("Nenhum ator encontrado para limpar custo customizado.");
      if (!actor) return;

      const ritual = getFirstRitualOrNotify(actor);
      if (!ritual) return;

      await ritual.unsetFlag(MODULE_ID, "ritual.cost");

      ModuleLogger.info(`Custo customizado removido de ${ritual.name}.`);
      ui.notifications?.info(`Paranormal Toolkit: custo customizado removido de ${ritual.name}.`);
    },

    async setTestCostAutomationOnFirstRitual(): Promise<void> {
      const actor = getSelectedActorOrNotify("Nenhum ator encontrado para configurar automação de custo de ritual.");
      if (!actor) return;

      const ritual = getFirstRitualOrNotify(actor);
      if (!ritual) return;

      await setAutomationDefinition(ritual, getTestRitualCostAutomationDefinition());

      ModuleLogger.info(`Automação de custo aplicada ao ritual: ${ritual.name}.`);
      ui.notifications?.info(`Paranormal Toolkit: automação de custo aplicada em ${ritual.name}.`);
    },

    async setTestHealingAutomationOnFirstRitual(formula = "1d8"): Promise<void> {
      const actor = getSelectedActorOrNotify("Nenhum ator encontrado para configurar ritual de cura simples.");
      if (!actor) return;

      const ritual = getFirstRitualOrNotify(actor);
      if (!ritual) return;

      if (!isValidFormula(formula)) {
        ui.notifications?.warn("Paranormal Toolkit: fórmula de cura inválida.");
        return;
      }

      await setAutomationDefinition(ritual, getTestRitualHealingAutomationDefinition(formula));

      ModuleLogger.info(`Automação de cura simples aplicada ao ritual: ${ritual.name}.`, { formula });
      ui.notifications?.info(`Paranormal Toolkit: ritual de cura simples aplicado em ${ritual.name}.`);
    },

    async setTestDamageAutomationOnFirstRitual(formula = "1d8"): Promise<void> {
      const actor = getSelectedActorOrNotify("Nenhum ator encontrado para configurar ritual de dano simples.");
      if (!actor) return;

      const ritual = getFirstRitualOrNotify(actor);
      if (!ritual) return;

      if (!isValidFormula(formula)) {
        ui.notifications?.warn("Paranormal Toolkit: fórmula de dano inválida.");
        return;
      }

      await setAutomationDefinition(ritual, getTestRitualDamageAutomationDefinition(formula));

      ModuleLogger.info(`Automação de dano simples aplicada ao ritual: ${ritual.name}.`, { formula });
      ui.notifications?.info(`Paranormal Toolkit: ritual de dano simples aplicado em ${ritual.name}.`);
    },

    async runFirstRitualAutomation(): Promise<void> {
      const actor = getSelectedActorOrNotify("Nenhum ator encontrado para executar automação de ritual.");
      if (!actor) return;

      const ritual = getFirstRitualOrNotify(actor);
      if (!ritual) return;

      await runRitualAutomation(services, actor, ritual);
    }
  };
}

async function runRitualAutomation(services: ToolkitServices, actor: Actor, ritual: Item): Promise<void> {
  const definition = readAutomationDefinition(ritual);

  if (!definition.ok) {
    ModuleLogger.warn(definition.error.message, definition.error);
    ui.notifications?.warn(`Paranormal Toolkit: ${definition.error.message}`);
    return;
  }

  const result = await services.automation.run(definition.value, {
    sourceActor: actor,
    sourceToken: getCurrentSourceTokenRef(),
    item: ritual,
    targets: getCurrentWorkflowTargets()
  });

  if (!result.ok) {
    handleAutomationFailure(result.error);
    return;
  }

  ModuleLogger.info("Automação de ritual executada com sucesso.", result.value);
}

function handleAutomationFailure(failure: AutomationRunFailure): void {
  const message = `Automação de ritual falhou: ${failure.message}`;

  if (failure.reason === "resource-operation-failed") {
    ModuleLogger.warn(message, failure.cause ?? failure);
    ui.notifications?.warn(`Paranormal Toolkit: ${failure.message}`);
    return;
  }

  if (failure.reason === "chat-card-failed") {
    ModuleLogger.error(message, failure.cause ?? failure);
    ui.notifications?.error(`Paranormal Toolkit: ${failure.message}`);
    return;
  }

  ModuleLogger.warn(message, failure);
  ui.notifications?.warn(`Paranormal Toolkit: ${failure.message}`);
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

function getFirstRitualOrNotify(actor: Actor): Item | null {
  const ritual = getFirstActorRitual(actor);

  if (!ritual) {
    ModuleLogger.warn(`Ator ${actor.name ?? "sem nome"} não possui rituais.`);
    ui.notifications?.warn("Paranormal Toolkit: ator selecionado não possui rituais.");
    return null;
  }

  return ritual;
}

function isValidCustomCost(amount: number, resource: RitualCostResource): boolean {
  return Number.isInteger(amount) && amount > 0 && (resource === "PE" || resource === "PD");
}

function isValidFormula(formula: string): boolean {
  return typeof formula === "string" && formula.trim().length > 0;
}
