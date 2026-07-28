import type { RitualCircle } from "../../core/rituals/ritual-types";
import { OrdemRitualAdapter } from "./ordem-ritual-adapter";

export type OrdemRitualElementKey = "blood" | "death" | "knowledge" | "energy" | "fear";
export type OrdemRitualPresentation = { elementKey: OrdemRitualElementKey; elementLabel: string; circle: RitualCircle };
export type OrdemRitualMetadataPresentation = { execution: string | null; range: string | null; duration: string | null };

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

export function resolveOrdemRitualMetadataPresentation(item: Item): OrdemRitualMetadataPresentation {
  const system = item.system as Record<string, unknown> | undefined;
  return {
    execution: resolveChoice(system?.execution, "op.executionChoices", EXECUTION_LABELS),
    range: resolveChoice(system?.range, "op.rangeChoices", RANGE_LABELS),
    duration: resolveChoice(system?.duration, "op.durationChoices", DURATION_LABELS),
  };
}

const EXECUTION_LABELS: Record<string, string> = { default: "Padrão", standard: "Padrão", movement: "Movimento", free: "Livre", reaction: "Reação", complete: "Completa" };
const RANGE_LABELS: Record<string, string> = { personal: "Pessoal", touch: "Toque", short: "Curto", medium: "Médio", long: "Longo", extreme: "Extremo", unlimited: "Ilimitado" };
const DURATION_LABELS: Record<string, string> = { instantaneous: "Instantânea", scene: "Cena", sustained: "Sustentada", permanent: "Permanente", setduration: "Duração definida" };

function resolveChoice(value: unknown, localizationPrefix: string, labels: Record<string, string>): string | null {
  if (typeof value !== "string" || !value.trim()) return null;
  const raw = value.trim();
  const key = raw.toLocaleLowerCase().startsWith(`${localizationPrefix}.`.toLocaleLowerCase())
    ? raw.slice(localizationPrefix.length + 1)
    : raw;
  const localizationKey = `${localizationPrefix}.${key}`;
  const localized = (globalThis as { game?: { i18n?: { localize?: (key: string) => string } } }).game?.i18n?.localize?.(localizationKey);
  if (localized && localized !== localizationKey) return localized;
  return labels[key.toLocaleLowerCase()] ?? `${raw.charAt(0).toLocaleUpperCase("pt-BR")}${raw.slice(1)}`;
}

function normalizeElementKey(value: unknown): OrdemRitualElementKey | null {
  if (typeof value !== "string") return null;
  const normalized = value.trim().toLocaleLowerCase();
  const key = normalized.startsWith("op.elementchoices.") ? normalized.slice("op.elementchoices.".length) : normalized;
  return key in ELEMENT_LABELS ? key as OrdemRitualElementKey : null;
}
