import { MODULE_ID } from "../../constants";
import { renderRitualSingleTargetCard } from "../components";
import { RitualPreviewController } from "./ritual-preview-controller";

const { ApplicationV2 } = foundry.applications.api;
export class ComponentGalleryApplication extends ApplicationV2 {
  static DEFAULT_OPTIONS = { id: `${MODULE_ID}-component-gallery`, classes: [`${MODULE_ID}-component-gallery`], tag: "section", position: { width: 700, height: 760 }, window: { title: "Paranormal Toolkit · Ritual single-target", resizable: true } };
  private readonly controller = new RitualPreviewController();
  async _renderHTML(): Promise<HTMLElement> { const root = document.createElement("div"); root.className = "paranormal-toolkit-component-gallery"; root.innerHTML = this.renderContent(); return root; }
  _replaceHTML(result: HTMLElement, content: HTMLElement): void { content.replaceChildren(result); this.bindControls(content); }
  private renderContent(): string { return `<section class="paranormal-toolkit-component-gallery__group"><header class="paranormal-toolkit-component-gallery__toolbar"><label>Estado <select data-gallery-scenario><option value="success">Conjuração: sucesso</option><option value="casting-pending">Conjuração: pendente</option><option value="casting-failure">Conjuração: falha</option><option value="resistance-success">Resistência: sucesso</option><option value="resistance-failure">Resistência: falha</option><option value="effect-resolved">Efeito: resistência resolvida</option></select></label></header><div class="paranormal-toolkit-component-gallery__preview paranormal-toolkit-component-gallery__preview--narrow">${renderRitualSingleTargetCard(this.controller.snapshot())}</div></section>`; }
  private bindControls(root: HTMLElement): void {
    root.querySelector<HTMLSelectElement>("[data-gallery-scenario]")?.addEventListener("change", (event) => { this.controller.setScenario((event.currentTarget as HTMLSelectElement).value); void this.render({ force: true }); });
    root.querySelector<HTMLSelectElement>('[data-ritual-control="conjuration-formula"]')?.addEventListener("change", (event) => { this.controller.selectConjurationFormula((event.currentTarget as HTMLSelectElement).value); void this.render({ force: true }); });
    root.querySelector<HTMLSelectElement>('[data-ritual-control="damage-formula"]')?.addEventListener("change", (event) => { this.controller.selectDamageFormula((event.currentTarget as HTMLSelectElement).value); void this.render({ force: true }); });
    root.querySelector<HTMLButtonElement>('[data-ritual-control="resistance"]')?.addEventListener("click", () => { this.controller.resolveResistance("success"); void this.render({ force: true }); });
    root.querySelector<HTMLButtonElement>('[data-ritual-control="apply-damage"]')?.addEventListener("click", () => { this.controller.applyDamage(); void this.render({ force: true }); });
    root.querySelector<HTMLButtonElement>('[data-ritual-control="effect-resistance"]')?.addEventListener("click", () => { this.controller.resolveEffectResistance("success"); void this.render({ force: true }); });
  }
}
let gallery: ComponentGalleryApplication | null = null;
export function openComponentGallery(): void { gallery ??= new ComponentGalleryApplication(); void gallery.render({ force: true }); }
