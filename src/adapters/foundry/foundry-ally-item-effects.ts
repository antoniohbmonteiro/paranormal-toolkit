import { MODULE_ID } from "../../constants";
import { readEffectTemplate } from "../../core/allies/ally-passive-effect";

const builtins = new Set(["add", "subtract", "multiply", "override", "upgrade", "downgrade"]);
export function readGrantedItemEffects(item: Item): { effects: Record<string, unknown>[]; diagnostic: string | null } {
  const effects: Record<string, unknown>[] = [];
  for (const effect of item.effects?.contents ?? []) {
    if (effect.getFlag(MODULE_ID, "allyPassive") !== undefined) continue;
    const data = effect.toObject(true);
    const template = readEffectTemplate(data);
    const flags = data.flags as Record<string, unknown> | undefined;
    const nativeClass = (foundry as unknown as { documents?: { ActiveEffect?: unknown } }).documents?.ActiveEffect;
    const implementation = (CONFIG as unknown as { ActiveEffect?: { documentClass?: unknown; changeTypes?: Record<string, unknown> } }).ActiveEffect;
    const foreignHandler = template?.system.changes.some(change => implementation?.changeTypes?.[change.type]);
    if (!template || template.type !== "base" || !template.system.changes.every(change => builtins.has(change.type))
      || (flags && Object.keys(flags).length > 0) || foreignHandler
      || (implementation?.documentClass && implementation.documentClass !== nativeClass)) {
      return { effects: [], diagnostic: `Efeito não compatível na habilidade ${item.name}: ${effect.name}. Origem preservada; uso bloqueado.` };
    }
    effects.push({ ...template, _id: effect.id, transfer: effect.transfer, disabled: effect.disabled,
      origin: typeof data.origin === "string" ? data.origin : item.uuid,
    });
  }
  return { effects, diagnostic: null };
}
