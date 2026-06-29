import type { AutomationRitualFormId } from "../../core/automation/automation-definition";

export const RITUAL_CAST_VARIANTS = ["base", "discente", "verdadeiro"] as const satisfies readonly AutomationRitualFormId[];

export type RitualCastVariant = (typeof RITUAL_CAST_VARIANTS)[number];

export type RitualCastVariantOption = {
  variant: RitualCastVariant;
  label: string;
  enabled: boolean;
  details: string[];
  /** Texto já calculado com o custo final daquela forma. Ex.: "3 PE". */
  finalCostText?: string | null;
  unavailableReason?: string;
};

export type RitualCastOptions = {
  variant: RitualCastVariant;
  spendResource: boolean;
};

export function getRitualCastVariantLabel(variant: RitualCastVariant): string {
  switch (variant) {
    case "base":
      return "Padrão";
    case "discente":
      return "Discente";
    case "verdadeiro":
      return "Verdadeiro";
  }
}

export function isRitualCastVariant(value: unknown): value is RitualCastVariant {
  return typeof value === "string" && RITUAL_CAST_VARIANTS.includes(value as RitualCastVariant);
}
