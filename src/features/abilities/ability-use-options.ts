import type { ResolvedAbilityRoll } from "./config/ability-roll-config";

export type AbilityResource = "PE" | "PD";

export type AbilityUseOptions = {
  spendResource: boolean;
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
  rolls: ResolvedAbilityRoll[];
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
        | "chat-message-failed";
      message: string;
    };
