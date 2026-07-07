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

  warn(message: string): void {
    ui.notifications?.warn(`Paranormal Toolkit: ${message}`);
  }
}
