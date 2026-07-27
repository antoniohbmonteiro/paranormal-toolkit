import type { RitualCircle } from "../../core/rituals/ritual-types";
import { OrdemRitualAdapter } from "./ordem-ritual-adapter";

export type OrdemRitualElementKey = "blood" | "death" | "knowledge" | "energy" | "fear";
export type OrdemRitualPresentation = { elementKey: OrdemRitualElementKey; elementLabel: string; circle: RitualCircle };

const ELEMENT_LABELS: Record<OrdemRitualElementKey, string> = {
  blood: "Sangue",
  death: "Morte",
  knowledge: "Conhecimento",
  energy: "Energia",
  fear: "Medo",
};

export function resolveOrdemRitualPresentation(item: Item): OrdemRitualPresentation | null {
  const elementKey = normalizeElementKey((item.system as { element?: unknown } | undefined)?.element);
  const circle = new OrdemRitualAdapter().getCircle(item);
  if (!elementKey || !circle.ok) return null;
  return { elementKey, elementLabel: ELEMENT_LABELS[elementKey], circle: circle.value };
}

export function resolveOrdemRitualImage(item: Item): string | null {
  const image = (item as Item & { img?: unknown }).img;
  return typeof image === "string" && image.trim() ? image.trim() : null;
}

function normalizeElementKey(value: unknown): OrdemRitualElementKey | null {
  if (typeof value !== "string") return null;
  const normalized = value.trim().toLocaleLowerCase();
  const key = normalized.startsWith("op.elementchoices.") ? normalized.slice("op.elementchoices.".length) : normalized;
  return key in ELEMENT_LABELS ? key as OrdemRitualElementKey : null;
}
