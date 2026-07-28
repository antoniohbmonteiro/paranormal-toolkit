import { sanitizePersistedHtml } from "../../ui/rendering/sanitize-persisted-html";
import type { ExecutedAbilityRoll } from "./ability-roll-executor";
import type {
  AbilityUseCardState,
  SerializableAbilityRef,
} from "./ability-use-card-state";
import type { AbilityUseData } from "./ability-use-options";

type AbilityUseCardStateBuilderInput = {
  ability: AbilityUseData;
  descriptionHtml: string;
  rolls: ExecutedAbilityRoll[];
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

  return {
    schemaVersion: 1,
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
    createdAt: input.now ?? Date.now(),
  };
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
