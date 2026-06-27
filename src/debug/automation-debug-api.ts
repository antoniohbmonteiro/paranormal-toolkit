import { ActorResolver } from "../core/actor-resolver";
import type { AutomationPreset, AutomationPresetSummary } from "../core/automation/automation-preset";
import { createAutomationPresetSummary } from "../core/automation/automation-preset";
import type { AutomationPresetMatch } from "../core/automation/automation-registry";
import { ModuleLogger } from "../core/module-logger";
import type { OrdemItemPatchResult } from "../adapters/ordem/ordem-item-patch-adapter";
import { getActorRituals, getFirstActorRitual } from "../features/rituals/ritual-item-resolver";
import type { ToolkitServices } from "../toolkit-services";

export type AutomationPresetMatchDebug = {
  preset: AutomationPresetSummary;
  score: number;
  reasons: string[];
};

export type AutomationPresetApplicationDebug = {
  itemId: string | null;
  itemName: string;
  preset: AutomationPresetSummary;
  score: number;
  reasons: string[];
  automationApplied: true;
  itemPatchApplied: boolean;
  itemPatchReason?: string;
};

export type AutomationPresetSkippedDebug = {
  itemId: string | null;
  itemName: string;
  reason: "no-matching-preset";
};

export type AutomationPresetBatchApplyDebug = {
  actorId: string | null;
  actorName: string;
  total: number;
  applied: AutomationPresetApplicationDebug[];
  skipped: AutomationPresetSkippedDebug[];
};

export type AutomationDebugApi = {
  listPresets(): AutomationPresetSummary[];
  findPresetsForFirstRitual(): AutomationPresetMatchDebug[];
  applyPresetToFirstRitual(presetId: string): Promise<void>;
  applyBestPresetToFirstRitual(): Promise<void>;
  applyBestPresetToAllRituals(): Promise<AutomationPresetBatchApplyDebug | null>;
  applyBestPresetsToActorRituals(): Promise<AutomationPresetBatchApplyDebug | null>;
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

      const itemPatch = await applyPresetToItem(services, ritual, preset.value);

      ModuleLogger.info(`Preset ${preset.value.id} aplicado em ${ritual.name}.`, { itemPatch });
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

      const itemPatch = await applyPresetToItem(services, ritual, match.preset);

      ModuleLogger.info(`Melhor preset aplicado em ${ritual.name}.`, { match: toDebugMatch(match), itemPatch });
      ui.notifications?.info(`Paranormal Toolkit: preset ${match.preset.label} aplicado em ${ritual.name}.`);
    },

    async applyBestPresetToAllRituals(): Promise<AutomationPresetBatchApplyDebug | null> {
      return applyBestPresetsToSelectedActorRituals(services);
    },

    async applyBestPresetsToActorRituals(): Promise<AutomationPresetBatchApplyDebug | null> {
      return applyBestPresetsToSelectedActorRituals(services);
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

async function applyBestPresetsToSelectedActorRituals(services: ToolkitServices): Promise<AutomationPresetBatchApplyDebug | null> {
  const actor = getSelectedActorOrNotify("Nenhum ator encontrado para aplicar presets em rituais.");
  if (!actor) return null;

  const rituals = getActorRituals(actor);

  if (rituals.length === 0) {
    ModuleLogger.warn(`Ator ${actor.name ?? "sem nome"} não possui rituais.`);
    ui.notifications?.warn("Paranormal Toolkit: ator selecionado não possui rituais.");
    return createEmptyBatchResult(actor);
  }

  const result: AutomationPresetBatchApplyDebug = createEmptyBatchResult(actor, rituals.length);

  for (const ritual of rituals) {
    const match = services.automationRegistry.findForItem(ritual)[0];

    if (!match) {
      result.skipped.push({
        itemId: ritual.id ?? null,
        itemName: ritual.name ?? "Ritual sem nome",
        reason: "no-matching-preset"
      });
      continue;
    }

    const itemPatch = await applyPresetToItem(services, ritual, match.preset);
    result.applied.push(createApplicationDebug(ritual, match, itemPatch));
  }

  ModuleLogger.info(`Presets aplicados em rituais de ${actor.name ?? "ator sem nome"}.`, result);
  notifyBatchResult(result);
  return result;
}

async function applyPresetToItem(
  services: ToolkitServices,
  item: Item,
  preset: AutomationPreset
): Promise<OrdemItemPatchResult> {
  await services.automationBinder.applyPreset(item, preset);
  return services.itemPatches.applyPresetItemPatch(item, preset);
}

function createApplicationDebug(
  item: Item,
  match: AutomationPresetMatch,
  itemPatch: OrdemItemPatchResult
): AutomationPresetApplicationDebug {
  return {
    itemId: item.id ?? null,
    itemName: item.name ?? "Ritual sem nome",
    preset: createAutomationPresetSummary(match.preset),
    score: match.score,
    reasons: [...match.reasons],
    automationApplied: true,
    itemPatchApplied: itemPatch.applied,
    itemPatchReason: itemPatch.applied ? undefined : itemPatch.reason
  };
}

function createEmptyBatchResult(actor: Actor, total = 0): AutomationPresetBatchApplyDebug {
  return {
    actorId: actor.id ?? null,
    actorName: actor.name ?? "Ator sem nome",
    total,
    applied: [],
    skipped: []
  };
}

function notifyBatchResult(result: AutomationPresetBatchApplyDebug): void {
  const skippedMessage = result.skipped.length > 0 ? `, ${result.skipped.length} sem preset compatível` : "";
  const itemPatchMessage = result.applied.some((application) => application.itemPatchApplied)
    ? " com dados visíveis atualizados"
    : "";

  ui.notifications?.info(
    `Paranormal Toolkit: ${result.applied.length}/${result.total} presets aplicados em rituais${itemPatchMessage}${skippedMessage}.`
  );
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
