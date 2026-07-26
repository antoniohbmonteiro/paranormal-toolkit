import { escapeHtml } from "../../rendering/escape-html";

export interface SectionHeaderViewModel {
  title: string;
  /** Trusted HTML produced exclusively by internal Paranormal Toolkit renderers. */
  trailing?: string;
}

export function renderSectionHeader(model: SectionHeaderViewModel): string {
  const trailing = model.trailing
    ? `<div class="paranormal-toolkit-section-header__trailing">${model.trailing}</div>`
    : "";
  return `<div class="paranormal-toolkit-section-header"><span class="paranormal-toolkit-section-header__title">${escapeHtml(model.title)}</span>${trailing}</div>`;
}
