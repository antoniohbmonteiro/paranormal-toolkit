import { ItemEffectConfigService, type ItemEffectQuickEdit } from "../features/item-effects/item-effect-config-service";
import { buildItemEffectConfigView, defaultItemEffectDraft, type ItemEffectDraft } from "../features/item-effects/item-effect-config-view";
import { renderItemEffectConfig } from "../ui/components/item-effects/item-effect-config";
import { escapeHtml } from "../ui/rendering/escape-html";

const windows = new Map<string, Promise<ItemEffectConfigApplication>>();

export async function openItemEffectConfig(item: Item): Promise<ItemEffectConfigApplication> {
  if (!new ItemEffectConfigService(item).readable) throw new Error("Sem acesso aos efeitos desta habilidade.");
  const existing = windows.get(item.uuid);
  if (existing) {
    const app = await existing;
    await app.render({ force: true });
    app.bringToFront?.();
    return app;
  }
  const opening = Promise.resolve().then(async () => {
    const app = new ItemEffectConfigApplication(item, () => {
      if (windows.get(item.uuid) === opening) windows.delete(item.uuid);
    });
    try { await app.render({ force: true }); return app; }
    catch (error) { await app.close(); throw error; }
  });
  windows.set(item.uuid, opening);
  try { return await opening; }
  catch (error) { if (windows.get(item.uuid) === opening) windows.delete(item.uuid); throw error; }
}

function readDraft(form: ParentNode | null | undefined, fallback: ItemEffectDraft, editing = false): ItemEffectDraft {
  return Object.fromEntries(Object.entries(fallback).map(([key, value]) => {
    const name = editing ? `edit${key[0].toUpperCase()}${key.slice(1)}` : key;
    return [key, form?.querySelector?.<HTMLInputElement>(`[name="${name}"]`)?.value ?? value];
  })) as ItemEffectDraft;
}

export class ItemEffectConfigApplication extends foundry.applications.api.ApplicationV2 {
  static DEFAULT_OPTIONS = {
    tag: "form", classes: ["paranormal-toolkit-ally-benefits"],
    window: { title: "Efeitos da habilidade — Toolkit", resizable: true }, position: { width: 520, height: "auto" },
    actions: { addBenefit: ItemEffectConfigApplication.add, createCustom: ItemEffectConfigApplication.custom,
      editEffect: ItemEffectConfigApplication.edit, advancedEffect: ItemEffectConfigApplication.advanced,
      saveEffect: ItemEffectConfigApplication.save, cancelEdit: ItemEffectConfigApplication.cancel,
      removeEffect: ItemEffectConfigApplication.remove, importLegacy: ItemEffectConfigApplication.importLegacy },
  };
  readonly service: ItemEffectConfigService;
  private draft = defaultItemEffectDraft();
  private editing: { id: string; baseline: ItemEffectQuickEdit; draft: ItemEffectDraft } | null = null;
  private working = false;
  private closed = false;
  private readonly subscriptions: { name: string; callback: (...args: any[]) => void }[] = [];

