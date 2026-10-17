import type { ActorResource } from "../../core/resources/actor-resource";
import type { OrdemDamageType } from "./ordem-damage-types";

export const ORDEM_AGENT_RESOURCE_PATHS: Record<ActorResource, string> = {
  PV: "system.PV",
  SAN: "system.SAN",
  PE: "system.PE",
  PD: "system.PD"
} as const;

export const ORDEM_THREAT_RESOURCE_PATHS: Partial<Record<ActorResource, string>> = {
  PV: "system.attributes.hp"
} as const;

export const ORDEM_RESOURCE_PATH_CANDIDATES: Record<ActorResource, string[]> = {
  PV: [ORDEM_AGENT_RESOURCE_PATHS.PV, ORDEM_THREAT_RESOURCE_PATHS.PV],
  SAN: [ORDEM_AGENT_RESOURCE_PATHS.SAN],
  PE: [ORDEM_AGENT_RESOURCE_PATHS.PE],
  PD: [ORDEM_AGENT_RESOURCE_PATHS.PD]
} as Record<ActorResource, string[]>;

// Fields read by the agent preparation cycle. defense.bonus and desloc.bonus exist in the schema but are never read.
// PV/PE/PD.bonus are absent from the schema, yet _calculateMaxHP adds them while class calculations are active.
export const ORDEM_AGENT_BONUS_PATHS = {
  defense: "system.defense.value",
  movement: "system.desloc.value",
  skill: (skillId: string) => `system.skills.${skillId}.value`,
  attribute: (attributeId: "str" | "dex" | "int" | "vit") => `system.attributes.${attributeId}.value`,
  capacity: "system.spaces.bonus.max",
  ritualDT: "system.ritual.DT",
  perRound: (resource: "PE" | "PD") => `system.${resource}.perRound`,
  resistance: (damageType: OrdemDamageType) => `system.resistances.${damageType}.value`,
  resourceMax: {
    PV: "system.PV.bonus",
    PE: "system.PE.bonus",
    PD: "system.PD.bonus",
    SAN: "system.SAN.bonus"
  }
} as const;

export const ORDEM_PATHS = {
  ritual: {
    dt: "system.ritual.DT"
  },
  ritualItem: {
    circleCandidates: ["system.circle", "system.ritual.circle"]
  },
  weapon: {
    category: "system.category",
    attackFormula: "system.formulas.attack",
    damageFormula: "system.formulas.damage",
    critical: "system.critical"
  }
} as const;
