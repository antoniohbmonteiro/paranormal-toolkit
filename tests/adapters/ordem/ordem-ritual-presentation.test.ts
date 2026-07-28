import { beforeEach, describe, expect, it, vi } from "vitest";
import { resolveOrdemRitualImage, resolveOrdemRitualMetadataPresentation, resolveOrdemRitualPresentation } from "../../../src/adapters/ordem/ordem-ritual-presentation";

beforeEach(() => vi.stubGlobal("foundry", { utils: { getProperty: (value: unknown, path: string) => path.split(".").reduce<unknown>((current, key) => current && typeof current === "object" ? (current as Record<string, unknown>)[key] : undefined, value) } }));
function ritual(element: unknown, circle: unknown): Item { return { type: "ritual", name: "Ritual", system: { element, circle } } as Item; }

describe("Ordem ritual presentation", () => {
  it.each([["energy", 1, "Energia"], ["energy", 2, "Energia"], ["death", 1, "Morte"], ["knowledge", 2, "Conhecimento"], ["blood", 3, "Sangue"], ["fear", 4, "Medo"]] as const)("resolves %s %s", (element, circle, label) => {
    expect(resolveOrdemRitualPresentation(ritual(element, circle))).toEqual({ elementKey: element, elementLabel: label, circle });
  });
  it("supports the real localized element key and circle fallback path", () => {
    const item = { type: "ritual", name: "Ritual", system: { element: "OP.ElementChoices.Energy", ritual: { circle: "2" } } } as Item;
    expect(resolveOrdemRitualPresentation(item)).toEqual({ elementKey: "energy", elementLabel: "Energia", circle: 2 });
  });
  it("falls back when circle is absent or element is unknown", () => {
    expect(resolveOrdemRitualPresentation(ritual("energy", undefined))).toBeNull();
    expect(resolveOrdemRitualPresentation(ritual("unknown", 1))).toBeNull();
  });
  it("resolves and normalizes the real item image", () => {
    expect(resolveOrdemRitualImage({ img: " icons/ritual.webp " } as Item)).toBe("icons/ritual.webp");
    expect(resolveOrdemRitualImage({ img: "   " } as Item)).toBeNull();
    expect(resolveOrdemRitualImage({} as Item)).toBeNull();
  });
  it("resolves execution, range and duration from the real item fields", () => {
    const item = { system: { execution: "default", range: "short", duration: "instantaneous" } } as Item;
    expect(resolveOrdemRitualMetadataPresentation(item)).toEqual({ execution: "Padrão", range: "Curto", duration: "Instantânea" });
  });
  it("supports Ordem's setDuration key", () => {
    expect(resolveOrdemRitualMetadataPresentation({ system: { duration: "setDuration" } } as Item).duration).toBe("Duração definida");
  });
});