  constructor(readonly item: Item, private readonly onClosed?: () => void) {
    super({ window: { title: (item.parent ?? item.actor)?.type === "paranormal-toolkit.ally" ? "Benefícios passivos — Toolkit" : "Efeitos da habilidade — Toolkit" } });
    this.service = new ItemEffectConfigService(item);
    this.draft = defaultItemEffectDraft(this.service.defaultTransfer);
    const same = (document: { uuid?: string | null } | undefined) => document === item || Boolean(document?.uuid && document.uuid === item.uuid);
    const refresh = () => { if (!this.working && !this.closed) void this.render({ force: false }).catch(error => this.warn(error)); };
    for (const name of ["createActiveEffect", "updateActiveEffect", "deleteActiveEffect"]) this.subscribe(name, (effect: AllyEffectLike) => { if (same(effect.parent)) refresh(); });
    this.subscribe("updateItem", (updated: Item) => { if (same(updated)) refresh(); });
    this.subscribe("deleteItem", (deleted: Item) => { if (same(deleted)) void this.close(); });
    this.subscribe("updateActor", (actor: Actor) => { const owner = item.parent ?? item.actor; if (owner && (actor === owner || actor.uuid === owner.uuid)) refresh(); });
    this.subscribe("updateUser", (user: FoundryUserLike) => { if (user.id === game.user?.id) refresh(); });
  }
  private subscribe(name: string, callback: (...args: any[]) => void): void { Hooks.on(name, callback); this.subscriptions.push({ name, callback }); }
  private capture(): void {
    this.draft = readDraft(this.element, this.draft);
    if (this.editing) this.editing.draft = readDraft(this.element, this.editing.draft, true);
  }
  async render(options?: Record<string, unknown>): Promise<this> {
    if (this.closed) return this;
    if (options?.captureEffectDraft !== false) this.capture();
    if (!this.service.readable) { await this.close(); return this; }
    return await super.render(options);
  }
  async _renderHTML(): Promise<HTMLElement> {
    if (!this.service.readable || !this.service.context) throw new Error("Sem acesso aos efeitos desta habilidade.");
    let legacy = null, notice: string | null = null;
    try { legacy = this.service.legacy(); } catch (error) { notice = error instanceof Error ? error.message : "Configuração legada inválida."; }
    const root = document.createElement("div");
    root.innerHTML = renderItemEffectConfig(buildItemEffectConfigView({
      context: this.service.context, editable: this.service.editable, draft: this.draft, sources: this.service.sources(),
      legacy, notice, isGM: game.user?.isGM === true, granted: this.service.granted, editing: this.editing, working: this.working,
    }));
    return root;
  }
  _replaceHTML(result: HTMLElement, content: HTMLElement): void { content.replaceChildren(result); }
  _onChangeForm(_config: unknown, event: Event): void {
    const previous = this.draft.presetId;
    this.capture();
    if ((event.target as HTMLElement | null)?.getAttribute("name") === "presetId" && previous !== this.draft.presetId) {
      void this.render({ force: false }).then(() => this.element?.querySelector<HTMLSelectElement>('[name="presetId"]')?.focus());
    }
  }
  async close(options?: Record<string, unknown>): Promise<this> {
    this.closed = true;
    for (const { name, callback } of this.subscriptions) Hooks.off(name, callback);
    this.subscriptions.length = 0;
    this.onClosed?.();
    return await super.close(options);
  }
  private warn(error: unknown): void { ui.notifications?.warn(error instanceof Error ? error.message : "Falha ao configurar efeito."); }
  private creationOptions(): { transfer: boolean } {
    if (this.draft.transfer !== "true" && this.draft.transfer !== "false") throw new Error("Selecione uma aplicação válida para o efeito.");
    return { transfer: this.draft.transfer === "true" };
  }
  private async run(work: () => Promise<unknown>): Promise<void> {
    if (this.working || this.closed) return;
    this.capture(); this.working = true;
    try { await work(); }
    catch (error) { this.warn(error); }
    finally { this.working = false; if (!this.closed) await this.render({ force: false, captureEffectDraft: false }); }
  }
  private static async add(this: ItemEffectConfigApplication, _event: PointerEvent, target: HTMLElement): Promise<void> {
    this.draft = readDraft(target.closest("form"), this.draft);
    await this.run(() => this.service.create(this.draft, this.creationOptions()));
  }
  private static async custom(this: ItemEffectConfigApplication): Promise<void> {
    await this.run(async () => { const effect = await this.service.create(undefined, this.creationOptions()); await effect.sheet.render({ force: true }); });
  }
  private static async edit(this: ItemEffectConfigApplication, _event: PointerEvent, target: HTMLElement): Promise<void> {
    await this.run(async () => {
      const source = this.service.sources().find(effect => effect.id === target.dataset.effectId);
      if (!source) throw new Error("Efeito não encontrado nesta habilidade.");
      if (!source.quick || !this.service.editable || (source.benefit && this.service.legacy().pending)) return this.service.open(source.id);
      this.editing = { id: source.id, baseline: source.quick, draft: { ...defaultItemEffectDraft(), ...source.quick.draft } };
    });
  }
  private static async advanced(this: ItemEffectConfigApplication, _event: PointerEvent, target: HTMLElement): Promise<void> {
    await this.run(() => this.service.open(target.dataset.effectId ?? ""));
  }
  private static async save(this: ItemEffectConfigApplication): Promise<void> {
    await this.run(async () => {
      if (!this.editing) return;
      await this.service.save(this.editing.id, this.editing.baseline, this.editing.draft);
      this.editing = null;
    });
  }
  private static async cancel(this: ItemEffectConfigApplication): Promise<void> {
    if (this.working) return;
    this.editing = null; await this.render({ force: false });
  }
  private static async remove(this: ItemEffectConfigApplication, _event: PointerEvent, target: HTMLElement): Promise<void> {
    await this.run(async () => {
      const source = this.service.sources().find(effect => effect.id === target.dataset.effectId);
      if (!source || !this.service.editable) throw new Error("Efeito indisponível para exclusão.");
      if (!await foundry.applications.api.DialogV2.confirm({ window: { title: "Excluir efeito" }, content: `<p>Excluir o efeito <strong>${escapeHtml(source.name)}</strong> desta habilidade?</p>` })) return;
      await this.service.remove(source.id);
      if (this.editing?.id === source.id) this.editing = null;
    });
  }
  private static async importLegacy(this: ItemEffectConfigApplication): Promise<void> {
    await this.run(async () => {
      const preview = this.service.legacy();
      if (!preview.pending || !this.service.editable || !game.user?.isGM) throw new Error("Importação indisponível.");
      const names = preview.missing.map(source => `<li>${escapeHtml(source.template.name)}</li>`).join("");
      if (!await foundry.applications.api.DialogV2.confirm({ window: { title: "Importar benefícios legados" },
        content: `<p>Importar benefícios de <strong>${escapeHtml(this.item.name)}</strong>?</p><ul>${names}</ul><p>Serão criados ${preview.missing.length} efeitos faltantes e gravado o marcador de conclusão. Efeitos existentes e flags legadas serão preservados.</p>` })) return;
      await this.service.importLegacy(preview.fingerprint);
    });
  }
}
