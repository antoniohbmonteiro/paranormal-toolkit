import { FoundryAttackRollMessageBridge } from "../../adapters/foundry/foundry-attack-roll-message-bridge";
import { OrdemAttackAdapter, type NativeAttackOptions } from "../../adapters/ordem/attacks/ordem-attack-adapter";
import { ATTACK_DAMAGE_FLAG, type AttackDamageFlag, type AttackMessage } from "./attack-card-state";
import { AttackChatCardService, resolveAttackMessage, withAttackMessageLock } from "./attack-chat-card-service";
import { AttackDamageResolver } from "./attack-damage-resolver";

export class AttackDamageWorkflow {
  constructor(private readonly cards: AttackChatCardService, readonly resolver: AttackDamageResolver,
    private readonly adapter: OrdemAttackAdapter, private readonly bridge: FoundryAttackRollMessageBridge) {}
  async card(message: AttackMessage, useId: string, item: Item, options: NativeAttackOptions): Promise<Roll[]> {
    const entries = await this.resolver.card(message, useId, item);
    return this.adapter.volley(item, entries, options, async nativeOptions => {
      if (this.cards.readBinding(message)?.activeUseId !== useId) throw new Error("O acionamento ativo do card mudou.");
      return this.execute(item, nativeOptions);
    });
  }
  async execute(item: Item, options: NativeAttackOptions): Promise<Roll> {
    if ((options.hitResult?.attackResults?.length ?? 0) > 1) {
      throw new Error("Use o botão Dano do card ou rollVolleyDamage para resolver os ataques individualmente.");
    }
    const id = options.hitResult?.attackMessageId ?? options.attackMessageId;
    if (!id) throw new Error("O dano gerenciado exige a mensagem individual do ataque.");
    return withAttackMessageLock("damage:" + id, async () => {
      if (!this.adapter.owns(item)) throw new Error("Sem permissão para rolar dano.");
      const resolved = await this.resolver.execution(id, item), { message, flag, entry } = resolved;
      if (!entry.hit || !entry.revealed) throw new Error("O ataque errou ou ainda aguarda uma reação.");
      if (flag.damage.state === "published") {
        const previous = flag.damage.messageId ? await resolveAttackMessage(flag.damage.messageId) : null;
        const damage = previous && this.cards.readDamage(previous);
        if (!previous?.rolls?.[0] || !damage || damage.executionId !== flag.snapshot.executionId || damage.attackMessageId !== id) {
          throw new Error("Dano já registrado, mas o resultado não está disponível. Não será rolado novamente.");
        }
        return previous.rolls[0];
      }
      if (!["available", "failed"].includes(flag.damage.state)) throw new Error("Rolagem de dano em execução ou incerta. Confira o chat antes de repetir.");
      await this.cards.mutateExecution(message, current => {
        if (!["available", "failed"].includes(current.damage.state)) throw new Error("Dano já reservado por outra execução.");
        current.damage = { state: "executing", messageId: null };
      });
      const marker = foundry.utils.randomID(), snapshot = flag.snapshot, type = this.adapter.damageType(item);
      let publicationStarted = false, published: AttackMessage | null = null;
      const release = this.bridge.register(marker, { publish: async (roll, data, send) => {
        const current = await this.resolver.execution(id, item);
        if (!current.entry.hit || !current.entry.revealed || current.entry.isCritical !== entry.isCritical) throw new Error("O resultado do ataque mudou antes da publicação do dano.");
        const damage: AttackDamageFlag = { schemaVersion: 1, revision: 0, useId: snapshot.useId,
          executionId: snapshot.executionId, attackMessageId: id, target: snapshot.target,
          multiplier: snapshot.modifiers.critical.multiplier, resistancePenetration: snapshot.modifiers.resistancePenetration,
          damageType: type.type, mixedTypes: type.mixed, total: roll.total ?? 0,
          application: { state: "available", messageId: null } };
        publicationStarted = true;
        published = await send(this.adapter.stamp(data, ATTACK_DAMAGE_FLAG, damage, true)) as AttackMessage | null;
        if (!published?.id) { publicationStarted = false; throw new Error("Publicação do dano cancelada."); }
        await this.cards.mutateExecution(message, currentFlag => { currentFlag.damage = { state: "published", messageId: published!.id }; });
        return published;
      } });
      try {
        const instance = this.adapter.createDamageExecutionItem(item, marker, snapshot.bonusDamageDie, snapshot.modifiers.bonusWeaponDamageDice);
        return await this.adapter.damage(instance, { ...options, lastId: true,
          critical: { isCritical: entry.isCritical, multiplier: snapshot.modifiers.critical.multiplier },
          hitResult: { ...entry, hit: true }, attackMessageId: id,
          _attackIndex: snapshot.nativeAttackIndex ?? undefined, _attackTotal: snapshot.nativeAttackTotal ?? options._attackTotal });
      } catch (cause) {
        try {
          await this.cards.mutateExecution(message, current => {
            current.damage = { state: published ? "published" : publicationStarted ? "uncertain" : "failed",
              messageId: (published as AttackMessage | null)?.id ?? null,
              diagnostic: cause instanceof Error ? cause.message : "Falha na rolagem de dano." };
          });
        } catch { /* An executing receipt is blocked after reload rather than rerolled. */ }
        throw cause;
      } finally { release(); }
    });
  }
}
