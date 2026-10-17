import { MODULE_ID } from "../../constants";
import { buildAllyPresetTemplate, buildCustomTemplate } from "../../adapters/ordem/ordem-ally-effect-presets";
import { buildOrdemEffectPreset, readOrdemEffectPreset, validateOrdemPresetFormula, type OrdemEffectPresetInput } from "../../adapters/ordem/ordem-effect-presets";
import { stableEffectFingerprint, type EffectChange } from "../../core/allies/ally-passive-effect";
import { AllyEffectConfigService } from "../allies/ally-effect-config-service";
import { migrateAllyAbilityEffects } from "../allies/ally-effect-migration-service";
import { ALLY_PASSIVE_EFFECT_FLAG, ALLY_TYPE, canConfigureAllyEffects, canReadAbilityEffects, inspectLegacyAllyImport } from "../allies/config/ally-ability-config";

export type ItemEffectContext = "agent" | "ally" | "independent";
export type ItemEffectQuickEdit = { draft: OrdemEffectPresetInput; fingerprint: string };
export type ItemEffectSource = {
  id: string; name: string; disabled: boolean; transfer: boolean; benefit: boolean;
  data: Record<string, unknown>; quick: ItemEffectQuickEdit | null; diagnostic: string | null;
};

export function resolveItemEffectConfigContext(item: Item): ItemEffectContext | null {
  if (item.type !== "ability") return null;
  const owner = item.parent ?? item.actor;
  if (!owner) return "independent";
  return owner.type === "agent" ? "agent" : owner.type === ALLY_TYPE ? "ally" : null;
}

export function itemEffectChanges(data: Record<string, unknown>): EffectChange[] | null {
  const system = data.system as { changes?: unknown } | undefined;
  if (!Array.isArray(system?.changes)) return null;
  return system.changes.every(change => change && typeof change === "object" && typeof change.key === "string"
    && typeof change.type === "string" && typeof change.phase === "string") ? system.changes : null;
}

export function itemEffectQuickEdit(data: Record<string, unknown>): ItemEffectQuickEdit | null {
  const changes = itemEffectChanges(data);
  const statuses = data.statuses;
  const duration = data.duration as { value?: unknown; expiry?: unknown } | undefined;
  const flags = data.flags as Record<string, unknown> | undefined;
  if (data.type !== "base" || !changes || !Array.isArray(statuses) || statuses.length || duration?.value || duration?.expiry
    || (flags && Object.keys(flags).some(scope => scope !== MODULE_ID))) return null;
  const native = typeof foundry === "undefined" ? undefined : (foundry as unknown as { documents?: { ActiveEffect?: unknown } }).documents?.ActiveEffect;
  const implementation = typeof CONFIG === "undefined" ? undefined : (CONFIG as unknown as { ActiveEffect?: { documentClass?: unknown; changeTypes?: Record<string, { handler?: unknown }> } }).ActiveEffect;
  if ((native && implementation?.documentClass && implementation.documentClass !== native) || implementation?.changeTypes?.add?.handler) return null;
  const draft = readOrdemEffectPreset(changes);
  if (!draft || !buildOrdemEffectPreset(draft).ok) return null;
  return { draft, fingerprint: stableEffectFingerprint(data) };
}

export class ItemEffectConfigService {
  constructor(readonly item: Item) {}
  get context(): ItemEffectContext | null { return resolveItemEffectConfigContext(this.item); }
  get readable(): boolean { return this.context !== null && canReadAbilityEffects(this.item); }
  get editable(): boolean { return this.readable && canConfigureAllyEffects(this.item); }
  get defaultTransfer(): boolean {
    return this.context === "agent" || this.context === "independent";
  }
  legacy() { return inspectLegacyAllyImport(this.item); }
  get granted(): boolean { return this.item.getFlag(MODULE_ID, "allyGrantedAbility") !== undefined; }

