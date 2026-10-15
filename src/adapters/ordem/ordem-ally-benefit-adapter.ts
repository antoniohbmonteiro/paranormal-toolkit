import { MODULE_ID } from "../../constants";
import type { AllyEffectAdapter, AllyManagedEffect } from "../../features/allies/ally-reconciliation-service";
import { effectMechanics, readEffectTemplate, stableEffectFingerprint } from "../../core/allies/ally-passive-effect";
import { buildDefenseTemplate } from "./ordem-ally-effect-presets";
import type { AllyNoticeSnapshot } from "../../features/allies/ally-support-notifications";

export function buildAllyDefenseEffect(effect: AllyManagedEffect): Record<string, unknown> {
  const template = effect.template ?? buildDefenseTemplate("Aliado: bônus de Defesa", effect.value!);
  return {
    ...template, _id: effect.effectId, transfer: false, disabled: false,
    origin: game.actors.get?.(effect.allyId)?.uuid ?? `Actor.${effect.allyId}`,
    flags: { [MODULE_ID]: { allyBenefit: { version: 2, sourceKey: effect.sourceKey, allyId: effect.allyId,
      itemId: effect.itemId ?? null, sourceEffectId: effect.sourceEffectId ?? null } } },
  };
}
export function describeAllyEffect(effect: AllyManagedEffect): AllyNoticeSnapshot["benefits"][number] {
  const template = effect.template;
  if (!template) return { sourceKey: effect.sourceKey, value: effect.value! };
  const changes = template.system.changes;
  if (changes.length === 1 && changes[0].key === "system.defense.value" && changes[0].type === "add"
    && changes[0].phase === "initial" && typeof changes[0].value === "number" && !template.statuses.length) {
    return { sourceKey: effect.sourceKey, value: changes[0].value };
  }
  const values = changes.map(change => JSON.stringify(change.value)).join(", ").slice(0, 180);
  return { sourceKey: effect.sourceKey, signature: effectMechanics(template),
    label: `${template.name} (${changes.length} mudanças${values ? `: ${values}` : ""}${template.statuses.length ? `; ${template.statuses.length} condições` : ""})` };
}
function actorById(id: string): Actor | undefined { return game.actors.get?.(id); }
export class OrdemAllyBenefitAdapter implements AllyEffectAdapter {
  constructor(private readonly assertExecutor: () => void) {}
  newId(): string { return foundry.utils.randomID(); }
  exists(effect: AllyManagedEffect): boolean { return Boolean(actorById(effect.actorId)?.effects?.get(effect.effectId)); }
  matches(effect: AllyManagedEffect): boolean {
    const actual = actorById(effect.actorId)?.effects?.get(effect.effectId);
    if (!actual) return false;
    const source = actual.toObject(true);
    const expected = buildAllyDefenseEffect(effect);
    const flag = actual.getFlag(MODULE_ID, "allyBenefit");
    return source.disabled === false && source.transfer === false && source.origin === expected.origin
      && stableEffectFingerprint(flag) === stableEffectFingerprint((expected.flags as any)[MODULE_ID].allyBenefit)
      && stableEffectFingerprint(readEffectTemplate(source)) === stableEffectFingerprint(readEffectTemplate(expected));
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
    this.assertDataPaths(actor, effect);
    await actor.createEmbeddedDocuments("ActiveEffect", [buildAllyDefenseEffect(effect)], { keepId: true, allyReconciliation: true });
  }
  async update(effect: AllyManagedEffect): Promise<void> {
    this.assertExecutor();
    const actor = actorById(effect.actorId);
    if (!actor || actor.type !== "agent" || actor.isToken) throw new Error("Beneficiário persistente não encontrado.");
    this.assertDataPaths(actor, effect);
    const data = buildAllyDefenseEffect(effect);
    data.system = new foundry.data.operators.ForcedReplacement(data.system);
    await actor.updateEmbeddedDocuments("ActiveEffect", [data], { allyReconciliation: true });
  }
  private assertDataPaths(actor: Actor, effect: AllyManagedEffect): void {
    for (const change of effect.template?.system.changes ?? []) {
      let target: unknown = actor;
      for (const part of change.key.split(".")) {
        if (!target || typeof target !== "object") break;
        target = (target as Record<string, unknown>)[part];
        if (typeof target === "function") throw new Error(`Mudança incompatível com dados do Actor: ${change.key}`);
      }
    }
  }
}
