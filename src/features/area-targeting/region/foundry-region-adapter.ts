export type FoundryRegionPlacementState =
  | { ok: true }
  | { ok: false; reason: "canvas-unavailable" | "scene-unavailable" | "region-layer-unavailable"; message: string };

export class FoundryRegionAdapter {
  canPlaceRegions(): FoundryRegionPlacementState {
    if (!canvas || canvas.ready !== true) {
      return {
        ok: false,
        reason: "canvas-unavailable",
        message: "Canvas não está pronto para selecionar alvos por Region.",
      };
    }

    if (!canvas.scene) {
      return {
        ok: false,
        reason: "scene-unavailable",
        message: "Nenhuma cena ativa para selecionar alvos por Region.",
      };
    }

    if (typeof canvas.regions?.placeRegion !== "function") {
      return {
        ok: false,
        reason: "region-layer-unavailable",
        message: "A camada de Regions do Foundry não está disponível para selecionar alvos.",
      };
    }

    return { ok: true };
  }

  async placeRegion(
    data: RegionDataLike,
    options: RegionPlacementOptionsLike = {},
  ): Promise<RegionDocumentLike | null> {
    return canvas?.regions?.placeRegion(data, options) ?? null;
  }

  getSceneTokens(): TokenLike[] {
    return canvas?.tokens?.placeables ?? [];
  }

  getUserTargetIds(): string[] {
    return Array.from(game.user?.targets ?? []).flatMap((token) => {
      const id = token.id ?? token.document?.id ?? null;
      return id ? [id] : [];
    });
  }

  updateUserTargets(targetIds: string[]): void {
    game.user?.updateTokenTargets?.(targetIds);
    game.user?.broadcastActivity?.({ targets: targetIds });
  }

  getGridSize(): number | null {
    const size = canvas?.grid?.size;
    return typeof size === "number" && Number.isFinite(size) && size > 0 ? size : null;
  }

  getUserColor(): string | null {
    const color = game.user?.color;
    return typeof color === "string" && color.length > 0 ? color : null;
  }

  warn(message: string): void {
    ui.notifications?.warn(`Paranormal Toolkit: ${message}`);
  }

  error(message: string): void {
    ui.notifications?.error(`Paranormal Toolkit: ${message}`);
  }
}
