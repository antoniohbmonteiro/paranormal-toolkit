export type RitualCircle = 1 | 2 | 3 | 4;

export type RitualCostResource = "PE" | "PD";

export type RitualCostSource = "default-by-circle" | "custom-flag";

export type RitualCost = {
  resource: RitualCostResource;
  amount: number;
  source: RitualCostSource;
  circle: RitualCircle;
};

export type RitualCostContext = {
  actor: Actor;
  ritual: Item;
};

export type RitualReadFailureReason =
  | "not-a-ritual"
  | "ritual-circle-not-found"
  | "invalid-ritual-circle"
  | "invalid-custom-cost";

export type RitualReadFailure = {
  reason: RitualReadFailureReason;
  message: string;
  actor?: Actor;
  ritual?: Item;
  value?: unknown;
  path?: string;
  paths?: string[];
};
