import { describe, expect, it, vi } from "vitest";
import { recordAutomationApplication } from "../../../src/core/automation/automation-application-recorder";
import type { ModifyResourceStep } from "../../../src/core/automation/automation-definition";
import type { ResourceTransaction } from "../../../src/core/resources/resource-transaction";
import type { WorkflowContext } from "../../../src/core/workflow/workflow-context";
import type { WorkflowHookEmitter } from "../../../src/core/workflow/workflow-hook-emitter";

function createActor(overrides: Partial<Actor> = {}): Actor {
  return {
    id: "actor-1",
    name: "Mercy",
    ...overrides
  } as Actor;
}

function createItem(type: string): Item {
  return {
    id: "item-1",
    name: "Cicatrização",
    type
  } as Item;
}

function createContext(itemType = "ritual"): WorkflowContext {
  return {
    id: "workflow-1",
    sourceActor: createActor(),
    sourceToken: null,
    item: createItem(itemType),
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

function createTransaction(overrides: Partial<ResourceTransaction> = {}): ResourceTransaction {
  const actor = createActor({ id: "target-1", name: "Alvo" });

  return {
    actor,
    actorId: actor.id ?? null,
    actorName: actor.name ?? "Ator sem nome",
    resource: "PV",
    operation: "damage",
    requestedAmount: 8,
    appliedAmount: 6,
    before: { value: 10, max: 10 },
    after: { value: 4, max: 10 },
    ...overrides
  };
}

function createLifecycle(): WorkflowHookEmitter {
  return {
    emit: vi.fn()
  } as unknown as WorkflowHookEmitter;
}

describe("recordAutomationApplication", () => {
  it("registra instância de dano e emite eventos de dano", () => {
    const context = createContext("ritual");
    const lifecycle = createLifecycle();
    const step: ModifyResourceStep = {
      type: "modifyResource",
      actor: "target",
      resource: "PV",
      operation: "damage",
      amountFrom: "damage.total"
    };
    const transaction = createTransaction();

    recordAutomationApplication({ step, context, transaction, stepIndex: 2, lifecycle });

    expect(context.damageInstances).toHaveLength(1);
    expect(context.healingInstances).toHaveLength(0);

    expect(context.damageInstances[0]).toMatchObject({
      id: "workflow-1.damage.2.0",
      source: "ritual",
      sourceId: "item-1",
      sourceName: "Cicatrização",
      targetActorId: "target-1",
      targetActorName: "Alvo",
      rollId: "damage",
      damageType: "sangue",
      rawAmount: 8,
      finalAmount: 8,
      appliedAmount: 6,
      tags: ["workflow", "resource", "PV"]
    });

    expect(lifecycle.emit).toHaveBeenCalledTimes(2);
    expect(lifecycle.emit).toHaveBeenNthCalledWith(
      1,
      "afterDamageResolution",
      context,
      expect.objectContaining({ stepIndex: 2, step, damage: context.damageInstances[0], resourceTransaction: transaction })
    );
    expect(lifecycle.emit).toHaveBeenNthCalledWith(
      2,
      "afterApplyDamage",
      context,
      expect.objectContaining({ stepIndex: 2, step, damage: context.damageInstances[0], resourceTransaction: transaction })
    );
  });

  it("registra instância de cura e emite evento de cura", () => {
    const context = createContext("ritual");
    const lifecycle = createLifecycle();
    const step: ModifyResourceStep = {
      type: "modifyResource",
      actor: "target",
      resource: "PV",
      operation: "heal",
      amountFrom: "healing.total"
    };
    const transaction = createTransaction({
      operation: "heal",
      requestedAmount: 12,
      appliedAmount: 9,
      before: { value: 1, max: 10 },
      after: { value: 10, max: 10 }
    });

    recordAutomationApplication({ step, context, transaction, stepIndex: 3, lifecycle });

    expect(context.damageInstances).toHaveLength(0);
    expect(context.healingInstances).toHaveLength(1);

    expect(context.healingInstances[0]).toMatchObject({
      id: "workflow-1.healing.3.0",
      source: "ritual",
      sourceId: "item-1",
      sourceName: "Cicatrização",
      targetActorId: "target-1",
      targetActorName: "Alvo",
      rollId: "healing",
      rawAmount: 12,
      finalAmount: 12,
      appliedAmount: 9,
      tags: ["workflow", "resource", "PV"]
    });

    expect(lifecycle.emit).toHaveBeenCalledTimes(1);
    expect(lifecycle.emit).toHaveBeenCalledWith(
      "afterApplyHealing",
      context,
      expect.objectContaining({ stepIndex: 3, step, healing: context.healingInstances[0], resourceTransaction: transaction })
    );
  });

  it("usa source automation quando o item não é ritual", () => {
    const context = createContext("ability");
    const lifecycle = createLifecycle();
    const step: ModifyResourceStep = {
      type: "modifyResource",
      actor: "target",
      resource: "PV",
      operation: "damage",
      amount: 4
    };

    recordAutomationApplication({ step, context, transaction: createTransaction({ requestedAmount: 4 }), stepIndex: 1, lifecycle });

    expect(context.damageInstances[0]?.source).toBe("automation");
  });

  it("não registra aplicação tipada para operações que não são dano ou cura", () => {
    const context = createContext("ability");
    const lifecycle = createLifecycle();
    const step: ModifyResourceStep = {
      type: "modifyResource",
      actor: "self",
      resource: "SAN",
      operation: "recover",
      amount: 3
    };

    recordAutomationApplication({
      step,
      context,
      transaction: createTransaction({ resource: "SAN", operation: "recover", requestedAmount: 3 }),
      stepIndex: 1,
      lifecycle
    });

    expect(context.damageInstances).toHaveLength(0);
    expect(context.healingInstances).toHaveLength(0);
    expect(lifecycle.emit).not.toHaveBeenCalled();
  });
});
