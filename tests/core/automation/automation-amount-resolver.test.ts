import { describe, expect, it } from "vitest";
import {
  getRollIdFromAmountSource,
  resolveAutomationAmount
} from "../../../src/core/automation/automation-amount-resolver";
import type { WorkflowContext } from "../../../src/core/workflow/workflow-context";

function createContextWithRoll(total: number): Pick<WorkflowContext, "rolls"> {
  return {
    rolls: {
      healing: {
        id: "healing",
        formula: "2d8+2",
        intent: "healing",
        sourceStepIndex: 0,
        total,
        roll: {} as Roll
      }
    }
  };
}

describe("resolveAutomationAmount", () => {
  it("retorna amount fixo vÃ¡lido", () => {
    const result = resolveAutomationAmount({ amount: 3 }, createContextWithRoll(10));

    expect(result.ok).toBe(true);
    if (result.ok) expect(result.value).toBe(3);
  });

  it("falha quando amount Ã© zero", () => {
    const result = resolveAutomationAmount({ amount: 0 }, createContextWithRoll(10));

    expect(result.ok).toBe(false);
    if (!result.ok) expect(result.error.reason).toBe("invalid-amount-source");
  });

  it("falha quando amount Ã© decimal", () => {
    const result = resolveAutomationAmount({ amount: 1.5 }, createContextWithRoll(10));

    expect(result.ok).toBe(false);
    if (!result.ok) expect(result.error.reason).toBe("invalid-amount-source");
  });

  it("falha quando amount Ã© negativo", () => {
    const result = resolveAutomationAmount({ amount: -1 }, createContextWithRoll(10));

    expect(result.ok).toBe(false);
    if (!result.ok) expect(result.error.reason).toBe("invalid-amount-source");
  });

  it("resolve amount a partir de roll.total", () => {
    const result = resolveAutomationAmount({ amountFrom: "healing.total" }, createContextWithRoll(12));

    expect(result.ok).toBe(true);
    if (result.ok) expect(result.value).toBe(12);
  });

  it("trunca total decimal mantendo o comportamento atual", () => {
    const result = resolveAutomationAmount({ amountFrom: "healing.total" }, createContextWithRoll(12.9));

    expect(result.ok).toBe(true);
    if (result.ok) expect(result.value).toBe(12);
  });

  it("falha quando amountFrom usa formato invÃ¡lido", () => {
    const result = resolveAutomationAmount({ amountFrom: "healing.value" }, createContextWithRoll(12));

    expect(result.ok).toBe(false);
    if (!result.ok) expect(result.error.reason).toBe("invalid-amount-source");
  });

  it("falha quando amountFrom referencia roll inexistente", () => {
    const result = resolveAutomationAmount({ amountFrom: "damage.total" }, createContextWithRoll(12));

    expect(result.ok).toBe(false);
    if (!result.ok) expect(result.error.reason).toBe("missing-roll-result");
  });

  it("falha quando total da rolagem resulta em amount zero", () => {
    const result = resolveAutomationAmount({ amountFrom: "healing.total" }, createContextWithRoll(0));

    expect(result.ok).toBe(false);
    if (!result.ok) expect(result.error.reason).toBe("invalid-amount-source");
  });

  it("falha quando nenhum amount Ã© informado", () => {
    const result = resolveAutomationAmount({}, createContextWithRoll(12));

    expect(result.ok).toBe(false);
    if (!result.ok) expect(result.error.reason).toBe("invalid-amount-source");
  });
});

describe("getRollIdFromAmountSource", () => {
  it("extrai rollId de amountFrom vÃ¡lido", () => {
    expect(getRollIdFromAmountSource("healing.total")).toBe("healing");
  });

  it("aceita hÃ­fen e underline no rollId", () => {
    expect(getRollIdFromAmountSource("ritual_healing-1.total")).toBe("ritual_healing-1");
  });

  it("retorna null para formatos invÃ¡lidos", () => {
    expect(getRollIdFromAmountSource("healing.value")).toBeNull();
    expect(getRollIdFromAmountSource(undefined)).toBeNull();
  });
});
