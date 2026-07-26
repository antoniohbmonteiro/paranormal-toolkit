import { escapeHtml } from "../../rendering/escape-html";

export interface RitualMetadataEntry {
  label: string;
  value: string;
}

export interface RitualMetadataViewModel {
  entries: readonly RitualMetadataEntry[];
}

export function renderRitualMetadata(model: RitualMetadataViewModel): string {
  const entries = model.entries.flatMap(({ label, value }) => {
    const preparedLabel = label.trim();
    const preparedValue = value.trim();
    if (!preparedLabel || !preparedValue) return [];

    return [
      `<div class="paranormal-toolkit-ritual-metadata__entry"><dt class="paranormal-toolkit-ritual-metadata__label">${escapeHtml(preparedLabel)}:</dt><dd class="paranormal-toolkit-ritual-metadata__value">${escapeHtml(preparedValue)}</dd></div>`,
    ];
  });

  if (entries.length === 0) return "";
  return `<dl class="paranormal-toolkit-ritual-metadata">${entries.join("")}</dl>`;
}
