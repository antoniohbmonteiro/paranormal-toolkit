import { isJsonData } from "../../core/serialization/json-data";
import type { WorkflowTargetReference } from "../../core/workflow/workflow-target-reference";
import type { ComposedAttackModifiers, CriticalProfile } from "./attack-modifier-preset";
import type { AttackGeneralActions, AttackBonusDamageDie } from "./attack-general-actions";
import { INTUITIVE_SHOT_PRESET } from "./presets/intuitive-shot";

export const ATTACK_CARD_FLAG = "attackModifierState";
export const ATTACK_EXECUTION_FLAG = "attackExecution";
export const ATTACK_DAMAGE_FLAG = "attackDamage";
export type AttackMessage = {
  id: string;
  author?: { id: string } | string;
  rolls?: Roll[];
  getFlag(scope: string, key: string): unknown;
  setFlag(scope: string, key: string, value: unknown): Promise<unknown>;
  unsetFlag?(scope: string, key: string): Promise<unknown>;
};
export type AttackExecutionLink = {
  executionId: string;
  ordinal: number;
  attackMessageId: string | null;
  state: "preparing" | "cancelled" | "failed" | "published" | "uncertain";
};
export type AttackCardBinding = {
  schemaVersion: 1;
  revision: number;
  activeUseId: string;
  executions: AttackExecutionLink[];
};
export type AttackOperationState = {
  state: "available" | "executing" | "published" | "completed" | "failed" | "uncertain";
  messageId: string | null;
  diagnostic?: string;
};
export type AttackResourceReceipt = { resource: "PE" | "PD"; amount: number; before: number; after: number };
export type AttackSnapshot = {
  useId: string;
  executionId: string;
  sourceMessageId: string | null;
  actorUuid: string;
  itemUuid: string;
  itemName: string;
  target: WorkflowTargetReference | null;
  baseCritical: CriticalProfile;
  modifiers: ComposedAttackModifiers;
  generalActions: AttackGeneralActions;
  bonusDamageDie: AttackBonusDamageDie | null;
  rolledCritical: boolean;
  resource: "PE" | "PD";
  resourceReceipt: AttackResourceReceipt | null;
  nativeAttackIndex: number | null;
  nativeAttackTotal: number | null;
  nativeVolleyId: string | null;
};
export type AttackExecutionFlag = { schemaVersion: 3; revision: number; snapshot: AttackSnapshot; damage: AttackOperationState };
export type AttackDamageFlag = {
  schemaVersion: 1;
  revision: number;
  useId: string;
  executionId: string;
  attackMessageId: string;
  target: WorkflowTargetReference | null;
  multiplier: number;
  resistancePenetration: number;
  damageType: string | null;
  mixedTypes: boolean;
  total: number;
  application: AttackOperationState;
};

