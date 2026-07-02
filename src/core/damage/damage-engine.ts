import type { Result } from "../result";
import type {
  DamageApplicationFailure,
  DamageApplicationInput,
  DamageApplicationResult,
} from "./damage-application";
import type { DamageApplicationAdapter } from "./damage-adapter";

export class DamageEngine implements DamageApplicationAdapter {
  constructor(private readonly adapter: DamageApplicationAdapter) {}

  async applyDamage(
    input: DamageApplicationInput,
  ): Promise<Result<DamageApplicationResult, DamageApplicationFailure>> {
    return this.adapter.applyDamage(input);
  }
}
