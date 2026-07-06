import type { CanvasPoint, LineAreaPlacementResult } from "./area-targeting-types";
import { FoundryAreaTargetingAdapter } from "./foundry-area-targeting-adapter";

const SVG_NAMESPACE = "http://www.w3.org/2000/svg";

export class LineAreaPlacementService {
  constructor(
    private readonly foundryAdapter = new FoundryAreaTargetingAdapter(),
  ) {}

  async placeLine(): Promise<LineAreaPlacementResult> {
    const canvasState = this.foundryAdapter.validateCanvasState();

    if (!canvasState.ok) {
      return {
        status: "failed",
        reason: canvasState.reason,
        message: canvasState.message,
      };
    }

    this.foundryAdapter.showPlacementInstruction();

    return new Promise((resolve) => {
      const overlay = createOverlay();
      const line = createPreviewLine();
      let origin: CanvasPoint | null = null;
      let isSettled = false;

      overlay.append(line);
      document.body.append(overlay);

      const cleanup = (): void => {
        overlay.removeEventListener("pointerdown", onPointerDown);
        overlay.removeEventListener("pointermove", onPointerMove);
        overlay.removeEventListener("contextmenu", onContextMenu);
        window.removeEventListener("keydown", onKeyDown, true);
        overlay.remove();
      };

      const settle = (result: LineAreaPlacementResult): void => {
        if (isSettled) return;
        isSettled = true;
        cleanup();
        resolve(result);
      };

      const cancel = (): void => {
        settle({ status: "cancelled", reason: "user-cancelled" });
      };

      const onPointerDown = (event: PointerEvent): void => {
        event.preventDefault();
        event.stopPropagation();

        if (event.button !== 0) {
          cancel();
          return;
        }

        const point = createPointFromPointerEvent(event);

        if (!origin) {
          origin = point;
          updatePreviewLine(line, origin, point);
          return;
        }

        settle({
          status: "confirmed",
          line: {
            origin,
            destination: point,
          },
        });
      };

      const onPointerMove = (event: PointerEvent): void => {
        if (!origin) return;
        event.preventDefault();
        updatePreviewLine(line, origin, createPointFromPointerEvent(event));
      };

      const onContextMenu = (event: MouseEvent): void => {
        event.preventDefault();
        event.stopPropagation();
        cancel();
      };

      const onKeyDown = (event: KeyboardEvent): void => {
        if (event.key !== "Escape") return;
        event.preventDefault();
        event.stopPropagation();
        cancel();
      };

      overlay.addEventListener("pointerdown", onPointerDown);
      overlay.addEventListener("pointermove", onPointerMove);
      overlay.addEventListener("contextmenu", onContextMenu);
      window.addEventListener("keydown", onKeyDown, true);
    });
  }
}

function createOverlay(): SVGSVGElement {
  const overlay = document.createElementNS(SVG_NAMESPACE, "svg");
  overlay.setAttribute("aria-label", "Prévia de linha de seleção de alvos");
  overlay.setAttribute("role", "application");
  overlay.style.position = "fixed";
  overlay.style.inset = "0";
  overlay.style.zIndex = "10000";
  overlay.style.width = "100vw";
  overlay.style.height = "100vh";
  overlay.style.cursor = "crosshair";
  overlay.style.pointerEvents = "auto";
  overlay.style.background = "rgba(0, 0, 0, 0.04)";
  return overlay;
}

function createPreviewLine(): SVGLineElement {
  const line = document.createElementNS(SVG_NAMESPACE, "line");
  line.setAttribute("stroke", "#f0a24a");
  line.setAttribute("stroke-width", "4");
  line.setAttribute("stroke-linecap", "round");
  line.setAttribute("stroke-dasharray", "10 6");
  line.setAttribute("filter", "drop-shadow(0 1px 2px rgba(0, 0, 0, 0.55))");
  return line;
}

function createPointFromPointerEvent(event: PointerEvent): CanvasPoint {
  return {
    x: event.clientX,
    y: event.clientY,
  };
}

function updatePreviewLine(line: SVGLineElement, origin: CanvasPoint, destination: CanvasPoint): void {
  line.setAttribute("x1", String(origin.x));
  line.setAttribute("y1", String(origin.y));
  line.setAttribute("x2", String(destination.x));
  line.setAttribute("y2", String(destination.y));
}
