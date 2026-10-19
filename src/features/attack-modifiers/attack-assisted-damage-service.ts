import type { DamageEngine } from "../../core/damage/damage-engine";
import { resolveWorkflowTargetActor } from "../../core/workflow/workflow-target-reference";
import { electWorkflowExecutor } from "../../core/workflow/workflow-executor";
import { canCurrentUserApplyAssistedActions } from "../item-use/assisted-actions/assisted-action-policy";
import { whisperDamageApplicationResultToGms } from "../item-use/assisted-actions/assisted-damage-feedback-service";
import { AttackChatCardService, withAttackMessageLock } from "./attack-chat-card-service";
import { AttackDamageResolver } from "./attack-damage-resolver";
import type { AttackMessage } from "./attack-card-state";

export function isAttackDamageExecutor(): boolean {
  return canCurrentUserApplyAssistedActions() && game.user?.id === electWorkflowExecutor(
    Array.from(game.users).flatMap(user => user.id ? [{ id: user.id, isGM: user.isGM === true, active: user.active === true }] : []));
}
export class AttackAssistedDamageService {
  constructor(private readonly damage: DamageEngine, private readonly cards: AttackChatCardService,
    private readonly resolver: AttackDamageResolver) {}
  async apply(message: AttackMessage): Promise<void> {
    if (!isAttackDamageExecutor()) throw new Error("A aplicação está sob controle do Mestre executor conectado.");
    await withAttackMessageLock("apply:" + message.id, async () => {
      const flag = this.cards.readDamage(message);
      if (!flag || flag.mixedTypes || !flag.target || !flag.damageType) throw new Error("Este dano exige aplicação manual.");
      if (flag.application.state === "completed") return;
      if (flag.application.state !== "available" && flag.application.state !== "failed") throw new Error("Aplicação em andamento ou incerta. Confira o alvo antes de repetir.");
      const attack = await this.resolver.execution(flag.attackMessageId);
      const snapshot = attack.flag.snapshot;
      if (snapshot.useId !== flag.useId || snapshot.executionId !== flag.executionId || !attack.entry.hit || !attack.entry.revealed
        || !snapshot.target || snapshot.target.actorUuid !== flag.target.actorUuid || snapshot.target.tokenUuid !== flag.target.tokenUuid
        || snapshot.modifiers.resistancePenetration !== flag.resistancePenetration || snapshot.modifiers.critical.multiplier !== flag.multiplier
        || message.rolls?.[0]?.total !== flag.total) throw new Error("O dano não corresponde a um acerto válido e ao alvo original.");
      const actor = await resolveWorkflowTargetActor(flag.target);
      if (!actor || !game.user || !actor.canUserModify(game.user, "update")) throw new Error("O alvo original não está disponível para aplicação.");
      const block = attack.message.getFlag("ordemparanormal", "damageBlock") as { amount?: unknown } | null;
      const extra = block?.amount ?? 0;
      if (!Number.isSafeInteger(extra) || (extra as number) < 0) throw new Error("RD de bloqueio inválida.");
      await this.cards.mutateDamage(message, current => {
        if (!["available", "failed"].includes(current.application.state)) throw new Error("Aplicação já reservada.");
        current.application = { state: "executing", messageId: null };
      });
      let mutationPossible = false;
      try {
        const latest = await this.resolver.execution(flag.attackMessageId);
        if (!latest.entry.hit || !latest.entry.revealed) throw new Error("O resultado do ataque mudou.");
        mutationPossible = true;
        const result = await this.damage.applyDamage({ actor,
          instances: [{ id: flag.executionId, amount: flag.total, damageType: flag.damageType, sourceRollId: message.id,
            resistancePenetration: flag.resistancePenetration, extraResistance: extra as number }],
          source: "attack-modifiers.assisted-damage", originUuid: snapshot.itemUuid });
        if (!result.ok) {
          mutationPossible = result.error.reason === "application-failed";
          throw new Error(result.error.message);
        }
        await this.cards.mutateDamage(message, current => { current.application = { state: "completed", messageId: message.id }; });
        try { await whisperDamageApplicationResultToGms(result.value); } catch { /* Damage has already committed; feedback must not enable replay. */ }
      } catch (cause) {
        try { await this.cards.mutateDamage(message, current => {
          current.application = { state: mutationPossible ? "uncertain" : "failed", messageId: null,
            diagnostic: cause instanceof Error ? cause.message : "Falha na aplicação." };
        }); } catch { /* An executing receipt remains blocked. */ }
        throw cause;
      }
    });
  }
}
