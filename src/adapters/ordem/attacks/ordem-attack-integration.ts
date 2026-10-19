import { MODULE_ID } from "../../../constants";
import { FoundryAttackRollMessageBridge } from "../../foundry/foundry-attack-roll-message-bridge";
import { ORDEM_HOOKS } from "../ordem-hooks";
import { getItemUseSettings } from "../../../features/item-use/item-use-settings";
import { ATTACK_CARD_FLAG, ATTACK_EXECUTION_FLAG, object, type AttackMessage } from "../../../features/attack-modifiers/attack-card-state";
import { resolveAttackMessage } from "../../../features/attack-modifiers/attack-chat-card-service";
import { AttackCardController, reportAttackFailure } from "../../../features/attack-modifiers/attack-card-controller";
import { AttackModifierWorkflow, type AttackUseContext } from "../../../features/attack-modifiers/attack-modifier-workflow";
import { AttackDamageWorkflow } from "../../../features/attack-modifiers/attack-damage-workflow";
import { AttackAssistedDamageService } from "../../../features/attack-modifiers/attack-assisted-damage-service";
import { OrdemAttackAdapter, type NativeAttackItem, type NativeAttackOptions, type NativeAttackResult } from "./ordem-attack-adapter";
import { ensureModuleStylesheet } from "../../../ui/styles/module-stylesheet-loader";

