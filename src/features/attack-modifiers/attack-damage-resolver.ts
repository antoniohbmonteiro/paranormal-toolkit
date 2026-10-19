import { OrdemAttackAdapter, type NativeVolleyEntry } from "../../adapters/ordem/attacks/ordem-attack-adapter";
import { AttackChatCardService, resolveAttackMessage } from "./attack-chat-card-service";
import type { AttackExecutionFlag, AttackMessage } from "./attack-card-state";

export type ResolvedAttackDamage = { message: AttackMessage; flag: AttackExecutionFlag; entry: NativeVolleyEntry };
export class AttackDamageResolver {
  constructor(private readonly cards: AttackChatCardService, private readonly adapter: OrdemAttackAdapter) {}
  async execution(id: string, item?: Item): Promise<ResolvedAttackDamage> {
    const message = await resolveAttackMessage(id);
    const flag = message && this.cards.readExecution(message);
    if (!message || !flag) throw new Error("Mensagem individual de ataque ausente ou inválida.");
    if (item && (flag.snapshot.itemUuid !== item.uuid || flag.snapshot.actorUuid !== this.adapter.actor(item)?.uuid)) {
      throw new Error("A mensagem de ataque não pertence a esta arma e personagem.");
    }
    const target = flag.snapshot.target;
    const hit = this.adapter.currentHit(message);
    if (target && (!hit || hit.actorUuid !== target.actorUuid || typeof hit.hit !== "boolean" || typeof hit.isCritical !== "boolean" || typeof hit.revealed !== "boolean")) {
      throw new Error("Resultado nativo do alvo ausente ou divergente.");
    }
    return { message, flag, entry: {
      attackMessageId: id, actorUuid: target?.actorUuid ?? null,
      hit: target ? hit?.hit === true : true, revealed: target ? hit?.revealed !== false : true,
      isCritical: target ? hit?.isCritical === true : flag.snapshot.rolledCritical,
      attackIndex: flag.snapshot.nativeAttackIndex,
      targetDefense: typeof hit?.targetDefense === "number" ? hit.targetDefense : null,
    } };
  }
  async card(message: AttackMessage, expectedUseId: string, item: Item): Promise<NativeVolleyEntry[]> {
    const binding = this.cards.readBinding(message);
    if (!binding || binding.activeUseId !== expectedUseId) throw new Error("O ataque exibido mudou. Atualize o card antes de rolar dano.");
    const result: NativeVolleyEntry[] = [];
    for (const link of binding.executions) {
      if (link.state === "cancelled" || link.state === "failed") {
        result.push({ attackMessageId: null, actorUuid: null, hit: false, revealed: true, isCritical: false, attackIndex: null });
        continue;
      }
      if (link.state !== "published" || !link.attackMessageId) throw new Error("Execução incompleta ou incerta. Confira o ataque antes de rolar dano.");
      const resolved = await this.execution(link.attackMessageId, item);
      if (resolved.flag.snapshot.useId !== expectedUseId || resolved.flag.snapshot.executionId !== link.executionId
        || resolved.flag.snapshot.sourceMessageId !== message.id) throw new Error("Vínculo de ataque divergente.");
      result.push(resolved.entry);
    }
    if (result.some(entry => !entry.revealed)) throw new Error("Aguarde a resolução das reações antes de rolar dano.");
    if (!result.some(entry => entry.hit)) throw new Error("Este acionamento não possui ataques disponíveis para dano.");
    return result;
  }
}
