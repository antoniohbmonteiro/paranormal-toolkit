import type { ExecutedAbilityRoll } from "./ability-roll-executor";
import type { AbilityResource } from "./ability-use-options";
import type { WorkflowTargetReference } from "../../core/workflow/workflow-target-reference";

export type SerializableAbilityRef = {
  id: string | null;
  uuid: string | null;
  name: string;
};

export type AbilityUseCardState = {
  schemaVersion: 2;
  ability: {
    name: string;
    image: string | null;
    descriptionHtml: string | null;
    activationLabel: string;
  };
  actor: SerializableAbilityRef;
  item: SerializableAbilityRef;
  resource: {
    type: AbilityResource;
    cost: number;
    passive: boolean;
    spent: boolean;
    before: number;
    after: number;
  };
  rolls: ExecutedAbilityRoll[];
  targets: WorkflowTargetReference[];
  actions: AbilityAssistedAction[];
  createdAt: number;
};

export type AbilityAssistedActionKind = "damage" | "healing";
export type AbilityAssistedActionState =
  | "available"
  | "executing"
  | "completed"
  | "uncertain";

export type AbilityAssistedAction = {
  id: string;
  kind: AbilityAssistedActionKind;
  rollId: string;
  targetId: string;
  state: AbilityAssistedActionState;
  completedAt: string | null;
  completedByUserId: string | null;
};

export function createAbilityAssistedActionId(
  rollId: string,
  targetId: string,
  kind: AbilityAssistedActionKind,
): string {
  return `${rollId}:${targetId}:${kind}`;
}
