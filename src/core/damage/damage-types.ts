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

export type DamageTypeBadgeTone =
  | "physical"
  | "blood"
  | "death"
  | "knowledge"
  | "energy"
  | "fear"
  | "fire"
  | "cold"
  | "electric"
  | "chemical"
  | "mental"
  | "neutral";

export type DamageTypePresentation = {
  label: string;
  tone: DamageTypeBadgeTone;
};

const PHYSICAL_DAMAGE_KEYS = new Set([
  "cutting",
  "cuttingdamage",
  "corte",
  "impact",
  "impactdamage",
  "impacto",
  "piercing",
  "piercingdamage",
  "perfurante",
  "ballistic",
  "ballisticdamage",
  "balistico",
]);

const DAMAGE_TONE_KEYS: Partial<Record<DamageTypeBadgeTone, Set<string>>> = {
  blood: new Set(["blood", "blooddamage", "sangue"]),
  death: new Set(["death", "deathdamage", "morte"]),
  knowledge: new Set(["knowledge", "knowledgedamage", "conhecimento"]),
  energy: new Set(["energy", "energydamage", "energia"]),
  fear: new Set(["fear", "feardamage", "medo"]),
  fire: new Set(["fire", "firedamage", "fogo"]),
  cold: new Set(["cold", "colddamage", "frio"]),
  electric: new Set([
    "electric",
    "electricdamage",
    "eletricdamage",
    "eletricodamage",
    "eletricidade",
    "eletrico",
    "eletrica",
  ]),
  chemical: new Set(["chemical", "chemicaldamage", "quimico", "quimica"]),
  mental: new Set(["mental", "mentaldamage"]),
};

export function getToolkitDamageTypePresentation(
  damageType: DamageTypeInput,
): DamageTypePresentation {
  return {
    label: getToolkitDamageTypeLabel(damageType),
    tone: getToolkitDamageTypeTone(damageType),
  };
}

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

function getToolkitDamageTypeTone(
  damageType: DamageTypeInput,
): DamageTypeBadgeTone {
  const normalized = normalizeDamageTypeKey(damageType);
  if (!normalized) return "neutral";
  if (PHYSICAL_DAMAGE_KEYS.has(normalized)) return "physical";
  for (const [tone, keys] of Object.entries(DAMAGE_TONE_KEYS)) {
    if (keys?.has(normalized)) return tone as DamageTypeBadgeTone;
  }
  return "neutral";
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
