import { ActorResolver } from "../core/actor-resolver";
import type { AutomationPresetSummary } from "../core/automation/automation-preset";
import { createAutomationPresetSummary } from "../core/automation/automation-preset";
import type { AutomationPresetMatch } from "../core/automation/automation-registry";
import { ModuleLogger } from "../core/module-logger";
import { getFirstActorRitual } from "../features/rituals/ritual-item-resolver";
import type { ToolkitServices } from "../toolkit-services";

export type AutomationPresetMatchDebug = {
  preset: AutomationPresetSummary;
  score: number;
  reasons: string[];
};

export type AutomationDebugApi = {
  listPresets(): AutomationPresetSummary[];
  findPresetsForFirstRitual(): AutomationPresetMatchDebug[];
  applyPresetToFirstRitual(presetId: string): Promise<void>;
  applyBestPresetToFirstRitual(): Promise<void>;
  clearAutomationFromFirstRitual(): Promise<void>;
};

export function createAutomationDebugApi(services: ToolkitServices): AutomationDebugApi {
  return {
    listPresets(): AutomationPresetSummary[] {
      const presets = services.automationRegistry.list().map(createAutomationPresetSummary);
      ModuleLogger.info("Presets de automação registrados.", presets);
      return presets;
    },

    findPresetsForFirstRitual(): AutomationPresetMatchDebug[] {
      const actor = getSelectedActorOrNotify("Nenhum ator encontrado para buscar presets de ritual.");
      if (!actor) return [];

      const ritual = getFirstRitualOrNotify(actor);
      if (!ritual) return [];

      const matches = services.automationRegistry.findForItem(ritual).map(toDebugMatch);

      ModuleLogger.info(`Presets encontrados para ${ritual.name}.`, matches);
      return matches;
    },

    async applyPresetToFirstRitual(presetId: string): Promise<void> {
      const actor = getSelectedActorOrNotify("Nenhum ator encontrado para aplicar preset de ritual.");
      if (!actor) return;

      const ritual = getFirstRitualOrNotify(actor);
      if (!ritual) return;

      const preset = services.automationRegistry.require(presetId);

      if (!preset.ok) {
        ModuleLogger.warn(preset.error.message, preset.error);
        ui.notifications?.warn(`Paranormal Toolkit: ${preset.error.message}`);
        return;
      }

      await services.automationBinder.applyPreset(ritual, preset.value);

      ModuleLogger.info(`Preset ${preset.value.id} aplicado em ${ritual.name}.`);
      ui.notifications?.info(`Paranormal Toolkit: preset ${preset.value.label} aplicado em ${ritual.name}.`);
    },

    async applyBestPresetToFirstRitual(): Promise<void> {
      const actor = getSelectedActorOrNotify("Nenhum ator encontrado para aplicar melhor preset de ritual.");
      if (!actor) return;

      const ritual = getFirstRitualOrNotify(actor);
      if (!ritual) return;

      const match = services.automationRegistry.findForItem(ritual)[0];

      if (!match) {
        ModuleLogger.warn(`Nenhum preset compatível encontrado para ${ritual.name}.`);
        ui.notifications?.warn(`Paranormal Toolkit: nenhum preset compatível encontrado para ${ritual.name}.`);
        return;
      }

      await services.automationBinder.applyPreset(ritual, match.preset);

      ModuleLogger.info(`Melhor preset aplicado em ${ritual.name}.`, toDebugMatch(match));
      ui.notifications?.info(`Paranormal Toolkit: preset ${match.preset.label} aplicado em ${ritual.name}.`);
    },

    async clearAutomationFromFirstRitual(): Promise<void> {
      const actor = getSelectedActorOrNotify("Nenhum ator encontrado para limpar automação de ritual.");
      if (!actor) return;

      const ritual = getFirstRitualOrNotify(actor);
      if (!ritual) return;

      await services.automationBinder.clear(ritual);

      ModuleLogger.info(`Automação removida do ritual ${ritual.name}.`);
      ui.notifications?.info(`Paranormal Toolkit: automação removida de ${ritual.name}.`);
    }
  };
}

function toDebugMatch(match: AutomationPresetMatch): AutomationPresetMatchDebug {
  return {
    preset: createAutomationPresetSummary(match.preset),
    score: match.score,
    reasons: [...match.reasons]
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

function getFirstRitualOrNotify(actor: Actor): Item | null {
  const ritual = getFirstActorRitual(actor);

  if (!ritual) {
    ModuleLogger.warn(`Ator ${actor.name ?? "sem nome"} não possui rituais.`);
    ui.notifications?.warn("Paranormal Toolkit: ator selecionado não possui rituais.");
    return null;
  }

  return ritual;
}
