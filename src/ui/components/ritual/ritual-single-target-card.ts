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
  renderRitualConjurationSection,
  type RitualConjurationSectionViewModel,
} from "./ritual-conjuration-section";
import {
  renderRitualDamageSection,
  type RitualDamageSectionViewModel,
} from "./ritual-damage-section";
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
  metadata?: RitualMetadataViewModel;
  detailRows?: readonly MetadataDetailRowViewModel[];
  conjuration: RitualConjurationSectionViewModel;
  damage?: RitualDamageSectionViewModel;
  resistance?: RitualResistanceSectionViewModel;
  assistedActions?: RitualAssistedActionsPanelViewModel;
}

export function renderRitualSingleTargetCard(
  model: RitualSingleTargetCardViewModel,
): string {
  const content = [
    renderChatCardHeader(model.header),
    model.metadata ? renderRitualMetadata(model.metadata) : "",
    ...(model.detailRows?.map(renderMetadataDetailRow) ?? []),
    renderRitualConjurationSection(model.conjuration),
    model.damage ? renderRitualDamageSection(model.damage) : "",
    model.resistance ? renderRitualResistanceSection(model.resistance) : "",
    model.assistedActions ? renderRitualAssistedActionsPanel(model.assistedActions) : "",
  ]
    .filter(Boolean)
    .join("");

  return renderChatCardShell({
    content: `<div class="paranormal-toolkit-ritual-single-target-card">${content}</div>`,
  });
}
