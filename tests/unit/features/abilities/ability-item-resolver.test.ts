import { afterEach, describe, expect, it, vi } from "vitest";
import {
  isPassiveActivation,
  resolveAbilityChatDescription,
  resolveAbilityUseData,
} from "../../../../src/features/abilities/ability-item-resolver";

afterEach(() => {
  vi.unstubAllGlobals();
});

describe("isPassiveActivation", () => {
  it.each(["passive", "Passiva", "Habilidade passiva"])(
    "recognizes %s as passive",
    (activation) => {
      expect(isPassiveActivation(activation)).toBe(true);
    },
  );

  it.each(["Livre", "Padrão", "Movimento", "Reação"])(
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

describe("resolveAbilityUseData", () => {
  it("resolves the formulas available for the actor NEX", () => {
    vi.stubGlobal("game", {
      settings: { get: () => false },
      i18n: { localize: (key: string) => key },
    });

    const actor = {
      name: "Agente",
      system: { NEX: { value: 40 } },
    } as unknown as Actor;
    const item = {
      type: "ability",
      name: "Ataque Furtivo",
      img: "ability.webp",
      system: {
        activation: "free",
        cost: 1,
        description: "Descrição",
      },
      getFlag: () => ({
        schemaVersion: 1,
        rolls: [
          {
            id: "damage",
            label: "Dano adicional",
            intent: "damage",
            damageType: "impact",
            formula: {
              mode: "nex",
              resolution: "highest-unlocked",
              steps: [
                { minNex: 10, formula: "1d6" },
                { minNex: 40, formula: "2d6" },
                { minNex: 65, formula: "3d6" },
              ],
            },
          },
        ],
      }),
    } as unknown as Item;

    const ability = resolveAbilityUseData(actor, item);

    expect(ability.rolls).toEqual([
      expect.objectContaining({
        label: "Dano adicional",
        formula: "2d6",
        nexThreshold: 40,
      }),
    ]);
  });
});
