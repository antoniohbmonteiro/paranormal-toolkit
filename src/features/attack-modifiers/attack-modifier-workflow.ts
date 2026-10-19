import { MODULE_ID } from "../../constants";
import { FoundryAttackRollMessageBridge } from "../../adapters/foundry/foundry-attack-roll-message-bridge";
import { OrdemAttackAdapter, type NativeAttackOptions, type NativeAttackResult } from "../../adapters/ordem/attacks/ordem-attack-adapter";
import { resolveOrdemEffortResource } from "../../adapters/ordem/ordem-effort-resource-resolver";
import { resolveWorkflowTargetActor } from "../../core/workflow/workflow-target-reference";
import { composeAttackModifiers, formatAttackCritical } from "./attack-modifier-composer";
import { AttackModifierRegistry } from "./attack-modifier-registry";
import type { AttackModifierDialogInput } from "./attack-modifier-dialog-model";
import { emptyAttackConfiguration, validateAttackGeneralActions, type AttackConfigurationSelection } from "./attack-general-actions";
import { ATTACK_CARD_FLAG, ATTACK_EXECUTION_FLAG, type AttackExecutionFlag, type AttackExecutionLink,
  type AttackMessage, type AttackSnapshot } from "./attack-card-state";
import { AttackChatCardService } from "./attack-chat-card-service";
import { AttackPublicationRejected, AttackResourceService, AttackResourceUncertain } from "./attack-resource-service";

export type AttackUseContext = { id: string; source: AttackMessage | null; entries: AttackExecutionLink[]; modifiersEnabled?: boolean };
export type RequestAttackModifiers = (input: AttackModifierDialogInput) => Promise<AttackConfigurationSelection | null>;
export class AttackModifierWorkflow {
  constructor(readonly registry: AttackModifierRegistry, readonly adapter: OrdemAttackAdapter,
    readonly cards: AttackChatCardService, private readonly resources: AttackResourceService,
    private readonly bridge: FoundryAttackRollMessageBridge, private readonly request: RequestAttackModifiers) {}

