import type { WorkflowTarget } from "../../core/workflow/workflow-context";
import type { LineAreaPlacement } from "./area-targeting-types";
import { FoundryAreaTargetingAdapter, type AreaTargetingToken } from "./foundry-area-targeting-adapter";

const FALLBACK_LINE_WIDTH = 25;

export type ResolveLineAreaTargetsInput = {
  line: LineAreaPlacement;
  width?: number | null;
};

export class LineAreaTargetResolver {
  constructor(
    private readonly foundryAdapter = new FoundryAreaTargetingAdapter(),
  ) {}

  resolveTargets(input: ResolveLineAreaTargetsInput): WorkflowTarget[] {
    const tokens = this.foundryAdapter.getLineTargetingTokens();
    const threshold = this.resolveLineWidth(input.width);

    return tokens
      .filter((token) => isTokenHitByLine(token, input.line, threshold))
      .map((token) => token.target);
  }

  private resolveLineWidth(configuredWidth: number | null | undefined): number {
    if (typeof configuredWidth === "number" && Number.isFinite(configuredWidth) && configuredWidth > 0) {
      return configuredWidth;
    }

    const gridSize = this.foundryAdapter.getGridSize();
    return gridSize ? Math.max(FALLBACK_LINE_WIDTH, gridSize / 2) : FALLBACK_LINE_WIDTH;
  }
}

function isTokenHitByLine(
  token: AreaTargetingToken,
  line: LineAreaPlacement,
  threshold: number,
): boolean {
  return getTokenSamplePoints(token).some(
    (point) => distanceToSegment(point, line.origin, line.destination) <= threshold,
  );
}

function getTokenSamplePoints(token: AreaTargetingToken): { x: number; y: number }[] {
  const { bounds, center } = token.geometry;
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

function distanceToSegment(
  point: { x: number; y: number },
  start: { x: number; y: number },
  end: { x: number; y: number },
): number {
  const segmentX = end.x - start.x;
  const segmentY = end.y - start.y;
  const segmentLengthSquared = segmentX * segmentX + segmentY * segmentY;

  if (segmentLengthSquared === 0) {
    return Math.hypot(point.x - start.x, point.y - start.y);
  }

  const projection = Math.max(
    0,
    Math.min(
      1,
      ((point.x - start.x) * segmentX + (point.y - start.y) * segmentY) / segmentLengthSquared,
    ),
  );
  const closestX = start.x + projection * segmentX;
  const closestY = start.y + projection * segmentY;

  return Math.hypot(point.x - closestX, point.y - closestY);
}
