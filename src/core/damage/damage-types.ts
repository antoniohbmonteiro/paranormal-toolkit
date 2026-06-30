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
