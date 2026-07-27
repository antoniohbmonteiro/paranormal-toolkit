import { escapeHtml } from "../../rendering/escape-html";
import { renderRollRow } from "../chat/roll-row";
import { renderSectionCard } from "../chat/section-card";
import { renderSectionHeader } from "../chat/section-header";

export interface RitualEffectSectionViewModel {
  title: "Dano" | "Cura" | "Efeito";
  typeLabel?: string;
  formula: string;
  total?: number;
  diceResults?: readonly number[];
}

export function renderRitualEffectSection(model: RitualEffectSectionViewModel): string {
  const trailing = model.typeLabel?.trim()
    ? `<span class="paranormal-toolkit-ritual-damage-section__damage-type">${escapeHtml(model.typeLabel)}</span>`
    : undefined;
  return renderSectionCard({
    tone: model.title === "Dano" ? "damage" : "casting",
    content: renderSectionHeader({ title: model.title, trailing }) + renderRollRow(model),
  });
}
