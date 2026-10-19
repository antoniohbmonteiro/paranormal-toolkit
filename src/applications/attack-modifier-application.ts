import { MODULE_ID } from "../constants";
import { adjustSpecialAttack, createAttackModifierDialogModel, toggleAttackConfigurationOption, toggleAttackGeneralAction, type AttackModifierDialogInput } from "../features/attack-modifiers/attack-modifier-dialog-model";
import { emptyAttackConfiguration, type AttackConfigurationSelection } from "../features/attack-modifiers/attack-general-actions";
import { renderAttackModifierDialog } from "../ui/components/attack/attack-modifier-dialog";
import { ensureModuleStylesheet } from "../ui/styles/module-stylesheet-loader";

const { ApplicationV2 } = foundry.applications.api;
export class AttackModifierApplication extends ApplicationV2 {
  private selection = emptyAttackConfiguration();
  private resolved = false;
  static DEFAULT_OPTIONS = {
    id: MODULE_ID + "-attack-modifiers",
    classes: [MODULE_ID, "paranormal-toolkit-ritual-cast-app", "paranormal-toolkit-ability-use-app", "paranormal-toolkit-attack-modifier-app"],
    tag: "section", position: { width: 540, height: "auto" },
    window: { title: "Configurar ataque", icon: "fa-solid fa-crosshairs", resizable: true },
    actions: { attack: AttackModifierApplication.onAttack, cancel: AttackModifierApplication.onCancel },
  };
  constructor(private readonly input: AttackModifierDialogInput, private readonly resolveRequest: (value: AttackConfigurationSelection | null) => void) {
    super({ id: MODULE_ID + "-attack-" + foundry.utils.randomID(), window: { title: "Atacar com " + input.weaponName } });
  }
  static request(input: AttackModifierDialogInput): Promise<AttackConfigurationSelection | null> {
    ensureModuleStylesheet("styles/attack-modifiers.css");
    return new Promise((resolve, reject) => {
      const app = new AttackModifierApplication(input, resolve);
      void Promise.resolve(app.render({ force: true })).catch(reject);
    });
  }
  async _renderHTML(_context: object, _options: object): Promise<HTMLElement> {
    const root = document.createElement("div");
    root.className = "paranormal-toolkit-ritual-cast paranormal-toolkit-attack-modifiers";
    root.innerHTML = renderAttackModifierDialog(createAttackModifierDialogModel(this.input, this.selection));
    return root;
  }
  _replaceHTML(result: HTMLElement, content: HTMLElement, _options: object): void {
    const previous = content.querySelector<HTMLElement>("[data-attack-scroll]"), scrollTop = previous?.scrollTop ?? 0;
    const active = content.contains(document.activeElement) ? (document.activeElement as HTMLElement).dataset.controlId : undefined;
    content.replaceChildren(result);
    const scroll = result.querySelector<HTMLElement>("[data-attack-scroll]");
    if (scroll) scroll.scrollTop = scrollTop;
    for (const control of result.querySelectorAll<HTMLElement>("[data-control-id]")) {
      if (active !== control.dataset.controlId) continue;
      const target = control instanceof HTMLButtonElement && control.disabled && control.dataset.specialField
        ? result.querySelector<HTMLButtonElement>('button[data-special-field="' + control.dataset.specialField + '"]:not(:disabled)') : control;
      target?.focus({ preventScroll: true });
    }
    for (const button of result.querySelectorAll<HTMLButtonElement>("button[data-special-field]")) {
      button.addEventListener("click", () => {
        const field = button.dataset.specialField;
        if (field !== "attackBlocks" && field !== "damageBlocks") return;
        this.selection = adjustSpecialAttack(this.input, this.selection, field, Number(button.dataset.delta));
        void this.render({ force: true });
      });
    }
    for (const input of result.querySelectorAll<HTMLInputElement>("input[data-control-id]")) {
      input.addEventListener("change", () => {
        const action = input.dataset.generalAction;
        this.selection = action === "aim" || action === "burst"
          ? toggleAttackGeneralAction(this.input, this.selection, action, input.checked)
          : toggleAttackConfigurationOption(this.input.available, this.selection, input.dataset.presetId ?? "", input.dataset.optionId ?? "", input.checked);
        void this.render({ force: true });
      });
    }
  }
  async close(options?: Record<string, unknown>): Promise<this> { this.settle(null); return super.close(options) as Promise<this>; }
  private static async onAttack(this: AttackModifierApplication): Promise<void> {
    if (!createAttackModifierDialogModel(this.input, this.selection).canConfirm) return;
    this.settle(structuredClone(this.selection)); await this.close();
  }
  private static async onCancel(this: AttackModifierApplication): Promise<void> { await this.close(); }
  private settle(value: AttackConfigurationSelection | null): void { if (!this.resolved) { this.resolved = true; this.resolveRequest(value); } }
}
