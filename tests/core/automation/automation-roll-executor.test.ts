import { beforeEach, describe, expect, it } from "vitest";
import {
  createAutomationRollRequest,
  executeAutomationRollFormula,
  inferRollIntent
} from "../../../src/core/automation/automation-roll-executor";
import type { RollFormulaStep } from "../../../src/core/automation/automation-definition";
import type { WorkflowContext } from "../../../src/core/workflow/workflow-context";

class MockRoll {
  total: number | null = null;

  constructor(readonly formula: string) {}

  evaluate(): this {
    if (this.formula === "throw") {
      throw new Error("Falha simulada");
    }

    this.total = this.formula === "nan" ? Number.NaN : Number(this.formula);
    return this;
  }
}

function createRollContext(): Pick<WorkflowContext, "rollRequests" | "rolls"> {
  return {
    rollRequests: {},
    rolls: {}
  };
}

function createRollStep(overrides: Partial<RollFormulaStep> = {}): RollFormulaStep {
  return {
    type: "rollFormula",
    id: "healing",
    formula: "12",
    intent: "healing",
    ...overrides
  };
}

describe("executeAutomationRollFormula", () => {
  beforeEach(() => {
    Object.defineProperty(globalThis, "Roll", {
      configurable: true,
      value: MockRoll,
      writable: true
    });
  });

  it("executa a rolagem e registra o resultado no contexto", async () => {
    const context = createRollContext();
    const result = await executeAutomationRollFormula(createRollStep(), 2, context);

    expect(result.ok).toBe(true);
    expect(context.rolls.healing?.total).toBe(12);
    expect(context.rolls.healing?.intent).toBe("healing");
    expect(context.rolls.healing?.sourceStepIndex).toBe(2);
  });

  it("reutiliza rollRequest existente quando ele já foi criado pelo lifecycle", async () => {
    const context = createRollContext();
    context.rollRequests.healing = {
      id: "healing",
      formula: "12",
      intent: "damage",
      damageType: "sangue",
      sourceStepIndex: 5
    };

    const result = await executeAutomationRollFormula(createRollStep(), 2, context);

    expect(result.ok).toBe(true);
    expect(context.rolls.healing?.intent).toBe("damage");
    expect(context.rolls.healing?.damageType).toBe("sangue");
    expect(context.rolls.healing?.sourceStepIndex).toBe(5);
  });

  it("falha quando id está vazio", async () => {
    const result = await executeAutomationRollFormula(createRollStep({ id: "" }), 0, createRollContext());

    expect(result.ok).toBe(false);
    if (!result.ok) expect(result.error.reason).toBe("invalid-step");
  });

  it("falha quando formula está vazia", async () => {
    const result = await executeAutomationRollFormula(createRollStep({ formula: "" }), 0, createRollContext());

    expect(result.ok).toBe(false);
    if (!result.ok) expect(result.error.reason).toBe("invalid-step");
  });

  it("falha quando a rolagem não retorna total numérico finito", async () => {
    const result = await executeAutomationRollFormula(createRollStep({ formula: "nan" }), 0, createRollContext());

    expect(result.ok).toBe(false);
    if (!result.ok) expect(result.error.reason).toBe("roll-failed");
  });

  it("falha quando a avaliação da rolagem lança erro", async () => {
    const result = await executeAutomationRollFormula(createRollStep({ formula: "throw" }), 0, createRollContext());

    expect(result.ok).toBe(false);
    if (!result.ok) {
      expect(result.error.reason).toBe("roll-failed");
      expect(result.error.cause).toBeInstanceOf(Error);
    }
  });
});

describe("createAutomationRollRequest", () => {
  it("usa intent explícito quando informado", () => {
    const request = createAutomationRollRequest(createRollStep({ intent: "damage", damageType: "morte" }), 3);

    expect(request.intent).toBe("damage");
    expect(request.damageType).toBe("morte");
    expect(request.sourceStepIndex).toBe(3);
  });

  it("infere intent quando o step não informa", () => {
    const request = createAutomationRollRequest(createRollStep({ id: "dano", intent: undefined }), 1);

    expect(request.intent).toBe("damage");
  });
});

describe("inferRollIntent", () => {
  it("infere intents conhecidas por palavras-chave", () => {
    expect(inferRollIntent("damage")).toBe("damage");
    expect(inferRollIntent("cura")).toBe("healing");
    expect(inferRollIntent("ataque")).toBe("attack");
    expect(inferRollIntent("resistência")).toBe("resistance");
  });

  it("retorna generic quando não reconhece a intent", () => {
    expect(inferRollIntent("qualquer-coisa")).toBe("generic");
  });
});
