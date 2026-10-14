import { prepareAllyApproval, readAllySupportView, submitAllyRequest } from "../adapters/foundry/foundry-ally-request-adapter";
import { escapeHtml } from "../ui/rendering/escape-html";
import type { AllyRequest } from "../features/allies/ally-operation-authority";
import { readAllyProfile } from "../core/allies/ally-profile";
import { getActorItems } from "../features/automation/actor-item-resolver";
import { renderAllySheet, type AllySheetViewModel } from "../ui/components/ally/ally-sheet";

export class AllySheet extends foundry.applications.sheets.ActorSheetV2 {
  static DEFAULT_OPTIONS = {
    classes: ["paranormal-toolkit-ally-sheet"],
    tag: "form",
    position: { width: 560, height: 640 },
    window: { resizable: true },
    form: { submitOnChange: false, closeOnSubmit: false },
    actions: {
      createAbility: AllySheet.onCreateAbility,
      openAbility: AllySheet.onOpenAbility,
      removeAbility: AllySheet.onRemoveAbility,
      configureBenefits: AllySheet.onConfigureBenefits,
      assignSupport: AllySheet.onAssignSupport,
      activateSupport: AllySheet.onActivateSupport,
      deactivateSupport: AllySheet.onDeactivateSupport,
      approveSupport: AllySheet.onApproveSupport,
      reconcileSupport: AllySheet.onReconcileSupport,
      validateSupport: AllySheet.onValidateSupport,
    },
  };

  async _prepareContext(options: Record<string, unknown>): Promise<AllySheetViewModel> {
    await super._prepareContext(options);
    return {
      name: this.actor.name,
      image: this.actor.img,
      profile: readAllyProfile(this.actor.system),
      editable: this.canEdit(),
      support: {
        ...await readAllySupportView(this.actor), isGM: Boolean(game.user?.isGM),
        beneficiaries: (game.actors?.contents ?? []).filter(actor => actor.type === "agent" && !actor.isToken)
          .map(actor => ({ id: actor.id!, name: actor.name })),
        combats: (game.combats?.contents ?? []).filter(combat => combat.started)
          .map(combat => ({ id: combat.id, name: combat.name ?? combat.id })),
      },
      abilities: getActorItems(this.actor)
        .filter((item) => item.type === "ability" && item.id)
        .map((item) => ({ id: item.id!, name: item.name })),
    };
  }

  async _renderHTML(context: AllySheetViewModel, _options: Record<string, unknown>): Promise<HTMLElement> {
    const root = document.createElement("div");
    root.className = "ally-sheet-content";
    root.innerHTML = renderAllySheet(context);
    return root;
  }

  _replaceHTML(result: HTMLElement, content: HTMLElement, _options: Record<string, unknown>): void {
    content.replaceChildren(result);
  }

  async _processSubmitData(
    _event: SubmitEvent, _form: HTMLFormElement, submitData: Record<string, unknown>,
  ): Promise<{ updated?: Actor }> {
    if (!this.canEdit()) throw new Error("Você não possui permissão para editar este Aliado.");
    if (!readAllyProfile(this.actor.system)) throw new Error("Dados do Aliado inválidos ou de versão não suportada.");
    const system = submitData.system as Record<string, unknown> | undefined;
    if (typeof submitData.name !== "string" || !submitData.name.trim()) throw new Error("Informe o nome do Aliado.");
    if (typeof submitData.img !== "string" || typeof system?.description !== "string" || typeof system.isDrone !== "boolean") {
      throw new Error("Os campos do Aliado são inválidos.");
    }
    const updated = await this.actor.update({
      name: submitData.name.trim(), img: submitData.img,
      "system.description": system.description, "system.isDrone": system.isDrone,
    });
    return { updated };
  }

  async _onDropDocument(event: DragEvent, document: { documentName: string }): Promise<Item | null | undefined> {
    if (!this.canEdit() || !readAllyProfile(this.actor.system)) return null;
    if (document.documentName !== "Item") {
      ui.notifications?.warn("Esta ficha aceita apenas itens do tipo habilidade.");
      return null;
    }
    return this._onDropItem(event, document as Item);
  }

  async _onDropItem(event: DragEvent, item: Item): Promise<Item | null | undefined> {
    if (!this.canEdit() || !readAllyProfile(this.actor.system)) return null;
    if (item.type !== "ability") {
      ui.notifications?.warn("Esta ficha aceita apenas itens do tipo habilidade.");
      return null;
    }
    return super._onDropItem(event, item);
  }

  private canEdit(): boolean {
    return this.isEditable && Boolean(game.user && this.actor.canUserModify(game.user, "update"));
  }

