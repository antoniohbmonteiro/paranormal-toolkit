import type {
  AutomationDefinition,
  AutomationStep,
} from "../../core/automation/automation-definition";
import type {
  AutomationPreset,
  AutomationPresetItemPatch,
} from "../../core/automation/automation-preset";

export const RITUAL_COST_ONLY_PRESET_ID = "ritual.costOnly";
export const RITUAL_SIMPLE_HEALING_PRESET_ID = "ritual.simpleHealing";
export const RITUAL_ELECTROCUTION_PRESET_ID = "ritual.eletrocussao";
export const RITUAL_WITHER_PRESET_ID = "ritual.definhar";
export const RITUAL_SIMPLE_DAMAGE_PRESET_ID = "ritual.simpleDamage";
export const GENERIC_SIMPLE_HEALING_PRESET_ID = "generic.simpleHealing";

type RitualHealingFormulaSet = {
  base: string;
  discente: string;
  verdadeiro: string;
};

const CICATRIZATION_HEALING_FORMULAS: RitualHealingFormulaSet = {
  base: "3d8+3",
  discente: "5d8+5",
  verdadeiro: "7d8+7",
};

const AUTOMATED_RITUAL_DESCRIPTION = `
<p><strong>Paranormal Toolkit</strong></p>
<p>A descrição original foi substituída ao aplicar este preset de automação.</p>
<p>Você pode editar este campo livremente; a automação continua sendo controlada pelo módulo.</p>
`;

export function createBuiltInAutomationPresets(): AutomationPreset[] {
  return [
    createRitualCostOnlyPreset(),
    createRitualSimpleHealingPreset(),
    createRitualElectrocutionPreset(),
    createRitualWitherPreset(),
    createRitualSimpleDamagePreset(),
    createGenericSimpleHealingPreset(),
  ];
}

export function createRitualCostOnlyPreset(): AutomationPreset {
  return {
    id: RITUAL_COST_ONLY_PRESET_ID,
    version: "1.0.0",
    label: "Gasto de custo de ritual",
    description:
      "Calcula o custo do ritual pelo círculo e gasta o recurso configurado.",
    category: "ritual",
    itemTypes: ["ritual"],
    matchers: [],
    automation: {
      version: 1,
      label: "Gasto de custo de ritual",
      ritualForms: {
        base: {
          label: "Padrão",
        },
      },
      steps: [
        {
          type: "spendRitualCost",
        },
        {
          type: "chatCard",
          title: "Gasto de custo de ritual",
          message:
            "Calcula o custo do ritual pelo círculo e gasta o recurso configurado.",
        },
      ],
    },
  };
}

export function createRitualSimpleHealingPreset(): AutomationPreset {
  return {
    id: RITUAL_SIMPLE_HEALING_PRESET_ID,
    version: "1.1.0",
    label: "Cicatrização",
    description:
      "Gasta o custo do ritual, rola 3d8+3/5d8+5/7d8+7 de cura conforme a forma escolhida e recupera PV do alvo.",
    category: "ritual",
    itemTypes: ["ritual"],
    matchers: [
      {
        type: "normalizedName",
        names: ["cicatrizacao"],
      },
    ],
    automation: createRitualSimpleHealingDefinition(),
    itemPatch: createCicatrizationItemPatch(),
  };
}

export function createRitualElectrocutionPreset(): AutomationPreset {
  return {
    id: RITUAL_ELECTROCUTION_PRESET_ID,
    version: "1.4.1",
    label: "Eletrocussão",
    description:
      "Preset inicial de dano de eletricidade. Gasta o custo do ritual, rola 3d6/6d6/8d6 conforme a forma escolhida e prepara ações assistidas para aplicar dano via adapter do sistema e Vulnerável por 1 rodada no alvo.",
    category: "ritual",
    itemTypes: ["ritual"],
    matchers: [
      {
        type: "normalizedName",
        names: ["eletrocussao", "eletrocucao"],
      },
    ],
    automation: createRitualElectrocutionDefinition(),
    itemPatch: createElectrocutionItemPatch(),
  };
}


export function createRitualWitherPreset(): AutomationPreset {
  return {
    id: RITUAL_WITHER_PRESET_ID,
    version: "1.0.0",
    label: "Definhar",
    description:
      "Preset assistido da forma Padrão: gasta o custo do ritual, rola Fortitude e aplica Fatigado na falha ou Vulnerável no sucesso.",
    category: "ritual",
    itemTypes: ["ritual"],
    matchers: [
      {
        type: "normalizedName",
        names: ["definhar"],
      },
    ],
    automation: createRitualWitherDefinition(),
    itemPatch: createWitherItemPatch(),
  };
}

