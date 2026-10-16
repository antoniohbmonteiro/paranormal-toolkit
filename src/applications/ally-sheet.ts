import { FoundryAllySupportRequests, readAllySupportView, type AllyRequestFields } from "../adapters/foundry/foundry-ally-request-adapter";
import type { AllyRequest } from "../features/allies/ally-operation-authority";
import { readFoundryAllyProfile, resolveFoundryAllyActor } from "../adapters/foundry/foundry-ally-actor-resolver";
import { getActorItems } from "../features/automation/actor-item-resolver";
import { renderAllySheet, type AllySheetViewModel, type AllyTab } from "../ui/components/ally/ally-sheet";
import { getAllyPilotAbilitiesEnabled } from "../features/allies/ally-settings";
import type { AllyGrantedAbilityShortcut } from "../features/allies/ally-granted-ability-shortcut";
import { ALLY_EDIT_FIELDS, AllySheetEditState, buildAllyFieldUpdate, isAllyEditField, type AllyEditField, type AllyEditValue } from "../features/allies/ally-sheet-edit-state";
import { resolveActivationLabel, resolveAbilityResource, isPassiveActivation } from "../features/abilities/ability-item-resolver";
import { MODULE_ID } from "../constants";
import { escapeHtml } from "../ui/rendering/escape-html";
import { updateAllySheetDOM } from "./ally-sheet-dom";
import { bindAllyItemMenus, type AllyItemMenus } from "./ally-sheet-menus";
import { bindAllyRichText, type AllyRichTextElement } from "./ally-sheet-rich-text";

type SheetServices = { support: FoundryAllySupportRequests; shortcuts: AllyGrantedAbilityShortcut };
type FieldElement = HTMLElement & { value: string; checked?: boolean; type?: string };

export class AllySheet extends foundry.applications.sheets.ActorSheetV2 {
  private static services: SheetServices | null = null;
  private readonly edits = new AllySheetEditState();
  private readonly boundElements = new WeakSet<HTMLElement>();
  private readonly saving = new Map<AllyEditField, Promise<void>>();
  private readonly saveAgain = new Set<AllyEditField>();
  private readonly using = new Set<string>();
  private readonly expandedAbilities = new Set<string>();
  private menus: AllyItemMenus | null = null;
  private editingName = false;
  private supportBusy = false;
  private notice: string | null = null;
  static configureServices(services: SheetServices): void { this.services = services; }
  get actor(): Actor { const origin = super.actor; return resolveFoundryAllyActor(origin) ?? origin; }
  static TABS = { ally: { initial: "support", tabs: [{ id: "support" }, { id: "abilities" }, { id: "details" }] } };
  static DEFAULT_OPTIONS = {
    classes: ["paranormal-toolkit-ally-sheet"], tag: "form",
    position: { width: 760, height: 650 }, window: { resizable: true, title: "Aliado" },
    form: { submitOnChange: false, closeOnSubmit: false },
    actions: {
      createAbility: AllySheet.onCreateAbility, openAbility: AllySheet.onOpenAbility,
      removeAbility: AllySheet.onRemoveAbility, configureBenefits: AllySheet.onConfigureBenefits,
      useAbility: AllySheet.onUseAbility, changeAllyTab: AllySheet.onChangeTab, reconcileSupport: AllySheet.onReconcileSupport,
      toggleAbility: AllySheet.onToggleAbility, editAllyName: AllySheet.onEditName, editAllyImage: AllySheet.onEditImage,
    },
  };

