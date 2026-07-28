import type { ExecutedAbilityRoll } from "./ability-roll-executor";
import type { AbilityUseCardState } from "./ability-use-card-state";
import type { AbilityUseData } from "./ability-use-options";
export function buildAbilityUseCardState(input: { ability: AbilityUseData; descriptionHtml: string; rolls: ExecutedAbilityRoll[]; spentResource: boolean; resourceBefore: number; resourceAfter: number; now?: number }): AbilityUseCardState {
  const { ability } = input;
  return { schemaVersion: 1, ability: { name: ability.name, image: ability.image || null, descriptionHtml: input.descriptionHtml.trim() || null, activationLabel: ability.activationLabel }, actor: ref(ability.actor), item: ref(ability.item), resource: { type: ability.resource, cost: ability.cost, passive: ability.passive, spent: input.spentResource, before: input.resourceBefore, after: input.resourceAfter }, rolls: input.rolls, createdAt: input.now ?? Date.now() };
}
function ref(document: Actor | Item) { return { id: document.id ?? null, uuid: document.uuid ?? null, name: document.name ?? "" }; }
