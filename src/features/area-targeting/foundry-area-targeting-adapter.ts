import type { CanvasPoint, ScreenPoint } from "./area-targeting-types";

export type FoundryAreaTargetingCanvasState =
  | { ok: true }
  | { ok: false; reason: "canvas-unavailable" | "scene-unavailable"; message: string };

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

  showPlacementInstruction(): void {
    ui.notifications?.info("Trace a linha na cena para selecionar os alvos.");
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

function isFinitePoint(value: CanvasPoint): boolean {
  return Number.isFinite(value.x) && Number.isFinite(value.y);
}
