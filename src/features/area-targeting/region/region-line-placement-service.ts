import { MODULE_ID } from "../../../constants";
import type {
  RegionLinePlacementResult,
  RegionLineShapeConfig,
} from "./region-targeting-types";
import { FoundryRegionAdapter } from "./foundry-region-adapter";

const DEFAULT_REGION_LINE_LENGTH = 30;
const DEFAULT_REGION_LINE_WIDTH = 5;

export class RegionLinePlacementService {
  constructor(
    private readonly foundryAdapter = new FoundryRegionAdapter(),
  ) {}

  async placeLine(
    config: RegionLineShapeConfig = { shape: "line" },
  ): Promise<RegionLinePlacementResult> {
    const placementState = this.foundryAdapter.canPlaceRegions();

    if (!placementState.ok) {
      return {
        status: "failed",
        reason: placementState.reason,
        message: placementState.message,
      };
    }

    try {
      const region = await this.foundryAdapter.placeRegion(
        createLineRegionData(config, this.foundryAdapter.getUserColor()),
        { create: false },
      );

      if (!region) {
        return {
          status: "cancelled",
          reason: "region-placement-cancelled",
        };
      }

      return {
        status: "confirmed",
        region,
        wasCreated: false,
      };
    } catch (error) {
      return {
        status: "failed",
        reason: "region-placement-failed",
        message: getPlacementFailureMessage(error),
      };
    }
  }
}

function createLineRegionData(
  config: RegionLineShapeConfig,
  userColor: string | null,
): RegionDataLike {
  return {
    name: "Ritual: Linha de efeito",
    color: userColor ?? undefined,
    displayMeasurements: true,
    highlightMode: "coverage",
    flags: {
      [MODULE_ID]: {
        temporary: true,
        purpose: "ritual-line-targeting",
      },
    },
    shapes: [createLineShapeData(config)],
  };
}

function createLineShapeData(config: RegionLineShapeConfig): RegionShapeDataLike {
  return {
    type: "line",
    x: 0,
    y: 0,
    length: config.length ?? DEFAULT_REGION_LINE_LENGTH,
    width: config.width ?? DEFAULT_REGION_LINE_WIDTH,
    direction: config.direction ?? 0,
    elevation: config.elevation ?? 0,
  };
}

function getPlacementFailureMessage(error: unknown): string {
  if (error instanceof Error && error.message.trim().length > 0) {
    return `Falha ao posicionar a Region de linha: ${error.message}`;
  }

  return "Falha ao posicionar a Region de linha.";
}
