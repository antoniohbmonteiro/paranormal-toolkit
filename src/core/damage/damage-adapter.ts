import type { Result } from "../result";
import type {
  DamageApplicationFailure,
  DamageApplicationInput,
  DamageApplicationResult,
} from "./damage-application";

export type DamageApplicationAdapter = {
  applyDamage(
    input: DamageApplicationInput,
  ): Promise<Result<DamageApplicationResult, DamageApplicationFailure>>;
};
