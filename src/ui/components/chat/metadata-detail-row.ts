import { escapeHtml } from "../../rendering/escape-html";

export interface MetadataDetailRowViewModel {
  label: string;
  /** Trusted HTML produced exclusively by internal Paranormal Toolkit renderers. */
  detailHtml: string;
}

/** Composes trusted internal detail markup, never raw document or player HTML. */
export function renderMetadataDetailRow(
  model: MetadataDetailRowViewModel,
): string {
  const label = model.label.trim();
  const detailHtml = model.detailHtml.trim();
  if (!label || !detailHtml) return "";

  return `<div class="paranormal-toolkit-metadata-detail-row"><span class="paranormal-toolkit-metadata-detail-row__accent" aria-hidden="true"></span><div class="paranormal-toolkit-metadata-detail-row__content"><span class="paranormal-toolkit-metadata-detail-row__label">${escapeHtml(label)}</span><span class="paranormal-toolkit-metadata-detail-row__detail">${detailHtml}</span></div></div>`;
}