export function createRitualSimpleDamagePreset(): AutomationPreset {
  return {
    id: RITUAL_SIMPLE_DAMAGE_PRESET_ID,
    version: "1.0.0",
    label: "Ritual de dano simples",
    description:
      "Gasta o custo do ritual, rola dano e causa dano em PV do alvo.",
    category: "ritual",
    itemTypes: ["ritual"],
    matchers: [],
    automation: createRitualSimpleDamageDefinition(),
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
          amount: 1,
        },
        {
          type: "rollFormula",
          id: "healing",
          formula: "1d8",
          intent: "healing",
        },
        {
          type: "modifyResource",
          actor: "target",
          resource: "PV",
          operation: "heal",
          amountFrom: "healing.total",
        },
        {
          type: "chatCard",
          title: "Cura simples de teste",
          message: "Gasta 1 PE, rola 1d8 e cura PV do alvo.",
        },
      ],
    },
  };
}

export function createRitualSimpleHealingDefinition(
  formulas: string | Partial<RitualHealingFormulaSet> = CICATRIZATION_HEALING_FORMULAS,
): AutomationDefinition {
  const healingFormulas = resolveRitualHealingFormulaSet(formulas);

  return replaceRollFormula(
    {
      version: 1,
      label: "Cicatrização",
      ritualForms: {
        base: {
          label: "Padrão",
          rollFormulaOverrides: {
            healing: healingFormulas.base,
          },
        },
        discente: {
          label: "Discente",
          extraCost: 2,
          rollFormulaOverrides: {
            healing: healingFormulas.discente,
          },
        },
        verdadeiro: {
          label: "Verdadeiro",
          extraCost: 9,
          rollFormulaOverrides: {
            healing: healingFormulas.verdadeiro,
          },
        },
      },
      steps: [
        {
          type: "spendRitualCost",
        },
        {
          type: "rollFormula",
          id: "healing",
          formula: "1d8",
          intent: "healing",
        },
        {
          type: "modifyResource",
          actor: "target",
          resource: "PV",
          operation: "heal",
          amountFrom: "healing.total",
        },
        {
          type: "chatCard",
          title: "Cicatrização",
          message:
            "Gasta o custo do ritual, rola a fórmula de cura e recupera PV do alvo.",
        },
      ],
    },
    "healing",
    healingFormulas.base,
  );
}

function resolveRitualHealingFormulaSet(
  formulas: string | Partial<RitualHealingFormulaSet>,
): RitualHealingFormulaSet {
  if (typeof formulas === "string") {
    return {
      base: formulas,
      discente: formulas,
      verdadeiro: formulas,
    };
  }

  return {
    ...CICATRIZATION_HEALING_FORMULAS,
    ...formulas,
  };
}

export function createRitualElectrocutionDefinition(): AutomationDefinition {
  return {
    ...createRitualSimpleDamageDefinition("3d6", {
      label: "Eletrocussão",
      title: "Eletrocussão",
      damageType: "electric",
      message:
        "Gasta o custo do ritual, rola dano de eletricidade e prepara aplicação de dano em PV do alvo pelo adapter do sistema. Resistência deve ser resolvida manualmente por enquanto.",
    }),
    resistance: {
      skill: "resilience",
      label: "Fortitude",
      effect: "reducesByHalf",
      summary: "Fortitude reduz dano à metade.",
      damageApplications: [
        {
          id: "normal",
          label: "Dano normal",
          multiplier: 1,
        },
        {
          id: "half",
          label: "Metade",
          multiplier: 0.5,
          rounding: "floor",
          summary: "Use se o alvo resistiu.",
        },
      ],
    },
    conditionApplications: [
      {
        id: "eletrocussao-vulnerable",
        actor: "target",
        conditionId: "vulnerable",
        label: "Vulnerável",
        duration: {
          rounds: 1,
        },
        source: "ritual.eletrocussao",
        actionSectionId: "apply-effects",
        actionSectionTitle: "Aplicar efeito",
        executedLabel: "✓ Vulnerável aplicado",
      },
    ],
    ritualForms: {
      base: {
        label: "Padrão",
        rollFormulaOverrides: {
          damage: "3d6",
        },
      },
      discente: {
        label: "Discente",
        extraCost: 2,
        rollFormulaOverrides: {
          damage: "6d6",
        },
        targeting: {
          mode: "lineArea",
          label: "Linha",
          optionLabel: "Usar linha na cena",
          optional: true,
          defaultEnabled: true,
          template: {
            shape: "ray",
          },
        },
      },
      verdadeiro: {
        label: "Verdadeiro",
        extraCost: 5,
        rollFormulaOverrides: {
          damage: "8d6",
        },
        notes: [
          "Se o alvo falhar na Fortitude, aplique Atordoado por 1 rodada manualmente.",
        ],
      },
    },
  };
}


