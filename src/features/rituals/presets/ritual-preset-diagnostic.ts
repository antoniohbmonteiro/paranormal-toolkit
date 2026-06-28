import { MODULE_ID } from "../../../constants";
import type { AutomationPreset, AutomationPresetSummary } from "../../../core/automation/automation-preset";
import { createAutomationPresetSummary } from "../../../core/automation/automation-preset";
import type { AutomationPresetMatch, AutomationRegistry } from "../../../core/automation/automation-registry";
import type { AutomationFlagValue } from "../../../core/automation/automation-binder";
import { isAutomationFlagValue } from "../../automation/automation-flag-reader";
import { getActorRituals } from "../ritual-item-resolver";

export type RitualPresetDiagnosticStatus = "upToDate" | "available" | "outdated" | "unsupported";

export type RitualPresetDiagnosticEntry = {
  itemId: string | null;
  itemName: string;
  status: RitualPresetDiagnosticStatus;
  match: AutomationPresetMatch | null;
  preset: AutomationPresetSummary | null;
  appliedPresetId: string | null;
  appliedPresetVersion: string | null;
  reason: string;
};

export type RitualPresetDiagnostic = {
  actorId: string | null;
  actorName: string;
  total: number;
  upToDate: RitualPresetDiagnosticEntry[];
  available: RitualPresetDiagnosticEntry[];
  outdated: RitualPresetDiagnosticEntry[];
  unsupported: RitualPresetDiagnosticEntry[];
  canApply: boolean;
};

export class RitualPresetDiagnosticService {
  constructor(private readonly automationRegistry: AutomationRegistry) {}

  analyzeActor(actor: Actor): RitualPresetDiagnostic {
    const entries = getActorRituals(actor).map((ritual) => this.analyzeRitual(ritual));

    const upToDate = entries.filter(hasStatus("upToDate"));
    const available = entries.filter(hasStatus("available"));
    const outdated = entries.filter(hasStatus("outdated"));
    const unsupported = entries.filter(hasStatus("unsupported"));

    return {
      actorId: actor.id ?? null,
      actorName: actor.name ?? "Ator sem nome",
      total: entries.length,
      upToDate,
      available,
      outdated,
      unsupported,
      canApply: available.length > 0 || outdated.length > 0
    };
  }

  getApplicableEntries(actor: Actor): RitualPresetDiagnosticEntry[] {
    const diagnostic = this.analyzeActor(actor);
    return [...diagnostic.available, ...diagnostic.outdated];
  }

  private analyzeRitual(ritual: Item): RitualPresetDiagnosticEntry {
    const match = this.automationRegistry.findForItem(ritual)[0] ?? null;
    const flag = readAutomationFlag(ritual);

    if (!match) {
      return createEntry({
        ritual,
        status: "unsupported",
        match,
        flag,
        reason: flag ? "Ritual automatizado, mas nenhum preset atual foi identificado pelo nome." : "Nenhum preset conhecido para este ritual."
      });
    }

    if (!flag) {
      return createEntry({
        ritual,
        status: "available",
        match,
        flag,
        reason: `Preset encontrado: ${match.preset.label}.`
      });
    }

    if (flag.source.type !== "preset") {
      return createEntry({
        ritual,
        status: "upToDate",
        match,
        flag,
        reason: `Automação manual encontrada. Preset sugerido: ${match.preset.label}.`
      });
    }

    if (flag.source.presetId === match.preset.id && flag.source.presetVersion === match.preset.version) {
      return createEntry({
        ritual,
        status: "upToDate",
        match,
        flag,
        reason: `Preset ${match.preset.label} v${match.preset.version} já aplicado.`
      });
    }

    return createEntry({
      ritual,
      status: "outdated",
      match,
      flag,
      reason: createOutdatedReason(flag, match.preset)
    });
  }
}

function createEntry(options: {
  ritual: Item;
  status: RitualPresetDiagnosticStatus;
  match: AutomationPresetMatch | null;
  flag: AutomationFlagValue | null;
  reason: string;
}): RitualPresetDiagnosticEntry {
  const source = options.flag?.source;
  const presetSource = source?.type === "preset" ? source : null;

  return {
    itemId: options.ritual.id ?? null,
    itemName: options.ritual.name ?? "Ritual sem nome",
    status: options.status,
    match: options.match,
    preset: options.match ? createAutomationPresetSummary(options.match.preset) : null,
    appliedPresetId: presetSource?.presetId ?? null,
    appliedPresetVersion: presetSource?.presetVersion ?? null,
    reason: options.reason
  };
}

function readAutomationFlag(item: Item): AutomationFlagValue | null {
  const value = item.getFlag(MODULE_ID, "automation");
  return isAutomationFlagValue(value) ? value : null;
}

function createOutdatedReason(flag: AutomationFlagValue, preset: AutomationPreset): string {
  if (flag.source.type !== "preset") {
    return `Automação existente pode ser substituída pelo preset ${preset.label}.`;
  }

  if (flag.source.presetId !== preset.id) {
    return `Preset aplicado (${flag.source.presetId}) difere do preset atual sugerido (${preset.id}).`;
  }

  return `Preset ${preset.label} aplicado em v${flag.source.presetVersion}; versão atual é v${preset.version}.`;
}

function hasStatus<TStatus extends RitualPresetDiagnosticStatus>(status: TStatus) {
  return (entry: RitualPresetDiagnosticEntry): entry is RitualPresetDiagnosticEntry & { status: TStatus } => entry.status === status;
}
