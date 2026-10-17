import { MODULE_ID } from "../../constants";
import { inspectLegacyAllyImport, readAllyAbility, ALLY_ABILITY_FLAG, ALLY_EFFECT_MIGRATION_FLAG, ALLY_PASSIVE_EFFECT_FLAG, canConfigureAllyEffects } from "./config/ally-ability-config";
import { stableEffectFingerprint } from "../../core/allies/ally-passive-effect";
export { legacyAllyEffectId } from "../../core/allies/ally-definition";

const importing = new Set<string>();

export async function migrateAllyAbilityEffects(item: Item, authorization?: { confirmed: boolean; fingerprint?: string }): Promise<void> {
  if (!authorization?.confirmed) throw new Error("A importação exige confirmação explícita.");
  const assertEdit = () => {
    if (!game.user?.isGM || !canConfigureAllyEffects(item)) throw new Error("Sem permissão para importar benefícios antigos.");
  };
  assertEdit();
  if (importing.has(item.uuid)) throw new Error("Importação já em andamento nesta habilidade.");
  importing.add(item.uuid);
  try {
    let preview = inspectLegacyAllyImport(item);
    if (authorization.fingerprint && authorization.fingerprint !== preview.fingerprint) throw new Error("A habilidade mudou. Revise a prévia novamente.");
    if (!preview.pending) return;
    const originalLegacy = stableEffectFingerprint(item.getFlag(MODULE_ID, ALLY_ABILITY_FLAG));
    const assertSources = () => {
      if (originalLegacy !== stableEffectFingerprint(item.getFlag(MODULE_ID, ALLY_ABILITY_FLAG)) || !readAllyAbility(item)) {
        throw new Error("A origem mudou ou contém benefícios incompatíveis; importação interrompida.");
      }
    };
    assertSources();
    while (preview.missing.length) {
      assertEdit(); assertSources();
      const source = preview.missing[0];
      await item.createEmbeddedDocuments("ActiveEffect", [{ ...source.template, _id: source.id, transfer: false, disabled: false,
        flags: { [MODULE_ID]: { [ALLY_PASSIVE_EFFECT_FLAG]: { version: 1, legacyId: source.legacyId } } } }], { keepId: true });
      if (!item.effects?.get(source.id)) throw new Error("Criação não confirmada; importação pendente. Revise antes de tentar novamente.");
      preview = inspectLegacyAllyImport(item);
    }
    assertEdit(); assertSources();
    await item.setFlag(MODULE_ID, ALLY_EFFECT_MIGRATION_FLAG, { version: 1 });
  } finally { importing.delete(item.uuid); }
}
