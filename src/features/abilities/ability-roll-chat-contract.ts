import type { AbilityRollIntent, ResolvedAbilityRoll } from "./config/ability-roll-config";
import type { AbilityUseCardState } from "./ability-use-card-state";
export const ABILITY_ROLL_ACTION_ATTRIBUTE = "data-paranormal-toolkit-ability-roll-id";
export type AbilityRollMessageAction = ResolvedAbilityRoll;
export type AbilityUseMessageFlagV2 = { version: 2; actorUuid: string; itemUuid: string; abilityName: string; rolls: AbilityRollMessageAction[]; resource: "PE" | "PD"; cost: number; spentResource: boolean; resourceBefore: number; resourceAfter: number };
export type AbilityUseMessageFlagV3 = { version: 3; state: AbilityUseCardState };
export type AbilityUseMessageFlag = AbilityUseMessageFlagV2 | AbilityUseMessageFlagV3;
export function normalizeAbilityUseMessageFlag(value: unknown): AbilityUseMessageFlag | null {
  if (!record(value)) return null;
  if (value.version === 3) { const state = normalizeState(value.state); return state ? { version: 3, state } : null; }
  if (value.version !== 2 || !Array.isArray(value.rolls)) return null;
  const actorUuid = str(value.actorUuid); if (!actorUuid) return null;
  return { version: 2, actorUuid, itemUuid: str(value.itemUuid), abilityName: str(value.abilityName) || "Habilidade", rolls: value.rolls.map(normalizeRollAction).filter((x): x is AbilityRollMessageAction => Boolean(x)), resource: value.resource === "PD" ? "PD" : "PE", cost: num(value.cost), spentResource: value.spentResource === true, resourceBefore: num(value.resourceBefore), resourceAfter: num(value.resourceAfter) };
}
function normalizeState(value: unknown): AbilityUseCardState | null {
  if (!record(value) || value.schemaVersion !== 1 || !record(value.ability) || !record(value.actor) || !record(value.item) || !record(value.resource) || !Array.isArray(value.rolls)) return null;
  const abilityName = str(value.ability.name), actorName = str(value.actor.name); if (!abilityName || !actorName) return null;
  const resourceType = value.resource.type === "PD" ? "PD" : value.resource.type === "PE" ? "PE" : null; if (!resourceType) return null;
  const rolls = value.rolls.map(normalizeExecuted).filter((x): x is AbilityUseCardState["rolls"][number] => Boolean(x)); if (rolls.length !== value.rolls.length) return null;
  return { schemaVersion: 1, ability: { name: abilityName, image: nullable(value.ability.image), descriptionHtml: nullable(value.ability.descriptionHtml), activationLabel: str(value.ability.activationLabel) || "—" }, actor: { id: nullable(value.actor.id), uuid: nullable(value.actor.uuid), name: actorName }, item: { id: nullable(value.item.id), uuid: nullable(value.item.uuid), name: str(value.item.name) }, resource: { type: resourceType, cost: nonneg(value.resource.cost), passive: value.resource.passive === true, spent: value.resource.spent === true, before: num(value.resource.before), after: num(value.resource.after) }, rolls, createdAt: num(value.createdAt) };
}
function normalizeExecuted(value: unknown) { const base = normalizeRollAction(value); if (!base || !record(value) || typeof value.total !== "number" || !Number.isFinite(value.total) || !Array.isArray(value.diceResults)) return null; const diceResults = value.diceResults.filter((n): n is number => typeof n === "number" && Number.isFinite(n)); if (diceResults.length !== value.diceResults.length) return null; return { ...base, total: value.total, diceResults }; }
function normalizeRollAction(value: unknown): AbilityRollMessageAction | null { if (!record(value)) return null; const id=str(value.id), sourceRollId=str(value.sourceRollId), label=str(value.label), formula=str(value.formula), intent=intentOf(value.intent); if(!id||!sourceRollId||!label||!formula||!intent)return null; return { id, sourceRollId, label, formula, intent, damageType: intent === "damage" ? nullable(value.damageType) : null, nexThreshold: typeof value.nexThreshold === "number" && Number.isFinite(value.nexThreshold) ? Math.max(0,Math.min(99,Math.trunc(value.nexThreshold))) : null }; }
function intentOf(v:unknown): AbilityRollIntent|null{return v==="generic"||v==="damage"||v==="healing"?v:null} function record(v:unknown):v is Record<string,unknown>{return v!==null&&typeof v==="object"&&!Array.isArray(v)} function str(v:unknown){return typeof v==="string"?v.trim():""} function nullable(v:unknown){const x=str(v);return x||null} function num(v:unknown){const n=typeof v==="number"?v:Number(v);return Number.isFinite(n)?n:0} function nonneg(v:unknown){return Math.max(0,num(v))}
