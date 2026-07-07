import { PARANORMAL_TOOLKIT_HOOKS } from "./paranormal-toolkit-hooks";
import type {
  RitualAreaResolvedEvent,
  RitualCastFinishedEvent,
  RitualCastStartedEvent,
} from "./ritual-event-types";

export class RitualEventBus {
  emitCastStarted(event: RitualCastStartedEvent): void {
    Hooks.callAll(PARANORMAL_TOOLKIT_HOOKS.ritual.castStarted, event);
  }

  emitAreaResolved(event: RitualAreaResolvedEvent): void {
    Hooks.callAll(PARANORMAL_TOOLKIT_HOOKS.ritual.areaResolved, event);
  }

  emitCastFinished(event: RitualCastFinishedEvent): void {
    Hooks.callAll(PARANORMAL_TOOLKIT_HOOKS.ritual.castFinished, event);
  }
}
