export type AllyGrantData = {
  name: string; img: string; type: "ability"; system: Record<string, unknown>;
  flags: Record<string, unknown>; effects: Record<string, unknown>[];
};
export type AllyGrant = {
  grantId: string; allyId: string; sourceItemId: string; actorId: string; itemId: string;
  activationSequence: number; fingerprint: string; diagnostic: string | null; effectIds: string[]; provisioned: boolean;
};
export function allyGrantKey(allyId: string, itemId: string): string {
  return JSON.stringify([allyId, itemId]);
}
