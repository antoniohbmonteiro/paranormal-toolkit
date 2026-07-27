import { escapeHtml } from "../../rendering/escape-html";

export interface MetadataPillViewModel {
  text: string;
}

export function renderMetadataPill(model: MetadataPillViewModel): string {
  const text = model.text.trim();
  if (!text) return "";

  return `<span class="paranormal-toolkit-metadata-pill">${escapeHtml(text)}</span>`;
}
