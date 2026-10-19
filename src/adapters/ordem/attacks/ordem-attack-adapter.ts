import { MODULE_ID } from "../../../constants";
import { ATTACK_ROLL_CONTEXT_KEY } from "../../foundry/foundry-attack-roll-message-bridge";
import { createWorkflowTargetReference, type WorkflowTargetReference } from "../../../core/workflow/workflow-target-reference";
import { createWorkflowTargetFromToken } from "../../../features/automation/workflow-target-resolver";
import { parseAttackCritical, formatAttackCritical } from "../../../features/attack-modifiers/attack-modifier-composer";
import type { AttackModifierFacts, CriticalProfile } from "../../../features/attack-modifiers/attack-modifier-preset";
import type { AttackMessage } from "../../../features/attack-modifiers/attack-card-state";

export type NativeHitResult = {
  hit?: boolean; revealed?: boolean; isCritical?: boolean; actorUuid?: string | null;
  attackMessageId?: string | null; targetDefense?: number | null;
  attackResults?: NativeVolleyEntry[]; [key: string]: unknown;
};
export type NativeVolleyEntry = { attackMessageId: string | null; actorUuid: string | null;
  hit: boolean; revealed: boolean; isCritical: boolean; attackIndex: number | null; targetDefense?: number | null };
export type NativeAttackOptions = Record<string | symbol, unknown> & {
  _forcedTarget?: TokenLike | null; _attackIndex?: number; _attackTotal?: number; _volleyId?: string;
  event?: { altKey?: boolean }; hitResult?: NativeHitResult; attackMessageId?: string;
};
export type NativeAttackResult = { roll: Roll | null; criticalStatus: { isCritical: boolean; multiplier?: number }; hitResult: NativeHitResult | null };
export type NativeAttackItem = Item & {
  clone(data: Record<string, unknown>, context: Record<string, unknown>): NativeAttackItem;
  rollAttack(options?: NativeAttackOptions): Promise<NativeAttackResult>;
  rollDamage(options?: NativeAttackOptions): Promise<Roll>;
  rollVolleyDamage(entries: NativeVolleyEntry[], options: NativeAttackOptions): Promise<Roll[]>;
  isCritical(data: Record<string, unknown>, options?: Record<string, unknown>): { isCritical: boolean; multiplier?: number };
  getRollData(): Record<string, unknown>;
};
export type NativeAttackMethods = Pick<NativeAttackItem, "rollAttack" | "rollDamage" | "rollVolleyDamage">;
export class OrdemAttackAdapter {
  private methods: NativeAttackMethods | null = null;
  configure(methods: NativeAttackMethods): void { this.methods = methods; }
  facts(item: Item): AttackModifierFacts {
    return { weaponType: item.type, ranged: foundry.utils.getProperty(item, "system.types.rangeType.name") === "ranged" };
  }
  abilities(item: Item): Item[] {
    return this.actorItems(this.actor(item));
  }
  actorItems(actor: Actor | null): Item[] {
    const items = actor?.items;
    if (!items) return [];
    const contents = (items as { contents?: Item[] }).contents;
    return Array.isArray(contents) ? contents : Symbol.iterator in items ? Array.from(items as Iterable<Item>) : [];
  }
  actor(item: Item): Actor | null { return item.actor ?? item.parent ?? null; }
  critical(item: Item): CriticalProfile | null {
    const raw = foundry.utils.getProperty(item, "system.critical");
    return typeof raw === "string" ? parseAttackCritical(raw) : null;
  }
  expands(item: Item, options: NativeAttackOptions): boolean {
    if (options._forcedTarget !== undefined || options._attackIndex !== undefined) return false;
    const attacks = foundry.utils.getProperty(item, "system.numberOfAttacks") ?? 1;
    return typeof attacks === "number" && attacks > 1 || (game.user?.targets?.size ?? 0) > 1;
  }
  target(options: NativeAttackOptions): TokenLike | null {
    if ("_forcedTarget" in options) return options._forcedTarget ?? null;
    const targets = [...(game.user?.targets ?? [])];
    return targets.length === 1 ? targets[0] : null;
  }
  targetReference(token: TokenLike | null): WorkflowTargetReference | null {
    return token ? createWorkflowTargetReference(createWorkflowTargetFromToken(token)) : null;
  }
  owns(item: Item): boolean {
    const actor = this.actor(item);
    return !!actor && !!game.user && (game.user.isGM === true || actor.canUserModify(game.user, "update"));
  }
  createExecutionItem(item: Item, marker: string, critical?: CriticalProfile, onCritical?: (value: boolean) => void): NativeAttackItem {
    const native = item as NativeAttackItem;
    if (typeof native.clone !== "function" || typeof native.isCritical !== "function") throw new Error("API de arma incompatível com modificadores de ataque.");
    const clone = native.clone({ system: item.toObject(false).system }, { keepId: true });
    const originalData = clone.getRollData.bind(clone);
    clone.getRollData = () => ({ ...originalData(), [ATTACK_ROLL_CONTEXT_KEY]: marker });
    if (critical) {
      const originalCritical = clone.isCritical.bind(clone);
      clone.isCritical = (data, options) => {
        const result = originalCritical({ ...data, crtalFormula: formatAttackCritical(critical) }, options);
        onCritical?.(result.isCritical);
        return result;
      };
    }
    return clone;
  }
  async attack(item: Item, options: NativeAttackOptions): Promise<NativeAttackResult> {
    return this.native().rollAttack.call(item as NativeAttackItem, options);
  }
  async damage(item: Item, options: NativeAttackOptions): Promise<Roll> {
    return this.native().rollDamage.call(item as NativeAttackItem, options);
  }
  async volley(item: Item, entries: NativeVolleyEntry[], options: NativeAttackOptions,
    rollDamage: (options: NativeAttackOptions) => Promise<Roll>): Promise<Roll[]> {
    const instance = (item as NativeAttackItem).clone({ system: item.toObject(false).system }, { keepId: true });
    instance.rollDamage = rollDamage;
    return this.native().rollVolleyDamage.call(instance, entries, options);
  }
  damageType(item: Item): { type: string | null; mixed: boolean } {
    const raw = foundry.utils.getProperty(item, "system.formulas.damage.type");
    const type = typeof raw === "string" && raw ? raw : null;
    const parts = foundry.utils.getProperty(item, "system.formulas.damage.parts");
    return { type, mixed: Array.isArray(parts) && parts.some(part => Array.isArray(part) && part[1] && part[1] !== type) };
  }
  currentHit(message: AttackMessage): NativeHitResult | null {
    const raw = message.getFlag("ordemparanormal", "hitResult");
    return raw && typeof raw === "object" ? raw as NativeHitResult : null;
  }
  readIncomingFlag(data: Record<string, unknown>, scope: string, key: string): unknown {
    const flags = data.flags as Record<string, unknown> | undefined;
    return flags?.[scope + "." + key] ?? (flags?.[scope] as Record<string, unknown> | undefined)?.[key];
  }
  stamp(data: Record<string, unknown>, key: string, value: unknown, suppressNativeDamage = false): Record<string, unknown> {
    const flags = structuredClone((data.flags ?? {}) as Record<string, unknown>);
    if (suppressNativeDamage) {
      delete flags["ordemparanormal.damageTarget"];
      if (flags.ordemparanormal && typeof flags.ordemparanormal === "object") delete (flags.ordemparanormal as Record<string, unknown>).damageTarget;
    }
    flags[MODULE_ID] = { ...(flags[MODULE_ID] as Record<string, unknown> | undefined), [key]: value };
    return { ...data, flags };
  }
  private native(): NativeAttackMethods { if (!this.methods) throw new Error("Integração de ataques não inicializada."); return this.methods; }
}
