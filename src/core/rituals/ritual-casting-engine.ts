import type {
  RitualCastingAdapter,
  RitualCastingCheckResult,
} from "./ritual-casting-adapter";

export class RitualCastingEngine {
  constructor(private readonly adapter: RitualCastingAdapter) {}

  async rollCastingCheck(actor: Actor): Promise<RitualCastingCheckResult> {
    return this.adapter.rollCastingCheck(actor);
  }

  getDifficulty(actor: Actor): number | null {
    return this.adapter.getDifficulty?.(actor) ?? null;
  }
}
