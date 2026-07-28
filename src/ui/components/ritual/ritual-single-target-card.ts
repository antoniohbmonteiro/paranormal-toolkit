import {
  renderChatCardHeader,
  type ChatCardHeaderViewModel,
} from "../chat/chat-card-header";
import { renderChatCardShell } from "../chat/chat-card-shell";
import {
  renderMetadataDetailRow,
  type MetadataDetailRowViewModel,
} from "../chat/metadata-detail-row";
import {
  renderExpandableDescription,
  type ExpandableDescriptionViewModel,
} from "../chat/expandable-description";
import {
  renderRitualConjurationSection,
  type RitualConjurationSectionViewModel,
} from "./ritual-conjuration-section";
import {
  renderRitualDamageSection,
  type RitualDamageSectionViewModel,
} from "./ritual-damage-section";
import {
  renderRitualEffectSection,
  type RitualEffectSectionViewModel,
} from "./ritual-effect-section";
import {
  renderRitualMetadata,
  type RitualMetadataViewModel,
} from "./ritual-metadata";
import {
  renderRitualAssistedActionsPanel,
  type RitualAssistedActionsPanelViewModel,
} from "./ritual-assisted-actions-panel";
import {
  renderRitualResistanceSection,
  type RitualResistanceSectionViewModel,
} from "./ritual-resistance-section";

export interface RitualSingleTargetCardViewModel {
  header: ChatCardHeaderViewModel;
  description?: ExpandableDescriptionViewModel;
  metadata?: RitualMetadataViewModel;
  detailRows?: readonly MetadataDetailRowViewModel[];
  conjuration?: RitualConjurationSectionViewModel;
  damage?: RitualDamageSectionViewModel;
  effect?: RitualEffectSectionViewModel;
  resistance?: RitualResistanceSectionViewModel;
  assistedActions?: RitualAssistedActionsPanelViewModel;
}

export function renderRitualSingleTargetCard(
  model: RitualSingleTargetCardViewModel,
): string {
  const content = [
    renderChatCardHeader(model.header),
    model.description ? renderExpandableDescription(model.description) : "",
    model.metadata ? renderRitualMetadata(model.metadata) : "",
    ...(model.detailRows?.map(renderMetadataDetailRow) ?? []),
    model.conjuration ? renderRitualConjurationSection(model.conjuration) : "",
    model.damage ? renderRitualDamageSection(model.damage) : "",
    model.effect ? renderRitualEffectSection(model.effect) : "",
    model.resistance ? renderRitualResistanceSection(model.resistance) : "",
    model.assistedActions
      ? renderRitualAssistedActionsPanel(model.assistedActions)
      : "",
  ]
    .filter(Boolean)
    .join("");

  return renderChatCardShell({
    content: `<div class="paranormal-toolkit-ritual-single-target-card">${content}</div>`,
  });
}
