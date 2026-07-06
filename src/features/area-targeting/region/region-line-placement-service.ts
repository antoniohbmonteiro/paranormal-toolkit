import { MODULE_ID } from "../../../constants";
import type {
  RegionLinePlacementCallbacks,
  RegionLinePlacementResult,
  RegionLineShapeConfig,
} from "./region-targeting-types";
import { FoundryRegionAdapter } from "./foundry-region-adapter";

const FALLBACK_GRID_SIZE = 100;
const DEFAULT_REGION_LINE_LENGTH_IN_GRID_CELLS = 12;

export class RegionLinePlacementService {
  constructor(
    private readonly foundryAdapter = new FoundryRegionAdapter(),
  ) {}

  async placeLine(
    config: RegionLineShapeConfig = { shape: "line" },
    callbacks: RegionLinePlacementCallbacks = {},
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
      const gridSize = this.foundryAdapter.getGridSize() ?? FALLBACK_GRID_SIZE;
      const region = await this.foundryAdapter.placeRegion(
        createLineRegionData(config, this.foundryAdapter.getUserColor(), gridSize),
        {
          create: true,
          allowRotation: true,
          onChange: callbacks.onChange,
        },
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
        wasCreated: true,
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
  gridSize: number,
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
    shapes: [createLineShapeData(config, gridSize)],
  };
}

function createLineShapeData(config: RegionLineShapeConfig, gridSize: number): RegionShapeDataLike {
  const dimensions = resolveRegionLineShapeDimensions(config, gridSize);

  return {
    type: "line",
    x: 0,
    y: 0,
    length: dimensions.length,
    width: dimensions.width,
    direction: config.direction ?? 0,
    elevation: config.elevation ?? 0,
  };
}

function resolveRegionLineShapeDimensions(
  config: RegionLineShapeConfig,
  gridSize: number,
): { length: number; width: number } {
  const widthFallback = gridSize;
  const lengthFallback = gridSize * DEFAULT_REGION_LINE_LENGTH_IN_GRID_CELLS;

  return {
    length: getUsefulPixelDimension(config.length, lengthFallback, gridSize),
    width: getUsefulPixelDimension(config.width, widthFallback, gridSize),
  };
}

function getUsefulPixelDimension(
  configuredValue: number | null | undefined,
  fallback: number,
  minimumUsefulPixels: number,
): number {
  return typeof configuredValue === "number" &&
    Number.isFinite(configuredValue) &&
    configuredValue >= minimumUsefulPixels
    ? configuredValue
    : fallback;
}

function getPlacementFailureMessage(error: unknown): string {
  const baseMessage =
    "Não foi possível criar a linha na cena. Desmarque para usar os alvos selecionados manualmente.";

  if (error instanceof Error && error.message.trim().length > 0) {
    return `${baseMessage} (${error.message})`;
  }

  return baseMessage;
}
