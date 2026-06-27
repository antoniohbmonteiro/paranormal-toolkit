import { describe, expect, it, vi } from "vitest";
import { executeAutomationCostStep } from "../../../src/core/automation/automation-cost-executor";
import type { SpendResourceStep, SpendRitualCostStep } from "../../../src/core/automation/automation-definition";
import type { RitualCostProvider } from "../../../src/core/rituals/ritual-cost-provider";
import type { ResourceEngine } from "../../../src/core/resources/resource-engine";
import type { ResourceTransaction } from "../../../src/core/resources/resource-transaction";
import type { WorkflowContext } from "../../../src/core/workflow/workflow-context";

function createActor(): Actor {
  return { id: "actor-1", name: "Mercy" } as Actor;
}

function createItem(): Item {
  return { id: "ritual-1", name: "Cicatrização", type: "ritual" } as Item;
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
      cost: {
        id: "cost",
        formula: "1d4",
        intent: "generic",
        total: 3,
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

function createTransaction(amount: number): ResourceTransaction {
  const actor = createActor();

  return {
    actor,
    actorId: actor.id ?? null,
    actorName: actor.name ?? "Ator sem nome",
    resource: "PE",
    operation: "spend",
    requestedAmount: amount,
    appliedAmount: amount,
    before: { value: 10, max: 10 },
    after: { value: 10 - amount, max: 10 }
  };
}

function createResources(transaction = createTransaction(2)): Pick<ResourceEngine, "spend"> {
  return {
    spend: vi.fn().mockResolvedValue({ ok: true, value: transaction })
  };
}

function createRitualCosts(): RitualCostProvider {
  return {
    getCost: vi.fn().mockReturnValue({
      ok: true,
      value: {
        resource: "PE",
        amount: 2,
        source: "circle",
        circle: 1
      }
    })
  };
}

describe("executeAutomationCostStep", () => {
  it("gasta recurso explícito e registra transação", async () => {
    const context = createContext();
    const resources = createResources(createTransaction(3));
    const step: SpendResourceStep = {
      type: "spendResource",
      actor: "self",
      resource: "PE",
      amountFrom: "cost.total"
    };

    const result = await executeAutomationCostStep({
      step,
      context,
      resources,
      ritualCosts: createRitualCosts()
    });

    expect(result.ok).toBe(true);
    expect(resources.spend).toHaveBeenCalledWith(context.sourceActor, "PE", 3);
    expect(context.resourceTransactions).toHaveLength(1);
  });

  it("falha quando amount é inválido", async () => {
    const context = createContext();
    const step: SpendResourceStep = {
      type: "spendResource",
      actor: "self",
      resource: "PE",
      amount: 0
    };

    const result = await executeAutomationCostStep({
      step,
      context,
      resources: createResources(),
      ritualCosts: createRitualCosts()
    });

    expect(result.ok).toBe(false);
    if (!result.ok) expect(result.error.reason).toBe("invalid-amount-source");
    expect(context.resourceTransactions).toHaveLength(0);
  });

  it("calcula custo de ritual, registra custo e transação", async () => {
    const context = createContext();
    const resources = createResources(createTransaction(2));
    const ritualCosts = createRitualCosts();
    const step: SpendRitualCostStep = { type: "spendRitualCost" };

    const result = await executeAutomationCostStep({
      step,
      context,
      resources,
      ritualCosts
    });

    expect(result.ok).toBe(true);
    expect(ritualCosts.getCost).toHaveBeenCalledWith({ actor: context.sourceActor, ritual: context.item });
    expect(resources.spend).toHaveBeenCalledWith(context.sourceActor, "PE", 2);
    expect(context.ritualCosts).toEqual([
      {
        resource: "PE",
        amount: 2,
        source: "circle",
        circle: 1,
        itemId: "ritual-1",
        itemName: "Cicatrização"
      }
    ]);
    expect(context.resourceTransactions).toHaveLength(1);
  });

  it("falha quando custo de ritual não pode ser calculado", async () => {
    const context = createContext();
    const ritualCosts: RitualCostProvider = {
      getCost: vi.fn().mockReturnValue({
        ok: false,
        error: {
          reason: "invalid-circle",
          message: "Círculo inválido."
        }
      })
    };

    const result = await executeAutomationCostStep({
      step: { type: "spendRitualCost" },
      context,
      resources: createResources(),
      ritualCosts
    });

    expect(result.ok).toBe(false);
    if (!result.ok) expect(result.error.reason).toBe("ritual-cost-failed");
    expect(context.ritualCosts).toHaveLength(0);
    expect(context.resourceTransactions).toHaveLength(0);
  });

  it("falha quando operação de recurso falha e reverte registro de custo ritual", async () => {
    const context = createContext();
    const resources: Pick<ResourceEngine, "spend"> = {
      spend: vi.fn().mockResolvedValue({
        ok: false,
        error: {
          actor: context.sourceActor,
          actorId: "actor-1",
          actorName: "Mercy",
          resource: "PE",
          operation: "spend",
          reason: "insufficient-resource",
          message: "PE insuficiente.",
          requestedAmount: 2
        }
      })
    };

    const result = await executeAutomationCostStep({
      step: { type: "spendRitualCost" },
      context,
      resources,
      ritualCosts: createRitualCosts()
    });

    expect(result.ok).toBe(false);
    if (!result.ok) expect(result.error.reason).toBe("resource-operation-failed");
    expect(context.ritualCosts).toHaveLength(0);
    expect(context.resourceTransactions).toHaveLength(0);
  });
});
