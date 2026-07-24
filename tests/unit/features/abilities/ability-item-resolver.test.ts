import { describe, expect, it } from "vitest";
import { isPassiveActivation } from "../../../../src/features/abilities/ability-item-resolver";

describe("isPassiveActivation", () => {
  it.each(["passive", "Passiva", "Habilidade passiva"]) (
    "recognizes %s as passive",
    (activation) => {
      expect(isPassiveActivation(activation)).toBe(true);
    },
  );

  it.each(["Livre", "Padrão", "Movimento", "Reação"]) (
    "does not classify %s as passive",
    (activation) => {
      expect(isPassiveActivation(activation)).toBe(false);
    },
  );
});
