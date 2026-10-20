import { ModuleLogger } from "../module-logger";
import { PARANORMAL_TOOLKIT_HOOKS } from "./paranormal-toolkit-hooks";
import type { AttackPublishedEvent } from "./attack-event-types";

export class AttackEventBus {
  emitPublished(event: AttackPublishedEvent): void {
    try {
      Hooks.callAll(PARANORMAL_TOOLKIT_HOOKS.attack.published, event);
    } catch {
      ModuleLogger.warn("Falha em um listener de publicação de ataque.");
    }
  }
}
