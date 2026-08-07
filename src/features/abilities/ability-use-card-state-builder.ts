import { sanitizePersistedHtml } from "../../ui/rendering/sanitize-persisted-html";
import type { ExecutedAbilityRoll } from "./ability-roll-executor";
import type {
  AbilityUseCardState,
  SerializableAbilityRef,
} from "./ability-use-card-state";
import type { AbilityUseData } from "./ability-use-options";
import type { WorkflowTarget } from "../../core/workflow/workflow-target";
import {
  canResolveWorkflowTargetActor,
  createWorkflowTargetReferences,
} from "../../core/workflow/workflow-target-reference";
import {
  createAbilityAssistedActionId,
  type AbilityAssistedAction,
} from "./ability-use-card-state";

type AbilityUseCardStateBuilderInput = {
  ability: AbilityUseData;
  descriptionHtml: string;
  rolls: ExecutedAbilityRoll[];
  targets: readonly WorkflowTarget[];
  spentResource: boolean;
  resourceBefore: number;
  resourceAfter: number;
  now?: number;
};

export function buildAbilityUseCardState(
  input: AbilityUseCardStateBuilderInput,
): AbilityUseCardState {
  const { ability } = input;
  const descriptionHtml = normalizeDescriptionHtml(input.descriptionHtml);
  const targets = createWorkflowTargetReferences(input.targets);

  return {
    schemaVersion: 2,
    ability: {
      name: ability.name,
      image: ability.image || null,
      descriptionHtml,
      activationLabel: ability.activationLabel,
    },
    actor: createDocumentRef(ability.actor),
    item: createDocumentRef(ability.item),
    resource: {
      type: ability.resource,
      cost: ability.cost,
      passive: ability.passive,
      spent: input.spentResource,
      before: input.resourceBefore,
      after: input.resourceAfter,
    },
    rolls: input.rolls,
    targets,
    actions: createAssistedActions(input.rolls, targets),
    createdAt: input.now ?? Date.now(),
  };
}

function createAssistedActions(
  rolls: readonly ExecutedAbilityRoll[],
  targets: ReturnType<typeof createWorkflowTargetReferences>,
): AbilityAssistedAction[] {
  return rolls.flatMap((roll) => {
    if (roll.intent === "generic" || !isActionableTotal(roll.total)) return [];
    const kind = roll.intent;

    return targets
      .filter(canResolveWorkflowTargetActor)
      .map((target): AbilityAssistedAction => ({
        id: createAbilityAssistedActionId(roll.id, target.id, kind),
        kind,
        rollId: roll.id,
        targetId: target.id,
        state: "available",
        completedAt: null,
        completedByUserId: null,
      }));
  });
}

function isActionableTotal(value: number): boolean {
  return Number.isInteger(value) && value > 0;
}

function normalizeDescriptionHtml(value: string): string | null {
  const sanitized = sanitizePersistedHtml(value).trim();
  return sanitized || null;
}

function createDocumentRef(document: Actor | Item): SerializableAbilityRef {
  return {
    id: document.id ?? null,
    uuid: document.uuid ?? null,
    name: document.name ?? "",
  };
}