  private findAbility(id: string | undefined): Item | undefined {
    return getActorItems(this.actor).find((item) => item.id === id && item.type === "ability");
  }

  private async requestSupport(action: AllyRequest["action"], fields: { beneficiaryId?: string; combatId?: string } = {}): Promise<void> {
    if (!this.canEdit()) return;
    try { await submitAllyRequest(this.actor, action, fields); }
    catch (error) { ui.notifications?.warn(error instanceof Error ? error.message : "Falha ao solicitar suporte."); }
  }
  private static async onConfigureBenefits(this: AllySheet, _event: PointerEvent, target: HTMLElement): Promise<void> {
    if (!this.canEdit()) return;
    const item = this.findAbility(target.dataset.itemId);
    if (!item) return;
    const { AllyAbilityConfigApplication } = await import("./ally-ability-config-application");
    await new AllyAbilityConfigApplication(item).render({ force: true });
  }
  private static async onAssignSupport(this: AllySheet, _event: PointerEvent, target: HTMLElement): Promise<void> {
    const form = target.closest("form");
    const beneficiaryId = form?.querySelector<HTMLSelectElement>('[data-ally-beneficiary]')?.value;
    const combatId = form?.querySelector<HTMLSelectElement>('[data-ally-combat]')?.value;
    if (!beneficiaryId) { ui.notifications?.warn("Selecione um beneficiário."); return; }
    await this.requestSupport("assign", { beneficiaryId, ...(combatId ? { combatId } : {}) });
  }
  private static async onActivateSupport(this: AllySheet): Promise<void> { await this.requestSupport("activate"); }
  private static async onDeactivateSupport(this: AllySheet): Promise<void> { await this.requestSupport("deactivate"); }
  private static async onApproveSupport(this: AllySheet): Promise<void> {
    if (!this.canEdit() || !game.user?.isGM) return;
    try {
      const review = await prepareAllyApproval(this.actor);
      const confirmed = await foundry.applications.api.DialogV2.confirm({
        window: { title: "Aprovar suporte do Aliado" },
        content: `<p>Beneficiário: ${escapeHtml(review.beneficiaryName)}</p><p>Benefícios autorizados:</p><ul>
          ${review.benefits.map(benefit => `<li>${escapeHtml(benefit.itemName)} — Defesa ${escapeHtml(String(benefit.value))}</li>`).join("")}
          </ul><p>Alterar o vínculo ou estes benefícios exige nova aprovação.</p>`,
      });
      if (confirmed && this.canEdit()) await submitAllyRequest(this.actor, "approve", {}, review);
    } catch (error) {
      ui.notifications?.warn(error instanceof Error ? error.message : "Falha ao aprovar suporte.");
    }
  }
  private static async onReconcileSupport(this: AllySheet): Promise<void> { await this.requestSupport("reconcile"); }
  private static async onValidateSupport(this: AllySheet): Promise<void> {
    if (!game.user?.isGM) return;
    const confirmed = await foundry.applications.api.DialogV2.confirm({
      window: { title: "Validação do ambiente Allies" },
      content: "<p>Confirme somente após testar neste mundo: efeito add/initial de Defesa participa da Defesa e esquiva sem alterar o valor salvo; dois jogadores não conseguem alterar o Journal operacional nem a referência nas flags dos GMs; dois GMs processam uma única solicitação.</p><p>Esta confirmação registra a validação manual para a versão atual de Foundry e Ordem.</p>",
    });
    if (confirmed) await this.requestSupport("validate");
  }

  private static async onCreateAbility(this: AllySheet): Promise<void> {
    if (!this.canEdit() || !readAllyProfile(this.actor.system)) return;
    const [item] = await this.actor.createEmbeddedDocuments("Item", [{
      name: "Nova habilidade", type: "ability", system: { abilityType: "ability" },
    }]);
    await item?.sheet.render({ force: true });
  }

  private static async onOpenAbility(this: AllySheet, _event: PointerEvent, target: HTMLElement): Promise<void> {
    const item = this.findAbility(target.dataset.itemId);
    await item?.sheet.render({ force: true });
  }

  private static async onRemoveAbility(this: AllySheet, _event: PointerEvent, target: HTMLElement): Promise<void> {
    if (!this.canEdit() || !readAllyProfile(this.actor.system)) return;
    const item = this.findAbility(target.dataset.itemId);
    if (!item?.id) return;
    const confirmed = await foundry.applications.api.DialogV2.confirm({
      window: { title: "Remover habilidade" },
      content: "<p>Remover esta habilidade do Aliado?</p>",
    });
    if (!confirmed || !this.canEdit() || !this.findAbility(item.id)) return;
    await this.actor.deleteEmbeddedDocuments("Item", [item.id]);
  }
}
