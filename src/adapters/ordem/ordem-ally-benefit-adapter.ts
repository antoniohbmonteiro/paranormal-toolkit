import { MODULE_ID } from "../../constants";
import type { AllyEffectAdapter, AllyManagedEffect } from "../../features/allies/ally-reconciliation-service";

export function buildAllyDefenseEffect(effect: AllyManagedEffect): Record<string, unknown> {
  return {
    _id: effect.effectId, name: "Aliado: bônus de Defesa", transfer: false, disabled: false,
    changes: [{ key: "system.defense.value", value: String(effect.value), type: "add", phase: "initial", priority: 20 }],
    flags: { [MODULE_ID]: { allyBenefit: { version: 1, sourceKey: effect.sourceKey, allyId: effect.allyId } } },
  };
}
function actorById(id: string): Actor | undefined { return game.actors.get?.(id); }
export class OrdemAllyBenefitAdapter implements AllyEffectAdapter {
  constructor(private readonly assertExecutor: () => void) {}
  newId(): string { return foundry.utils.randomID(); }
  exists(effect: AllyManagedEffect): boolean { return Boolean(actorById(effect.actorId)?.effects?.get(effect.effectId)); }
  matches(effect: AllyManagedEffect): boolean {
    const actual = actorById(effect.actorId)?.effects?.get(effect.effectId);
    if (!actual || actual.disabled || actual.transfer) return false;
    const flag = actual.getFlag(MODULE_ID, "allyBenefit") as { version?: unknown; sourceKey?: unknown; allyId?: unknown } | undefined;
    const change = actual.changes;
    return flag?.version === 1 && flag.sourceKey === effect.sourceKey && flag.allyId === effect.allyId
      && change?.length === 1 && change[0].key === "system.defense.value"
      && change[0].type === "add" && change[0].phase === "initial" && change[0].priority === 20
      && change[0].value === String(effect.value);
  }
  async remove(effect: AllyManagedEffect): Promise<void> {
    this.assertExecutor();
    const actor = actorById(effect.actorId);
    if (actor && this.exists(effect)) await actor.deleteEmbeddedDocuments("ActiveEffect", [effect.effectId], { allyReconciliation: true });
  }
  async create(effect: AllyManagedEffect): Promise<void> {
    this.assertExecutor();
    const actor = actorById(effect.actorId);
    if (!actor || actor.type !== "agent" || actor.isToken) throw new Error("Beneficiário persistente não encontrado.");
    await actor.createEmbeddedDocuments("ActiveEffect", [buildAllyDefenseEffect(effect)], { keepId: true, allyReconciliation: true });
  }
}
