import type { WorkflowTarget } from "../../../core/workflow/workflow-context";
import { createWorkflowTargetFromToken } from "../../automation/workflow-target-resolver";
import { FoundryRegionAdapter } from "./foundry-region-adapter";
import type {
  RegionTargetResolutionResult,
  RegionTargetTokenResolutionResult,
} from "./region-targeting-types";

export class RegionTargetResolver {
  constructor(
    private readonly foundryAdapter = new FoundryRegionAdapter(),
  ) {}

  resolveTargets(region: RegionDocumentLike): RegionTargetResolutionResult {
    const resolution = this.resolveTargetTokens(region);

    return {
      ...resolution,
      targets: resolution.tokens.map(createWorkflowTargetFromToken),
    };
  }

  resolveTargetTokens(region: RegionDocumentLike): RegionTargetTokenResolutionResult {
    const sceneTokens = this.foundryAdapter.getSceneTokens();
    const regionTokens = this.resolveRegionTokens(region, sceneTokens);

    if (regionTokens.length > 0) {
      return {
        tokens: regionTokens,
        source: "regionTokens",
      };
    }

    const tokenDocumentTargets = this.resolveTokenDocumentTargets(region, sceneTokens);
    if (tokenDocumentTargets.length > 0) {
      return {
        tokens: tokenDocumentTargets,
        source: "tokenDocument",
      };
    }

    const testPointTargets = this.resolveTestPointTokens(region, sceneTokens);
    if (testPointTargets.length > 0) {
      return {
        tokens: testPointTargets,
        source: "testPoint",
      };
    }

    return {
      tokens: this.resolveLineGeometryTokens(region, sceneTokens),
      source: "lineGeometry",
    };
  }

  private resolveRegionTokens(
    region: RegionDocumentLike,
    sceneTokens: TokenLike[],
  ): TokenLike[] {
    const regionTokenEntries = Array.from(region.tokens ?? []);
    if (regionTokenEntries.length === 0) return [];

    return uniqueTokens(
      regionTokenEntries.flatMap((entry) => {
        const token = resolveTokenFromRegionEntry(entry, sceneTokens);
        return token?.actor ? [token] : [];
      }),
    );
  }

  private resolveTestPointTokens(
    region: RegionDocumentLike,
    sceneTokens: TokenLike[],
  ): TokenLike[] {
    if (typeof region.testPoint !== "function") return [];

    return uniqueTokens(
      sceneTokens.filter((token) => {
        if (!token.actor) return false;

        const sampledPoints = sampleTokenPoints(token);
        if (sampledPoints.length === 0) return false;

        const elevation = getTokenElevation(token);
        return sampledPoints.some((point) => region.testPoint?.({
          x: point.x,
          y: point.y,
          elevation,
          z: elevation,
        }) === true);
      }),
    );
  }

  private resolveTokenDocumentTargets(
    region: RegionDocumentLike,
    sceneTokens: TokenLike[],
  ): TokenLike[] {
    return uniqueTokens(
      sceneTokens.filter((token) => {
        if (!token.actor) return false;
        if (typeof token.document?.testInsideRegion !== "function") return false;

        const elevation = getTokenElevation(token);
        return token.document.testInsideRegion(region, {
          elevation,
          z: elevation,
        });
      }),
    );
  }

  private resolveLineGeometryTokens(
    region: RegionDocumentLike,
    sceneTokens: TokenLike[],
  ): TokenLike[] {
    const line = getRegionLineGeometry(region, this.foundryAdapter.getGridSize() ?? FALLBACK_GRID_SIZE);
    if (!line) return [];

    return uniqueTokens(
      sceneTokens.filter((token) => {
        if (!token.actor) return false;

        const sampledPoints = sampleTokenPoints(token);
        if (sampledPoints.length === 0) return false;

        return sampledPoints.some(
          (point) => distancePointToSegment(point, line.origin, line.destination) <= line.width / 2,
        );
      }),
    );
  }
}

type RegionLineGeometry = {
  origin: CanvasPointLike;
  destination: CanvasPointLike;
  width: number;
};

const FALLBACK_GRID_SIZE = 100;

function getRegionLineGeometry(region: RegionDocumentLike, gridSize: number): RegionLineGeometry | null {
  const shape = getRegionLineShape(region);
  if (!shape) return null;

  const x = getFiniteNumber(shape.x);
  const y = getFiniteNumber(shape.y);
  const length = getFiniteNumber(shape.length);
  const direction = getFiniteNumber(shape.direction) ?? getFiniteNumber(shape.rotation) ?? 0;

  if (x === null || y === null || length === null || length <= 0) return null;

  const directionRadians = degreesToRadians(direction);
  const origin = { x, y };

  return {
    origin,
    destination: {
      x: origin.x + Math.cos(directionRadians) * length,
      y: origin.y + Math.sin(directionRadians) * length,
    },
    width: getUsefulLineWidth(getFiniteNumber(shape.width), gridSize),
  };
}

function getRegionLineShape(region: RegionDocumentLike): RegionShapeDataLike | null {
  const shapes = getRegionShapes(region);
  return shapes.find((shape) => shape.type === "line") ?? null;
}

function getRegionShapes(region: RegionDocumentLike): RegionShapeDataLike[] {
  const objectShapes = region.toObject?.().shapes;
  if (Array.isArray(objectShapes)) return objectShapes;
  return Array.isArray(region.shapes) ? region.shapes : [];
}

function getUsefulLineWidth(width: number | null, gridSize: number): number {
  return width !== null && width >= gridSize ? width : gridSize;
}

