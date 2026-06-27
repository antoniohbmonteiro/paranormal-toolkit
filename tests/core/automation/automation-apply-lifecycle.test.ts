import { describe, expect, it, vi } from "vitest";
import {
  createAutomationApplyMetadata,
  emitAutomationApplyCompletedLifecycle,
  emitAutomationApplyStartLifecycle
} from "../../../src/core/automation/automation-apply-lifecycle";
import type { ModifyResourceStep } from "../../../src/core/automation/automation-definition";
import type { WorkflowContext } from "../../../src/core/workflow/workflow-context";
import type { WorkflowHookEmitter } from "../../../src/core/workflow/workflow-hook-emitter";

function createActor(): Actor {
  return {
    id: "actor-1",
    name: "Mercy"
  } as Actor;
}

function createItem(): Item {
  return {
    id: "item-1",
    name: "Cicatrização",
    type: "ritual"
  } as Item;
}

function createContext(): WorkflowContext {
  return {
    id: "workflow-1",
    sourceActor: createActor(),
    sourceToken: null,
    item: createItem(),
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
        sourceStepIndex: 1,
        total: 8,
        roll: {} as Roll
      },
      healing: {
        id: "healing",
        formula: "2d8+2",
        intent: "healing",
        sourceStepIndex: 1,
        total: 12,
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
  return {
    emit: vi.fn()
  } as unknown as WorkflowHookEmitter;
}

describe("createAutomationApplyMetadata", () => {
  it("inclui dados do step e da rolagem referenciada", () => {
    const context = createContext();
    const step: ModifyResourceStep = {
      type: "modifyResource",
      actor: "target",
      resource: "PV",
      operation: "damage",
      amountFrom: "damage.total"
    };

    const metadata = createAutomationApplyMetadata(step, context, 8);

    expect(metadata).toEqual({
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

  it("usa rollId null quando amount fixo é usado", () => {
    const context = createContext();
    const step: ModifyResourceStep = {
      type: "modifyResource",
      actor: "self",
      resource: "SAN",
      operation: "recover",
      amount: 3
    };

    const metadata = createAutomationApplyMetadata(step, context, 3);

    expect(metadata).toMatchObject({
      actorSelector: "self",
      resource: "SAN",
      operation: "recover",
      amount: 3,
      rollId: null
    });
  });
});

describe("emitAutomationApplyStartLifecycle", () => {
  it("emite lifecycle completo de dano na ordem esperada", () => {
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

    emitAutomationApplyStartLifecycle({ lifecycle, context, step, stepIndex: 2, metadata });

    expect(lifecycle.emit).toHaveBeenCalledTimes(6);
    expect(lifecycle.emit).toHaveBeenNthCalledWith(1, "beforeApply", context, { stepIndex: 2, step, metadata });
    expect(lifecycle.emit).toHaveBeenNthCalledWith(2, "beforeApplyDamage", context, { stepIndex: 2, step, metadata });
    expect(lifecycle.emit).toHaveBeenNthCalledWith(3, "beforeDamageResolution", context, { stepIndex: 2, step, metadata });
    expect(lifecycle.emit).toHaveBeenNthCalledWith(4, "damageResolution", context, { stepIndex: 2, step, metadata });
    expect(lifecycle.emit).toHaveBeenNthCalledWith(5, "apply", context, { stepIndex: 2, step, metadata });
    expect(lifecycle.emit).toHaveBeenNthCalledWith(6, "applyDamage", context, { stepIndex: 2, step, metadata });
  });

  it("emite lifecycle de cura sem fases de resolução de dano", () => {
    const context = createContext();
    const lifecycle = createLifecycle();
    const step: ModifyResourceStep = {
      type: "modifyResource",
      actor: "target",
      resource: "PV",
      operation: "heal",
      amountFrom: "healing.total"
    };
    const metadata = createAutomationApplyMetadata(step, context, 12);

    emitAutomationApplyStartLifecycle({ lifecycle, context, step, stepIndex: 3, metadata });

    expect(lifecycle.emit).toHaveBeenCalledTimes(4);
    expect(lifecycle.emit).toHaveBeenNthCalledWith(1, "beforeApply", context, { stepIndex: 3, step, metadata });
    expect(lifecycle.emit).toHaveBeenNthCalledWith(2, "beforeApplyHealing", context, { stepIndex: 3, step, metadata });
    expect(lifecycle.emit).toHaveBeenNthCalledWith(3, "apply", context, { stepIndex: 3, step, metadata });
    expect(lifecycle.emit).toHaveBeenNthCalledWith(4, "applyHealing", context, { stepIndex: 3, step, metadata });
  });

  it("emite lifecycle genérico para operações sem fase específica", () => {
    const context = createContext();
    const lifecycle = createLifecycle();
    const step: ModifyResourceStep = {
      type: "modifyResource",
      actor: "self",
      resource: "SAN",
      operation: "recover",
      amount: 3
    };
    const metadata = createAutomationApplyMetadata(step, context, 3);

    emitAutomationApplyStartLifecycle({ lifecycle, context, step, stepIndex: 4, metadata });

    expect(lifecycle.emit).toHaveBeenCalledTimes(2);
    expect(lifecycle.emit).toHaveBeenNthCalledWith(1, "beforeApply", context, { stepIndex: 4, step, metadata });
    expect(lifecycle.emit).toHaveBeenNthCalledWith(2, "apply", context, { stepIndex: 4, step, metadata });
  });
});

describe("emitAutomationApplyCompletedLifecycle", () => {
  it("emite afterApply", () => {
    const context = createContext();
    const lifecycle = createLifecycle();
    const step: ModifyResourceStep = {
      type: "modifyResource",
      actor: "target",
      resource: "PV",
      operation: "heal",
      amountFrom: "healing.total"
    };
    const metadata = createAutomationApplyMetadata(step, context, 12);

    emitAutomationApplyCompletedLifecycle({ lifecycle, context, step, stepIndex: 5, metadata });

    expect(lifecycle.emit).toHaveBeenCalledTimes(1);
    expect(lifecycle.emit).toHaveBeenCalledWith("afterApply", context, { stepIndex: 5, step, metadata });
  });
});
