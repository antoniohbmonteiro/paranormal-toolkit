import { MODULE_ID } from "../../../constants";
import type { AllyAbilityDefinition } from "../../../core/allies/ally-definition";
import { readEffectTemplate } from "../../../core/allies/ally-passive-effect";

export const ALLY_ABILITY_FLAG = "allyAbility";
export const ALLY_TYPE = `${MODULE_ID}.ally`;
export const ALLY_PASSIVE_EFFECT_FLAG = "allyPassive";
export const ALLY_EFFECT_MIGRATION_FLAG = "allyEffectsMigration";
export function isAllySourceItem(item: Item): boolean {
  return (item.parent ?? item.actor)?.type === ALLY_TYPE;
}
export function readAllyAbility(item: Item): AllyAbilityDefinition | null {
  const legacy = item.getFlag(MODULE_ID, ALLY_ABILITY_FLAG);
  const migrated = item.getFlag(MODULE_ID, ALLY_EFFECT_MIGRATION_FLAG) as { version?: unknown } | undefined;
  if ((migrated !== undefined && migrated?.version !== 1) || (legacy !== undefined && !migrated)) return null;
  const benefits: AllyAbilityDefinition["benefits"] = [];
  const ids = new Set<string>();
  for (const effect of item.effects?.contents ?? []) {
    const marker = effect.getFlag(MODULE_ID, ALLY_PASSIVE_EFFECT_FLAG) as { version?: unknown; legacyId?: unknown } | undefined;
    if (marker === undefined) continue;
    if (!marker || marker.version !== 1 || !effect.id || effect.transfer) return null;
    if (marker.legacyId !== undefined && typeof marker.legacyId !== "string") return null;
    if (effect.disabled) continue;
    const id = typeof marker.legacyId === "string" ? marker.legacyId : effect.id;
    const template = readEffectTemplate(effect.toObject(true));
    if (!template || ids.has(id)) return null;
    ids.add(id); benefits.push({ id, effectId: effect.id, template });
  }
  return { version: 2, benefits };
}
export function canConfigureAllyEffects(item: Item): boolean {
  return item.type === "ability" && Boolean(game.user && item.canUserModify(game.user, "update"));
}
