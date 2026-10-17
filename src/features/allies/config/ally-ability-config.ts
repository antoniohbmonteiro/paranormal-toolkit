import { MODULE_ID } from "../../../constants";
import { legacyAllyEffectId, readAllyAbilityDefinition, type AllyAbilityDefinition } from "../../../core/allies/ally-definition";
import { readEffectTemplate, stableEffectFingerprint, type AllyEffectTemplate } from "../../../core/allies/ally-passive-effect";
import { buildDefenseTemplate } from "../../../adapters/ordem/ordem-ally-effect-presets";

export const ALLY_ABILITY_FLAG = "allyAbility";
export const ALLY_TYPE = `${MODULE_ID}.ally`;
export const ALLY_PASSIVE_EFFECT_FLAG = "allyPassive";
export const ALLY_EFFECT_MIGRATION_FLAG = "allyEffectsMigration";
export function isAllySourceItem(item: Item): boolean {
  return (item.parent ?? item.actor)?.type === ALLY_TYPE;
}
export function canReadAbilityEffects(item: Item): boolean {
  if (item.type !== "ability" || !game.user || item.limited) return false;
  return item.testUserPermission?.(game.user, "OBSERVER") ?? item.canUserModify(game.user, "update");
}
export type LegacyAllyImport = {
  pending: boolean; fingerprint: string;
  missing: { id: string; legacyId: string; template: AllyEffectTemplate }[];
};

// Only the explicit import action materializes these read-only legacy sources.
export function inspectLegacyAllyImport(item: Item): LegacyAllyImport {
  const legacy = item.getFlag(MODULE_ID, ALLY_ABILITY_FLAG);
  const marker = item.getFlag(MODULE_ID, ALLY_EFFECT_MIGRATION_FLAG) as { version?: unknown } | undefined;
  if (marker !== undefined && marker?.version !== 1) throw new Error("Versão de importação desconhecida; dados preservados.");
  const fingerprint = stableEffectFingerprint({ legacy, marker, effects: (item.effects?.contents ?? []).map(effect => effect.toObject(true)) });
  if (legacy === undefined || marker) return { pending: false, fingerprint, missing: [] };
  const definition = readAllyAbilityDefinition(legacy);
  if (!definition || !item.uuid) throw new Error("Benefícios antigos inválidos; dados preservados.");
  const missing: LegacyAllyImport["missing"] = [];
  for (const benefit of definition.benefits) {
    const matches = (item.effects?.contents ?? []).filter(effect =>
      (effect.getFlag(MODULE_ID, ALLY_PASSIVE_EFFECT_FLAG) as { legacyId?: unknown } | undefined)?.legacyId === benefit.id);
    const template = buildDefenseTemplate(`Bônus de Defesa ${benefit.value >= 0 ? "+" : ""}${benefit.value}`, benefit.value);
    if (matches.length > 1) throw new Error("Benefícios antigos duplicados; revise a origem.");
    if (matches.length) {
      const effect = matches[0];
      const flag = effect.getFlag(MODULE_ID, ALLY_PASSIVE_EFFECT_FLAG) as { version?: unknown } | undefined;
      if (flag?.version !== 1 || effect.transfer || stableEffectFingerprint(readEffectTemplate(effect.toObject(true))) !== stableEffectFingerprint(template)) {
        throw new Error("Importação parcial divergente; revise a origem sem conversão automática.");
      }
    } else {
      const id = legacyAllyEffectId(item.uuid, benefit.id);
      if (item.effects?.get(id)) throw new Error("Identidade de efeito já utilizada; dados preservados.");
      missing.push({ id, legacyId: benefit.id, template });
    }
  }
  return { pending: true, fingerprint, missing };
}
export function readAllyAbility(item: Item): AllyAbilityDefinition | null {
  let legacy: LegacyAllyImport;
  try { legacy = inspectLegacyAllyImport(item); } catch { return null; }
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
  for (const source of legacy.missing) {
    if (ids.has(source.legacyId)) return null;
    ids.add(source.legacyId);
    benefits.push({ id: source.legacyId, effectId: source.id, template: source.template });
  }
  return { version: 2, benefits };
}
export function canConfigureAllyEffects(item: Item): boolean {
  const owner = item.parent ?? item.actor;
  const packId = item.pack ?? owner?.pack;
  const pack = packId ? game.packs?.get(packId) : undefined;
  return item.type === "ability" && Boolean(game.user && item.canUserModify(game.user, "update"))
    && (!packId || Boolean(pack && !pack.locked))
    && item.getFlag(MODULE_ID, "allyGrantedAbility") === undefined;
}
