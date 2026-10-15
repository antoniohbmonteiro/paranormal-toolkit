import { MODULE_ID } from "../constants";
import { readEffectTemplate } from "../core/allies/ally-passive-effect";
import { buildCustomTemplate, buildDefenseTemplate } from "../adapters/ordem/ordem-ally-effect-presets";
import { AllyEffectConfigService } from "../features/allies/ally-effect-config-service";
import { migrateAllyAbilityEffects } from "../features/allies/ally-effect-migration-service";
import { ALLY_PASSIVE_EFFECT_FLAG, canConfigureAllyEffects } from "../features/allies/config/ally-ability-config";
import { renderAllyAbilityConfig } from "../ui/components/ally/ally-ability-config";

export class AllyAbilityConfigApplication extends foundry.applications.api.ApplicationV2 {
  static DEFAULT_OPTIONS = {
    tag: "form", window: { title: "Benefícios passivos — Toolkit", resizable: true },
    position: { width: 560, height: 460 },
    actions: { createDefense: AllyAbilityConfigApplication.createDefense, createCustom: AllyAbilityConfigApplication.createCustom,
      editEffect: AllyAbilityConfigApplication.edit,
      removeEffect: AllyAbilityConfigApplication.remove },
  };
  private readonly service: AllyEffectConfigService;
  private loading = false;
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
    root.innerHTML = renderAllyAbilityConfig({ name: this.item.name, editable: canConfigureAllyEffects(this.item),
      effects: (this.item.effects?.contents ?? []).filter(effect => effect.getFlag(MODULE_ID, ALLY_PASSIVE_EFFECT_FLAG))
        .map(effect => ({ id: effect.id, name: effect.name, disabled: effect.disabled,
        diagnostic: readEffectTemplate(effect.toObject(true)) ? null : "Estrutura incompatível: revise as mudanças no editor nativo.",
      })) });
    return root;
  }
  _replaceHTML(result: HTMLElement, content: HTMLElement): void { content.replaceChildren(result); }
  async close(options?: Record<string, unknown>): Promise<this> {
    for (const { name, callback } of this.subscriptions) Hooks.off(name, callback);
    return await super.close(options);
  }
  private async run(work: () => Promise<unknown>): Promise<void> {
    try { await work(); await this.render({ force: true }); }
    catch (error) { ui.notifications?.warn(error instanceof Error ? error.message : "Falha ao configurar efeito."); }
  }
  private static async createDefense(this: AllyAbilityConfigApplication, _event: PointerEvent, target: HTMLElement): Promise<void> {
    const form = target.closest("form");
    const name = form?.querySelector<HTMLInputElement>("[data-effect-name]")?.value.trim() ?? "";
    const value = form?.querySelector<HTMLInputElement>("[data-effect-value]")?.value ?? "";
    await this.run(async () => {
      if (!value.trim()) throw new Error("Informe um bônus numérico.");
      return this.service.create(buildDefenseTemplate(name, Number(value)));
    });
  }
  private static async createCustom(this: AllyAbilityConfigApplication, _event: PointerEvent, target: HTMLElement): Promise<void> {
    const name = target.closest("form")?.querySelector<HTMLInputElement>("[data-effect-name]")?.value.trim();
    await this.run(async () => {
      const effect = await this.service.create(buildCustomTemplate(name || undefined));
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
