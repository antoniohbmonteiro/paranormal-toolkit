import { describe, expect, it, vi } from "vitest";
import { failure, success } from "../../../src/core/result";
import {
  executeAutomationResourceOperation,
  type AutomationResourceExecutor
} from "../../../src/core/automation/automation-resource-executor";
import type { ActorResource } from "../../../src/core/resources/actor-resource";
import type { ResourceOperation } from "../../../src/core/resources/resource-operation";
import type { ResourceOperationResult } from "../../../src/core/resources/resource-engine";

const actor = {
  id: "actor-1",
  name: "Agente Teste"
} as Actor;

function createTransaction(resource: ActorResource, operation: ResourceOperation, amount: number) {
  return {
    actor,
    actorId: actor.id ?? null,
    actorName: actor.name ?? "Ator sem nome",
    resource,
    operation,
    requestedAmount: amount,
    appliedAmount: amount,
    before: {
      value: 10,
      max: 20
    },
    after: {
      value: 10,
      max: 20
    }
  };
}

function createResources(): AutomationResourceExecutor {
  return {
    spend: vi.fn(async (_actor, resource, amount) => success(createTransaction(resource, "spend", amount))),
    damage: vi.fn(async (_actor, resource, amount) => success(createTransaction(resource, "damage", amount))),
    heal: vi.fn(async (_actor, resource, amount) => success(createTransaction(resource, "heal", amount))),
    recover: vi.fn(async (_actor, resource, amount) => success(createTransaction(resource, "recover", amount)))
  };
}

function expectInvalid(result: ResourceOperationResult, resource: ActorResource, operation: ResourceOperation): void {
  expect(result.ok).toBe(false);

  if (!result.ok) {
    expect(result.error.reason).toBe("invalid-resource-operation");
    expect(result.error.actor).toBe(actor);
    expect(result.error.actorId).toBe("actor-1");
    expect(result.error.actorName).toBe("Agente Teste");
    expect(result.error.resource).toBe(resource);
    expect(result.error.operation).toBe(operation);
    expect(result.error.requestedAmount).toBe(3);
  }
}

describe("executeAutomationResourceOperation", () => {
  it("delega gasto de PE para ResourceEngine.spend", async () => {
    const resources = createResources();

    const result = await executeAutomationResourceOperation(resources, actor, "PE", "spend", 3);

    expect(result.ok).toBe(true);
    expect(resources.spend).toHaveBeenCalledWith(actor, "PE", 3);
  });

  it("delega gasto de PD para ResourceEngine.spend", async () => {
    const resources = createResources();

    const result = await executeAutomationResourceOperation(resources, actor, "PD", "spend", 3);

    expect(result.ok).toBe(true);
    expect(resources.spend).toHaveBeenCalledWith(actor, "PD", 3);
  });

  it("rejeita gasto de recurso que não seja PE ou PD", async () => {
    const resources = createResources();

    const result = await executeAutomationResourceOperation(resources, actor, "PV", "spend", 3);

    expectInvalid(result, "PV", "spend");
    expect(resources.spend).not.toHaveBeenCalled();
  });

  it("delega dano em PV para ResourceEngine.damage", async () => {
    const resources = createResources();

    const result = await executeAutomationResourceOperation(resources, actor, "PV", "damage", 3);

    expect(result.ok).toBe(true);
    expect(resources.damage).toHaveBeenCalledWith(actor, "PV", 3);
  });

  it("delega dano em SAN para ResourceEngine.damage", async () => {
    const resources = createResources();

    const result = await executeAutomationResourceOperation(resources, actor, "SAN", "damage", 3);

    expect(result.ok).toBe(true);
    expect(resources.damage).toHaveBeenCalledWith(actor, "SAN", 3);
  });

  it("rejeita dano em recurso que não seja PV ou SAN", async () => {
    const resources = createResources();

    const result = await executeAutomationResourceOperation(resources, actor, "PE", "damage", 3);

    expectInvalid(result, "PE", "damage");
    expect(resources.damage).not.toHaveBeenCalled();
  });

  it("delega cura de PV para ResourceEngine.heal", async () => {
    const resources = createResources();

    const result = await executeAutomationResourceOperation(resources, actor, "PV", "heal", 3);

    expect(result.ok).toBe(true);
    expect(resources.heal).toHaveBeenCalledWith(actor, "PV", 3);
  });

  it("rejeita cura de recurso que não seja PV", async () => {
    const resources = createResources();

    const result = await executeAutomationResourceOperation(resources, actor, "SAN", "heal", 3);

    expectInvalid(result, "SAN", "heal");
    expect(resources.heal).not.toHaveBeenCalled();
  });

  it("delega recuperação de SAN para ResourceEngine.recover", async () => {
    const resources = createResources();

    const result = await executeAutomationResourceOperation(resources, actor, "SAN", "recover", 3);

    expect(result.ok).toBe(true);
    expect(resources.recover).toHaveBeenCalledWith(actor, "SAN", 3);
  });

  it("rejeita recuperação de recurso que não seja SAN", async () => {
    const resources = createResources();

    const result = await executeAutomationResourceOperation(resources, actor, "PV", "recover", 3);

    expectInvalid(result, "PV", "recover");
    expect(resources.recover).not.toHaveBeenCalled();
  });

  it("propaga falha retornada pelo ResourceEngine", async () => {
    const resources = createResources();
    const expectedFailure = failure({
      actor,
      actorId: actor.id ?? null,
      actorName: actor.name ?? "Ator sem nome",
      resource: "PE" as const,
      operation: "spend" as const,
      reason: "insufficient-resource" as const,
      message: "Recurso insuficiente.",
      requestedAmount: 3,
      current: 1,
      required: 3
    });

    vi.mocked(resources.spend).mockResolvedValueOnce(expectedFailure);

    const result = await executeAutomationResourceOperation(resources, actor, "PE", "spend", 3);

    expect(result).toBe(expectedFailure);
  });
});
