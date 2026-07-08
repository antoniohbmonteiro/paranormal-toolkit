import { beforeEach, describe, expect, it, vi } from "vitest";
import { createRectangleRayAreaSnapshot } from "../../../src/core/public-api/ritual-event-builder";

function getProperty(value: unknown, path: string): unknown {
  if (!value || typeof value !== "object") return undefined;

  return path.split(".").reduce<unknown>((current, key) => {
    if (!current || typeof current !== "object") return undefined;
    return (current as Record<string, unknown>)[key];
  }, value);
}

describe("createRectangleRayAreaSnapshot", () => {
  beforeEach(() => {
    vi.stubGlobal("foundry", {
      utils: { getProperty },
    });
    vi.stubGlobal("canvas", {
      grid: { size: 100 },
      scene: { id: "scene-a" },
    });
  });

  it("preenche ray.start/end para linha horizontal", () => {
    const area = createRectangleRayAreaSnapshot({
      id: "region-a",
      parent: { id: "scene-a" },
      bounds: { x: 2300, y: 5800, width: 1200, height: 100 },
      shapes: [
        { type: "rectangle", x: 2300, y: 5800, width: 1200, height: 100, direction: 0, elevation: null },
      ],
    } as unknown as RegionDocumentLike);

    expect(area.ray.start).toEqual({ x: 2300, y: 5850 });
    expect(area.ray.end).toEqual({ x: 3500, y: 5850 });
  });

  it("infere ray.start/end quando o bounds está rotacionado mas shape.direction veio zerado", () => {
    const area = createRectangleRayAreaSnapshot({
      id: "region-a",
      parent: { id: "scene-a" },
      bounds: { x: 2413.4, y: 5750, width: 686.6, height: 1089.23 },
      shapes: [
        { type: "rectangle", x: 2500, y: 5750, width: 1200, height: 100, direction: 0, elevation: null },
      ],
    } as unknown as RegionDocumentLike);

    expect(area.shape.direction).toBeCloseTo(60, 1);
    expect(area.ray.start?.x).toBeCloseTo(2456.7, 1);
    expect(area.ray.start?.y).toBeCloseTo(5775, 1);
    expect(area.ray.end?.x).toBeCloseTo(3056.7, 1);
    expect(area.ray.end?.y).toBeCloseTo(6814.2, 1);
  });

  it("ignora toObject nulo ao procurar rotação da região", () => {
    const area = createRectangleRayAreaSnapshot({
      id: "region-a",
      parent: { id: "scene-a" },
      bounds: { x: 2300, y: 5800, width: 1200, height: 100 },
      shapes: [
        { type: "rectangle", x: 2300, y: 5800, width: 1200, height: 100, direction: 0, elevation: null },
      ],
      toObject: () => null,
    } as unknown as RegionDocumentLike);

    expect(area.ray.start).toEqual({ x: 2300, y: 5850 });
    expect(area.ray.end).toEqual({ x: 3500, y: 5850 });
  });

});
