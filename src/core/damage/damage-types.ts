export type ToolkitDamageType =
  | "cutting"
  | "impact"
  | "piercing"
  | "ballistic"
  | "blood"
  | "death"
  | "knowledge"
  | "energy"
  | "fear"
  | "fire"
  | "cold"
  | "electric"
  | "chemical"
  | "mental";

export type DamageTypeInput = ToolkitDamageType | string | null | undefined;


export function getToolkitDamageTypeLabel(damageType: DamageTypeInput): string {
  const normalized = normalizeDamageTypeKey(damageType);

  switch (normalized) {
    case "cutting":
    case "cuttingdamage":
    case "corte":
      return "Corte";
    case "impact":
    case "impactdamage":
    case "impacto":
      return "Impacto";
    case "piercing":
    case "piercingdamage":
    case "perfurante":
      return "Perfurante";
    case "ballistic":
    case "ballisticdamage":
    case "balistico":
      return "Balístico";
    case "blood":
    case "blooddamage":
    case "sangue":
      return "Sangue";
    case "death":
    case "deathdamage":
    case "morte":
      return "Morte";
    case "knowledge":
    case "knowledgedamage":
    case "conhecimento":
      return "Conhecimento";
    case "energy":
    case "energydamage":
    case "energia":
      return "Energia";
    case "fear":
    case "feardamage":
    case "medo":
      return "Medo";
    case "fire":
    case "firedamage":
    case "fogo":
      return "Fogo";
    case "cold":
    case "colddamage":
    case "frio":
      return "Frio";
    case "electric":
    case "electricdamage":
    case "eletricdamage":
    case "eletricodamage":
    case "eletricidade":
    case "eletrico":
    case "eletrica":
      return "Eletricidade";
    case "chemical":
    case "chemicaldamage":
    case "quimico":
    case "quimica":
      return "Químico";
    case "mental":
    case "mentaldamage":
      return "Mental";
    case null:
      return "Sem tipo";
    default:
      return formatFallbackDamageTypeLabel(String(damageType ?? ""));
  }
}

function normalizeDamageTypeKey(value: DamageTypeInput): string | null {
  if (value === undefined || value === null) return null;

  const normalized = String(value)
    .trim()
    .toLocaleLowerCase()
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/gu, "")
    .replace(/[^a-z0-9]/gu, "");

  return normalized.length > 0 ? normalized : null;
}

function formatFallbackDamageTypeLabel(value: string): string {
  const trimmed = value.trim();
  if (!trimmed) return "Sem tipo";
  return `${trimmed.charAt(0).toLocaleUpperCase()}${trimmed.slice(1)}`;
}
