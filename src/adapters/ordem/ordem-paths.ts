export const ORDEM_PATHS = {
  resources: {
    pv: "system.PV",
    san: "system.SAN",
    pe: "system.PE",
    pd: "system.PD"
  },
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
