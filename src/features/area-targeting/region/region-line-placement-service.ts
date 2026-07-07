import { MODULE_ID } from "../../../constants";
import type {
  RegionLinePlacementCallbacks,
  RegionLinePlacementResult,
  RegionLineShapeConfig,
  RegionPlacementChange,
} from "./region-targeting-types";
import { FoundryRegionAdapter } from "./foundry-region-adapter";

const FALLBACK_GRID_SIZE = 100;
const DEFAULT_REGION_LINE_LENGTH_IN_GRID_CELLS = 12;

export class RegionLinePlacementService {
  constructor(
    private readonly foundryAdapter = new FoundryRegionAdapter(),
  ) {}

  async placeLine(
    config: RegionLineShapeConfig = { shape: "rectangleRay" },
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
      const placementCallbacks = createPlacementCallbacks(callbacks);
      const region = await this.foundryAdapter.placeRegion(
        createLineRegionData(config, this.foundryAdapter.getUserColor(), gridSize),
        {
          create: true,
          allowRotation: true,
          ...placementCallbacks,
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
    shapes: [createRectangleRayShapeData(config, gridSize)],
  };
}

function createRectangleRayShapeData(config: RegionLineShapeConfig, gridSize: number): RegionShapeDataLike {
  const dimensions = resolveRegionLineShapeDimensions(config, gridSize);

  return {
    type: "rectangle",
    x: 0,
    y: 0,
    width: dimensions.length,
    height: dimensions.width,
    direction: config.direction ?? 0,
    elevation: config.elevation ?? 0,
  };
}

function resolveRegionLineShapeDimensions(
  config: RegionLineShapeConfig,
  gridSize: number,
): { length: number; width: number } {
  return {
    length: getGridCellDimensionPixels(config.length, DEFAULT_REGION_LINE_LENGTH_IN_GRID_CELLS, gridSize),
    width: getGridCellDimensionPixels(config.width, 1, gridSize),
  };
}

function getGridCellDimensionPixels(
  configuredGridCells: number | null | undefined,
  fallbackGridCells: number,
  gridSize: number,
): number {
  const gridCells = typeof configuredGridCells === "number" &&
    Number.isFinite(configuredGridCells) &&
    configuredGridCells > 0
    ? configuredGridCells
    : fallbackGridCells;

  return gridCells * gridSize;
}

function getPlacementFailureMessage(error: unknown): string {
  const baseMessage =
    "Não foi possível criar a linha na cena. Desmarque para usar os alvos selecionados manualmente.";

  if (error instanceof Error && error.message.trim().length > 0) {
    return `${baseMessage} (${error.message})`;
  }

  return baseMessage;
}

function createPlacementCallbacks(
  callbacks: RegionLinePlacementCallbacks,
): Pick<RegionPlacementOptionsLike, "onChange" | "onMove" | "onRotate"> {
  const notifyChange = (args: RegionPlacementCallbackArgsLike | RegionDocumentLike): void => {
    const change = normalizePlacementChange(args);
    if (change) callbacks.onChange?.(change);
  };

  return {
    onChange: notifyChange,
    onMove: notifyChange,
    onRotate: notifyChange,
  };
}

function normalizePlacementChange(
  args: RegionPlacementCallbackArgsLike | RegionDocumentLike,
): RegionPlacementChange | null {
  if (isPlacementCallbackArgs(args)) {
    return {
      document: args.document,
      preview: args.preview ?? null,
      shape: args.shape ?? null,
    };
  }

  return { document: args };
}

function isPlacementCallbackArgs(
  value: RegionPlacementCallbackArgsLike | RegionDocumentLike,
): value is RegionPlacementCallbackArgsLike {
  return Boolean(
    value &&
      typeof value === "object" &&
      "document" in value &&
      (value as RegionPlacementCallbackArgsLike).document,
  );
}
