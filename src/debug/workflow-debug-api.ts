import { ActorResolver } from "../core/actor-resolver";
import type { AutomationRunFailure } from "../core/automation/automation-runner";
import { ModuleLogger } from "../core/module-logger";
import type { ToolkitServices } from "../toolkit-services";
import { getFirstActorItem, getFirstActorItemWithAutomation } from "../features/automation/actor-item-resolver";
import { readAutomationDefinition } from "../features/automation/automation-flag-reader";
import { GENERIC_SIMPLE_HEALING_PRESET_ID } from "../features/rituals/ritual-automation-presets";
import { getCurrentSourceTokenRef, getCurrentWorkflowTargets } from "../features/automation/workflow-target-resolver";
import { createWorkflowDebugSnapshot, type WorkflowDebugSnapshot } from "../core/workflow/workflow-debug-snapshot";
import { WORKFLOW_PHASES, type WorkflowPhase } from "../core/workflow/workflow-phase";

export type WorkflowDebugApi = {
  phases(): readonly WorkflowPhase[];
  lastContext(): WorkflowDebugSnapshot | null;
  runFirstAutomation(): Promise<void>;
  runSelectedItemAutomation(): Promise<void>;
  runItemAutomationByUuid(uuid: string): Promise<void>;
  setTestHealingAutomationOnFirstItem(): Promise<void>;
};

export function createWorkflowDebugApi(services: ToolkitServices): WorkflowDebugApi {
  return {
    phases(): readonly WorkflowPhase[] {
      return WORKFLOW_PHASES;
    },

    lastContext(): WorkflowDebugSnapshot | null {
      return services.workflow.getLastDebugSnapshot();
    },
    async runFirstAutomation(): Promise<void> {
      const actor = getSelectedActorOrNotify("Nenhum ator encontrado para executar automação.");

      if (!actor) return;

      const item = getFirstActorItemWithAutomation(actor);

      if (!item) {
        ModuleLogger.warn("Nenhum item com automação encontrado no ator selecionado.");
        ui.notifications?.warn("Paranormal Toolkit: nenhum item com automação encontrado.");
        return;
      }

      await runItemAutomation(services, actor, item);
    },

    async runSelectedItemAutomation(): Promise<void> {
      await this.runFirstAutomation();
    },

    async runItemAutomationByUuid(uuid: string): Promise<void> {
      if (!uuid || typeof uuid !== "string") {
        ui.notifications?.warn("Paranormal Toolkit: UUID inválido.");
        return;
      }

      const document = await fromUuid(uuid);

      if (!isItem(document)) {
        ModuleLogger.warn(`UUID não resolveu para um Item: ${uuid}`, document);
        ui.notifications?.warn("Paranormal Toolkit: UUID não é de um item.");
        return;
      }

      const actor = resolveItemActor(document) ?? getSelectedActorOrNotify("Nenhum ator encontrado para executar automação do item.");

      if (!actor) return;

      await runItemAutomation(services, actor, document);
    },

    async setTestHealingAutomationOnFirstItem(): Promise<void> {
      const actor = getSelectedActorOrNotify("Nenhum ator encontrado para configurar automação de teste.");

      if (!actor) return;

      const item = getFirstActorItem(actor);

      if (!item) {
        ModuleLogger.warn("Ator selecionado não possui itens.");
        ui.notifications?.warn("Paranormal Toolkit: ator selecionado não possui itens.");
        return;
      }

      try {
        const preset = services.automationRegistry.require(GENERIC_SIMPLE_HEALING_PRESET_ID);

        if (!preset.ok) {
          ModuleLogger.warn(preset.error.message, preset.error);
          ui.notifications?.warn(`Paranormal Toolkit: ${preset.error.message}`);
          return;
        }

        await services.automationBinder.applyPreset(item, preset.value);
        ModuleLogger.info(`Preset de teste aplicado ao item: ${item.name}.`);
        ui.notifications?.info(`Paranormal Toolkit: automação de teste aplicada em ${item.name}.`);
      } catch (cause) {
        ModuleLogger.error("Falha ao configurar automação de teste no item.", cause);
        ui.notifications?.error("Paranormal Toolkit: falha ao configurar automação de teste.");
      }
    }
  };
}

async function runItemAutomation(services: ToolkitServices, actor: Actor, item: Item): Promise<void> {
  const definition = readAutomationDefinition(item);

  if (!definition.ok) {
    ModuleLogger.warn(definition.error.message, definition.error);
    ui.notifications?.warn(`Paranormal Toolkit: ${definition.error.message}`);
    return;
  }

  const result = await services.workflow.runAutomation(definition.value, {
    sourceActor: actor,
    sourceToken: getCurrentSourceTokenRef(),
    item,
    targets: getCurrentWorkflowTargets()
  });

  if (!result.ok) {
    handleAutomationFailure(result.error);
    return;
  }

  ModuleLogger.info("Automação executada com sucesso.", createWorkflowDebugSnapshot(result.value.context));
}

function handleAutomationFailure(failure: AutomationRunFailure): void {
  const message = `Automação falhou: ${failure.message}`;

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

function resolveItemActor(item: Item): Actor | null {
  const parent = item.parent;
  return parent instanceof Actor ? parent : null;
}

function isItem(value: unknown): value is Item {
  return Boolean(value && typeof value === "object" && "getFlag" in value && "setFlag" in value);
}
