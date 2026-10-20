import { MODULE_ID } from "../../../constants";
import { ATTACK_ROLL_CONTEXT_KEY, type PublishingAttackRoll } from "../../foundry/foundry-attack-roll-message-bridge";
import { createWorkflowTargetReference, type WorkflowTargetReference } from "../../../core/workflow/workflow-target-reference";
import { createWorkflowTargetFromToken } from "../../../features/automation/workflow-target-resolver";
import { parseAttackCritical, formatAttackCritical } from "../../../features/attack-modifiers/attack-modifier-composer";
import type { AttackModifierFacts, AttackProgression, CriticalProfile } from "../../../features/attack-modifiers/attack-modifier-preset";
import type { AttackMessage } from "../../../features/attack-modifiers/attack-card-state";
import type { AttackBonusDamageDie } from "../../../features/attack-modifiers/attack-general-actions";
import { applyAttackDiceModifier, resolveWeaponDamageFaces, type AttackDicePool } from "./ordem-attack-formula";

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
  lastAttackMessageId?: string | null;
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
    return { weaponType: item.type, ranged: foundry.utils.getProperty(item, "system.types.rangeType.name") === "ranged",
      firearm: foundry.utils.getProperty(item, "system.types.rangeType.subRangeType") === "fire",
      automatic: foundry.utils.getProperty(item, "system.conditions.automatic") === true,
      rangedSubtype: String(foundry.utils.getProperty(item, "system.types.rangeType.subRangeType") ?? "") };
  }
  progression(item: Item): AttackProgression | null {
    const rule = game.settings.get("ordemparanormal", "globalProgressRules");
    const mode = rule === 1 ? "nex" : rule === 2 ? "level" : null;
    if (!mode) return null;
    const value = foundry.utils.getProperty(this.actor(item), mode === "nex" ? "system.NEX.value" : "system.nivel.value");
    return typeof value === "number" ? { mode, value } : null;
  }
  supportsWeaponAttack(item: Item): boolean {
    const actor = this.actor(item);
    const attr = foundry.utils.getProperty(item, "system.formulas.attack.attr");
    const skill = foundry.utils.getProperty(item, "system.formulas.attack.skill");
    return item.type === "armament" && !!actor && typeof attr === "string" && !!attr && typeof skill === "string" && !!skill
      && !!foundry.utils.getProperty(actor, "system.attributes." + attr) && !!foundry.utils.getProperty(actor, "system.skills." + skill);
  }
  bonusDamageDie(item: Item): AttackBonusDamageDie | null {
    const faces = resolveWeaponDamageFaces(foundry.utils.getProperty(item, "system.formulas.damage.formula"));
    return faces === null ? null : { faces, type: this.damageType(item).type };
  }
  prepareAttackRoll(roll: PublishingAttackRoll, modifier: number): void {
    const native = roll as PublishingAttackRoll & { terms?: unknown[]; resetFormula?: () => string };
    const term = native.terms?.[0] as Partial<AttackDicePool> | undefined;
    if (!term || typeof term.number !== "number" || typeof term.faces !== "number" || !Array.isArray(term.modifiers)
      || typeof native.resetFormula !== "function") throw new Error("Dados nativos indisponíveis para aplicar modificadores de ataque.");
    const pool = applyAttackDiceModifier(term as AttackDicePool, modifier);
    term.number = pool.number; term.modifiers = pool.modifiers;
    native.resetFormula();
  }
  createDamageExecutionItem(item: Item, marker: string, extra: AttackBonusDamageDie | null, count: number,
    damageBonus = 0, flatDamageType: string | null = null): NativeAttackItem {
    if (!Number.isSafeInteger(count) || count < 0 || (count > 0) !== !!extra) throw new Error("Dados adicionais de dano inválidos.");
    if (extra) {
      const current = this.bonusDamageDie(item);
      if (!current || current.faces !== extra.faces || current.type !== extra.type) {
        throw new Error("O dado-base ou o tipo de dano da arma mudou após o ataque. Confira antes de rolar dano.");
      }
    }
    if (!Number.isSafeInteger(damageBonus) || damageBonus < 0) throw new Error("Bônus fixo de dano inválido.");
    if (damageBonus > 0 && this.damageType(item).type !== flatDamageType) {
      throw new Error("O tipo de dano da arma mudou após o ataque. Confira antes de rolar dano.");
    }
    const instance = this.createExecutionItem(item, marker);
    if (extra || damageBonus > 0) {
      const parts = foundry.utils.getProperty(instance, "system.formulas.damage.parts");
      if (!Array.isArray(parts)) throw new Error("Partes de dano da arma indisponíveis para os dados adicionais.");
      if (extra) parts.push([count + "d" + extra.faces, extra.type ?? ""]);
      if (damageBonus > 0) parts.push([String(damageBonus), flatDamageType ?? ""]);
    }
    return instance;
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
  createExecutionItem(item: Item, marker: string, critical?: CriticalProfile, onCritical?: (value: boolean) => void, attackBonus = 0): NativeAttackItem {
    const native = item as NativeAttackItem;
    if (typeof native.clone !== "function" || typeof native.isCritical !== "function") throw new Error("API de arma incompatível com modificadores de ataque.");
    const clone = native.clone({ system: item.toObject(false).system }, { keepId: true });
    if (!Number.isSafeInteger(attackBonus) || attackBonus < 0) throw new Error("Bônus fixo de ataque inválido.");
    if (attackBonus > 0) {
      const attack = foundry.utils.getProperty(clone, "system.formulas.attack") as { bonus?: unknown } | undefined;
      if (!attack || attack.bonus != null && typeof attack.bonus !== "string" && typeof attack.bonus !== "number") {
        throw new Error("Bônus nativo de ataque indisponível.");
      }
      const previous = String(attack.bonus ?? "").trim();
      attack.bonus = previous ? "(" + previous + ") + " + attackBonus : String(attackBonus);
    }
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