function degreesToRadians(degrees: number): number {
  return degrees * (Math.PI / 180);
}

function resolveTokenFromRegionEntry(entry: unknown, sceneTokens: TokenLike[]): TokenLike | null {
  const objectToken = getObjectToken(entry);
  if (objectToken?.actor) return objectToken;

  const entryId = getStringProperty(entry, "id");
  const entryUuid = getStringProperty(entry, "uuid");

  return sceneTokens.find((token) => {
    if (token.document === entry) return true;
    if (entryId && (token.id === entryId || token.document?.id === entryId)) return true;
    if (entryUuid && (token.uuid === entryUuid || token.document?.uuid === entryUuid)) return true;
    return false;
  }) ?? null;
}

function getObjectToken(value: unknown): TokenLike | null {
  if (!value || typeof value !== "object") return null;

  const candidate = value as { object?: unknown };
  const object = candidate.object;

  if (isTokenLike(object)) return object;
  if (isTokenLike(value)) return value;
  return null;
}

function isTokenLike(value: unknown): value is TokenLike {
  if (!value || typeof value !== "object") return false;
  const candidate = value as Partial<TokenLike>;
  return Boolean(candidate.actor || candidate.document || candidate.id || candidate.uuid);
}

function sampleTokenPoints(token: TokenLike): CanvasPointLike[] {
  const bounds = getTokenBounds(token);
  const center = getTokenCenter(token, bounds);

  if (!bounds || !center) return center ? [center] : [];

  const left = bounds.x;
  const right = bounds.x + bounds.width;
  const top = bounds.y;
  const bottom = bounds.y + bounds.height;
  const middleX = bounds.x + bounds.width / 2;
  const middleY = bounds.y + bounds.height / 2;

  return [
    center,
    { x: left, y: top },
    { x: right, y: top },
    { x: right, y: bottom },
    { x: left, y: bottom },
    { x: middleX, y: top },
    { x: right, y: middleY },
    { x: middleX, y: bottom },
    { x: left, y: middleY },
  ];
}

function getTokenBounds(token: TokenLike): { x: number; y: number; width: number; height: number } | null {
  if (isFiniteBounds(token.bounds)) {
    return {
      x: token.bounds.x,
      y: token.bounds.y,
      width: token.bounds.width,
      height: token.bounds.height,
    };
  }

  const x = getFiniteNumber(token.document?.x);
  const y = getFiniteNumber(token.document?.y);
  const width = getFiniteNumber(token.w ?? token.document?.width);
  const height = getFiniteNumber(token.h ?? token.document?.height);

  if (x === null || y === null || width === null || height === null) return null;
  return { x, y, width, height };
}

function getTokenCenter(
  token: TokenLike,
  bounds: { x: number; y: number; width: number; height: number } | null,
): CanvasPointLike | null {
  if (isFinitePoint(token.center)) {
    return {
      x: token.center.x,
      y: token.center.y,
    };
  }

  if (!bounds) return null;
  return {
    x: bounds.x + bounds.width / 2,
    y: bounds.y + bounds.height / 2,
  };
}

function getTokenElevation(token: TokenLike): number {
  return getFiniteNumber(token.document?.elevation) ?? getFiniteNumber(token.elevation) ?? 0;
}

function uniqueTokens(tokens: TokenLike[]): TokenLike[] {
  const seen = new Set<string>();

  return tokens.filter((token) => {
    const key = token.uuid ?? token.id ?? token.document?.uuid ?? token.document?.id ?? token.name;
    if (!key) return true;
    if (seen.has(key)) return false;

    seen.add(key);
    return true;
  });
}

function distancePointToSegment(point: CanvasPointLike, start: CanvasPointLike, end: CanvasPointLike): number {
  const segmentX = end.x - start.x;
  const segmentY = end.y - start.y;
  const lengthSquared = segmentX * segmentX + segmentY * segmentY;

  if (lengthSquared <= 0) {
    return distanceBetweenPoints(point, start);
  }

  const projected =
    ((point.x - start.x) * segmentX + (point.y - start.y) * segmentY) / lengthSquared;
  const clampedProjection = Math.max(0, Math.min(1, projected));
  const closest = {
    x: start.x + clampedProjection * segmentX,
    y: start.y + clampedProjection * segmentY,
  };

  return distanceBetweenPoints(point, closest);
}

function distanceBetweenPoints(left: CanvasPointLike, right: CanvasPointLike): number {
  return Math.hypot(left.x - right.x, left.y - right.y);
}

function getStringProperty(value: unknown, key: string): string | null {
  if (!value || typeof value !== "object") return null;
  const property = (value as Record<string, unknown>)[key];
  return typeof property === "string" && property.length > 0 ? property : null;
}

function isFiniteBounds(value: unknown): value is { x: number; y: number; width: number; height: number } {
  if (!value || typeof value !== "object") return false;
  const candidate = value as { x?: unknown; y?: unknown; width?: unknown; height?: unknown };
  return (
    getFiniteNumber(candidate.x) !== null &&
    getFiniteNumber(candidate.y) !== null &&
    getFiniteNumber(candidate.width) !== null &&
    getFiniteNumber(candidate.height) !== null
  );
}

function isFinitePoint(value: unknown): value is CanvasPointLike {
  if (!value || typeof value !== "object") return false;
  const candidate = value as { x?: unknown; y?: unknown };
  return getFiniteNumber(candidate.x) !== null && getFiniteNumber(candidate.y) !== null;
}

function getFiniteNumber(value: unknown): number | null {
  return typeof value === "number" && Number.isFinite(value) ? value : null;
}
