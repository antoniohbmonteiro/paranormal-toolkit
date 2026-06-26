import { MODULE_ID } from "../../constants";
import { failure, success } from "../../core/result";
import type { RitualCostProvider, RitualCostResult } from "../../core/rituals/ritual-cost-provider";
import type { RitualCircle, RitualCost, RitualCostContext, RitualCostResource, RitualReadFailure } from "../../core/rituals/ritual-types";
import { OrdemRitualAdapter } from "./ordem-ritual-adapter";

const DEFAULT_RITUAL_COST_BY_CIRCLE: Record<RitualCircle, number> = {
  1: 1,
  2: 3,
  3: 6,
  4: 10
};

export class OrdemRitualCostProvider implements RitualCostProvider {
  constructor(private readonly ritualAdapter: OrdemRitualAdapter) {}

  getCost(context: RitualCostContext): RitualCostResult {
    const circleResult = this.ritualAdapter.getCircle(context.ritual);

    if (!circleResult.ok) {
      return failure({
        ...circleResult.error,
        actor: context.actor
      });
    }

    const circle = circleResult.value;
    const customCost = readCustomRitualCost(context.ritual, circle);

    if (!customCost.ok) {
      return failure(customCost.error);
    }

    if (customCost.value) {
      return success(customCost.value);
    }

    return success({
      resource: "PE",
      amount: DEFAULT_RITUAL_COST_BY_CIRCLE[circle],
      source: "default-by-circle",
      circle
    });
  }
}

export function getDefaultRitualCostAmount(circle: RitualCircle): number {
  return DEFAULT_RITUAL_COST_BY_CIRCLE[circle];
}

type CustomCostReadResult =
  | { ok: true; value: RitualCost | null }
  | { ok: false; error: RitualReadFailure };

function readCustomRitualCost(ritual: Item, circle: RitualCircle): CustomCostReadResult {
  const value = ritual.getFlag(MODULE_ID, "ritual.cost");

  if (value === undefined || value === null) {
    return { ok: true, value: null };
  }

  if (!isCustomCostFlag(value)) {
    return {
      ok: false,
      error: {
        reason: "invalid-custom-cost",
        message: `Custo customizado do ritual ${ritual.name ?? "sem nome"} é inválido.`,
        ritual,
        value
      }
    };
  }

  return {
    ok: true,
    value: {
      resource: value.resource,
      amount: value.amount,
      source: "custom-flag",
      circle
    }
  };
}

function isCustomCostFlag(value: unknown): value is { resource: RitualCostResource; amount: number } {
  if (!value || typeof value !== "object") return false;

  const candidate = value as Partial<{ resource: RitualCostResource; amount: number }>;

  return (
    (candidate.resource === "PE" || candidate.resource === "PD") &&
    typeof candidate.amount === "number" &&
    Number.isInteger(candidate.amount) &&
    candidate.amount > 0
  );
}
