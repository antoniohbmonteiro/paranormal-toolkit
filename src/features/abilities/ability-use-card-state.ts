import type { ExecutedAbilityRoll } from "./ability-roll-executor";
import type { AbilityResource } from "./ability-use-options";
export type SerializableAbilityRef = { id: string | null; uuid: string | null; name: string };
export type AbilityUseCardState = {
  schemaVersion: 1;
  ability: { name: string; image: string | null; descriptionHtml: string | null; activationLabel: string };
  actor: SerializableAbilityRef;
  item: SerializableAbilityRef;
  resource: { type: AbilityResource; cost: number; passive: boolean; spent: boolean; before: number; after: number };
  rolls: ExecutedAbilityRoll[];
  createdAt: number;
};
