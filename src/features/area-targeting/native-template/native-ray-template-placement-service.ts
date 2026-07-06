import { FoundryAreaTargetingAdapter } from "../foundry-area-targeting-adapter";
import type { NativeRayTemplatePlacementResult } from "../area-targeting-types";

const NATIVE_RAY_UNAVAILABLE_MESSAGE =
  "Linha nativa do Foundry ainda não está disponível. Desmarque para usar os alvos selecionados manualmente.";

export class NativeRayTemplatePlacementService {
  constructor(
    private readonly foundryAdapter = new FoundryAreaTargetingAdapter(),
  ) {}

  async placeRayTemplate(): Promise<NativeRayTemplatePlacementResult> {
    const canvasState = this.foundryAdapter.validateCanvasState();

    if (!canvasState.ok) {
      return {
        status: "failed",
        reason: canvasState.reason,
        message: canvasState.message,
      };
    }

    const nativePlacement = this.foundryAdapter.getNativeRayTemplatePlacementAvailability();

    if (!nativePlacement.available) {
      return {
        status: "failed",
        reason: "native-template-unavailable",
        message: NATIVE_RAY_UNAVAILABLE_MESSAGE,
      };
    }

    return {
      status: "failed",
      reason: "native-template-unavailable",
      message: NATIVE_RAY_UNAVAILABLE_MESSAGE,
    };
  }
}
