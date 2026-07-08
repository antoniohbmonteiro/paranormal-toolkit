import { describe, expect, it } from "vitest";
import {
  createRitualRollAutomationDefinition,
  RITUAL_ROLL_CONFIG_FLAG_KEY,
  RITUAL_ROLL_CONFIG_ROLL_ID,
  type RitualRollConfig,
} from "../../../../src/features/rituals/config/ritual-roll-config";

describe("createRitualRollAutomationDefinition", () => {
  it("aceita fórmula apenas em formas avançadas sem exigir fórmula no Padrão", () => {
    const definition = createRitualRollAutomationDefinition(
      createRitualItem({
        config: createRollConfig({
          base: "",
          discente: "4d6",
          verdadeiro: "8d6",
        }),
        studentForm: true,
        trueForm: true,
      }),
    );

    expect(definition).not.toBeNull();

    const rollStep = definition?.steps.find((step) => step.type === "rollFormula");

    expect(rollStep?.formula).toBe("4d6");
    expect(definition?.ritualForms?.base?.rollFormulaOverrides?.[RITUAL_ROLL_CONFIG_ROLL_ID]).toBe("");
    expect(definition?.ritualForms?.discente?.rollFormulaOverrides?.[RITUAL_ROLL_CONFIG_ROLL_ID]).toBe("4d6");
    expect(definition?.ritualForms?.verdadeiro?.rollFormulaOverrides?.[RITUAL_ROLL_CONFIG_ROLL_ID]).toBe("8d6");
  });

  it("ignora fórmulas de formas indisponíveis no item", () => {
    const definition = createRitualRollAutomationDefinition(
      createRitualItem({
        config: createRollConfig({
          base: "",
          discente: "4d6",
          verdadeiro: "",
        }),
        studentForm: false,
        trueForm: false,
      }),
    );

    expect(definition).toBeNull();
  });
});

function createRollConfig(forms: {
  base: string;
  discente: string;
  verdadeiro: string;
}): RitualRollConfig {
  return {
    schemaVersion: 1,
    intent: "damage",
    damageType: "energy",
    utilityLabel: "Resultado",
    note: "",
    forms: {
      base: { formula: forms.base },
      discente: { formula: forms.discente },
      verdadeiro: { formula: forms.verdadeiro },
    },
  };
}

function createRitualItem(input: {
  config: RitualRollConfig;
  studentForm: boolean;
  trueForm: boolean;
}): Item {
  return {
    name: "Ritual teste",
    type: "ritual",
    system: {
      studentForm: input.studentForm,
      trueForm: input.trueForm,
    },
    getFlag: (_scope: string, key: string) => {
      return key === RITUAL_ROLL_CONFIG_FLAG_KEY ? input.config : undefined;
    },
  } as unknown as Item;
}
