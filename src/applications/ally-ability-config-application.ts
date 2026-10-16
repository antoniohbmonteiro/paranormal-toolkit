import { MODULE_ID } from "../constants";
import { readEffectTemplate } from "../core/allies/ally-passive-effect";
import { buildAllyPresetTemplate, buildCustomTemplate } from "../adapters/ordem/ordem-ally-effect-presets";
import { buildOrdemEffectPreset } from "../adapters/ordem/ordem-effect-presets";
import { buildAllyBenefitConfigView, defaultAllyBenefitDraft, type AllyBenefitDraft } from "../features/allies/ally-benefit-config-view";
import { AllyEffectConfigService } from "../features/allies/ally-effect-config-service";
import { migrateAllyAbilityEffects } from "../features/allies/ally-effect-migration-service";
import { ALLY_PASSIVE_EFFECT_FLAG, canConfigureAllyEffects } from "../features/allies/config/ally-ability-config";
import { renderAllyAbilityConfig } from "../ui/components/ally/ally-ability-config";

// Fields that the selected preset does not render keep their previous draft value.
function readDraft(form: ParentNode | null | undefined, fallback: AllyBenefitDraft): AllyBenefitDraft {
  const field = (name: keyof AllyBenefitDraft) => form?.querySelector<HTMLInputElement>(`[name="${name}"]`)?.value ?? fallback[name];
  return { presetId: field("presetId"), value: field("value"), skillId: field("skillId") };
}

export class AllyAbilityConfigApplication extends foundry.applications.api.ApplicationV2 {
  static DEFAULT_OPTIONS = {
    tag: "form", classes: ["paranormal-toolkit-ally-benefits"],
    window: { title: "Benefícios passivos — Toolkit", resizable: true },
    position: { width: 480, height: "auto" },
    actions: { addBenefit: AllyAbilityConfigApplication.addBenefit, createCustom: AllyAbilityConfigApplication.createCustom,
      editEffect: AllyAbilityConfigApplication.edit,
      removeEffect: AllyAbilityConfigApplication.remove },
  };
  private readonly service: AllyEffectConfigService;
  private loading = false;
  private working = false;
  private draft: AllyBenefitDraft = defaultAllyBenefitDraft();
  private readonly subscriptions: { name: string; callback: (...args: any[]) => void }[] = [];
  constructor(private readonly item: Item) {
    super({}); this.service = new AllyEffectConfigService(item);
    for (const name of ["createActiveEffect", "updateActiveEffect", "deleteActiveEffect"]) {
      const callback = (effect: AllyEffectLike) => {
        if (effect.parent === item && !this.loading) void this.render({ force: true });
      };
      Hooks.on(name, callback); this.subscriptions.push({ name, callback });
    }
  }
  async render(options?: Record<string, unknown>): Promise<this> {
    this.loading = true;
    try { await migrateAllyAbilityEffects(this.item); return await super.render(options); }
    finally { this.loading = false; }
  }
  async _renderHTML(): Promise<HTMLElement> {
    const root = document.createElement("div");
    root.innerHTML = renderAllyAbilityConfig(buildAllyBenefitConfigView({
      editable: canConfigureAllyEffects(this.item), draft: this.draft,
      effects: (this.item.effects?.contents ?? []).filter(effect => effect.getFlag(MODULE_ID, ALLY_PASSIVE_EFFECT_FLAG))
        .map(effect => ({ id: effect.id, name: effect.name, disabled: effect.disabled,
          template: readEffectTemplate(effect.toObject(true)) })),
    }));
    return root;
  }
  _replaceHTML(result: HTMLElement, content: HTMLElement): void { content.replaceChildren(result); }
  _onChangeForm(_config: unknown, event: Event): void {
    const previous = this.draft.presetId;
    this.draft = readDraft(this.element, this.draft);
    if ((event.target as HTMLElement | null)?.getAttribute("name") !== "presetId" || this.draft.presetId === previous) return;
    void this.render({ force: false }).then(() => this.element?.querySelector<HTMLSelectElement>('[name="presetId"]')?.focus());
  }
  async close(options?: Record<string, unknown>): Promise<this> {
    for (const { name, callback } of this.subscriptions) Hooks.off(name, callback);
    return await super.close(options);
  }
  private async run(work: () => Promise<unknown>): Promise<void> {
    if (this.working) return;
    this.working = true;
    try { await work(); await this.render({ force: true }); }
    catch (error) { ui.notifications?.warn(error instanceof Error ? error.message : "Falha ao configurar efeito."); }
    finally { this.working = false; }
  }
  private static async addBenefit(this: AllyAbilityConfigApplication, _event: PointerEvent, target: HTMLElement): Promise<void> {
    this.draft = readDraft(target.closest("form"), this.draft);
    const preset = buildOrdemEffectPreset(this.draft);
    await this.run(async () => {
      if (!preset.ok) throw new Error(preset.error);
      return this.service.create(buildAllyPresetTemplate(preset.value));
    });
  }
  private static async createCustom(this: AllyAbilityConfigApplication): Promise<void> {
    await this.run(async () => {
      const effect = await this.service.create(buildCustomTemplate());
      await effect.sheet.render({ force: true });
    });
  }
  private static async edit(this: AllyAbilityConfigApplication, _event: PointerEvent, target: HTMLElement): Promise<void> {
    await this.run(() => this.service.open(target.dataset.effectId ?? ""));
  }
  private static async remove(this: AllyAbilityConfigApplication, _event: PointerEvent, target: HTMLElement): Promise<void> {
    if (!await foundry.applications.api.DialogV2.confirm({ window: { title: "Excluir efeito" }, content: "<p>Excluir este efeito da habilidade?</p>" })) return;
    await this.run(() => this.service.remove(target.dataset.effectId ?? ""));
  }
}
