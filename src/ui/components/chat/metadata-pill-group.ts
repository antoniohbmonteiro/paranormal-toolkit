import { renderMetadataPill, type MetadataPillViewModel } from "./metadata-pill";
export interface MetadataPillGroupViewModel { items: readonly MetadataPillViewModel[] }
export function renderMetadataPillGroup(model: MetadataPillGroupViewModel): string {
  const pills = model.items.map(renderMetadataPill).filter(Boolean);
  return pills.length ? `<div class="paranormal-toolkit-metadata-pill-group">${pills.join("")}</div>` : "";
}
