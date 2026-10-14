import { readAllyAbility, writeAllyAbility } from "../features/allies/config/ally-ability-config";
import type { AllyAbilityDefinition } from "../core/allies/ally-definition";
import { renderAllyAbilityConfig } from "../ui/components/ally/ally-ability-config";

export class AllyAbilityConfigApplication extends foundry.applications.api.ApplicationV2 {
  static DEFAULT_OPTIONS = {
    tag: "form", window: { title: "Benefícios do Aliado", resizable: true },
    position: { width: 480, height: 380 },
    form: { handler: AllyAbilityConfigApplication.submit, closeOnSubmit: true },
    actions: { addBenefit: AllyAbilityConfigApplication.add, removeBenefit: AllyAbilityConfigApplication.remove },
  };
  private draft: AllyAbilityDefinition;
  constructor(private readonly item: Item) {
    super({});
    const config = readAllyAbility(item);
    if (!config) throw new Error("Configuração desconhecida ou inválida. Os dados foram preservados.");
    this.draft = structuredClone(config);
  }
  async _renderHTML(): Promise<HTMLElement> {
    const root = document.createElement("div");
    root.innerHTML = renderAllyAbilityConfig(this.draft);
    return root;
  }
  _replaceHTML(result: HTMLElement, content: HTMLElement): void { content.replaceChildren(result); }
  private capture(form: HTMLFormElement | null): void {
    if (!form) return;
    for (const input of form.querySelectorAll<HTMLInputElement>("[data-benefit-value]")) {
      const benefit = this.draft.benefits.find(entry => entry.id === input.dataset.benefitValue);
      if (benefit) {
        if (!input.value.trim() || !Number.isFinite(Number(input.value))) throw new Error("Informe um bônus numérico válido.");
        benefit.value = Number(input.value);
      }
    }
  }
  private static async add(this: AllyAbilityConfigApplication, _event: PointerEvent, target: HTMLElement): Promise<void> {
    this.capture(target.closest("form"));
    this.draft.benefits.push({ id: foundry.utils.randomID(), kind: "defense", value: 5 });
    await this.render({ force: true });
  }
  private static async remove(this: AllyAbilityConfigApplication, _event: PointerEvent, target: HTMLElement): Promise<void> {
    this.capture(target.closest("form"));
    this.draft.benefits = this.draft.benefits.filter(entry => entry.id !== target.dataset.benefitId);
    await this.render({ force: true });
  }
  private static async submit(this: AllyAbilityConfigApplication, _event: SubmitEvent, form: HTMLFormElement, _formData: unknown): Promise<void> {
    this.capture(form);
    await writeAllyAbility(this.item, this.draft);
  }
}
