export interface ExpandableDescriptionViewModel { html: string }
export function renderExpandableDescription(model: ExpandableDescriptionViewModel): string {
  const html = model.html.trim();
  if (!html) return "";
  return `<details class="paranormal-toolkit-expandable-description"><summary class="paranormal-toolkit-expandable-description__summary">Descrição</summary><div class="paranormal-toolkit-expandable-description__content">${html}</div></details>`;
}
