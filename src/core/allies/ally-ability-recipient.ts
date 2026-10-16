export type AllyAbilityRecipientInput = {
  beneficiaryId: string | null;
  pilotId: string | null;
  isDrone: boolean;
  pilotAbilitiesEnabled: boolean;
};
export type AllyAbilityRecipient = { actorId: string | null; reason: "pilot-required" | null };

export function resolveAllyAbilityRecipient(input: AllyAbilityRecipientInput): AllyAbilityRecipient {
  if (!input.beneficiaryId) return { actorId: null, reason: null };
  if (!input.pilotAbilitiesEnabled || !input.isDrone) return { actorId: input.beneficiaryId, reason: null };
  return input.pilotId ? { actorId: input.pilotId, reason: null } : { actorId: null, reason: "pilot-required" };
}
