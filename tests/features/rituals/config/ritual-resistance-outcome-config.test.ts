import { describe, expect, it } from "vitest";
import {
  createDefaultRitualResistanceOutcomesConfig,
  createRitualRollAutomationDefinitionWithOutcomes,
  normalizeRitualResistanceOutcomesConfig,
  RITUAL_RESISTANCE_OUTCOME_CONFIG_FLAG_KEY,
  withRitualResistanceOutcomeConditions,
  type RitualResistanceOutcomesConfig,
} from "../../../../src/features/rituals/config/ritual-resistance-outcome-config";
import {
  RITUAL_ROLL_CONFIG_FLAG_KEY,
  type RitualRollConfig,
} from "../../../../src/features/rituals/config/ritual-roll-config";

const EMPTY_OUTCOMES = createDefaultRitualResistanceOutcomesConfig();

describe("normalizeRitualResistanceOutcomesConfig", () => {
  it("normaliza aliases, remove duplicatas e descarta condições desconhecidas", () => {
    const config = normalizeRitualResistanceOutcomesConfig({
      schemaVersion: 1,
      outcomes: {
        success: {
          conditions: [
            { conditionId: "Vulnerável", rounds: "2" },
            { conditionId: "vulnerable", rounds: 5 },
            { conditionId: "condição inexistente", rounds: 1 },
          ],
        },
        failure: {
          conditions: [{ conditionId: "fatigued", rounds: 0 }],
        },
      },
    });

    expect(config).toEqual({
      schemaVersion: 1,
      outcomes: {
        success: {
          conditions: [{ conditionId: "vulnerable", rounds: 2 }],
        },
        failure: {
          conditions: [{ conditionId: "fatigued", rounds: null }],
        },
      },
    });
  });

  it("aceita resultados ausentes como listas vazias", () => {
    expect(normalizeRitualResistanceOutcomesConfig({ schemaVersion: 1 })).toEqual(
      EMPTY_OUTCOMES,
    );
  });
});

describe("createRitualRollAutomationDefinitionWithOutcomes", () => {
  it("adiciona condições distintas para sucesso e falha em ritual genérico com dano", () => {
    const definition = createRitualRollAutomationDefinitionWithOutcomes(
      createRitualItem({
        rollConfig: createRollConfig("2d6"),
        outcomeConfig: createOutcomeConfig({
          success: [{ conditionId: "vulnerable", rounds: 1 }],
          failure: [{ conditionId: "fatigued", rounds: 2 }],
        }),
        resistance: "nullifies",
        skillResis: "will",
      }),
    );

    expect(definition?.conditionApplications).toEqual([
      expect.objectContaining({
        actor: "target",
        conditionId: "vulnerable",
        label: "Sucesso · Vulnerável",
        duration: { rounds: 1 },
        applyOnResistance: "success",
      }),
      expect.objectContaining({
        actor: "target",
        conditionId: "fatigued",
        label: "Falha · Fatigado",
        duration: { rounds: 2 },
        applyOnResistance: "failure",
      }),
    ]);
  });

  it("mantém condições em ritual sem fórmula quando a resistência existe", () => {
    const definition = createRitualRollAutomationDefinitionWithOutcomes(
      createRitualItem({
        rollConfig: null,
        outcomeConfig: createOutcomeConfig({
          success: [],
          failure: [{ conditionId: "vulnerable", rounds: null }],
        }),
        resistance: "partial",
        skillResis: "resilience",
      }),
    );

    expect(definition?.steps).toEqual([{ type: "spendRitualCost" }]);
    expect(definition?.conditionApplications).toEqual([
      expect.objectContaining({
        conditionId: "vulnerable",
        duration: null,
        applyOnResistance: "failure",
      }),
    ]);
  });

  it("ignora efeitos configurados quando o item não possui resistência válida", () => {
    const definition = createRitualRollAutomationDefinitionWithOutcomes(
      createRitualItem({
        rollConfig: createRollConfig("2d6"),
        outcomeConfig: createOutcomeConfig({
          success: [],
          failure: [{ conditionId: "vulnerable", rounds: 1 }],
        }),
      }),
    );

    expect(definition).not.toBeNull();
    expect(definition?.conditionApplications).toBeUndefined();
  });
});

describe("withRitualResistanceOutcomeConditions", () => {
  it("preserva aplicações já existentes ao adicionar as configurações genéricas", () => {
    const item = createRitualItem({
      rollConfig: null,
      outcomeConfig: createOutcomeConfig({
        success: [],
        failure: [{ conditionId: "vulnerable", rounds: 1 }],
      }),
      resistance: "nullifies",
      skillResis: "will",
    });

    const definition = withRitualResistanceOutcomeConditions(item, {
      version: 1,
      label: "Teste",
      steps: [{ type: "spendRitualCost" }],
      resistance: {
        skill: "will",
        label: "Vontade",
        effect: "nullifies",
        summary: "Vontade anula",
      },
      conditionApplications: [
        {
          id: "existing",
          actor: "target",
          conditionId: "shaken",
        },
      ],
    });

    expect(definition.conditionApplications?.map((entry) => entry.id)).toEqual([
      "existing",
      "generic-ritual-resistance-failure-1-vulnerable",
    ]);
  });
});

function createRollConfig(baseFormula: string): RitualRollConfig {
  return {
    schemaVersion: 1,
    intent: "damage",
    damageType: "energy",
    utilityLabel: "Resultado",
    note: "",
    forms: {
      base: { formula: baseFormula },
      discente: { formula: "" },
      verdadeiro: { formula: "" },
    },
  };
}

function createOutcomeConfig(input: {
  success: Array<{ conditionId: string; rounds: number | null }>;
  failure: Array<{ conditionId: string; rounds: number | null }>;
}): RitualResistanceOutcomesConfig {
  return {
    schemaVersion: 1,
    outcomes: {
      success: { conditions: input.success },
      failure: { conditions: input.failure },
    },
  };
}

function createRitualItem(input: {
  rollConfig: RitualRollConfig | null;
  outcomeConfig: RitualResistanceOutcomesConfig | null;
  resistance?: string;
  skillResis?: string;
}): Item {
  return {
    id: "ritual-test",
    name: "Ritual teste",
    type: "ritual",
    system: {
      studentForm: false,
      trueForm: false,
      resistance: input.resistance,
      skillResis: input.skillResis,
    },
    getFlag: (_scope: string, key: string) => {
      if (key === RITUAL_ROLL_CONFIG_FLAG_KEY) {
        return input.rollConfig ?? undefined;
      }
      if (key === RITUAL_RESISTANCE_OUTCOME_CONFIG_FLAG_KEY) {
        return input.outcomeConfig ?? undefined;
      }
      return undefined;
    },
  } as unknown as Item;
}
