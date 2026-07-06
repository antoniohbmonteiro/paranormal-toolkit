import type { WorkflowTarget } from "../../../core/workflow/workflow-context";
import { createWorkflowTargetFromToken } from "../../automation/workflow-target-resolver";
import { FoundryRegionAdapter } from "./foundry-region-adapter";
import type { RegionTargetResolutionResult } from "./region-targeting-types";

export class RegionTargetResolver {
  constructor(
    private readonly foundryAdapter = new FoundryRegionAdapter(),
  ) {}

  resolveTargets(region: RegionDocumentLike): RegionTargetResolutionResult {
    const sceneTokens = this.foundryAdapter.getSceneTokens();
    const regionTokens = this.resolveRegionTokens(region, sceneTokens);

    if (regionTokens.length > 0) {
      return {
        targets: regionTokens.map(createWorkflowTargetFromToken),
        source: "regionTokens",
      };
    }

    return {
      targets: this.resolveTestPointTokens(region, sceneTokens).map(createWorkflowTargetFromToken),
      source: "testPoint",
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
        }) === true);
      }),
    );
  }
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
