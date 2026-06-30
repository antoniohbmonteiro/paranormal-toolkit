import { ModuleLogger } from "../../core/module-logger";
import type { ConditionEngine } from "./condition-engine";

let hooksRegistered = false;

export function registerConditionLifecycleHooks(conditionEngine: ConditionEngine): void {
  if (hooksRegistered) return;

  Hooks.on("updateCombat", () => {
    void cleanupExpiredConditions(conditionEngine, "combat-updated");
  });

  Hooks.on("deleteCombat", (combat: unknown) => {
    void cleanupExpiredConditions(conditionEngine, "combat-deleted", getDocumentId(combat));
  });

  hooksRegistered = true;

  void cleanupExpiredConditions(conditionEngine, "ready");
}

async function cleanupExpiredConditions(
  conditionEngine: ConditionEngine,
  reason: "ready" | "combat-updated" | "combat-deleted",
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