export function createRitualWitherDefinition(): AutomationDefinition {
  return {
    version: 1,
    label: "Definhar",
    ritualForms: {
      base: {
        label: "Padrão",
      },
    },
    resistance: {
      skill: "resilience",
      label: "Fortitude",
      effect: "reducesByHalf",
      summary: "Fortitude parcial: falha aplica Fatigado; sucesso aplica Vulnerável.",
    },
    conditionApplications: [
      {
        id: "definhar-fatigued",
        actor: "target",
        conditionId: "fatigued",
        label: "Fatigado",
        source: "ritual.definhar",
        actionSectionId: "apply-effects",
        actionSectionTitle: "Aplicar efeito",
        executedLabel: "✓ Fatigado aplicado",
        applyOnResistance: "failure",
      },
      {
        id: "definhar-vulnerable",
        actor: "target",
        conditionId: "vulnerable",
        label: "Vulnerável",
        source: "ritual.definhar",
        actionSectionId: "apply-effects",
        actionSectionTitle: "Aplicar efeito",
        executedLabel: "✓ Vulnerável aplicado",
        applyOnResistance: "success",
      },
    ],
    steps: [
      {
        type: "spendRitualCost",
      },
      {
        type: "chatCard",
        title: "Definhar",
        message:
          "Gasta o custo do ritual e prepara aplicação assistida de condição conforme a resistência do alvo.",
      },
    ],
  };
}

export function createRitualSimpleDamageDefinition(
  formula = "1d8",
  options: {
    label?: string;
    title?: string;
    damageType?: string;
    message?: string;
  } = {},
): AutomationDefinition {
  const label = options.label ?? "Ritual de dano simples";
  const title = options.title ?? "Ritual de dano simples";
  const damageType = options.damageType ?? "generic";
  const message =
    options.message ??
    "Gasta o custo do ritual, rola a fórmula de dano e causa dano em PV do alvo.";

  return replaceRollFormula(
    {
      version: 1,
      label,
      ritualForms: {
        base: {
          label: "Padrão",
          rollFormulaOverrides: {
            damage: formula,
          },
        },
      },
      steps: [
        {
          type: "spendRitualCost",
        },
        {
          type: "rollFormula",
          id: "damage",
          formula: "1d8",
          intent: "damage",
          damageType,
        },
        {
          type: "modifyResource",
          actor: "target",
          resource: "PV",
          operation: "damage",
          amountFrom: "damage.total",
        },
        {
          type: "chatCard",
          title,
          message,
        },
      ],
    },
    "damage",
    formula,
  );
}

function createCicatrizationItemPatch(): AutomationPresetItemPatch {
  return {
    kind: "ritual",
    name: "Cicatrização",
    descriptionHtml: AUTOMATED_RITUAL_DESCRIPTION,
    ritual: {
      circle: 1,
      element: "death",
      execution: "default",
      range: "touch",
      target: "creatures",
      targetQuantity: "1",
      duration: "instantaneous",
      resistanceSkill: "",
      resistance: "",
      studentForm: true,
      trueForm: true,
    },
  };
}


function createWitherItemPatch(): AutomationPresetItemPatch {
  return {
    kind: "ritual",
    name: "Definhar",
    descriptionHtml: AUTOMATED_RITUAL_DESCRIPTION,
    ritual: {
      circle: 1,
      element: "death",
      execution: "default",
      range: "medium",
      target: "creatures",
      targetQuantity: "1",
      duration: "instantaneous",
      resistanceSkill: "resilience",
      resistance: "reducesByHalf",
      studentForm: false,
      trueForm: false,
    },
  };
}

function createElectrocutionItemPatch(): AutomationPresetItemPatch {
  return {
    kind: "ritual",
    name: "Eletrocussão",
    descriptionHtml: AUTOMATED_RITUAL_DESCRIPTION,
    ritual: {
      circle: 1,
      element: "energy",
      execution: "default",
      range: "medium",
      target: "creatures",
      targetQuantity: "1",
      duration: "instantaneous",
      resistanceSkill: "resilience",
      resistance: "reducesByHalf",
      studentForm: true,
      trueForm: true,
    },
  };
}

function replaceRollFormula(
  definition: AutomationDefinition,
  rollId: string,
  formula: string,
): AutomationDefinition {
  return {
    ...definition,
    steps: definition.steps.map((step): AutomationStep => {
      if (step.type !== "rollFormula" || step.id !== rollId) return step;
      return {
        ...step,
        formula,
      };
    }),
  };
}
