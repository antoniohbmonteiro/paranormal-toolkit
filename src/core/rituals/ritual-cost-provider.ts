import type { Result } from "../result";
import type { RitualCost, RitualCostContext, RitualReadFailure } from "./ritual-types";

export type RitualCostResult = Result<RitualCost, RitualReadFailure>;

export interface RitualCostProvider {
  getCost(context: RitualCostContext): RitualCostResult;
}
