import { MODULE_ID } from "../constants";
import { createAttackModifierDialogModel, toggleAttackModifierOption, type AttackModifierDialogInput } from "../features/attack-modifiers/attack-modifier-dialog-model";
import type { AttackModifierSelection } from "../features/attack-modifiers/attack-modifier-preset";
import { renderAttackModifierDialog } from "../ui/components/attack/attack-modifier-dialog";
import { ensureModuleStylesheet } from "../ui/styles/module-stylesheet-loader";

const { ApplicationV2 } = foundry.applications.api;
export class AttackModifierApplication extends ApplicationV2 {
  private selection: AttackModifierSelection = {};
  private resolved = false;
  static DEFAULT_OPTIONS = {
    id: MODULE_ID + "-attack-modifiers",
    classes: [MODULE_ID, "paranormal-toolkit-ritual-cast-app", "paranormal-toolkit-ability-use-app"],
    tag: "section", position: { width: 540, height: "auto" },
    window: { title: "Configurar ataque", icon: "fa-solid fa-crosshairs", resizable: true },
    actions: { attack: AttackModifierApplication.onAttack, cancel: AttackModifierApplication.onCancel },
  };
  constructor(private readonly input: AttackModifierDialogInput, private readonly resolveRequest: (value: AttackModifierSelection | null) => void) {
    super({ id: MODULE_ID + "-attack-" + foundry.utils.randomID(), window: { title: "Atacar com " + input.weaponName } });
  }
  static request(input: AttackModifierDialogInput): Promise<AttackModifierSelection | null> {
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
    content.replaceChildren(result);
    for (const input of result.querySelectorAll<HTMLInputElement>("input[data-option-id]")) {
      input.addEventListener("change", () => {
        this.selection = toggleAttackModifierOption(this.input.available, this.selection, input.dataset.presetId ?? "", input.dataset.optionId ?? "", input.checked);
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
  private settle(value: AttackModifierSelection | null): void { if (!this.resolved) { this.resolved = true; this.resolveRequest(value); } }
}
