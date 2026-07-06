import { LineAreaPlacementService } from "./line-area-placement-service";
import type { PreCastTargetingInput, PreCastTargetingResult } from "./area-targeting-types";

export class AreaTargetingService {
  constructor(
    private readonly linePlacement = new LineAreaPlacementService(),
  ) {}

  async resolvePreCastTargets(input: PreCastTargetingInput): Promise<PreCastTargetingResult> {
    const requestedTargeting = input.castOptions.areaTargeting;

    if (!requestedTargeting || !requestedTargeting.enabled || requestedTargeting.mode === "selectedTokens") {
      return {
        status: "confirmed",
        targets: input.currentTargets,
      };
    }

    if (requestedTargeting.mode === "lineArea") {
      const placementResult = await this.linePlacement.placeLine();

      if (placementResult.status === "confirmed") {
        return {
          status: "confirmed",
          targets: input.currentTargets,
          line: placementResult.line,
        };
      }

      return placementResult;
    }

    return {
      status: "failed",
      reason: "unsupported-targeting-mode",
      message: "Modo de seleção de alvos não suportado.",
    };
  }
}
