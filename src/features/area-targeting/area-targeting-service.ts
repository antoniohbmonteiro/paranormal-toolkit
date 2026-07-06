import type { PreCastTargetingInput, PreCastTargetingResult } from "./area-targeting-types";
import { FoundryAreaTargetingAdapter } from "./foundry-area-targeting-adapter";
import { NativeRayTemplatePlacementService } from "./native-template/native-ray-template-placement-service";
import { MeasuredTemplateTargetResolver } from "./native-template/measured-template-target-resolver";

export class AreaTargetingService {
  constructor(
    private readonly nativeRayPlacement = new NativeRayTemplatePlacementService(),
    private readonly measuredTemplateTargetResolver = new MeasuredTemplateTargetResolver(),
    private readonly foundryAdapter = new FoundryAreaTargetingAdapter(),
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
      const placementResult = await this.nativeRayPlacement.placeRayTemplate();

      if (placementResult.status === "confirmed") {
        const targets = this.measuredTemplateTargetResolver.resolveTargets(
          placementResult.templateDocument,
        );

        if (targets.length === 0) {
          this.foundryAdapter.warn("Nenhum alvo encontrado na linha.");
          return {
            status: "cancelled",
            reason: "no-targets-found",
          };
        }

        return {
          status: "confirmed",
          targets,
        };
      }

      if (placementResult.status === "failed") {
        this.foundryAdapter.warn(placementResult.message);
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
