import { getActorItems } from "../automation/actor-item-resolver";

export function getActorRituals(actor: Actor): Item[] {
  return getActorItems(actor).filter((item) => item.type === "ritual");
}

export function getFirstActorRitual(actor: Actor): Item | null {
  return getActorRituals(actor)[0] ?? null;
}
