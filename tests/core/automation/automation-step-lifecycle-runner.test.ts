import { describe, expect, it, vi } from "vitest";
import { failure, success } from "../../../src/core/result";
import {
  getAutomationGenericStepLifecyclePhases,
  runAutomationStepWithGenericLifecycle
} from "../../../src/core/automation/automation-step-lifecycle-runner";
import type { AutomationStep } from "../../../src/core/automation/automation-definition";
import type { WorkflowContext } from "../../../src/core/workflow/workflow-context";
import type { WorkflowHookEmitter } from "../../../src/core/workflow/workflow-hook-emitter";

function createContext(): WorkflowContext {
  return {
    id: "workflow-1",
    sourceActor: { id: "actor-1", name: "Mercy" } as Actor,
    sourceToken: null,
    item: { id: "item-1", name: "Item", type: "ability" } as Item,
    targets: [],
    phases: [],
    lifecycleEvents: [],
    rollRequests: {},
    rolls: {},
    ritualCosts: [],
    damageInstances: [],
    healingInstances: [],
    resourceTransactions: [],
    flags: {}
  };
}

function createLifecycle(): WorkflowHookEmitter {
  return { emit: vi.fn() } as unknown as WorkflowHookEmitter;
}

describe("getAutomationGenericStepLifecyclePhases", () => {
  it("retorna lifecycle de custo para gasto de recurso", () => {
    const step: AutomationStep = {
      type: "spendResource",
      actor: "self",
      resource: "PE",
      amount: 1
    };

    expect(getAutomationGenericStepLifecyclePhases(step)).toEqual({
      before: ["beforeCost", "spendCost"],
      after: ["afterCost"]
    });
  });

  it("retorna lifecycle de chat para chatCard", () => {
    expect(getAutomationGenericStepLifecyclePhases({ type: "chatCard" })).toEqual({
      before: ["beforeChat", "chat"],
      after: []
    });
  });

  it("não cria lifecycle genérico para rollFormula", () => {
    expect(getAutomationGenericStepLifecyclePhases({ type: "rollFormula", id: "roll", formula: "1d20" })).toEqual({
      before: [],
      after: []
    });
  });
});

describe("runAutomationStepWithGenericLifecycle", () => {
  it("emite fases antes e depois quando execução tem sucesso", async () => {
    const context = createContext();
    const lifecycle = createLifecycle();
    const step: AutomationStep = {
      type: "spendResource",
      actor: "self",
      resource: "PE",
      amount: 1
    };
    const execute = vi.fn().mockResolvedValue(success(undefined));

    const result = await runAutomationStepWithGenericLifecycle({
      step,
      context,
      stepIndex: 2,
      lifecycle,
      execute
    });

    expect(result.ok).toBe(true);
    expect(execute).toHaveBeenCalledOnce();
    expect(lifecycle.emit).toHaveBeenNthCalledWith(1, "beforeCost", context, { stepIndex: 2, step });
    expect(lifecycle.emit).toHaveBeenNthCalledWith(2, "spendCost", context, { stepIndex: 2, step });
    expect(lifecycle.emit).toHaveBeenNthCalledWith(3, "afterCost", context, { stepIndex: 2, step });
  });

  it("não emite fases after quando execução falha", async () => {
    const context = createContext();
    const lifecycle = createLifecycle();
    const step: AutomationStep = {
      type: "spendResource",
      actor: "self",
      resource: "PE",
      amount: 1
    };
    const execute = vi.fn().mockResolvedValue(failure({ reason: "erro" }));

    const result = await runAutomationStepWithGenericLifecycle({
      step,
      context,
      stepIndex: 1,
      lifecycle,
      execute
    });

    expect(result.ok).toBe(false);
    expect(lifecycle.emit).toHaveBeenCalledTimes(2);
  });
});