const USE_CONTEXT = Symbol("toolkitAttackUse");
type NativeItemClass = {
  prototype: NativeAttackItem & { __paranormalToolkitAttackIntegration?: boolean };
  new(data: unknown, options: { parent: Actor }): NativeAttackItem;
  _onChatCardAction(event: Event): Promise<unknown>;
  _getChatCardActor(card: Element): Promise<Actor | null>;
};
export class OrdemAttackIntegration {
  private registered = false;
  private readonly activeUses = new WeakSet<AttackUseContext>();
  private readonly directPending = new WeakMap<Item, Promise<NativeAttackResult>>();
  private readonly controller: AttackCardController;
  constructor(private readonly attacks: AttackModifierWorkflow, private readonly damage: AttackDamageWorkflow,
    assisted: AttackAssistedDamageService, private readonly adapter: OrdemAttackAdapter,
    private readonly bridge: FoundryAttackRollMessageBridge) {
    this.controller = new AttackCardController(attacks, damage, assisted, async (item, options, use) => {
      use.modifiersEnabled = getItemUseSettings().executionMode !== "disabled";
      this.activeUses.add(use);
      try { return await (item as NativeAttackItem).rollAttack({ ...options, [USE_CONTEXT]: use }); }
      finally { this.activeUses.delete(use); }
    });
  }
  register(): void {
    if (this.registered) return;
    const ItemClass = CONFIG.Item?.documentClass as unknown as NativeItemClass | undefined;
    const prototype = ItemClass?.prototype;
    if (!ItemClass || !prototype || prototype.__paranormalToolkitAttackIntegration) return;
    if (![prototype.rollAttack, prototype.rollDamage, prototype.rollVolleyDamage, prototype.isCritical,
      prototype.clone, ItemClass._onChatCardAction, ItemClass._getChatCardActor].every(value => typeof value === "function")) {
      throw new Error("API de ataques do Ordem incompatível. Fluxo nativo preservado.");
    }
    const originalAttack = prototype.rollAttack, originalDamage = prototype.rollDamage, originalAction = ItemClass._onChatCardAction;
    this.adapter.configure({ rollAttack: originalAttack, rollDamage: originalDamage, rollVolleyDamage: prototype.rollVolleyDamage });
    this.bridge.install();
    const integration = this;
    prototype.rollAttack = function(options = {}) {
      const passed = options[USE_CONTEXT] as AttackUseContext | undefined;
      if (passed && integration.activeUses.has(passed)) return integration.dispatch(this, options, passed);
      if (getItemUseSettings().executionMode === "disabled" || !integration.attacks.available(this).length) return originalAttack.call(this, options);
      const previous = integration.directPending.get(this);
      if (previous) return previous;
      const pending = (async () => {
        const use = await integration.attacks.begin(null);
        integration.activeUses.add(use);
        try { return await integration.dispatch(this, { ...options, [USE_CONTEXT]: use }, use); }
        finally { integration.activeUses.delete(use); }
      })();
      integration.directPending.set(this, pending);
      void pending.finally(() => { integration.directPending.delete(this); }).catch(() => undefined);
      return pending;
    };
    prototype.rollDamage = async function(options = {}) {
      const id = options.hitResult?.attackMessageId ?? options.attackMessageId;
      const message = id ? await resolveAttackMessage(id) : null;
      if (message?.getFlag(MODULE_ID, ATTACK_EXECUTION_FLAG) !== undefined) return integration.damage.execute(this, options);
      return originalDamage.call(this, options);
    };
    ItemClass._onChatCardAction = async function(event) {
      const button = (event.target as Element | null)?.closest<HTMLButtonElement>("button[data-action]");
      const card = button?.closest(".chat-card"), id = card?.closest<HTMLElement>("[data-message-id]")?.dataset.messageId;
      const message = id ? await resolveAttackMessage(id) : null;
      if (!button || !card || !message || !["attack", "damage"].includes(button.dataset.action ?? "")) return originalAction.call(this, event);
      const actor = await ItemClass._getChatCardActor(card);
      const itemId = (card as HTMLElement).dataset.itemId;
      const stored = message.getFlag("ordemparanormal", "itemData");
      const item = actor && (stored ? new ItemClass(stored, { parent: actor }) : integration.adapter.actorItems(actor)
        .find(entry => entry.id === itemId));
      if (!item) return originalAction.call(this, event);
      const managed = integration.attacks.hasManagedState(message);
      if (button.dataset.action === "attack" && (managed || getItemUseSettings().executionMode !== "disabled" && integration.attacks.available(item).length)) {
        event.preventDefault(); button.disabled = true;
        try { await integration.controller.attack(message, item, { event: event as unknown as { altKey?: boolean } }); }
        catch (cause) { reportAttackFailure(cause); }
        finally { button.disabled = false; }
        return;
      }
      if (button.dataset.action === "damage" && managed) {
        event.preventDefault(); button.disabled = true;
        try { await integration.controller.damageCard(message, item, button.dataset.toolkitAttackUseId ?? "",
          { event: event as unknown as { altKey?: boolean } }); }
        catch (cause) { reportAttackFailure(cause); }
        finally { button.disabled = false; }
        return;
      }
      return originalAction.call(this, event);
    };
    const render = (message: AttackMessage, html: unknown) => {
      const root = html instanceof HTMLElement ? html : (html as { 0?: unknown } | null)?.[0];
      if (root instanceof HTMLElement) this.controller.enhance(message, root);
    };
    Hooks.on("renderChatMessageHTML", render);
    Hooks.on(ORDEM_HOOKS.RENDER_CHAT_MESSAGE, render);
    Hooks.on("preUpdateChatMessage", (message: AttackMessage, changes: Record<string, unknown>) => this.allowNativeHitWrite(message, changes));
    Hooks.on("updateChatMessage", (message: AttackMessage, _changes: unknown, _options: unknown, userId: string) => {
      if (game.user?.id !== userId) return;
      const execution = this.attacks.cards.readExecution(message);
      const sourceId = execution?.snapshot.sourceMessageId;
      if (sourceId) void resolveAttackMessage(sourceId).then(async source => {
        if (source) await this.attacks.cards.refresh(source, execution.snapshot.useId);
      }).catch(error => console.warn("Paranormal Toolkit | Atualização do card de ataque", error));
    });
    ensureModuleStylesheet("styles/attack-modifiers.css");
    prototype.__paranormalToolkitAttackIntegration = true;
    this.registered = true;
  }
  private async dispatch(item: Item, options: NativeAttackOptions, use: AttackUseContext): Promise<NativeAttackResult> {
    if (this.adapter.expands(item, options)) {
      const result = await this.adapter.attack(item, options);
      return this.attacks.completeNativeResult(result, use);
    }
    return this.attacks.execute(item, options, use);
  }
  allowNativeHitWrite(message: AttackMessage, changes: Record<string, unknown>): boolean {
    const incoming = object(changes["flags.ordemparanormal.hitResult"] ?? this.adapter.readIncomingFlag(changes, "ordemparanormal", "hitResult"));
    if (!incoming) return true;
    const ids = [incoming.attackMessageId, ...(Array.isArray(incoming.attackResults) ? incoming.attackResults.map(entry => object(entry)?.attackMessageId) : [])];
    let identified = false;
    for (const id of ids) {
      if (typeof id !== "string" || id === message.id) continue;
      const attack = game.messages.get?.(id) as AttackMessage | undefined;
      if (attack?.getFlag(MODULE_ID, ATTACK_EXECUTION_FLAG) === undefined) continue;
      identified = true;
      const execution = this.attacks.cards.readExecution(attack);
      if (!execution || execution.snapshot.sourceMessageId !== message.id
        || this.attacks.cards.readBinding(message)?.activeUseId !== execution.snapshot.useId) return false;
    }
    return identified || message.getFlag(MODULE_ID, ATTACK_CARD_FLAG) === undefined;
  }
}
