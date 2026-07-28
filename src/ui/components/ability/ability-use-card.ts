import { renderChatCardHeader, type ChatCardHeaderViewModel } from "../chat/chat-card-header";
import { renderChatCardShell } from "../chat/chat-card-shell";
import { renderExpandableDescription, type ExpandableDescriptionViewModel } from "../chat/expandable-description";
import { renderMetadataPillGroup, type MetadataPillGroupViewModel } from "../chat/metadata-pill-group";
import { renderRollRow, type RollRowViewModel } from "../chat/roll-row";
import { renderSectionCard, type SectionCardTone } from "../chat/section-card";
import { renderSectionHeader } from "../chat/section-header";
import { escapeHtml } from "../../rendering/escape-html";
export type AbilityResultSectionViewModel = { label: string; detail: string; tone: SectionCardTone; roll: RollRowViewModel };
export type AbilityUseCardViewModel = { header: ChatCardHeaderViewModel; description?: ExpandableDescriptionViewModel; metadata: MetadataPillGroupViewModel; rolls: AbilityResultSectionViewModel[]; resourceStatus: { text: string; tone: "spent" | "neutral" | "not-spent" } };
export function renderAbilityUseCard(model: AbilityUseCardViewModel): string {
  const results = model.rolls.map((result) => renderSectionCard({ tone: result.tone, content: `${renderSectionHeader({ title: "Rolagem" })}<div class="paranormal-toolkit-ability-use-card__roll-label">${escapeHtml(result.label)}</div><div class="paranormal-toolkit-ability-use-card__roll-detail">${escapeHtml(result.detail)}</div>${renderRollRow(result.roll)}` })).join("");
  const content = `${renderChatCardHeader(model.header)}${model.description ? renderExpandableDescription(model.description) : ""}${renderMetadataPillGroup(model.metadata)}${results}<footer class="paranormal-toolkit-ability-use-card__status paranormal-toolkit-ability-use-card__status--${model.resourceStatus.tone}">${escapeHtml(model.resourceStatus.text)}</footer>`;
  return renderChatCardShell({ content: `<div class="paranormal-toolkit-ability-card paranormal-toolkit-ability-use-card" data-paranormal-toolkit-card-renderer="ability-result">${content}</div>` });
}
