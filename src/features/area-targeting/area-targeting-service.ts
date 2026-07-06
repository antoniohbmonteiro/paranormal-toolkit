import type { PreCastTargetingInput, PreCastTargetingResult } from "./area-targeting-types";
import { FoundryAreaTargetingAdapter } from "./foundry-area-targeting-adapter";
import { RegionCleanupService } from "./region/region-cleanup-service";
import { RegionLinePlacementService } from "./region/region-line-placement-service";
import { RegionTargetResolver } from "./region/region-target-resolver";

const NO_LINE_TARGETS_MESSAGE = "Nenhum alvo encontrado na linha.";

export class AreaTargetingService {
  constructor(
    private readonly regionLinePlacement = new RegionLinePlacementService(),
    private readonly regionTargetResolver = new RegionTargetResolver(),
    private readonly regionCleanup = new RegionCleanupService(),
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
      const placementResult = await this.regionLinePlacement.placeLine({
        shape: "line",
        length: input.formTargeting?.template?.distance,
        width: input.formTargeting?.template?.width,
      });

      if (placementResult.status === "cancelled") {
        return placementResult;
      }

      if (placementResult.status === "failed") {
        this.foundryAdapter.warn(placementResult.message);
        return placementResult;
      }

      try {
        const resolution = this.regionTargetResolver.resolveTargets(placementResult.region);

        if (resolution.targets.length === 0) {
          this.foundryAdapter.warn(NO_LINE_TARGETS_MESSAGE);
          return {
            status: "cancelled",
            reason: "no-targets-found",
          };
        }

        return {
          status: "confirmed",
          targets: resolution.targets,
        };
      } catch (error) {
        const message = createRegionResolutionFailureMessage(error);
        this.foundryAdapter.warn(message);
        return {
          status: "failed",
          reason: "region-resolution-failed",
          message,
        };
      } finally {
        if (placementResult.wasCreated) {
          await this.regionCleanup.deleteCreatedRegion(placementResult.region);
        }
      }
    }

    return {
      status: "failed",
      reason: "unsupported-targeting-mode",
      message: "Modo de seleção de alvos não suportado.",
    };
  }
}

function createRegionResolutionFailureMessage(error: unknown): string {
  if (error instanceof Error && error.message.trim().length > 0) {
    return `Falha ao resolver os alvos da linha: ${error.message}`;
  }

  return "Falha ao resolver os alvos da linha.";
}
