import type { OrdemItemPatchResult } from "../../../adapters/ordem/ordem-item-patch-adapter";
import type { OrdemItemPatchAdapter } from "../../../adapters/ordem/ordem-item-patch-adapter";
import type { AutomationBinder } from "../../../core/automation/automation-binder";
import { getActorRituals } from "../ritual-item-resolver";
import type { RitualPresetDiagnosticEntry, RitualPresetDiagnosticService } from "./ritual-preset-diagnostic";

export type RitualPresetApplicationEntry = {
  itemId: string | null;
  itemName: string;
  presetId: string;
  presetLabel: string;
  previousStatus: RitualPresetDiagnosticEntry["status"];
  itemPatch: OrdemItemPatchResult;
};

export type RitualPresetApplicationResult = {
  actorId: string | null;
  actorName: string;
  applied: RitualPresetApplicationEntry[];
  skipped: RitualPresetDiagnosticEntry[];
};

export class RitualPresetApplicationService {
  constructor(
    private readonly diagnostic: RitualPresetDiagnosticService,
    private readonly automationBinder: AutomationBinder,
    private readonly itemPatches: OrdemItemPatchAdapter
  ) {}

  async applyPending(actor: Actor): Promise<RitualPresetApplicationResult> {
    const applicableEntries = this.diagnostic.getApplicableEntries(actor);
    const applied: RitualPresetApplicationEntry[] = [];
    const skipped: RitualPresetDiagnosticEntry[] = [];

    const rituals = getActorRituals(actor);

    for (const entry of applicableEntries) {
      const item = entry.itemId ? rituals.find((ritual) => ritual.id === entry.itemId) ?? null : null;
      const preset = entry.match?.preset ?? null;

      if (!item || !preset) {
        skipped.push(entry);
        continue;
      }

      await this.automationBinder.applyPreset(item, preset);
      const itemPatch = await this.itemPatches.applyPresetItemPatch(item, preset);

      applied.push({
        itemId: item.id ?? null,
        itemName: item.name ?? "Ritual sem nome",
        presetId: preset.id,
        presetLabel: preset.label,
        previousStatus: entry.status,
        itemPatch
      });
    }

    return {
      actorId: actor.id ?? null,
      actorName: actor.name ?? "Ator sem nome",
      applied,
      skipped
    };
  }
}
