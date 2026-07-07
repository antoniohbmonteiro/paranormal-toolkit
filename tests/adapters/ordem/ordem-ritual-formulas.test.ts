import { describe, expect, it } from "vitest";
import { calculateParanormalCostDifficulty } from "../../../src/adapters/ordem/ordem-ritual-formulas";

describe("calculateParanormalCostDifficulty", () => {
  it("calcula a DT do Custo do Paranormal como 20 + PE", () => {
    expect(calculateParanormalCostDifficulty(3)).toBe(23);
  });

  it("trunca custo decimal defensivamente", () => {
    expect(calculateParanormalCostDifficulty(3.9)).toBe(23);
  });

  it("não reduz a DT abaixo de 20 para custo negativo", () => {
    expect(calculateParanormalCostDifficulty(-2)).toBe(20);
  });
});
