import {
  renderMetadataPill,
  type MetadataPillViewModel,
} from "../chat/metadata-pill";

export interface RitualMetadataViewModel {
  items: readonly MetadataPillViewModel[];
}

export function renderRitualMetadata(model: RitualMetadataViewModel): string {
  const pills = model.items.map(renderMetadataPill).filter(Boolean);
  if (pills.length === 0) return "";

  return `<div class="paranormal-toolkit-ritual-metadata">${pills.join("")}</div>`;
}
