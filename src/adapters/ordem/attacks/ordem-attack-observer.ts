import { AttackEventBus } from "../../../core/public-api/attack-event-bus";
import type { AttackTokenReference } from "../../../core/public-api/attack-event-types";
import type { WorkflowTargetReference } from "../../../core/workflow/workflow-target-reference";
import { object, type AttackMessage } from "../../../features/attack-modifiers/attack-card-state";
import type { NativeAttackItem, NativeAttackOptions, NativeAttackResult } from "./ordem-attack-adapter";

const OBSERVATION = Symbol("toolkitAttackObservation");
type Observation = { actionId: string; userId: string; published: Set<string> };
type PublishedMessage = AttackMessage & {
  speaker?: { scene?: string; token?: string; actor?: string };
  whisper?: readonly unknown[];
  blind?: boolean;
};

export class OrdemAttackObserver {
  private readonly scopes = new WeakSet<Observation>();

  constructor(private readonly events = new AttackEventBus()) {}

  options(options: NativeAttackOptions, actionId?: string): NativeAttackOptions {
    if (this.scope(options)) return options;
    const scope: Observation = {
      actionId: actionId ?? foundry.utils.randomID(), userId: game.user?.id ?? "", published: new Set(),
    };
    this.scopes.add(scope);
    return { ...options, [OBSERVATION]: scope };
  }

  async native(item: NativeAttackItem, options: NativeAttackOptions,
    run: (options: NativeAttackOptions) => Promise<NativeAttackResult>): Promise<NativeAttackResult> {
    const observed = this.options(options);
    const previousId = item.lastAttackMessageId;
    const itemName = item.name;
    const result = await run(observed);
    try {
      if (!result.roll || result.hitResult?.attackResults) return result;
      let id = result.hitResult?.attackMessageId;
      if (!id && item.lastAttackMessageId !== previousId) {
        const candidate = item.lastAttackMessageId ? game.messages.get?.(item.lastAttackMessageId) as PublishedMessage | undefined : undefined;
        if (candidate?.rolls?.some(roll => sameRoll(roll, result.roll!))) id = candidate.id;
      }
      const message = id ? game.messages.get?.(id) as PublishedMessage | undefined : undefined;
      if (!message) return result;
      const hit = object(message.getFlag("ordemparanormal", "hitResult"));
      const actorUuid = typeof hit?.actorUuid === "string" ? hit.actorUuid : null;
      const source = this.source(message, item);
      let target: AttackTokenReference | null = null;
      if (actorUuid && source) {
        if ("_forcedTarget" in observed) {
          const token = observed._forcedTarget;
          if (token?.actor?.uuid === actorUuid) target = reference(token, source.sceneId);
        } else {
          const matches = sceneTokens(source.sceneId).filter(token => token.actor?.uuid === actorUuid);
          if (matches.length === 1) target = reference(matches[0], source.sceneId);
        }
      }
      this.published(item, observed, message, target, itemName);
    } catch {
      // Observation must never change the native attack's outcome.
    }
    return result;
  }

  published(item: Item, options: NativeAttackOptions, message: PublishedMessage,
    target: WorkflowTargetReference | AttackTokenReference | null, itemName = item.name): void {
    try {
      const scope = this.scope(options);
      const flag = object(message.getFlag("ordemparanormal", "messageRoll"));
      if (!scope?.userId || item.type !== "armament" || !message.id || scope.published.has(message.id)
        || flag?.type !== "attack" || flag.itemUuid !== item.uuid) return;
      const source = this.source(message, item);
      const targetRef = target?.sceneId && target.tokenId && target.tokenUuid === `Scene.${target.sceneId}.Token.${target.tokenId}`
        ? { sceneId: target.sceneId, tokenId: target.tokenId, tokenUuid: target.tokenUuid, actorUuid: target.actorUuid } : null;
      scope.published.add(message.id);
      this.events.emitPublished({
        version: 1, actionId: scope.actionId, messageId: message.id, userId: scope.userId,
        item: { uuid: item.uuid, name: itemName, type: "armament" }, source, target: targetRef,
        visibility: message.blind || message.whisper?.length ? "private" : "public",
      });
    } catch {
      // Publication and resource accounting have already succeeded independently.
    }
  }

  private scope(options: NativeAttackOptions): Observation | null {
    const scope = options[OBSERVATION] as Observation | undefined;
    return scope && this.scopes.has(scope) ? scope : null;
  }

  private source(message: PublishedMessage, item: Item): AttackTokenReference | null {
    const speaker = message.speaker;
    const actor = item.actor ?? item.parent;
    if (!speaker?.scene || !speaker.token || !actor) return null;
    const token = sceneTokens(speaker.scene).find(entry => (entry.document?.id ?? entry.id) === speaker.token);
    return token && token.actor?.uuid === actor.uuid ? reference(token, speaker.scene) : null;
  }
}

function sceneTokens(sceneId: string): TokenLike[] {
  return typeof canvas !== "undefined" && canvas?.scene?.id === sceneId ? canvas.tokens?.placeables ?? [] : [];
}

function reference(token: TokenLike, sceneId: string): AttackTokenReference | null {
  const tokenId = token.document?.id ?? token.id;
  if (!tokenId || token.scene?.id !== sceneId) return null;
  return { sceneId, tokenId, tokenUuid: `Scene.${sceneId}.Token.${tokenId}`, actorUuid: token.actor?.uuid ?? null };
}

function sameRoll(left: Roll, right: Roll): boolean {
  if (left === right) return true;
  const serializable = (roll: Roll) => (roll as Roll & { toJSON?: () => unknown }).toJSON?.();
  const data = serializable(left), expected = serializable(right);
  return data !== undefined && expected !== undefined && JSON.stringify(data) === JSON.stringify(expected);
}
