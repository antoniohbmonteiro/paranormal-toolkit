import type { AutomationDefinition, AutomationStep } from "../../core/automation/automation-definition";
import type { AutomationPreset } from "../../core/automation/automation-preset";

export const RITUAL_COST_ONLY_PRESET_ID = "ritual.costOnly";
export const RITUAL_SIMPLE_HEALING_PRESET_ID = "ritual.simpleHealing";
export const RITUAL_SIMPLE_DAMAGE_PRESET_ID = "ritual.simpleDamage";
export const GENERIC_SIMPLE_HEALING_PRESET_ID = "generic.simpleHealing";

export function createBuiltInAutomationPresets(): AutomationPreset[] {
  return [
    createRitualCostOnlyPreset(),
    createRitualSimpleHealingPreset(),
    createRitualSimpleDamagePreset(),
    createGenericSimpleHealingPreset()
  ];
}

export function createRitualCostOnlyPreset(): AutomationPreset {
  return {
    id: RITUAL_COST_ONLY_PRESET_ID,
    version: "1.0.0",
    label: "Gasto de custo de ritual",
    description: "Calcula o custo do ritual pelo círculo e gasta o recurso configurado.",
    category: "ritual",
    itemTypes: ["ritual"],
    matchers: [],
    automation: {
      version: 1,
      label: "Gasto de custo de ritual",
      steps: [
        {
          type: "spendRitualCost"
        },
        {
          type: "chatCard",
          title: "Gasto de custo de ritual",
          message: "Calcula o custo do ritual pelo círculo e gasta o recurso configurado."
        }
      ]
    }
  };
}

export function createRitualSimpleHealingPreset(): AutomationPreset {
  return {
    id: RITUAL_SIMPLE_HEALING_PRESET_ID,
    version: "1.0.0",
    label: "Ritual de cura simples",
    description: "Gasta o custo do ritual, rola cura e recupera PV do alvo.",
    category: "ritual",
    itemTypes: ["ritual"],
    matchers: [
      {
        type: "normalizedName",
        names: ["cicatrizacao"]
      }
    ],
    automation: createRitualSimpleHealingDefinition()
  };
}

export function createRitualSimpleDamagePreset(): AutomationPreset {
  return {
    id: RITUAL_SIMPLE_DAMAGE_PRESET_ID,
    version: "1.0.0",
    label: "Ritual de dano simples",
    description: "Gasta o custo do ritual, rola dano e causa dano em PV do alvo.",
    category: "ritual",
    itemTypes: ["ritual"],
    matchers: [],
    automation: createRitualSimpleDamageDefinition()
  };
}

export function createGenericSimpleHealingPreset(): AutomationPreset {
  return {
    id: GENERIC_SIMPLE_HEALING_PRESET_ID,
    version: "1.0.0",
    label: "Cura simples de teste",
    description: "Gasta 1 PE, rola 1d8 e cura PV do alvo.",
    category: "generic",
    itemTypes: [],
    matchers: [],
    automation: {
      version: 1,
      label: "Cura simples de teste",
      steps: [
        {
          type: "spendResource",
          actor: "self",
          resource: "PE",
          amount: 1
        },
        {
          type: "rollFormula",
          id: "healing",
          formula: "1d8",
          intent: "healing"
        },
        {
          type: "modifyResource",
          actor: "target",
          resource: "PV",
          operation: "heal",
          amountFrom: "healing.total"
        },
        {
          type: "chatCard",
          title: "Cura simples de teste",
          message: "Gasta 1 PE, rola 1d8 e cura PV do alvo."
        }
      ]
    }
  };
}

export function createRitualSimpleHealingDefinition(formula = "1d8"): AutomationDefinition {
  return replaceRollFormula(
    {
      version: 1,
      label: "Ritual de cura simples",
      steps: [
        {
          type: "spendRitualCost"
        },
        {
          type: "rollFormula",
          id: "healing",
          formula: "1d8",
          intent: "healing"
        },
        {
          type: "modifyResource",
          actor: "target",
          resource: "PV",
          operation: "heal",
          amountFrom: "healing.total"
        },
        {
          type: "chatCard",
          title: "Ritual de cura simples",
          message: "Gasta o custo do ritual, rola a fórmula de cura e recupera PV do alvo."
        }
      ]
    },
    "healing",
    formula
  );
}

export function createRitualSimpleDamageDefinition(formula = "1d8"): AutomationDefinition {
  return replaceRollFormula(
    {
      version: 1,
      label: "Ritual de dano simples",
      steps: [
        {
          type: "spendRitualCost"
        },
        {
          type: "rollFormula",
          id: "damage",
          formula: "1d8",
          intent: "damage",
          damageType: "generic"
        },
        {
          type: "modifyResource",
          actor: "target",
          resource: "PV",
          operation: "damage",
          amountFrom: "damage.total"
        },
        {
          type: "chatCard",
          title: "Ritual de dano simples",
          message: "Gasta o custo do ritual, rola a fórmula de dano e causa dano em PV do alvo."
        }
      ]
    },
    "damage",
    formula
  );
}

function replaceRollFormula(definition: AutomationDefinition, rollId: string, formula: string): AutomationDefinition {
  return {
    ...definition,
    steps: definition.steps.map((step): AutomationStep => {
      if (step.type !== "rollFormula" || step.id !== rollId) return step;
      return {
        ...step,
        formula
      };
    })
  };
}
