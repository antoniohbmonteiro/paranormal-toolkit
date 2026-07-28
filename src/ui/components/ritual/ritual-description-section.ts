import { renderExpandableDescription, type ExpandableDescriptionViewModel } from "../chat/expandable-description";
export type RitualDescriptionSectionViewModel = ExpandableDescriptionViewModel;
export function renderRitualDescriptionSection(model: RitualDescriptionSectionViewModel): string { return renderExpandableDescription(model).replace('class="paranormal-toolkit-expandable-description', 'class="paranormal-toolkit-ritual-description-section paranormal-toolkit-expandable-description'); }
