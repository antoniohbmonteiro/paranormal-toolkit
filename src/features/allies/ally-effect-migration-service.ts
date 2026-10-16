import { MODULE_ID } from "../../constants";
import { readAllyAbilityDefinition } from "../../core/allies/ally-definition";
import { readEffectTemplate, stableEffectFingerprint } from "../../core/allies/ally-passive-effect";
import { buildDefenseTemplate } from "../../adapters/ordem/ordem-ally-effect-presets";
import { ALLY_ABILITY_FLAG, ALLY_EFFECT_MIGRATION_FLAG, ALLY_PASSIVE_EFFECT_FLAG } from "./config/ally-ability-config";

export function legacyAllyEffectId(itemUuid: string, id: string): string {
  let hash = 14695981039346656037n;
  for (const character of `${itemUuid}/${id}`) hash = BigInt.asUintN(64, (hash ^ BigInt(character.charCodeAt(0))) * 1099511628211n);
  return hash.toString(16).padStart(16, "0");
}

export async function migrateAllyAbilityEffects(item: Item): Promise<void> {
  if (item.type !== "ability" || !game.user?.isGM) return;
  const legacy = item.getFlag(MODULE_ID, ALLY_ABILITY_FLAG);
  const migrated = item.getFlag(MODULE_ID, ALLY_EFFECT_MIGRATION_FLAG) as { version?: unknown } | undefined;
  if (migrated !== undefined && migrated?.version !== 1) throw new Error(`Migração de versão desconhecida em ${item.name}; dados preservados.`);
  if (legacy === undefined || migrated) return;
  const definition = readAllyAbilityDefinition(legacy);
  if (!definition || !item.uuid) throw new Error(`Benefícios antigos inválidos em ${item.name}; migração não aplicada.`);
  for (const benefit of definition.benefits) {
    const matches = (item.effects?.contents ?? []).filter(effect =>
      (effect.getFlag(MODULE_ID, ALLY_PASSIVE_EFFECT_FLAG) as { legacyId?: unknown } | undefined)?.legacyId === benefit.id);
    const template = buildDefenseTemplate(`Bônus de Defesa ${benefit.value >= 0 ? "+" : ""}${benefit.value}`, benefit.value);
    if (matches.length > 1) throw new Error(`Efeitos de migração duplicados em ${item.name}; revise os dados.`);
    if (matches.length) {
      if (stableEffectFingerprint(readEffectTemplate(matches[0].toObject(true))) !== stableEffectFingerprint(template)
        || matches[0].transfer) throw new Error(`Migração incompleta com efeito divergente em ${item.name}; dados preservados.`);
      continue;
    }
    const id = legacyAllyEffectId(item.uuid, benefit.id);
    if (item.effects?.get(id)) throw new Error(`Identidade de efeito já utilizada em ${item.name}; dados preservados.`);
    await item.createEmbeddedDocuments("ActiveEffect", [{ ...template, _id: id, transfer: false, disabled: false,
      flags: { [MODULE_ID]: { [ALLY_PASSIVE_EFFECT_FLAG]: { version: 1, legacyId: benefit.id } } } }], { keepId: true });
    if (!item.effects?.get(id)) throw new Error(`Criação do efeito não confirmada em ${item.name}; migração pendente.`);
  }
  // Keep the original flag, including unknown fields. Only this marker switches authority to native effects.
  await item.setFlag(MODULE_ID, ALLY_EFFECT_MIGRATION_FLAG, { version: 1 });
}
