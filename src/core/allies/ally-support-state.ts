export type AllyRoundWait = { combatId: string; round: number };
export type AllySupportState = {
  beneficiaryId: string | null;
  status: "inactive" | "active" | "pending";
  wait: AllyRoundWait | null;
  sequence: number;
};
export type AllyCombatSnapshot = { id: string; round: number; started: boolean };
export type AllySupportAction =
  | { type: "setBeneficiary"; beneficiaryId: string | null; combat: AllyCombatSnapshot | null }
  | { type: "assign"; beneficiaryId: string; combat: AllyCombatSnapshot | null }
  | { type: "activate" }
  | { type: "deactivate" }
  | { type: "combat"; combat: AllyCombatSnapshot | null };

export function createAllySupportState(): AllySupportState {
  return { beneficiaryId: null, status: "inactive", wait: null, sequence: 0 };
}

export function transitionAllySupport(
  state: AllySupportState, action: AllySupportAction, nextSequence: number,
): AllySupportState {
  switch (action.type) {
    case "setBeneficiary": {
      if (state.beneficiaryId === action.beneficiaryId && (action.beneficiaryId === null || state.status !== "inactive")) return state;
      const wait = state.wait ?? (state.beneficiaryId && state.status !== "inactive" && action.combat?.started
        ? { combatId: action.combat.id, round: action.combat.round + 1 } : null);
      return { beneficiaryId: action.beneficiaryId, wait,
        status: action.beneficiaryId === null ? "inactive" : wait ? "pending" : "active",
        sequence: action.beneficiaryId === null ? state.sequence : nextSequence };
    }
    case "assign": {
      if (state.beneficiaryId === action.beneficiaryId) return state;
      const wait = state.wait ?? (state.beneficiaryId && action.combat?.started
        ? { combatId: action.combat.id, round: action.combat.round + 1 } : null);
      return { ...state, beneficiaryId: action.beneficiaryId, wait,
        status: state.status === "inactive" ? "inactive" : wait ? "pending" : "active",
        sequence: nextSequence };
    }
    case "activate":
      if (!state.beneficiaryId || state.status !== "inactive") return state;
      return { ...state, status: state.wait ? "pending" : "active", sequence: nextSequence };
    case "deactivate":
      return state.status === "inactive" ? state : { ...state, status: "inactive" };
    case "combat":
      if (!state.wait) return state;
      if (action.combat && (action.combat.id !== state.wait.combatId
        || (action.combat.started && action.combat.round < state.wait.round))) return state;
      return { ...state, wait: null, status: state.status === "pending" ? "active" : state.status };
  }
}
