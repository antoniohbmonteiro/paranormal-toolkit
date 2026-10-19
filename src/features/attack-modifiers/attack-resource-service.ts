import type { ResourceAdapter } from "../../core/resources/actor-resource";
import type { ResourceEngine } from "../../core/resources/resource-engine";
import type { AttackResourceReceipt } from "./attack-card-state";

export class AttackResourceService {
  private readonly queues = new Map<string, Promise<unknown>>();
  constructor(private readonly engine: ResourceEngine, private readonly adapter: ResourceAdapter) {}
  current(actor: Actor, resource: "PE" | "PD"): number {
    const result = this.adapter.getResource(actor, resource);
    if (!result.ok) throw new Error(result.error.message);
    return result.value.value;
  }
  async publish<T>(actor: Actor, resource: "PE" | "PD", amount: number,
    publish: (receipt: AttackResourceReceipt | null) => Promise<T>): Promise<T> {
    const key = actor.uuid ?? actor.id ?? "";
    const previous = this.queues.get(key) ?? Promise.resolve();
    const next = previous.catch(() => undefined).then(async () => {
      let receipt: AttackResourceReceipt | null = null;
      if (amount > 0) {
        const result = await this.engine.spend(actor, resource, amount);
        if (!result.ok) {
          if (result.error.reason === "update-failed") throw new AttackResourceUncertain("Atualização do recurso incerta. Confira a ficha antes de repetir.");
          throw new Error(result.error.message);
        }
        receipt = { resource, amount, before: result.value.before.value, after: result.value.after.value };
      }
      try { return await publish(receipt); }
      catch (cause) {
        // A rejected server request may already have committed. Callers distinguish confirmed rejection.
        const confirmed = cause instanceof AttackPublicationRejected;
        if (receipt && confirmed) {
          try {
            if (this.current(actor, resource) !== receipt.after) throw new Error("Concurrent resource change");
            await this.adapter.updateResourceValue(actor, resource, receipt.before);
          } catch { throw new AttackResourceUncertain("Não foi possível restaurar o recurso com segurança. Confira a ficha antes de repetir."); }
        }
        if (receipt && !confirmed) throw new AttackResourceUncertain("Publicação incerta; o recurso pode ter sido gasto. Confira a ficha e o chat antes de repetir.");
        throw cause;
      }
    });
    this.queues.set(key, next);
    void next.finally(() => { if (this.queues.get(key) === next) this.queues.delete(key); }).catch(() => undefined);
    return next;
  }
}
export class AttackPublicationRejected extends Error {}
export class AttackResourceUncertain extends Error {}
