import { MODULE_ID } from "../../constants";
import { ATTACK_CARD_FLAG, ATTACK_DAMAGE_FLAG, ATTACK_EXECUTION_FLAG, readAttackCardBinding, readAttackDamage,
  readAttackExecution, type AttackCardBinding, type AttackDamageFlag, type AttackExecutionFlag,
  type AttackExecutionLink, type AttackMessage } from "./attack-card-state";

const queues = new Map<string, Promise<unknown>>();
export function withAttackMessageLock<T>(key: string, work: () => Promise<T>): Promise<T> {
  const previous = queues.get(key) ?? Promise.resolve();
  const next = previous.catch(() => undefined).then(work);
  queues.set(key, next);
  void next.finally(() => { if (queues.get(key) === next) queues.delete(key); }).catch(() => undefined);
  return next;
}
export async function resolveAttackMessage(id: string): Promise<AttackMessage | null> {
  const cached = game.messages.get?.(id);
  const value = cached ?? await fromUuid("ChatMessage." + id);
  const message = value as AttackMessage | null;
  return message?.id === id && typeof message.getFlag === "function" && typeof message.setFlag === "function" ? message : null;
}
export class AttackChatCardService {
  async beginUse(message: AttackMessage, useId: string): Promise<void> {
    await withAttackMessageLock(message.id, async () => {
      const binding: AttackCardBinding = { schemaVersion: 1, revision: 0, activeUseId: useId, executions: [] };
      await message.setFlag(MODULE_ID, ATTACK_CARD_FLAG, binding);
      await message.unsetFlag?.("ordemparanormal", "hitResult");
    });
  }
  async refresh(message: AttackMessage, useId: string): Promise<void> {
    await withAttackMessageLock(message.id, async () => {
      const binding = this.readBinding(message);
      if (binding?.activeUseId !== useId) return;
      await message.setFlag(MODULE_ID, ATTACK_CARD_FLAG, { ...binding, revision: binding.revision + 1 });
    });
  }
  async link(message: AttackMessage | null, useId: string, entry: AttackExecutionLink): Promise<void> {
    if (!message) return;
    await withAttackMessageLock(message.id, async () => {
      const binding = this.readBinding(message);
      if (!binding || binding.activeUseId !== useId) throw new Error("O acionamento ativo do card mudou.");
      const index = binding.executions.findIndex(current => current.executionId === entry.executionId);
      if (index < 0) binding.executions.push(entry); else binding.executions[index] = entry;
      binding.revision++;
      await message.setFlag(MODULE_ID, ATTACK_CARD_FLAG, binding);
    });
  }
  readBinding(message: AttackMessage): AttackCardBinding | null { return readAttackCardBinding(message.getFlag(MODULE_ID, ATTACK_CARD_FLAG)); }
  readExecution(message: AttackMessage): AttackExecutionFlag | null { return readAttackExecution(message.getFlag(MODULE_ID, ATTACK_EXECUTION_FLAG)); }
  readDamage(message: AttackMessage): AttackDamageFlag | null { return readAttackDamage(message.getFlag(MODULE_ID, ATTACK_DAMAGE_FLAG)); }
  async mutateExecution(message: AttackMessage, mutate: (flag: AttackExecutionFlag) => void): Promise<AttackExecutionFlag> {
    return this.mutate(message, ATTACK_EXECUTION_FLAG, readAttackExecution, mutate);
  }
  async mutateDamage(message: AttackMessage, mutate: (flag: AttackDamageFlag) => void): Promise<AttackDamageFlag> {
    return this.mutate(message, ATTACK_DAMAGE_FLAG, readAttackDamage, mutate);
  }
  private async mutate<T extends { revision: number }>(message: AttackMessage, key: string, read: (value: unknown) => T | null, mutate: (value: T) => void): Promise<T> {
    return withAttackMessageLock(message.id, async () => {
      const flag = read(message.getFlag(MODULE_ID, key));
      if (!flag) throw new Error("Estado persistido de ataque inválido. Conteúdo preservado.");
      mutate(flag);
      flag.revision++;
      await message.setFlag(MODULE_ID, key, flag);
      return flag;
    });
  }
}
