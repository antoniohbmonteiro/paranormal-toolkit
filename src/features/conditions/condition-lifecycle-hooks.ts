import { ModuleLogger } from "../../core/module-logger";
import type { ConditionEngine } from "./condition-engine";

let hooksRegistered = false;
let readyCleanupScheduled = false;
let combatDeleteCleanupScheduled = false;

const READY_CLEANUP_DELAY_MS = 1_000;
const COMBAT_DELETE_CLEANUP_DELAY_MS = 1_000;

export function registerConditionLifecycleHooks(conditionEngine: ConditionEngine): void {
  if (hooksRegistered) return;

  Hooks.on("deleteCombat", (combat: unknown) => {
    scheduleCombatDeleteCleanup(conditionEngine, getDocumentId(combat));
  });

  hooksRegistered = true;

  scheduleReadyCleanup(conditionEngine);
}

function scheduleReadyCleanup(conditionEngine: ConditionEngine): void {
  if (readyCleanupScheduled) return;
  readyCleanupScheduled = true;

  globalThis.setTimeout(() => {
    readyCleanupScheduled = false;
    void cleanupExpiredConditions(conditionEngine, "ready");
  }, READY_CLEANUP_DELAY_MS);
}

function scheduleCombatDeleteCleanup(conditionEngine: ConditionEngine, combatId: string | null): void {
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
  reason: "ready" | "combat-deleted",
  combatId?: string | null
): Promise<void> {
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

function getDocumentId(document: unknown): string | null {
  if (!document || typeof document !== "object") return null;

  const id = (document as { id?: unknown }).id;
  if (typeof id === "string" && id.length > 0) return id;

  return null;
}
