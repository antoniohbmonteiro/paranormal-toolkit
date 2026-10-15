import { MODULE_ID } from "../../constants";
import type { AllySupportChange } from "../../features/allies/ally-support-notifications";
import { escapeHtml } from "../../ui/rendering/escape-html";

export async function publishAllySupportChange(change: AllySupportChange): Promise<void> {
  const whisper = Array.from(game.users).filter(user => user.isGM && user.id).map(user => user.id!);
  if (!whisper.length) return;
  const actorName = (id: string | null) => id ? game.actors.get?.(id)?.name ?? `Ausente (${id})` : "Nenhum";
  const events = {
    activated: "Suporte ativado", deactivated: "Suporte desativado", beneficiaryChanged: "Beneficiário alterado",
    benefitsChanged: "Benefícios mecânicos modificados", transitionCompleted: "Transição de combate concluída — suporte ativo",
  };
  const benefits = (values: AllySupportChange["after"]["benefits"]) => values.length
    ? values.map(value => typeof value.value === "number" ? `Defesa ${value.value >= 0 ? "+" : ""}${value.value}` : value.label ?? "Efeito personalizado").join(", ") : "Nenhum benefício aplicado";
  await ChatMessage.create({ whisper,
    content: `<p><strong>Aliados — ${escapeHtml(actorName(change.allyId))}</strong>: ${change.events.map(event => events[event]).join("; ")}.</p>
      <p>Beneficiário: ${escapeHtml(actorName(change.before.beneficiaryId))} → ${escapeHtml(actorName(change.after.beneficiaryId))}.<br>
      Benefícios: ${escapeHtml(benefits(change.before.benefits))} → ${escapeHtml(benefits(change.after.benefits))}.</p>`,
    flags: { [MODULE_ID]: { allySupportNotice: { version: 1, allyId: change.allyId, events: change.events } } },
  });
}
