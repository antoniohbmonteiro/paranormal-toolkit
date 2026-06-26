import { describe, expect, it } from "vitest";
import { failure, success } from "../../../src/core/result";
import type {
  ActorResource,
  ResourceAdapter,
  ResourceReadFailure,
  ResourceReadResult,
  ResourceSnapshot
} from "../../../src/core/resources/actor-resource";
import { ResourceEngine } from "../../../src/core/resources/resource-engine";

class FakeResourceAdapter implements ResourceAdapter {
  readonly updateCalls: Array<{ actor: Actor; resource: ActorResource; value: number }> = [];

  private readonly snapshots = new Map<ActorResource, ResourceSnapshot>();
  private readFailure: ResourceReadFailure | null = null;

  setResource(resource: ActorResource, snapshot: ResourceSnapshot): void {
    this.snapshots.set(resource, { ...snapshot });
  }

  failReadsWith(failureValue: ResourceReadFailure): void {
    this.readFailure = failureValue;
  }

  getResource(_actor: Actor, resource: ActorResource): ResourceReadResult {
    if (this.readFailure) return failure(this.readFailure);

    const snapshot = this.snapshots.get(resource);

    if (!snapshot) {
      return failure({
        actor: fakeActor,
        actorId: fakeActor.id ?? null,
        actorName: fakeActor.name ?? "Ator sem nome",
        actorType: fakeActor.type ?? "unknown",
        resource,
        reason: "resource-path-not-found",
        message: `Recurso não configurado no adapter fake: ${resource}.`
      });
    }

    return success({ ...snapshot });
  }

  async updateResourceValue(actor: Actor, resource: ActorResource, value: number): Promise<void> {
    this.updateCalls.push({ actor, resource, value });

    const snapshot = this.snapshots.get(resource);
    if (snapshot) {
      this.snapshots.set(resource, { ...snapshot, value });
    }
  }
}

const fakeActor = {
  id: "actor-1",
  name: "Mercy",
  type: "agent"
} as Actor;

describe("ResourceEngine", () => {
  it("gasta PE quando o ator tem recurso suficiente", async () => {
    const adapter = new FakeResourceAdapter();
    adapter.setResource("PE", { value: 5, max: 10 });

    const engine = new ResourceEngine(adapter);
    const result = await engine.spend(fakeActor, "PE", 2);

    expect(result.ok).toBe(true);
    if (!result.ok) return;

    expect(result.value.resource).toBe("PE");
    expect(result.value.operation).toBe("spend");
    expect(result.value.requestedAmount).toBe(2);
    expect(result.value.appliedAmount).toBe(2);
    expect(result.value.before).toEqual({ value: 5, max: 10 });
    expect(result.value.after).toEqual({ value: 3, max: 10 });
    expect(adapter.updateCalls).toEqual([{ actor: fakeActor, resource: "PE", value: 3 }]);
  });

  it("falha ao gastar PE quando o recurso é insuficiente", async () => {
    const adapter = new FakeResourceAdapter();
    adapter.setResource("PE", { value: 1, max: 10 });

    const engine = new ResourceEngine(adapter);
    const result = await engine.spend(fakeActor, "PE", 2);

    expect(result.ok).toBe(false);
    if (result.ok) return;

    expect(result.error.reason).toBe("insufficient-resource");
    expect(result.error.current).toBe(1);
    expect(result.error.required).toBe(2);
    expect(adapter.updateCalls).toEqual([]);
  });

  it("aplica dano em PV sem deixar o valor ficar negativo", async () => {
    const adapter = new FakeResourceAdapter();
    adapter.setResource("PV", { value: 4, max: 12 });

    const engine = new ResourceEngine(adapter);
    const result = await engine.damage(fakeActor, "PV", 9);

    expect(result.ok).toBe(true);
    if (!result.ok) return;

    expect(result.value.operation).toBe("damage");
    expect(result.value.requestedAmount).toBe(9);
    expect(result.value.appliedAmount).toBe(4);
    expect(result.value.after).toEqual({ value: 0, max: 12 });
    expect(adapter.updateCalls).toEqual([{ actor: fakeActor, resource: "PV", value: 0 }]);
  });

  it("cura PV sem ultrapassar o máximo", async () => {
    const adapter = new FakeResourceAdapter();
    adapter.setResource("PV", { value: 10, max: 12 });

    const engine = new ResourceEngine(adapter);
    const result = await engine.heal(fakeActor, "PV", 10);

    expect(result.ok).toBe(true);
    if (!result.ok) return;

    expect(result.value.operation).toBe("heal");
    expect(result.value.requestedAmount).toBe(10);
    expect(result.value.appliedAmount).toBe(2);
    expect(result.value.after).toEqual({ value: 12, max: 12 });
    expect(adapter.updateCalls).toEqual([{ actor: fakeActor, resource: "PV", value: 12 }]);
  });

  it("falha para quantidades inválidas", async () => {
    const adapter = new FakeResourceAdapter();
    adapter.setResource("PE", { value: 5, max: 10 });

    const engine = new ResourceEngine(adapter);
    const result = await engine.spend(fakeActor, "PE", 0);

    expect(result.ok).toBe(false);
    if (result.ok) return;

    expect(result.error.reason).toBe("invalid-amount");
    expect(adapter.updateCalls).toEqual([]);
  });

  it("não chama update quando o valor final é igual ao valor atual", async () => {
    const adapter = new FakeResourceAdapter();
    adapter.setResource("PV", { value: 12, max: 12 });

    const engine = new ResourceEngine(adapter);
    const result = await engine.heal(fakeActor, "PV", 3);

    expect(result.ok).toBe(true);
    if (!result.ok) return;

    expect(result.value.appliedAmount).toBe(0);
    expect(result.value.after).toEqual({ value: 12, max: 12 });
    expect(adapter.updateCalls).toEqual([]);
  });
});
