import { escapeHtml as escape } from "../../rendering/escape-html";

export type AttackSummaryView = {
  title: string; details: string[];
  action?: { kind: "roll" | "apply"; label: string; disabled: boolean; attackMessageId?: string };
};
export function renderAttackModifierSummary(view: AttackSummaryView): string {
  return '<section class="paranormal-toolkit-attack-summary" data-toolkit-attack-summary><strong>' + escape(view.title)
    + '</strong>' + view.details.map(detail => '<p>' + escape(detail) + '</p>').join("")
    + (view.action ? '<button type="button" data-toolkit-attack-action="' + view.action.kind + '"'
      + (view.action.attackMessageId ? ' data-attack-message-id="' + escape(view.action.attackMessageId) + '"' : '')
      + (view.action.disabled ? ' disabled' : '') + '>' + escape(view.action.label) + '</button>' : '')
    + '</section>';
}
