import type { ActorResource } from "../../../../core/resources/actor-resource";
import type { ResourceOperation } from "../../../../core/resources/resource-operation";
import type { DamageApplicationInstanceInput } from "../../../../core/damage/damage-application";
import type { ToolkitConditionDurationInput } from "../../../conditions/condition-duration";

export type RitualResistanceOutcome = "success" | "failure";
export type RitualCardActionState = "pending" | "available" | "executing" | "completed" | "resolved" | "uncertain";
export type RitualRollIntent = "damage" | "healing" | "utility";
export type SerializableDocumentRef = { id: string | null; uuid: string | null; name: string };
export type RitualRollSnapshot = { id: string; label: string; intent: RitualRollIntent; formula: string; total: number; diceResults: number[]; damageType: string | null };
export type RitualCastingSnapshot = { skillLabel: string; formula: string; total: number; difficulty: number; success: boolean; diceResults: number[]; consequence: string | null };
export type RitualResistanceResult = { skill: string; skillLabel: string; formula: string; total: number; diceResults: number[]; difficulty: number; outcome: RitualResistanceOutcome; targetActorId: string | null; targetActorUuid: string | null; targetName: string; rolledAt: string; userId: string | null; usedFallbackBonus: boolean };

type BaseAction = { id: string; state: RitualCardActionState; label: string; executedLabel: string; actor: SerializableDocumentRef; choiceGroupId: string | null; outcome: RitualResistanceOutcome | null; completedAt: string | null; completedByUserId: string | null };
export type RitualResourceAction = BaseAction & { kind: "resource-operation"; resource: ActorResource; operation: ResourceOperation; amount: number };
export type RitualDamageAction = BaseAction & { kind: "damage-application"; instances: DamageApplicationInstanceInput[]; source: string | null; originUuid: string | null };
export type RitualConditionAction = BaseAction & { kind: "condition-application"; conditionId: string; duration: ToolkitConditionDurationInput | null; source: string | null; originUuid: string | null };
export type RitualCardAction = RitualResourceAction | RitualDamageAction | RitualConditionAction;

export interface RitualChatCardState {
  schemaVersion: 1;
  castId: string;
  renderer: "single-target";
  source: SerializableDocumentRef;
  item: SerializableDocumentRef;
  form: { id: string; label: string };
  ritualIdentity?: { elementKey: string; elementLabel: string; circle: 1 | 2 | 3 | 4 } | null;
  descriptionHtml: string | null;
  cost: { amount: number; resource: "PE" | "PD"; spent: boolean } | null;
  target: SerializableDocumentRef & { tokenId: string | null; tokenUuid: string | null };
  conjuration: RitualCastingSnapshot | null;
  mainRoll: RitualRollSnapshot | null;
  resistance: { skill: string; skillLabel: string; difficulty: number; effect: string; status: "pending" | "executing" | "completed" | "uncertain"; result: RitualResistanceResult | null } | null;
  actions: RitualCardAction[];
  createdAt: number;
}

export type RitualLegacyFallbackState = { summaryLines: string[]; itemName: string; actorId: string | null; itemId: string | null };
export interface RitualSingleTargetChatCardV2 { schemaVersion: 2; kind: "ritual"; renderer: "single-target"; revision: number; createdAt: number; messageId: string | null; state: RitualChatCardState; legacyFallback: RitualLegacyFallbackState }
