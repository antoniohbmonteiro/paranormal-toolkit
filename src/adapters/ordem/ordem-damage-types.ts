import type {
  DamageTypeInput,
  ToolkitDamageType,
} from "../../core/damage/damage-types";

export type OrdemDamageType =
  | "cuttingDamage"
  | "impactDamage"
  | "piercingDamage"
  | "ballisticDamage"
  | "bloodDamage"
  | "deathDamage"
  | "knowledgeDamage"
  | "energyDamage"
  | "fearDamage"
  | "fireDamage"
  | "coldDamage"
  | "eletricDamage"
  | "chemicalDamage"
  | "mentalDamage";

export const ORDEM_DAMAGE_TYPE_BY_TOOLKIT_TYPE: Record<
  ToolkitDamageType,
  OrdemDamageType
> = {
  cutting: "cuttingDamage",
  impact: "impactDamage",
  piercing: "piercingDamage",
  ballistic: "ballisticDamage",
  blood: "bloodDamage",
  death: "deathDamage",
  knowledge: "knowledgeDamage",
  energy: "energyDamage",
  fear: "fearDamage",
  fire: "fireDamage",
  cold: "coldDamage",
  electric: "eletricDamage",
  chemical: "chemicalDamage",
  mental: "mentalDamage",
};

const ORDEM_DAMAGE_TYPES = new Set<OrdemDamageType>(
  Object.values(ORDEM_DAMAGE_TYPE_BY_TOOLKIT_TYPE),
);

const DAMAGE_TYPE_ALIASES: Record<string, OrdemDamageType | null> = {
  generic: null,
  none: null,
  indefinido: null,
  semtipo: null,
  untyped: null,

  cutting: "cuttingDamage",
  corte: "cuttingDamage",
  cuttingdamage: "cuttingDamage",

  impact: "impactDamage",
  impacto: "impactDamage",
  impactdamage: "impactDamage",

  piercing: "piercingDamage",
  perfurante: "piercingDamage",
  perfuracao: "piercingDamage",
  perfuração: "piercingDamage",
  piercingdamage: "piercingDamage",

  ballistic: "ballisticDamage",
  balistico: "ballisticDamage",
  balístico: "ballisticDamage",
  ballisticdamage: "ballisticDamage",

  blood: "bloodDamage",
  sangue: "bloodDamage",
  blooddamage: "bloodDamage",

  death: "deathDamage",
  morte: "deathDamage",
  deathdamage: "deathDamage",

  knowledge: "knowledgeDamage",
  conhecimento: "knowledgeDamage",
  knowledgedamage: "knowledgeDamage",

  energy: "energyDamage",
  energia: "energyDamage",
  energydamage: "energyDamage",

  fear: "fearDamage",
  medo: "fearDamage",
  feardamage: "fearDamage",

  fire: "fireDamage",
  fogo: "fireDamage",
  firedamage: "fireDamage",

  cold: "coldDamage",
  frio: "coldDamage",
  colddamage: "coldDamage",

  electric: "eletricDamage",
  eletrico: "eletricDamage",
  elétrico: "eletricDamage",
  eletrica: "eletricDamage",
  elétrica: "eletricDamage",
  eletricidade: "eletricDamage",
  electricidade: "eletricDamage",
  electricdamage: "eletricDamage",
  eletricdamage: "eletricDamage",

  chemical: "chemicalDamage",
  quimico: "chemicalDamage",
  químico: "chemicalDamage",
  quimica: "chemicalDamage",
  química: "chemicalDamage",
  chemicaldamage: "chemicalDamage",

  mental: "mentalDamage",
  ment: "mentalDamage",
  mentaldamage: "mentalDamage",
};

export type OrdemDamageTypeResolution =
  | { ok: true; value: OrdemDamageType | null; normalized: string | null }
  | { ok: false; input: DamageTypeInput; normalized: string | null };

export function resolveOrdemDamageType(
  input: DamageTypeInput,
): OrdemDamageTypeResolution {
  if (input === undefined || input === null) {
    return { ok: true, value: null, normalized: null };
  }

  const normalized = normalizeDamageTypeKey(input);
  if (!normalized) {
    return { ok: true, value: null, normalized: null };
  }

  const alias = DAMAGE_TYPE_ALIASES[normalized];
  if (alias !== undefined) {
    return { ok: true, value: alias, normalized };
  }

  if (ORDEM_DAMAGE_TYPES.has(input as OrdemDamageType)) {
    return { ok: true, value: input as OrdemDamageType, normalized };
  }

  return { ok: false, input, normalized };
}

export function getOrdemDamageTypeLabel(
  damageType: OrdemDamageType | null,
): string {
  switch (damageType) {
    case "cuttingDamage":
      return "Corte";
    case "impactDamage":
      return "Impacto";
    case "piercingDamage":
      return "Perfurante";
    case "ballisticDamage":
      return "Balístico";
    case "bloodDamage":
      return "Sangue";
    case "deathDamage":
      return "Morte";
    case "knowledgeDamage":
      return "Conhecimento";
    case "energyDamage":
      return "Energia";
    case "fearDamage":
      return "Medo";
    case "fireDamage":
      return "Fogo";
    case "coldDamage":
      return "Frio";
    case "eletricDamage":
      return "Eletricidade";
    case "chemicalDamage":
      return "Químico";
    case "mentalDamage":
      return "Mental";
    case null:
      return "Sem tipo";
  }
}

function normalizeDamageTypeKey(value: string): string | null {
  const normalized = value
    .trim()
    .toLocaleLowerCase()
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/gu, "")
    .replace(/[^a-z0-9]/gu, "");

  return normalized.length > 0 ? normalized : null;
}
