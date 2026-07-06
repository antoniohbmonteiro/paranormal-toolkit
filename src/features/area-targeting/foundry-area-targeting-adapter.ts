import type { WorkflowTarget } from "../../core/workflow/workflow-context";
import { createWorkflowTargetFromToken } from "../automation/workflow-target-resolver";
import type { CanvasPoint, ScreenPoint } from "./area-targeting-types";

export type FoundryAreaTargetingCanvasState =
  | { ok: true }
  | { ok: false; reason: "canvas-unavailable" | "scene-unavailable"; message: string };

export type AreaTargetingTokenGeometry = {
  center: CanvasPoint;
  bounds: {
    x: number;
    y: number;
    width: number;
    height: number;
  };
};

export type AreaTargetingToken = {
  token: TokenLike;
  target: WorkflowTarget;
  geometry: AreaTargetingTokenGeometry;
};

export class FoundryAreaTargetingAdapter {
  validateCanvasState(): FoundryAreaTargetingCanvasState {
    if (!canvas || canvas.ready !== true) {
      return {
        ok: false,
        reason: "canvas-unavailable",
        message: "Canvas não está pronto para selecionar alvos por linha.",
      };
    }

    if (!canvas.scene) {
      return {
        ok: false,
        reason: "scene-unavailable",
        message: "Nenhuma cena ativa para selecionar alvos por linha.",
      };
    }

    return { ok: true };
  }

  screenPointToCanvasPoint(screenPoint: ScreenPoint): CanvasPoint | null {
    const stage = canvas?.stage;
    if (!stage) return null;

    const rendererPoint = this.toRendererPoint(screenPoint);
    const convertedPoint = stage.toLocal(rendererPoint);

    if (!isFinitePoint(convertedPoint)) return null;

    return {
      x: convertedPoint.x,
      y: convertedPoint.y,
    };
  }

  getLineTargetingTokens(): AreaTargetingToken[] {
    const tokens = canvas?.tokens?.placeables ?? [];

    return tokens.flatMap((token) => {
      if (!token.actor) return [];

      const geometry = getTokenGeometry(token);
      if (!geometry) return [];

      return [
        {
          token,
          target: createWorkflowTargetFromToken(token),
          geometry,
        },
      ];
    });
  }

  getGridSize(): number | null {
    const size = canvas?.grid?.size;
    return typeof size === "number" && Number.isFinite(size) && size > 0 ? size : null;
  }

  showPlacementInstruction(): void {
    ui.notifications?.info("Trace a linha na cena para selecionar os alvos.");
  }

  warn(message: string): void {
    ui.notifications?.warn(`Paranormal Toolkit: ${message}`);
  }

  private toRendererPoint(screenPoint: ScreenPoint): CanvasPoint {
    const canvasElement = getCanvasElement();
    if (!canvasElement) return screenPoint;

    const bounds = canvasElement.getBoundingClientRect();
    return {
      x: screenPoint.x - bounds.left,
      y: screenPoint.y - bounds.top,
    };
  }
}

function getCanvasElement(): HTMLElement | null {
  const candidate = canvas?.app?.view ?? canvas?.app?.canvas ?? canvas?.app?.renderer?.view;
  return candidate instanceof HTMLElement ? candidate : null;
}

function getTokenGeometry(token: TokenLike): AreaTargetingTokenGeometry | null {
  const bounds = getTokenBounds(token);
  const center = getTokenCenter(token, bounds);

  if (!bounds || !center) return null;

  return { bounds, center };
}

function getTokenBounds(token: TokenLike): AreaTargetingTokenGeometry["bounds"] | null {
  const bounds = token.bounds;
  if (isFiniteBounds(bounds)) {
    return {
      x: bounds.x,
      y: bounds.y,
      width: bounds.width,
      height: bounds.height,
    };
  }

  const document = token.document;
  const x = getFiniteNumber(document?.x);
  const y = getFiniteNumber(document?.y);
  const width = getFiniteNumber(token.w ?? document?.width);
  const height = getFiniteNumber(token.h ?? document?.height);

  if (x === null || y === null || width === null || height === null) return null;
  return { x, y, width, height };
}

function getTokenCenter(
  token: TokenLike,
  bounds: AreaTargetingTokenGeometry["bounds"] | null,
): CanvasPoint | null {
  const center = token.center;
  if (isFinitePoint(center)) {
    return {
      x: center.x,
      y: center.y,
    };
  }

  if (!bounds) return null;
  return {
    x: bounds.x + bounds.width / 2,
    y: bounds.y + bounds.height / 2,
  };
}

function isFiniteBounds(value: unknown): value is AreaTargetingTokenGeometry["bounds"] {
  if (!value || typeof value !== "object") return false;
  const candidate = value as Partial<AreaTargetingTokenGeometry["bounds"]>;
  return (
    getFiniteNumber(candidate.x) !== null &&
    getFiniteNumber(candidate.y) !== null &&
    getFiniteNumber(candidate.width) !== null &&
    getFiniteNumber(candidate.height) !== null
  );
}

function getFiniteNumber(value: unknown): number | null {
  return typeof value === "number" && Number.isFinite(value) ? value : null;
}

function isFinitePoint(value: unknown): value is CanvasPoint {
  if (!value || typeof value !== "object") return false;
  const candidate = value as Partial<CanvasPoint>;
  return getFiniteNumber(candidate.x) !== null && getFiniteNumber(candidate.y) !== null;
}
