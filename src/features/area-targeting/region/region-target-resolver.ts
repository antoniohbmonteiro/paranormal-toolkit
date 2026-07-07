import type { WorkflowTarget } from "../../../core/workflow/workflow-context";
import { createWorkflowTargetFromToken } from "../../automation/workflow-target-resolver";
import { FoundryRegionAdapter } from "./foundry-region-adapter";
import type {
  RegionPlacementChange,
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


  resolvePreviewTargetTokens(change: RegionPlacementChange): RegionTargetTokenResolutionResult {
    const sceneTokens = this.foundryAdapter.getSceneTokens();
    const previewRegionTokens = change.preview?.document
      ? this.resolveRegionTokens(change.preview.document, sceneTokens)
      : null;

    if (previewRegionTokens !== null) {
      return { tokens: previewRegionTokens, source: "regionTokens" };
    }

    const documentRegionTokens = this.resolveRegionTokens(change.document, sceneTokens);
    if (documentRegionTokens !== null) {
      return { tokens: documentRegionTokens, source: "regionTokens" };
    }

    if (change.shape) {
      return {
        tokens: this.resolveShapeGeometryTokens(change.shape),
        source: "shapeGeometry",
      };
    }

    return this.resolveTargetTokens(change.document);
  }

  resolveTargetTokens(region: RegionDocumentLike): RegionTargetTokenResolutionResult {
    const sceneTokens = this.foundryAdapter.getSceneTokens();
    const regionTokens = this.resolveRegionTokens(region, sceneTokens);

    if (regionTokens !== null) {
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
      tokens: this.resolveShapeGeometryTokensFromRegion(region, sceneTokens),
      source: "shapeGeometry",
    };
  }

  private resolveRegionTokens(
    region: RegionDocumentLike,
    sceneTokens: TokenLike[],
  ): TokenLike[] | null {
    if (!region.tokens) return null;

    const regionTokenEntries = Array.from(region.tokens);

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

  private resolveShapeGeometryTokens(shape: RegionShapeDataLike): TokenLike[] {
    const sceneTokens = this.foundryAdapter.getSceneTokens();
    const gridSize = this.foundryAdapter.getGridSize() ?? FALLBACK_GRID_SIZE;

    if (shape.type === "rectangle") {
      const rectangle = getRegionRectangleShapeGeometry(shape);
      return rectangle ? resolvePolygonGeometryTokens(sceneTokens, rectangle) : [];
    }

    if (shape.type === "line") {
      const line = getRegionLineShapeGeometry(shape, gridSize);
      return line ? resolvePolygonGeometryTokens(sceneTokens, createLineAreaPolygon(line)) : [];
    }

    return [];
  }

  private resolveShapeGeometryTokensFromRegion(
    region: RegionDocumentLike,
    sceneTokens: TokenLike[],
  ): TokenLike[] {
    const shape = getRegionTargetingShape(region);
    if (!shape) return [];

    if (shape.type === "rectangle") {
      const rectangle = getRegionRectangleShapeGeometry(shape);
      return rectangle ? resolvePolygonGeometryTokens(sceneTokens, rectangle) : [];
    }

    const line = getRegionLineGeometry(region, this.foundryAdapter.getGridSize() ?? FALLBACK_GRID_SIZE);
    return line ? resolvePolygonGeometryTokens(sceneTokens, createLineAreaPolygon(line)) : [];
  }
}

type RegionLineGeometry = {
  origin: CanvasPointLike;
  destination: CanvasPointLike;
  width: number;
};

const FALLBACK_GRID_SIZE = 100;

function resolvePolygonGeometryTokens(sceneTokens: TokenLike[], areaPolygon: CanvasPointLike[]): TokenLike[] {
  return uniqueTokens(
    sceneTokens.filter((token) => {
      if (!token.actor) return false;

      const tokenBounds = getTokenDocumentBounds(token);
      if (!tokenBounds) return false;

      return polygonsIntersect(areaPolygon, createBoundsPolygon(tokenBounds));
    }),
  );
}

function createLineAreaPolygon(line: RegionLineGeometry): CanvasPointLike[] {
  const direction = normalizeVector({
    x: line.destination.x - line.origin.x,
    y: line.destination.y - line.origin.y,
  });
  const normal = { x: -direction.y, y: direction.x };
  const halfWidth = line.width / 2;
  const offset = { x: normal.x * halfWidth, y: normal.y * halfWidth };

  return [
    { x: line.origin.x + offset.x, y: line.origin.y + offset.y },
    { x: line.destination.x + offset.x, y: line.destination.y + offset.y },
    { x: line.destination.x - offset.x, y: line.destination.y - offset.y },
    { x: line.origin.x - offset.x, y: line.origin.y - offset.y },
  ];
}


function getRegionRectangleShapeGeometry(shape: RegionShapeDataLike): CanvasPointLike[] | null {
  const x = getFiniteNumber(shape.x);
  const y = getFiniteNumber(shape.y);
  const width = getFiniteNumber(shape.width);
  const height = getFiniteNumber(shape.height);
  const direction = getFiniteNumber(shape.direction) ?? getFiniteNumber(shape.rotation) ?? 0;

  if (x === null || y === null || width === null || height === null || width <= 0 || height <= 0) {
    return null;
  }

  return rotatePolygon(
    createBoundsPolygon({ x, y, width, height }),
    { x, y },
    degreesToRadians(direction),
  );
}

function rotatePolygon(
  polygon: CanvasPointLike[],
  origin: CanvasPointLike,
  radians: number,
): CanvasPointLike[] {
  const cosine = Math.cos(radians);
  const sine = Math.sin(radians);

  return polygon.map((point) => {
    const translatedX = point.x - origin.x;
    const translatedY = point.y - origin.y;

    return {
      x: origin.x + translatedX * cosine - translatedY * sine,
      y: origin.y + translatedX * sine + translatedY * cosine,
    };
  });
}

function createBoundsPolygon(bounds: { x: number; y: number; width: number; height: number }): CanvasPointLike[] {
  const left = bounds.x;
  const right = bounds.x + bounds.width;
  const top = bounds.y;
  const bottom = bounds.y + bounds.height;

  return [
    { x: left, y: top },
    { x: right, y: top },
    { x: right, y: bottom },
    { x: left, y: bottom },
  ];
}

function polygonsIntersect(left: CanvasPointLike[], right: CanvasPointLike[]): boolean {
  const axes = [...getPolygonAxes(left), ...getPolygonAxes(right)];

  return axes.every((axis) => projectionsOverlap(projectPolygon(left, axis), projectPolygon(right, axis)));
}

function getPolygonAxes(polygon: CanvasPointLike[]): CanvasPointLike[] {
  const axes: CanvasPointLike[] = [];

  for (let index = 0; index < polygon.length; index += 1) {
    const current = polygon[index];
    const next = polygon[(index + 1) % polygon.length];
    const edge = { x: next.x - current.x, y: next.y - current.y };
    axes.push(normalizeVector({ x: -edge.y, y: edge.x }));
  }

  return axes;
}

function projectPolygon(polygon: CanvasPointLike[], axis: CanvasPointLike): { min: number; max: number } {
  const projections = polygon.map((point) => point.x * axis.x + point.y * axis.y);
  return {
    min: Math.min(...projections),
    max: Math.max(...projections),
  };
}

function projectionsOverlap(left: { min: number; max: number }, right: { min: number; max: number }): boolean {
  return left.max >= right.min && right.max >= left.min;
}

function normalizeVector(vector: CanvasPointLike): CanvasPointLike {
  const length = Math.hypot(vector.x, vector.y);
  return length > 0 ? { x: vector.x / length, y: vector.y / length } : { x: 0, y: 0 };
}

function getRegionLineGeometry(region: RegionDocumentLike, gridSize: number): RegionLineGeometry | null {
  const shape = getRegionLineShape(region);
  return shape ? getRegionLineShapeGeometry(shape, gridSize) : null;
}

function getRegionLineShapeGeometry(shape: RegionShapeDataLike, gridSize: number): RegionLineGeometry | null {
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

function getRegionTargetingShape(region: RegionDocumentLike): RegionShapeDataLike | null {
  const shapes = getRegionShapes(region);
  return shapes.find((shape) => shape.type === "rectangle") ?? shapes.find((shape) => shape.type === "line") ?? null;
}

function getRegionLineShape(region: RegionDocumentLike): RegionShapeDataLike | null {
  const shape = getRegionTargetingShape(region);
  return shape?.type === "line" ? shape : null;
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

function getTokenDocumentBounds(token: TokenLike): { x: number; y: number; width: number; height: number } | null {
  const gridSize = getFiniteNumber(canvas?.grid?.size) ?? FALLBACK_GRID_SIZE;
  const x = getFiniteNumber(token.document?.x);
  const y = getFiniteNumber(token.document?.y);
  const documentWidth = getFiniteNumber(token.document?.width);
  const documentHeight = getFiniteNumber(token.document?.height);

  if (x !== null && y !== null && documentWidth !== null && documentHeight !== null) {
    return {
      x,
      y,
      width: documentWidth * gridSize,
      height: documentHeight * gridSize,
    };
  }

  return getTokenBounds(token);
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