  sources(): ItemEffectSource[] {
    if (!this.readable) return [];
    return (this.item.effects?.contents ?? []).filter(effect => this.context !== "ally" || this.isBenefit(effect)).map(effect => {
      const data = effect.toObject(true);
      const benefit = this.isBenefit(effect);
      const marker = effect.getFlag(MODULE_ID, ALLY_PASSIVE_EFFECT_FLAG) as { version?: unknown } | undefined;
      const diagnostic = benefit && (marker?.version !== 1 || effect.transfer)
        ? "Benefício incompatível com suporte; revise explicitamente no editor nativo." : null;
      return { id: effect.id, name: effect.name, disabled: effect.disabled, transfer: effect.transfer, benefit, data,
        quick: diagnostic ? null : itemEffectQuickEdit(data), diagnostic };
    });
  }
  private isBenefit(effect: AllyEffectLike): boolean { return effect.getFlag(MODULE_ID, ALLY_PASSIVE_EFFECT_FLAG) !== undefined; }
  private effect(id: string): AllyEffectLike {
    if (!this.readable) throw new Error("Sem permissão para visualizar esta habilidade.");
    const effect = this.item.effects?.get(id);
    if (!effect || (this.context === "ally" && !this.isBenefit(effect))) throw new Error("Efeito não encontrado nesta habilidade.");
    return effect;
  }
  private assertEdit(): void {
    if (!this.editable) throw new Error("Sem permissão para configurar esta habilidade. Verifique o proprietário e o compêndio.");
  }
  private assertNativePermission(effect: AllyEffectLike, action: "update" | "delete"): void {
    if (game.user && effect.canUserModify && !effect.canUserModify(game.user, action)) throw new Error("Sem permissão para alterar este efeito.");
  }
  async create(input?: OrdemEffectPresetInput, options: { transfer?: boolean } = {}): Promise<AllyEffectLike> {
    this.assertEdit();
    if (options.transfer !== undefined && typeof options.transfer !== "boolean") throw new Error("Selecione uma aplicação válida para o efeito.");
    if (this.context === "ally" && options.transfer === true) throw new Error("Benefícios de Aliados são projetados pelo suporte e não usam transferência nativa.");
    if (this.legacy().pending) throw new Error("Importe explicitamente os benefícios legados antes de criar novos efeitos.");
    const preset = input ? buildOrdemEffectPreset(input) : null;
    if (preset && !preset.ok) throw new Error(preset.error);
    if (preset?.ok) validateOrdemPresetFormula(preset.value);
    const template = preset?.ok ? buildAllyPresetTemplate(preset.value) : buildCustomTemplate(this.context === "ally" ? "Benefício passivo personalizado" : "Efeito personalizado");
    if (this.context === "ally") return new AllyEffectConfigService(this.item).create(template);
    const [effect] = await this.item.createEmbeddedDocuments("ActiveEffect", [{ ...template, disabled: false,
      transfer: options.transfer ?? this.defaultTransfer }]);
    if (!effect) throw new Error("Não foi possível criar o efeito.");
    return effect;
  }
  async open(id: string): Promise<void> { await this.effect(id).sheet.render({ force: true }); }
  async remove(id: string): Promise<void> {
    this.assertEdit();
    const effect = this.effect(id);
    if (this.isBenefit(effect) && this.legacy().pending) throw new Error("Conclua a importação legada antes de excluir benefícios.");
    this.assertNativePermission(effect, "delete");
    await this.item.deleteEmbeddedDocuments("ActiveEffect", [effect.id]);
  }
  async save(id: string, edit: ItemEffectQuickEdit, input: OrdemEffectPresetInput): Promise<void> {
    this.assertEdit();
    const effect = this.effect(id);
    this.assertNativePermission(effect, "update");
    const marker = effect.getFlag(MODULE_ID, ALLY_PASSIVE_EFFECT_FLAG) as { version?: unknown } | undefined;
    if (marker !== undefined && (marker?.version !== 1 || effect.transfer)) throw new Error("Benefício incompatível; revise a origem no editor nativo.");
    if (this.isBenefit(effect) && this.legacy().pending) throw new Error("Conclua a importação legada antes de editar benefícios.");
    const source = effect.toObject(true);
    const current = itemEffectQuickEdit(source);
    if (!current || current.fingerprint !== edit.fingerprint) throw new Error("O efeito mudou. Cancele e reabra a edição para atualizar os dados.");
    const result = buildOrdemEffectPreset({ ...input, presetId: current.draft.presetId });
    if (!result.ok) throw new Error(result.error);
    validateOrdemPresetFormula(result.value);
    const changes = structuredClone(itemEffectChanges(source)!);
    changes[0].key = result.value.changes[0].key;
    changes[0].value = result.value.changes[0].value;
    if (stableEffectFingerprint(changes) === stableEffectFingerprint(itemEffectChanges(source))) return;
    await effect.update({ "system.changes": changes });
  }
  async importLegacy(fingerprint: string): Promise<void> {
    this.assertEdit();
    await migrateAllyAbilityEffects(this.item, { confirmed: true, fingerprint });
  }
}
