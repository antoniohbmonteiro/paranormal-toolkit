import { ModuleLogger } from "../../core/module-logger";
import type { ConditionEngine } from "./condition-engine";

let hooksRegistered = false;
let readyCleanupScheduled = false;
let combatDeleteCleanupScheduled = false;
let combatTurnChangeCleanupTimeout: ReturnType<typeof globalThis.setTimeout> | null = null;

const READY_CLEANUP_DELAY_MS = 1_000;
const COMBAT_TURN_CHANGE_CLEANUP_DELAY_MS = 750;
const COMBAT_DELETE_CLEANUP_DELAY_MS = 1_000;

export function registerConditionLifecycleHooks(conditionEngine: ConditionEngine): void {
  if (hooksRegistered) return;

  Hooks.on("combatTurnChange", (combat: unknown) => {
    scheduleCombatTurnChangeCleanup(conditionEngine, getDocumentId(combat));
  });

  Hooks.on("deleteCombat", (combat: unknown) => {
    scheduleCombatDeleteCleanup(conditionEngine, getDocumentId(combat));
  });

  hooksRegistered = true;

  scheduleReadyCleanup(conditionEngine);
}

function scheduleReadyCleanup(conditionEngine: ConditionEngine): void {
  if (!canRunAutomaticCleanup()) return;
  if (readyCleanupScheduled) return;
  readyCleanupScheduled = true;

  globalThis.setTimeout(() => {
    readyCleanupScheduled = false;
    void cleanupExpiredConditions(conditionEngine, "ready");
  }, READY_CLEANUP_DELAY_MS);
}

function scheduleCombatTurnChangeCleanup(conditionEngine: ConditionEngine, combatId: string | null): void {
  if (!canRunAutomaticCleanup()) return;
  if (!combatId) return;

  if (combatTurnChangeCleanupTimeout) {
    globalThis.clearTimeout(combatTurnChangeCleanupTimeout);
  }

  combatTurnChangeCleanupTimeout = globalThis.setTimeout(() => {
    combatTurnChangeCleanupTimeout = null;
    void cleanupExpiredConditions(conditionEngine, "combat-turn-change", combatId);
  }, COMBAT_TURN_CHANGE_CLEANUP_DELAY_MS);
}

function scheduleCombatDeleteCleanup(conditionEngine: ConditionEngine, combatId: string | null): void {
  if (!canRunAutomaticCleanup()) return;
  if (!combatId) return;
  if (combatDeleteCleanupScheduled) return;
  combatDeleteCleanupScheduled = true;

  globalThis.setTimeout(() => {
    combatDeleteCleanupScheduled = false;
    void cleanupExpiredConditions(conditionEngine, "combat-deleted", combatId);
  }, COMBAT_DELETE_CLEANUP_DELAY_MS);
}

async function cleanupExpiredConditions(
  conditionEngine: ConditionEngine,
  reason: "ready" | "combat-turn-change" | "combat-deleted",
  combatId?: string | null
): Promise<void> {
  if (!canRunAutomaticCleanup()) return;

  try {
    const summary = await conditionEngine.cleanupExpiredConditions({
      reason,
      combatId: combatId ?? null,
      removeAllForCombat: reason === "combat-deleted"
    });

    if (summary.removedEffects > 0) {
      ModuleLogger.info(
        `Condition Engine removeu ${summary.removedEffects} efeito(s) expirado(s). Motivo: ${reason}.`
      );
    }

    for (const failure of summary.failures) {
      ModuleLogger.warn(failure.message);
    }
  } catch (cause) {
    ModuleLogger.warn("Condition Engine não conseguiu limpar condições expiradas.", cause);
  }
}

function canRunAutomaticCleanup(): boolean {
  return (game as { user?: { isGM?: boolean } | null }).user?.isGM === true;
}

function getDocumentId(document: unknown): string | null {
  if (!document || typeof document !== "object") return null;

  const id = (document as { id?: unknown }).id;
  if (typeof id === "string" && id.length > 0) return id;

  return null;
}
