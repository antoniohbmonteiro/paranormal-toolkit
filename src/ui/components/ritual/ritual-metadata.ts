import { renderMetadataPillGroup, type MetadataPillGroupViewModel } from "../chat/metadata-pill-group";
export type RitualMetadataViewModel = MetadataPillGroupViewModel;
export function renderRitualMetadata(model: RitualMetadataViewModel): string { return renderMetadataPillGroup(model).replace('class="paranormal-toolkit-metadata-pill-group"', 'class="paranormal-toolkit-ritual-metadata"'); }
