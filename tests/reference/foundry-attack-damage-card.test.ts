import { afterEach, describe, expect, it, vi } from "vitest";
import { MODULE_ID } from "../../src/constants";
import { createAttackReference, loadAttackReference } from "./helpers/attack-reference";

const ordemRoot = process.env.PARANORMAL_TOOLKIT_ORDEM_REFERENCE;
const foundryRoot = process.env.PARANORMAL_TOOLKIT_FOUNDRY_REFERENCE;
afterEach(() => vi.unstubAllGlobals());

// Only the chat DOM is doubled; rolls, damage application and the user collection use the real sources.
function messageRoot(attackButton?: unknown) {
  return new class extends HTMLElement {
    summary = "";
    clickHandler?: (event: any) => void;
    querySelector(selector: string): any {
      if (selector === ".message-content") return this;
      if (selector === '.chat-card button[data-action="attack"]') return attackButton ?? null;
      if (selector === "[data-toolkit-attack-summary]" && this.summary) return { remove: () => { this.summary = ""; } };
      return null;
    }
    insertAdjacentHTML(_position: string, markup: string) { this.summary += markup; }
    addEventListener(_type: string, callback: any) { this.clickHandler = callback; }
    removeEventListener(_type: string, callback: any) { if (this.clickHandler === callback) this.clickHandler = undefined; }
  }();
}

function useNativeUsers(harness: Awaited<ReturnType<typeof createAttackReference>>) {
  const { default: Collection } = loadAttackReference(foundryRoot!, "common/utils/collection.mjs", {});
  harness.game.users = new Collection(harness.users.map(user => [user.id, user]));
  expect(harness.game.users.flatMap).toBeUndefined();
}

describe.skipIf(!ordemRoot || !foundryRoot)("damage card with native Foundry user collection", () => {
  it("restores the native attack listener on an existing card without presets after startup", async () => {
    const h = await createAttackReference(ordemRoot!, { bound: false, choices: [null] });
    const card = { dataset: { actorId: h.actor.id, itemId: h.weapon.id }, classList: { contains: () => false }, closest: () => root };
    const button = { dataset: { action: "attack" }, disabled: false,
      closest: (selector: string): unknown => selector === ".chat-card" ? card : button };
    const root = messageRoot(button);
    (root as any).dataset = { messageId: h.source.id };
    const listen = vi.spyOn(root, "addEventListener"), remove = vi.spyOn(root, "removeEventListener");
    h.integration.rehydrateRenderedMessages([root]);
    h.integration.rehydrateRenderedMessages([root]);
    expect(listen).toHaveBeenCalledTimes(2); expect(remove).toHaveBeenCalledOnce();
    root.clickHandler!({ target: button, preventDefault() {} });
    await vi.waitFor(() => expect(h.cards.readBinding(h.source)?.executions[0]?.state).toBe("cancelled"));
    expect(h.request).toHaveBeenCalledOnce(); expect(h.request.mock.calls[0][0].available).toEqual([]);
    expect(h.attackMessages()).toHaveLength(0); expect(h.actor.system.PE.value).toBe(20);
  });
  it("rehydrates messages already rendered before hook registration without duplicating listeners", async () => {
    const h = await createAttackReference(ordemRoot!);
    await h.invoke("attack"); await h.invoke("damage"); useNativeUsers(h); h.game.user = h.users[0];
    const message = h.damageMessages()[0], root = messageRoot();
    (root as any).dataset = { messageId: message.id };
    const listen = vi.spyOn(root, "addEventListener");
    const documentWithMessages = { ...document, querySelectorAll: () => [root] };
    vi.stubGlobal("document", documentWithMessages);
    h.integration.rehydrateRenderedMessages();
    expect(root.summary).toContain("Aplicar ao alvo original");
    const handler = root.clickHandler;
    h.integration.rehydrateRenderedMessages();
    expect(root.summary.match(/data-toolkit-attack-action="apply"/g)).toHaveLength(1);
    expect(root.clickHandler).toBe(handler); expect(listen).toHaveBeenCalledOnce();
  });
  it("renders the GM apply action, applies penetration to the original target and stays applied after rerender", async () => {
    const h = await createAttackReference(ordemRoot!);
    await h.invoke("attack"); await h.invoke("damage");
    useNativeUsers(h); h.game.user = h.users[0];
    const message = h.damageMessages()[0], root = messageRoot();
    expect(message.getFlag("ordemparanormal", "damageTarget")).toBeUndefined();
    Hooks.callAll("renderChatMessageHTML", message, root);
    expect(root.summary).toContain("Dano do ataque");
    expect(root.summary).toContain("Aplicar ao alvo original");
    expect(root.summary).toContain('data-toolkit-attack-action="apply">');
    Hooks.callAll("ordemparanormal.renderChatMessage", message, root);
    expect(root.summary.match(/data-toolkit-attack-action="apply"/g)).toHaveLength(1);
    h.game.user.targets = new Set([h.targets[1]]);
    const button = { disabled: false, dataset: { toolkitAttackAction: "apply" } };
    const event = { target: { closest: () => button }, preventDefault() {}, stopPropagation() {} };
    root.clickHandler!(event); root.clickHandler!(event);
    await vi.waitFor(() => expect(h.cards.readDamage(message)?.application.state).toBe("completed"));
    expect(h.targets[0].actor.system.attributes.hp.value).toBe(73);
    expect(h.targets[1].actor.system.attributes.hp.value).toBe(100);
    expect(h.damageMessages()).toHaveLength(1);
    Hooks.callAll("renderChatMessageHTML", message, root);
    expect(root.summary).toContain('data-toolkit-attack-action="apply" disabled');
    expect(root.summary).toContain("Dano aplicado");
  });

  it("keeps the apply action GM-only and disables it for another GM", async () => {
    const h = await createAttackReference(ordemRoot!);
    await h.invoke("attack"); await h.invoke("damage"); useNativeUsers(h);
    const message = h.damageMessages()[0], root = messageRoot();
    Hooks.callAll("renderChatMessageHTML", message, root);
    expect(root.summary).toContain("Dano do ataque");
    expect(root.summary).not.toContain('data-toolkit-attack-action="apply"');
    const otherGm = { id: "gm2", isGM: true, active: true };
    h.game.users.set(otherGm.id, otherGm); h.game.user = otherGm;
    Hooks.callAll("renderChatMessageHTML", message, root);
    expect(root.summary).toContain('data-toolkit-attack-action="apply" disabled');
    expect(root.summary).toContain("Mestre executor conectado");
    await expect(h.assisted.apply(message)).rejects.toThrow("Mestre executor");
    expect(h.targets[0].actor.system.attributes.hp.value).toBe(100);
  });

  it.each(["untargeted", "mixed"])("keeps %s damage manual", async mode => {
    const h = await createAttackReference(ordemRoot!, { targeted: mode === "untargeted" ? 0 : 1 });
    if (mode === "mixed") h.weapon.system.formulas.damage.parts = [["1d6", "fireDamage"]];
    await h.invoke("attack"); await h.invoke("damage"); useNativeUsers(h); h.game.user = h.users[0];
    const message = h.damageMessages()[0], root = messageRoot();
    Hooks.callAll("renderChatMessageHTML", message, root);
    expect(root.summary).toContain("Aplicação manual");
    expect(root.summary).not.toContain('data-toolkit-attack-action="apply"');
    expect(h.cards.readDamage(message)?.application.state).toBe("available");
    expect(message.getFlag(MODULE_ID, "attackDamage")).toBeTruthy();
  });
});
