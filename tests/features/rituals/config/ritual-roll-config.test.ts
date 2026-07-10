import { describe, expect, it } from "vitest";
import {
  createResistanceFromRitualItem,
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

  it("mantém resistência em ritual de utilidade", () => {
    const definition = createRitualRollAutomationDefinition(
      createRitualItem({
        config: {
          ...createRollConfig({ base: "1d20", discente: "", verdadeiro: "" }),
          intent: "utility",
          damageType: null,
        },
        resistance: "nullifies",
        skillResis: "will",
        studentForm: false,
        trueForm: false,
      }),
    );

    expect(definition?.resistance).toMatchObject({
      skill: "will",
      label: "Vontade",
      effect: "nullifies",
      summary: "Vontade anula",
    });
    expect(definition?.steps.some((step) => step.type === "modifyResource")).toBe(false);
  });

  it("cria definição manual quando o ritual só tem resistência", () => {
    const definition = createRitualRollAutomationDefinition(
      createRitualItem({
        config: null,
        resistance: "nullifies",
        skillResis: "will",
        studentForm: true,
        trueForm: true,
      }),
    );

    expect(definition).not.toBeNull();
    expect(definition?.steps).toEqual([{ type: "spendRitualCost" }]);
    expect(definition?.resistance?.summary).toBe("Vontade anula");
    expect(definition?.ritualForms?.discente?.extraCost).toBe(2);
    expect(definition?.ritualForms?.verdadeiro?.extraCost).toBe(5);
  });
});

describe("createResistanceFromRitualItem", () => {
  it.each([
    ["resilience", "reducesByHalf", "Fortitude", "Fortitude reduz à metade"],
    ["reflexes", "partial", "Reflexos", "Reflexos parcial"],
    ["will", "nullifies", "Vontade", "Vontade anula"],
    ["will", "discredits", "Vontade", "Vontade desacredita"],
  ])(
    "lê %s + %s como resistência válida",
    (skillResis, resistance, label, summary) => {
      expect(
        createResistanceFromRitualItem(
          createRitualItem({
            config: null,
            skillResis,
            resistance,
            studentForm: false,
            trueForm: false,
          }),
        ),
      ).toMatchObject({ skill: skillResis, label, effect: resistance, summary });
    },
  );
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
  config: RitualRollConfig | null;
  studentForm: boolean;
  trueForm: boolean;
  resistance?: string;
  skillResis?: string;
}): Item {
  return {
    name: "Ritual teste",
    type: "ritual",
    system: {
      studentForm: input.studentForm,
      trueForm: input.trueForm,
      resistance: input.resistance,
      skillResis: input.skillResis,
    },
    getFlag: (_scope: string, key: string) => {
      return key === RITUAL_ROLL_CONFIG_FLAG_KEY ? input.config ?? undefined : undefined;
    },
  } as unknown as Item;
}
