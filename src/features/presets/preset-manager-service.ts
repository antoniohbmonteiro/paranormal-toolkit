import { MODULE_ID } from "../../constants";
import { normalizeAutomationName } from "../../core/automation/automation-registry";
import { canConfigureAllyEffects } from "../allies/config/ally-ability-config";
import { getActorItems } from "../automation/actor-item-resolver";
import { ATTACK_MODIFIER_BINDING, readAttackModifierBinding, writeAttackModifierBinding } from "../attack-modifiers/attack-modifier-binding";
import type { AttackModifierRegistry } from "../attack-modifiers/attack-modifier-registry";
import type { RitualPresetApplicationService } from "../rituals/presets/ritual-preset-application-service";
import type { RitualPresetDiagnosticEntry, RitualPresetDiagnosticService } from "../rituals/presets/ritual-preset-diagnostic";

export type PresetManagerEntry = Omit<RitualPresetDiagnosticEntry, "match" | "preset"> & {
  family: "ritual" | "attackModifier";
  preset: { id: string; version: string; label: string } | null;
};
export type PresetManagerDiagnostic = {
  actorName: string;
  total: number;
  available: PresetManagerEntry[];
  outdated: PresetManagerEntry[];
  upToDate: PresetManagerEntry[];
  unsupported: PresetManagerEntry[];
  canApply: boolean;
};
export type PresetManagerApplicationResult = {
  applied: Array<{ itemId: string | null; itemName: string; presetId: string; presetLabel: string }>;
  skipped: Array<{ itemName: string; reason: string }>;
};

export function canManageActorPresets(actor: Actor): boolean {
  if (!game.user || !actor.testUserPermission(game.user, "OWNER") || !actor.canUserModify(game.user, "update")) return false;
  return !actor.pack || game.packs?.get(actor.pack)?.locked === false;
}

export function canApplyItemPreset(actor: Actor, item: Item): boolean {
  if (!canManageActorPresets(actor) || !getActorItems(actor).includes(item) || !item.canUserModify(game.user!, "update")) return false;
  if (item.pack && game.packs?.get(item.pack)?.locked !== false) return false;
  return item.type !== "ability" || canConfigureAllyEffects(item);
}

export class PresetManagerService {
  private readonly pending = new WeakMap<Actor, Promise<PresetManagerApplicationResult>>();

  constructor(
    private readonly rituals: RitualPresetDiagnosticService,
    private readonly ritualApplications: RitualPresetApplicationService,
    private readonly attacks: AttackModifierRegistry,
  ) {}

  analyzeActor(actor: Actor): PresetManagerDiagnostic {
    this.assertPermission(actor);
    const rituals = this.rituals.analyzeActor(actor);
    const entries: PresetManagerEntry[] = [
      ...[...rituals.available, ...rituals.outdated, ...rituals.upToDate, ...rituals.unsupported]
        .filter(entry => entry.preset !== null)
        .map(({ match: _match, ...entry }): PresetManagerEntry => ({ ...entry, family: "ritual" })),
      ...getActorItems(actor).filter(item => item.type === "ability")
        .map(item => this.analyzeAbility(item)).filter((entry): entry is PresetManagerEntry => entry !== null),
    ];
    for (const entry of entries) {
      const item = getActorItems(actor).find(candidate => candidate.id === entry.itemId);
      if ((entry.status === "available" || entry.status === "outdated") && (!item || !canApplyItemPreset(actor, item))) {
        entry.status = "unsupported";
        entry.reason = "Este item não pode ser configurado aqui; dados preservados.";
      }
    }
    const available = entries.filter(entry => entry.status === "available");
    const outdated = entries.filter(entry => entry.status === "outdated");
    return { actorName: actor.name, total: entries.length, available, outdated,
      upToDate: entries.filter(entry => entry.status === "upToDate"),
      unsupported: entries.filter(entry => entry.status === "unsupported"),
      canApply: available.length > 0 || outdated.length > 0 };
  }

  applyPending(actor: Actor): Promise<PresetManagerApplicationResult> {
    this.assertPermission(actor);
    const existing = this.pending.get(actor);
    if (existing) return existing;
    const operation = this.apply(actor).finally(() => { this.pending.delete(actor); });
    this.pending.set(actor, operation);
    return operation;
  }

  private async apply(actor: Actor): Promise<PresetManagerApplicationResult> {
    const diagnostic = this.analyzeActor(actor);
    const abilities = [...diagnostic.available, ...diagnostic.outdated].filter(entry => entry.family === "attackModifier");
    const result: PresetManagerApplicationResult = await this.ritualApplications.applyPending(actor);
    for (const entry of abilities) {
      this.assertPermission(actor);
      const item = getActorItems(actor).find(candidate => candidate.id === entry.itemId);
      const current = item && this.analyzeAbility(item);
      if (!item || !canApplyItemPreset(actor, item) || !current?.preset
        || !["available", "outdated"].includes(current.status)
        || current.preset.id !== entry.preset?.id || current.preset.version !== entry.preset.version) {
        result.skipped.push({ itemName: entry.itemName, reason: "O item ou seu vínculo mudou antes da aplicação." });
        continue;
      }
      await writeAttackModifierBinding(item, { schemaVersion: 1, presetId: current.preset.id, presetVersion: current.preset.version });
      const binding = readAttackModifierBinding(item);
      if (binding?.presetId !== current.preset.id || binding.presetVersion !== current.preset.version) {
        throw new Error(`O vínculo de ${item.name} não foi confirmado. Confira o item antes de tentar novamente.`);
      }
      result.applied.push({ itemId: item.id, itemName: item.name, presetId: current.preset.id, presetLabel: current.preset.label });
    }
    return result;
  }

  private analyzeAbility(item: Item): PresetManagerEntry | null {
    const raw = item.getFlag(MODULE_ID, ATTACK_MODIFIER_BINDING);
    const binding = readAttackModifierBinding(item);
    const preset = binding ? this.attacks.get(binding.presetId)
      : raw == null ? this.attacks.list().find(candidate => candidate.recognitionNames
        ?.some(name => normalizeAutomationName(name) === normalizeAutomationName(item.name))) ?? null : null;
    if (raw == null && !preset) return null;
    const status = !preset || !binding && raw != null ? "unsupported" : !binding ? "available"
      : binding.presetVersion === preset.version ? "upToDate" : "outdated";
    return { family: "attackModifier", itemId: item.id, itemName: item.name, status,
      preset: preset && { id: preset.id, version: preset.version, label: preset.label },
      appliedPresetId: binding?.presetId ?? null, appliedPresetVersion: binding?.presetVersion ?? null,
      reason: status === "unsupported" ? "Vínculo inválido ou preset indisponível; dados preservados."
        : status === "available" ? `Preset encontrado: ${preset!.label}.`
        : status === "outdated" ? `Preset aplicado em v${binding!.presetVersion}; versão atual é v${preset!.version}.`
        : `Preset ${preset!.label} v${preset!.version} já aplicado.` };
  }

  private assertPermission(actor: Actor): void {
    if (!canManageActorPresets(actor)) throw new Error("Somente o mestre ou o dono do personagem pode gerenciar seus presets.");
  }
}
