import type { PreparedAbilityRolls } from "./config/ability-roll-config";

export type AbilityResource = "PE" | "PD";

export type AbilityUseOptions = {
  spendResource: boolean;
  selectedNexThresholds: Record<string, number>;
};

export type AbilityUseData = {
  actor: Actor;
  item: Item;
  name: string;
  image: string;
  activation: string;
  activationLabel: string;
  description: string;
  chatDescription?: string;
  cost: number;
  resource: AbilityResource;
  passive: boolean;
  rollPreparation: PreparedAbilityRolls;
  /** Legacy prepared actions retained for source compatibility. */
  rolls: PreparedAbilityRolls["rolls"];
};

export type AbilityUseResult =
  | { status: "cancelled" }
  | {
      status: "completed";
      spentResource: boolean;
      resource: AbilityResource;
      cost: number;
    }
  | {
      status: "failed";
      reason:
        | "missing-actor"
        | "missing-permission"
        | "resource-unavailable"
        | "insufficient-resource"
        | "resource-update-failed"
        | "invalid-roll-options"
        | "roll-failed"
        | "chat-message-failed";
      message: string;
    };
