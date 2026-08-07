import {
  renderChatCardHeader,
  type ChatCardHeaderViewModel,
} from "../chat/chat-card-header";
import { renderChatCardShell } from "../chat/chat-card-shell";
import {
  renderExpandableDescription,
  type ExpandableDescriptionViewModel,
} from "../chat/expandable-description";
import {
  renderMetadataPillGroup,
  type MetadataPillGroupViewModel,
} from "../chat/metadata-pill-group";
import { renderRollRow, type RollRowViewModel } from "../chat/roll-row";
import {
  renderSectionCard,
  type SectionCardTone,
} from "../chat/section-card";
import { renderSectionHeader } from "../chat/section-header";
import { escapeHtml } from "../../rendering/escape-html";
import {
  renderDamageTypeBadge,
  type DamageTypeBadgeViewModel,
} from "../chat/damage-type-badge";
import {
  renderAssistedActionRow,
  type AssistedActionRowViewModel,
} from "../chat/assisted-action-row";

export type AbilityResultSectionViewModel = {
  label: string;
  detail: string;
  tone: SectionCardTone;
  damageTypeBadge?: DamageTypeBadgeViewModel;
  roll: RollRowViewModel;
};

export type AbilityUseCardViewModel = {
  header: ChatCardHeaderViewModel;
  description?: ExpandableDescriptionViewModel;
  metadata: MetadataPillGroupViewModel;
  rolls: AbilityResultSectionViewModel[];
  assistedActions?: { rows: readonly AssistedActionRowViewModel[] };
};

export function renderAbilityUseCard(model: AbilityUseCardViewModel): string {
  const content = [
    renderChatCardHeader(model.header),
    model.description ? renderExpandableDescription(model.description) : "",
    renderMetadataPillGroup(model.metadata),
    ...model.rolls.map(renderAbilityResultSection),
    model.assistedActions
      ? renderAbilityAssistedActions(model.assistedActions.rows)
      : "",
  ]
    .filter(Boolean)
    .join("");

  const card = [
    '<div class="paranormal-toolkit-ability-card ',
    'paranormal-toolkit-ability-use-card" ',
    'data-paranormal-toolkit-card-renderer="ability-result">',
    content,
    "</div>",
  ].join("");
  return renderChatCardShell({ content: card });
}

function renderAbilityAssistedActions(
  rows: readonly AssistedActionRowViewModel[],
): string {
  const content = rows.map(renderAssistedActionRow).filter(Boolean).join("");
  if (!content) return "";
  return `<section class="paranormal-toolkit-ability-use-card__assisted-actions"><h4 class="paranormal-toolkit-ability-use-card__assisted-actions-title">AÇÕES ASSISTIDAS</h4><div class="paranormal-toolkit-ability-use-card__assisted-actions-rows">${content}</div></section>`;
}

function renderAbilityResultSection(
  result: AbilityResultSectionViewModel,
): string {
  const content = [
    renderSectionHeader({
      title: result.label.trim() || "Rolagem",
      trailing: result.damageTypeBadge
        ? renderDamageTypeBadge(result.damageTypeBadge)
        : undefined,
    }),
    `<div class="paranormal-toolkit-ability-use-card__roll-detail">${escapeHtml(result.detail)}</div>`,
    renderRollRow(result.roll),
  ].join("");

  return renderSectionCard({ tone: result.tone, content });
}
