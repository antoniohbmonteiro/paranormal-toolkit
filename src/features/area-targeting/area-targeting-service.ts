import { LineAreaPlacementService } from "./line-area-placement-service";
import { LineAreaTargetResolver } from "./line-area-target-resolver";
import type { PreCastTargetingInput, PreCastTargetingResult } from "./area-targeting-types";
import { FoundryAreaTargetingAdapter } from "./foundry-area-targeting-adapter";

const NO_LINE_TARGETS_MESSAGE = "Nenhum alvo encontrado na linha.";

export class AreaTargetingService {
  constructor(
    private readonly linePlacement = new LineAreaPlacementService(),
    private readonly lineTargetResolver = new LineAreaTargetResolver(),
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
      const placementResult = await this.linePlacement.placeLine();

      if (placementResult.status === "confirmed") {
        const targets = this.lineTargetResolver.resolveTargets({
          line: placementResult.line,
          width: input.formTargeting?.template?.width,
        });

        if (targets.length === 0) {
          this.foundryAdapter.warn(NO_LINE_TARGETS_MESSAGE);
          return {
            status: "cancelled",
            reason: "no-targets-found",
          };
        }

        return {
          status: "confirmed",
          targets,
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
