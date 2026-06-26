import type { ActorResource } from "../../core/resources/actor-resource";

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

export const ORDEM_PATHS = {
  ritual: {
    dt: "system.ritual.DT"
  },
  weapon: {
    category: "system.category",
    attackFormula: "system.formulas.attack",
    damageFormula: "system.formulas.damage",
    critical: "system.critical"
  }
} as const;