export function object(value: unknown): Record<string, unknown> | null {
  return value && typeof value === "object" && !Array.isArray(value) ? value as Record<string, unknown> : null;
}
const text = (value: unknown): value is string => typeof value === "string" && value.length > 0;
const nullableText = (value: unknown): boolean => value === null || text(value);
const integer = (value: unknown): value is number => Number.isSafeInteger(value) && (value as number) >= 0;
function critical(value: unknown): value is CriticalProfile {
  const raw = object(value);
  return !!raw && integer(raw.margin) && raw.margin >= 1 && raw.margin <= 20 && integer(raw.multiplier) && raw.multiplier >= 2;
}
export function isAttackTargetReference(value: unknown): value is WorkflowTargetReference {
  if (value === null) return false;
  const raw = object(value);
  return !!raw && text(raw.id) && text(raw.name) && ["sceneId", "tokenId", "tokenUuid", "actorId", "actorUuid"].every(key => nullableText(raw[key]));
}
function operation(value: unknown): value is AttackOperationState {
  const raw = object(value);
  return !!raw && ["available", "executing", "published", "completed", "failed", "uncertain"].includes(String(raw.state))
    && nullableText(raw.messageId) && (raw.diagnostic === undefined || typeof raw.diagnostic === "string");
}
function validContributions(value: unknown, total: number, signed: boolean): boolean {
  if (value === undefined) return true;
  if (!Array.isArray(value)) return false;
  let sum = 0;
  for (const entry of value) {
    if (!Number.isSafeInteger(entry) || entry === 0 || !signed && entry < 0 || !Number.isSafeInteger(sum + entry)) return false;
    sum += entry;
  }
  return sum === total;
}
export function readAttackCardBinding(value: unknown): AttackCardBinding | null {
  const raw = object(value);
  if (!raw || !isJsonData(raw) || raw.schemaVersion !== 1 || !integer(raw.revision) || !text(raw.activeUseId) || !Array.isArray(raw.executions)) return null;
  const ids = new Set<string>();
  const messageIds = new Set<string>();
  for (const [index, value] of raw.executions.entries()) {
    const entry = object(value);
    if (!entry || !text(entry.executionId) || ids.has(entry.executionId) || entry.ordinal !== index || !nullableText(entry.attackMessageId)
      || !["preparing", "cancelled", "failed", "published", "uncertain"].includes(String(entry.state))
      || (entry.state === "published" && !text(entry.attackMessageId))
      || (typeof entry.attackMessageId === "string" && messageIds.has(entry.attackMessageId))) return null;
    ids.add(entry.executionId);
    if (typeof entry.attackMessageId === "string") messageIds.add(entry.attackMessageId);
  }
  return structuredClone(raw) as AttackCardBinding;
}
export function readAttackExecution(value: unknown): AttackExecutionFlag | null {
  const raw = object(value), snapshot = object(raw?.snapshot), modifiers = object(snapshot?.modifiers);
  if (!raw || !snapshot || !modifiers || !isJsonData(raw) || ![1, 2, 3].includes(raw.schemaVersion as number) || !integer(raw.revision)
    || !operation(raw.damage) || !["useId", "executionId", "actorUuid", "itemUuid", "itemName"].every(key => text(snapshot[key]))
    || !nullableText(snapshot.sourceMessageId) || (snapshot.target !== null && !isAttackTargetReference(snapshot.target))
    || !critical(snapshot.baseCritical) || !critical(modifiers.critical) || !integer(modifiers.effortCost)
    || !integer(modifiers.resistancePenetration) || typeof snapshot.rolledCritical !== "boolean"
    || !["PE", "PD"].includes(String(snapshot.resource))
    || ![snapshot.nativeAttackIndex, snapshot.nativeAttackTotal].every(value => value === null || (integer(value) && value > 0))
    || !nullableText(snapshot.nativeVolleyId) || !Array.isArray(modifiers.selected)) return null;
  if (modifiers.selected.some(value => {
    const entry = object(value);
    return !entry || !["presetId", "presetVersion", "label", "abilityUuid"].every(key => text(entry[key]))
      || !Array.isArray(entry.optionIds) || !entry.optionIds.every(text);
  })) return null;
  if (snapshot.resourceReceipt !== null) {
    const receipt = object(snapshot.resourceReceipt);
    if (!receipt || receipt.resource !== snapshot.resource || receipt.amount !== modifiers.effortCost
      || !integer(receipt.amount) || typeof receipt.before !== "number" || typeof receipt.after !== "number"
      || receipt.before < receipt.amount || receipt.after !== receipt.before - receipt.amount) return null;
  } else if (modifiers.effortCost > 0) return null;
  if (raw.schemaVersion === 2 || raw.schemaVersion === 3) {
    const actions = object(snapshot.generalActions);
    if (!actions || typeof actions.aim !== "boolean" || typeof actions.burst !== "boolean"
      || actions.aim && modifiers.selected.some(value => {
        const entry = object(value)!;
        return entry.presetId === INTUITIVE_SHOT_PRESET.id && (entry.optionIds as string[]).length > 0;
      })) return null;
    const legacy = raw.schemaVersion === 2;
    const dieValue = legacy ? snapshot.burstDamage : snapshot.bonusDamageDie, die = object(dieValue);
    if (legacy) {
      if (modifiers.attackDicePenalty !== (actions.burst ? 1 : 0) || modifiers.bonusWeaponDamageDice !== (actions.burst ? 1 : 0)) return null;
    } else if (!Number.isSafeInteger(modifiers.attackDiceModifier) || !integer(modifiers.bonusWeaponDamageDice)
      || !validContributions(modifiers.attackDiceContributions, modifiers.attackDiceModifier as number, true)
      || !validContributions(modifiers.bonusWeaponDamageContributions, modifiers.bonusWeaponDamageDice as number, false)
      || actions.burst && modifiers.bonusWeaponDamageDice < 1
      || actions.burst && modifiers.selected.length === 0 && (modifiers.attackDiceModifier !== -1 || modifiers.bonusWeaponDamageDice !== 1)
      || !actions.burst && modifiers.selected.length === 0 && (modifiers.attackDiceModifier !== 0 || modifiers.bonusWeaponDamageDice !== 0)) return null;
    if ((modifiers.bonusWeaponDamageDice as number) > 0
      ? !die || !integer(die.faces) || die.faces < 1 || !nullableText(die.type) : dieValue !== null) return null;
  } else if (raw.schemaVersion !== 1) return null;
  const normalized = structuredClone(raw) as AttackExecutionFlag;
  normalized.schemaVersion = 3;
  if (raw.schemaVersion === 1) {
    normalized.snapshot.generalActions = { aim: false, burst: false };
    normalized.snapshot.bonusDamageDie = null;
    normalized.snapshot.modifiers.attackDiceModifier = 0;
    normalized.snapshot.modifiers.bonusWeaponDamageDice = 0;
  } else if (raw.schemaVersion === 2) {
    normalized.snapshot.bonusDamageDie = structuredClone(snapshot.burstDamage) as AttackBonusDamageDie | null;
    normalized.snapshot.modifiers.attackDiceModifier = -(modifiers.attackDicePenalty as number) || 0;
  }
  if (raw.schemaVersion !== 3) {
    delete (normalized.snapshot as unknown as Record<string, unknown>).burstDamage;
    delete (normalized.snapshot.modifiers as unknown as Record<string, unknown>).attackDicePenalty;
  }
  const current = normalized.snapshot.modifiers;
  current.attackDiceContributions = raw.schemaVersion === 3 && Array.isArray(modifiers.attackDiceContributions)
    ? [...modifiers.attackDiceContributions] : current.attackDiceModifier !== 0 ? [current.attackDiceModifier] : [];
  current.bonusWeaponDamageContributions = raw.schemaVersion === 3 && Array.isArray(modifiers.bonusWeaponDamageContributions)
    ? [...modifiers.bonusWeaponDamageContributions] : current.bonusWeaponDamageDice > 0 ? [current.bonusWeaponDamageDice] : [];
  return normalized;
}
export function readAttackDamage(value: unknown): AttackDamageFlag | null {
  const raw = object(value);
  if (!raw || !isJsonData(raw) || raw.schemaVersion !== 1 || !integer(raw.revision)
    || !["useId", "executionId", "attackMessageId"].every(key => text(raw[key]))
    || (raw.target !== null && !isAttackTargetReference(raw.target)) || !integer(raw.multiplier) || raw.multiplier < 2
    || !integer(raw.resistancePenetration) || !nullableText(raw.damageType) || typeof raw.mixedTypes !== "boolean"
    || typeof raw.total !== "number" || !Number.isFinite(raw.total) || raw.total < 0 || !operation(raw.application)) return null;
  return structuredClone(raw) as AttackDamageFlag;
}
