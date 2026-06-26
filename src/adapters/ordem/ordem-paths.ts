import type { ActorResource } from "../../core/resources/actor-resource";

export const ORDEM_RESOURCE_PATHS: Record<ActorResource, string> = {
  PV: "system.PV",
  SAN: "system.SAN",
  PE: "system.PE",
  PD: "system.PD"
} as const;

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