  available(item: Item) { return this.registry.resolve(this.adapter.abilities(item), this.adapter.facts(item)); }
  async begin(source: AttackMessage | null): Promise<AttackUseContext> {
    const context: AttackUseContext = { id: foundry.utils.randomID(), source, entries: [] };
    if (source) await this.cards.beginUse(source, context.id);
    return context;
  }
  async execute(item: Item, options: NativeAttackOptions, use: AttackUseContext): Promise<NativeAttackResult> {
    const entry: AttackExecutionLink = { executionId: foundry.utils.randomID(), ordinal: use.entries.length, attackMessageId: null, state: "preparing" };
    use.entries.push(entry);
    await this.cards.link(use.source, use.id, entry);
    let release: (() => void) | undefined;
    let publicationStarted = false;
    try {
      if (!this.adapter.owns(item)) throw new Error("Você não possui permissão para atacar com este personagem.");
      const actor = this.adapter.actor(item)!;
      const base = this.adapter.critical(item);
      if (!base) throw new Error("Crítico da arma inválido. Confira o campo Crítico antes de usar modificadores.");
      const token = this.adapter.target(options), target = this.adapter.targetReference(token);
      const resource = resolveOrdemEffortResource();
      const available = use.modifiersEnabled === false ? [] : this.available(item);
      let current: number | null = null;
      try { current = this.resources.current(actor, resource); } catch { /* Free attacks do not require an effort resource field. */ }
      const shouldConfigure = use.modifiersEnabled !== false && (available.length > 0 || !!use.source && this.adapter.supportsWeaponAttack(item));
      const selection = shouldConfigure ? await this.request({
        weaponName: item.name, weaponImage: item.img ?? "icons/svg/sword.svg", actorName: actor.name,
        targetName: target?.name ?? null, baseCritical: base, available, resource, currentResource: current,
        facts: this.adapter.facts(item), burstDamage: this.adapter.bonusDamageDie(item),
      }) : emptyAttackConfiguration();
      if (!selection) {
        entry.state = "cancelled";
        await this.cards.link(use.source, use.id, entry);
        return cancelledAttackResult();
      }
      const currentCritical = this.adapter.critical(item);
      if (!this.adapter.owns(item) || resource !== resolveOrdemEffortResource()
        || !currentCritical || formatAttackCritical(currentCritical) !== formatAttackCritical(base)) {
        throw new Error("A arma, a permissão ou o recurso mudou. Configure o ataque novamente.");
      }
      const weaponDamageDie = this.adapter.bonusDamageDie(item);
      const contribution = validateAttackGeneralActions(this.adapter.facts(item), selection, weaponDamageDie);
      const modifiers = composeAttackModifiers(base, use.modifiersEnabled === false ? [] : this.available(item), selection.presets, contribution);
      const bonusDamageDie = modifiers.bonusWeaponDamageDice > 0 ? weaponDamageDie : null;
      if (modifiers.bonusWeaponDamageDice > 0 && !bonusDamageDie) throw new Error("Dano adicional exige dano-base da arma no formato NdM.");
      if (modifiers.effortCost > 0 && this.resources.current(actor, resource) < modifiers.effortCost) throw new Error("Recurso insuficiente para este ataque.");
      if (target && !await resolveWorkflowTargetActor(target)) throw new Error("O alvo original não está mais disponível.");
      const snapshot: AttackSnapshot = {
        useId: use.id, executionId: entry.executionId, sourceMessageId: use.source?.id ?? null,
        actorUuid: actor.uuid ?? "", itemUuid: item.uuid, itemName: item.name, target,
        baseCritical: base, modifiers, generalActions: structuredClone(selection.generalActions), bonusDamageDie,
        rolledCritical: false, resource, resourceReceipt: null,
        nativeAttackIndex: typeof options._attackIndex === "number" ? options._attackIndex : null,
        nativeAttackTotal: typeof options._attackTotal === "number" ? options._attackTotal : null,
        nativeVolleyId: typeof options._volleyId === "string" ? options._volleyId : null,
      };
      let message: AttackMessage | null = null;
      const instance = this.adapter.createExecutionItem(item, entry.executionId, modifiers.critical,
        value => { snapshot.rolledCritical = value; });
      release = this.bridge.register(entry.executionId, {
        prepare: modifiers.attackDiceModifier !== 0 ? roll => this.adapter.prepareAttackRoll(roll, modifiers.attackDiceModifier) : undefined,
        publish: async (_roll, data, send) => {
          if (message) return message;
          if (use.source && this.cards.readBinding(use.source)?.activeUseId !== use.id) throw new Error("O acionamento ativo do card mudou.");
          const published = await this.resources.publish(actor, resource, modifiers.effortCost, async receipt => {
            snapshot.resourceReceipt = receipt;
            const flag: AttackExecutionFlag = { schemaVersion: 3, revision: 0, snapshot: structuredClone(snapshot),
              damage: { state: "available", messageId: null } };
            publicationStarted = true;
            const created = await send(this.adapter.stamp(data, ATTACK_EXECUTION_FLAG, flag)) as AttackMessage | null;
            if (!created?.id) { publicationStarted = false; throw new AttackPublicationRejected("A publicação do ataque foi cancelada."); }
            message = created;
            return created;
          });
          entry.attackMessageId = published.id; entry.state = "published";
          await this.cards.link(use.source, use.id, entry);
          return published;
        },
      });
      const result = await this.adapter.attack(instance, { ...options, _forcedTarget: token });
      if (!entry.attackMessageId) throw new Error("O sistema não confirmou a mensagem do ataque.");
      return result;
    } catch (cause) {
      if (entry.state !== "published") entry.state = publicationStarted || cause instanceof AttackResourceUncertain ? "uncertain" : "failed";
      try { await this.cards.link(use.source, use.id, entry); } catch { /* The individual published message remains authoritative. */ }
      throw cause;
    } finally { release?.(); }
  }
  completeNativeResult(result: NativeAttackResult, use: AttackUseContext): NativeAttackResult {
    const entries = result.hitResult?.attackResults;
    if (entries) {
      if (entries.length !== use.entries.length) throw new Error("Agregação nativa divergente. Confira as mensagens individuais.");
      result.hitResult = { ...result.hitResult, attackResults: entries.map((entry, index) => ({
        ...entry, attackMessageId: use.entries[index].attackMessageId,
        ...(use.entries[index].state === "cancelled" ? { hit: false, isCritical: false, revealed: true } : {}),
      })) };
    }
    return result;
  }
  hasManagedState(message: AttackMessage): boolean { return message.getFlag(MODULE_ID, ATTACK_CARD_FLAG) !== undefined; }
}
export function cancelledAttackResult(): NativeAttackResult {
  return { roll: null, criticalStatus: { isCritical: false }, hitResult: { hit: false, revealed: true,
    isCritical: false, actorUuid: null, attackMessageId: null } };
}
