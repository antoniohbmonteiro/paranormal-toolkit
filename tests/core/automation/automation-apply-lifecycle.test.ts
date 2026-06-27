import { describe, expect, it, vi } from "vitest";
import {
  createAutomationApplyMetadata,
  emitAutomationApplyAfterLifecycle,
  emitAutomationApplyBeforeLifecycle,
  emitAutomationApplyLifecycle
} from "../../../src/core/automation/automation-apply-lifecycle";
import type { ModifyResourceStep } from "../../../src/core/automation/automation-definition";
import type { WorkflowContext } from "../../../src/core/workflow/workflow-context";
import type { WorkflowHookEmitter } from "../../../src/core/workflow/workflow-hook-emitter";

function createContext(): WorkflowContext {
  return {
    id: "workflow-1",
    sourceActor: { id: "actor-1", name: "Mercy" } as Actor,
    sourceToken: null,
    item: { id: "item-1", name: "Cicatrização", type: "ritual" } as Item,
    targets: [],
    phases: [],
    lifecycleEvents: [],
    rollRequests: {},
    rolls: {
      damage: {
        id: "damage",
        formula: "2d6",
        intent: "damage",
        damageType: "sangue",
        total: 8,
        roll: {} as Roll
      }
    },
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

describe("createAutomationApplyMetadata", () => {
  it("inclui dados da rolagem quando amountFrom aponta para roll.total", () => {
    const step: ModifyResourceStep = {
      type: "modifyResource",
      actor: "target",
      resource: "PV",
      operation: "damage",
      amountFrom: "damage.total"
    };

    expect(createAutomationApplyMetadata(step, createContext(), 8)).toEqual({
      actorSelector: "target",
      resource: "PV",
      operation: "damage",
      amount: 8,
      amountFrom: "damage.total",
      rollId: "damage",
      rollIntent: "damage",
      damageType: "sangue"
    });
  });

  it("mantém rollId null quando amount fixo é usado", () => {
    const step: ModifyResourceStep = {
      type: "modifyResource",
      actor: "self",
      resource: "SAN",
      operation: "recover",
      amount: 3
    };

    expect(createAutomationApplyMetadata(step, createContext(), 3)).toMatchObject({
      actorSelector: "self",
      amount: 3,
      rollId: null
    });
  });
});

describe("automation apply lifecycle", () => {
  it("emite fases de dano antes da aplicação", () => {
    const context = createContext();
    const lifecycle = createLifecycle();
    const step: ModifyResourceStep = {
      type: "modifyResource",
      actor: "target",
      resource: "PV",
      operation: "damage",
      amountFrom: "damage.total"
    };
    const metadata = createAutomationApplyMetadata(step, context, 8);

    emitAutomationApplyBeforeLifecycle({ step, context, stepIndex: 2, metadata, lifecycle });

    expect(lifecycle.emit).toHaveBeenNthCalledWith(1, "beforeApply", context, { stepIndex: 2, step, metadata });
    expect(lifecycle.emit).toHaveBeenNthCalledWith(2, "beforeApplyDamage", context, { stepIndex: 2, step, metadata });
    expect(lifecycle.emit).toHaveBeenNthCalledWith(3, "beforeDamageResolution", context, { stepIndex: 2, step, metadata });
    expect(lifecycle.emit).toHaveBeenNthCalledWith(4, "damageResolution", context, { stepIndex: 2, step, metadata });
  });

  it("emite fase apply e fase específica de cura", () => {
    const context = createContext();
    const lifecycle = createLifecycle();
    const step: ModifyResourceStep = {
      type: "modifyResource",
      actor: "target",
      resource: "PV",
      operation: "heal",
      amount: 5
    };
    const metadata = createAutomationApplyMetadata(step, context, 5);

    emitAutomationApplyLifecycle({ step, context, stepIndex: 1, metadata, lifecycle });

    expect(lifecycle.emit).toHaveBeenNthCalledWith(1, "apply", context, { stepIndex: 1, step, metadata });
    expect(lifecycle.emit).toHaveBeenNthCalledWith(2, "applyHealing", context, { stepIndex: 1, step, metadata });
  });

  it("emite afterApply", () => {
    const context = createContext();
    const lifecycle = createLifecycle();
    const step: ModifyResourceStep = {
      type: "modifyResource",
      actor: "target",
      resource: "PV",
      operation: "heal",
      amount: 5
    };
    const metadata = createAutomationApplyMetadata(step, context, 5);

    emitAutomationApplyAfterLifecycle({ step, context, stepIndex: 1, metadata, lifecycle });

    expect(lifecycle.emit).toHaveBeenCalledWith("afterApply", context, { stepIndex: 1, step, metadata });
  });
});
