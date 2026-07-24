import { MODULE_ID } from "../../constants";
import { renderChatCardHeader, renderChatCardSection, renderChatRollDisplay, renderChatStatusBanner } from "../components";
import { renderComponentExampleCards } from "./component-example-cards";
import { componentHeaderExamples, componentRollExamples, componentSectionExamples, componentStatusExamples } from "./component-example-fixtures";

const { ApplicationV2 } = foundry.applications.api;
export class ComponentGalleryApplication extends ApplicationV2 {
  static DEFAULT_OPTIONS = { id: `${MODULE_ID}-component-gallery`, classes: [`${MODULE_ID}-component-gallery`], tag: "section", position: { width: 920, height: 760 }, window: { title: "Paranormal Toolkit · Componentes", resizable: true } };
  async _renderHTML(): Promise<HTMLElement> {
    const root = document.createElement("div");
    root.className = "paranormal-toolkit-component-gallery";
    const groups = [
      ["Headers", componentHeaderExamples.map(renderChatCardHeader)],
      ["Sections", componentSectionExamples.map((item) => renderChatCardSection({ ...item, content: renderChatStatusBanner({ tone: "info", message: item.text }) }))],
      ["Roll displays", componentRollExamples.map(renderChatRollDisplay)],
      ["Banners", componentStatusExamples.map(renderChatStatusBanner)],
      ["Cards completos", renderComponentExampleCards().map((card) => card.html)],
    ] as const;
    root.innerHTML = groups.map(([title, items]) => `<section class="paranormal-toolkit-component-gallery__group"><h2>${title}</h2><div class="paranormal-toolkit-component-gallery__grid">${items.map((item, index) => `<div class="paranormal-toolkit-component-gallery__preview${title === "Cards completos" && index === 3 ? " paranormal-toolkit-component-gallery__preview--narrow" : ""}">${item}</div>`).join("")}</div></section>`).join("");
    return root;
  }
  _replaceHTML(result: HTMLElement, content: HTMLElement): void { content.replaceChildren(result); }
}

let gallery: ComponentGalleryApplication | null = null;
export function openComponentGallery(): void {
  gallery ??= new ComponentGalleryApplication();
  void gallery.render({ force: true });
}
