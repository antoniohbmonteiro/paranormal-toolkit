export const ATTACK_ROLL_CONTEXT_KEY = "__paranormalToolkitAttackRoll";
export type PublishingAttackRoll = Roll & { data: Record<string, unknown> };
export type AttackRollPublisher = {
  publish(roll: PublishingAttackRoll, data: Record<string, unknown>,
    send: (data: Record<string, unknown>) => Promise<unknown>): Promise<unknown>;
};
type ToMessage = (this: PublishingAttackRoll, data?: Record<string, unknown>, options?: Record<string, unknown>) => Promise<unknown>;
type PublishingPrototype = { toMessage?: ToMessage; __paranormalToolkitAttackBridge?: FoundryAttackRollMessageBridge };

export class FoundryAttackRollMessageBridge {
  private readonly publishers = new Map<string, AttackRollPublisher>();
  install(): void {
    const prototype = Roll.prototype as unknown as PublishingPrototype;
    if (prototype.__paranormalToolkitAttackBridge && prototype.__paranormalToolkitAttackBridge !== this) {
      throw new Error("Bridge de ataques já registrado por outra instância.");
    }
    if (prototype.__paranormalToolkitAttackBridge === this) return;
    const original = prototype.toMessage;
    if (typeof original !== "function") throw new Error("Roll.toMessage indisponível. Modificadores de ataque não foram ativados.");
    const bridge = this;
    prototype.toMessage = async function(data = {}, options = {}) {
      const id = this.data?.[ATTACK_ROLL_CONTEXT_KEY];
      const publisher = typeof id === "string" ? bridge.publishers.get(id) : undefined;
      if (!publisher) return original.call(this, data, options);
      if (options.create === false) throw new Error("Uma execução de ataque exige publicação confirmada.");
      return publisher.publish(this, data, prepared => original.call(this, prepared, options));
    };
    prototype.__paranormalToolkitAttackBridge = this;
  }
  register(id: string, publisher: AttackRollPublisher): () => void {
    if (this.publishers.has(id)) throw new Error("Publicação de ataque duplicada.");
    this.publishers.set(id, publisher);
    return () => { this.publishers.delete(id); };
  }
}
