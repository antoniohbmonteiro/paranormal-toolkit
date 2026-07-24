import { describe, expect, it } from "vitest";
import {
  isPassiveActivation,
  resolveAbilityChatDescription,
} from "../../../../src/features/abilities/ability-item-resolver";

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


describe("resolveAbilityChatDescription", () => {
  it("prefers the dedicated chat description", () => {
    expect(
      resolveAbilityChatDescription(
        "<p>Resumo para o chat.</p>",
        "<p>Descrição completa.</p>",
      ),
    ).toBe("<p>Resumo para o chat.</p>");
  });

  it("falls back to the full description when the chat description is blank", () => {
    expect(
      resolveAbilityChatDescription("   ", "<p>Descrição completa.</p>"),
    ).toBe("<p>Descrição completa.</p>");
  });
});
