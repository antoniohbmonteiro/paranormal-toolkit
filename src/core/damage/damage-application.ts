import type { DamageTypeInput } from "./damage-types";

export type DamageApplicationInstanceInput = {
  id?: string;
  amount: number;
  damageType?: DamageTypeInput;
  label?: string;
  sourceRollId?: string | null;
  ignoreResistance?: boolean;
  nonLethal?: boolean;
};

export type DamageApplicationInput = {
  actor: Actor;
  instances: DamageApplicationInstanceInput[];
  source?: string | null;
  originUuid?: string | null;
};

export type DamageApplicationInstanceResult = {
  id: string;
  label: string | null;
  sourceRollId: string | null;
  inputAmount: number;
  finalDamage: number;
  blocked: number;
  damageType: string | null;
  systemDamageType: string | null;
  ignoreResistance: boolean;
  nonLethal: boolean;
};

export type DamageApplicationResult = {
  actor: Actor;
  actorId: string | null;
  actorName: string;
  totalRawDamage: number;
  totalFinalDamage: number;
  totalBlocked: number;
  newPV: number | null;
  conditions: string[];
  instances: DamageApplicationInstanceResult[];
  source: string | null;
  originUuid: string | null;
};

export type DamageApplicationFailureReason =
  | "invalid-amount"
  | "empty-damage"
  | "unknown-damage-type"
  | "unsupported-actor"
  | "application-failed";

export type DamageApplicationFailure = {
  actor: Actor | null;
  actorId: string | null;
  actorName: string;
  reason: DamageApplicationFailureReason;
  message: string;
  instance?: DamageApplicationInstanceInput;
  damageType?: DamageTypeInput;
  cause?: unknown;
};
