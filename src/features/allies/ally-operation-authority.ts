export type AllyUser = { id: string; isGM: boolean; active: boolean };
export function electAllyExecutor(users: AllyUser[]): string | null {
  return users.filter(user => user.isGM && user.active).map(user => user.id).sort()[0] ?? null;
}
export type AllyRequest = {
  id: string; revision: number; action: "assign" | "activate" | "deactivate" | "reconcile" | "setPilot";
  beneficiaryId?: string; combatId?: string; pilotId?: string | null;
};
export function readAllyRequest(value: unknown): AllyRequest | null {
  if (!value || typeof value !== "object") return null;
  const data = value as Record<string, unknown>;
  if (typeof data.id !== "string" || !/^[a-zA-Z0-9_-]{8,80}$/.test(data.id)
    || !Number.isSafeInteger(data.revision) || (data.revision as number) < 0
    || !["assign", "activate", "deactivate", "reconcile", "setPilot"].includes(String(data.action))) return null;
  if (data.action === "assign" && (typeof data.beneficiaryId !== "string" || !data.beneficiaryId)) return null;
  if (data.beneficiaryId !== undefined && typeof data.beneficiaryId !== "string") return null;
  if (data.combatId !== undefined && typeof data.combatId !== "string") return null;
  if ((data.action === "setPilot" && !Object.hasOwn(data, "pilotId"))
    || (data.pilotId !== undefined && data.pilotId !== null && (typeof data.pilotId !== "string" || !data.pilotId.trim()))) return null;
  if (data.action === "setPilot" && data.pilotId === undefined) return null;
  return { id: data.id, revision: data.revision as number, action: data.action as AllyRequest["action"],
    ...(data.action === "assign" && typeof data.beneficiaryId === "string" ? { beneficiaryId: data.beneficiaryId } : {}),
    ...(data.action === "setPilot" ? { pilotId: data.pilotId as string | null } : {}),
    ...(typeof data.combatId === "string" ? { combatId: data.combatId } : {}) };
}

export function authorizeAllyRequest(request: AllyRequest, user: AllyUser | undefined, ownsAlly: boolean): void {
  if (!user || !user.active || (!user.isGM && !ownsAlly)) throw new Error("Solicitante não autorizado.");
  if (request.action === "reconcile" && !user.isGM) {
    throw new Error("Esta operação exige um GM.");
  }
}
