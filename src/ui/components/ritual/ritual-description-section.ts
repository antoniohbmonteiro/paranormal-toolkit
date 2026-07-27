export interface RitualDescriptionSectionViewModel {
  /** Sanitized presentation HTML prepared outside this pure component. */
  html: string;
}

export function renderRitualDescriptionSection(model: RitualDescriptionSectionViewModel): string {
  const html = model.html.trim();
  if (!html) return "";
  return `<details class="paranormal-toolkit-ritual-description-section"><summary class="paranormal-toolkit-ritual-description-section__summary">Descrição</summary><div class="paranormal-toolkit-ritual-description-section__content">${html}</div></details>`;
}
