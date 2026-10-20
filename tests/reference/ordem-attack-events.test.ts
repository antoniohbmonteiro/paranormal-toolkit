import { afterEach, describe, expect, it, vi } from "vitest";
import { PARANORMAL_TOOLKIT_HOOKS } from "../../src/core/public-api/paranormal-toolkit-hooks";
import type { AttackPublishedEvent } from "../../src/core/public-api/attack-event-types";
import { createAttackReference } from "./helpers/attack-reference";

const root = process.env.PARANORMAL_TOOLKIT_ORDEM_REFERENCE;
afterEach(() => vi.unstubAllGlobals());

async function fixture(settings: Parameters<typeof createAttackReference>[1] = {}) {
  const h = await createAttackReference(root!, settings);
  const events: AttackPublishedEvent[] = [];
  h.Hooks.on(PARANORMAL_TOOLKIT_HOOKS.attack.published, event => events.push(event));
  return { ...h, events };
}

describe.skipIf(!root)("published attack events with real OrdemItem methods", () => {
  it("publishes managed snapshots only after the attack message exists", async () => {
    const h = await fixture();
    h.Hooks.on(PARANORMAL_TOOLKIT_HOOKS.attack.published, event => {
      expect(h.messages.get(event.messageId)).toBeDefined();
    });
    expect(h.events).toEqual([]);
    await h.invoke("attack");
    expect(h.events).toHaveLength(1);
    expect(h.events[0]).toEqual({
      version: 1, actionId: h.cards.readBinding(h.source)!.activeUseId,
      messageId: h.attackMessages()[0].id, userId: "player", visibility: "public",
      item: { uuid: h.weapon.uuid, name: "Fuzil", type: "armament" },
      source: { sceneId: "scene", tokenId: "source", tokenUuid: "Scene.scene.Token.source", actorUuid: h.actor.uuid },
      target: { sceneId: "scene", tokenId: "token0", tokenUuid: "Scene.scene.Token.token0", actorUuid: h.targets[0].actor.uuid },
    });
    expect(JSON.parse(JSON.stringify(h.events[0]))).toEqual(h.events[0]);
    const count = h.events.length;
    await h.invoke("damage");
    expect(h.events).toHaveLength(count);
  });

  it.each([{}, { executionMode: "disabled" }])("observes ordinary native attacks without configuring or spending: %j", async settings => {
    const h = await fixture({ ...settings, bound: false });
    const result = await h.weapon.rollAttack();
    expect(result.roll).toBeTruthy();
    expect(h.request).not.toHaveBeenCalled();
    expect(h.actor.system.PE.value).toBe(20);
    expect(h.events).toHaveLength(1);
    expect(h.events[0].target?.tokenId).toBe("token0");
  });

  it.each([true, false])("shares an action across recursion and never republishes the aggregate, managed=%s", async bound => {
    const h = await fixture({ attacks: 3, targeted: 3, bound });
    await h.weapon.rollAttack();
    expect(h.events).toHaveLength(3);
    expect(new Set(h.events.map(event => event.actionId)).size).toBe(1);
    expect(new Set(h.events.map(event => event.messageId)).size).toBe(3);
    expect(h.events.map(event => event.target?.tokenId)).toEqual(["token0", "token1", "token2"]);
    await h.weapon.rollAttack();
    expect(h.events).toHaveLength(6);
    expect(new Set(h.events.map(event => event.actionId)).size).toBe(2);
  });

  it("preserves forced targets when several tokens share the same linked actor", async () => {
    const h = await fixture({ bound: false });
    const duplicate = { ...h.targets[0], id: "duplicate" };
    h.canvas.tokens.placeables.push(duplicate);
    await h.weapon.rollAttack({ _forcedTarget: duplicate });
    expect(h.events[0].target?.tokenId).toBe("duplicate");
    await h.weapon.rollAttack();
    expect(h.events[1].target).toBeNull();
  });

  it("does not consult current targeting to resolve the published native actor", async () => {
    const h = await fixture({ bound: false });
    const create = h.ChatMessage.create.getMockImplementation()!;
    h.ChatMessage.create.mockImplementation(async (...args) => {
      h.game.user.targets.clear(); h.game.user.targets.add(h.targets[1]);
      return create(...args);
    });
    await h.weapon.rollAttack();
    expect(h.events[0].target?.tokenId).toBe("token0");
  });

  it.each([true, false])("emits null targets for confirmed untargeted messages, managed=%s", async bound => {
    const h = await fixture({ bound, targeted: 0 });
    await h.weapon.rollAttack();
    expect(h.events).toHaveLength(1);
    expect(h.events[0].target).toBeNull();
  });

  it("preserves synthetic actor and token identities", async () => {
    const h = await fixture({ bound: false });
    Object.defineProperty(h.targets[0].actor, "uuid", { value: "Scene.scene.Token.token0.Actor.target0" });
    await h.weapon.rollAttack({ _forcedTarget: h.targets[0] });
    expect(h.events[0].target?.actorUuid).toBe("Scene.scene.Token.token0.Actor.target0");
  });

  it.each(["gmroll", "blindroll", "selfroll"])("classifies final native visibility for %s", async rollMode => {
    const h = await fixture({ bound: false, rollMode });
    await h.weapon.rollAttack();
    expect(h.events[0].visibility).toBe("private");
  });

  it("uses the executing GM identity", async () => {
    const h = await fixture({ bound: false });
    Object.assign(h.game.user, { id: "gm", isGM: true }); h.game.userId = "gm";
    await h.weapon.rollAttack();
    expect(h.events[0].userId).toBe("gm");
  });

  it("omits the source when the speaker token belongs to a different actor", async () => {
    const h = await fixture();
    h.sourceToken.actor = h.targets[1].actor;
    await h.weapon.rollAttack();
    expect(h.events[0].source).toBeNull();
  });

  it("ignores cancelled, vetoed and uncertain attacks", async () => {
    for (const failure of ["cancel", "veto", "uncertain"] as const) {
      const h = await fixture({ choices: failure === "cancel" ? [null] : undefined });
      h.publication.veto = failure === "veto";
      h.publication.failAttack = failure === "uncertain";
      await h.invoke("attack");
      expect(h.events).toEqual([]);
    }
  });

  it("keeps the event when auxiliary card bookkeeping fails after publication", async () => {
    const h = await fixture();
    const link = h.cards.link.bind(h.cards);
    vi.spyOn(h.cards, "link").mockImplementation(async (source, useId, entry) => {
      if (entry.state === "published") throw new Error("card failed");
      return link(source, useId, entry);
    });
    await expect(h.weapon.rollAttack()).rejects.toThrow("card failed");
    expect(h.events).toHaveLength(1);
  });

  it("shares the pending direct call without emitting twice", async () => {
    const h = await fixture();
    const a = h.weapon.rollAttack(), b = h.weapon.rollAttack();
    expect(a).toBe(b);
    await Promise.all([a, b]);
    expect(h.events).toHaveLength(1);
  });
});
