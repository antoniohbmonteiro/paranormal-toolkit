import { describe, expect, it, vi } from "vitest";
import { MODULE_ID } from "../../../src/constants";
import { readAutomationDefinition } from "../../../src/features/automation/automation-flag-reader";

function createItemWithAutomationFlag(flagValue: unknown): Item {
  return {
    name: "Item de teste",
    getFlag: vi.fn((moduleId: string, key: string) => {
      if (moduleId === MODULE_ID && key === "automation") return flagValue;
      return undefined;
    })
  } as unknown as Item;
}

function createValidDefinition() {
  return {
    version: 1,
    label: "Automação de teste",
    steps: [
      {
        type: "rollFormula",
        id: "healing",
        formula: "2d8+2",
        intent: "healing"
      },
      {
        type: "modifyResource",
        actor: "target",
        resource: "PV",
        operation: "heal",
        amountFrom: "healing.total"
      }
    ]
  };
}

function createValidPresetFlag() {
  return {
    schemaVersion: 1,
    source: {
      type: "preset",
      presetId: "ritual.cicatrizacao",
      presetVersion: "1.0.0",
      appliedAt: "2026-01-01T00:00:00.000Z",
      appliedBy: null
    },
    definition: createValidDefinition()
  };
}

describe("readAutomationDefinition", () => {
  it("retorna missing-automation quando o item não possui flag de automação", () => {
    const item = createItemWithAutomationFlag(undefined);

    const result = readAutomationDefinition(item);

    expect(result.ok).toBe(false);
    if (result.ok) return;

    expect(result.error.reason).toBe("missing-automation");
    expect(result.error.message).toContain("não possui automação");
  });

  it("rejeita o formato legado gravado diretamente como AutomationDefinition", () => {
    const legacyFlag = {
      version: 1,
      label: "Formato antigo",
      steps: []
    };
    const item = createItemWithAutomationFlag(legacyFlag);

    const result = readAutomationDefinition(item);

    expect(result.ok).toBe(false);
    if (result.ok) return;

    expect(result.error.reason).toBe("invalid-automation");
    expect(result.error.value).toBe(legacyFlag);
  });

  it("retorna a definition quando a flag de preset é válida", () => {
    const flag = createValidPresetFlag();
    const item = createItemWithAutomationFlag(flag);

    const result = readAutomationDefinition(item);

    expect(result.ok).toBe(true);
    if (!result.ok) return;

    expect(result.value).toEqual(flag.definition);
  });

  it("aceita automação manual com source válido", () => {
    const definition = createValidDefinition();
    const flag = {
      schemaVersion: 1,
      source: {
        type: "manual",
        label: "Automação manual",
        appliedAt: "2026-01-01T00:00:00.000Z",
        appliedBy: "user-id"
      },
      definition
    };
    const item = createItemWithAutomationFlag(flag);

    const result = readAutomationDefinition(item);

    expect(result.ok).toBe(true);
    if (!result.ok) return;

    expect(result.value).toEqual(definition);
  });

  it("rejeita source de preset incompleto", () => {
    const flag = {
      ...createValidPresetFlag(),
      source: {
        type: "preset",
        presetId: "ritual.cicatrizacao",
        presetVersion: "1.0.0"
      }
    };
    const item = createItemWithAutomationFlag(flag);

    const result = readAutomationDefinition(item);

    expect(result.ok).toBe(false);
    if (result.ok) return;

    expect(result.error.reason).toBe("invalid-automation");
  });

  it("rejeita rollFormula sem fórmula", () => {
    const flag = {
      ...createValidPresetFlag(),
      definition: {
        version: 1,
        label: "Automação inválida",
        steps: [
          {
            type: "rollFormula",
            id: "healing"
          }
        ]
      }
    };
    const item = createItemWithAutomationFlag(flag);

    const result = readAutomationDefinition(item);

    expect(result.ok).toBe(false);
    if (result.ok) return;

    expect(result.error.reason).toBe("invalid-automation");
  });

  it("rejeita modifyResource sem amount nem amountFrom", () => {
    const flag = {
      ...createValidPresetFlag(),
      definition: {
        version: 1,
        label: "Automação inválida",
        steps: [
          {
            type: "modifyResource",
            actor: "target",
            resource: "PV",
            operation: "heal"
          }
        ]
      }
    };
    const item = createItemWithAutomationFlag(flag);

    const result = readAutomationDefinition(item);

    expect(result.ok).toBe(false);
    if (result.ok) return;

    expect(result.error.reason).toBe("invalid-automation");
  });

  it("rejeita spendResource que tenta gastar recurso de alvo", () => {
    const flag = {
      ...createValidPresetFlag(),
      definition: {
        version: 1,
        label: "Automação inválida",
        steps: [
          {
            type: "spendResource",
            actor: "target",
            resource: "PE",
            amount: 1
          }
        ]
      }
    };
    const item = createItemWithAutomationFlag(flag);

    const result = readAutomationDefinition(item);

    expect(result.ok).toBe(false);
    if (result.ok) return;

    expect(result.error.reason).toBe("invalid-automation");
  });
});