  async _prepareContext(options: Record<string, unknown>): Promise<AllySheetViewModel> {
    await super._prepareContext(options);
    const profile = readFoundryAllyProfile(this.actor), support = await readAllySupportView(this.actor);
    const fields = Object.fromEntries(ALLY_EDIT_FIELDS.map(field => [field, this.edits.observe(field, this.fieldValue(field))]));
    return {
      name: this.actor.name, image: this.actor.img, profile, editable: this.canEdit(), fields,
      editingName: this.editingName, documentUUID: this.actor.uuid ?? undefined,
      descriptionHTML: await this.enrichDescription(profile?.description ?? "", this.actor),
      idPrefix: this.id, activeTab: (this.tabGroups?.ally ?? "support") as AllyTab, notice: this.notice,
      support: { ...support, isGM: Boolean(game.user?.isGM), pilotAbilitiesEnabled: getAllyPilotAbilitiesEnabled(),
        busy: this.supportBusy || AllySheet.services?.support.isPending(this.actor.id!) === true,
        beneficiaries: (game.actors?.contents ?? []).filter(actor => actor.type === "agent" && !actor.isToken)
          .map(actor => ({ id: actor.id!, name: actor.name })) },
      abilities: await Promise.all(getActorItems(this.actor).filter(item => item.type === "ability" && item.id).map(async item => {
        const availability = AllySheet.services?.shortcuts.inspect(this.actor.id!, item, support);
        const activation = String(item.system.activation ?? "");
        const rawCost = Number(item.system.cost);
        const cost = item.getFlag(MODULE_ID, "automation") !== undefined || !Number.isFinite(rawCost) || isPassiveActivation(activation)
          ? null : `${Math.max(0, Math.trunc(rawCost))} ${resolveAbilityResource()}`;
        return { id: item.id!, name: item.name, image: item.img, execution: resolveActivationLabel(activation), cost,
          expanded: this.expandedAbilities.has(item.id!),
          descriptionHTML: this.expandedAbilities.has(item.id!) ? await this.enrichDescription(String(item.system.description ?? ""), item) : "",
          usable: profile !== null && availability?.enabled === true && !this.using.has(item.id!),
          useReason: this.using.has(item.id!) ? "Uso em andamento." : availability?.reason ?? "Uso indisponível." };
      })),
    };
  }
  async _renderHTML(context: AllySheetViewModel): Promise<HTMLElement> {
    const root = document.createElement("div"); root.className = "ally-sheet-content";
    root.innerHTML = renderAllySheet(context); return root;
  }
  _replaceHTML(result: HTMLElement, content: HTMLElement): void { updateAllySheetDOM(content, result); }
  async _onRender(context: object, options: Record<string, unknown>): Promise<void> {
    await super._onRender(context, options);
    for (const editor of this.element.querySelectorAll<AllyRichTextElement>('prose-mirror[data-ally-field="system.description"]')) {
      bindAllyRichText(editor, { canEdit: () => this.canEdit() && readFoundryAllyProfile(this.actor) !== null,
        opened: () => this.edits.focus("system.description", this.fieldValue("system.description")),
        saved: value => { this.edits.edit("system.description", value, this.fieldValue("system.description")); void this.commitField("system.description"); },
        closed: () => { this.edits.blur("system.description"); void this.render({ force: false }); } });
    }
    if (this.boundElements.has(this.element)) return;
    this.boundElements.add(this.element);
    this.menus?.dispose();
    this.menus = bindAllyItemMenus(this.element);
    this.element.addEventListener("input", event => this.captureField(event));
    this.element.addEventListener("keydown", event => this.onKeyDown(event));
    this.element.addEventListener("focusin", event => {
      const field = (event.target as HTMLElement).closest<HTMLElement>('[data-ally-field]')?.dataset.allyField;
      if (isAllyEditField(field) && field !== "system.description") this.edits.focus(field, this.fieldValue(field));
    });
    this.element.addEventListener("focusout", event => {
      const target = (event.target as HTMLElement).closest<HTMLElement>('[data-ally-field]');
      if (!target || !isAllyEditField(target.dataset.allyField) || (event.relatedTarget && target.contains(event.relatedTarget as Node))) return;
      const field = target.dataset.allyField;
      if (field === "system.description") return;
      this.edits.blur(field);
      if (!this.saving.has(field)) void this.commitField(field);
    });
  }
  async close(options?: Record<string, unknown>): Promise<this> {
    this.menus?.dispose(); this.menus = null;
    return await super.close(options);
  }
  _getHeaderControls(): Record<string, unknown>[] {
    const controls = super._getHeaderControls();
    return game.user?.isGM ? [...controls, { icon: "fa-solid fa-arrows-rotate", label: "Reconciliar suporte", action: "reconcileSupport" }] : controls;
  }
  changeTab(tab: string, group: string, options: Record<string, unknown> = {}): void {
    super.changeTab(tab, group, { ...options, updatePosition: false });
    for (const button of this.element.querySelectorAll<HTMLElement>('.ally-tabs [data-tab]')) {
      const active = button.dataset.tab === tab;
      button.setAttribute("aria-selected", String(active)); button.tabIndex = active ? 0 : -1;
    }
  }
  private onKeyDown(event: KeyboardEvent): void {
    const target = event.target as HTMLElement;
    const button = target.closest<HTMLElement>('.ally-tabs [data-tab]');
    if (button && ["ArrowLeft", "ArrowRight", "Home", "End"].includes(event.key)) {
      const tabs = Array.from(this.element.querySelectorAll<HTMLElement>('.ally-tabs [data-tab]'));
      const position = tabs.indexOf(button), last = tabs.length - 1;
      const next = event.key === "Home" ? 0 : event.key === "End" ? last : (position + (event.key === "ArrowRight" ? 1 : last)) % tabs.length;
      event.preventDefault(); this.changeTab(tabs[next].dataset.tab!, "ally"); tabs[next].focus();
    } else if (event.key === "Enter" && target.matches('input[data-ally-field]')) {
      event.preventDefault(); this.captureField(event); const field = target.dataset.allyField;
      if (isAllyEditField(field)) void this.commitField(field);
    }
  }
  _onChangeForm(_config: unknown, event: Event): void {
    const target = (event.target as HTMLElement).closest<HTMLElement>('[data-ally-field], [data-ally-beneficiary], [data-ally-pilot]');
    if (!target) return;
    if (target.tagName === "PROSE-MIRROR") return;
    if (target.hasAttribute("data-ally-beneficiary")) { void this.requestSupport("setBeneficiary", { beneficiaryId: (target as HTMLSelectElement).value || null }); return; }
    if (target.hasAttribute("data-ally-pilot")) { void this.requestSupport("setPilot", { pilotId: (target as HTMLSelectElement).value || null }); return; }
    this.captureField(event);
    if (isAllyEditField(target.dataset.allyField)) void this.commitField(target.dataset.allyField);
  }
  async _onSubmitForm(_config: unknown, event: Event): Promise<void> {
    event.preventDefault();
    const target = this.element?.ownerDocument.activeElement as HTMLElement | null;
    if (isAllyEditField(target?.dataset.allyField)) await this.commitField(target.dataset.allyField);
  }
  private fieldValue(field: AllyEditField): AllyEditValue {
    if (field === "name") return this.actor.name;
    if (field === "img") return this.actor.img;
    const profile = readFoundryAllyProfile(this.actor);
    return field === "system.isDrone" ? profile?.isDrone ?? false : profile?.description ?? "";
  }
  private async enrichDescription(content: string, relativeTo: Actor | Item): Promise<string> {
    return foundry.applications.ux.TextEditor.implementation.enrichHTML(content, {
      secrets: this.canEdit(), relativeTo, rollData: relativeTo.getRollData?.() ?? {},
    });
  }
  private captureField(event: Event): void {
    const target = (event.target as HTMLElement).closest<FieldElement>('[data-ally-field]');
    if (!target || !isAllyEditField(target.dataset.allyField) || !this.canEdit()) return;
    const field = target.dataset.allyField;
    this.edits.edit(field, target.type === "checkbox" ? Boolean(target.checked) : target.value, this.fieldValue(field));
  }
  private async commitField(field: AllyEditField): Promise<void> {
    if (!this.canEdit() || !readFoundryAllyProfile(this.actor)) return;
    const existing = this.saving.get(field);
    if (existing) { this.saveAgain.add(field); return existing; }
    const work = async () => {
      const prepared = this.edits.prepare(field, this.fieldValue(field));
      if (prepared === "unchanged") return;
      if (prepared === "conflict") {
        const remote = this.fieldValue(field);
        const choice = await foundry.applications.api.DialogV2.wait({ window: { title: "Campo alterado em outro cliente" },
          content: "<p>Este campo mudou enquanto você editava. Qual valor deseja manter?</p>", buttons: [
            { action: "mine", label: "Manter minha edição" }, { action: "current", label: "Usar valor atual" },
          ], rejectClose: false });
        if (choice === "current") { this.edits.acceptRemote(field, this.fieldValue(field)); return; }
        if (choice !== "mine") { this.edits.failed(field, "Edição não salva. Confirme ou saia do campo para tentar novamente."); return; }
        if (this.fieldValue(field) !== remote) { this.edits.failed(field, "O campo mudou novamente. Confira o valor atual antes de confirmar sua edição."); return; }
      }
      if (!this.canEdit()) return;
      const submitted = this.edits.begin(field);
      try {
        const update = buildAllyFieldUpdate(field, submitted);
        await this.actor.update(update);
        this.edits.saved(field, submitted, this.fieldValue(field));
      } catch (error) { this.edits.failed(field, error instanceof Error ? error.message : "Falha ao salvar este campo."); }
    };
    const pending = work(); this.saving.set(field, pending);
    try { await pending; }
    finally {
      this.saving.delete(field);
      if (field === "name" && !this.edits.observe(field, this.fieldValue(field)).dirty) this.editingName = false;
      await this.render({ force: false });
      if (field === "system.description" && this.edits.observe(field, this.fieldValue(field)).dirty && this.canEdit()) {
        const editor = this.element.querySelector<AllyRichTextElement>('prose-mirror[data-ally-field="system.description"]');
        if (editor && !editor.open) editor.open = true;
      }
      if (this.saveAgain.delete(field)) await this.commitField(field);
    }
  }
  private async requestSupport(action: AllyRequest["action"], fields: AllyRequestFields = {}): Promise<void> {
    if (!this.canEdit() || this.supportBusy) return;
    const service = AllySheet.services?.support;
    if (!service) return;
    if (service.isPending(this.actor.id!)) { await this.render({ force: false }); return; }
    this.supportBusy = true; this.notice = null;
    try {
      await this.render({ force: false });
      let reply = await service.submit(this.actor, action, fields);
      if (!reply.ok && reply.combats?.length) {
        const combatId = await foundry.applications.api.DialogV2.prompt({ window: { title: "Combate do suporte" },
          content: `<label>Combate<select name="combat">${reply.combats.map(combat => `<option value="${escapeHtml(combat.id)}">${escapeHtml(combat.name)}</option>`).join("")}</select></label>`,
          ok: { label: "Usar combate", callback: (_event: unknown, button: { form: HTMLFormElement }) => button.form.querySelector<HTMLSelectElement>('[name="combat"]')?.value }, rejectClose: false });
        if (!combatId) return;
        reply = await service.submit(this.actor, action, { ...fields, combatId: String(combatId) });
      }
      this.notice = reply.ok ? reply.view.diagnostic : reply.error ?? "Não foi possível alterar o suporte.";
    } catch (error) { this.notice = error instanceof Error ? error.message : "Falha ao solicitar suporte."; }
    finally { this.supportBusy = false; await this.render({ force: false }); }
  }
  async _onDropDocument(event: DragEvent, document: { documentName: string }): Promise<Item | null | undefined> {
    if (!this.canEdit() || !readFoundryAllyProfile(this.actor)) return null;
    if (document.documentName !== "Item") { ui.notifications?.warn("Esta ficha aceita apenas itens do tipo habilidade."); return null; }
    return this._onDropItem(event, document as Item);
  }
  async _onDropItem(event: DragEvent, item: Item): Promise<Item | null | undefined> {
    if (!this.canEdit() || !readFoundryAllyProfile(this.actor)) return null;
    if (item.type !== "ability") { ui.notifications?.warn("Esta ficha aceita apenas itens do tipo habilidade."); return null; }
    return super._onDropItem(event, item);
  }
  private canEdit(): boolean { return this.isEditable && Boolean(game.user && this.actor.canUserModify(game.user, "update")); }
  private findAbility(id: string | undefined): Item | undefined { return getActorItems(this.actor).find(item => item.id === id && item.type === "ability"); }
  private static onChangeTab(this: AllySheet, event: PointerEvent, target: HTMLElement): void {
    event.preventDefault(); this.changeTab(target.dataset.tab!, "ally");
  }
  private static async onToggleAbility(this: AllySheet, event: PointerEvent, target: HTMLElement): Promise<void> {
    event.preventDefault(); event.stopPropagation();
    const id = target.dataset.itemId; if (!id || !this.findAbility(id)) return;
    if (!this.expandedAbilities.delete(id)) this.expandedAbilities.add(id);
    await this.render({ force: false });
  }
  private static async onEditName(this: AllySheet, event: PointerEvent): Promise<void> {
    event.preventDefault(); event.stopPropagation();
    if (!this.canEdit() || !readFoundryAllyProfile(this.actor)) return;
    this.edits.focus("name", this.actor.name); this.editingName = true;
    await this.render({ force: false });
    const input = this.element.querySelector<HTMLInputElement>('[data-ally-field="name"]');
    input?.focus(); input?.select();
  }
  private static async onEditImage(this: AllySheet, event: PointerEvent): Promise<void> {
    event.preventDefault(); event.stopPropagation();
    if (!this.canEdit() || !readFoundryAllyProfile(this.actor)) return;
    const initial = this.actor.img;
    const picker = new foundry.applications.apps.FilePicker.implementation({ type: "image", current: this.actor.img, document: this.actor,
      callback: async (path: string) => {
        if (!this.canEdit() || !readFoundryAllyProfile(this.actor)) return;
        this.edits.edit("img", path, initial); await this.commitField("img");
      } });
    await picker.browse();
  }
  private static async onUseAbility(this: AllySheet, event: PointerEvent, target: HTMLElement): Promise<void> {
    event.preventDefault(); event.stopPropagation();
    const id = target.dataset.itemId;
    if (!id || this.using.has(id) || !AllySheet.services) return;
    this.using.add(id); this.notice = null;
    try { await this.render({ force: false }); await AllySheet.services.shortcuts.use(this.actor, id); }
    catch (error) { this.notice = error instanceof Error ? error.message : "Não foi possível usar a habilidade."; ui.notifications?.warn(this.notice); }
    finally { this.using.delete(id); await this.render({ force: false }); }
  }
  private static async onReconcileSupport(this: AllySheet): Promise<void> { await this.requestSupport("reconcile"); }
  private static async onConfigureBenefits(this: AllySheet, event: PointerEvent, target: HTMLElement): Promise<void> {
    event.stopPropagation();
    if (!this.canEdit()) return;
    const item = this.findAbility(target.dataset.itemId); if (!item) return;
    await this.openPassiveBenefits(item);
  }
  private async openPassiveBenefits(item: Item): Promise<void> {
    const { AllyAbilityConfigApplication } = await import("./ally-ability-config-application");
    await new AllyAbilityConfigApplication(item).render({ force: true });
  }
  private static async onCreateAbility(this: AllySheet): Promise<void> {
    if (!this.canEdit() || !readFoundryAllyProfile(this.actor)) return;
    const [item] = await this.actor.createEmbeddedDocuments("Item", [{ name: "Nova habilidade", type: "ability", system: { abilityType: "ability" } }]);
    if (item) await this.openPassiveBenefits(item);
  }
  private static async onOpenAbility(this: AllySheet, event: PointerEvent, target: HTMLElement): Promise<void> {
    event.preventDefault(); event.stopPropagation();
    await this.findAbility(target.dataset.itemId)?.sheet.render({ force: true });
  }
  private static async onRemoveAbility(this: AllySheet, event: PointerEvent, target: HTMLElement): Promise<void> {
    event.stopPropagation();
    if (!this.canEdit() || !readFoundryAllyProfile(this.actor)) return;
    const item = this.findAbility(target.dataset.itemId); if (!item?.id) return;
    const confirmed = await foundry.applications.api.DialogV2.confirm({ window: { title: "Remover habilidade" }, content: "<p>Remover esta habilidade do Aliado?</p>" });
    if (confirmed && this.canEdit() && this.findAbility(item.id)) await this.actor.deleteEmbeddedDocuments("Item", [item.id]);
  }
}

export async function refreshAllySheets(allyId?: string): Promise<void> {
  await Promise.all(Array.from(AllySheet.instances()).filter((app): app is AllySheet => app instanceof AllySheet
    && (!allyId || app.actor.id === allyId)).map(app => app.render({ force: false })));
}
