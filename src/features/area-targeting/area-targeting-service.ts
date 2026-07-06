import type { PreCastTargetingInput, PreCastTargetingResult } from "./area-targeting-types";

const LINE_AREA_NOT_IMPLEMENTED_MESSAGE = "Seleção por linha ainda não implementada.";

export class AreaTargetingService {
  async resolvePreCastTargets(input: PreCastTargetingInput): Promise<PreCastTargetingResult> {
    const requestedTargeting = input.castOptions.areaTargeting;

    if (!requestedTargeting || !requestedTargeting.enabled || requestedTargeting.mode === "selectedTokens") {
      return {
        status: "confirmed",
        targets: input.currentTargets,
      };
    }

    if (requestedTargeting.mode === "lineArea") {
      ui.notifications?.warn(`Paranormal Toolkit: ${LINE_AREA_NOT_IMPLEMENTED_MESSAGE}`);
      return {
        status: "cancelled",
        reason: "line-area-not-implemented",
      };
    }

    return {
      status: "failed",
      reason: "unsupported-targeting-mode",
      message: "Modo de seleção de alvos não suportado.",
    };
  }
}
